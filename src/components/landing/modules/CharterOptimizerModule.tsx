import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
  Zap,
  Ship,
  TrendingDown,
  Scale,
  Calendar,
  ChevronDown,
  Info,
  DollarSign,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { calculateCharterOptimization } from '@/lib/simulationEngine';

export function CharterOptimizerModule() {
  const [volume, setVolume] = useState<number[]>([150000]); // 150,000 MT (2 Panamax vessels)
  const [deliveryWindow, setDeliveryWindow] = useState<'30D' | '60D' | '90D'>('30D');
  const [viewMode, setViewMode] = useState<'comparison' | 'optimized'>('comparison');

  const optimization = useMemo(() => {
    return calculateCharterOptimization(volume[0]);
  }, [volume]);

  // Waterfall chart formatted data
  const chartData = useMemo(() => {
    return optimization.components.map((c) => ({
      name: c.name,
      'Spot Cost': Math.round(c.spot / 1000), // in $k USD
      'Optimized AI Cost': Math.round(c.optimized / 1000), // in $k USD
      savings: Math.round((c.spot - c.optimized) / 1000),
    }));
  }, [optimization]);

  const savingsPerMT = (optimization.netSavings / volume[0]).toFixed(2);

  return (
    <TooltipProvider delayDuration={100}>
      <div className="space-y-6 text-left">
        
        {/* Controls Bar: Cargo Volume Slider & Delivery Window */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 backdrop-blur-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                <Scale className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white">Cargo Procurement Volume</span>
                <p className="text-[11px] text-zinc-400">Adjust coal/ore tonnage to calculate optimum Panamax fleet split</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 hover:border-white/20 text-xs font-medium text-white transition-colors">
                    <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Target: <strong>{deliveryWindow === '30D' ? '30-Day Window' : deliveryWindow === '60D' ? '60-Day Forward' : '90-Day Seasonal'}</strong></span>
                    <ChevronDown className="h-3 w-3 text-zinc-500" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2 bg-zinc-950 border-white/10 text-xs" align="end">
                  <div className="text-[11px] font-semibold text-zinc-400 px-2 py-1 uppercase tracking-wider">
                    Discharge Window
                  </div>
                  {[
                    { id: '30D', label: '30-Day Window (Spot Focus)' },
                    { id: '60D', label: '60-Day Forward (Staggered)' },
                    { id: '90D', label: '90-Day Seasonal (Quarterly)' },
                  ].map((w) => (
                    <button
                      key={w.id}
                      onClick={() => setDeliveryWindow(w.id as any)}
                      className={`w-full text-left px-2 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                        deliveryWindow === w.id ? 'bg-white/10 text-white font-medium' : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span>{w.label}</span>
                      {deliveryWindow === w.id && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>

              <Badge variant="glow" className="font-mono text-xs py-1 px-2.5">
                {optimization.vesselsRequired} {optimization.vesselsRequired === 1 ? 'Vessel' : 'Vessels'} (75k DWT)
              </Badge>
            </div>

          </div>

          {/* Volume Slider (50k to 300k MT) */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">Total Volume:</span>
              <span className="font-mono text-sm font-bold text-white">
                {volume[0].toLocaleString()} MT <span className="text-zinc-500 font-normal">({(volume[0] / 1000)}k Tonnes)</span>
              </span>
            </div>
            <Slider
              value={volume}
              onValueChange={setVolume}
              min={50000}
              max={300000}
              step={25000}
              className="w-full cursor-pointer py-1"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>50,000 MT (Single Fixture)</span>
              <span>150,000 MT (Dual Vessel)</span>
              <span>300,000 MT (Capesize / Fleet Program)</span>
            </div>
          </div>
        </div>

        {/* Massive Calculated Verdict Alert Banner (Crucial PRD Requirement) */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-zinc-900/60 to-zinc-950 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.12)] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold tracking-wider">
              <Zap className="h-4 w-4" />
              <span>PRESCRIPTIVE AI DECISION ENGINE</span>
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[11px] font-mono">
              Confidence: 96.4%
            </Badge>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
            {optimization.verdict}
          </h3>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs border-t border-white/10">
            <div>
              <span className="text-zinc-400">Total Spot Baseline: </span>
              <span className="font-mono text-zinc-300 font-medium">${(optimization.spotTotal / 1000000).toFixed(2)}M</span>
            </div>
            <div>
              <span className="text-zinc-400">AI Optimized Cost: </span>
              <span className="font-mono text-white font-semibold">${(optimization.optimizedTotal / 1000000).toFixed(2)}M</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono">
              <span>Net Savings:</span>
              <span className="text-base text-emerald-400">+${optimization.netSavings.toLocaleString()} USD</span>
              <span className="text-xs font-normal text-emerald-500">(-${savingsPerMT}/MT)</span>
            </div>
          </div>
        </div>

        {/* Landed Cost Waterfall BarChart (Spot vs Optimized AI Cost) */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                Landed Cost Waterfall Breakdown ($'000 USD)
              </h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Comprehensive CIF component analysis comparing spot market exposure vs AI-timed fixtures
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="h-3 w-3 rounded bg-zinc-600" />
                <span className="text-zinc-400">Current Spot Cost</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="h-3 w-3 rounded bg-emerald-400" />
                <span className="text-emerald-400 font-medium">Optimized AI Cost</span>
              </div>
            </div>
          </div>

          {/* Recharts BarChart Container */}
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#27272a' }}
                />
                <YAxis
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#27272a' }}
                  tickFormatter={(v) => `$${v}k`}
                />
                <RechartsTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="p-3 bg-zinc-900/95 border border-white/20 rounded-xl shadow-xl backdrop-blur-md text-xs space-y-1 font-mono">
                          <div className="text-white font-sans font-semibold pb-1 border-b border-white/10">
                            {label} Component
                          </div>
                          <div className="flex justify-between gap-4 text-zinc-400">
                            <span>Spot Cost:</span>
                            <span className="text-white font-bold">${item['Spot Cost'].toLocaleString()}k</span>
                          </div>
                          <div className="flex justify-between gap-4 text-emerald-400">
                            <span>Optimized:</span>
                            <span className="font-bold">${item['Optimized AI Cost'].toLocaleString()}k</span>
                          </div>
                          {item.savings > 0 && (
                            <div className="flex justify-between gap-4 text-emerald-300 pt-1 border-t border-white/10 font-bold">
                              <span>Net Saved:</span>
                              <span>+${item.savings.toLocaleString()}k</span>
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="Spot Cost" fill="#52525b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Optimized AI Cost" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Bottom KPI summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/10 text-xs">
            <div className="p-2.5 rounded-lg bg-zinc-900/40 border border-white/5">
              <span className="text-zinc-500 text-[10px] uppercase">Spot Landed / MT</span>
              <div className="text-white font-mono font-bold mt-0.5">$129.60</div>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-900/40 border border-white/5">
              <span className="text-zinc-500 text-[10px] uppercase">Optimized / MT</span>
              <div className="text-emerald-400 font-mono font-bold mt-0.5">$126.25</div>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-900/40 border border-white/5">
              <span className="text-zinc-500 text-[10px] uppercase">Unit Savings</span>
              <div className="text-emerald-400 font-mono font-bold mt-0.5">-$3.35 / MT</div>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20">
              <span className="text-emerald-400 text-[10px] uppercase">Total Saved</span>
              <div className="text-emerald-300 font-mono font-bold mt-0.5">
                +${optimization.netSavings.toLocaleString()}
              </div>
            </div>
          </div>

        </div>

      </div>
    </TooltipProvider>
  );
}
