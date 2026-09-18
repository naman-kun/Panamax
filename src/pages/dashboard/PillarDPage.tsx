import React from "react";
import { RiskSentinelPillar } from "@/components/dashboard/RiskSentinelPillar";
import { useLiveRouteSeries } from "@/hooks/useForecastSeries";
import { useModelDrivers } from "@/hooks/useModelDrivers";
import { SubPageProps, ModelStatusStrip } from "./SubPageCommon";

export function PillarDPage({ source, destination, vesselClass }: SubPageProps) {
  const live = useLiveRouteSeries({ vesselId: vesselClass.id, sourceId: source.id, destId: destination.id, horizonDays: 30 });
  const drv = useModelDrivers(vesselClass.id);
  return (
    <div className="space-y-4">
      <ModelStatusStrip live={live} drv={drv} />
      {!drv.isLoading && !drv.error && (
        <div className="p-3 rounded-xl bg-zinc-950 border border-white/10 text-[11px] font-mono text-zinc-300">
          Risk overlay cites live SHAP momentum: {drv.drivers.slice(0, 3).map((d) => d.feature).join(", ")}.
        </div>
      )}
      <RiskSentinelPillar source={source} destination={destination} vesselClass={vesselClass} />
    </div>
  );
}
