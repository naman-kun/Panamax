import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { ScrollExpandHero } from '@/components/landing/ScrollExpandHero';
import { LinearFigures } from '@/components/landing/LinearFigures';
import { InteractiveGraph } from '@/components/landing/InteractiveGraph';
import { SeeWhatPanamaxCanDo } from '@/components/landing/SeeWhatPanamaxCanDo';
import { DemoModal } from '@/components/landing/DemoModal';
import { Footer } from '@/components/landing/Footer';
import { DashboardPage } from '@/pages/DashboardPage';

export function App() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash === '#dashboard' ? 'dashboard' : 'landing';
    }
    return 'landing';
  });

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#dashboard') {
        setCurrentView('dashboard');
      } else {
        setCurrentView('landing');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToDashboard = () => {
    window.location.hash = '#dashboard';
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToLanding = () => {
    window.location.hash = '';
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentView === 'dashboard') {
    return <DashboardPage onBackToLanding={navigateToLanding} />;
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 selection:bg-white selection:text-black">
      {/* Topbar slides down smoothly in lockstep with scroll over extended distance */}
      <Navbar
        onOpenDemo={() => setDemoModalOpen(true)}
        onOpenDashboard={navigateToDashboard}
        visible={false}
      />

      {/* Main Content */}
      <main>
        {/* ScrollExpand Hero with nocturnal port image and exact typewriter typography */}
        <ScrollExpandHero
          onOpenDemo={() => setDemoModalOpen(true)}
          onOpenDashboard={navigateToDashboard}
        />

        {/* Sections below hero: Slide up smoothly in lockstep with scroll over extended distance */}
        <div
          id="sections-below-hero"
          style={{
            transform: 'translate3d(0, 48px, 0)',
            opacity: 0,
          }}
          className="will-change-transform pointer-events-none"
        >
          {/* Linear Figures (FIG 0.1, FIG 0.2, FIG 0.3) */}
          <LinearFigures />

          {/* 3D Cursor-Interactive Vector Graph in Enclosed Minimalist Border */}
          <InteractiveGraph />

          {/* See What Panamax Can Do (Notion Card Strip & 4 Interactive Modules) */}
          <SeeWhatPanamaxCanDo onOpenDashboard={navigateToDashboard} />
        </div>
      </main>

      {/* Minimalist Dark Footer */}
      <Footer onOpenDashboard={navigateToDashboard} />

      {/* Interactive Simulation Modal */}
      <DemoModal
        open={demoModalOpen}
        onOpenChange={setDemoModalOpen}
      />
    </div>
  );
}

export default App;
