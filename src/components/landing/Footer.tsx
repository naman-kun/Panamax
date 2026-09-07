import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Compass, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-4 sm:px-6 lg:px-8 py-12 text-zinc-400 text-xs">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-zinc-900 border border-white/20 text-white">
                <Compass className="h-3.5 w-3.5" />
              </div>
              <span className="font-semibold text-white tracking-tight">Panamax</span>
              <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-zinc-300">
                Intelligence
              </span>
            </div>
            <p className="text-zinc-500 max-w-sm">
              Intelligent Freight Forecasting & Vessel Chartering Optimizer for Global Maritime Logistics.
            </p>
          </div>
        </div>

        <Separator className="bg-white/10 mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500">
          <div>
            © 2026 Panamax. Built in accordance with shadcn/ui design principles.
          </div>

          <div className="flex items-center gap-6">
            <a href="#interactive-forecast" className="hover:text-white transition-colors">
              Rate Chart
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Decision Engine
            </a>
            <a href="#see-what-panamax-can-do" className="hover:text-white transition-colors">
              Capabilities
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
