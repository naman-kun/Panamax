import React, { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Anchor,
  Navigation,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Clock,
  Compass,
  Zap,
  RotateCw,
  Sparkles,
  Lightbulb,
} from 'lucide-react';
import {
  DestinationPortInfo,
  VesselClassSpec,
  computeIdleScenario,
} from '@/lib/simulationEngine';

interface IdleFleetPillarProps {
  destination: DestinationPortInfo;
  vesselClass: VesselClassSpec;
}

export function IdleFleetPillar({ destination, vesselClass }: IdleFleetPillarProps) {
  const scenario = useMemo(() => {
    return computeIdleScenario(vesselClass.id, destination.id);
  }, [vesselClass.id, destination.id]);

  return (
    <div className="space-y-6 text-left">
      
      {/* 1. Notion Callout Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#191919] border border-white/15 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white shadow-inner shrink-0 mt-0.5">
            <RotateCw className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
                Pillar C: Idle Fleet & Cabotage Triangulation
              </span>
              <Badge variant="outline" className="text-[10px] border-white/20 text-white font-mono">
                Turnaround Engine
              </Badge>
            </div>
            <h2 className="text-base sm:text-xl font-bold text-white tracking-tight mt-0.5">
              Post-Discharge Idle Mitigation & Route Triangulation
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
              Eliminating deadweight idle days and uncompensated ballast voyages after bulk coal discharge at {destination.name}.
            </p>
          </div>
        </div>

        <Badge className="bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 font-mono text-xs py-1.5 px-3 self-start sm:self-auto">
          Top Fixture: +${scenario.topRecommendation.netFinancialOutcomeUSD.toLocaleString()} USD Net
        </Badge>
      </div>

      {/* 2. Executive Notion Summary Block */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#191919] border border-white/10 space-y-2">
        <div className="flex items-center gap-2 text-white font-semibold text-xs">
          <Sparkles className="h-4 w-4 text-white" />
          <span>Algorithmic Recommendation for {vesselClass.name} at {destination.name}</span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          {scenario.executiveSummary}
        </p>
      </div>

      {/* 3. Three Strategic Options Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {scenario.strategies.map((strategy) => {
          const isRecommended = strategy.isRecommended;
          const isLoss = strategy.netFinancialOutcomeUSD < 0;

          return (
            <div
              key={strategy.id}
              className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                isRecommended
                  ? 'bg-zinc-900 border-white text-white shadow-2xl ring-1 ring-white/30'
                  : 'bg-[#191919] border-white/10'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      {strategy.title}
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      {strategy.subtitle}
                    </p>
                  </div>
                  <Badge
                    variant={isRecommended ? 'default' : 'outline'}
                    className={`text-[10px] font-mono shrink-0 ${
                      isRecommended
                        ? 'bg-white text-black font-bold'
                        : 'border-white/10 text-zinc-400'
                    }`}
                  >
                    {strategy.badge}
                  </Badge>
                </div>

                {/* Financial Outcome Card */}
                <div className={`my-4 p-3.5 rounded-xl border flex items-baseline justify-between ${
                  isLoss
                    ? 'bg-red-950/20 border-red-500/20 text-red-300'
                    : 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300'
                }`}>
                  <span className="text-[11px] uppercase font-mono font-medium">Net Contribution</span>
                  <div className="text-right">
                    <span className="text-xl font-bold font-mono">
                      {isLoss ? '-' : '+'}${Math.abs(strategy.netFinancialOutcomeUSD).toLocaleString()}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-mono ml-1">USD</span>
                  </div>
                </div>

                {/* Metrics Breakdown */}
                <div className="space-y-2 text-xs font-mono pb-2 border-b border-white/5">
                  <div className="flex justify-between items-center text-zinc-400">
                    <span>Duration:</span>
                    <span className="text-zinc-200">{strategy.totalDurationDays} Days</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-400">
                    <span>Daily Burn / Rate:</span>
                    <span className="text-zinc-200">${strategy.dailyCostUSD.toLocaleString()}/day</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-400">
                    <span>Feasibility Score:</span>
                    <span className={isRecommended ? 'text-emerald-400 font-bold' : 'text-zinc-300'}>
                      {strategy.feasibilityScore}/100
                    </span>
                  </div>
                </div>

                {/* Action Items */}
                <div className="space-y-1.5 pt-3">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold tracking-wider">
                    Operational Checklist
                  </span>
                  {strategy.actionItems.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] text-zinc-300">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Risk Note */}
              <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-zinc-500">
                <span className="text-zinc-400 font-medium">Key Risk: </span>
                {strategy.keyRisk}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
