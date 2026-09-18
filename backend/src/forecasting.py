"""
forecasting.py
WHAT: Pure (non-LangChain) access to Baltic LightGBM/SHAP artifacts + CSVs.
WHY: tools.py wraps these in @tool for the agent; main.py exposes them as
     structured JSON so every chart sub-page renders live model output.
"""
import json
import os
from datetime import datetime
from functools import lru_cache
import joblib
import numpy as np
import pandas as pd
from mlforecast import MLForecast
try:
    from config import MODEL_DIR_ENV, DATA_DIR_ENV
except ImportError:
    from src.config import MODEL_DIR_ENV, DATA_DIR_ENV
MODEL_DIR = os.path.expanduser(os.getenv("MODEL_DIR", MODEL_DIR_ENV))
DATA_DIR = os.path.expanduser(os.getenv("DATA_DIR", DATA_DIR_ENV))
try:
    _VC_PATH = os.path.join(MODEL_DIR, "valid_categories.json")
    _f = open(_VC_PATH, "r")
    VALID_CATEGORIES = json.load(_f)["vessel_types"]
    _f.close()
except Exception:
    VALID_CATEGORIES = ["BDI", "Capesize", "Handysize", "Panamax", "Supramax"]
CATEGORY_LOOKUP = {}
for _c in VALID_CATEGORIES:
    CATEGORY_LOOKUP[_c.lower()] = _c
DATA_FILES = {
    "Capesize": ("Baltic Capesize Data(2016-2026).csv", "%m/%d/%Y"),
    "Panamax": ("Baltic Panamax Data (2016-2026).csv", "%d/%m/%y"),
    "Supramax": ("Baltic Supramax Data(2016-2026).csv", "%d-%m-%Y"),
    "Handysize": ("Baltic Handysize Data(2016-2026).csv", "%d-%m-%Y"),
    "BDI": ("Baltic Dry Index Data(2016-2026).csv", "%d-%m-%Y"),
}
def canonical_vessel(vessel_type):
    key = (vessel_type or "").strip().lower()
    if key not in CATEGORY_LOOKUP:
        raise ValueError("Invalid vessel_type")
    return CATEGORY_LOOKUP[key]
def clean_num(v):
    try:
        s = str(v).replace(",", "").replace("%", "").strip()
        return float(s)
    except Exception:
        return float("nan")
@lru_cache(maxsize=8)
def load_history_frame(canonical):
    fn, fmt = DATA_FILES[canonical]
    df = pd.read_csv(os.path.join(DATA_DIR, fn))
    df.columns = [c.strip() for c in df.columns]
    df["ds"] = pd.to_datetime(df["Date"], format=fmt, errors="coerce")
    for col in ["Price", "Open", "High", "Low"]:
        if col in df.columns:
            df[col] = df[col].map(clean_num)
    df = df.dropna(subset=["ds", "Price"])
    df = df.sort_values("ds").drop_duplicates(subset=["ds"])
    df["y"] = df["Price"].astype(float)
    for col in ["Open", "High", "Low"]:
        df[col] = df[col].fillna(df["y"])
    return df[["ds", "y", "Open", "High", "Low"]].reset_index(drop=True)
def get_history(vessel_type, limit=365):
    canonical = canonical_vessel(vessel_type)
    df = load_history_frame(canonical)
    n = max(1, min(int(limit), len(df)))
    tail = df.tail(n)
    pts = []
    for d, y, o, h, l in zip(tail["ds"], tail["y"], tail["Open"], tail["High"], tail["Low"]):
        pts.append({"ds": d.strftime("%Y-%m-%d"), "index": round(float(y), 2),
                    "open": round(float(o), 2), "high": round(float(h), 2), "low": round(float(l), 2)})
    return {"vessel_type": canonical, "count": len(pts), "latest_ds": pts[-1]["ds"],
            "latest_index": pts[-1]["index"], "points": pts}
def build_future_X(latest_y, latest_o, latest_h, latest_l, latest_dt, h, canonical):
    fut = pd.date_range(start=latest_dt + pd.Timedelta(days=1), periods=h, freq="D")
    return pd.DataFrame({
        "unique_id": [canonical] * h, "ds": fut,
        "Open": float(latest_o), "High": float(latest_h), "Low": float(latest_l),
        "month_sin": np.sin(2 * np.pi * fut.month / 12),
        "month_cos": np.cos(2 * np.pi * fut.month / 12),
        "dow_sin": np.sin(2 * np.pi * fut.dayofweek / 7),
        "dow_cos": np.cos(2 * np.pi * fut.dayofweek / 7)})
def forecast_series(vessel_type, start_date, end_date):
    canonical = canonical_vessel(vessel_type)
    df = load_history_frame(canonical)
    latest_dt = df["ds"].iloc[-1]
    latest_val = float(df["y"].iloc[-1])
    s = pd.to_datetime(start_date)
    e = pd.to_datetime(end_date)
    if pd.isna(s) or pd.isna(e) or e < s:
        raise ValueError("end_date must be on/after start_date (YYYY-MM-DD).")
    h_end = int((e - latest_dt).days)
    if h_end <= 0:
        raise ValueError("end_date must be after latest known date.")
    if h_end > 180:
        raise ValueError("Forecast horizon capped at 180 days.")
    fcst = MLForecast.load(os.path.join(MODEL_DIR, "mlforecast_model"))
    last = df.iloc[-1]
    X_df = build_future_X(float(last["y"]), float(last["Open"]), float(last["High"]),
                          float(last["Low"]), latest_dt, h_end, canonical)
    preds = fcst.predict(h=h_end, X_df=X_df, ids=[canonical])
    preds = preds.sort_values("ds")
    sel = preds[(preds["ds"] >= s) & (preds["ds"] <= e)]
    pts = []
    for d, v in zip(sel["ds"], sel["LGBMRegressor"]):
        pts.append({"ds": d.strftime("%Y-%m-%d"), "index": round(float(v), 2)})
    tgt = pts[-1]["index"] if pts else None
    return {"vessel_type": canonical, "latest_ds": latest_dt.strftime("%Y-%m-%d"),
            "latest_index": round(latest_val, 2), "points": pts,
            "target_index": tgt, "horizon_days": h_end}
def forecast_next(vessel_type, days=30):
    """Date-anchored forecast: latest_ds+1 .. latest_ds+days (clamped to 180).
    WHY: frontend must never anchor windows to wall-clock today (CSVs end
    2025-03; today-anchored windows exceed the 180d cap and always 400)."""
    from datetime import timedelta as _td
    canonical = canonical_vessel(vessel_type)
    df = load_history_frame(canonical)
    latest_dt = df["ds"].iloc[-1]
    n = max(1, min(int(days), 180))
    s = (latest_dt + _td(days=1)).strftime("%Y-%m-%d")
    e = (latest_dt + _td(days=n)).strftime("%Y-%m-%d")
    return forecast_series(canonical, s, e)


def predict_value(vessel_type, target_date):
    r = forecast_series(vessel_type, target_date, target_date)
    return {"vessel_type": r["vessel_type"], "target_date": target_date,
            "predicted_index": r["target_index"], "latest_ds": r["latest_ds"],
            "latest_index": r["latest_index"], "horizon_days": r["horizon_days"]}
@lru_cache(maxsize=8)
def shap_drivers(vessel_type):
    canonical = canonical_vessel(vessel_type)
    explainer = joblib.load(os.path.join(MODEL_DIR, "shap_explainer.joblib"))
    f = open(os.path.join(MODEL_DIR, "feature_columns.json"), "r")
    feature_columns = json.load(f)
    f.close()
    drivers = []
    inner = getattr(getattr(explainer, "model", None), "original_model", None)
    if inner is not None and hasattr(inner, "feature_importance"):
        imps = list(map(float, inner.feature_importance(importance_type="gain")))
        names = list(inner.feature_name())
        total = sum(imps) or 1.0
        ranked = sorted(zip(names, imps), key=lambda x: x[1], reverse=True)
        for name, imp in ranked:
            if name in feature_columns:
                drivers.append({"feature": name, "importance": round(imp, 2),
                                "weight": round(imp / total, 4)})
        drivers = drivers[:8]
    narrative = ("LightGBM gain: short-term momentum (lags/rolling stats), prior OHLC, "
                 "and cyclical seasonality drive the " + canonical + " forecast.")
    return {"vessel_type": canonical, "drivers": drivers, "narrative": narrative,
            "feature_columns": feature_columns}
def meta():
    latest = {}
    for v in VALID_CATEGORIES:
        try:
            df = load_history_frame(v)
            latest[v] = {"latest_ds": df["ds"].iloc[-1].strftime("%Y-%m-%d"),
                         "latest_index": round(float(df["y"].iloc[-1]), 2), "rows": len(df)}
        except Exception as exc:
            latest[v] = {"error": str(exc)}
    try:
        from config import AUTHORIZED_NEWS_DOMAINS
    except ImportError:
        from src.config import AUTHORIZED_NEWS_DOMAINS
    origins = ["Syama Prasad Mookerjee Port (Kolkata/Haldia)", "Paradip Port",
               "Visakhapatnam Port", "Chennai Port", "V.O. Chidambaranar Port (Tuticorin)"]
    dests = ["Port of Gdansk (DCT)", "Port of Gdynia", "Klaipeda Port",
             "Port of Helsinki (Vuosaari)", "Port of Hamburg (HHLA)"]
    return {"vessel_types": VALID_CATEGORIES, "latest": latest, "origins": origins,
            "destinations": dests, "news_domains": AUTHORIZED_NEWS_DOMAINS,
            "generated_at": datetime.utcnow().isoformat() + "Z"}
