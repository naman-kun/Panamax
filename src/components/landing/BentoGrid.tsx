import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  TrendingDown,
  Anchor,
  Fuel,
  Clock,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  BarChart3,
  AlertTriangle,
  Compass,
} from 'lucide-react';

export function BentoGrid() {
  const [riskTolerance, setRiskTolerance] = useState([35]);
  const [activeTab, setActiveTab] = useState<'30' | '60' | '90'>('30');
  const [bunkerHedged, setBunkerHedged] = useState(true);

  // Dynamic calculations based on risk tolerance slider
  const demurrageRisk = Math.round(10 + (100 - riskTolerance[0]) * 0.22);
  const potentialSavings = Math.round(125000 - (100 - riskTolerance[0]) * 300);

  return (
    <section id="features" className="relative px-4 sm:px-6 lg:px-8 py-20 bg-black">
      <div className="mx-auto max-w-6xl">
        
        {/* Section Header */}
        <div className="text-left max-w-3xl mb-14">
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Built for chartering desks that demand precision.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 mt-3">
            Every layer of the platform is designed to eliminate uncertainty in global maritime oil logistics, 
            empowering procurement leaders to charter at the statistical optimum.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
          
          {/* Bento Card 1: 30/60/90-Day AI Forecasting (Spans 2 cols) */}
          <div className="md:col-span-2 bento-card p-6 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">Multi-Horizon Freight Forecast</h3>
                    <p className="text-xs text-zinc-400">Projected freight rate for Russia to India route</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-lg border border-white/10 text-xs">
                  <button
                    onClick={() => setActiveTab('30')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      activeTab === '30' ? 'bg-white/15 text-white font-medium shadow-sm' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    30 Days
                  </button>
                  <button
                    onClick={() => setActiveTab('60')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      activeTab === '60' ? 'bg-white/15 text-white font-medium shadow-sm' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    60 Days
                  </button>
                  <button
                    onClick={() => setActiveTab('90')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      activeTab === '90' ? 'bg-white/15 text-white font-medium shadow-sm' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    90 Days
                  </button>
                </div>
              </div>

              {/* Dynamic SVG Sparkline with glowing path */}
              <div className="relative h-44 w-full rounded-xl bg-zinc-950/60 border border-white/5 p-4 flex flex-col justify-between overflow-hidden">
                <div className="flex justify-between items-start text-xs font-mono">
                  <div>
                    <span className="text-zinc-500">PROJECTED RATE:</span>
                    <div className="text-xl font-bold text-white mt-0.5">
                      {activeTab === '30' ? '$90.00' : activeTab === '60' ? '$93.50' : '$98.00'}
                      <span className="text-xs font-normal text-zinc-400 ml-1">/ MT (Metric ton)</span>
                    </div>
                  </div>
                  <Badge variant="success" className="text-[10px]">
                    {activeTab === '30' ? 'OPTIMAL BOOKING WINDOW' : 'UPWARD TREND'}
                  </Badge>
                </div>

                <svg className="w-full h-24 overflow-visible" viewBox="0 0 400 80">
                  <defs>
                    <linearGradient id="bentoGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Area */}
                  <path
                    d={
                      activeTab === '30'
                        ? 'M 0 45 Q 100 65 200 35 T 400 50 L 400 80 L 0 80 Z'
                        : activeTab === '60'
                        ? 'M 0 55 Q 120 70 240 30 T 400 20 L 400 80 L 0 80 Z'
                        : 'M 0 60 Q 150 40 250 35 T 400 15 L 400 80 L 0 80 Z'
                    }
                    fill="url(#bentoGrad)"
                  />
                  {/* Line */}
                  <path
                    d={
                      activeTab === '30'
                        ? 'M 0 45 Q 100 65 200 35 T 400 50'
                        : activeTab === '60'
                        ? 'M 0 55 Q 120 70 240 30 T 400 20'
                        : 'M 0 60 Q 150 40 250 35 T 400 15'
                    }
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                  />
                  {/* Point */}
                  <circle cx="200" cy={activeTab === '30' ? '35' : '30'} r="4" fill="#ffffff" />
                </svg>

                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span>Current Spot ($90 / MT)</span>
                  <span>30-Day Outlook</span>
                  <span>90-Day Outlook</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
              <span>Russia to India corridor (Crude Oil, 75k ton Panamax parcel)</span>
              <span className="text-white font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Read Model Whitepaper <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
          </div>

          {/* Bento Card 2: Vessel Charter Timing Window */}
          <div className="bento-card p-6 flex flex-col justify-between group">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Anchor className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Charter Timing Signal</h3>
                  <p className="text-xs text-zinc-400">Optimal booking recommendation</p>
                </div>
              </div>

              {/* Recommendation Card */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                    RECOMMENDED WINDOW
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <div className="text-2xl font-bold text-white font-mono mt-1">
                  Optimal Timing
                </div>
                <p className="text-xs text-zinc-300 mt-1">
                  Available tanker supply favorable in next 72 hours before projected rate surge.
                </p>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between p-2 rounded bg-zinc-900/60 border border-white/5">
                  <span className="text-zinc-400">Current Freight Rate:</span>
                  <span className="text-white font-bold">$90 / MT</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-zinc-900/60 border border-white/5">
                  <span className="text-zinc-400">Estimated Cost Savings:</span>
                  <span className="text-emerald-400 font-bold">+${potentialSavings.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
              <span>Per 75k Tonnage Shipment</span>
              <span className="text-emerald-400 font-mono font-bold">96.2% Confidence</span>
            </div>
          </div>

          {/* Bento Card 3: Macro & Port Congestion Telemetry */}
          <div className="bento-card p-6 flex flex-col justify-between group">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white">
                  <Fuel className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Fuel (VLSFO) & Port Queue</h3>
                  <p className="text-xs text-zinc-400">Key cost drivers along voyage</p>
                </div>
              </div>

              {/* Bunker Hedging Switch */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/60 border border-white/5 mb-4 text-xs">
                <span className="text-zinc-300">VLSFO Market Rate: $875 / MT</span>
                <Badge variant="glow" className="text-[10px]">Benchmark</Badge>
              </div>

              {/* Port Congestion Indicators */}
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-zinc-900/40 border border-white/5">
                  <div className="flex justify-between text-zinc-300 mb-1">
                    <span>Vadinar Port Waiting Time</span>
                    <span className="font-mono text-white">1.6 Days</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full w-[30%]" />
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-900/40 border border-white/5">
                  <div className="flex justify-between text-zinc-300 mb-1">
                    <span>Primorsk Port Berth Queue</span>
                    <span className="font-mono text-white">1.2 Days</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full w-[25%]" />
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-zinc-900/40 border border-white/5">
                  <div className="flex justify-between text-zinc-300 mb-1">
                    <span>Suez Canal Convoy Transit</span>
                    <span className="font-mono text-white">On Schedule</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full w-[50%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
              <span>AIS Telemetry Status</span>
              <span className="text-emerald-400 font-mono">Live Sync</span>
            </div>
          </div>

          {/* Bento Card 4: Demurrage Risk Optimizer (Spans 2 cols) */}
          <div className="md:col-span-2 bento-card p-6 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">Demurrage Risk Hedging Simulator</h3>
                    <p className="text-xs text-zinc-400">Interactive laytime & delay contingency modeling</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-zinc-400">
                  Risk Level: <strong className="text-white">{riskTolerance[0]}%</strong>
                </span>
              </div>

              {/* Slider Controller */}
              <div className="mb-6 p-4 rounded-xl bg-zinc-900/40 border border-white/5">
                <div className="flex justify-between text-xs text-zinc-400 mb-2">
                  <span>Aggressive (Low Cost Buffer)</span>
                  <span>Balanced</span>
                  <span>Conservative (Max Laytime Safety)</span>
                </div>
                <Slider
                  value={riskTolerance}
                  onValueChange={setRiskTolerance}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Output Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 text-left">
                <div className="p-3 rounded-lg bg-zinc-900/60 border border-white/5">
                  <div className="text-[10px] text-zinc-500 uppercase font-mono">Demurrage Prob.</div>
                  <div className="text-lg font-bold text-white font-mono mt-1">{demurrageRisk}%</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">-42% vs Baseline</div>
                </div>

                <div className="p-3 rounded-lg bg-zinc-900/60 border border-white/5">
                  <div className="text-[10px] text-zinc-500 uppercase font-mono">Est. Laytime Delay</div>
                  <div className="text-lg font-bold text-white font-mono mt-1">
                    {(1.2 + (100 - riskTolerance[0]) * 0.02).toFixed(1)} Days
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Pre-berthing queue</div>
                </div>

                <div className="p-3 rounded-lg bg-zinc-900/60 border border-white/5">
                  <div className="text-[10px] text-zinc-500 uppercase font-mono">Total Hedged Value</div>
                  <div className="text-lg font-bold text-emerald-400 font-mono mt-1">
                    ${(potentialSavings + 24000).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Guaranteed Cap</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
              <span>Calculated from 1,280 historical coal discharges across Vizag, Paradip, and Ennore</span>
              <span className="text-white font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Export Optimization Model <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
