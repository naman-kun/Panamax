import React from "react";
import { NotionFixtureDatabase } from "@/components/dashboard/NotionFixtureDatabase";
import { useLiveRouteSeries } from "@/hooks/useForecastSeries";
import { useModelDrivers } from "@/hooks/useModelDrivers";
import { SubPageProps, ModelStatusStrip } from "./SubPageCommon";

export function FixturesPage({ source, destination, vesselClass }: SubPageProps) {
  const live = useLiveRouteSeries({ vesselId: vesselClass.id, sourceId: source.id, destId: destination.id, horizonDays: 30 });
  const drv = useModelDrivers(vesselClass.id);
  return (
    <div className="space-y-4">
      <ModelStatusStrip live={live} drv={drv} />
      <NotionFixtureDatabase />
    </div>
  );
}
