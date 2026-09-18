# Panamax — Maritime Freight Intelligence & Chartering Optimizer

> **Predict the freight. Time the charter. Optimize the cost.**  
> Enterprise-grade maritime freight rate forecasting and vessel chartering terminal for bulk commodity procurement desks.

> **Full-stack monorepo:** React SPA (Vite, port 5173) + live FastAPI + LangGraph backend (uvicorn, port 8000).
> The synthetic frontend engine is now backed by a Gemini-powered ReAct agent (LightGBM + SHAP + whitelisted market news).
> Backend details: [`backend/README.md`](backend/README.md).

---

## Hybrid Intelligence Architecture (live-first, offline-resilient)

Panamax deliberately fuses **two complementary model families** so every dashboard pillar stays honest whether the
backend is reachable or not — no empty charts, no stale "simulated" labels.

### Layer A — Deterministic ML forecasting pipeline (FastAPI :8000)
- **Engine:** LightGBM (via `mlforecast`) trained on Baltic historical CSVs (BDI / Capesize / Panamax / Supramax / Handysize).
- **Explainability:** SHAP — feature importances cited as "Key Drivers".
- **Endpoints:** `GET /api/history` · `GET /api/forecast-next` · `GET /api/drivers` · `GET /api/meta` (each date-anchored to the real `latest_ds`, never wall-clock).

### Layer B — Agentic intelligence (LangGraph ReAct + Gemini [`gemini-2.5-flash`](https://ai.google.dev/gemini-api))
- **Orchestrator:** `LangGraph` `StateGraph` / `ToolNode` ReAct agent (`backend/src/agent.py`).
- **Bound tools:** `predict_freight_index` (LightGBM) · `explain_prediction` (SHAP) · `search_market_news` (whitelisted domains only).
- **LLM:** Google Gemini `gemini-2.5-flash` (env `GEMINI_MODEL`; key via `GOOGLE_API_KEY` in `backend/.env`).

### How the two layers swap
Every pillar hook (`useLiveRouteSeries`, `useModelDrivers` in `src/hooks/`) calls the **live endpoint first** and
renders backend data the moment it arrives; a synthetic `simulationEngine` series — date-anchored to the same
`2025-03-31` `latest_ds` — serves as the instant offline fallback, keeping CI bands, corridor shape and labels
consistent across both paths. The exact division of "what each page asks the forecasting layer for" is documented
per sub-page in [`src/pages/dashboard/`](src/pages/dashboard/) (see the Route → Data table below).

---

## Overview

Indian conglomerates (power, steel, refineries) and global commodity trading houses import millions of tonnes of dry bulk commodities (thermal coal, coking coal, iron ore, crude oil). They face massive unhedged exposure to ocean freight rate volatility:

> **The $1.50/MT Problem**: Making a chartering fixture decision on a 75,000 MT Panamax shipment at the wrong time by just **$1.50/MT** costs **$112,500 USD** in avoidable capital loss per single voyage.

**Panamax** unifies predictive and prescriptive intelligence to forecast freight volatility and identify optimal booking windows on the East Coast India → Baltic / Northern Europe corridor.

Built from the ground up strictly adhering to the **shadcn/ui** design system with a dark `zinc-950` institutional terminal aesthetic, monospace financial telemetry, and real-time client-side simulation models.

---

## Core Capabilities ("See What Panamax Can Do")

### 1. India → Baltic Corridor Selector (Pillar A)
- **Origin Ports (East Coast India):**
  - Syama Prasad Mookerjee Port (Kolkata/Haldia)
  - Paradip Port (Odisha)
  - Visakhapatnam Port (Andhra Pradesh)
  - Chennai Port (Tamil Nadu)
  - V.O. Chidambaranar Port / Tuticorin (Tamil Nadu)
- **Destination Ports (Baltic / Northern Europe):**
  - Port of Gdańsk, DCT (Poland)
  - Port of Gdynia (Poland)
  - Klaipėda Port (Lithuania)
  - Port of Helsinki, Vuosaari (Finland)
  - Port of Hamburg, HHLA (Germany)
- **Live Corridor Telemetry Bar:** Real-time distance in nautical miles, vessel deadweight capacity, benchmark spot rates, and target AI forecasts.

### 2. Institutional Financial Chart Terminal
Modeled directly on the Infragistics / TradingView Financial Chart specification in dark mode:
- **Built-in Interactive Toolbar:**
  - `Indicators ▾` menu.
  - Multi-Horizon Time Range Buttons: `1M`, `3M`, `6M`, `YTD`, `1Y`, `ALL`.
  - Display mode switchers.
- **Dual Financial Curves:**
  - **Purple Curve (`#a855f7`):** Panamax AI Forward Forecast with dynamic endpoint value pill badge (e.g. `+122.4%`).
  - **Green Curve (`#22c55e`):** Baltic Realized Spot Benchmark with dynamic endpoint value pill badge (e.g. `+106.4%`).
- **Interactive Bottom Timeline Navigator:**
  - Integrated zoom slider with dual range drag handles `[||` ... `||]` for panning and zooming across historical and forward forecast timelines.
- **Smooth Real-Time Reactivity:**
  - Changing either the source country or the destination port dynamically shifts the curve values with fluid animation.

### 3. Linear-Inspired 3D Isometric Art
- **FIG 0.1 Purpose-built:** Multi-layered stacked isometric slabs with embossed circular emblem and vertical expansion on cursor hover.
- **FIG 0.2 Powered by neural forecasting:** 4 floating isometric cubes in an orbital cluster with 3D tilt and layer separation.
- **FIG 0.3 Designed for precision:** Stepped perspective fan rack of 10 vertical panels with perspective wave lift.

---

## Technical Stack & Design System

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/) | High-performance SPA with fast HMR (port 5173) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict type safety across mathematical models and props |
| **Backend API** | [FastAPI](https://fastapi.tiangolo.com/) + [Uvicorn](https://www.uvicorn.org/) | `POST /forecast` + `GET /health` on port 8000, CORS for Vite |
| **Agent** | [LangGraph ReAct](https://langchain-ai.github.io/langgraph/) + [Gemini](https://ai.google.dev/) (`gemini-2.5-flash`) | Voyage-cost estimation per maritime system prompt |
| **Forecasting** | [LightGBM](https://lightgbm.readthedocs.io/) via [MLForecast](https://nixtla.github.io/mlforecast/) + [SHAP](https://shap.readthedocs.io/) | Baltic index prediction + Key Drivers explanation |
| **Market news** | [DuckDuckGo Search](https://duckduckgo.com/) scoped by `site:` whitelist | Market Context from `AUTHORIZED_NEWS_DOMAINS` only |
| **Financial Viz** | [Ignite UI Financial Chart](https://www.infragistics.com/) | Institutional canvas financial chart with range slider |
| **Design Tokens** | [shadcn/ui](https://ui.shadcn.com/) | Neutral `zinc-950` palette, subtle white borders (`border-white/10`) |
| **Primitives** | [Radix UI](https://www.radix-ui.com/) | Accessible Dialogs, Popovers, Sliders, Tabs, Hover Cards, Tooltips |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) | Atomic utility classes and responsive breakpoints |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, minimalist monochrome vector iconography |

---

## Backend Intelligence Engine (`freight_forecast` → `backend/`)

| File | Role |
| :--- | :--- |
| `backend/src/main.py` | FastAPI app: `POST /forecast`, `GET /health`, CORS for `http://localhost:5173` + `http://127.0.0.1:5173` |
| `backend/src/agent.py` | LangGraph ReAct agent (Gemini + `predict` / `explain` / `market_news` tools) with maritime system prompt |
| `backend/src/tools.py` | `predict_freight_index` (LightGBM), `explain_prediction` (SHAP), `search_market_news` (whitelisted) |
| `backend/src/config.py` | `AUTHORIZED_NEWS_DOMAINS`, `MODEL_DIR`/`DATA_DIR` defaults, `VITE_ORIGINS` |
| `backend/data/` | Baltic historical CSVs (BDI, Capesize, Panamax, Supramax, Handysize 2016–2026) |
| `backend/models/` | Serialized `mlforecast_model`, `raw_booster.joblib`, `shap_explainer.joblib`, feature/category JSON |
| `backend/requirements.txt` | Pinned Python deps · `backend/.env` holds `GOOGLE_API_KEY` (git-ignored) |

**Agent contract:** every forecast follows the voyage-cost framework in `agent.py`
(`Base voyage + Bunker + Origin/Destination port costs + Handling + Canal + Environmental + Security/Insurance + Congestion + Documentation + Market adjustments`,
then `USD/tonne = Total ÷ Tonnes`) and returns a three-part executive report:
**(a) Forecasted Rate**, **(b) Key Drivers (SHAP)**, **(c) Market Context (whitelisted domains)**.

**Frontend wiring:** `src/lib/api.ts` (`ForecastRequest` → `fetchAgentForecast → POST /forecast`)
is called by `AISandboxPage` (AI Sandbox sub-page `#dashboard/ai-sandbox`) with live `query_date`, mapped `vessel_type`,
corridor ports, `General Cargo`, and parcel `weight`. Every other sub-page renders structured model output via
`GET /api/history`, `POST /api/forecast-series`, `GET /api/drivers`, `GET /api/meta` (hooks `useLiveRouteSeries`, `useModelDrivers`).

---

## Repository Structure

```
.
├── backend/                             # FastAPI + LangGraph intelligence engine (port 8000)
│   ├── src/
│   │   ├── main.py                      # FastAPI app: POST /forecast, GET /health, CORS for Vite
│   │   ├── agent.py                     # Gemini ReAct agent + maritime system prompt
│   │   ├── tools.py                     # predict (LightGBM), explain (SHAP), market_news (whitelisted)
│   │   └── config.py                    # AUTHORIZED_NEWS_DOMAINS, MODEL_DIR/DATA_DIR, VITE_ORIGINS
│   ├── data/                            # Baltic historical CSVs (BDI/Capesize/Panamax/Supramax/Handysize)
│   ├── models/                          # Serialized LightGBM + SHAP artifacts, feature/category JSON
│   ├── requirements.txt                 # Pinned Python deps
│   ├── .env.example                     # Template (real backend/.env with GOOGLE_API_KEY is git-ignored)
│   ├── venv/                            # Local Python venv (git-ignored) → backend/venv/bin/uvicorn
│   └── README.md                        # Backend setup + sample curl
├── PRD document/
│   ├── Freight forecasting software.md   # Maritime PRD and domain specifications
│   └── code reference.txt                 # Financial chart component reference code
├── public/                                # Static public assets
├── reference images/                      # Linear and Notion UI/UX inspiration references
├── src/
│   ├── components/
│   │   ├── dashboard/                     # Pillar components (rendered by sub-page routes, live model data)
│   │   ├── landing/
│   │   │   ├── modules/
│   │   │   │   └── FreightPredictorModule.tsx # Dual dropdown selector & forecaster terminal
│   │   │   ├── BentoGrid.tsx                  # 3D tilt feature bento grid
│   │   │   ├── DemoModal.tsx                  # Interactive simulation dialog
│   │   │   ├── FinancialChart.tsx             # IgcFinancialChartComponent in dark mode
│   │   │   ├── Footer.tsx                     # Minimalist dark footer
│   │   │   ├── Hero.tsx                       # Left-aligned hero headline & market cards
│   │   │   ├── InteractiveGraph.tsx           # 3D cursor-elastic stock chart
│   │   │   ├── LinearFigures.tsx              # Isometric wireframe art (FIG 0.1–0.3)
│   │   │   ├── Navbar.tsx                     # Topbar with Radix hover cards & popovers
│   │   │   └── SeeWhatPanamaxCanDo.tsx        # Streamlined forecaster master section
│   │   └── ui/                                # Official shadcn/ui components
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── dialog.tsx
│   │       ├── hover-card.tsx
│   │       ├── popover.tsx
│   │       ├── separator.tsx
│   │       ├── slider.tsx
│   │       ├── switch.tsx
│   │       ├── tabs.tsx
│   │       └── tooltip.tsx
│   ├── lib/
│   │   ├── api.ts                           # ForecastRequest + fetchAgentForecast → POST localhost:8000/forecast
│   │   ├── simulationEngine.ts              # Route distances, port definitions & stock history
│   │   └── utils.ts                           # Tailwind class merging utility (cn)
│   ├── hooks/useForecastSeries.ts + useModelDrivers.ts # Live backend series/drivers (fallback = synthetic)
│   ├── pages/dashboard/                     # 7 sub-pages: pillar-a/b/c/d, tradingview, fixtures, ai-sandbox (#dashboard/*)
│   ├── App.tsx                                # Main application layout
│   ├── index.css                              # Tailwind tokens and dark theme styles
│   └── main.tsx                               # Application entrypoint
├── index.html                                 # HTML template with JetBrains Mono / Inter fonts
├── package.json                               # Deps + scripts (`dev` runs Vite + uvicorn via concurrently)
├── postcss.config.js                          # PostCSS configuration
├── tailwind.config.js                         # Tailwind dark theme configuration
├── tsconfig.json                              # TypeScript configuration
└── vite.config.ts                             # Vite configuration with path aliases (@/*)
```

---

## Getting Started (full-stack)

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** (or **pnpm** / **yarn**)
- **Python**: 3.12 (for `backend/venv`) + a Gemini `GOOGLE_API_KEY`

### Installation
```bash
# Clone the repository
git clone https://github.com/naman-kun/Panamax.git

# Navigate into the project directory
cd Panamax

# Install frontend dependencies
npm install

# Set up the backend (one time)
cp backend/.env.example backend/.env   # add your GOOGLE_API_KEY
cd backend && python3 -m venv venv && ./venv/bin/pip install -r requirements.txt && cd ..
```

### Development (unified startup)
`npm run dev` launches **both** servers via `concurrently`:
Vite (5173) + `backend/venv/bin/uvicorn src.main:app --reload --port 8000 --app-dir backend`.
```bash
npm run dev
```
Open your browser at: **`http://localhost:5173/`**
Backend health: **`http://localhost:8000/health`**

To run either server alone:
```bash
npx vite                                        # frontend only
backend/venv/bin/uvicorn src.main:app --reload --port 8000 --app-dir backend   # backend only
```

### Forecast API
```bash
curl -X POST http://localhost:8000/forecast -H 'Content-Type: application/json' \
  -d '{"query_date":"2026-10-15","vessel_type":"Panamax","origin_port":"Paradip Port","destination_port":"Port of Hamburg (HHLA)","country":"India","item":"General Cargo","weight":75000}'
```
Frontend equivalent: `fetchAgentForecast(req)` in `src/lib/api.ts`
(override the URL with `VITE_BACKEND_URL` in `.env.local`).

### Dashboard sub-pages (deep-linkable)
| Route | Sub-page | Model data |
| :--- | :--- | :--- |
| `#dashboard/pillar-a` 📈 | Rate Forecast & COA Arbitrage | live history + 30-day LightGBM chart, SHAP drivers |
| `#dashboard/pillar-b` 🚢 | Vessel Optimizer | live index + top SHAP driver annotates voyage table |
| `#dashboard/pillar-c` 🔄 | Idle Fleet & Cabotage | 30-day outlook anchors triangulation timing |
| `#dashboard/pillar-d` 🛡️ | Risk Sentinel | SHAP momentum cited in risk overlay |
| `#dashboard/tradingview` 📊 | TradingView Terminal | full live history + 60-day forecast series |
| `#dashboard/fixtures` 📋 | Fixtures DB | model status strip (AI rate checks via sandbox) |
| `#dashboard/ai-sandbox` ✨ | AI Sandbox | full LangGraph agent executive report |

### Production Build
Compile TypeScript and bundle the production assets:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

---

## Troubleshooting

| Symptom | Fix |
| :--- | :--- |
| `503 Agent not initialised` from `/forecast` | Add `GOOGLE_API_KEY` to `backend/.env` and restart `npm run dev` |
| `Cannot reach the freight backend` in the UI | Ensure `npm run dev` shows both Vite and uvicorn; check `http://localhost:8000/health` |
| CORS errors in the browser console | Backend allows `http://localhost:5173` + `http://127.0.0.1:5173` via `VITE_ORIGINS` in `backend/src/config.py` |
| Agent forecast is slow / times out | Expected: LightGBM + SHAP + live search can take ~2 min (UI timeout is 120s) — retry |
| Stale port lists | Origins/destinations are fixed in `src/lib/simulationEngine.ts` (`SOURCE_EXPORT_PORTS`, `DESTINATION_BALTIC_PORTS`) |

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
