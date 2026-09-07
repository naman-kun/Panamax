import React, { useState } from 'react';
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
  Ship,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Navigation,
  Compass,
  DollarSign,
  ChevronDown,
  Info,
  Waves,
  ShieldCheck,
} from 'lucide-react';
import { calculateDemurrage } from '@/lib/simulationEngine';

interface Shipment {
  id: string;
  name: string;
  cargo: string;
  route: string;
  distance: string;
  speed: string;
  laytimeAllowed: number;
}

const SHIPMENTS: Shipment[] = [
  {
    id: 'eastern-glory',
    name: 'MV Eastern Glory',
    cargo: '75,000 MT Thermal Coal (GAR 4200)',
    route: 'Taboneo, Indonesia → Paradip, India',
    distance: '2,420 nm (68% Complete)',
    speed: '12.4 knots',
    laytimeAllowed: 72,
  },
  {
    id: 'pacific-pioneer',
    name: 'MV Pacific Pioneer',
    cargo: '74,200 MT Metallurgical Coal',
    route: 'Muara Pantai, Indonesia → Vizag, India',
    distance: '2,380 nm (32% Complete)',
    speed: '11.8 knots',
    laytimeAllowed: 72,
  },
  {
    id: 'nordic-sagar',
    name: 'MV Nordic Sagar',
    cargo: '76,500 MT Coking Coal',
    route: 'Balikpapan, Indonesia → Haldia, India',
    distance: '2,510 nm (89% Complete)',
    speed: '13.1 knots',
    laytimeAllowed: 72,
  },
];

export function VoyageTrackerModule() {
  const [selectedShipment, setSelectedShipment] = useState<Shipment>(SHIPMENTS[0]);
  const [queueHours, setQueueHours] = useState<number[]>([48]); // Default 48h (within 72h laytime -> Despatch)

  const demurrage = calculateDemurrage(queueHours[0]);
  const laytimeUsagePct = Math.min(100, Math.round((queueHours[0] / 72) * 100));

  return (
    <TooltipProvider delayDuration={100}>
      <div className="space-y-6 text-left">
        
        {/* Top Controls: Shipment Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/60 border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 hover:border-white/20 text-xs font-medium text-white transition-colors">
                  <Ship className="h-4 w-4 text-cyan-400" />
                  <span>Shipment: <strong>{selectedShipment.name}</strong></span>
                  <ChevronDown className="h-3 w-3 text-zinc-500" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-2 bg-zinc-950 border-white/10 text-xs" align="start">
                <div className="text-[11px] font-semibold text-zinc-400 px-2 py-1 uppercase tracking-wider">
                  Active Panamax Fixtures
                </div>
                {SHIPMENTS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedShipment(s)}
                    className={`w-full text-left p-2 rounded-md transition-colors ${
                      selectedShipment.id === s.id ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="font-semibold text-white flex items-center justify-between">
                      <span>{s.name}</span>
                      <span className="text-[10px] text-zinc-500">Panamax</span>
                    </div>
                    <div className="text-[11px] text-zinc-400">{s.cargo}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">{s.route}</div>
                  </button>
                ))}
              </PopoverContent>
            </Popover>

            <span className="hidden sm:inline-block text-xs text-zinc-400">
              {selectedShipment.route}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-zinc-500">Speed:</span>
            <span className="text-white">{selectedShipment.speed}</span>
            <span className="text-zinc-700">|</span>
            <span className="text-zinc-500">Voyage:</span>
            <span className="text-white">{selectedShipment.distance}</span>
          </div>
        </div>

        {/* 2-Column Layout: SVG Static Nautical Map on Left + Demurrage Radar on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left: SVG Stylized Static Route Map with Pulsing Vessel Ping */}
          <div className="lg:col-span-7 rounded-2xl bg-zinc-950 border border-white/10 p-5 flex flex-col justify-between relative overflow-hidden shadow-2xl">
            {/* Ambient Map Grid Background */}
            <div className="absolute inset-0 bg-grid-subtle opacity-20 pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-semibold text-white uppercase tracking-wider">
                  Tactical Route Telemetry
                </span>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono border-white/20 text-zinc-300">
                AIS Feed: Live GPS
              </Badge>
            </div>

            {/* Static SVG Map Canvas */}
            <div className="relative z-10 my-4 h-64 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 500 240" fill="none">
                {/* Lat/Long Grid Lines */}
                <line x1="20" y1="40" x2="480" y2="40" stroke="#27272a" strokeDasharray="3 3" strokeWidth="0.8" />
                <line x1="20" y1="120" x2="480" y2="120" stroke="#27272a" strokeDasharray="3 3" strokeWidth="0.8" />
                <line x1="20" y1="200" x2="480" y2="200" stroke="#27272a" strokeDasharray="3 3" strokeWidth="0.8" />
                <line x1="120" y1="20" x2="120" y2="220" stroke="#27272a" strokeDasharray="3 3" strokeWidth="0.8" />
                <line x1="250" y1="20" x2="250" y2="220" stroke="#27272a" strokeDasharray="3 3" strokeWidth="0.8" />
                <line x1="380" y1="20" x2="380" y2="220" stroke="#27272a" strokeDasharray="3 3" strokeWidth="0.8" />

                {/* Landmass Outlines (Minimalist Geo Coordinates) */}
                {/* East Coast India */}
                <path
                  d="M 60 40 Q 90 70 100 110 Q 110 145 130 170 Q 120 190 105 210"
                  stroke="#3f3f46"
                  strokeWidth="1.5"
                  fill="none"
                />
                <text x="50" y="30" fill="#71717a" fontSize="10" fontFamily="monospace">INDIAN PENINSULA</text>

                {/* Andaman & Nicobar Ridge */}
                <path d="M 230 110 L 235 150" stroke="#3f3f46" strokeWidth="2" strokeDasharray="2 4" />
                <text x="242" y="130" fill="#52525b" fontSize="9" fontFamily="monospace">ANDAMAN SEA</text>

                {/* Indonesia / Sumatra / Kalimantan Archipelago */}
                <path
                  d="M 280 180 Q 320 150 380 160 Q 420 170 470 150"
                  stroke="#3f3f46"
                  strokeWidth="1.5"
                  fill="none"
                />
                <text x="360" y="210" fill="#71717a" fontSize="10" fontFamily="monospace">INDONESIA (TABONEO)</text>

                {/* Great Circle Sailing Route (Arc from Taboneo to Paradip) */}
                <path
                  d="M 430 165 Q 260 145 110 95"
                  stroke="#52525b"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                {/* Completed Trajectory Path */}
                <path
                  d="M 430 165 Q 310 150 215 125"
                  stroke="#22d3ee"
                  strokeWidth="2.5"
                />

                {/* Origin Port: Taboneo */}
                <circle cx="430" cy="165" r="4" fill="#ffffff" stroke="#22d3ee" strokeWidth="2" />
                <text x="375" y="150" fill="#a1a1aa" fontSize="10" fontWeight="bold">Taboneo (Load)</text>

                {/* Destination Port: Paradip */}
                <circle cx="110" cy="95" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                <text x="70" y="85" fill="#38bdf8" fontSize="10" fontWeight="bold">Paradip (Discharge)</text>

                {/* Current Vessel Position (Pulsing Sonar Marker) */}
                <g transform="translate(215, 125)">
                  <circle cx="0" cy="0" r="16" fill="rgba(34, 211, 238, 0.15)" className="animate-ping" />
                  <circle cx="0" cy="0" r="8" fill="rgba(34, 211, 238, 0.3)" />
                  <circle cx="0" cy="0" r="4" fill="#22d3ee" />
                  <text x="10" y="-8" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    MV Eastern Glory
                  </text>
                  <text x="10" y="6" fill="#22d3ee" fontSize="9" fontFamily="monospace">
                    12.4 kn | Heading 294°
                  </text>
                </g>
              </svg>
            </div>

            {/* Bottom Telemetry Bar */}
            <div className="relative z-10 grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center font-mono text-xs">
              <div>
                <div className="text-[10px] text-zinc-500 uppercase">Distance to Go</div>
                <div className="text-white font-semibold mt-0.5">774 nm</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase">Est. Port Arrival</div>
                <div className="text-white font-semibold mt-0.5">62 hrs (2.5 Days)</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase">Contract Laytime</div>
                <div className="text-white font-semibold mt-0.5">72 Hours</div>
              </div>
            </div>
          </div>

          {/* Right: Live Port Queue Slider & Dynamic Demurrage/Despatch HUD */}
          <div className="lg:col-span-5 rounded-2xl bg-zinc-950 border border-white/10 p-5 flex flex-col justify-between shadow-2xl space-y-5">
            
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-zinc-400" />
                  <span className="text-xs font-semibold text-white uppercase tracking-wider">
                    Demurrage Radar HUD
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className={
                    demurrage.isDemurrage
                      ? 'border-rose-500/40 text-rose-400 bg-rose-950/30 font-mono text-xs'
                      : 'border-emerald-500/40 text-emerald-400 bg-emerald-950/30 font-mono text-xs'
                  }
                >
                  {demurrage.isDemurrage ? 'Demurrage Triggered' : 'Despatch Qualifying'}
                </Badge>
              </div>

              {/* Slider for Live Port Queue (0 to 120h) */}
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
                    <span>Live Port Queue Delay:</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-zinc-500 cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>Paradip berth wait times. 72h contractual laytime allowed. Excess queue triggers $25,000/day demurrage penalty.</span>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="font-mono text-sm font-bold text-white">
                    {queueHours[0]} Hours <span className="text-zinc-500 font-normal">({(queueHours[0] / 24).toFixed(1)}d)</span>
                  </span>
                </div>

                <Slider
                  value={queueHours}
                  onValueChange={setQueueHours}
                  min={0}
                  max={120}
                  step={1}
                  className="w-full cursor-pointer py-1"
                />

                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>0h (Instant Berth)</span>
                  <span className="text-zinc-300 font-semibold underline">72h Laytime Limit</span>
                  <span>120h (Heavy Congestion)</span>
                </div>
              </div>

              {/* Laytime Consumption Progress Bar */}
              <div className="mt-5 p-3 rounded-xl bg-zinc-900/60 border border-white/5 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">Laytime Consumed:</span>
                  <span className={laytimeUsagePct >= 100 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {laytimeUsagePct}% ({queueHours[0]} / 72 hrs)
                  </span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      laytimeUsagePct >= 100 ? 'bg-rose-500' : laytimeUsagePct > 75 ? 'bg-amber-500' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${Math.min(100, laytimeUsagePct)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Financial Impact HUD (Changes Green/Red based on 72h rule) */}
            <div
              className={`p-4 rounded-xl border transition-all duration-300 ${
                demurrage.isDemurrage
                  ? 'bg-rose-950/20 border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
                  : 'bg-emerald-950/20 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {demurrage.isDemurrage ? (
                    <AlertTriangle className="h-4 w-4 text-rose-400" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  )}
                  <span className="text-xs font-semibold uppercase tracking-wider text-white">
                    {demurrage.statusLabel}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-zinc-400">
                  Rate: $25,000/day
                </span>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span
                  className={`text-3xl font-bold font-mono tracking-tight ${
                    demurrage.isDemurrage ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {demurrage.formattedAmount}
                </span>
                <span className="text-xs text-zinc-400">
                  {demurrage.isDemurrage
                    ? `(${demurrage.varianceHours} hrs past laytime)`
                    : `(${demurrage.varianceHours} hrs laytime saved)`}
                </span>
              </div>

              <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                {demurrage.isDemurrage
                  ? `Vessel delay exceeds charter party threshold. Panamax radar recommends speeding up by 1.2 knots to capture upcoming open discharge berth window.`
                  : `Vessel will complete discharge within contractual laytime. 50% despatch rate applies as direct revenue credit to charterer.`}
              </p>
            </div>

          </div>

        </div>

      </div>
    </TooltipProvider>
  );
}
