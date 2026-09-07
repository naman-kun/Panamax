import React from 'react';
import { Compass, Ship, Navigation, Wind, Activity, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function HeroVisual() {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 pb-20 pt-4">
      <div className="mx-auto max-w-6xl">
        
        {/* Glow behind the hero frame */}
        <div className="relative rounded-2xl p-1 bg-gradient-to-b from-white/15 via-white/5 to-transparent shadow-2xl">
          
          <div className="relative rounded-xl overflow-hidden border border-white/15 bg-zinc-950">
            
            {/* Top Mock Window Bar */}
            <div className="flex h-10 items-center justify-between border-b border-white/10 bg-zinc-900/90 px-4 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-zinc-700"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-zinc-700"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-zinc-700"></div>
                <span className="ml-2 text-[11px] font-mono text-zinc-400">
                  panamax-telemetry://russia-india-crude-corridor
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  AIS Live Stream: Active
                </span>
                <Badge variant="glow" className="text-[10px] py-0 px-2">
                  Panamax 75k DWT
                </Badge>
              </div>
            </div>

            {/* Visual Image with Telemetry HUD overlays */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
              <img
                src="/panamax_hero.jpg"
                alt="Panamax bulk carrier ship sailing with neural telemetry overlay"
                className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
              />

              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/30 pointer-events-none" />

              {/* HUD Card: Top-Left Vessel Telemetry */}
              <div className="absolute top-4 left-4 hidden sm:block rounded-xl border border-white/15 bg-black/70 p-3.5 backdrop-blur-md text-left max-w-xs shadow-xl">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <Ship className="h-4 w-4 text-cyan-400" />
                    <span className="text-xs font-semibold text-white">MV PANAMAX VOYAGER</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400">IMO 9842104</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] font-mono text-zinc-300">
                  <div>
                    <span className="text-zinc-500">Class:</span> Panamax
                  </div>
                  <div>
                    <span className="text-zinc-500">Cargo:</span> Crude Oil
                  </div>
                  <div>
                    <span className="text-zinc-500">DWT:</span> 75,000 MT
                  </div>
                  <div>
                    <span className="text-zinc-500">Speed:</span> 13.5 kts
                  </div>
                </div>
              </div>

              {/* HUD Card: Top-Right Route & Weather Telemetry */}
              <div className="absolute top-4 right-4 hidden sm:block rounded-xl border border-white/15 bg-black/70 p-3.5 backdrop-blur-md text-left max-w-xs shadow-xl">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-white">CORRIDOR TELEMETRY</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">ON SCHEDULE</span>
                </div>
                <div className="space-y-1 text-[11px] text-zinc-300">
                  <div className="flex justify-between font-mono">
                    <span className="text-zinc-500">Origin:</span>
                    <span className="text-white">Primorsk / Novorossiysk (RU)</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-zinc-500">Destination:</span>
                    <span className="text-white">Vadinar / Jamnagar Port (IN)</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-zinc-500">Status:</span>
                    <span className="text-cyan-400">Transit Via Suez / Malacca</span>
                  </div>
                </div>
              </div>

              {/* HUD Banner: Bottom Live Recommendation */}
              <div className="absolute bottom-4 inset-x-4 rounded-xl border border-white/15 bg-zinc-950/85 p-3 sm:p-4 backdrop-blur-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">Charter Timing Window: OPTIMAL</span>
                      <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
                        High Confidence
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Spot market rate is at optimal level before expected winter seasonal demand rise.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right self-end sm:self-center">
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase font-mono">Current Spot</div>
                    <div className="text-sm font-bold text-white font-mono">$90 / MT</div>
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase font-mono">Recommendation</div>
                    <div className="text-sm font-bold text-emerald-400 font-mono">Book Vessel</div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
