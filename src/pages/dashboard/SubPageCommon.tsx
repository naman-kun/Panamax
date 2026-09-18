import React from "react";
import { Badge } from "@/components/ui/badge";
import { PortInfo, DestinationPortInfo, VesselClassSpec } from "@/lib/simulationEngine";
import { ForecastSeriesState } from "@/hooks/useForecastSeries";
import { clearApiCache } from "@/lib/api";

export interface SubPageProps { source: PortInfo; destination: DestinationPortInfo; vesselClass: VesselClassSpec; cargoQuantityMT: number }

export interface DriverState { drivers: { feature: string; importance: number; weight: number }[]; narrative: string; isLoading: boolean; error: string | null; retry: () => void }

export function ModelStatusStrip({ live, drv }: { live: ForecastSeriesState; drv: DriverState }) {
  const showDrivers = !drv.isLoading && !drv.error && drv.drivers.length > 0;
  return (
    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
      <Badge variant="outline" className={live.isLive ? "border-emerald-500/40 text-emerald-300" : "border-amber-500/40 text-amber-300"}>
        {live.isLoading ? "Connecting to model..." : live.isLive
          ? `Live model: ${live.latestIndex} -> ${live.targetIndex ?? "forecasting..."}`
          : "Offline simulation fallback"}
      </Badge>
      {live.historyError && <span className="text-zinc-500">history: {live.historyError.slice(0, 80)}</span>}
      {live.forecastError && <span className="text-zinc-500">forecast: {live.forecastError.slice(0, 80)}</span>}
      {showDrivers && (
        <span className="text-zinc-400">Top drivers: {drv.drivers.slice(0, 3).map((d) => d.feature).join(", ")}</span>
      )}
      {drv.error && <span className="text-zinc-500">drivers: {drv.error.slice(0, 60)}</span>}
      {!live.isLoading && !live.isLive && (
        <button onClick={() => { clearApiCache(); live.retry(); drv.retry(); }} className="px-2 py-0.5 rounded border border-white/15 text-zinc-300 hover:text-white hover:border-white/30">Retry</button>
      )}
    </div>
  );
}
