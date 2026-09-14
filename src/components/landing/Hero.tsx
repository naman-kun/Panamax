import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Cpu,
  ShieldCheck,
  Compass,
  SlidersHorizontal,
  Clock,
  ChevronRight,
  TrendingDown,
  Anchor,
  HelpCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HeroProps {
  onOpenDemo: () => void;
}

interface DynamicWordItem {
  word: string;
  suffix: string;
  pillStyle: string;
  dotColor: string;
  textColor: string;
}

const DYNAMIC_WORDS: DynamicWordItem[] = [
  {
    word: 'Predict',
    suffix: ' the freight.',
    pillStyle: 'bg-[#E8F4FD] border border-[#CDE5FA]',
    dotColor: '#0070F3',
    textColor: 'text-zinc-950',
  },
  {
    word: 'Time',
    suffix: ' the charter.',
    pillStyle: 'bg-[#EAFBF3] border border-[#C6F4DF]',
    dotColor: '#10B981',
    textColor: 'text-zinc-950',
  },
  {
    word: 'Optimize',
    suffix: ' the cost.',
    pillStyle: 'bg-[#FEF8E7] border border-[#FDEBC4]',
    dotColor: '#F59E0B',
    textColor: 'text-zinc-950',
  },
];

export function Hero({ onOpenDemo }: HeroProps) {
  // Dynamic animated text state
  const [wordIndex, setWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Interactive Card 1: Horizon Forecast Tab
  const [selectedHorizon, setSelectedHorizon] = useState<'30D' | '60D' | '90D'>('30D');

  // Interactive Card 4: Scenario sandbox simulation switch
  const [scenarioReroute, setScenarioReroute] = useState(false);

  // 3D Card Tilt State for the 4 Feature Cards
  const [tiltCard, setTiltCard] = useState<number | null>(null);
  const [tiltCoords, setTiltCoords] = useState({ x: 0, y: 0 });

  const currentItem = DYNAMIC_WORDS[wordIndex];

  // Typewriter animation effect
  useEffect(() => {
    const fullText = currentItem.suffix;
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (displayedText.length < fullText.length) {
        timeout = setTimeout(() => {
          setDisplayedText(fullText.slice(0, displayedText.length + 1));
        }, 55);
      } else {
        // Finished typing full text, pause before deleting
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(fullText.slice(0, displayedText.length - 1));
        }, 28);
      } else {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % DYNAMIC_WORDS.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, wordIndex, currentItem.suffix]);

  // Card Mouse Move Tilt handler
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTiltCard(index);
    setTiltCoords({ x, y });
  };

  const handleCardMouseLeave = () => {
    setTiltCard(null);
    setTiltCoords({ x: 0, y: 0 });
  };

  return (
    <section className="relative pt-20 pb-16 overflow-hidden">
      {/* Subtle Radial Glow & Fine Grid Overlay */}
      <div className="absolute inset-0 radial-glow pointer-events-none opacity-70" />
      <div className="absolute inset-0 bg-grid-subtle pointer-events-none opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-left">
        {/* Dynamic Animated Hero Headline with 0% Glow Word-Box & Cursor Typewriter */}
        <div className="max-w-4xl text-left">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[68px] font-bold tracking-tight text-white leading-[1.14]">
            <span className="block">We help chartering teams</span>
            
            {/* The Dynamic Word in a dynamically sized rounded-full pill with dot & dropdown animation */}
            <span className="inline-flex items-center gap-2.5 sm:gap-4 mt-2.5 sm:mt-3 whitespace-nowrap flex-nowrap overflow-visible">
              <span
                className={`inline-flex items-center justify-start rounded-full px-3.5 sm:px-5 py-1 sm:py-2 w-auto h-[46px] sm:h-[60px] md:h-[70px] lg:h-[80px] transition-all duration-300 ease-out shadow-none shrink-0 overflow-hidden ${currentItem.pillStyle}`}
              >
                {/* Colored circular dot indicator on the left */}
                <span
                  className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 rounded-full shrink-0 mr-2 sm:mr-3 transition-colors duration-300"
                  style={{ backgroundColor: currentItem.dotColor }}
                />
                
                {/* Word container with vertical dropdown slot animation */}
                <span className="relative overflow-hidden inline-flex items-center justify-start">
                  <span
                    key={wordIndex}
                    className={`animotion-word-dropdown font-sans text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight ${currentItem.textColor}`}
                  >
                    {currentItem.word}
                  </span>
                </span>
              </span>
              
              {/* Typewriter text strictly inline with white cursor */}
              <span className="font-medium text-zinc-200 text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight inline whitespace-nowrap">
                {displayedText}
                <span className="animotion-cursor" />
              </span>
            </span>
          </h1>

          {/* Subtitle - Professional, non-jargon value proposition */}
          <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed font-normal text-left">
            Use institutional-grade algorithms to predict freight rates and reliably plan your shipments—customized specifically around your routes and trade requirements.
          </p>

          {/* CTA Action Button */}
          <div className="mt-8 flex items-center justify-start">
            <a
              href="#see-what-panamax-can-do"
              className="group inline-flex items-center justify-center bg-white hover:bg-zinc-200 text-black font-semibold rounded-full px-7 h-12 text-sm shadow-none transition-all active:scale-95"
            >
              <span>See what panamax can do</span>
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* 
          ========================================================================
          THE 4 CARDS BELOW HERO: CORE SOFTWARE CAPABILITIES & PRACTICAL USAGES
          ========================================================================
        */}
        <div className="mt-16 pt-10 border-t border-white/10">
          
          <div className="flex items-center justify-between mb-6">
            <div className="text-left">
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
                Core Software Capabilities
              </span>
              <h2 className="text-lg font-semibold text-white mt-0.5">
                How commercial desks execute with Panamax
              </h2>
            </div>
            <Badge variant="outline" className="hidden sm:inline-flex text-xs border-white/10 text-zinc-400 font-mono">
              Hover to test interactive modules
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            
            {/* Card 1: Forward Curve Forecasting Engine */}
            <div
              onMouseMove={(e) => handleCardMouseMove(e, 1)}
              onMouseLeave={handleCardMouseLeave}
              style={{
                transform:
                  tiltCard === 1
                    ? `perspective(800px) rotateX(${tiltCoords.y * -10}deg) rotateY(${tiltCoords.x * 10}deg) translateY(-2px)`
                    : 'none',
                transition: tiltCard === 1 ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
              }}
              className="group relative rounded-xl border border-white/10 bg-zinc-950/80 p-5 backdrop-blur-md hover:border-cyan-500/40 transition-colors shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <Cpu className="h-4 w-4" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-cyan-500/30 text-cyan-400 font-mono">
                    NEURAL ENGINE
                  </Badge>
                </div>

                <h3 className="text-sm font-semibold text-white tracking-tight">
                  Multi-Horizon Forward Curve
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Ingests Baltic freight indices, Brent crack spreads, and tanker supply to forecast forward rates up to 90 days ahead.
                </p>

                {/* Interactive Horizon Preview */}
                <div className="mt-4 p-3 rounded-lg bg-zinc-900/60 border border-white/5">
                  <div className="flex items-center justify-between text-[11px] mb-2 font-mono">
                    <span className="text-zinc-400">Horizon:</span>
                    <div className="flex gap-1">
                      {(['30D', '60D', '90D'] as const).map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setSelectedHorizon(h)}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-all ${
                            selectedHorizon === h
                              ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                              : 'text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline text-xs font-mono">
                    <span className="text-zinc-500 text-[10px]">Projected:</span>
                    <span className="text-white font-bold">
                      {selectedHorizon === '30D' ? '$90.00 / MT' : selectedHorizon === '60D' ? '$93.50 / MT' : '$98.00 / MT'}
                    </span>
                  </div>
                  <div className="mt-1 text-[10px] text-cyan-400/80 font-mono">
                    {selectedHorizon === '30D' ? 'Optimal charter window' : 'Tightening tanker supply'}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Model Confidence</span>
                <span className="text-emerald-400 font-mono font-medium">96.4%</span>
              </div>
            </div>

            {/* Card 2: Demurrage Penalty Shield */}
            <div
              onMouseMove={(e) => handleCardMouseMove(e, 2)}
              onMouseLeave={handleCardMouseLeave}
              style={{
                transform:
                  tiltCard === 2
                    ? `perspective(800px) rotateX(${tiltCoords.y * -10}deg) rotateY(${tiltCoords.x * 10}deg) translateY(-2px)`
                    : 'none',
                transition: tiltCard === 2 ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
              }}
              className="group relative rounded-xl border border-white/10 bg-zinc-950/80 p-5 backdrop-blur-md hover:border-emerald-500/40 transition-colors shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 font-mono">
                    RISK SHIELD
                  </Badge>
                </div>

                <h3 className="text-sm font-semibold text-white tracking-tight">
                  Demurrage & Laytime Shield
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Stops chartering desks bleeding $30,000/day in port delay penalties by forecasting berth congestion at discharge terminals.
                </p>

                {/* Interactive Congestion & Laytime Indicator */}
                <div className="mt-4 p-3 rounded-lg bg-zinc-900/60 border border-white/5 space-y-2">
                  <div className="flex justify-between text-[11px] text-zinc-400">
                    <span>Vadinar Port Queue:</span>
                    <span className="text-emerald-400 font-mono font-semibold">1.6 Days (Favorable)</span>
                  </div>
                  <Progress value={28} indicatorClassName="bg-emerald-400" />
                  <div className="flex justify-between text-[10px] text-zinc-500 pt-0.5">
                    <span>Laytime Buffer: 72 hrs</span>
                    <span className="text-emerald-400 font-mono">-42% Demurrage Risk</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Avoided Penalties</span>
                <span className="text-emerald-400 font-mono font-medium">+$64,000 / fixture</span>
              </div>
            </div>

            {/* Card 3: Multi-Corridor Fleet Matching */}
            <div
              onMouseMove={(e) => handleCardMouseMove(e, 3)}
              onMouseLeave={handleCardMouseLeave}
              style={{
                transform:
                  tiltCard === 3
                    ? `perspective(800px) rotateX(${tiltCoords.y * -10}deg) rotateY(${tiltCoords.x * 10}deg) translateY(-2px)`
                    : 'none',
                transition: tiltCard === 3 ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
              }}
              className="group relative rounded-xl border border-white/10 bg-zinc-950/80 p-5 backdrop-blur-md hover:border-white/30 transition-colors shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 border border-white/20 text-white">
                    <Compass className="h-4 w-4" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-white/20 text-white font-mono">
                    FLEET DISCOVERY
                  </Badge>
                </div>

                <h3 className="text-sm font-semibold text-white tracking-tight">
                  Corridor Tanker Matching
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Instantly pairs bulk commodity parcels (75k Panamax, 110k Aframax) with compliant open tonnage on key import routes.
                </p>

                {/* Corridor Spec Sheet */}
                <div className="mt-4 p-3 rounded-lg bg-zinc-900/60 border border-white/5 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Route:</span>
                    <span className="text-zinc-200">Primorsk → Vadinar</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Parcel:</span>
                    <span className="text-zinc-200">75,000 MT Panamax</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Open Tankers:</span>
                    <span className="text-white font-bold">14 Vessels in Window</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Fixture Lead Time</span>
                <span className="text-white font-mono font-medium">&lt; 48 Hours</span>
              </div>
            </div>

            {/* Card 4: Geopolitical Scenario Sandbox */}
            <div
              onMouseMove={(e) => handleCardMouseMove(e, 4)}
              onMouseLeave={handleCardMouseLeave}
              style={{
                transform:
                  tiltCard === 4
                    ? `perspective(800px) rotateX(${tiltCoords.y * -10}deg) rotateY(${tiltCoords.x * 10}deg) translateY(-2px)`
                    : 'none',
                transition: tiltCard === 4 ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
              }}
              className="group relative rounded-xl border border-white/10 bg-zinc-950/80 p-5 backdrop-blur-md hover:border-amber-500/40 transition-colors shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <SlidersHorizontal className="h-4 w-4" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400 font-mono">
                    WHAT-IF SANDBOX
                  </Badge>
                </div>

                <h3 className="text-sm font-semibold text-white tracking-tight">
                  Scenario Stress Tester
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Simulate canal blockages, bunker price surges, and Cape of Good Hope detours in seconds before committing capital.
                </p>

                {/* Interactive Simulation Switch */}
                <div className="mt-4 p-3 rounded-lg bg-zinc-900/60 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-zinc-300 font-medium">Cape Reroute (+12d)</span>
                    <Switch
                      checked={scenarioReroute}
                      onCheckedChange={setScenarioReroute}
                      className="data-[state=checked]:bg-amber-500"
                    />
                  </div>
                  <div className="flex justify-between items-baseline text-xs font-mono">
                    <span className="text-zinc-500 text-[10px]">Cost Impact:</span>
                    <span className={`font-bold ${scenarioReroute ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {scenarioReroute ? '+$210,000 (Fuel + Days)' : 'Optimal Direct Route'}
                    </span>
                  </div>
                  <div className="mt-1 text-[10px] text-zinc-400">
                    {scenarioReroute ? 'Hedging alert triggered' : 'Standard transit via Suez'}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Simulation Time</span>
                <span className="text-amber-400 font-mono font-medium">&lt; 120ms</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
