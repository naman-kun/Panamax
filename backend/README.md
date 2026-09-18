# Panamax — Full-Stack Freight Intelligence Monorepo

React SPA (Vite, port 5173) + FastAPI + LangGraph backend (uvicorn, port 8000).

## Quick start (unified)

```bash
cp backend/.env.example backend/.env   # add GOOGLE_API_KEY
npm install
npm run dev   # launches Vite + backend/venv uvicorn together
```

* Frontend: http://localhost:5173
* Backend health: http://localhost:8000/health
* Forecast API: POST http://localhost:8000/forecast

## Backend setup (manual)

```bash
cd backend
python3 -m venv venv
./venv/bin/pip install -r requirements.txt
./venv/bin/uvicorn src.main:app --reload --port 8000
```

Env vars (`backend/.env`): `GOOGLE_API_KEY` (required),
`MODEL_DIR` / `DATA_DIR` (default to `backend/models`, `backend/data`),
`GEMINI_MODEL` (default `gemini-2.5-flash`).

Sample forecast call:

```bash
curl -X POST http://localhost:8000/forecast -H 'Content-Type: application/json' \
  -d '{"query_date":"2026-10-15","vessel_type":"Panamax","origin_port":"Paradip Port","destination_port":"Port of Hamburg (HHLA)","country":"India","item":"General Cargo","weight":75000}'
```

## Corridor scope

* Origins (East Coast India): Syama Prasad Mookerjee Port (Kolkata/Haldia),
  Paradip, Visakhapatnam, Chennai, V.O. Chidambaranar (Tuticorin).
* Destinations (Baltic / N. Europe): Gdańsk, Gdynia, Klaipėda, Helsinki, Hamburg.

## Troubleshooting

* `503 Agent not initialised` → missing `GOOGLE_API_KEY` in `backend/.env`.
* CORS errors → backend allows `http://localhost:5173` and
  `http://127.0.0.1:5173` via `VITE_ORIGINS` in `backend/src/config.py`.
* `Cannot reach backend` in UI → ensure `npm run dev` shows both Vite and
  uvicorn; override URL with `VITE_BACKEND_URL` in `.env.local`.
* Market news is restricted to the whitelist in
  `backend/src/config.py` (`lloydslist.com`, `freightwaves.com`, `joc.com`,
  `hellenicshippingnews.com`, `splash247.com`) via `site:` scoping.
