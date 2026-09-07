import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  LineChart,
  Radar,
  Compass,
  Zap,
  ArrowRight,
  TrendingUp,
  Ship,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { FreightPredictorModule } from './modules/FreightPredictorModule';
import { VoyageTrackerModule } from './modules/VoyageTrackerModule';
import { CharterOptimizerModule } from './modules/CharterOptimizerModule';
import { StressSimulatorModule } from './modules/StressSimulatorModule';

type FeatureId = 'predictor' | 'tracker' | 'optimizer' | 'simulator';

interface FeatureCard {
  id: FeatureId;
  title: string;
  shortDesc: string;
  badge: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
}

export function SeeWhatPanamaxCanDo() {
  const [activeFeature, setActiveFeature] = useState<FeatureId>('predictor');

  const features: FeatureCard[] = [
    {
      id: 'predictor',
      title: 'Forecast freight rate volatility',
      shortDesc: 'Multi-factor neural predictions with 95% confidence corridor',
      badge: 'Predictive Engine',
      iconBg: 'bg-blue-600/20 border-blue-500/30 text-blue-400',
      iconColor: 'text-blue-400',
      icon: (
        <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m19 9-5 5-4-4-3 3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: 'tracker',
      title: 'Track voyages & eliminate demurrage',
      shortDesc: 'Live AIS radar with automated laytime & despatch accounting',
      badge: 'Voyage Radar',
      iconBg: 'bg-amber-600/20 border-amber-500/30 text-amber-400',
      iconColor: 'text-amber-400',
      icon: (
        <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3" />
          <path d="m14 10 5-5" />
        </svg>
      ),
    },
    {
      id: 'optimizer',
      title: 'Optimize vessel charter timing',
      shortDesc: 'Prescriptive decision engine with landed cost waterfall',
      badge: 'Charter Optimizer',
      iconBg: 'bg-rose-600/20 border-rose-500/30 text-rose-400',
      iconColor: 'text-rose-400',
      icon: (
        <svg className="w-5 h-5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      ),
    },
    {
      id: 'simulator',
      title: 'Simulate supply chain disruptions',
      shortDesc: 'Instant black-swan stress test across chokepoints and fuel spikes',
      badge: 'Stress Testing',
      iconBg: 'bg-emerald-600/20 border-emerald-500/30 text-emerald-400',
      iconColor: 'text-emerald-400',
      icon: (
        <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
    },
  ];

  return (
    <TooltipProvider delayDuration={150}>
      <section id="see-what-panamax-can-do" className="relative px-4 sm:px-6 lg:px-8 py-24 bg-black border-t border-white/10">
        <div className="mx-auto max-w-6xl">
          
          {/* Section Headline matching Notion format: "See what Panamax can do" */}
          <div className="text-left mb-10 max-w-3xl">
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
              See what Panamax can do
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 mt-3 font-normal leading-relaxed">
              Explore the four mission-critical modules where bulk commodity procurement officers and charterers spend 90% of their active workflow.
            </p>
          </div>

          {/* Top Notion-Style Horizontal Card Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-left">
            {features.map((feat) => {
              const isActive = activeFeature === feat.id;
              return (
                <button
                  key={feat.id}
                  onClick={() => setActiveFeature(feat.id)}
                  className={`group relative flex flex-col justify-between p-5 rounded-2xl border text-left transition-all duration-300 ${
                    isActive
                      ? 'bg-zinc-900/90 border-white/40 shadow-[0_0_25px_rgba(255,255,255,0.08)] ring-1 ring-white/20'
                      : 'bg-zinc-950/60 border-white/10 hover:border-white/25 hover:bg-zinc-900/40'
                  }`}
                >
                  {/* Circular Avatar Icon Badge (Exactly like Notion's colorful circles) */}
                  <div className="flex items-center justify-between w-full mb-6">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-full border transition-transform duration-300 group-hover:scale-105 ${feat.iconBg}`}
                    >
                      {feat.icon}
                    </div>
                    {isActive && (
                      <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </div>

                  {/* Title with Right Arrow (Matching Notion: "Feature action →") */}
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-white flex items-center justify-between gap-2 transition-colors">
                      <span>{feat.title}</span>
                      <span
                        className={`text-base font-bold transition-transform duration-200 ${
                          isActive ? 'translate-x-1 text-white' : 'text-zinc-500 group-hover:translate-x-1 group-hover:text-white'
                        }`}
                      >
                        →
                      </span>
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed line-clamp-2 font-normal">
                      {feat.shortDesc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Interactive Feature Sandbox Container */}
          <div className="rounded-3xl border border-white/15 bg-zinc-950/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            {/* Subtle top indicator bar */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <Badge variant="glow" className="font-mono text-xs py-1 px-3">
                  {features.find((f) => f.id === activeFeature)?.badge}
                </Badge>
                <span className="text-xs text-zinc-400 hidden sm:inline-block">
                  Live Interactive Client Sandbox (Fully Functional Client-Side Math)
                </span>
              </div>

              <span className="text-xs font-mono text-zinc-500">
                Panamax Intelligence OS v3.2
              </span>
            </div>

            {/* Dynamic Module Rendering */}
            <div className="transition-opacity duration-300">
              {activeFeature === 'predictor' && <FreightPredictorModule />}
              {activeFeature === 'tracker' && <VoyageTrackerModule />}
              {activeFeature === 'optimizer' && <CharterOptimizerModule />}
              {activeFeature === 'simulator' && <StressSimulatorModule />}
            </div>

          </div>

        </div>
      </section>
    </TooltipProvider>
  );
}
