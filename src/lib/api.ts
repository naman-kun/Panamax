/**
 * api.ts
 * Network layer for the Panamax freight intelligence backend.
 * Wraps the FastAPI /forecast endpoint so no other component ever
 * touches raw fetch() calls or knows the backend URL.
 */

// Vite dev default; override per-environment with VITE_BACKEND_URL in .env.local.
const BACKEND_URL =
  (import.meta as unknown as { env?: Record<string, string | undefined> }).env
    ?.VITE_BACKEND_URL ?? "http://localhost:8000";

// Long LangGraph runs (ML forecast + market search) can take a while.
const DEFAULT_TIMEOUT_MS = 120_000;

// ---------------------------------------------------------------------------
// Request / Response types (mirrors backend Pydantic schemas)
// ---------------------------------------------------------------------------

export interface ForecastRequest {
  /** Target forecast date — YYYY-MM-DD */
  query_date: string;
  /** Vessel class: Panamax | Capesize | Supramax | Handysize | BDI */
  vessel_type: string;
  /** East Coast Indian origin port name */
  origin_port: string;
  /** Baltic / Northern European destination port name */
  destination_port: string;
  /** Origin country */
  country: string;
  /** Cargo type / commodity */
  item: string;
  /** Shipment quantity in metric tonnes */
  weight: number;
}

export interface ForecastResponse {
  /** The agent's executive report (markdown-formatted multi-part text) */
  report: string;
  status: "success" | "error";
  error?: string;
}

// ---------------------------------------------------------------------------
// API function
// ---------------------------------------------------------------------------

/**
 * Posts a freight forecast request to the FastAPI backend and returns the
 * LangGraph agent's executive report.
 *
 * Throws a typed Error if the network request fails or the server returns
 * a non-2xx status, so callers can display a user-friendly error message.
 */
export async function fetchAgentForecast(
  req: ForecastRequest,
  signal?: AbortSignal
): Promise<ForecastResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
  // Allow caller abort to propagate while keeping our own timeout.
  const onCallerAbort = () => controller.abort();
  signal?.addEventListener("abort", onCallerAbort, { once: true });

  let response: Response;
  try {
    response = await fetch(`${BACKEND_URL}/forecast`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error(
        signal?.aborted
          ? "Forecast request was cancelled."
          : `Forecast timed out after ${DEFAULT_TIMEOUT_MS / 1000}s — the agent may still be running. Try again.`
      );
    }
    throw new Error(
      `Cannot reach the freight backend at ${BACKEND_URL}. Is \`npm run dev\` running both Vite and uvicorn?`
    );
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", onCallerAbort);
  }

  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    try {
      const err = await response.json();
      detail = err.detail ?? detail;
    } catch {
      // ignore JSON parse errors — use status code message
    }
    throw new Error(detail);
  }

  const data: ForecastResponse = await response.json();
  return data;
}

export interface HistoryPoint { ds: string; index: number; open: number; high: number; low: number }
export interface HistoryResponse { vessel_type: string; count: number; latest_ds: string; latest_index: number; points: HistoryPoint[] }
export interface ForecastPoint { ds: string; index: number }
export interface ForecastSeriesResponse { vessel_type: string; latest_ds: string; latest_index: number; points: ForecastPoint[]; target_index: number | null; horizon_days: number }
export interface ModelDriver { feature: string; importance: number; weight: number }
export interface DriversResponse { vessel_type: string; drivers: ModelDriver[]; narrative: string; feature_columns: string[] }
export interface BackendMeta { vessel_types: string[]; latest: Record<string, { latest_ds?: string; latest_index?: number; rows?: number; error?: string }>; origins: string[]; destinations: string[]; news_domains: string[]; generated_at: string }

// Request dedupe + short TTL cache.
// WHY: every sub-page previously mounted its own hook instance (status strip +
// page body = 2x history + 2x forecast + 2x drivers). Without sharing, one
// navigation fired 6-9 concurrent MLForecast loads and wedged uvicorn.
const jsonCache = new Map<string, { at: number; data: unknown }>();
const inflight = new Map<string, Promise<unknown>>();
const CACHE_TTL_MS = 60_000;

function cacheGet<T>(key: string): T | null {
  const hit = jsonCache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > CACHE_TTL_MS) { jsonCache.delete(key); return null; }
  return hit.data as T;
}

export function clearApiCache(): void { jsonCache.clear(); }

async function getJson<T>(path: string, timeoutMs = 30000): Promise<T> {
  const cached = cacheGet<T>(path);
  if (cached) return cached;
  const ongoing = inflight.get(path) as Promise<T> | undefined;
  if (ongoing) return ongoing;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const job = (async () => {
    try {
      const res = await fetch(`${BACKEND_URL}${path}`, { signal: controller.signal });
      if (!res.ok) {
        let detail = `HTTP ${res.status} for ${path}`;
        try { const e = await res.json(); detail = (e as { detail?: string }).detail ?? detail; } catch { /* keep status */ }
        throw new Error(detail);
      }
      const data = (await res.json()) as T;
      jsonCache.set(path, { at: Date.now(), data });
      return data;
    } finally { clearTimeout(timeout); inflight.delete(path); }
  })();
  inflight.set(path, job);
  return job;
}

export async function fetchBackendMeta(): Promise<BackendMeta> { return getJson<BackendMeta>("/api/meta"); }
export async function fetchHistory(vesselType: string, limit = 365): Promise<HistoryResponse> {
  return getJson<HistoryResponse>(`/api/history?vessel_type=${encodeURIComponent(vesselType)}&limit=${limit}`);
}
export async function fetchDrivers(vesselType: string): Promise<DriversResponse> {
  return getJson<DriversResponse>(`/api/drivers?vessel_type=${encodeURIComponent(vesselType)}`);
}
export async function fetchForecastSeries(vesselType: string, startDate: string, endDate: string): Promise<ForecastSeriesResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);
  try {
    const res = await fetch(`${BACKEND_URL}/api/forecast-series`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vessel_type: vesselType, start_date: startDate, end_date: endDate }),
      signal: controller.signal,
    });
    if (!res.ok) {
      let detail = `HTTP ${res.status}`;
      try { const e = await res.json(); detail = (e as { detail?: string }).detail ?? detail; } catch { /* noop */ }
      throw new Error(detail);
    }
    return (await res.json()) as ForecastSeriesResponse;
  } finally { clearTimeout(timeout); }
}

/** Date-anchored forecast (preferred): server windows from latest_ds, never wall-clock today. */
export async function fetchForecastNext(vesselType: string, days = 30): Promise<ForecastSeriesResponse> {
  return getJson<ForecastSeriesResponse>(`/api/forecast-next?vessel_type=${encodeURIComponent(vesselType)}&days=${days}`);
}

/** Convenience: check if the backend is reachable */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/health`, { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}

