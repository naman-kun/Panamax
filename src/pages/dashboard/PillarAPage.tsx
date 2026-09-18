import React, { useState } from "react";
import { MarketForecastPillar } from "@/components/dashboard/MarketForecastPillar";
import { useLiveRouteSeries } from "@/hooks/useForecastSeries";
import { useModelDrivers } from "@/hooks/useModelDrivers";
import { SubPageProps, ModelStatusStrip } from "./SubPageCommon";

export function PillarAPage({ source, destination, vesselClass, cargoQuantityMT }: SubPageProps) {
  const live = useLiveRouteSeries({ vesselId: vesselClass.id, sourceId: source.id, destId: destination.id, horizonDays: 30 });
  const drv = useModelDrivers(vesselClass.id);
  const [showModel, setShowModel] = useState(true);
  return (
    <div className="space-y-4">
      <ModelStatusStrip live={live} drv={drv} />
      <button onClick={() => setShowModel((v) => !v)} className="text-[11px] font-mono text-zinc-400 hover:text-white border border-white/10 rounded px-2 py-1">
        {showModel ? "Hide live SHAP drivers" : "Show live SHAP drivers"}
      </button>
      {showModel && (
        <div className="p-3 rounded-xl bg-zinc-950 border border-white/10 text-xs text-zinc-300">
          {drv.isLoading ? "Loading SHAP drivers from backend..." : drv.error ? `Drivers unavailable, using onboard estimates. (${drv.error.slice(0, 80)})` : (
            <div><div className="text-white font-semibold mb-1">Live model drivers ({drv.drivers.length})</div>
            <div className="font-mono text-[11px]">{drv.drivers.map((d) => `${d.feature} ${(d.weight * 100).toFixed(1)}%`).join(" | ")}</div>
            <div className="text-zinc-500 mt-1">{drv.narrative}</div></div>
          )}
        </div>
      )}
      <MarketForecastPillar source={source} destination={destination} vesselClass={vesselClass} cargoQuantityMT={cargoQuantityMT} live={live} drivers={drv} />
    </div>
  );
}
