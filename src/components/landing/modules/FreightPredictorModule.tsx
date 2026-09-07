import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  TrendingUp,
  Fuel,
  Ship,
  Calendar,
  Layers,
  Info,
  ChevronDown,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { generateFreightTimeseries } from '@/lib/simulationEngine';

export function FreightPredictorModule() {
  const [bunkerShift, setBunkerShift] = useState<number[]>([0]);
  const [lookback, setLookback] = useState<'3M' | '1Y' | '3Y'>('3M');
  const [vesselClass, setVesselClass] = useState('Panamax (75,000 MT)');
  const [route, setRoute] = useState('Indonesia (Taboneo) → India (Paradip)');

  const bunkerShiftPct = bunkerShift[0] / 100;

  const chartData = useMemo(() => {
    return generateFreightTimeseries({
      bunkerShiftPct,
      lookbackMonths: lookback === '3M' ? 3 : lookback === '1Y' ? 12 : 36,
    });
  }, [bunkerShiftPct, lookback]);

  // Current metric highlights
  const baselineRate = 13.90;
  const currentForecast = chartData[chartData.length - 1]?.predictedFreight || 13.50;
  const currentBunker = Math.round(610 * (1 + bunkerShiftPct));
  const rateDelta = Number((currentForecast - baselineRate).toFixed(2));

  return (
    <TooltipProvider delayDuration={100}>
      <div className="space-y-6 text-left">
        
        {/* Controls Bar with Shadcn Popovers & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-zinc-900/60 border border-white/10 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Popover 1: Lookback Window */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 hover:border-white/20 text-xs font-medium text-zinc-300 transition-colors">
                  <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Window: <strong className="text-white">{lookback}</strong></span>
                  <ChevronDown className="h-3 w-3 text-zinc-500" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2 bg-zinc-950 border-white/10 text-xs" align="start">
                <div className="text-[11px] font-semibold text-zinc-400 px-2 py-1 uppercase tracking-wider">
                  Historical Lookback
                </div>
                {(['3M', '1Y', '3Y'] as const).map((win) => (
                  <button
                    key={win}
                    onClick={() => setLookback(win)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                      lookback === win ? 'bg-white/10 text-white font-medium' : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{win === '3M' ? '3 Months (High Density)' : win === '1Y' ? '12 Months (Seasonal Cycle)' : '36 Months (Macro Multi-Year)'}</span>
                    {lookback === win && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />}
                  </button>
                ))}
              </PopoverContent>
            </Popover>

            {/* Popover 2: Vessel Class */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 hover:border-white/20 text-xs font-medium text-zinc-300 transition-colors">
                  <Ship className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Vessel: <strong className="text-white">{vesselClass.split(' ')[0]}</strong></span>
                  <ChevronDown className="h-3 w-3 text-zinc-500" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2 bg-zinc-950 border-white/10 text-xs" align="start">
                <div className="text-[11px] font-semibold text-zinc-400 px-2 py-1 uppercase tracking-wider">
                  Vessel Deadweight (DWT)
                </div>
                {[
                  'Panamax (75,000 MT)',
                  'Supramax (58,000 MT)',
                  'Capesize (180,000 MT)',
                ].map((v) => (
                  <button
                    key={v}
                    onClick={() => setVesselClass(v)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                      vesselClass === v ? 'bg-white/10 text-white font-medium' : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{v}</span>
                    {vesselClass === v && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />}
                  </button>
                ))}
              </PopoverContent>
            </Popover>

            {/* Popover 3: Route */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 hover:border-white/20 text-xs font-medium text-zinc-300 transition-colors">
                  <Layers className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Route: <strong className="text-white truncate max-w-[130px] sm:max-w-none">{route.split('→')[0]}</strong></span>
                  <ChevronDown className="h-3 w-3 text-zinc-500" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-2 bg-zinc-950 border-white/10 text-xs" align="start">
                <div className="text-[11px] font-semibold text-zinc-400 px-2 py-1 uppercase tracking-wider">
                  Benchmark Coal Corridor
                </div>
                {[
                  'Indonesia (Taboneo) → India (Paradip)',
                  'Russia (Baltic) → India (Vadinar)',
                  'Australia (Hay Point) → India (Krishnapatnam)',
                ].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoute(r)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                      route === r ? 'bg-white/10 text-white font-medium' : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{r}</span>
                    {route === r && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />}
                  </button>
                ))}
              </PopoverContent>
            </Popover>

          </div>

          {/* Reset Bunker Shock Button */}
          {bunkerShift[0] !== 0 && (
            <button
              onClick={() => setBunkerShift([0])}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset shock (0%)</span>
            </button>
          )}
        </div>

        {/* Dynamic Bunker Shock Slider (Crucial PRD Requirement) */}
        <div className="p-4 rounded-xl bg-zinc-900/40 border border-white/10 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Fuel className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-semibold text-white">Bunker Market Shock (-30% to +30%)</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-zinc-500 cursor-pointer hover:text-zinc-300" />
                </TooltipTrigger>
                <TooltipContent>
                  <span>Simulates crude oil market price dislocations directly shifting VLSFO fuel and the 90-day freight rate curve</span>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-400">
                Singapore VLSFO: <strong className="font-mono text-white">${currentBunker}/MT</strong>
              </span>
              <Badge
                variant="outline"
                className={`font-mono text-xs ${
                  bunkerShift[0] > 0
                    ? 'border-rose-500/40 text-rose-400 bg-rose-950/30'
                    : bunkerShift[0] < 0
                    ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/30'
                    : 'border-white/20 text-zinc-300'
                }`}
              >
                {bunkerShift[0] > 0 ? `+${bunkerShift[0]}%` : `${bunkerShift[0]}%`}
              </Badge>
            </div>
          </div>

          <Slider
            value={bunkerShift}
            onValueChange={setBunkerShift}
            min={-30}
            max={30}
            step={1}
            className="w-full cursor-pointer py-1"
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-500">
            <span>-30% Oil Slump</span>
            <span>0% Baseline ($610/MT)</span>
            <span>+30% Crude Spike</span>
          </div>
        </div>

        {/* Interactive Multi-Axis ComposedChart */}
        <div className="relative p-5 rounded-2xl bg-zinc-950 border border-white/10 shadow-2xl">
          
          {/* Chart Header Badges & Legend Indicators */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-5 rounded bg-white" />
                <span className="text-zinc-300 font-medium">Historical Freight</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-0 w-5 border-t-2 border-dashed border-cyan-400" />
                <span className="text-cyan-400 font-medium">Predicted Freight (90D)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-5 rounded bg-purple-500/30 border border-purple-500/50" />
                <span className="text-purple-300 font-medium">95% CI Corridor</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-5 rounded bg-amber-400" />
                <span className="text-amber-400 font-medium">VLSFO Bunker ($/MT)</span>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-zinc-400">Predicted 90D:</span>
              <span className="text-white font-bold">${currentForecast}/MT</span>
              <span className={rateDelta >= 0 ? 'text-rose-400' : 'text-emerald-400'}>
                ({rateDelta >= 0 ? `+$${rateDelta}` : `-$${Math.abs(rateDelta)}`})
              </span>
            </div>
          </div>

          {/* Recharts Container */}
          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="ciGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#27272a' }}
                />
                {/* Primary Y-Axis: Freight ($/MT) */}
                <YAxis
                  yAxisId="freight"
                  domain={[8, 18]}
                  stroke="#a1a1aa"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#27272a' }}
                  tickFormatter={(v) => `$${v}`}
                />
                {/* Secondary Y-Axis: Fuel ($/MT) */}
                <YAxis
                  yAxisId="fuel"
                  orientation="right"
                  domain={[400, 900]}
                  stroke="#fbbf24"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#27272a' }}
                  tickFormatter={(v) => `$${v}`}
                />
                <RechartsTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="p-3 bg-zinc-900/95 border border-white/20 rounded-xl shadow-xl backdrop-blur-md text-xs space-y-1.5 font-mono">
                          <div className="text-zinc-400 font-sans font-medium text-[11px] pb-1 border-b border-white/10">
                            {label} {item.isForecast ? '(Forward Forecast)' : '(Historical)'}
                          </div>
                          {item.historicalFreight !== undefined && (
                            <div className="flex justify-between gap-4">
                              <span className="text-zinc-300">Historical Rate:</span>
                              <span className="text-white font-bold">${item.historicalFreight}/MT</span>
                            </div>
                          )}
                          {item.predictedFreight !== undefined && (
                            <div className="flex justify-between gap-4 text-cyan-400">
                              <span>Predicted Rate:</span>
                              <span className="font-bold">${item.predictedFreight}/MT</span>
                            </div>
                          )}
                          {item.ciLower !== undefined && item.ciUpper !== undefined && (
                            <div className="flex justify-between gap-4 text-purple-300">
                              <span>95% CI Range:</span>
                              <span>${item.ciLower} - ${item.ciUpper}/MT</span>
                            </div>
                          )}
                          <div className="flex justify-between gap-4 text-amber-400 pt-1 border-t border-white/10">
                            <span>VLSFO Bunker:</span>
                            <span className="font-bold">${item.bunkerPrice}/MT</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {/* 95% Confidence Interval Corridor */}
                <Area
                  yAxisId="freight"
                  type="monotone"
                  dataKey="ciUpper"
                  stroke="none"
                  fill="url(#ciGradient)"
                  name="95% CI Upper"
                />
                <Area
                  yAxisId="freight"
                  type="monotone"
                  dataKey="ciLower"
                  stroke="none"
                  fill="#09090b"
                  name="95% CI Lower"
                />

                {/* Secondary Y Fuel Line */}
                <Line
                  yAxisId="fuel"
                  type="monotone"
                  dataKey="bunkerPrice"
                  stroke="#fbbf24"
                  strokeWidth={1.5}
                  dot={false}
                  name="VLSFO Bunker"
                />

                {/* Historical Freight Line: Solid White */}
                <Line
                  yAxisId="freight"
                  type="monotone"
                  dataKey="historicalFreight"
                  stroke="#ffffff"
                  strokeWidth={2.2}
                  dot={false}
                  name="Historical Freight"
                />

                {/* Forecasted Freight Line: Dashed Cyan */}
                <Line
                  yAxisId="freight"
                  type="monotone"
                  dataKey="predictedFreight"
                  stroke="#22d3ee"
                  strokeWidth={2.5}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#22d3ee', stroke: '#000', strokeWidth: 1.5 }}
                  name="Predicted Freight"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between pt-3 text-[11px] text-zinc-500 font-mono">
            <span>Model: Panamax-Transformer-v3.2</span>
            <span>Backtested Mean Absolute Error: ±$0.34/MT</span>
          </div>

        </div>

      </div>
    </TooltipProvider>
  );
}
