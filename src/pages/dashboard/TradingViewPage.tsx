import React, { useState } from "react";
import { TradingViewChartTerminal } from "@/components/dashboard/TradingViewChartTerminal";
import { useLiveRouteSeries } from "@/hooks/useForecastSeries";
import { FinancialYAxisMode, generateRouteFinancialData } from "@/lib/simulationEngine";
import { SubPageProps } from "./SubPageCommon";

export function TradingViewPage({ source, destination, vesselClass }: SubPageProps) {
  const [timeframe, setTimeframe] = useState<"1M" | "3M" | "6M" | "YTD" | "1Y" | "ALL">("1Y");
  const [yAxisMode, setYAxisMode] = useState<FinancialYAxisMode>("PercentChange");
  const live = useLiveRouteSeries({ vesselId: vesselClass.id, sourceId: source.id, destId: destination.id, horizonDays: 60 });
  const fallback = generateRouteFinancialData(source.id, destination.id, timeframe, vesselClass.id, yAxisMode);
  const panamaxData = live.isLive ? live.livePanamax : fallback.panamaxForecast;
  const benchmarkData = live.isLive ? live.liveBenchmark : fallback.marketBenchmark;
  return (
    <div className="space-y-3">
      <div className="text-[11px] font-mono text-zinc-400 px-1">
        {live.isLoading ? "Loading live model series..." : live.isLive ? `Live backend series: history ${live.history.length} pts + forecast ${live.forecast.length} pts (${live.latestIndex} -> ${live.targetIndex}). Graph renders LightGBM output.` : `Backend offline, showing synthetic fallback. ${live.error ?? ""}`}
      </div>
      <TradingViewChartTerminal source={source} destination={destination} vesselClass={vesselClass}
        panamaxData={panamaxData} benchmarkData={benchmarkData}
        currentPanamaxRate={fallback.currentPanamaxRate} currentBenchmarkRate={fallback.currentBenchmarkRate}
        percentChangePanamax={fallback.percentChangePanamax} percentChangeBenchmark={fallback.percentChangeBenchmark}
        timeframe={timeframe} onTimeframeChange={setTimeframe} yAxisMode={yAxisMode} onYAxisModeChange={setYAxisMode}
        currentBpiPoints={live.latestIndex ?? fallback.currentBpiPoints} targetBpiPoints={live.targetIndex ?? fallback.targetBpiPoints} />
    </div>
  );
}
