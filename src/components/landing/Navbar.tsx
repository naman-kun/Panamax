import React from 'react';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@/components/ui/hover-card';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Ship,
  Anchor,
  Compass,
  FileText,
  BarChart3,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  onOpenDemo: () => void;
}

export function Navbar({ onOpenDemo }: NavbarProps) {
  return (
    <TooltipProvider delayDuration={150}>
      <header className="sticky top-0 z-50 w-full linear-navbar">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Brand Logo - Left */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-white/20 transition-all duration-300 group-hover:border-white/40 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]">
                <svg
                  className="h-4 w-4 text-white transition-transform group-hover:scale-110"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tracking-tight text-white">
                  Panamax
                </span>
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-zinc-300">
                  Intelligence
                </span>
              </div>
            </a>
          </div>

          {/* Navigation Links with Separators & Smooth Hover Popovers */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
            
            {/* 1. Product */}
            <HoverCard openDelay={120} closeDelay={180}>
              <HoverCardTrigger asChild>
                <button className="nav-header-btn group flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/10 data-[state=open]:text-white data-[state=open]:bg-white/10 data-[state=open]:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]">
                  <span>Product</span>
                  <ChevronDown className="h-3 w-3 text-zinc-500 transition-transform duration-200 group-hover:text-zinc-300 group-data-[state=open]:rotate-180 group-data-[state=open]:text-white" />
                </button>
              </HoverCardTrigger>
              <HoverCardContent align="start" sideOffset={10} className="w-80">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-white">Platform Capabilities</h4>
                    <Badge variant="glow" className="text-[10px] py-0">v3.2</Badge>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Unified maritime intelligence platform built for bulk procurement officers & charterers.
                  </p>
                  <div className="grid gap-1.5 pt-1">
                    <a href="#features" className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-white/5 transition-colors group">
                      <Cpu className="h-4 w-4 text-zinc-400 group-hover:text-white mt-0.5" />
                      <div>
                        <div className="text-xs font-medium text-zinc-200 group-hover:text-white">Neural Rate Forecaster</div>
                        <div className="text-[11px] text-zinc-500">Transformer-based 30-90 day rate predictions</div>
                      </div>
                    </a>
                    <a href="#charter-optimizer" className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-white/5 transition-colors group">
                      <Anchor className="h-4 w-4 text-zinc-400 group-hover:text-white mt-0.5" />
                      <div>
                        <div className="text-xs font-medium text-zinc-200 group-hover:text-white">Charter Timing Window</div>
                        <div className="text-[11px] text-zinc-500">Optimal fixture recommendation & cost delta</div>
                      </div>
                    </a>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>

            <Separator orientation="vertical" className="h-3 w-px bg-white/10" />

            {/* 2. Forecast Engine */}
            <HoverCard openDelay={120} closeDelay={180}>
              <HoverCardTrigger asChild>
                <button className="nav-header-btn group flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/10 data-[state=open]:text-white data-[state=open]:bg-white/10 data-[state=open]:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]">
                  <span>Forecast Engine</span>
                  <ChevronDown className="h-3 w-3 text-zinc-500 transition-transform duration-200 group-hover:text-zinc-300 group-data-[state=open]:rotate-180 group-data-[state=open]:text-white" />
                </button>
              </HoverCardTrigger>
              <HoverCardContent align="center" sideOffset={10} className="w-80">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-white">ML Model Architecture</h4>
                    <span className="text-[10px] text-emerald-400 font-mono">94.2% Acc.</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Trained on 12+ years of Baltic Dry fixtures, Indonesian coal flows, and bunker pricing.
                  </p>
                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/60 border border-white/5">
                      <span className="text-zinc-300">Indonesia → East Coast India</span>
                      <span className="text-white font-mono font-medium">$11.40/MT</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/60 border border-white/5">
                      <span className="text-zinc-300">Confidence Band (95% CI)</span>
                      <span className="text-emerald-400 font-mono font-medium">±$0.48/MT</span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>

            <Separator orientation="vertical" className="h-3 w-px bg-white/10" />

            {/* 3. Charter Optimizer */}
            <HoverCard openDelay={120} closeDelay={180}>
              <HoverCardTrigger asChild>
                <button className="nav-header-btn group flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/10 data-[state=open]:text-white data-[state=open]:bg-white/10 data-[state=open]:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]">
                  <span>Charter Optimizer</span>
                  <ChevronDown className="h-3 w-3 text-zinc-500 transition-transform duration-200 group-hover:text-zinc-300 group-data-[state=open]:rotate-180 group-data-[state=open]:text-white" />
                </button>
              </HoverCardTrigger>
              <HoverCardContent align="center" sideOffset={10} className="w-80">
                <div className="space-y-2.5">
                  <h4 className="text-xs font-semibold text-white">Decision Engine</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Evaluates spot fixture vs time-charter trade-offs and calculates demurrage risk index.
                  </p>
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-2.5 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                      <Zap className="h-3.5 w-3.5" />
                      <span>Action Recommended</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 mt-1 leading-relaxed">
                      Lock 75k DWT Panamax charter within next 72 hrs before monsoon premium rebound.
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>

            <Separator orientation="vertical" className="h-3 w-px bg-white/10" />

            {/* 4. Corridors */}
            <HoverCard openDelay={120} closeDelay={180}>
              <HoverCardTrigger asChild>
                <button className="nav-header-btn group flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/10 data-[state=open]:text-white data-[state=open]:bg-white/10 data-[state=open]:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]">
                  <span>Corridors</span>
                  <ChevronDown className="h-3 w-3 text-zinc-500 transition-transform duration-200 group-hover:text-zinc-300 group-data-[state=open]:rotate-180 group-data-[state=open]:text-white" />
                </button>
              </HoverCardTrigger>
              <HoverCardContent align="center" sideOffset={10} className="w-72">
                <div className="space-y-2 text-xs">
                  <h4 className="font-semibold text-white">Tracked Coal Routes</h4>
                  <div className="space-y-1.5">
                    <div className="p-1.5 rounded-lg hover:bg-white/5 flex justify-between items-center transition-colors">
                      <span className="text-zinc-300">South Kalimantan → Paradip</span>
                      <span className="text-[10px] text-zinc-500">2,420 nm</span>
                    </div>
                    <div className="p-1.5 rounded-lg hover:bg-white/5 flex justify-between items-center transition-colors">
                      <span className="text-zinc-300">Taboneo → Visakhapatnam</span>
                      <span className="text-[10px] text-zinc-500">2,380 nm</span>
                    </div>
                    <div className="p-1.5 rounded-lg hover:bg-white/5 flex justify-between items-center transition-colors">
                      <span className="text-zinc-300">Muara Pantai → Haldia</span>
                      <span className="text-[10px] text-zinc-500">2,510 nm</span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>

            <Separator orientation="vertical" className="h-3 w-px bg-white/10" />

            {/* 5. Pricing */}
            <HoverCard openDelay={120} closeDelay={180}>
              <HoverCardTrigger asChild>
                <button className="nav-header-btn group flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/10 data-[state=open]:text-white data-[state=open]:bg-white/10 data-[state=open]:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]">
                  <span>Pricing</span>
                  <ChevronDown className="h-3 w-3 text-zinc-500 transition-transform duration-200 group-hover:text-zinc-300 group-data-[state=open]:rotate-180 group-data-[state=open]:text-white" />
                </button>
              </HoverCardTrigger>
              <HoverCardContent align="end" sideOffset={10} className="w-64">
                <div className="space-y-2 text-xs">
                  <h4 className="font-semibold text-white">Enterprise Tiers</h4>
                  <p className="text-zinc-400">
                    Transparent pricing per vessel cargo fixture with guaranteed positive ROI.
                  </p>
                  <Button variant="outline" size="sm" className="w-full text-xs h-7 mt-1" onClick={onOpenDemo}>
                    View Tier Breakdown
                  </Button>
                </div>
              </HoverCardContent>
            </HoverCard>

            <Separator orientation="vertical" className="h-3 w-px bg-white/10" />

            {/* 6. Docs with Tooltip */}
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="#methodology"
                  className="nav-header-btn px-2.5 py-1.5 rounded-md text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/10"
                >
                  Docs
                </a>
              </TooltipTrigger>
              <TooltipContent sideOffset={8}>
                <span>Read ML methodology & backtesting papers</span>
              </TooltipContent>
            </Tooltip>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Log in */}
            <button
              onClick={onOpenDemo}
              className="text-xs font-medium text-zinc-400 transition-colors hover:text-white"
            >
              Log in
            </button>

            {/* Sign up / Launch button (Linear White Pill) */}
            <button
              onClick={onOpenDemo}
              className="rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-black transition-all hover:bg-neutral-200 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] active:scale-95"
            >
              Launch Platform
            </button>
          </div>

        </div>
      </header>
    </TooltipProvider>
  );
}
