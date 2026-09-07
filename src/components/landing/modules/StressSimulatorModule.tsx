import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertTriangle,
  Flame,
  Wind,
  ShieldCheck,
  TrendingUp,
  Clock,
  DollarSign,
  Compass,
  ArrowUpRight,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';
import {
  STRESS_SCENARIOS,
  StressScenarioId,
} from '@/lib/simulationEngine';

export function StressSimulatorModule() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<StressScenarioId>('malacca');

  const scenario = STRESS_SCENARIOS[selectedScenarioId];

  return (
    <TooltipProvider delayDuration={100}>
      <div className="space-y-6 text-left">
        
        {/* Preset Buttons Header (Crucial PRD Requirement: [Malacca Bottleneck], [Bunker Shock], [Cyclone Alert]) */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 backdrop-blur-md space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                Select Black-Swan Macro Disruption Preset
              </span>
            </div>
            <span className="text-[11px] text-zinc-400">
              One-click dynamic stress injection into neural forecast
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* 1. Baseline */}
            <button
              onClick={() => setSelectedScenarioId('baseline')}
              className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between gap-1.5 ${
                selectedScenarioId === 'baseline'
                  ? 'border-emerald-500/50 bg-emerald-950/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                  : 'border-white/10 bg-black/40 hover:border-white/20 hover:bg-zinc-900/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <CheckCircle2 className={`h-4 w-4 ${selectedScenarioId === 'baseline' ? 'text-emerald-400' : 'text-zinc-500'}`} />
                <span className="text-[10px] font-mono text-zinc-500">Normal</span>
              </div>
              <div className="text-xs font-semibold text-white">Baseline Status</div>
            </button>

            {/* 2. Malacca Bottleneck */}
            <button
              onClick={() => setSelectedScenarioId('malacca')}
              className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between gap-1.5 ${
                selectedScenarioId === 'malacca'
                  ? 'border-amber-500/50 bg-amber-950/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                  : 'border-white/10 bg-black/40 hover:border-white/20 hover:bg-zinc-900/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <Compass className={`h-4 w-4 ${selectedScenarioId === 'malacca' ? 'text-amber-400' : 'text-zinc-500'}`} />
                <span className="text-[10px] font-mono text-amber-400">Chokepoint</span>
              </div>
              <div className="text-xs font-semibold text-white">[Malacca Bottleneck]</div>
            </button>

            {/* 3. Bunker Shock */}
            <button
              onClick={() => setSelectedScenarioId('bunker')}
              className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between gap-1.5 ${
                selectedScenarioId === 'bunker'
                  ? 'border-rose-500/50 bg-rose-950/30 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                  : 'border-white/10 bg-black/40 hover:border-white/20 hover:bg-zinc-900/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <Flame className={`h-4 w-4 ${selectedScenarioId === 'bunker' ? 'text-rose-400' : 'text-zinc-500'}`} />
                <span className="text-[10px] font-mono text-rose-400">+25% Fuel</span>
              </div>
              <div className="text-xs font-semibold text-white">[Bunker Shock]</div>
            </button>

            {/* 4. Cyclone Alert */}
            <button
              onClick={() => setSelectedScenarioId('cyclone')}
              className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between gap-1.5 ${
                selectedScenarioId === 'cyclone'
                  ? 'border-purple-500/50 bg-purple-950/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                  : 'border-white/10 bg-black/40 hover:border-white/20 hover:bg-zinc-900/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <Wind className={`h-4 w-4 ${selectedScenarioId === 'cyclone' ? 'text-purple-400' : 'text-zinc-500'}`} />
                <span className="text-[10px] font-mono text-purple-400">Category 4</span>
              </div>
              <div className="text-xs font-semibold text-white">[Cyclone Alert]</div>
            </button>
          </div>

          <div className="p-2.5 rounded-lg bg-black/50 border border-white/5 flex items-center justify-between text-xs">
            <span className="text-zinc-400">{scenario.description}</span>
            <Badge variant="outline" className="text-[10px] font-mono border-white/10 text-zinc-300">
              Active Multiplier: {scenario.id}
            </Badge>
          </div>
        </div>

        {/* 4 Immediate Financial Impact Metric Cards (Crucial PRD Requirement) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Metric Card 1: Freight Inflation */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 shadow-xl space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Freight Inflation
              </span>
              <TrendingUp className={`h-4 w-4 ${scenario.freightInflationPct > 0 ? 'text-rose-400' : 'text-emerald-400'}`} />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-3xl font-bold font-mono tracking-tight ${scenario.freightInflationPct > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {scenario.freightInflationPct > 0 ? `+${scenario.freightInflationPct}%` : '0%'}
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 pt-2 border-t border-white/5">
              {scenario.freightInflationPct > 0
                ? `Adds ~$${((13.90 * scenario.freightInflationPct) / 100).toFixed(2)}/MT to spot index`
                : 'Benchmark steady at $13.90/MT'}
            </div>
          </div>

          {/* Metric Card 2: Delivery Slippage */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 shadow-xl space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Delivery Slippage
              </span>
              <Clock className={`h-4 w-4 ${scenario.deliverySlippageDays > 0 ? 'text-amber-400' : 'text-emerald-400'}`} />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-3xl font-bold font-mono tracking-tight ${scenario.deliverySlippageDays > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {scenario.deliverySlippageDays > 0 ? `+${scenario.deliverySlippageDays} Days` : 'On Schedule'}
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 pt-2 border-t border-white/5">
              {scenario.deliverySlippageDays > 0
                ? 'Queue congestion / weather delay'
                : 'Transit window clear: 9.2 days total'}
            </div>
          </div>

          {/* Metric Card 3: Demurrage Exposure */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 shadow-xl space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Demurrage Exposure
              </span>
              <DollarSign className={`h-4 w-4 ${scenario.demurrageExposureUSD > 0 ? 'text-rose-400' : 'text-emerald-400'}`} />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-3xl font-bold font-mono tracking-tight ${scenario.demurrageExposureUSD > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {scenario.demurrageExposureUSD > 0 ? `-$${(scenario.demurrageExposureUSD / 1000).toFixed(0)}k` : '$0 (Safe)'}
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 pt-2 border-t border-white/5">
              {scenario.demurrageExposureUSD > 0
                ? `Calculated on $25k/day laytime overrun`
                : 'Despatch credit maintained'}
            </div>
          </div>

          {/* Metric Card 4: Model Confidence */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 shadow-xl space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Model Confidence
              </span>
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-mono text-cyan-400 tracking-tight">
                {scenario.confidenceScore}%
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 pt-2 border-t border-white/5">
              Monte Carlo (50,000 runs backtested)
            </div>
          </div>

        </div>

        {/* Actionable Strategy Recommendation Banner */}
        <div className="p-4 rounded-xl bg-zinc-900/40 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Recommended Risk Mitigation Directive</div>
              <div className="text-xs text-zinc-300 mt-0.5">{scenario.recommendedAction}</div>
            </div>
          </div>

          <Badge variant="glow" className="text-xs font-mono py-1 px-3 self-start sm:self-auto">
            Action Ready
          </Badge>
        </div>

      </div>
    </TooltipProvider>
  );
}
