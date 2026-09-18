import React, { useState, useMemo, useEffect } from 'react';
import {
  SOURCE_EXPORT_PORTS,
  DESTINATION_INDIAN_PORTS,
  VESSEL_CLASSES,
  VesselClassId,
} from '@/lib/simulationEngine';
import { NotionSidebar, DashboardPageId } from '@/components/dashboard/NotionSidebar';
import { NotionTopBar, NotionFontStyle } from '@/components/dashboard/NotionTopBar';
import { NotionPageHeader } from '@/components/dashboard/NotionPageHeader';
import { PillarAPage } from './dashboard/PillarAPage';
import { PillarBPage } from './dashboard/PillarBPage';
import { PillarCPage } from './dashboard/PillarCPage';
import { PillarDPage } from './dashboard/PillarDPage';
import { TradingViewPage } from './dashboard/TradingViewPage';
import { FixturesPage } from './dashboard/FixturesPage';
import { AISandboxPage } from './dashboard/AISandboxPage';
import { hashForRoute, routeIdFromHash } from './dashboard/routes';

interface DashboardPageProps {
  onBackToLanding: () => void;
}

export function DashboardPage({ onBackToLanding }: DashboardPageProps) {
  const [activePage, setActivePage] = useState<DashboardPageId>(() => routeIdFromHash(typeof window !== 'undefined' ? window.location.hash : ''));
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

  useEffect(() => {
    const sync = () => setActivePage(routeIdFromHash(window.location.hash));
    window.addEventListener('hashchange', sync);
    if (!window.location.hash.startsWith('#dashboard/')) window.location.hash = hashForRoute(activePage);
    return () => window.removeEventListener('hashchange', sync);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const source = useMemo(() => {
    return SOURCE_EXPORT_PORTS.find((p) => p.id === selectedSourceId) || SOURCE_EXPORT_PORTS[0];
  }, [selectedSourceId]);

  const destination = useMemo(() => {
    return DESTINATION_INDIAN_PORTS.find((p) => p.id === selectedDestId) || DESTINATION_INDIAN_PORTS[0];
  }, [selectedDestId]);

  const vesselClass = useMemo(() => {
    return VESSEL_CLASSES[selectedVesselClassId] || VESSEL_CLASSES.panamax;
  }, [selectedVesselClassId]);

  // TradingView series state now lives in its sub-page (live backend series).

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
        onSelectPage={(pageId) => { window.location.hash = hashForRoute(pageId); setActivePage(pageId); }}
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

          {/* Dynamic Sub-Page Content (each route is a separate sub-page) */}
          <div className={`mx-auto px-4 sm:px-8 mt-6 ${isFullWidth ? 'max-w-full' : 'max-w-6xl'}`}>
            {activePage === 'pillar-a' && (
              <PillarAPage source={source} destination={destination} vesselClass={vesselClass} cargoQuantityMT={cargoQuantityMT} />
            )}
            {activePage === 'pillar-b' && (
              <PillarBPage source={source} destination={destination} vesselClass={vesselClass} cargoQuantityMT={cargoQuantityMT}
                onSelectVesselClass={(vc) => { setSelectedVesselClassId(vc.id); setCargoQuantityMT(vc.typicalCargoMT); }} />
            )}
            {activePage === 'pillar-c' && (
              <PillarCPage source={source} destination={destination} vesselClass={vesselClass} cargoQuantityMT={cargoQuantityMT} />
            )}
            {activePage === 'pillar-d' && (
              <PillarDPage source={source} destination={destination} vesselClass={vesselClass} cargoQuantityMT={cargoQuantityMT} />
            )}
            {activePage === 'tradingview' && (
              <TradingViewPage source={source} destination={destination} vesselClass={vesselClass} cargoQuantityMT={cargoQuantityMT} />
            )}
            {activePage === 'fixtures' && (
              <FixturesPage source={source} destination={destination} vesselClass={vesselClass} cargoQuantityMT={cargoQuantityMT} />
            )}
            {activePage === 'ai-sandbox' && (
              <AISandboxPage source={source} destination={destination} vesselClass={vesselClass} cargoQuantityMT={cargoQuantityMT} />
            )}
          </div>

        </main>

      </div>

    </div>
  );
}
