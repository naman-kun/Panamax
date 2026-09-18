import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  TrendingUp,
  Percent,
  DollarSign,
  Calendar,
  ShieldCheck,
  Zap,
  Info,
  CheckCircle2,
  Ship,
  Sparkles,
  ArrowDownRight,
  Clock,
  ChevronDown,
  ChevronRight,
  CheckSquare,
  Square,
  Lightbulb,
} from 'lucide-react';
import {
  PortInfo,
  DestinationPortInfo,
  VesselClassSpec,
  generateRouteFinancialData,
  computeEntryTiming,
  VesselClassId,
  FinancialYAxisMode,
} from '@/lib/simulationEngine';
import { TradingViewChartTerminal } from './TradingViewChartTerminal';
import { useLiveRouteSeries } from '@/hooks/useForecastSeries';
import { useModelDrivers } from '@/hooks/useModelDrivers';

interface SharedLive { isLive: boolean; isLoading: boolean; history: { ds: string }[]; forecast: unknown[]; livePanamax: import("@/lib/simulationEngine").StockItem[]; liveBenchmark: import("@/lib/simulationEngine").StockItem[]; latestIndex: number | null; targetIndex: number | null; error: string | null }
interface SharedDrivers { drivers: { feature: string; importance: number; weight: number }[]; isLoading: boolean; error: string | null }
interface MarketForecastPillarProps {
  source: PortInfo;
  destination: DestinationPortInfo;
  vesselClass: VesselClassSpec;
  cargoQuantityMT: number;
  live?: SharedLive;
  drivers?: SharedDrivers;
}

export function MarketForecastPillar({
  source,
  destination,
  vesselClass,
  cargoQuantityMT,
  live: liveProp,
  drivers: driversProp,
}: MarketForecastPillarProps) {
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | 'YTD' | '1Y' | 'ALL'>('1Y');
  const [yAxisMode, setYAxisMode] = useState<FinancialYAxisMode>('PercentChange');
  const [expandDrivers, setExpandDrivers] = useState(true);
  const [completedTasks, setCompletedTasks] = useState<number[]>([0]);

  const fallbackRouteData = useMemo(() => {
    return generateRouteFinancialData(source.id, destination.id, timeframe, vesselClass.id, yAxisMode);
  }, [source.id, destination.id, timeframe, vesselClass.id, yAxisMode]);
  const fallbackLive = useLiveRouteSeries({ vesselId: vesselClass.id, sourceId: source.id, destId: destination.id, horizonDays: 30 });
  const fallbackDrivers = useModelDrivers(vesselClass.id);
  const liveSeries = liveProp ?? fallbackLive;
  const liveDrivers = driversProp ?? fallbackDrivers;
  const routeData = liveSeries.isLive
    ? { ...fallbackRouteData, panamaxForecast: liveSeries.livePanamax, marketBenchmark: liveSeries.liveBenchmark,
        currentBpiPoints: liveSeries.latestIndex ?? fallbackRouteData.currentBpiPoints,
        targetBpiPoints: liveSeries.targetIndex ?? fallbackRouteData.targetBpiPoints }
    : fallbackRouteData;

  const entryTiming = useMemo(() => {
    return computeEntryTiming(routeData, cargoQuantityMT);
  }, [routeData, cargoQuantityMT]);

  const toggleTask = (index: number) => {
    setCompletedTasks((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const isBpi = yAxisMode === 'BPI_Points';

  const tasks = [
    `Validate 3-Voyage COA price ceiling ($14.50/MT / 1,170 BPI) with shipowner brokers`,
    `Monitor ${destination.name} coal handling rate (${destination.dischargeRateTPD.toLocaleString()} TPD) for pre-arrival clearance`,
    `Check projected market trough window (${entryTiming.optimalEntryDateStart}) against supply chain inventory`,
    `Secure Singapore VLSFO marine bunker hedging contracts at $585/MT benchmark`,
  ];

  return (
    <div className="space-y-6 text-left">
      
      {/* Live model banner: every graphic here renders backend LightGBM output when reachable */}
      <div className="px-1 text-[11px] font-mono text-zinc-400">
        {liveSeries.isLoading ? "Loading live LightGBM forecast series..." : liveSeries.isLive
          ? `Live model chart: Baltic history ${liveSeries.history.length} pts + 30-day LightGBM forecast (${liveSeries.latestIndex} -> ${liveSeries.targetIndex}). SHAP: ${(liveDrivers.drivers[0] && liveDrivers.drivers[0].feature) ?? "loading..."}.`
          : `Backend offline — synthetic fallback chart. (${liveSeries.error ?? "start npm run dev backend"})`}
      </div>

      {/* 1. TradingView Style Financial Terminal */}
      <TradingViewChartTerminal
        source={source}
        destination={destination}
        vesselClass={vesselClass}
        panamaxData={routeData.panamaxForecast}
        benchmarkData={routeData.marketBenchmark}
        currentPanamaxRate={routeData.currentPanamaxRate}
        currentBenchmarkRate={routeData.currentBenchmarkRate}
        percentChangePanamax={routeData.percentChangePanamax}
        percentChangeBenchmark={routeData.percentChangeBenchmark}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        yAxisMode={yAxisMode}
        onYAxisModeChange={setYAxisMode}
        currentBpiPoints={routeData.currentBpiPoints}
        targetBpiPoints={routeData.targetBpiPoints}
      />

      {/* 2. Notion Callout Block: Decision Intelligence Recommendation */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#191919] border border-white/15 shadow-xl space-y-4">
        
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white shadow-inner shrink-0 mt-0.5">
            <Lightbulb className="h-5 w-5 text-amber-300" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
                  Notion Decision Callout
                </span>
                <Badge variant="outline" className="border-white/20 text-white bg-white/5 font-mono text-[10px]">
                  Confidence: {entryTiming.modelConfidenceScore}%
                </Badge>
              </div>

              <Badge className="bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 font-mono text-xs py-1 px-2.5">
                Est. Net Savings: +${entryTiming.potentialSavingsUSD.toLocaleString()} USD
              </Badge>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-1">
              {entryTiming.verdictTitle}
            </h3>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mt-1">
              {entryTiming.verdictDescription}
            </p>
          </div>
        </div>

        {/* 4 Notion Key Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-white/5">
          
          {/* Card 1: Optimal Window */}
          <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
              <Calendar className="h-3.5 w-3.5 text-white" />
              <span>Optimal Fixture Window</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-white font-mono">
              {entryTiming.optimalEntryDateStart}
            </div>
            <div className="text-[10px] text-zinc-500 font-mono">
              Projected trough in {entryTiming.daysUntilTrough} days
            </div>
          </div>

          {/* Card 2: Projected Trough Rate */}
          <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              <span>Historical Trough Rate</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-emerald-400 font-mono">
              {isBpi ? `${routeData.troughBpiPoints} pts` : `$${entryTiming.projectedRateAtTrough.toFixed(2)} / MT`}
            </div>
            <div className="text-[10px] text-zinc-500 font-mono">
              Feb 13 low (-54.1% below spot peak)
            </div>
          </div>

          {/* Card 3: 3-Voyage COA Lock Rate */}
          <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
              <Zap className="h-3.5 w-3.5 text-white" />
              <span>3-Voyage COA Lock Rate</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-white font-mono">
              {isBpi ? `${entryTiming.threeVoyageCOARate} pts` : `$${entryTiming.threeVoyageCOARate.toFixed(2)} / MT`}
            </div>
            <div className="text-[10px] text-zinc-500 font-mono">
              Guaranteed ceiling (hedged discount)
            </div>
          </div>

          {/* Card 4: Spot Expected Average */}
          <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
              <DollarSign className="h-3.5 w-3.5 text-amber-400" />
              <span>Current Spot Peak</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-amber-400 font-mono">
              {isBpi ? `${routeData.currentBpiPoints} pts` : `$${entryTiming.currentSpotRate.toFixed(2)} / MT`}
            </div>
            <div className="text-[10px] text-zinc-500 font-mono">
              Mar 31 database peak (+52.7% YTD)
            </div>
          </div>

        </div>

      </div>

      {/* 3. Notion Checklist Block: Commercial Action Plan */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#191919] border border-white/10 space-y-3">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-white" />
            <span>Charter Fixture Execution Checklist</span>
          </span>
          <span className="text-[11px] font-mono text-zinc-500">
            {completedTasks.length} of {tasks.length} completed
          </span>
        </div>

        <div className="space-y-1.5 pt-1">
          {tasks.map((task, idx) => {
            const isDone = completedTasks.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => toggleTask(idx)}
                className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition-colors text-xs ${
                  isDone ? 'text-zinc-500 line-through bg-zinc-900/30' : 'text-zinc-200 hover:bg-white/5'
                }`}
              >
                {isDone ? (
                  <CheckSquare className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Square className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
                )}
                <span className="leading-relaxed">{task}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Notion Toggle Block: Neural Forecasting Drivers */}
      <div className="rounded-2xl bg-[#191919] border border-white/10 overflow-hidden">
        <button
          onClick={() => setExpandDrivers(!expandDrivers)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            {expandDrivers ? (
              <ChevronDown className="h-4 w-4 text-zinc-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-zinc-400" />
            )}
            <span>Neural Forecasting Drivers & Correlated Macro Signals</span>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono border-white/10 text-zinc-400">
            {entryTiming.macroCatalysts.length} Catalysts
          </Badge>
        </button>

        {expandDrivers && (
          <div className="p-4 pt-0 space-y-2 border-t border-white/5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3">
              {entryTiming.macroCatalysts.map((cat, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-zinc-900/60 border border-white/5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-white shrink-0 mt-0.5" />
                  <span className="text-zinc-300">{cat}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
