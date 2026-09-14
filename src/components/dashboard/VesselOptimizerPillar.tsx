import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Ship,
  Anchor,
  Compass,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Layers,
  ArrowRight,
  TrendingDown,
  Info,
  Scale,
  Sparkles,
  Lightbulb,
  Kanban,
  Table as TableIcon,
} from 'lucide-react';
import {
  PortInfo,
  DestinationPortInfo,
  VesselClassSpec,
  evaluateFleetOptimization,
  VesselEvaluation,
} from '@/lib/simulationEngine';

interface VesselOptimizerPillarProps {
  source: PortInfo;
  destination: DestinationPortInfo;
  activeVesselClass: VesselClassSpec;
  onSelectVesselClass: (vessel: VesselClassSpec) => void;
}

export function VesselOptimizerPillar({
  source,
  destination,
  activeVesselClass,
  onSelectVesselClass,
}: VesselOptimizerPillarProps) {
  const [cargoSizeMT, setCargoSizeMT] = useState<number>(75000);
  const [viewFormat, setViewFormat] = useState<'cards' | 'table'>('cards');

  const optimization = useMemo(() => {
    return evaluateFleetOptimization(source.id, destination.id, cargoSizeMT);
  }, [source.id, destination.id, cargoSizeMT]);

  return (
    <div className="space-y-6 text-left">
      
      {/* 1. Notion Callout Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#191919] border border-white/15 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white shadow-inner shrink-0 mt-0.5">
            <Lightbulb className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
                Port Infrastructure Feasibility Audit
              </span>
              <Badge variant="outline" className="text-[10px] border-white/20 text-white font-mono">
                {destination.name}: Max {destination.maxDraft}m Draft
              </Badge>
            </div>
            <h2 className="text-base sm:text-xl font-bold text-white tracking-tight mt-0.5">
              Bulk Fleet Matching & Discharge Terminal Limit Screening
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
              Evaluating LOA, beam, laden draught, and mechanical unload rate for bulk carriers arriving from {source.name}.
            </p>
          </div>
        </div>

        {/* Parcel Volume Slider in Notion Header */}
        <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-white/10 min-w-[260px] space-y-2.5 self-start sm:self-auto">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 font-medium">Consignment Parcel</span>
            <span className="font-mono font-bold text-white text-sm">
              {cargoSizeMT.toLocaleString()} MT
            </span>
          </div>

          <Slider
            value={[cargoSizeMT]}
            min={25000}
            max={200000}
            step={5000}
            onValueChange={(val) => setCargoSizeMT(val[0])}
            className="w-full"
          />

          <div className="flex items-center justify-between gap-1 font-mono text-[10px] text-zinc-500">
            <button onClick={() => setCargoSizeMT(35000)} className="hover:text-white">35k</button>
            <button onClick={() => setCargoSizeMT(58000)} className="hover:text-white">58k</button>
            <button onClick={() => setCargoSizeMT(75000)} className="text-white font-bold hover:underline">75k</button>
            <button onClick={() => setCargoSizeMT(170000)} className="hover:text-white">170k</button>
          </div>
        </div>
      </div>

      {/* 2. View Toggle Bar (Notion Cards vs Notion Table) */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewFormat('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewFormat === 'cards'
                ? 'bg-white/10 text-white font-semibold'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Kanban className="h-3.5 w-3.5" />
            <span>Vessel Cards</span>
          </button>
          <button
            onClick={() => setViewFormat('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewFormat === 'table'
                ? 'bg-white/10 text-white font-semibold'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <TableIcon className="h-3.5 w-3.5" />
            <span>Full Economics Table</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-zinc-500">
          Click any class to set active fixture
        </span>
      </div>

      {/* 3. View A: Fleet Feasibility Cards */}
      {viewFormat === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {optimization.evaluations.map((evalItem) => {
            const isSelected = activeVesselClass.id === evalItem.vessel.id;
            const isOptimal = evalItem.status === 'OPTIMAL_FIT';
            const isRestricted = evalItem.status === 'DRAFT_RESTRICTED_LIGHTERAGE';
            const isIncompatible = evalItem.status === 'BERTH_INCOMPATIBLE';

            return (
              <div
                key={evalItem.vessel.id}
                onClick={() => onSelectVesselClass(evalItem.vessel)}
                className={`cursor-pointer group relative p-5 rounded-2xl transition-all duration-300 flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-zinc-900 border-white text-white shadow-2xl ring-1 ring-white/30'
                    : 'bg-[#191919] border-white/10 hover:border-white/20 hover:bg-zinc-900/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 border border-white/10 text-white">
                        <Ship className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white tracking-tight">
                          {evalItem.vessel.name.split(' ')[0]}
                        </div>
                        <div className="text-[10px] text-zinc-500 font-mono">
                          {evalItem.vessel.nominalDwtMT / 1000}k DWT
                        </div>
                      </div>
                    </div>

                    <Badge
                      variant={evalItem.statusBadgeVariant}
                      className="text-[10px] py-0.5 px-2 font-mono"
                    >
                      {evalItem.statusLabel}
                    </Badge>
                  </div>

                  {/* Freight Rate Metric */}
                  <div className="my-3 p-3 rounded-xl bg-zinc-900/60 border border-white/5 flex items-baseline justify-between">
                    <span className="text-[11px] text-zinc-400 uppercase font-mono">Unit Freight</span>
                    <div className="text-right">
                      <span className="text-lg font-bold font-mono text-white">
                        ${evalItem.costPerMetricTonneUSD}
                      </span>
                      <span className="text-[11px] text-zinc-500 font-mono"> / MT</span>
                    </div>
                  </div>

                  {/* Physical Limits Audit */}
                  <div className="space-y-2 text-xs font-mono pt-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-zinc-400">Laden Draft:</span>
                      <span className={evalItem.draftExceededMeters > 0 ? 'text-amber-400 font-semibold' : 'text-zinc-300'}>
                        {evalItem.vessel.ladenDraftMeters}m (Port: {destination.maxDraft}m)
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-zinc-400">Length (LOA):</span>
                      <span className={evalItem.loaExceededMeters > 0 ? 'text-red-400 font-semibold' : 'text-zinc-300'}>
                        {evalItem.vessel.loaMeters}m (Port: {destination.maxLOA}m)
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-zinc-400">Discharge Time:</span>
                      <span className="text-zinc-300">{evalItem.dischargeDays} Days</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-zinc-400 leading-relaxed">
                  {evalItem.recommendationNote}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. View B: Full Economics Table */}
      {viewFormat === 'table' && (
        <div className="rounded-xl border border-white/10 bg-zinc-950 overflow-hidden shadow-lg">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white/10 bg-zinc-900/50">
                <TableHead className="text-zinc-400 text-xs font-mono">Vessel Class</TableHead>
                <TableHead className="text-zinc-400 text-xs font-mono">Nominal DWT</TableHead>
                <TableHead className="text-zinc-400 text-xs font-mono">Voyage Days</TableHead>
                <TableHead className="text-zinc-400 text-xs font-mono">Bunker Burn</TableHead>
                <TableHead className="text-zinc-400 text-xs font-mono">Daily Hire Hire</TableHead>
                <TableHead className="text-zinc-400 text-xs font-mono">Port & Lighterage</TableHead>
                <TableHead className="text-zinc-400 text-xs font-mono">Total Turnaround</TableHead>
                <TableHead className="text-zinc-400 text-xs font-mono text-right">Freight Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {optimization.evaluations.map((ev) => (
                <TableRow key={ev.vessel.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell className="font-semibold text-white text-xs flex items-center gap-2">
                    <Ship className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{ev.vessel.name}</span>
                  </TableCell>
                  <TableCell className="text-xs text-zinc-300 font-mono">{(ev.vessel.nominalDwtMT || 0).toLocaleString()} MT</TableCell>
                  <TableCell className="text-xs text-zinc-300 font-mono">{ev.totalRoundTripDays} Days</TableCell>
                  <TableCell className="text-xs text-zinc-300 font-mono">${(ev.bunkerCostUSD || 0).toLocaleString()} USD</TableCell>
                  <TableCell className="text-xs text-zinc-300 font-mono">${(ev.dailyHireCostUSD || 0).toLocaleString()} USD</TableCell>
                  <TableCell className="text-xs text-zinc-300 font-mono">${((ev.portDuesUSD || 0) + (ev.lighteragePenaltyUSD || 0)).toLocaleString()} USD</TableCell>
                  <TableCell className="text-xs text-white font-mono font-bold">${(ev.totalVoyageCostUSD || 0).toLocaleString()} USD</TableCell>
                  <TableCell className="text-xs text-right font-mono font-bold text-emerald-400">${ev.costPerMetricTonneUSD} / MT</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* 5. Transshipment & Split-Parcel Alternative Callout */}
      {optimization.splitParcelAlternative && (
        <div className="p-4 rounded-xl bg-zinc-900/40 border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-white font-semibold text-xs">
            <Sparkles className="h-4 w-4 text-white" />
            <span>{optimization.splitParcelAlternative.recommendedStrategy}</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            {optimization.splitParcelAlternative.explanation}
          </p>
          <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-zinc-400">
            <span className="text-emerald-400 font-semibold">
              Projected Net Arbitrage Savings: +${optimization.splitParcelAlternative.savingsVsAlternativeUSD.toLocaleString()} USD
            </span>
          </div>
        </div>
      )}

    </div>
  );
}
