import { useEffect, useMemo, useState } from "react";
import { fetchForecastNext, fetchHistory, ForecastPoint, HistoryPoint } from "@/lib/api";
import { StockItem, generateRouteFinancialData, VesselClassId } from "@/lib/simulationEngine";

function toBackendVessel(id: VesselClassId): string {
  if (id === "handysize") return "Handysize";
  if (id === "supramax") return "Supramax";
  if (id === "capesize") return "Capesize";
  return "Panamax";
}

export interface ForecastSeriesState {
  history: HistoryPoint[];
  forecast: ForecastPoint[];
  livePanamax: StockItem[];
  liveBenchmark: StockItem[];
  targetIndex: number | null;
  latestIndex: number | null;
  isLive: boolean;
  isLoading: boolean;
  historyError: string | null;
  forecastError: string | null;
  /** Legacy combined error (history ?? forecast) for existing banners. */
  error: string | null;
  retry: () => void;
}

export function useForecastSeries(opts: { vesselId: VesselClassId; sourceId: string; destId: string; timeframeDays?: number; horizonDays?: number }): boolean | any {
  return null as any;
}

export function useLiveRouteSeries(opts: { vesselId: VesselClassId; sourceId: string; destId: string; horizonDays?: number }): ForecastSeriesState {
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [forecast, setForecast] = useState<ForecastPoint[]>([]);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [forecastError, setForecastError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [pending, setPending] = useState(true);
  const vessel = toBackendVessel(opts.vesselId);
  const horizon = Math.max(1, Math.min(opts.horizonDays ?? 30, 180));
  useEffect(() => {
    let cancelled = false;
    setPending(true); setHistoryError(null); setForecastError(null);
    (async () => {
      // History and forecast-next run independently: one failing must not
      // poison the other. forecast-next is anchored server-side to latest_ds
      // so wall-clock today can never push us past the 180-day cap.
      const hP = fetchHistory(vessel, 365).then((h) => {
        if (!cancelled) setHistory(h.points);
      }).catch((e) => { if (!cancelled) setHistoryError(e instanceof Error ? e.message : String(e)); });
      const fP = fetchForecastNext(vessel, horizon).then((f) => {
        if (!cancelled) setForecast(f.points);
      }).catch((e) => { if (!cancelled) setForecastError(e instanceof Error ? e.message : String(e)); });
      await Promise.allSettled([hP, fP]);
      if (!cancelled) setPending(false);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vessel, horizon, attempt, opts.sourceId, opts.destId]);
  const mapped = useMemo(() => {
    const livePanamax: StockItem[] = [];
    const liveBenchmark: StockItem[] = [];
    history.forEach((pt) => {
      const b = new StockItem();
      b.date = new Date(pt.ds + "T00:00:00Z"); b.open = pt.open; b.high = pt.high; b.low = pt.low; b.close = pt.index; b.volume = 75000;
      liveBenchmark.push(b);
      const f = new StockItem();
      f.date = b.date; f.open = pt.open; f.high = pt.high; f.low = pt.low; f.close = pt.index; f.volume = 75000;
      livePanamax.push(f);
    });
    forecast.forEach((pt) => {
      const prev = livePanamax.length ? livePanamax[livePanamax.length - 1].close : pt.index;
      const idx = pt.index;
      const ciSpread = idx * 0.08;
      const f = new StockItem();
      f.date = new Date(pt.ds + "T00:00:00Z");
      f.open = prev; f.high = Math.max(prev, idx); f.low = Math.min(prev, idx); f.close = idx; f.volume = 75000;
      f.ciUpper80 = idx + ciSpread * 0.6; f.ciLower80 = idx - ciSpread * 0.6;
      f.ciUpper95 = idx + ciSpread; f.ciLower95 = idx - ciSpread;
      livePanamax.push(f);
      const b = new StockItem();
      b.date = f.date; b.open = prev; b.high = Math.max(prev, idx); b.low = Math.min(prev, idx); b.close = idx; b.volume = 75000;
      b.ciUpper80 = f.ciUpper80; b.ciLower80 = f.ciLower80; b.ciUpper95 = f.ciUpper95; b.ciLower95 = f.ciLower95;
      liveBenchmark.push(b);
    });
    return { livePanamax, liveBenchmark };
  }, [history, forecast]);
  // Offline fallback is ALWAYS populated so charts render instantly even
  // when the backend is down; live series swap in when history arrives.
  const fallback = useMemo(() => generateRouteFinancialData(opts.sourceId, opts.destId, "1Y", opts.vesselId, "PercentChange"), [opts.sourceId, opts.destId, opts.vesselId]);
  const hasHistory = history.length > 0;
  const error = historyError ?? forecastError;
  return {
    history, forecast,
    livePanamax: hasHistory ? mapped.livePanamax : fallback.panamaxForecast,
    liveBenchmark: hasHistory ? mapped.liveBenchmark : fallback.marketBenchmark,
    targetIndex: forecast.length ? forecast[forecast.length - 1].index : null,
    latestIndex: hasHistory ? history[history.length - 1].index : null,
    isLive: hasHistory && forecast.length > 0,
    isLoading: pending,
    historyError, forecastError, error,
    retry: () => { clearApiCacheSafe(); setAttempt((a) => a + 1); },
  };
}

function clearApiCacheSafe(): void {
  import("@/lib/api").then((m) => m.clearApiCache()).catch(() => undefined);
}
