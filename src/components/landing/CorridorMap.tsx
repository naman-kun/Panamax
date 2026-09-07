import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Compass, Wind, Waves, Ship, CheckCircle2 } from 'lucide-react';

interface RoutePoint {
  id: string;
  name: string;
  role: string;
  coords: string;
  rate: string;
  congestion: string;
  avgWait: string;
}

const routes: RoutePoint[] = [
  {
    id: 'primorsk',
    name: 'Primorsk / Novorossiysk Port, Russia',
    role: 'Origin / Crude Oil Export Terminal',
    coords: '60°20\'N, 28°38\'E',
    rate: '$90 / MT (Metric ton) Spot',
    congestion: 'Normal Flow',
    avgWait: '1.2 Days',
  },
  {
    id: 'suez',
    name: 'Suez Canal / Mediterranean Waypoint',
    role: 'Maritime Transit & Fuel Bunkering',
    coords: '31°15\'N, 32°18\'E',
    rate: 'Fuel (VLSFO): $875 / MT (Metric ton)',
    congestion: 'Scheduled Convoys',
    avgWait: '0.8 Days',
  },
  {
    id: 'vadinar',
    name: 'Vadinar Port, Gujarat, India',
    role: 'Primary Crude Oil Discharge Terminal',
    coords: '22°27\'N, 69°43\'E',
    rate: 'Discharge Capacity: SPM VLCC/Panamax',
    congestion: 'Optimal',
    avgWait: '1.6 Days',
  },
  {
    id: 'jamnagar',
    name: 'Jamnagar Marine Terminal, Gujarat, India',
    role: 'Refinery Crude Ingestion Hub',
    coords: '22°29\'N, 69°50\'E',
    rate: 'Direct Pipeline Discharge',
    congestion: 'Low',
    avgWait: '1.0 Days',
  },
];

export function CorridorMap() {
  const [selectedRoute, setSelectedRoute] = useState<RoutePoint>(routes[0]);

  return (
    <section id="corridors" className="relative px-4 sm:px-6 lg:px-8 py-20 bg-zinc-950 border-t border-b border-white/5">
      <div className="mx-auto max-w-6xl">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 text-left">
          <div className="text-left">
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Russia to India Crude Oil Corridor
            </h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
              Real-time situational telemetry and freight indices for Panamax crude oil tankers from Russian ports to Indian refineries.
            </p>
          </div>

          <Badge variant="glow" className="self-start md:self-auto py-1 px-3">
            Corridor: RU-IN-CRUDE-01
          </Badge>
        </div>

        {/* Corridor Route Visual & Waypoints */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          
          {/* Waypoints Selection Column */}
          <div className="space-y-2.5">
            {routes.map((point) => (
              <div
                key={point.id}
                onClick={() => setSelectedRoute(point)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                  selectedRoute.id === point.id
                    ? 'border-white/30 bg-white/10 shadow-[0_0_25px_rgba(255,255,255,0.05)]'
                    : 'border-white/5 bg-zinc-900/40 hover:border-white/15 hover:bg-zinc-900/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">{point.name}</span>
                  <MapPin className={`h-3.5 w-3.5 ${selectedRoute.id === point.id ? 'text-white' : 'text-zinc-500'}`} />
                </div>
                <div className="text-[11px] text-zinc-400 mt-1">{point.role}</div>
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mt-2 pt-2 border-t border-white/5">
                  <span>{point.coords}</span>
                  <span className="text-emerald-400">{point.congestion}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Radar Telemetry Display (Spans 2 cols) */}
          <div className="lg:col-span-2 rounded-2xl border border-white/15 bg-black p-6 relative overflow-hidden flex flex-col justify-between min-h-[380px]">
            
            {/* Background Radar Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <div className="h-[280px] w-[280px] rounded-full border border-dashed border-white/40 animate-radar-sweep" />
              <div className="absolute h-[180px] w-[180px] rounded-full border border-white/30" />
              <div className="absolute h-[80px] w-[80px] rounded-full border border-white/30" />
              <div className="absolute w-full h-[1px] bg-white/20" />
              <div className="absolute h-full w-[1px] bg-white/20" />
            </div>

            {/* Top Bar of Telemetry HUD */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ship className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-mono font-semibold text-white">
                  VOYAGE CORRIDOR SIMULATION: 2,420 NM
                </span>
              </div>
              <Badge variant="outline" className="font-mono text-[10px] border-white/20">
                TRANSIT: 7.2 DAYS @ 13.5 KTS
              </Badge>
            </div>

            {/* Middle Active Waypoint Focus */}
            <div className="relative z-10 my-8 p-6 rounded-xl border border-white/15 bg-zinc-950/80 backdrop-blur-md max-w-lg mx-auto text-center">
              <Badge variant="glow" className="mb-2 text-[10px]">
                SELECTED TELEMETRY NODE
              </Badge>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {selectedRoute.name}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">{selectedRoute.role}</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 text-left font-mono">
                <div className="p-2.5 rounded bg-zinc-900/60 border border-white/5">
                  <div className="text-[10px] text-zinc-500 uppercase">Index/Tariff</div>
                  <div className="text-xs font-bold text-white mt-0.5">{selectedRoute.rate}</div>
                </div>
                <div className="p-2.5 rounded bg-zinc-900/60 border border-white/5">
                  <div className="text-[10px] text-zinc-500 uppercase">Avg Pre-Berth</div>
                  <div className="text-xs font-bold text-emerald-400 mt-0.5">{selectedRoute.avgWait}</div>
                </div>
                <div className="col-span-2 sm:col-span-1 p-2.5 rounded bg-zinc-900/60 border border-white/5">
                  <div className="text-[10px] text-zinc-500 uppercase">Congestion</div>
                  <div className="text-xs font-bold text-white mt-0.5">{selectedRoute.congestion}</div>
                </div>
              </div>
            </div>

            {/* Bottom Status Ticker */}
            <div className="relative z-10 flex flex-wrap items-center justify-between text-xs text-zinc-400 pt-3 border-t border-white/10 gap-2">
              <span className="flex items-center gap-1.5 font-mono text-[11px]">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Bay of Bengal Monsoon Index: Calibrated to IMD & ECMWF data
              </span>
              <span className="font-mono text-[10px] text-zinc-500">
                GEO-FENCE: MALACCA & ANDAMAN CORRIDOR
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
