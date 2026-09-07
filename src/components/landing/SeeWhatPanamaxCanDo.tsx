import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Activity, Sparkles, TrendingUp } from 'lucide-react';
import { FreightPredictorModule } from './modules/FreightPredictorModule';

export function SeeWhatPanamaxCanDo() {
  return (
    <section id="see-what-panamax-can-do" className="relative px-4 sm:px-6 lg:px-8 py-24 bg-black border-t border-white/10">
      <div className="mx-auto max-w-6xl">
        
        {/* Section Headline matching user specs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 text-left">
          <div className="max-w-3xl">
            {/* Minimalist Black & White Icon Badge */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 border border-white/15 text-white shadow-sm">
                <Activity className="h-4 w-4 text-zinc-300" />
              </div>
              <span className="text-xs font-mono font-medium tracking-wider text-zinc-400 uppercase">
                Forecast Freight Rate Volatility
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
              See what Panamax can do
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 mt-3 font-normal leading-relaxed">
              Institutional freight rate volatility forecasting and market trajectory analysis across major export corridors to East Coast India.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <Badge variant="outline" className="border-white/20 text-zinc-300 font-mono text-xs py-1 px-3">
              Panamax Intelligence Engine
            </Badge>
          </div>
        </div>

        {/* Dedicated Freight Forecaster & Financial Chart Terminal */}
        <FreightPredictorModule />

      </div>
    </section>
  );
}
