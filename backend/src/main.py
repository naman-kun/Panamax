"""
main.py
WHAT: FastAPI application exposing the /forecast endpoint backed by the
      LangGraph ReAct agent (Gemini + LightGBM + SHAP + DuckDuckGo).
WHY:  Provides a single HTTP surface the Vite SPA can call; isolates all
      Python / ML dependencies behind a JSON API so the frontend stays
      purely TypeScript.
"""
import os
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from dotenv import load_dotenv

# Load .env before importing agent (agent reads GOOGLE_API_KEY on import)
load_dotenv()

try:
    from agent import build_app, format_message_content
except ImportError:
    from src.agent import build_app, format_message_content

try:
    from config import VITE_ORIGINS
except ImportError:
    from src.config import VITE_ORIGINS
try:
    import forecasting as forecasting
except ImportError:
    from src import forecasting

# ---------------------------------------------------------------------------
# Startup / Shutdown — build the LangGraph agent once and reuse it
# ---------------------------------------------------------------------------
_agent_app = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global _agent_app
    try:
        _agent_app = build_app()
        print("✅ LangGraph freight agent initialised.")
        try:
            import forecasting as _fc
        except ImportError:
            from src import forecasting as _fc
        print(f"   MODEL_DIR={_fc.MODEL_DIR} DATA_DIR={_fc.DATA_DIR}")
    except Exception as exc:
        print(f"⚠️  Agent initialisation failed: {exc}")
        _agent_app = None
    yield
    _agent_app = None


# ---------------------------------------------------------------------------
# FastAPI app + CORS
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Panamax Freight Intelligence API",
    description="LangGraph ReAct agent for maritime freight rate forecasting (India ↔ Baltic corridor).",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=VITE_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Request / Response schemas
# ---------------------------------------------------------------------------
class ForecastRequest(BaseModel):
    query_date: str = Field(
        ...,
        description="Target forecast date in YYYY-MM-DD format.",
        examples=["2026-10-01"],
    )
    vessel_type: str = Field(
        ...,
        description="Vessel class: Panamax, Capesize, Supramax, Handysize, or BDI.",
        examples=["Panamax"],
    )
    origin_port: str = Field(
        ...,
        description="East Coast Indian origin port name.",
        examples=["Visakhapatnam Port"],
    )
    destination_port: str = Field(
        ...,
        description="Baltic / Northern European destination port name.",
        examples=["Hamburg (Germany)"],
    )
    country: str = Field(
        ...,
        description="Origin country.",
        examples=["India"],
    )
    item: str = Field(
        ...,
        description="Cargo type / commodity description.",
        examples=["General Cargo"],
    )
    weight: float = Field(
        ...,
        description="Shipment quantity in metric tonnes.",
        examples=[75000],
    )

    @field_validator("query_date")
    @classmethod
    def _validate_query_date(cls, v: str) -> str:
        from datetime import datetime

        try:
            datetime.strptime(v, "%Y-%m-%d")
        except ValueError:
            raise ValueError("query_date must use YYYY-MM-DD format.")
        return v

    @field_validator("weight")
    @classmethod
    def _validate_weight(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("weight must be greater than 0 metric tonnes.")
        return v

    @field_validator("vessel_type")
    @classmethod
    def _validate_vessel_type(cls, v: str) -> str:
        allowed = {"panamax", "capesize", "supramax", "handysize", "bdi"}
        if v.strip().lower() not in allowed:
            raise ValueError(f"vessel_type must be one of: {sorted(allowed)}.")
        return v


class ForecastResponse(BaseModel):
    report: str
    status: str = "success"
    error: Optional[str] = None


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _build_agent_query(req: ForecastRequest) -> str:
    """
    Converts a structured ForecastRequest into a rich natural-language query
    the LangGraph agent can act on.  Mirrors the DATA GATHERING FRAMEWORK
    from the system prompt so the agent knows what to look for.
    """
    return (
        f"Please generate a full executive freight rate report for the following shipment:\n\n"
        f"  • Route:          {req.origin_port} ({req.country}) → {req.destination_port}\n"
        f"  • Cargo:          {req.item}\n"
        f"  • Weight:         {req.weight:,.0f} metric tonnes\n"
        f"  • Vessel Type:    {req.vessel_type}\n"
        f"  • Target Date:    {req.query_date}\n\n"
        f"Use the predict_freight_index tool to get the {req.vessel_type} index forecast for {req.query_date}, "
        f"use explain_prediction to identify the top SHAP feature drivers for {req.vessel_type}, "
        f"and use search_market_news to gather current Baltic Exchange and India-Europe shipping market context "
        f"(bunker prices, port congestion, seasonal adjustments). "
        f"Then compile all data into the required three-part executive report: "
        f"(a) Forecasted Rate (USD/tonne), (b) Key Drivers (SHAP + cost breakdown), "
        f"(c) Market Context (current conditions affecting this route)."
    )


def _extract_final_report(events: list) -> str:
    """
    Walks the LangGraph event stream in reverse and returns the last
    non-empty AI text message — the final executive report.
    """
    for event in reversed(events):
        msg = event.get("messages", [])
        if not msg:
            continue
        latest = msg[-1]
        if latest.type == "ai" and latest.content:
            text = format_message_content(latest.content)
            if text:
                return text
    return ""


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@app.get("/health", summary="Health check")
async def health():
    return {
        "status": "ok",
        "agent_ready": _agent_app is not None,
    }



# ---------------------------------------------------------------------------
# Structured model-data endpoints (charts + all sub-pages use these)
# ---------------------------------------------------------------------------
class ForecastSeriesRequest(BaseModel):
    vessel_type: str = "Panamax"
    start_date: str = Field(..., examples=["2025-04-01"])
    end_date: str = Field(..., examples=["2025-04-30"])


@app.get("/api/meta", summary="Model metadata + corridor lists")
async def api_meta():
    try:
        return forecasting.meta()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/api/history", summary="Real Baltic OHLC history")
async def api_history(vessel_type: str = "Panamax", limit: int = 365):
    try:
        return forecasting.get_history(vessel_type, limit)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/api/forecast-next", summary="Date-anchored LightGBM forecast (latest_ds + days)")
async def api_forecast_next(vessel_type: str = "Panamax", days: int = 30):
    """Preferred by all sub-pages: server anchors the window to latest_ds so
    callers never need wall-clock math (avoids the 180-day cap 400s)."""
    try:
        return forecasting.forecast_next(vessel_type, days)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/api/forecast-series", summary="LightGBM daily forecast range")
async def api_forecast_series(req: ForecastSeriesRequest):
    try:
        return forecasting.forecast_series(req.vessel_type, req.start_date, req.end_date)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/api/drivers", summary="SHAP feature drivers")
async def api_drivers(vessel_type: str = "Panamax"):
    try:
        return forecasting.shap_drivers(vessel_type)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/forecast", response_model=ForecastResponse, summary="Run freight forecast agent")
async def forecast(req: ForecastRequest):
    """
    Accepts a structured freight shipment request, runs it through the
    LangGraph ReAct agent (Gemini + LightGBM + DuckDuckGo), and returns
    a three-part executive report:
      (a) Forecasted Rate (USD/tonne)
      (b) Key Drivers (SHAP feature importance)
      (c) Market Context (live shipping news)
    """
    if _agent_app is None:
        raise HTTPException(
            status_code=503,
            detail="Agent not initialised. Check GOOGLE_API_KEY in backend/.env.",
        )

    query = _build_agent_query(req)

    try:
        events: list = []
        for event in _agent_app.stream(
            {"messages": [("user", query)]},
            stream_mode="values",
        ):
            events.append(event)

        report = _extract_final_report(events)

        if not report:
            return ForecastResponse(
                report="",
                status="error",
                error="Agent produced no output. Please try again.",
            )

        return ForecastResponse(report=report, status="success")

    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

