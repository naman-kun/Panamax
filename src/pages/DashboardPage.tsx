import React, { useState, useMemo } from 'react';
import {
  SOURCE_EXPORT_PORTS,
  DESTINATION_INDIAN_PORTS,
  VESSEL_CLASSES,
  VesselClassId,
  generateRouteFinancialData,
  FinancialYAxisMode,
} from '@/lib/simulationEngine';
import { NotionSidebar, DashboardPageId } from '@/components/dashboard/NotionSidebar';
import { NotionTopBar, NotionFontStyle } from '@/components/dashboard/NotionTopBar';
import { NotionPageHeader } from '@/components/dashboard/NotionPageHeader';
import { MarketForecastPillar } from '@/components/dashboard/MarketForecastPillar';
import { VesselOptimizerPillar } from '@/components/dashboard/VesselOptimizerPillar';
import { IdleFleetPillar } from '@/components/dashboard/IdleFleetPillar';
import { RiskSentinelPillar } from '@/components/dashboard/RiskSentinelPillar';
import { TradingViewChartTerminal } from '@/components/dashboard/TradingViewChartTerminal';
import { NotionFixtureDatabase } from '@/components/dashboard/NotionFixtureDatabase';
import { NotionAISandbox } from '@/components/dashboard/NotionAISandbox';

interface DashboardPageProps {
  onBackToLanding: () => void;
}

export function DashboardPage({ onBackToLanding }: DashboardPageProps) {
  const [activePage, setActivePage] = useState<DashboardPageId>('pillar-a');
  const [selectedSourceId, setSelectedSourceId] = useState<string>('in-kolkata');
  const [selectedDestId, setSelectedDestId] = useState<string>('eu-gdansk');
  const [selectedVesselClassId, setSelectedVesselClassId] = useState<VesselClassId>('panamax');
  const [cargoQuantityMT, setCargoQuantityMT] = useState<number>(75000);

  // Notion Workspace Configuration State (Matching user screenshots)
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fontStyle, setFontStyle] = useState<NotionFontStyle>('sans');
  const [isSmallText, setIsSmallText] = useState(false);
  const [isFullWidth, setIsFullWidth] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [pageIcons, setPageIcons] = useState<Record<DashboardPageId, string>>({
    'pillar-a': '📈',
    'pillar-b': '🚢',
    'pillar-c': '🔄',
    'pillar-d': '🛡️',
    tradingview: '📊',
    fixtures: '📋',
    'ai-sandbox': '✨',
  });

  const source = useMemo(() => {
    return SOURCE_EXPORT_PORTS.find((p) => p.id === selectedSourceId) || SOURCE_EXPORT_PORTS[0];
  }, [selectedSourceId]);

  const destination = useMemo(() => {
    return DESTINATION_INDIAN_PORTS.find((p) => p.id === selectedDestId) || DESTINATION_INDIAN_PORTS[0];
  }, [selectedDestId]);

  const vesselClass = useMemo(() => {
    return VESSEL_CLASSES[selectedVesselClassId] || VESSEL_CLASSES.panamax;
  }, [selectedVesselClassId]);

  // Route financial data for full TradingView mode
  const [tvTimeframe, setTvTimeframe] = useState<'1M' | '3M' | '6M' | 'YTD' | '1Y' | 'ALL'>('1Y');
  const [tvYAxisMode, setTvYAxisMode] = useState<FinancialYAxisMode>('PercentChange');
  const tvRouteData = useMemo(() => {
    return generateRouteFinancialData(source.id, destination.id, tvTimeframe, vesselClass.id, tvYAxisMode);
  }, [source.id, destination.id, tvTimeframe, vesselClass.id, tvYAxisMode]);

  const pageMeta: Record<DashboardPageId, { title: string; subtitle: string }> = {
    'pillar-a': {
      title: 'Pillar A: Rate Forecast & COA Arbitrage',
      subtitle: `Institutional forward projection modeled on Baltic dry bulk fixtures, bunker spreads, and port congestion for ${source.name} → ${destination.name}.`,
    },
    'pillar-b': {
      title: 'Pillar B: Vessel Type Optimizer & Port Constraints',
      subtitle: `Multi-variable physical screening comparing vessel dimensions (LOA, beam, draft) and handling throughput against ${destination.name}.`,
    },
    'pillar-c': {
      title: 'Pillar C: Post-Discharge Idle Fleet & Cabotage',
      subtitle: `Eliminating deadweight idle days and uncompensated ballast voyages after bulk cargo discharge at ${destination.name}.`,
    },
    'pillar-d': {
      title: 'Pillar D: Risk Sentinel & Congestion Telemetry',
      subtitle: `Real-time monitoring of Bay of Bengal tropical swell, East Coast coal berth queues, Singapore bunker volatility, and chokepoints.`,
    },
    tradingview: {
      title: 'TradingView Freight Rate Terminal',
      subtitle: `Interactive institutional charting terminal with technical indicators, drawing tools, and Baltic realized benchmark comparison.`,
    },
    fixtures: {
      title: 'Commercial Fixture Database',
      subtitle: `Notion multi-view database tracking executed and pending bulk cargo fixtures across East Coast India import corridors.`,
    },
    'ai-sandbox': {
      title: 'Notion AI Chartering Assistant',
      subtitle: `Generative intelligence sandbox for drafting board-level procurement memos, counter-offers, and berth demurrage risk briefs.`,
    },
  };

  const currentMeta = pageMeta[activePage];
  const currentIcon = pageIcons[activePage];

  const fontClass =
    fontStyle === 'serif' ? 'font-serif' : fontStyle === 'mono' ? 'font-mono' : 'font-sans';

  return (
    <div className="flex h-screen w-screen bg-[#191919] text-zinc-100 overflow-hidden select-none">
      
      {/* 1. Left Notion Collapsible Sidebar */}
      <NotionSidebar
        activePage={activePage}
        onSelectPage={setActivePage}
        isOpen={sidebarOpen}
        onToggleOpen={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* 2. Main Notion Canvas Area */}
      <div className={`flex-1 flex flex-col h-full overflow-y-auto bg-[#191919] ${fontClass} ${isSmallText ? 'text-xs' : 'text-sm'}`}>
        
        {/* Sticky Notion Top Bar */}
        <NotionTopBar
          activePage={activePage}
          pageTitle={currentMeta.title}
          onBackToLanding={onBackToLanding}
          fontStyle={fontStyle}
          onChangeFontStyle={setFontStyle}
          isSmallText={isSmallText}
          onToggleSmallText={setIsSmallText}
          isFullWidth={isFullWidth}
          onToggleFullWidth={setIsFullWidth}
          isLocked={isLocked}
          onToggleLock={setIsLocked}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Notion Document Canvas */}
        <main className="flex-1 pb-16">
          
          {/* Notion Document Header (Cover, Icon, Title, Corridor Properties, AI Bar) */}
          <NotionPageHeader
            icon={currentIcon}
            onChangeIcon={(newIcon) =>
              setPageIcons((prev) => ({ ...prev, [activePage]: newIcon }))
            }
            title={currentMeta.title}
            subtitle={currentMeta.subtitle}
            source={source}
            destination={destination}
            vesselClass={vesselClass}
            onSelectSourceId={setSelectedSourceId}
            onSelectDestId={setSelectedDestId}
            onSelectVesselClassId={(id) => {
              setSelectedVesselClassId(id);
              setCargoQuantityMT(VESSEL_CLASSES[id].typicalCargoMT);
            }}
          />

          {/* Dynamic Page Content Section */}
          <div className={`mx-auto px-4 sm:px-8 mt-6 ${isFullWidth ? 'max-w-full' : 'max-w-6xl'}`}>
            
            {activePage === 'pillar-a' && (
              <MarketForecastPillar
                source={source}
                destination={destination}
                vesselClass={vesselClass}
                cargoQuantityMT={cargoQuantityMT}
              />
            )}

            {activePage === 'pillar-b' && (
              <VesselOptimizerPillar
                source={source}
                destination={destination}
                activeVesselClass={vesselClass}
                onSelectVesselClass={(vc) => {
                  setSelectedVesselClassId(vc.id);
                  setCargoQuantityMT(vc.typicalCargoMT);
                }}
              />
            )}

            {activePage === 'pillar-c' && (
              <IdleFleetPillar
                destination={destination}
                vesselClass={vesselClass}
              />
            )}

            {activePage === 'pillar-d' && (
              <RiskSentinelPillar
                source={source}
                destination={destination}
                vesselClass={vesselClass}
              />
            )}

            {activePage === 'tradingview' && (
              <TradingViewChartTerminal
                source={source}
                destination={destination}
                vesselClass={vesselClass}
                panamaxData={tvRouteData.panamaxForecast}
                benchmarkData={tvRouteData.marketBenchmark}
                currentPanamaxRate={tvRouteData.currentPanamaxRate}
                currentBenchmarkRate={tvRouteData.currentBenchmarkRate}
                percentChangePanamax={tvRouteData.percentChangePanamax}
                percentChangeBenchmark={tvRouteData.percentChangeBenchmark}
                timeframe={tvTimeframe}
                onTimeframeChange={setTvTimeframe}
                yAxisMode={tvYAxisMode}
                onYAxisModeChange={setTvYAxisMode}
                currentBpiPoints={tvRouteData.currentBpiPoints}
                targetBpiPoints={tvRouteData.targetBpiPoints}
              />
            )}

            {activePage === 'fixtures' && <NotionFixtureDatabase />}

            {activePage === 'ai-sandbox' && (
              <NotionAISandbox
                source={source}
                destination={destination}
                vesselClass={vesselClass}
                cargoQuantityMT={cargoQuantityMT}
              />
            )}

          </div>

        </main>

      </div>

    </div>
  );
}
