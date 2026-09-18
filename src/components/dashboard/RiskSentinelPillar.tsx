import React, { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  ShieldAlert,
  AlertTriangle,
  Compass,
  Waves,
  Clock,
  Fuel,
  ShieldCheck,
  Zap,
  Info,
  CheckCircle2,
  Anchor,
  Lightbulb,
} from 'lucide-react';
import {
  PortInfo,
  DestinationPortInfo,
  VesselClassSpec,
  generateRiskAlerts,
  DESTINATION_INDIAN_PORTS,
} from '@/lib/simulationEngine';

interface RiskSentinelPillarProps {
  source: PortInfo;
  destination: DestinationPortInfo;
  vesselClass: VesselClassSpec;
}

export function RiskSentinelPillar({ source, destination, vesselClass }: RiskSentinelPillarProps) {
  const assessment = useMemo(() => {
    return generateRiskAlerts(source.id, destination.id, vesselClass.id);
  }, [source.id, destination.id, vesselClass.id]);

  return (
    <div className="space-y-6 text-left">
      
      {/* 1. Notion Callout Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#191919] border border-white/15 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white shadow-inner shrink-0 mt-0.5">
            <ShieldCheck className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
                Pillar D: Risk Sentinel & Early Warning
              </span>
              <Badge variant="outline" className="text-[10px] border-white/20 text-white font-mono">
                Port Surveillance Engine
              </Badge>
            </div>
            <h2 className="text-base sm:text-xl font-bold text-white tracking-tight mt-0.5">
              Corridor Risk Index & East Coast Congestion Telemetry
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
              Live monitoring of Bay of Bengal tropical swell, East Coast coal berth wait times, Singapore bunker volatility, and chokepoints.
            </p>
          </div>
        </div>

        {/* Risk Score Gauge */}
        <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-white/10 flex items-center gap-3.5 min-w-[220px] self-start sm:self-auto">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl border font-bold text-lg font-mono ${
            assessment.routeRiskScore >= 75
              ? 'bg-red-950/60 border-red-500/40 text-red-400'
              : assessment.routeRiskScore >= 55
              ? 'bg-amber-950/60 border-amber-500/40 text-amber-400'
              : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
          }`}>
            {assessment.routeRiskScore}
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
              Route Risk Score
            </span>
            <div className="text-sm font-bold text-white font-mono flex items-center gap-1.5">
              <span>{assessment.riskLevel} RISK</span>
              <span className="text-zinc-500 text-xs font-normal">/ 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Four Active Risk Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assessment.alerts.map((alert) => {
          const isCritical = alert.severity === 'CRITICAL';
          const isElevated = alert.severity === 'ELEVATED';

          return (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                isCritical
                  ? 'bg-[#191919] border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
                  : isElevated
                  ? 'bg-[#191919] border-amber-500/30'
                  : 'bg-[#191919] border-white/10'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                      isCritical
                        ? 'bg-red-950/60 border-red-500/30 text-red-400'
                        : isElevated
                        ? 'bg-amber-950/60 border-amber-500/30 text-amber-400'
                        : 'bg-zinc-800 border-white/10 text-zinc-300'
                    }`}>
                      {alert.category === 'PORT_CONGESTION' && <Clock className="h-4 w-4" />}
                      {alert.category === 'MONSOON_WEATHER' && <Waves className="h-4 w-4" />}
                      {alert.category === 'BUNKER_VOLATILITY' && <Fuel className="h-4 w-4" />}
                      {alert.category === 'GEOPOLITICAL_CHOKEPOINT' && <ShieldAlert className="h-4 w-4" />}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white tracking-tight">
                        {alert.title}
                      </h3>
                      <p className="text-[10px] text-zinc-500 font-mono">
                        {alert.locationOrRoute}
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant={isCritical ? 'destructive' : isElevated ? 'outline' : 'secondary'}
                    className={`text-[10px] font-mono ${
                      isElevated ? 'border-amber-500/40 text-amber-400' : ''
                    }`}
                  >
                    {alert.severity}
                  </Badge>
                </div>

                {/* Metric Strip */}
                <div className="my-3 p-3 rounded-xl bg-zinc-900/60 border border-white/5 flex items-center justify-between font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase">
                      {alert.metricLabel}
                    </span>
                    <span className="font-bold text-white mt-0.5 block">
                      {alert.metricValue}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 block uppercase">
                      Exposure Estimate
                    </span>
                    <span className="font-bold text-amber-300 mt-0.5 block">
                      {alert.impactUSD}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actionable Mitigation */}
              <div className="mt-2 pt-3 border-t border-white/5 space-y-1">
                <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold tracking-wider flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  Recommended Operational Mitigation
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {alert.recommendation}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. East Coast Indian Port Berth Queue Matrix */}
      <div className="rounded-xl border border-white/10 bg-zinc-950 overflow-hidden shadow-lg space-y-3 p-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Anchor className="h-4 w-4 text-white" />
            <h3 className="text-sm font-bold text-white">Baltic Destination Port Berth Queues</h3>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono border-white/15 text-zinc-400">
            Live Berth Telemetry
          </Badge>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/10 bg-zinc-900/50">
              <TableHead className="text-zinc-400 text-xs font-mono">Port Name</TableHead>
              <TableHead className="text-zinc-400 text-xs font-mono">Draft Limit</TableHead>
              <TableHead className="text-zinc-400 text-xs font-mono">Discharge Speed</TableHead>
              <TableHead className="text-zinc-400 text-xs font-mono">Avg Waiting Queue</TableHead>
              <TableHead className="text-zinc-400 text-xs font-mono">Demurrage Risk</TableHead>
              <TableHead className="text-zinc-400 text-xs font-mono text-right">Congestion</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DESTINATION_INDIAN_PORTS.filter((p) => p.isSIHCorePort).map((port) => (
              <TableRow key={port.id} className={port.id === destination.id ? 'bg-white/5 font-medium' : ''}>
                <TableCell className="font-semibold text-white text-xs">
                  <div className="flex items-center gap-2">
                    <span>{port.name}</span>
                    <span className="text-[10px] text-zinc-500">({port.state})</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-zinc-300 text-xs">
                  {port.draftMax.split(' ')[0]}
                </TableCell>
                <TableCell className="font-mono text-zinc-300 text-xs">
                  {port.dischargeRateTPD.toLocaleString()} TPD
                </TableCell>
                <TableCell className="font-mono text-zinc-200 text-xs">
                  <span className={port.berthQueueDaysAvg > 3.0 ? 'text-amber-400 font-bold' : ''}>
                    {port.berthQueueDaysAvg} Days
                  </span>
                </TableCell>
                <TableCell className="font-mono text-xs text-zinc-400">
                  ~${Math.round(port.berthQueueDaysAvg * vesselClass.dailyCharterBenchmarkUSD).toLocaleString()} USD
                </TableCell>
                <TableCell className="text-right font-mono font-bold text-xs">
                  <span className={port.congestionIndex > 1.05 ? 'text-red-400' : port.congestionIndex > 1.0 ? 'text-amber-400' : 'text-emerald-400'}>
                    {(port.congestionIndex * 100).toFixed(0)}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

    </div>
  );
}
