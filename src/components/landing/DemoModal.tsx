import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ship, CheckCircle2, ArrowRight, Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface DemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DemoModal({ open, onOpenChange }: DemoModalProps) {
  const [vessel, setVessel] = useState('Panamax (75k Ton)');
  const [origin, setOrigin] = useState('Primorsk Port, Russia');
  const [destination, setDestination] = useState('Vadinar Port, Gujarat (India)');
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setResult(null);
    setTimeout(() => {
      setIsSimulating(false);
      setResult({
        optimalCharterDate: 'Sep 10 - Sep 14, 2026',
        projectedRate: '$90.00 / MT (Metric ton)',
        savings: '$125,000',
        confidence: '96.2%',
        demurrageRisk: 'Low (1.4 days queue)',
      });
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] bg-zinc-950 border border-white/15 text-white">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="glow" className="text-[10px]">
              <Sparkles className="h-3 w-3 mr-1" />
              Panamax Intelligence Engine
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight">
            Run Instant Freight Forecast
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            Simulate freight rates and optimal charter timing for your crude oil cargo shipment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3 text-xs">
          {/* Vessel Selection */}
          <div className="space-y-1.5">
            <label className="text-zinc-300 font-medium">Vessel Class & Cargo Parcel</label>
            <div className="grid grid-cols-3 gap-2">
              {['Panamax (75k Ton)', 'Aframax (115k Ton)', 'Suezmax (150k Ton)'].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVessel(v)}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    vessel === v
                      ? 'border-white bg-white/15 text-white font-medium shadow-sm'
                      : 'border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="text-[11px] leading-tight">{v}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Origin & Destination */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-zinc-300 font-medium">Loading Port (Russia)</label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-zinc-200 focus:border-white focus:outline-none"
              >
                <option value="Primorsk Port, Russia">Primorsk Port, Russia</option>
                <option value="Novorossiysk Port, Russia">Novorossiysk Port, Russia</option>
                <option value="Ust-Luga Port, Russia">Ust-Luga Port, Russia</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-300 font-medium">Discharge Port (India)</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-zinc-200 focus:border-white focus:outline-none"
              >
                <option value="Vadinar Port, Gujarat (India)">Vadinar Port, Gujarat (India)</option>
                <option value="Jamnagar Marine Terminal, India">Jamnagar Marine Terminal, India</option>
                <option value="Paradip Port, Odisha (India)">Paradip Port, Odisha (India)</option>
                <option value="Visakhapatnam (Vizag), India">Visakhapatnam (Vizag), India</option>
              </select>
            </div>
          </div>


          {/* Results Box */}
          {result && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Recommendation Generated
                </span>
                <span className="font-mono text-emerald-300 font-bold">{result.confidence} Confidence</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 font-mono text-xs">
                <div className="p-2 rounded bg-black/40">
                  <span className="text-zinc-400 block text-[10px]">Optimal Fixture Window:</span>
                  <span className="text-white font-bold">{result.optimalCharterDate}</span>
                </div>
                <div className="p-2 rounded bg-black/40">
                  <span className="text-zinc-400 block text-[10px]">Projected Rate:</span>
                  <span className="text-emerald-400 font-bold">{result.projectedRate}</span>
                </div>
                <div className="p-2 rounded bg-black/40">
                  <span className="text-zinc-400 block text-[10px]">Demurrage Risk:</span>
                  <span className="text-white font-bold">{result.demurrageRisk}</span>
                </div>
                <div className="p-2 rounded bg-black/40">
                  <span className="text-zinc-400 block text-[10px]">Est. Cost Advantage:</span>
                  <span className="text-emerald-400 font-bold">+{result.savings}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-white/10 pt-3">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            variant="pill"
            size="sm"
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="gap-1.5"
          >
            {isSimulating ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Computing Transformer Loss...
              </>
            ) : (
              <>
                Compute Forecast <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
