import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  TrendingUp,
  Percent,
  DollarSign,
  Search,
  Bell,
  Camera,
  Settings,
  Plus,
  Undo2,
  Redo2,
  Maximize2,
  Sliders,
  Crosshair,
  Pencil,
  Type,
  Ruler,
  Magnet,
  Lock,
  Eye,
  Trash2,
  BarChart2,
  CandlestickChart,
  LineChart,
  ChevronDown,
  Layers,
  Terminal,
  Activity,
  Check,
  Calendar,
  Clock,
  Zap,
} from 'lucide-react';
import { StockItem, PortInfo, DestinationPortInfo, VesselClassSpec, FinancialYAxisMode } from '@/lib/simulationEngine';
import { FinancialChart } from '@/components/landing/FinancialChart';

interface TradingViewChartTerminalProps {
  source: PortInfo;
  destination: DestinationPortInfo;
  vesselClass: VesselClassSpec;
  panamaxData: StockItem[];
  benchmarkData: StockItem[];
  currentPanamaxRate: number;
  currentBenchmarkRate: number;
  percentChangePanamax: number;
  percentChangeBenchmark: number;
  timeframe: '1M' | '3M' | '6M' | 'YTD' | '1Y' | 'ALL';
  onTimeframeChange: (tf: '1M' | '3M' | '6M' | 'YTD' | '1Y' | 'ALL') => void;
  yAxisMode: FinancialYAxisMode;
  onYAxisModeChange: (mode: FinancialYAxisMode) => void;
  currentBpiPoints?: number;
  targetBpiPoints?: number;
}

export function TradingViewChartTerminal({
  source,
  destination,
  vesselClass,
  panamaxData,
  benchmarkData,
  currentPanamaxRate,
  currentBenchmarkRate,
  percentChangePanamax,
  percentChangeBenchmark,
  timeframe,
  onTimeframeChange,
  yAxisMode,
  onYAxisModeChange,
  currentBpiPoints = 1501,
  targetBpiPoints = 1420,
}: TradingViewChartTerminalProps) {
  const [activeTool, setActiveTool] = useState<string>('crosshair');
  const [activeDockTab, setActiveDockTab] = useState<'screener' | 'pine' | 'strategy' | 'demurrage' | null>(null);
  const [activeIndicators, setActiveIndicators] = useState<string[]>(['ma', 'bb']);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertThreshold, setAlertThreshold] = useState<string>(String(currentPanamaxRate));
  const [alertSaved, setAlertSaved] = useState(false);
  const [interval, setInterval] = useState<'1D' | '1W' | '1M'>('1D');

  const availableIndicators = [
    { id: 'ma', name: 'Baltic 20-Day Moving Average', short: 'BDI MA(20)' },
    { id: 'bb', name: 'Neural Confidence Bands (95% CI)', short: 'Panamax CI' },
    { id: 'mfi', name: 'Money Flow & Fixture Velocity', short: 'MFI(14)' },
    { id: 'aroon', name: 'Aroon Freight Trend Strength', short: 'Aroon(14)' },
    { id: 'bunker', name: 'Singapore VLSFO Spread Spread', short: 'Bunker Spread' },
    { id: 'monsoon', name: 'Bay of Bengal Monsoon Delay Index', short: 'Monsoon Bias' },
  ];

  const toggleIndicator = (id: string) => {
    setActiveIndicators((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full rounded-xl bg-[#131722] border border-[#2a2e39] overflow-hidden text-zinc-300 font-sans shadow-2xl select-none">
      
      {/* 1. TradingView Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#2a2e39] bg-[#1e222d] px-2 py-1.5 text-xs">
        
        {/* Left Ticker & Interval Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          
          {/* Symbol / Ticker Display */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#2a2e39] border border-[#363a45] text-white font-semibold cursor-pointer hover:bg-[#363a45] transition-colors">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-[11px] tracking-wider uppercase">
              {vesselClass.name.split(' ')[0].toUpperCase()}: {source.country.slice(0, 3).toUpperCase()}-{destination.name.slice(0, 3).toUpperCase()}
            </span>
            <span className="text-[10px] text-zinc-400 font-normal">BALTIC</span>
          </div>

          <div className="h-4 w-px bg-[#2a2e39]" />

          {/* Time Interval Pills */}
          <div className="flex items-center gap-0.5 font-mono text-[11px]">
            {(['1D', '1W', '1M'] as const).map((int) => (
              <button
                key={int}
                onClick={() => setInterval(int)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  interval === int
                    ? 'bg-[#2962ff] text-white font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-[#2a2e39]'
                }`}
              >
                {int}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-[#2a2e39] hidden sm:block" />

          {/* Indicators Dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-1 px-2 py-1 rounded text-zinc-300 hover:text-white hover:bg-[#2a2e39] text-xs transition-colors">
                <Sliders className="h-3.5 w-3.5 text-zinc-400" />
                <span>Indicators</span>
                <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 border-[#363a45] text-zinc-400">
                  {activeIndicators.length}
                </Badge>
                <ChevronDown className="h-3 w-3 text-zinc-500" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-2 bg-[#1e222d] border-[#2a2e39] text-xs text-zinc-200 shadow-2xl" align="start">
              <div className="text-[10px] font-mono uppercase text-zinc-400 px-2 py-1 tracking-wider border-b border-[#2a2e39] mb-1">
                Freight Technical Indicators
              </div>
              <div className="space-y-1">
                {availableIndicators.map((ind) => {
                  const isActive = activeIndicators.includes(ind.id);
                  return (
                    <button
                      key={ind.id}
                      onClick={() => toggleIndicator(ind.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded transition-colors text-left ${
                        isActive
                          ? 'bg-[#2962ff]/20 text-[#2962ff] font-medium'
                          : 'hover:bg-[#2a2e39] text-zinc-300'
                      }`}
                    >
                      <span>{ind.name}</span>
                      {isActive && <Check className="h-3.5 w-3.5 text-[#2962ff]" />}
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>

          {/* Rate Alert Button */}
          <Popover open={alertOpen} onOpenChange={setAlertOpen}>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-1 px-2 py-1 rounded text-zinc-300 hover:text-white hover:bg-[#2a2e39] text-xs transition-colors">
                <Bell className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden md:inline">Alert</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-3 bg-[#1e222d] border-[#2a2e39] text-xs text-zinc-200 shadow-2xl" align="start">
              <div className="flex items-center justify-between border-b border-[#2a2e39] pb-2 mb-2">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Bell className="h-3.5 w-3.5 text-amber-400" />
                  <span>Create Freight Rate Alert</span>
                </div>
                <Badge variant="outline" className="text-[10px] border-[#363a45] text-zinc-400 font-mono">
                  {vesselClass.name.split(' ')[0]}
                </Badge>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase font-mono block mb-1">Trigger Condition</label>
                  <div className="p-2 rounded bg-[#131722] border border-[#2a2e39] text-zinc-300 font-mono text-[11px]">
                    Spot Rate falls below or crosses target
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 uppercase font-mono block mb-1">Threshold ($/MT)</label>
                  <input
                    type="number"
                    step="0.10"
                    value={alertThreshold}
                    onChange={(e) => setAlertThreshold(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded bg-[#131722] border border-[#2a2e39] text-white font-mono text-sm focus:outline-none focus:border-[#2962ff]"
                  />
                </div>

                <Button
                  size="sm"
                  className="w-full bg-[#2962ff] hover:bg-[#1e53e5] text-white font-semibold"
                  onClick={() => {
                    setAlertSaved(true);
                    setTimeout(() => {
                      setAlertSaved(false);
                      setAlertOpen(false);
                    }, 1200);
                  }}
                >
                  {alertSaved ? 'Alert Active ✓' : 'Save Trigger Alert'}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Right Utility Buttons */}
        <div className="flex items-center gap-1 text-zinc-400">
          <button title="Undo" className="p-1.5 hover:text-white hover:bg-[#2a2e39] rounded">
            <Undo2 className="h-3.5 w-3.5" />
          </button>
          <button title="Redo" className="p-1.5 hover:text-white hover:bg-[#2a2e39] rounded">
            <Redo2 className="h-3.5 w-3.5" />
          </button>
          <div className="h-4 w-px bg-[#2a2e39]" />
          <button
            title="Take Snapshot"
            onClick={() => alert(`Snapshot captured: ${source.name} → ${destination.name}`)}
            className="p-1.5 hover:text-white hover:bg-[#2a2e39] rounded"
          >
            <Camera className="h-3.5 w-3.5 text-zinc-300" />
          </button>
          <Badge className="bg-[#2962ff] hover:bg-[#1e53e5] text-white text-[11px] font-mono py-0.5 px-2 cursor-pointer">
            LIVE FEED
          </Badge>
        </div>

      </div>

      {/* 2. Middle Area: Left Vertical Drawing Toolbar + Center Chart Canvas */}
      <div className="flex w-full">
        
        {/* Left Vertical Drawing Toolbar */}
        <div className="w-11 border-r border-[#2a2e39] bg-[#1e222d] flex flex-col items-center py-2 gap-2 text-zinc-400 shrink-0">
          {[
            { id: 'crosshair', icon: Crosshair, label: 'Crosshair' },
            { id: 'trendline', icon: TrendingUp, label: 'Trendline' },
            { id: 'brush', icon: Pencil, label: 'Brush' },
            { id: 'text', icon: Type, label: 'Text Callout' },
            { id: 'ruler', icon: Ruler, label: 'Measure Days & $/MT' },
            { id: 'magnet', icon: Magnet, label: 'Magnet Snap' },
            { id: 'lock', icon: Lock, label: 'Lock All Drawings' },
            { id: 'eye', icon: Eye, label: 'Hide Indicators' },
            { id: 'trash', icon: Trash2, label: 'Clear Chart Canvas' },
          ].map((tool) => {
            const Icon = tool.icon;
            const isSelected = activeTool === tool.id;

            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                title={tool.label}
                className={`p-2 rounded-lg transition-colors relative group ${
                  isSelected
                    ? 'bg-[#2962ff] text-white'
                    : 'hover:bg-[#2a2e39] hover:text-white text-zinc-400'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            );
          })}
        </div>

        {/* Center Financial Chart Canvas */}
        <div className="flex-1 min-w-0 bg-[#131722] p-2">
          
          {/* Active Indicators Strip matching TradingView */}
          <div className="flex flex-wrap items-center gap-2 px-3 py-1 font-mono text-[10px] text-zinc-400 bg-[#1e222d]/60 rounded-md mb-2 border border-[#2a2e39]">
            <span className="font-semibold text-white">
              {source.name} → {destination.name} · {interval} · {vesselClass.name}
            </span>
            <span className="text-zinc-600">|</span>
            <span className="text-amber-400 font-semibold">BPI Spot: {currentBpiPoints.toLocaleString()} pts (+52.7%)</span>
            <span className="text-zinc-600">|</span>
            <span className="text-emerald-400">
              Spot: {yAxisMode === 'BPI_Points' ? `${currentBpiPoints.toLocaleString()} pts` : `$${Number(currentBenchmarkRate).toFixed(2)}/MT`}
            </span>
            <span className="text-white">
              Panamax AI: {yAxisMode === 'BPI_Points' ? `${targetBpiPoints.toLocaleString()} pts` : `$${Number(currentPanamaxRate).toFixed(2)}/MT`}
            </span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400 bg-[#2a2e39] px-1.5 py-0.5 rounded text-[9px]">
              DB: 20 Baltic Records (974 → 1,501)
            </span>
            {activeIndicators.map((indId) => {
              const ind = availableIndicators.find((i) => i.id === indId);
              return ind ? (
                <span key={ind.id} className="text-zinc-400 bg-[#2a2e39] px-1.5 py-0.5 rounded">
                  {ind.short}
                </span>
              ) : null;
            })}
          </div>

          {/* Main Infragistics Chart with SweepFromCategoryAxisMinimum 1500ms animation */}
          <FinancialChart
            panamaxData={panamaxData}
            benchmarkData={benchmarkData}
            title={`${source.name} → ${destination.name}`}
            subtitle={`${vesselClass.name}: Realized Baltic Spot vs Panamax Neural Forecast (${timeframe})`}
            yAxisMode={yAxisMode}
            percentChangePanamax={percentChangePanamax}
            percentChangeBenchmark={percentChangeBenchmark}
            currentPanamaxRate={currentPanamaxRate}
            currentBenchmarkRate={currentBenchmarkRate}
            currentBpiPoints={currentBpiPoints}
            targetBpiPoints={targetBpiPoints}
          />
        </div>

      </div>

      {/* 3. Bottom Status & Range Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-[#2a2e39] bg-[#1e222d] px-3 py-1.5 text-xs font-mono gap-2">
        
        {/* Timeframe Range Selector */}
        <div className="flex items-center gap-1">
          {(['1M', '3M', '6M', 'YTD', '1Y', 'ALL'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
              className={`px-2 py-0.5 rounded transition-colors text-[11px] ${
                timeframe === tf
                  ? 'bg-white text-black font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-[#2a2e39]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Mode Toggle & Clock Telemetry */}
        <div className="flex items-center gap-3 text-zinc-400 text-[11px]">
          <div className="flex items-center gap-1 p-0.5 rounded bg-[#131722] border border-[#2a2e39]">
            <button
              onClick={() => onYAxisModeChange('PercentChange')}
              title="Percent Change Mode"
              className={`px-2 py-0.5 rounded ${
                yAxisMode === 'PercentChange' ? 'bg-[#2a2e39] text-white font-semibold' : 'text-zinc-500 hover:text-white'
              }`}
            >
              %
            </button>
            <button
              onClick={() => onYAxisModeChange('Numeric')}
              title="Dollar/MT Mode"
              className={`px-2 py-0.5 rounded ${
                yAxisMode === 'Numeric' ? 'bg-[#2a2e39] text-white font-semibold' : 'text-zinc-500 hover:text-white'
              }`}
            >
              $
            </button>
            <button
              onClick={() => onYAxisModeChange('BPI_Points')}
              title="Baltic Panamax Index Points Mode"
              className={`px-2 py-0.5 rounded ${
                yAxisMode === 'BPI_Points' ? 'bg-[#2a2e39] text-white font-semibold' : 'text-zinc-500 hover:text-white'
              }`}
            >
              BPI
            </button>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-zinc-400">
            <Clock className="h-3 w-3 text-emerald-400" />
            <span>IST (UTC+5:30)</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400">reg</span>
            <span className="text-zinc-400">adj</span>
            <span className="text-emerald-400 font-bold">auto</span>
          </div>
        </div>

      </div>

      {/* 4. Bottom Dock Tabs Bar */}
      <div className="border-t border-[#2a2e39] bg-[#131722] px-3 py-1 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1">
          {[
            { id: 'screener', label: 'Freight Screener' },
            { id: 'pine', label: 'Pine Script Editor' },
            { id: 'strategy', label: 'Strategy Tester' },
            { id: 'demurrage', label: 'Demurrage Panel' },
          ].map((tab) => {
            const isActive = activeDockTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveDockTab(isActive ? null : (tab.id as any))}
                className={`px-3 py-1 rounded text-[11px] transition-colors ${
                  isActive
                    ? 'bg-[#1e222d] text-white font-semibold border-b-2 border-[#2962ff]'
                    : 'text-zinc-400 hover:text-white hover:bg-[#1e222d]/60'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="text-[10px] text-zinc-500">
          * SweepFromCategoryAxisMinimum (1500ms) active
        </div>
      </div>

      {/* Expandable Dock Panel Drawer */}
      {activeDockTab && (
        <div className="p-4 border-t border-[#2a2e39] bg-[#1e222d] text-xs font-mono space-y-2 max-h-48 overflow-y-auto">
          <div className="flex items-center justify-between text-zinc-400 pb-1 border-b border-[#2a2e39]">
            <span className="uppercase font-bold text-white tracking-wider">
              {activeDockTab === 'screener' && 'Baltic Export Corridor Screener (BPI Calibrated)'}
              {activeDockTab === 'pine' && 'Custom Freight Prediction Model Pine Script'}
              {activeDockTab === 'strategy' && '3-Voyage COA vs Spot Backtest Performance'}
              {activeDockTab === 'demurrage' && 'East Coast Indian Port Demurrage Calculator'}
            </span>
            <button
              onClick={() => setActiveDockTab(null)}
              className="text-zinc-400 hover:text-white text-xs px-2 py-0.5 rounded bg-[#131722]"
            >
              ✕ Close
            </button>
          </div>

          {activeDockTab === 'screener' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
              <div className="p-2 rounded bg-[#131722]">
                <span className="text-zinc-500 block">Taboneo → Paradip</span>
                <span className="text-white font-bold">$18.60/MT</span>
                <span className="text-emerald-400 block">BPI 1,501 (+52.7%)</span>
              </div>
              <div className="p-2 rounded bg-[#131722]">
                <span className="text-zinc-500 block">Gladstone → Vizag</span>
                <span className="text-white font-bold">$29.97/MT</span>
                <span className="text-emerald-400 block">BPI 1,501 (+52.7%)</span>
              </div>
              <div className="p-2 rounded bg-[#131722]">
                <span className="text-zinc-500 block">Maputo → Gangavaram</span>
                <span className="text-white font-bold">$23.41/MT</span>
                <span className="text-emerald-400 block">BPI 1,501 (+52.7%)</span>
              </div>
              <div className="p-2 rounded bg-[#131722]">
                <span className="text-zinc-500 block">Ust-Luga → Paradip</span>
                <span className="text-white font-bold">$132.84/MT</span>
                <span className="text-emerald-400 block">Urals (+48.2%)</span>
              </div>
            </div>
          )}

          {activeDockTab === 'pine' && (
            <pre className="p-2 rounded bg-[#131722] text-zinc-300 text-[10px] leading-relaxed overflow-x-auto">
              {`//@version=5\nindicator("Panamax Neural Forecast Engine", overlay=true)\nlength = input(20, "Baltic Lookback")\nfuel_weight = input(0.35, "VLSFO Sensitivity")\nberth_lag = input(4.2, "Discharge Port Queue Bias")\nneural_curve = ta.ema(close, length) * (1.0 + (fuel_weight * 0.08))\nplot(neural_curve, color=color.white, linewidth=2, title="Panamax AI Forward Projection")`}
            </pre>
          )}

          {activeDockTab === 'strategy' && (
            <div className="flex flex-wrap gap-4 text-zinc-300 pt-1">
              <div>
                <span className="text-zinc-500 block">Backtested Period:</span>
                <span className="text-white font-bold">12 Years (2014-2026)</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Spot vs COA Win Rate:</span>
                <span className="text-emerald-400 font-bold">78.4% Outperformance</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Average Savings / Fixture:</span>
                <span className="text-white font-bold">+$108,000 USD</span>
              </div>
            </div>
          )}

          {activeDockTab === 'demurrage' && (
            <div className="text-zinc-300 text-[11px] leading-relaxed">
              Based on Paradip average queue of 3.2 days, daily charter hire of ${vesselClass.dailyCharterBenchmarkUSD.toLocaleString()}/day yields estimated demurrage exposure of <strong className="text-amber-400">${Math.round(3.2 * vesselClass.dailyCharterBenchmarkUSD).toLocaleString()} USD</strong>. Recommend insertion of 72hr laytime grace clause.
            </div>
          )}
        </div>
      )}

    </div>
  );
}
