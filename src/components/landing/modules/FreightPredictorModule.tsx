import React, { useState, useMemo } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import {
  Ship,
  Compass,
  Anchor,
  Globe,
  Navigation,
  ChevronDown,
  Layers,
  ArrowRight,
  TrendingUp,
  Percent,
  DollarSign,
  Activity,
} from 'lucide-react';
import {
  SOURCE_EXPORT_PORTS,
  DESTINATION_INDIAN_PORTS,
  generateRouteFinancialData,
  PortInfo,
} from '@/lib/simulationEngine';
import { FinancialChart } from '../FinancialChart';

export function FreightPredictorModule() {
  const [selectedSourceId, setSelectedSourceId] = useState<string>('id-taboneo');
  const [selectedDestId, setSelectedDestId] = useState<string>('in-paradip');
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | 'YTD' | '1Y' | 'ALL'>('1Y');
  const [yAxisMode, setYAxisMode] = useState<'PercentChange' | 'Numeric'>('PercentChange');

  // Dynamic route data calculation with smooth recalculation
  const routeData = useMemo(() => {
    return generateRouteFinancialData(selectedSourceId, selectedDestId, timeframe);
  }, [selectedSourceId, selectedDestId, timeframe]);

  const sourcePort = routeData.source;
  const destPort = routeData.destination;

  // Group source ports by country
  const sourcePortsByCountry = useMemo(() => {
    const groups: Record<string, PortInfo[]> = {};
    SOURCE_EXPORT_PORTS.forEach((p) => {
      if (!groups[p.country]) groups[p.country] = [];
      groups[p.country].push(p);
    });
    return groups;
  }, []);

  return (
    <div className="space-y-6 text-left">
      
      {/* Route Selection Bar with 2 Separate Dropdowns */}
      <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950 border border-white/10 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 border border-white/10 text-white shadow-inner">
              <Navigation className="h-4 w-4 text-zinc-300" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">
                Corridor Fixture Selector
              </h3>
              <p className="text-xs text-zinc-400">
                Select export origin country and East Coast Indian discharge terminal
              </p>
            </div>
          </div>

          {/* Timeframe Buttons Bar (1M, 3M, 6M, YTD, 1Y, ALL) matching reference screenshot */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900 border border-white/10 self-start md:self-auto text-xs font-mono">
            {(['1M', '3M', '6M', 'YTD', '1Y', 'ALL'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  timeframe === tf
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

        </div>

        {/* The 2 Separate Dropdown Menus */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2 border-t border-white/5">
          
          {/* Dropdown 1: Source Export Port (Countries Exporting to India) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-zinc-400" />
              <span>1. Source Export Country / Terminal</span>
            </label>

            <Popover>
              <PopoverTrigger asChild>
                <button className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-white/15 hover:border-white/30 text-xs font-medium text-white transition-all shadow-inner group">
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-zinc-400 font-normal">[{sourcePort.country}]</span>
                    <span className="font-semibold text-white">{sourcePort.name}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-zinc-400 transition-transform group-data-[state=open]:rotate-180" />
                </button>
              </PopoverTrigger>

              <PopoverContent className="w-80 sm:w-96 p-2 bg-zinc-950 border-white/20 text-xs max-h-96 overflow-y-auto shadow-2xl" align="start">
                <div className="text-[11px] font-semibold text-zinc-500 px-3 py-1.5 uppercase tracking-wider">
                  Global Bulk Exporters to India
                </div>

                {Object.entries(sourcePortsByCountry).map(([country, ports]) => (
                  <div key={country} className="mb-2.5">
                    <div className="text-[11px] font-bold text-zinc-400 px-3 py-1 bg-zinc-900/60 rounded-md mb-1">
                      {country}
                    </div>
                    <div className="space-y-0.5">
                      {ports.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setSelectedSourceId(p.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                            selectedSourceId === p.id
                              ? 'bg-white/10 text-white font-semibold'
                              : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <div>
                            <div className="font-medium text-white">{p.name}</div>
                            <div className="text-[10px] text-zinc-500">{p.primaryCargo}</div>
                          </div>
                          <div className="text-right font-mono text-[11px] text-zinc-400">
                            ~${p.baseRateUSD}/MT
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </PopoverContent>
            </Popover>
          </div>

          {/* Dropdown 2: Destination Port (All East India Ports) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Anchor className="h-3.5 w-3.5 text-zinc-400" />
              <span>2. Destination Port (East Coast India)</span>
            </label>

            <Popover>
              <PopoverTrigger asChild>
                <button className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-white/15 hover:border-white/30 text-xs font-medium text-white transition-all shadow-inner group">
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-zinc-400 font-normal">[{destPort.state}]</span>
                    <span className="font-semibold text-white">{destPort.name}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-zinc-400 transition-transform group-data-[state=open]:rotate-180" />
                </button>
              </PopoverTrigger>

              <PopoverContent className="w-80 sm:w-96 p-2 bg-zinc-950 border-white/20 text-xs max-h-96 overflow-y-auto shadow-2xl" align="start">
                <div className="text-[11px] font-semibold text-zinc-500 px-3 py-1.5 uppercase tracking-wider">
                  All East Coast India Discharge Ports
                </div>

                <div className="space-y-1 pt-1">
                  {DESTINATION_INDIAN_PORTS.map((dp) => (
                    <button
                      key={dp.id}
                      onClick={() => setSelectedDestId(dp.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                        selectedDestId === dp.id
                          ? 'bg-white/10 text-white font-semibold'
                          : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-white flex items-center gap-1.5">
                          <span>{dp.name}</span>
                          <span className="text-[10px] text-zinc-500 font-normal">({dp.state})</span>
                        </div>
                        <div className="text-[10px] text-zinc-400">{dp.specialty}</div>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">{dp.draftMax.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

        </div>

        {/* Live Route Telemetry Status Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/5 text-xs font-mono">
          <div className="p-2 rounded-lg bg-zinc-900/50 border border-white/5">
            <span className="text-zinc-500 text-[10px] uppercase">Nautical Distance</span>
            <div className="text-white font-semibold mt-0.5">{sourcePort.nauticalMilesToEastIndia.toLocaleString()} nm</div>
          </div>
          <div className="p-2 rounded-lg bg-zinc-900/50 border border-white/5">
            <span className="text-zinc-500 text-[10px] uppercase">Vessel Class</span>
            <div className="text-white font-semibold mt-0.5">Panamax (75,000 MT)</div>
          </div>
          <div className="p-2 rounded-lg bg-zinc-900/50 border border-white/5">
            <span className="text-zinc-500 text-[10px] uppercase">Benchmark Rate</span>
            <div className="text-white font-semibold mt-0.5">${routeData.currentBenchmarkRate}/MT</div>
          </div>
          <div className="p-2 rounded-lg bg-zinc-900/50 border border-white/5">
            <span className="text-zinc-500 text-[10px] uppercase">AI Projected Target</span>
            <div className="text-purple-400 font-semibold mt-0.5">${routeData.currentPanamaxRate}/MT</div>
          </div>
        </div>

      </div>

      {/* Financial Chart Component (Exact Match to User Reference Screenshot) */}
      <FinancialChart
        panamaxData={routeData.panamaxForecast}
        benchmarkData={routeData.marketBenchmark}
        title={`${sourcePort.name} vs ${destPort.name}`}
        subtitle={`Realized Baltic Fixtures vs. Panamax Neural Forward Forecast (${timeframe})`}
        yAxisMode={yAxisMode}
        percentChangePanamax={routeData.percentChangePanamax}
        percentChangeBenchmark={routeData.percentChangeBenchmark}
        currentPanamaxRate={routeData.currentPanamaxRate}
        currentBenchmarkRate={routeData.currentBenchmarkRate}
      />

    </div>
  );
}
