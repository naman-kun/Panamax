import React from "react";
import { IdleFleetPillar } from "@/components/dashboard/IdleFleetPillar";
import { useLiveRouteSeries } from "@/hooks/useForecastSeries";
import { useModelDrivers } from "@/hooks/useModelDrivers";
import { SubPageProps, ModelStatusStrip } from "./SubPageCommon";

export function PillarCPage({ source, destination, vesselClass }: SubPageProps) {
  const live = useLiveRouteSeries({ vesselId: vesselClass.id, sourceId: source.id, destId: destination.id, horizonDays: 30 });
  const drv = useModelDrivers(vesselClass.id);
  return (
    <div className="space-y-4">
      <ModelStatusStrip live={live} drv={drv} />
      {live.isLive && live.targetIndex != null && (
        <div className="p-3 rounded-xl bg-zinc-950 border border-white/10 text-[11px] font-mono text-zinc-300">
          30-day model outlook {live.latestIndex} -&gt; {live.targetIndex} index points anchors idle-vs-triangulation timing.
        </div>
      )}
      <IdleFleetPillar destination={destination} vesselClass={vesselClass} />
    </div>
  );
}
