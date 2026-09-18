import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  Ship,
  Globe,
  Anchor,
  Navigation,
  ChevronDown,
  Smile,
  Image as ImageIcon,
  Check,
  Send,
  X,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import {
  PortInfo,
  DestinationPortInfo,
  VesselClassSpec,
  SOURCE_EXPORT_PORTS,
  DESTINATION_INDIAN_PORTS,
  VESSEL_CLASSES,
  VesselClassId,
} from '@/lib/simulationEngine';

interface NotionPageHeaderProps {
  icon: string;
  onChangeIcon: (icon: string) => void;
  title: string;
  subtitle: string;
  source: PortInfo;
  destination: DestinationPortInfo;
  vesselClass: VesselClassSpec;
  onSelectSourceId: (id: string) => void;
  onSelectDestId: (id: string) => void;
  onSelectVesselClassId: (id: VesselClassId) => void;
  onAIPromptExecute?: (promptText: string) => void;
}

export function NotionPageHeader({
  icon,
  onChangeIcon,
  title,
  subtitle,
  source,
  destination,
  vesselClass,
  onSelectSourceId,
  onSelectDestId,
  onSelectVesselClassId,
  onAIPromptExecute,
}: NotionPageHeaderProps) {
  const [showCover, setShowCover] = useState(true);
  const [coverGradient, setCoverGradient] = useState('from-zinc-900 via-neutral-900 to-zinc-950');
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const emojiOptions = ['📈', '🚢', '⚓', '🔄', '🛡️', '📊', '⚡', '🌐', '💡', '📑'];

  // Group source ports by country
  const sourcePortsByCountry = React.useMemo(() => {
    const groups: Record<string, PortInfo[]> = {};
    SOURCE_EXPORT_PORTS.forEach((p) => {
      if (!groups[p.country]) groups[p.country] = [];
      groups[p.country].push(p);
    });
    return groups;
  }, []);

  const handleRunAi = (promptText: string) => {
    setAiLoading(true);
    setAiPromptInput(promptText);
    setTimeout(() => {
      setAiLoading(false);
      setAiResponse(
        `Neural analysis for ${source.name} → ${destination.name} (${vesselClass.name}): Model projects 34-day freight rate bottoming at $12.23/MT. Recommended action: Lock 3-voyage COA at $12.54/MT ceiling before monsoon rebound. Demurrage exposure at ${destination.name} estimated at 3.2 days waiting ($${Math.round(3.2 * vesselClass.dailyCharterBenchmarkUSD).toLocaleString()} USD).`
      );
      if (onAIPromptExecute) onAIPromptExecute(promptText);
    }, 600);
  };

  return (
    <div className="w-full text-left select-none">
      
      {/* 1. Notion Cover Banner (Matching user screenshot 9.25.40 AM) */}
      {showCover && (
        <div className={`relative w-full h-36 sm:h-48 bg-gradient-to-r ${coverGradient} border-b border-white/10 overflow-hidden group`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.06),transparent_70%)]" />
          
          {/* Cover Action Buttons */}
          <div className="absolute bottom-2.5 right-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => {
                const gradients = [
                  'from-zinc-900 via-neutral-900 to-zinc-950',
                  'from-blue-950 via-slate-900 to-zinc-950',
                  'from-emerald-950 via-zinc-900 to-zinc-950',
                  'from-neutral-950 via-stone-900 to-zinc-950',
                ];
                const nextIdx = (gradients.indexOf(coverGradient) + 1) % gradients.length;
                setCoverGradient(gradients[nextIdx]);
              }}
              className="px-2.5 py-1 rounded bg-black/70 hover:bg-black text-[11px] text-zinc-300 hover:text-white border border-white/15 backdrop-blur-md transition-all"
            >
              Change cover
            </button>
            <button
              onClick={() => setShowCover(false)}
              className="px-2 py-1 rounded bg-black/70 hover:bg-black text-[11px] text-zinc-400 hover:text-white border border-white/15 backdrop-blur-md transition-all"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        
        {/* 2. Notion Page Icon & Picker (Overlaying cover bottom) */}
        <div className="relative -mt-8 sm:-mt-10 mb-4 flex items-center justify-between">
          
          <Popover open={iconPickerOpen} onOpenChange={setIconPickerOpen}>
            <PopoverTrigger asChild>
              <button
                title="Change Page Icon"
                className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-[#202020] border-2 border-black text-3xl sm:text-4xl shadow-2xl hover:scale-105 transition-transform group relative cursor-pointer"
              >
                <span>{icon}</span>
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-black text-[10px] font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                  ✎
                </span>
              </button>
            </PopoverTrigger>

            <PopoverContent className="w-64 p-3 bg-[#202020] border-white/15 text-xs text-zinc-200 shadow-2xl space-y-2" align="start">
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-[11px] font-semibold text-white">
                <span>Select Notion Icon</span>
                <button
                  onClick={() => {
                    onChangeIcon('📄');
                    setIconPickerOpen(false);
                  }}
                  className="text-zinc-500 hover:text-white text-[10px]"
                >
                  Reset
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2 pt-1 text-xl">
                {emojiOptions.map((e) => (
                  <button
                    key={e}
                    onClick={() => {
                      onChangeIcon(e);
                      setIconPickerOpen(false);
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {e}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {!showCover && (
            <button
              onClick={() => setShowCover(true)}
              className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1 self-end"
            >
              <ImageIcon className="h-3.5 w-3.5" />
              <span>Add cover</span>
            </button>
          )}

        </div>

        {/* 3. Document H1 Title & Subtitle */}
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-4xl">
            {subtitle}
          </p>
        </div>

        {/* 4. Notion Properties Strip: Origin, Destination, Vessel Class */}
        <div className="mt-5 p-3 sm:p-4 rounded-xl bg-[#191919] border border-white/10 space-y-3">
          
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-2.5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-semibold flex items-center gap-1.5">
              <Navigation className="h-3 w-3 text-white" />
              <span>Corridor Properties</span>
            </span>

            {/* Vessel Class Selector Pills */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-zinc-900 border border-white/10 text-xs font-mono">
              {(['panamax', 'capesize', 'supramax', 'handysize'] as const).map((vcId) => {
                const spec = VESSEL_CLASSES[vcId];
                const isActive = vesselClass.id === vcId;

                return (
                  <button
                    key={vcId}
                    onClick={() => onSelectVesselClassId(vcId)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                      isActive
                        ? 'bg-white text-black font-bold shadow-md'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Ship className="h-3 w-3" />
                    <span>{spec.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            
            {/* Origin Port Property */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                <Globe className="h-3 w-3 text-white" />
                <span>Export Origin Terminal</span>
              </label>

              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-900/90 border border-white/15 hover:border-white/30 text-xs text-white transition-all shadow-inner group">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-zinc-500 font-normal">[{source.country}]</span>
                      <span className="font-semibold text-white">{source.name}</span>
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 text-zinc-400 group-data-[state=open]:rotate-180 transition-transform" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 sm:w-96 p-2 bg-[#202020] border-white/20 text-xs max-h-96 overflow-y-auto shadow-2xl" align="start">
                  <div className="text-[10px] font-semibold text-zinc-500 px-3 py-1 uppercase tracking-wider">
                    Bulk Export Loading Ports
                  </div>
                  {Object.entries(sourcePortsByCountry).map(([country, ports]) => (
                    <div key={country} className="mb-2">
                      <div className="text-[10px] font-bold text-zinc-400 px-2 py-0.5 bg-zinc-900 rounded mb-1">
                        {country}
                      </div>
                      <div className="space-y-0.5">
                        {ports.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => onSelectSourceId(p.id)}
                            className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between ${
                              source.id === p.id
                                ? 'bg-white/15 text-white font-semibold border border-white/20'
                                : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            <div>
                              <div className="font-medium text-white">{p.name}</div>
                              <div className="text-[9px] text-zinc-500">{p.primaryCargo}</div>
                            </div>
                            <span className="font-mono text-[10px] text-zinc-400">~${p.baseRateUSD}/MT</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </PopoverContent>
              </Popover>
            </div>

            {/* Destination Port Property */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                <Anchor className="h-3 w-3 text-white" />
                <span>Destination Discharge Port (Baltic / Northern Europe)</span>
              </label>

              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-900/90 border border-white/15 hover:border-white/30 text-xs text-white transition-all shadow-inner group">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-zinc-500 font-normal">[{destination.state}]</span>
                      <span className="font-semibold text-white">{destination.name}</span>
                      {destination.isSIHCorePort && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-300 font-mono">
                          SIH Core
                        </span>
                      )}
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 text-zinc-400 group-data-[state=open]:rotate-180 transition-transform" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 sm:w-96 p-2 bg-[#202020] border-white/20 text-xs max-h-96 overflow-y-auto shadow-2xl" align="start">
                  <div className="text-[10px] font-semibold text-zinc-500 px-3 py-1 uppercase tracking-wider">
                    Baltic / Northern European Destination Ports
                  </div>
                  <div className="space-y-1 pt-1">
                    {DESTINATION_INDIAN_PORTS.map((dp) => (
                      <button
                        key={dp.id}
                        onClick={() => onSelectDestId(dp.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between ${
                          destination.id === dp.id
                            ? 'bg-white/15 text-white font-semibold border border-white/20'
                            : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div>
                          <div className="font-medium text-white flex items-center gap-1.5">
                            <span>{dp.name}</span>
                            <span className="text-[10px] text-zinc-500">({dp.state})</span>
                          </div>
                          <div className="text-[10px] text-zinc-400">{dp.specialty}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-mono text-zinc-400">{dp.draftMax.split(' ')[0]}</span>
                          <div className="text-[9px] font-mono text-zinc-600">{dp.dischargeRateTPD / 1000}k TPD</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

          </div>

        </div>

        {/* 5. Notion AI Bar (Matching user screenshots 9.24.53 AM & 9.25.05 AM) */}
        <div className="mt-4 p-3 rounded-xl bg-zinc-950/80 border border-white/15 shadow-xl space-y-2 text-xs">
          
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-white shrink-0 animate-pulse" />
            <input
              type="text"
              placeholder="Ask Notion AI to analyze freight forecast, draft fixture clause, or summarize risks..."
              value={aiPromptInput}
              onChange={(e) => setAiPromptInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && aiPromptInput.trim()) {
                  handleRunAi(aiPromptInput);
                }
              }}
              className="w-full bg-transparent text-white placeholder:text-zinc-500 text-xs focus:outline-none"
            />
            <Button
              size="sm"
              variant="outline"
              disabled={aiLoading || !aiPromptInput.trim()}
              onClick={() => handleRunAi(aiPromptInput)}
              className="h-7 px-2.5 text-xs text-white border-white/20 hover:bg-white/10"
            >
              {aiLoading ? 'Thinking...' : 'Generate'}
            </Button>
          </div>

          {/* Preset Prompts matching Notion Screenshot */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-zinc-400 font-mono">
            <span className="text-zinc-600">Draft with AI:</span>
            {[
              `Brainstorm fixture strategy for ${source.name}`,
              `Summarize ${destination.name} queue exposure`,
              `Draft 3-Voyage COA recommendation memo`,
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleRunAi(prompt)}
                className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 hover:border-white/25 hover:text-white transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* AI Response Output Block */}
          {aiResponse && (
            <div className="mt-2 p-3 rounded-lg bg-zinc-900/90 border border-white/10 text-xs text-zinc-300 space-y-2 relative group">
              <div className="flex items-center justify-between text-white font-semibold">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                  <span>Notion AI Fixture Brief</span>
                </span>
                <button
                  onClick={() => setAiResponse(null)}
                  className="text-zinc-500 hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <p className="leading-relaxed text-zinc-200">{aiResponse}</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
