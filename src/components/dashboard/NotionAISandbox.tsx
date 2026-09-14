import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  ArrowUp,
  RotateCcw,
  Check,
  X,
  FileText,
  ListPlus,
  PenTool,
  TrendingDown,
  ShieldAlert,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { PortInfo, DestinationPortInfo, VesselClassSpec } from '@/lib/simulationEngine';

interface NotionAISandboxProps {
  source: PortInfo;
  destination: DestinationPortInfo;
  vesselClass: VesselClassSpec;
}

export function NotionAISandbox({ source, destination, vesselClass }: NotionAISandboxProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');

  const promptTemplates = [
    {
      id: 'brainstorm',
      label: 'Brainstorm hedging & chartering ideas...',
      results: [
        `Execute 3-Voyage Contract of Affreightment (COA) on ${source.name} → ${destination.name} to lock in a $14.50/MT rate ceiling, hedging against the Baltic Panamax Index surge from 974 to 1,501 (+54.1%).`,
        `Pre-hedge bunker fuel exposure via Singapore VLSFO swap contracts at $585/MT to protect operating margin.`,
        `Split large 160,000 MT Capesize cargo parcels into twin 75,000 MT Panamax fixtures to bypass Haldia draft restrictions (9.2m) without incurring high lighterage fees.`,
        `Negotiate 72-hour demurrage grace period into the fixture charter party to mitigate average 3.2-day berth waiting queues at ${destination.name}.`,
        `Explore coastal cabotage triangulation: Once ${vesselClass.name} unloads bulk coal at ${destination.name}, fix prompt domestic coastal cargo to Ennore rather than empty ballast repositioning.`,
      ],
    },
    {
      id: 'board-memo',
      label: 'Draft board-level procurement recommendation...',
      results: [
        `EXECUTIVE SUMMARY: Commercial Bulk Cargo Procurement Recommendation for FY 2026-27.`,
        `CORRIDOR EVALUATION: Sourcing from ${source.name} (${source.country}) to ${destination.name} (${destination.state}). Total sailing distance: ${source.nauticalMilesToEastIndia.toLocaleString()} nautical miles.`,
        `VESSEL SELECTION: ${vesselClass.name} (${vesselClass.nominalDwtMT / 1000}k DWT) confirmed 100% compliant with ${destination.name} maximum draught (${destination.maxDraft}m) and LOA (${destination.maxLOA}m).`,
        `FINANCIAL OUTCOME: Spot freight has peaked at $18.60/MT following the Baltic Panamax rally to 1,501.00 pts. Locking a 3-voyage COA at $14.50/MT delivers estimated net hedged savings of +$922,500 USD for a 75,000 MT consignment.`,
        `RECOMMENDED BOARD RESOLUTION: Authorize chartering desk to issue firm fixture offer within the identified 18-day window.`,
      ],
    },
    {
      id: 'risk-audit',
      label: 'Summarize maritime risk & port delay factors...',
      results: [
        `BERTH QUEUE SURVEILLANCE: Average wait at ${destination.name} is currently 3.2 days, yielding approximately $${Math.round(3.2 * vesselClass.dailyCharterBenchmarkUSD).toLocaleString()} USD in demurrage risk without dispatch acceleration clauses.`,
        `METEOROLOGICAL SWELL: Bay of Bengal tropical depressions model a 28% likelihood of significant wave heights exceeding 3.5m over the next 30 days.`,
        `BUNKER COST VOLATILITY: Marine fuel spread volatility is elevated; consuming 32.5 MT/day at sea represents 48% of voyage voyage operational expenditure.`,
        `REGULATORY COMPLIANCE: 2026 IMO CII / EEXI rating audit guarantees ${vesselClass.name} Tier-3 engine efficiency, exempting cargo from coastal carbon penalties.`,
      ],
    },
  ];

  const handleTrigger = (template: typeof promptTemplates[0]) => {
    setSelectedPrompt(template.label);
    setIsGenerating(true);
    setGeneratedContent([]);

    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedContent(template.results);
    }, 700);
  };

  return (
    <div className="w-full space-y-6 text-left max-w-4xl mx-auto">
      
      {/* Notion AI Prompt Input Box matching screenshot 9.24.53 AM */}
      <div className="relative rounded-2xl bg-[#191919] border border-white/15 p-4 shadow-2xl space-y-3">
        
        <div className="flex items-center gap-2 px-2 py-1 bg-zinc-900/90 rounded-xl border border-white/10">
          <Sparkles className="h-4 w-4 text-white animate-pulse shrink-0" />
          <input
            type="text"
            placeholder="Ask Notion AI to write anything..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && customInput.trim()) {
                handleTrigger({
                  id: 'custom',
                  label: customInput,
                  results: [
                    `AI Neural assessment for: "${customInput}"`,
                    `Current corridor: ${source.name} → ${destination.name} utilizing ${vesselClass.name}.`,
                    `Freight projections show stabilized Baltic dry index momentum with optimal entry trough in next 2-3 weeks.`,
                    `Recommended operational step: Issue prompt chartering tender with fixed bunker price adjustment formula.`,
                  ],
                });
                setCustomInput('');
              }
            }}
            className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
          />
          <button
            onClick={() => {
              if (customInput.trim()) {
                handleTrigger({
                  id: 'custom',
                  label: customInput,
                  results: [
                    `AI Neural assessment for: "${customInput}"`,
                    `Current corridor: ${source.name} → ${destination.name} utilizing ${vesselClass.name}.`,
                    `Freight projections show stabilized Baltic dry index momentum with optimal entry trough in next 2-3 weeks.`,
                    `Recommended operational step: Issue prompt chartering tender with fixed bunker price adjustment formula.`,
                  ],
                });
                setCustomInput('');
              }
            }}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-black hover:bg-neutral-200 transition-all shrink-0"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>

        {/* Dropdown Menu Template Suggestions (Matching Notion Screenshot 9.24.53 AM) */}
        {!selectedPrompt && (
          <div className="p-2 space-y-1 bg-zinc-950/80 rounded-xl border border-white/10 text-xs">
            <div className="text-[10px] uppercase font-mono text-zinc-500 px-2 py-1 font-semibold">
              Draft with AI
            </div>
            {promptTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTrigger(template)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors text-left group"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-zinc-400 group-hover:text-white" />
                  <span>{template.label}</span>
                </div>
                <span className="text-zinc-600 text-xs group-hover:text-zinc-400">↵</span>
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Generating Status Animation */}
      {isGenerating && (
        <div className="p-4 rounded-xl bg-zinc-950 border border-white/10 flex items-center gap-3 text-xs text-zinc-400">
          <Sparkles className="h-4 w-4 text-white animate-spin" />
          <span>Notion AI is generating maritime intelligence memo...</span>
        </div>
      )}

      {/* Generated Notion Blocks Output (Matching Notion Screenshot 9.25.16 AM & 9.25.29 AM) */}
      {generatedContent.length > 0 && (
        <div className="space-y-4">
          
          <div className="p-6 rounded-2xl bg-[#191919] border border-white/10 space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-white" />
                <span>Generated Fixture Strategy</span>
              </span>
              <Badge variant="outline" className="border-white/20 text-white font-mono text-[10px]">
                {source.name} → {destination.name}
              </Badge>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-200 leading-relaxed list-disc list-inside">
              {generatedContent.map((point, index) => (
                <li key={index} className="p-1.5 rounded hover:bg-white/5 transition-colors">
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            {/* Bottom Notion AI Feedback Toolbar (Matching Screenshot 9.25.29 AM) */}
            <div className="pt-4 mt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => alert('Strategy accepted and pinned to workspace!')}
                  className="h-7 text-xs text-white border-white/20 hover:bg-white/10"
                >
                  <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                  <span>Done</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setGeneratedContent((prev) => [
                      ...prev,
                      `ADDITIONAL RECOMMENDATION: Coordinate with Indian coastal port pilotage authorities 48 hours prior to arrival to secure direct-berthing window.`,
                    ]);
                  }}
                  className="h-7 text-xs text-zinc-300 border-white/15 hover:bg-white/10"
                >
                  <ListPlus className="h-3.5 w-3.5 mr-1" />
                  <span>Continue writing</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setGeneratedContent([]);
                    setSelectedPrompt(null);
                  }}
                  className="h-7 text-xs text-zinc-400 border-white/10 hover:bg-white/10"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1" />
                  <span>Try again</span>
                </Button>
              </div>

              <div className="flex items-center gap-2 text-zinc-500 text-[11px]">
                <span>AI responses modeled on Baltic fixtures</span>
                <button title="Helpful" className="hover:text-white">
                  <ThumbsUp className="h-3 w-3" />
                </button>
                <button title="Unhelpful" className="hover:text-white">
                  <ThumbsDown className="h-3 w-3" />
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
