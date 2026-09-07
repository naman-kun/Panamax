import React, { useState } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { LinearFigures } from '@/components/landing/LinearFigures';
import { InteractiveGraph } from '@/components/landing/InteractiveGraph';
import { BentoGrid } from '@/components/landing/BentoGrid';
import { SeeWhatPanamaxCanDo } from '@/components/landing/SeeWhatPanamaxCanDo';
import { DemoModal } from '@/components/landing/DemoModal';
import { Footer } from '@/components/landing/Footer';

export function App() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-zinc-100 selection:bg-white selection:text-black">
      {/* Topbar matching reference image and PRD */}
      <Navbar onOpenDemo={() => setDemoModalOpen(true)} />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <Hero onOpenDemo={() => setDemoModalOpen(true)} />

        {/* Linear Figures (FIG 0.1, FIG 0.2, FIG 0.3) replacing ship image */}
        <LinearFigures />

        {/* 3D Cursor-Interactive Vector Graph in Enclosed Minimalist Border */}
        <InteractiveGraph />

        {/* Feature Bento Grid with 3D Tilt Cards */}
        <BentoGrid />

        {/* See What Panamax Can Do (Notion Card Strip & 4 Interactive Modules) */}
        <SeeWhatPanamaxCanDo />
      </main>

      {/* Minimalist Dark Footer */}
      <Footer />

      {/* Interactive Simulation Modal */}
      <DemoModal
        open={demoModalOpen}
        onOpenChange={setDemoModalOpen}
      />
    </div>
  );
}

export default App;
