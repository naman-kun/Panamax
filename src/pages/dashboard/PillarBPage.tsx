import React from "react";
import { VesselOptimizerPillar } from "@/components/dashboard/VesselOptimizerPillar";
import { useLiveRouteSeries } from "@/hooks/useForecastSeries";
import { useModelDrivers } from "@/hooks/useModelDrivers";
import { SubPageProps, ModelStatusStrip } from "./SubPageCommon";

export function PillarBPage({ source, destination, vesselClass, cargoQuantityMT, onSelectVesselClass }: SubPageProps & { onSelectVesselClass: (vc: any) => void }) {
  const live = useLiveRouteSeries({ vesselId: vesselClass.id, sourceId: source.id, destId: destination.id, horizonDays: 30 });
  const drv = useModelDrivers(vesselClass.id);
  return (
    <div className="space-y-4">
      <ModelStatusStrip live={live} drv={drv} />
      {!drv.isLoading && !drv.error && drv.drivers.length > 0 && (
        <div className="p-3 rounded-xl bg-zinc-950 border border-white/10 text-[11px] font-mono text-zinc-300">
          Voyage economics use live index {live.latestIndex ?? ""}; cost momentum led by {drv.drivers[0].feature} ({(drv.drivers[0].weight * 100).toFixed(1)}%).
        </div>
      )}
      <VesselOptimizerPillar source={source} destination={destination} activeVesselClass={vesselClass} onSelectVesselClass={onSelectVesselClass} />
    </div>
  );
}
