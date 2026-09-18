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

/** Convenience: check if the backend is reachable */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/health`, { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}

