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
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Load .env before importing agent (agent reads GOOGLE_API_KEY on import)
load_dotenv()

try:
    from agent import build_app, format_message_content
except ImportError:
    from src.agent import build_app, format_message_content

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
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
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
