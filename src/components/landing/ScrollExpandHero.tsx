import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowRight,
  Cpu,
  ShieldCheck,
  Compass,
  SlidersHorizontal,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';

interface ScrollExpandHeroProps {
  onOpenDemo: () => void;
  onOpenDashboard?: () => void;
  onExpansionChange?: (isExpanded: boolean, revealProgress: number) => void;
}

interface DynamicWordItem {
  word: string;
  suffix: string;
  pillStyle: string;
  dotColor: string;
  textColor: string;
}

const DYNAMIC_WORDS: DynamicWordItem[] = [
  {
    word: 'Predict',
    suffix: ' the freight.',
    pillStyle: 'bg-[#E8F4FD] border border-[#CDE5FA]',
    dotColor: '#0070F3',
    textColor: 'text-zinc-950',
  },
  {
    word: 'Time',
    suffix: ' the charter.',
    pillStyle: 'bg-[#EAFBF3] border border-[#C6F4DF]',
    dotColor: '#10B981',
    textColor: 'text-zinc-950',
  },
  {
    word: 'Optimize',
    suffix: ' the cost.',
    pillStyle: 'bg-[#FEF8E7] border border-[#FDEBC4]',
    dotColor: '#F59E0B',
    textColor: 'text-zinc-950',
  },
];

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
};

export function ScrollExpandHero({ onOpenDemo, onOpenDashboard, onExpansionChange }: ScrollExpandHeroProps) {
  // Dynamic animated text state
  const [wordIndex, setWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Capability Cards state
  const [selectedHorizon, setSelectedHorizon] = useState<'30D' | '60D' | '90D'>('30D');
  const [scenarioReroute, setScenarioReroute] = useState(false);
  const [tiltCard, setTiltCard] = useState<number | null>(null);
  const [tiltCoords, setTiltCoords] = useState({ x: 0, y: 0 });

  // DOM Refs
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLImageElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const ctaButtonRef = useRef<HTMLDivElement>(null);
  const capCardsRef = useRef<HTMLDivElement>(null);

  const expandedRef = useRef(false);
  const lastRevealRef = useRef(0);

  // Controlled progress refs:
  // Phase 1 (0 -> 1.0): Main Image Expansion (takes 40% more scroll: divisor 882)
  // Phase 2 (1.0 -> 1.7): Navbar, Button, and Section Below Slide in & Hold (takes 40% more scroll: divisor 630, maxProgress 1.8)
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const rafId = useRef<number>(0);

  const currentItem = DYNAMIC_WORDS[wordIndex];

  // Typewriter animation effect
  useEffect(() => {
    const fullText = currentItem.suffix;
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (displayedText.length < fullText.length) {
        timeout = setTimeout(() => {
          setDisplayedText(fullText.slice(0, displayedText.length + 1));
        }, 55);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(fullText.slice(0, displayedText.length - 1));
        }, 28);
      } else {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % DYNAMIC_WORDS.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, wordIndex, currentItem.suffix]);

  // Card Mouse Move Tilt handler
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTiltCard(index);
    setTiltCoords({ x, y });
  };

  const handleCardMouseLeave = () => {
    setTiltCard(null);
    setTiltCoords({ x: 0, y: 0 });
  };

  const onExpansionChangeRef = useRef(onExpansionChange);
  useEffect(() => {
    onExpansionChangeRef.current = onExpansionChange;
  }, [onExpansionChange]);

  // Apply visual progress to frame, media, border, button, and sections below
  const applyProgress = useCallback((p: number) => {
    const frame = frameRef.current;
    const media = mediaRef.current;
    const scrim = scrimRef.current;
    const border = borderRef.current;
    const ctaButton = ctaButtonRef.current;
    const capCards = capCardsRef.current;
    if (!frame || !media) return;

    // Phase 1: Expansion (p from 0 to 1.0)
    const expansionP = clamp(p, 0, 1);
    const e = smoothstep(0, 1, expansionP);

    const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const h = typeof window !== 'undefined' ? window.innerHeight : 800;

    // Left boundary matching "Freight Rate Market Forecast"
    const max6xlW = Math.min(1152, w);
    const containerPad = w >= 1024 ? 32 : w >= 640 ? 24 : 16;
    const textLeft = Math.max(16, (w - max6xlW) / 2 + containerPad);
    const textW = Math.min(880, w - textLeft - 20);

    // Initial bounding rectangle wrapping the hero text with comfortable padding
    const boxLeft = Math.max(12, textLeft - 28);
    const boxRight = Math.max(12, w - (textLeft + textW + 36));
    const boxTop = Math.max(36, (h - 440) / 2);
    const boxBottom = boxTop;
    const initialRadius = 26;

    // Expand insets: at e=1, expand to -16px past screen edges so white border moves out of screen
    const currentTop = boxTop * (1 - e) - 16 * e;
    const currentBottom = boxBottom * (1 - e) - 16 * e;
    const currentLeft = boxLeft * (1 - e) - 16 * e;
    const currentRight = boxRight * (1 - e) - 16 * e;
    const currentRadius = initialRadius * (1 - e);

    const clipValue = `inset(${currentTop}px ${currentRight}px ${currentBottom}px ${currentLeft}px round ${currentRadius}px)`;
    frame.style.clipPath = clipValue;
    media.style.transform = `scale(${1.32 - 0.32 * e})`;

    // White border wraps the small image; zooms out past screen edges and hides when fully expanded
    if (border) {
      border.style.top = `${currentTop}px`;
      border.style.bottom = `${currentBottom}px`;
      border.style.left = `${currentLeft}px`;
      border.style.right = `${currentRight}px`;
      border.style.borderRadius = `${currentRadius}px`;
      border.style.opacity = p >= 0.98 ? '0' : '1';
    }

    if (scrim) {
      scrim.style.opacity = `${0.5 + 0.18 * e}`;
    }

    // Phase 2: Entrance & Hold for Button, Navbar, and Section Below (p from 1.0 to 1.7)
    const revealP = clamp((p - 1.0) / 0.7, 0, 1);
    const revealEase = smoothstep(0, 1, revealP);

    // 1. CTA Button entrance
    if (ctaButton) {
      ctaButton.style.opacity = `${revealEase}`;
      ctaButton.style.transform = `translate3d(0, ${28 * (1 - revealEase)}px, 0)`;
      ctaButton.style.pointerEvents = revealEase >= 0.75 ? 'auto' : 'none';
    }

    // 2. Capability cards entrance
    if (capCards) {
      capCards.style.opacity = `${revealEase}`;
      capCards.style.transform = `translate3d(0, ${40 * (1 - revealEase)}px, 0)`;
      capCards.style.pointerEvents = revealEase >= 0.75 ? 'auto' : 'none';
    }

    // 3. Navbar entrance (zero-lag direct DOM sync)
    const navEl = document.getElementById('landing-navbar');
    if (navEl) {
      navEl.style.opacity = `${revealEase}`;
      navEl.style.transform = `translate3d(0, ${-100 * (1 - revealEase)}%, 0)`;
      navEl.style.pointerEvents = revealEase >= 0.75 ? 'auto' : 'none';
    }

    // 4. Section below hero entrance (zero-lag direct DOM sync)
    const belowHeroEl = document.getElementById('sections-below-hero');
    if (belowHeroEl) {
      belowHeroEl.style.opacity = `${revealEase}`;
      belowHeroEl.style.transform = `translate3d(0, ${48 * (1 - revealEase)}px, 0)`;
      belowHeroEl.style.pointerEvents = revealEase >= 0.75 ? 'auto' : 'none';
    }

    // Notify parent of expansion state changes only
    const isNowExpanded = p >= 0.98;
    if (isNowExpanded !== expandedRef.current) {
      expandedRef.current = isNowExpanded;
      if (onExpansionChangeRef.current) {
        onExpansionChangeRef.current(isNowExpanded, revealEase);
      }
    }
  }, []);

  // Smooth RAF tick
  const tick = useCallback(() => {
    const k = 0.14; // Smooth easing coefficient
    currentProgress.current += (targetProgress.current - currentProgress.current) * k;

    if (Math.abs(targetProgress.current - currentProgress.current) < 0.001) {
      currentProgress.current = targetProgress.current;
    }

    applyProgress(currentProgress.current);

    if (Math.abs(targetProgress.current - currentProgress.current) >= 0.001) {
      rafId.current = requestAnimationFrame(tick);
    } else {
      rafId.current = 0;
    }
  }, [applyProgress]);

  const kick = useCallback(() => {
    if (!rafId.current) {
      rafId.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  // Wheel and Touch Event Listeners for Static Screen Scroll Control & Fully Re-scrollable Behaviour
  useEffect(() => {
    const maxProgress = 1.8;

    const handleWheel = (e: WheelEvent) => {
      // When near the top of the page, wheel events drive Phase 1 & Phase 2 statically
      if (window.scrollY <= 5) {
        if (targetProgress.current < maxProgress && e.deltaY > 0) {
          // User is scrolling down:
          // Phase 1 uses divisor 882 (40% more scroll to complete main animation: 630 * 1.4)
          // Phase 2 uses divisor 630 (40% more scroll for entrance to stay longer: 450 * 1.4)
          e.preventDefault();
          const divisor = targetProgress.current < 1.0 ? 882 : 630;
          targetProgress.current = clamp(targetProgress.current + e.deltaY / divisor, 0, maxProgress);
          kick();
        } else if (targetProgress.current > 0 && e.deltaY < 0) {
          // User scrolled back up to top -> rescroll the animation back in!
          e.preventDefault();
          const divisor = targetProgress.current <= 1.0 ? 882 : 630;
          targetProgress.current = clamp(targetProgress.current + e.deltaY / divisor, 0, maxProgress);
          kick();
        }
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY <= 5 && e.touches.length === 1) {
        const deltaY = touchStartY - e.touches[0].clientY;
        if (targetProgress.current < maxProgress && deltaY > 0) {
          e.preventDefault();
          const divisor = targetProgress.current < 1.0 ? 672 : 476;
          targetProgress.current = clamp(targetProgress.current + deltaY / divisor, 0, maxProgress);
          touchStartY = e.touches[0].clientY;
          kick();
        } else if (targetProgress.current > 0 && deltaY < 0) {
          e.preventDefault();
          const divisor = targetProgress.current <= 1.0 ? 672 : 476;
          targetProgress.current = clamp(targetProgress.current + deltaY / divisor, 0, maxProgress);
          touchStartY = e.touches[0].clientY;
          kick();
        }
      }
    };

    // Keyboard support for expansion
    const handleKeyDown = (e: KeyboardEvent) => {
      if (window.scrollY <= 5) {
        if ((e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') && targetProgress.current < maxProgress) {
          e.preventDefault();
          targetProgress.current = clamp(targetProgress.current + 0.14, 0, maxProgress);
          kick();
        } else if ((e.key === 'ArrowUp' || e.key === 'PageUp') && targetProgress.current > 0) {
          e.preventDefault();
          targetProgress.current = clamp(targetProgress.current - 0.14, 0, maxProgress);
          kick();
        }
      }
    };

    // Page scroll listener for progressive fade & merge of the background image into the dark sections below
    const handlePageScroll = () => {
      const sy = window.scrollY;
      const navEl = document.getElementById('landing-navbar');
      const belowHeroEl = document.getElementById('sections-below-hero');

      if (sy > 0) {
        // When scrolled down into the page, keep all elements 100% visible and interactive
        if (navEl) {
          navEl.style.opacity = '1';
          navEl.style.transform = 'translate3d(0, 0, 0)';
          navEl.style.pointerEvents = 'auto';
        }
        if (belowHeroEl) {
          belowHeroEl.style.opacity = '1';
          belowHeroEl.style.transform = 'translate3d(0, 0, 0)';
          belowHeroEl.style.pointerEvents = 'auto';
        }
        if (ctaButtonRef.current) {
          ctaButtonRef.current.style.opacity = '1';
          ctaButtonRef.current.style.transform = 'translate3d(0, 0, 0)';
          ctaButtonRef.current.style.pointerEvents = 'auto';
        }
        if (capCardsRef.current) {
          capCardsRef.current.style.opacity = '1';
          capCardsRef.current.style.transform = 'translate3d(0, 0, 0)';
          capCardsRef.current.style.pointerEvents = 'auto';
        }

        // Soft fade of background image as user scrolls down into the page
        const fade = clamp(sy / 500, 0, 1);
        if (mediaRef.current) {
          mediaRef.current.style.opacity = `${1 - fade * 0.88}`;
        }
        if (frameRef.current) {
          const cutPercent = clamp(100 - fade * 75, 25, 100);
          frameRef.current.style.maskImage = `linear-gradient(to bottom, black ${cutPercent}%, transparent 100%)`;
          (frameRef.current.style as any).webkitMaskImage = `linear-gradient(to bottom, black ${cutPercent}%, transparent 100%)`;
        }
      } else {
        // When at top (sy === 0), restore mask and sync DOM with current progress
        if (mediaRef.current) {
          mediaRef.current.style.opacity = '1';
        }
        if (frameRef.current) {
          frameRef.current.style.maskImage = 'none';
          (frameRef.current.style as any).webkitMaskImage = 'none';
        }
        applyProgress(currentProgress.current);
      }
    };

    const handleResize = () => {
      applyProgress(currentProgress.current);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handlePageScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    applyProgress(currentProgress.current);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handlePageScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [applyProgress, kick]);

  return (
    <div className="relative w-full">
      {/* 
        Sticky Viewport Stage:
        Remains 100% static in place on the screen while the frame expands to 100%
      */}
      <div ref={stageRef} className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-black select-none">
        
        {/* Expanding Background Image Frame */}
        <div ref={frameRef} className="absolute inset-0 will-change-[clip-path] z-0">
          <img
            ref={mediaRef}
            className="absolute inset-0 w-full h-full object-cover will-change-transform transform-gpu pointer-events-none"
            src="/landing_hero_bg.jpg"
            alt="Maritime Port at Night"
            draggable={false}
          />
          {/* Scrim overlay to maintain high text legibility */}
          <div ref={scrimRef} className="absolute inset-0 bg-black/60 pointer-events-none transition-opacity duration-300" />
        </div>

        {/* 
          Neat White Border around the ship image:
          Appears only when the ship image is small, framing the hero text.
          When fully scrolled in, it zooms out of the frame and screen dimensions and is hidden!
        */}
        <div
          ref={borderRef}
          className="absolute pointer-events-none z-10 border-2 border-white/95 shadow-[0_0_25px_rgba(255,255,255,0.25),0_0_50px_rgba(0,0,0,0.8)] transition-opacity duration-200"
        />

        {/* 
          Hero Content:
          Leftness aligns strictly with "Freight Rate Market Forecast" (mx-auto max-w-6xl px-4 sm:px-6 lg:px-8).
          The initial box wraps the text (headline + subtitle).
          The CTA button is NOT part of the initial box and slides up once expansion completes.
        */}
        <div className="relative z-20 w-full mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-left">
          <div className="max-w-4xl text-left">
            
            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[68px] font-bold tracking-tight text-white leading-[1.14]">
              <span className="block">We help chartering teams</span>

              {/* Dynamic Word in rounded-full pill with dot & dropdown slot animation */}
              <span className="inline-flex items-center gap-2.5 sm:gap-4 mt-2.5 sm:mt-3 whitespace-nowrap flex-nowrap overflow-visible">
                <span
                  className={`inline-flex items-center justify-start rounded-full px-3.5 sm:px-5 py-1 sm:py-2 w-auto h-[46px] sm:h-[60px] md:h-[70px] lg:h-[80px] transition-all duration-300 ease-out shadow-none shrink-0 overflow-hidden ${currentItem.pillStyle}`}
                >
                  {/* Colored circular dot indicator */}
                  <span
                    className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 rounded-full shrink-0 mr-2 sm:mr-3 transition-colors duration-300"
                    style={{ backgroundColor: currentItem.dotColor }}
                  />

                  {/* Vertical slot-machine dropdown word */}
                  <span className="relative overflow-hidden inline-flex items-center justify-start">
                    <span
                      key={wordIndex}
                      className={`animotion-word-dropdown font-sans text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight ${currentItem.textColor}`}
                    >
                      {currentItem.word}
                    </span>
                  </span>
                </span>

                {/* Typewriter text with blinking cursor */}
                <span className="font-medium text-zinc-100 text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight inline whitespace-nowrap drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                  {displayedText}
                  <span className="animotion-cursor" />
                </span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-zinc-200 max-w-2xl leading-relaxed font-normal text-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Use institutional-grade algorithms to predict freight rates and reliably plan your shipments—customized specifically around your routes and trade requirements.
            </p>

            {/* 
              "See what panamax can do" CTA Button:
              Excluded from initial box; slides up with animotion entrance during Phase 2
            */}
            <div
              ref={ctaButtonRef}
              style={{
                opacity: 0,
                transform: 'translate3d(0, 28px, 0)',
                pointerEvents: 'none',
              }}
              className="mt-8 flex items-center justify-start will-change-transform"
            >
              <button
                onClick={onOpenDashboard}
                className="group inline-flex items-center justify-center bg-white hover:bg-zinc-200 text-black font-semibold rounded-full px-7 h-12 text-sm shadow-[0_4px_24px_rgba(0,0,0,0.5)] transition-all active:scale-95 cursor-pointer"
              >
                <span>See what panamax can do</span>
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* 
        Section below Hero: 4 Core Capability Cards
        Slides up smoothly during Phase 2, staying on screen longer across the scroll duration
      */}
      <div
        ref={capCardsRef}
        style={{
          opacity: 0,
          transform: 'translate3d(0, 40px, 0)',
          pointerEvents: 'none',
        }}
        className="relative px-4 sm:px-6 lg:px-8 pt-12 pb-16 will-change-transform"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <div className="text-left">
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
                Core Software Capabilities
              </span>
              <h2 className="text-lg font-semibold text-white mt-0.5">
                How commercial desks execute with Panamax
              </h2>
            </div>
            <Badge variant="outline" className="hidden sm:inline-flex text-xs border-white/10 text-zinc-400 font-mono">
              Hover to test interactive modules
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {/* Card 1 */}
            <div
              onMouseMove={(e) => handleCardMouseMove(e, 1)}
              onMouseLeave={handleCardMouseLeave}
              style={{
                transform:
                  tiltCard === 1
                    ? `perspective(800px) rotateX(${tiltCoords.y * -10}deg) rotateY(${tiltCoords.x * 10}deg) translateY(-2px)`
                    : 'none',
                transition: tiltCard === 1 ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
              }}
              className="group relative rounded-xl border border-white/10 bg-zinc-950/90 p-5 backdrop-blur-md hover:border-cyan-500/40 transition-colors shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <Cpu className="h-4 w-4" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-cyan-500/30 text-cyan-400 font-mono">
                    NEURAL ENGINE
                  </Badge>
                </div>
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  Multi-Horizon Forward Curve
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Ingests Baltic freight indices, Brent crack spreads, and tanker supply to forecast forward rates up to 90 days ahead.
                </p>
                <div className="mt-4 p-3 rounded-lg bg-zinc-900/60 border border-white/5">
                  <div className="flex items-center justify-between text-[11px] mb-2 font-mono">
                    <span className="text-zinc-400">Horizon:</span>
                    <div className="flex gap-1">
                      {(['30D', '60D', '90D'] as const).map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setSelectedHorizon(h)}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-all ${
                            selectedHorizon === h
                              ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                              : 'text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline text-xs font-mono">
                    <span className="text-zinc-500 text-[10px]">Projected:</span>
                    <span className="text-white font-bold">
                      {selectedHorizon === '30D' ? '$90.00 / MT' : selectedHorizon === '60D' ? '$93.50 / MT' : '$98.00 / MT'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Model Confidence</span>
                <span className="text-emerald-400 font-mono font-medium">96.4%</span>
              </div>
            </div>

            {/* Card 2 */}
            <div
              onMouseMove={(e) => handleCardMouseMove(e, 2)}
              onMouseLeave={handleCardMouseLeave}
              style={{
                transform:
                  tiltCard === 2
                    ? `perspective(800px) rotateX(${tiltCoords.y * -10}deg) rotateY(${tiltCoords.x * 10}deg) translateY(-2px)`
                    : 'none',
                transition: tiltCard === 2 ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
              }}
              className="group relative rounded-xl border border-white/10 bg-zinc-950/90 p-5 backdrop-blur-md hover:border-emerald-500/40 transition-colors shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 font-mono">
                    RISK SHIELD
                  </Badge>
                </div>
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  Demurrage & Laytime Shield
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Stops chartering desks bleeding $30,000/day in port delay penalties by forecasting berth congestion at discharge terminals.
                </p>
                <div className="mt-4 p-3 rounded-lg bg-zinc-900/60 border border-white/5 space-y-2">
                  <div className="flex justify-between text-[11px] text-zinc-400">
                    <span>Vadinar Port Queue:</span>
                    <span className="text-emerald-400 font-mono font-semibold">1.6 Days (Favorable)</span>
                  </div>
                  <Progress value={28} indicatorClassName="bg-emerald-400" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Avoided Penalties</span>
                <span className="text-emerald-400 font-mono font-medium">+$64,000 / fixture</span>
              </div>
            </div>

            {/* Card 3 */}
            <div
              onMouseMove={(e) => handleCardMouseMove(e, 3)}
              onMouseLeave={handleCardMouseLeave}
              style={{
                transform:
                  tiltCard === 3
                    ? `perspective(800px) rotateX(${tiltCoords.y * -10}deg) rotateY(${tiltCoords.x * 10}deg) translateY(-2px)`
                    : 'none',
                transition: tiltCard === 3 ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
              }}
              className="group relative rounded-xl border border-white/10 bg-zinc-950/90 p-5 backdrop-blur-md hover:border-purple-500/40 transition-colors shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                    <Compass className="h-4 w-4" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-purple-500/30 text-purple-400 font-mono">
                    FLEET DISCOVERY
                  </Badge>
                </div>
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  Corridor Tanker Matching
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Instantly pairs bulk commodity parcels (75k Panamax, 110k Aframax) with compliant open tonnage on key import routes.
                </p>
                <div className="mt-4 p-3 rounded-lg bg-zinc-900/60 border border-white/5 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Route:</span>
                    <span className="text-zinc-200">Primorsk → Vadinar</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Parcel:</span>
                    <span className="text-zinc-200">75,000 MT Panamax</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Fixture Lead Time</span>
                <span className="text-white font-mono font-medium">&lt; 48 Hours</span>
              </div>
            </div>

            {/* Card 4 */}
            <div
              onMouseMove={(e) => handleCardMouseMove(e, 4)}
              onMouseLeave={handleCardMouseLeave}
              style={{
                transform:
                  tiltCard === 4
                    ? `perspective(800px) rotateX(${tiltCoords.y * -10}deg) rotateY(${tiltCoords.x * 10}deg) translateY(-2px)`
                    : 'none',
                transition: tiltCard === 4 ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
              }}
              className="group relative rounded-xl border border-white/10 bg-zinc-950/90 p-5 backdrop-blur-md hover:border-amber-500/40 transition-colors shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <SlidersHorizontal className="h-4 w-4" />
                  </div>
                  <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400 font-mono">
                    WHAT-IF SANDBOX
                  </Badge>
                </div>
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  Scenario Stress Tester
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Simulate canal blockages, bunker price surges, and Cape of Good Hope detours in seconds before committing capital.
                </p>
                <div className="mt-4 p-3 rounded-lg bg-zinc-900/60 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-zinc-300 font-medium">Cape Reroute (+12d)</span>
                    <Switch
                      checked={scenarioReroute}
                      onCheckedChange={setScenarioReroute}
                      className="data-[state=checked]:bg-amber-500"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Simulation Time</span>
                <span className="text-amber-400 font-mono font-medium">&lt; 120ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScrollExpandHero;
