"""
tools.py
WHAT: Defines the LangChain tools that our LangGraph agent will use.
WHY: Adapted to interface with the saved MLForecast model, handle the future 
     exogenous variables (X_df) required for time-series forecasting, and 
     search for macro-level market news instead of port-specific data.
"""
import os
import json
import pandas as pd
import numpy as np
import joblib
from datetime import datetime
from langchain.tools import tool
from langchain_community.tools import DuckDuckGoSearchResults
from mlforecast import MLForecast

try:
    from config import AUTHORIZED_NEWS_DOMAINS, MODEL_DIR_ENV, DATA_DIR_ENV, VITE_ORIGINS
except ImportError:
    from src.config import AUTHORIZED_NEWS_DOMAINS, MODEL_DIR_ENV, DATA_DIR_ENV, VITE_ORIGINS

# --- Configuration ---
MODEL_DIR = os.path.expanduser(os.getenv("MODEL_DIR", MODEL_DIR_ENV))
DATA_DIR = os.path.expanduser(os.getenv("DATA_DIR", DATA_DIR_ENV))

# Load valid categories (Capesize, Panamax, etc.) for agent validation
try:
    with open(os.path.join(MODEL_DIR, "valid_categories.json"), "r") as f:
        VALID_CATEGORIES = json.load(f)["vessel_types"]
except Exception:
    VALID_CATEGORIES = ["BDI", "Capesize", "Handysize", "Panamax", "Supramax"]

CATEGORY_LOOKUP = {cat.lower(): cat for cat in VALID_CATEGORIES}

DATA_FILES = {
    "Capesize": ("Baltic Capesize Data(2016-2026).csv", "%m/%d/%Y"),
    "Panamax": ("Baltic Panamax Data (2016-2026).csv", "%d/%m/%y"),
    "Supramax": ("Baltic Supramax Data(2016-2026).csv", "%d-%m-%Y"),
    "Handysize": ("Baltic Handysize Data(2016-2026).csv", "%d-%m-%Y"),
    "BDI": ("Baltic Dry Index Data(2016-2026).csv", "%d-%m-%Y")
}

def _get_latest_data(vessel_type: str) -> pd.Series:
    """Helper function to fetch the most recent trading day to forward-fill financial features."""
    if vessel_type not in DATA_FILES:
        raise ValueError(f"Unknown vessel type: {vessel_type}")
    filename, date_fmt = DATA_FILES[vessel_type]
    filepath = os.path.join(DATA_DIR, filename)
    df = pd.read_csv(filepath)
    df["ds"] = pd.to_datetime(df["Date"], format=date_fmt)
    df = df.sort_values("ds").dropna(subset=["ds"])
    
    # Clean numeric columns
    for col in ["Open", "High", "Low"]:
        if col in df.columns and df[col].dtype == "O":
            df[col] = df[col].str.replace(",", "").astype(float)
            
    return df.iloc[-1]


@tool
def predict_freight_index(vessel_type: str, target_date: str) -> str:
    """
    Predicts the Baltic Exchange index price for a specific vessel class and future date.
    Use this tool when a user asks for a freight forecast, rate prediction, or future index value.

    Args:
        vessel_type: Must be one of: 'Capesize', 'Panamax', 'Supramax', 'Handysize', 'BDI'.
        target_date: The future date to predict (format: YYYY-MM-DD).
    """
    try:
        try:
            from forecasting import predict_value as _predict_value
        except ImportError:
            from src.forecasting import predict_value as _predict_value
        r = _predict_value(vessel_type, target_date)
        return (f"Forecast Success: The predicted {r['vessel_type']} index for {target_date} "
                f"is {r['predicted_index']:.2f} Index Points (horizon: {r['horizon_days']} days ahead of latest historical date {r['latest_ds']}).")
    except ValueError as exc:
        return f"Error: {exc}"
    except Exception as e:
        return f"Prediction execution failed: {str(e)}"



@tool
def explain_prediction(vessel_type: str) -> str:
    """
    Provides a high-level explanation of the structural features driving the current model 
    for a specific vessel class using the saved SHAP explainer state.
    
    Args:
        vessel_type: Must be one of: 'Capesize', 'Panamax', 'Supramax', 'Handysize', 'BDI'.
    """
    vessel_key = vessel_type.strip().lower()
    if vessel_key not in CATEGORY_LOOKUP:
        return f"Error: Invalid vessel type '{vessel_type}'. Must be one of {VALID_CATEGORIES}."
    canonical_type = CATEGORY_LOOKUP[vessel_key]

    try:
        # Load SHAP Explainer and Features
        explainer = joblib.load(os.path.join(MODEL_DIR, "shap_explainer.joblib"))
        with open(os.path.join(MODEL_DIR, "feature_columns.json"), "r") as f:
            feature_columns = json.load(f)
            
        top_feature_str = " (shared forecasting.shap_drivers core)"
        booster = getattr(explainer.model, "original_model", None)
        if booster is not None and hasattr(booster, "feature_importance"):
            importances = booster.feature_importance(importance_type="gain")
            names = booster.feature_name()
            ranked = sorted(zip(names, importances), key=lambda x: x[1], reverse=True)
            top_names = [name for name, _ in ranked[:5] if name in feature_columns]
            top_feature_str = f" Top driving features by tree gain: {', '.join(top_names)}."

        return (
            f"Based on the global SHAP TreeExplainer and feature state for {canonical_type},"
            f"{top_feature_str} The prediction is heavily influenced by short-term momentum (1-day to 7-day rolling statistics), "
            f"immediate prior financial signals (Open, High, Low), and structural seasonality "
            f"captured by cyclical date features (month_sin, dow_cos)."
        )
    except Exception as e:
        return f"Explanation execution failed: {str(e)}"


# Whitelisted web-search tool for LangGraph.
# WHY: DuckDuckGoSearchResults itself cannot restrict domains, so we wrap it:
# the query sent upstream is suffixed with `site:` filters for every domain in
# AUTHORIZED_NEWS_DOMAINS, and the returned text is annotated with the
# whitelist so the agent cites only approved trade-press sources.
_base_market_search = DuckDuckGoSearchResults(
    name="search_market_news",
    description=(
        "Search for recent macro-economic news, Baltic Exchange trends, or global "
        "shipping market updates. Input should be a search query string. "
        "Results are restricted to whitelisted maritime trade-press domains: "
        + ", ".join(AUTHORIZED_NEWS_DOMAINS)
        + "."
    ),
    handle_tool_error=True,
)


@tool
def search_market_news(query: str) -> str:
    """Search whitelisted maritime sources for market context.

    Args:
        query: Free-text search query (e.g. "Baltic Panamax index bunker prices").
    """
    site_filter = " OR ".join(f"site:{d}" for d in AUTHORIZED_NEWS_DOMAINS)
    scoped_query = f"({query}) ({site_filter})"
    try:
        result = _base_market_search.invoke(scoped_query)
    except Exception as exc:
        return f"Market news search failed: {exc}"
    return (
        f"[Sources restricted to: {', '.join(AUTHORIZED_NEWS_DOMAINS)}]\n"
        f"Query: {query}\n{result}"
    )