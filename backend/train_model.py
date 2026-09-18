"""
train_model.py
WHAT: Loads the 5 Baltic Exchange CSV datasets, cleans financial signals, 
      engineers time-series features (lags, rolling stats, cyclical date encodings),
      trains a LightGBM regressor via MLForecast, and serializes both the model 
      and a SHAP explainer.
WHY:  Adapted for macro-level market indices rather than point-to-point shipments.
      Bypasses categorical target encoding since we rely purely on financial 
      momentum and index trends.
"""
import pandas as pd
import numpy as np
import lightgbm as lgb
from mlforecast import MLForecast
from sklearn.metrics import mean_absolute_error
import joblib
import shap
import json
import os
import glob
from mlforecast.lag_transforms import RollingMean, RollingStd

# --- Configuration ---
DATA_DIR = os.path.expanduser("~/freight_forecast/data")
MODEL_DIR = os.path.expanduser("~/freight_forecast/models")
os.makedirs(MODEL_DIR, exist_ok=True)

# Map human-readable vessel/index names to their corresponding CSV files and date formats
DATA_FILES = {
    "Capesize": ("Baltic Capesize Data(2016-2026).csv", "%m/%d/%Y"),
    "Panamax": ("Baltic Panamax Data (2016-2026).csv", "%d/%m/%y"),
    "Supramax": ("Baltic Supramax Data(2016-2026).csv", "%d-%m-%Y"),
    "Handysize": ("Baltic Handysize Data(2016-2026).csv", "%d-%m-%Y"),
    "BDI": ("Baltic Dry Index Data(2016-2026).csv", "%d-%m-%Y")
}

def load_and_clean_data() -> pd.DataFrame:
    """Loads all Baltic datasets, standardizes schema, and handles numeric casting and non-trading days."""
    dfs = []
    for vessel_type, (filename, date_fmt) in DATA_FILES.items():
        filepath = os.path.join(DATA_DIR, filename)
        if not os.path.exists(filepath):
            print(f"Warning: {filepath} not found. Skipping {vessel_type}.")
            continue
            
        df = pd.read_csv(filepath)
        df["unique_id"] = vessel_type
        
        # Parse date with explicit format for each dataset to prevent day/month ambiguity
        df["ds"] = pd.to_datetime(df["Date"], format=date_fmt)
        
        # Clean comma-separated numeric strings if they exist
        if df["Price"].dtype == "O":
            df["y"] = df["Price"].str.replace(",", "").astype(float)
        else:
            df["y"] = df["Price"].astype(float)
            
        # Clean financial exogenous features
        for col in ["Open", "High", "Low"]:
            if col in df.columns:
                if df[col].dtype == "O":
                    df[col] = df[col].str.replace(",", "").astype(float)
                else:
                    df[col] = df[col].astype(float)
        
        dfs.append(df[["unique_id", "ds", "y", "Open", "High", "Low"]])
        
    combined_df = pd.concat(dfs, ignore_index=True)
    combined_df = combined_df.dropna(subset=["ds", "y"])

    # Calendar handling: Reindex to daily continuous timeline (freq="D") for each vessel class
    # Forward-fill and backward-fill price and financial indicators across weekends & holidays
    reindexed_dfs = []
    for vessel_type, group in combined_df.groupby("unique_id"):
        group = group.sort_values("ds").drop_duplicates(subset=["ds"]).set_index("ds")
        full_date_idx = pd.date_range(start=group.index.min(), end=group.index.max(), freq="D")
        group_daily = group.reindex(full_date_idx)
        group_daily["unique_id"] = vessel_type
        group_daily[["y", "Open", "High", "Low"]] = (
            group_daily[["y", "Open", "High", "Low"]].ffill().bfill()
        )
        group_daily = group_daily.reset_index().rename(columns={"index": "ds"})
        reindexed_dfs.append(group_daily)

    daily_df = pd.concat(reindexed_dfs, ignore_index=True)
    daily_df = daily_df.sort_values(["unique_id", "ds"]).reset_index(drop=True)
    return daily_df

def main():
    print("Loading and cleaning Baltic Exchange data...")
    df = load_and_clean_data()
    
    # --- Cyclical date encodings ---
    # WHY: Models native seasonality (e.g., Q1 weak demand, Q4 peak demand) without 
    # relying on linear distance between month 12 and month 1.
    df["month_sin"] = np.sin(2 * np.pi * df["ds"].dt.month / 12)
    df["month_cos"] = np.cos(2 * np.pi * df["ds"].dt.month / 12)
    df["dow_sin"] = np.sin(2 * np.pi * df["ds"].dt.dayofweek / 7)
    df["dow_cos"] = np.cos(2 * np.pi * df["ds"].dt.dayofweek / 7)

    # Validate that we have valid unique IDs
    valid_ids = sorted(df["unique_id"].unique().tolist())
    with open(os.path.join(MODEL_DIR, "valid_categories.json"), "w") as f:
        json.dump({"vessel_types": valid_ids}, f, indent=2)

    # --- Configure MLForecast ---
    # We remove target_transforms (like Differences) here since index values can go negative 
    # (e.g., Capesize in Q1/Q2 2020) and we are tracking direct index pricing.
    model = lgb.LGBMRegressor(
        n_estimators=500,
        learning_rate=0.03,
        max_depth=7,
        num_leaves=31,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        n_jobs=-1
    )

    fcst = MLForecast(
        models=[model],
        freq="D",
        lags=[1, 7, 14, 30],
        lag_transforms={
            1: [RollingMean(window_size=7), RollingStd(window_size=7)],
            7: [RollingMean(window_size=14)],
        },
    )

    # Any columns not defined as unique_id, ds, y, or static_features will be treated 
    # as dynamic exogenous features by MLForecast.
    exog_features = ["Open", "High", "Low", "month_sin", "month_cos", "dow_sin", "dow_cos"]
    
    print("Executing Time-Based Split & Validation across vessel classes...")
    # Time-based split: hold out the last 30 days for each vessel class
    train_splits = []
    test_splits = []
    for vessel_type, group in df.groupby("unique_id"):
        cutoff = group["ds"].max() - pd.Timedelta(days=30)
        train_splits.append(group[group["ds"] <= cutoff])
        test_splits.append(group[group["ds"] > cutoff])

    train_df = pd.concat(train_splits, ignore_index=True)
    test_df = pd.concat(test_splits, ignore_index=True)

    # Fit validation model with empty static_features to ensure exogs are treated dynamically
    fcst.fit(train_df, id_col="unique_id", time_col="ds", target_col="y", static_features=[])
    
    # Predict and evaluate per vessel class
    val_maes = []
    for vessel_type in valid_ids:
        vessel_test = test_df[test_df["unique_id"] == vessel_type]
        if vessel_test.empty:
            continue
        h = len(vessel_test)
        X_df_val = vessel_test[["unique_id", "ds"] + exog_features].copy()
        try:
            preds = fcst.predict(h=h, X_df=X_df_val, ids=[vessel_type])
            merged = preds.merge(vessel_test[["unique_id", "ds", "y"]], on=["unique_id", "ds"], how="inner")
            if len(merged) > 0:
                vessel_mae = mean_absolute_error(merged["y"], merged["LGBMRegressor"])
                val_maes.append(vessel_mae)
                print(f"Validation MAE for {vessel_type:10}: {vessel_mae:.2f} Index Points")
        except Exception as e:
            print(f"Validation prediction for {vessel_type} skipped: {e}")

    if val_maes:
        print(f"Overall Mean Validation MAE: {np.mean(val_maes):.2f} Index Points")

    # --- Refit on FULL data for production ---
    print("Refitting model on entire historical dataset...")
    fcst.fit(df, id_col="unique_id", time_col="ds", target_col="y", static_features=[])
    
    # Save the MLForecast wrapper
    fcst.save(os.path.join(MODEL_DIR, "mlforecast_model"))

    # Extract and save the raw LightGBM booster for SHAP Explainer
    raw_booster = fcst.models_["LGBMRegressor"]
    joblib.dump(raw_booster, os.path.join(MODEL_DIR, "raw_booster.joblib"))

    # --- Build SHAP Explainer ---
    # Recreate the exact feature dataframe passed to the tree for column ordering
    processed_train = fcst.preprocess(df, id_col="unique_id", time_col="ds", target_col="y", static_features=[])
    feature_columns = [col for col in processed_train.columns if col not in ["unique_id", "ds", "y"]]
    
    explainer = shap.TreeExplainer(raw_booster)
    joblib.dump(explainer, os.path.join(MODEL_DIR, "shap_explainer.joblib"))
    
    with open(os.path.join(MODEL_DIR, "feature_columns.json"), "w") as f:
        json.dump(feature_columns, f, indent=2)
        
    print(f"Success! Model, metadata, and SHAP explainer saved to {MODEL_DIR}")

if __name__ == "__main__":
    main()