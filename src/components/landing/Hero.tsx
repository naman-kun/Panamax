import React from 'react';
import { ArrowRight, ChevronRight, TrendingDown, DollarSign, ShieldAlert, Sparkles } from 'lucide-react';

interface HeroProps {
  onOpenDemo: () => void;
}

export function Hero({ onOpenDemo }: HeroProps) {
  return (
    <section className="relative pt-20 pb-12 overflow-hidden">
      {/* Background Subtle Radial Glow & Grid */}
      <div className="absolute inset-0 radial-glow pointer-events-none" />
      <div className="absolute inset-0 bg-grid-subtle pointer-events-none opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-left">
        {/* Hero Headline / Tagline - Left Aligned */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white max-w-4xl leading-[1.08] text-left">
          Predict the freight.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-600">
            Time the charter.
          </span>{' '}
          Optimize the cost.
        </h1>

        {/* Subtitle - Left Aligned */}
        <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed font-normal text-left">
          AI-driven maritime freight rate forecasting and vessel chartering optimizer for bulk commodity procurement. 
          Minimizing delay penalties, protecting against fuel price volatility, and timing ship bookings with mathematical precision.
        </p>

        {/* Call to Action Button - Left Aligned, Only Start Forecasting Free */}
        <div className="mt-8 flex items-center justify-start">
          <button
            onClick={onOpenDemo}
            className="group relative inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-neutral-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-95"
          >
            <span>Start Forecasting Free</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Single Route Market Cards (Russia to India, Crude Oil) */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 max-w-5xl text-left">
          
          {/* Card 1: Freight Rate */}
          <div className="rounded-xl border border-white/10 bg-zinc-950/80 p-4 text-left backdrop-blur-md hover:border-white/20 transition-all shadow-lg">
            <div className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">
              Freight Rate
            </div>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-2xl font-bold text-white font-mono">$90</span>
              <span className="text-xs text-zinc-400">/ MT (Metric ton)</span>
            </div>
            <div className="text-[11px] text-zinc-400 mt-1.5 pt-1.5 border-t border-white/5 flex items-center justify-between">
              <span>Russia → India</span>
              <span className="text-zinc-300 font-medium">Crude Oil</span>
            </div>
          </div>

          {/* Card 2: Charter Timing */}
          <div className="rounded-xl border border-white/10 bg-zinc-950/80 p-4 text-left backdrop-blur-md hover:border-white/20 transition-all shadow-lg">
            <div className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">
              Charter Timing (Booking Window)
            </div>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-2xl font-bold text-emerald-400 tracking-tight">Optimal</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-[11px] text-zinc-400 mt-1.5 pt-1.5 border-t border-white/5">
              Best window to book: Next 72 Hours
            </div>
          </div>

          {/* Card 3: Fuel Rate (VLSFO) */}
          <div className="rounded-xl border border-white/10 bg-zinc-950/80 p-4 text-left backdrop-blur-md hover:border-white/20 transition-all shadow-lg">
            <div className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">
              Ship Fuel Cost (VLSFO)
            </div>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-2xl font-bold text-white font-mono">$875</span>
              <span className="text-xs text-zinc-400">/ MT (Metric ton)</span>
            </div>
            <div className="text-[11px] text-zinc-400 mt-1.5 pt-1.5 border-t border-white/5">
              Very Low Sulphur Fuel Oil benchmark
            </div>
          </div>

          {/* Card 4: Estimated Voyage Savings */}
          <div className="rounded-xl border border-white/10 bg-zinc-950/80 p-4 text-left backdrop-blur-md hover:border-white/20 transition-all shadow-lg">
            <div className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">
              Estimated Voyage Savings
            </div>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-2xl font-bold text-emerald-400 font-mono">+$125,000</span>
            </div>
            <div className="text-[11px] text-zinc-400 mt-1.5 pt-1.5 border-t border-white/5">
              Per 75k tonnage (75,000 ton shipment)
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
