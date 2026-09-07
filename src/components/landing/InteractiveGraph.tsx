import React, { useState, useRef, useEffect } from 'react';

interface MonthData {
  month: string;
  rate: number;
}

const MONTHS_DATA: MonthData[] = [
  { month: 'Jan', rate: 95 },
  { month: 'Feb', rate: 92 },
  { month: 'Mar', rate: 89 },
  { month: 'Apr', rate: 86 },
  { month: 'May', rate: 84 },
  { month: 'Jun', rate: 83 },
  { month: 'Jul', rate: 86 },
  { month: 'Aug', rate: 88 },
  { month: 'Sep', rate: 90 }, // Current
  { month: 'Oct', rate: 93 },
  { month: 'Nov', rate: 97 },
  { month: 'Dec', rate: 101 },
];

export function InteractiveGraph() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);
  const [activeData, setActiveData] = useState<{ month: string; rate: number; x: number; y: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameId = useRef<number>(0);
  const currentStretchRef = useRef<number[]>(new Array(100).fill(0));

  // Handle cursor movement for 3D card tilt & vertical-only line stretch
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setMousePos({ x: 0.5, y: 0.5 });
    setActiveData(null);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 380);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 380;
    };

    window.addEventListener('resize', handleResize);

    const paddingLeft = 70;
    const paddingRight = 35;
    const paddingTop = 35;
    const paddingBottom = 45;

    const plotWidth = width - paddingLeft - paddingRight;
    const plotHeight = height - paddingTop - paddingBottom;

    // Rate scale bounds
    const minRate = 75;
    const maxRate = 110;

    // Number of interpolated points for smooth curve
    const SAMPLES = 80;
    if (currentStretchRef.current.length !== SAMPLES) {
      currentStretchRef.current = new Array(SAMPLES).fill(0);
    }

    // Helper: Map month index (0 to 11) to rate using Catmull-Rom or cubic spline
    const getRateAtProgress = (t: number): number => {
      const idx = t * (MONTHS_DATA.length - 1);
      const i0 = Math.floor(idx);
      const i1 = Math.min(MONTHS_DATA.length - 1, i0 + 1);
      const frac = idx - i0;
      // Smooth Hermite / cosine interpolation
      const smoothFrac = (1 - Math.cos(frac * Math.PI)) / 2;
      return MONTHS_DATA[i0].rate * (1 - smoothFrac) + MONTHS_DATA[i1].rate * smoothFrac;
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Grid Lines & Y-Axis Labels (Rate in $/MT)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;
      ctx.fillStyle = '#71717a';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      const yTicks = [80, 85, 90, 95, 100, 105];
      yTicks.forEach((tick) => {
        const yNorm = (tick - minRate) / (maxRate - minRate);
        const y = paddingTop + plotHeight * (1 - yNorm);

        // Horizontal grid line
        ctx.beginPath();
        ctx.moveTo(paddingLeft, y);
        ctx.lineTo(width - paddingRight, y);
        ctx.stroke();

        // Y-axis label
        ctx.fillText(`$${tick}`, paddingLeft - 12, y);
      });

      // Y-Axis Title
      ctx.save();
      ctx.translate(16, paddingTop + plotHeight / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#a1a1aa';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText('Freight Rate ($/MT)', 0, 0);
      ctx.restore();

      // 2. Draw X-Axis Ticks & Labels (Months)
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#71717a';

      const monthPositions: { month: string; rate: number; x: number; y: number }[] = [];

      MONTHS_DATA.forEach((item, index) => {
        const x = paddingLeft + (index / (MONTHS_DATA.length - 1)) * plotWidth;
        const yNorm = (item.rate - minRate) / (maxRate - minRate);
        const y = paddingTop + plotHeight * (1 - yNorm);

        monthPositions.push({ month: item.month, rate: item.rate, x, y });

        // Month tick line
        ctx.beginPath();
        ctx.moveTo(x, height - paddingBottom);
        ctx.lineTo(x, height - paddingBottom + 5);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.stroke();

        // Month text
        ctx.fillStyle = item.month === 'Sep' ? '#ffffff' : '#71717a';
        ctx.fillText(item.month, x, height - paddingBottom + 8);
      });

      // X-Axis Title
      ctx.fillStyle = '#a1a1aa';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText('Time (Months)', paddingLeft + plotWidth / 2, height - 12);

      // 3. Compute Line Points with Soft Vertical-Only Stretch towards Cursor
      const canvasCursorX = mousePos.x * width;
      const canvasCursorY = mousePos.y * height;

      const points: { x: number; y: number; baseY: number }[] = [];
      const sigma = 110; // width of Gaussian influence

      for (let i = 0; i < SAMPLES; i++) {
        const progress = i / (SAMPLES - 1);
        const px = paddingLeft + progress * plotWidth;
        const rate = getRateAtProgress(progress);
        const yNorm = (rate - minRate) / (maxRate - minRate);
        const baseY = paddingTop + plotHeight * (1 - yNorm);

        // Compute soft vertical-only pull
        let targetStretch = 0;
        if (isHovering) {
          const dx = Math.abs(px - canvasCursorX);
          // Gaussian bell curve falloff
          const influence = Math.exp(-(dx * dx) / (2 * sigma * sigma));
          // Pull vertically towards cursor softly (30% strength)
          targetStretch = (canvasCursorY - baseY) * influence * 0.32;
        }

        // Smooth damping/lerp
        currentStretchRef.current[i] += (targetStretch - currentStretchRef.current[i]) * 0.12;
        const py = baseY + currentStretchRef.current[i];

        points.push({ x: px, y: py, baseY });
      }

      // Determine active month point nearest to cursor
      if (isHovering && canvasCursorX >= paddingLeft && canvasCursorX <= width - paddingRight) {
        let closest = monthPositions[0];
        let minD = 9999;
        monthPositions.forEach((m) => {
          const d = Math.abs(m.x - canvasCursorX);
          if (d < minD) {
            minD = d;
            closest = m;
          }
        });
        setActiveData(closest);

        // Draw vertical crosshair guide line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(closest.x, paddingTop);
        ctx.lineTo(closest.x, height - paddingBottom);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 4. Draw Gradient Area Below the Curve
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const cx = (prev.x + curr.x) / 2;
        const cy = (prev.y + curr.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, cx, cy);
      }
      ctx.lineTo(points[points.length - 1].x, height - paddingBottom);
      ctx.lineTo(points[0].x, height - paddingBottom);
      ctx.closePath();

      const areaGrad = ctx.createLinearGradient(0, paddingTop, 0, height - paddingBottom);
      areaGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
      areaGrad.addColorStop(0.6, 'rgba(255, 255, 255, 0.02)');
      areaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = areaGrad;
      ctx.fill();

      // 5. Draw the Crisp Fixed Rate Curve
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const cx = (prev.x + curr.x) / 2;
        const cy = (prev.y + curr.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, cx, cy);
      }
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.45)';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0; // reset

      // 6. Draw Fixed Month Data Points
      monthPositions.forEach((item) => {
        // Find corresponding point with stretch
        const progress = (item.x - paddingLeft) / plotWidth;
        const sampleIdx = Math.min(SAMPLES - 1, Math.max(0, Math.round(progress * (SAMPLES - 1))));
        const currentY = points[sampleIdx] ? points[sampleIdx].y : item.y;

        ctx.beginPath();
        ctx.arc(item.x, currentY, item.month === 'Sep' ? 4.5 : 2.5, 0, Math.PI * 2);
        ctx.fillStyle = item.month === 'Sep' ? '#ffffff' : '#a1a1aa';
        ctx.fill();

        if (item.month === 'Sep') {
          // Current month halo
          ctx.beginPath();
          ctx.arc(item.x, currentY, 8, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      });

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [mousePos, isHovering]);

  // Keep the 3D card tilt animation exactly as it is
  const tiltX = (mousePos.y - 0.5) * -7;
  const tiltY = (mousePos.x - 0.5) * 10;

  return (
    <section id="interactive-forecast" className="relative px-4 sm:px-6 lg:px-8 py-16">
      <div className="mx-auto max-w-6xl">
        
        {/* Clean Left-Aligned Section Header */}
        <div className="text-left mb-8">
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Freight Rate Market Forecast
          </h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-xl">
            12-month freight rate trend and forward curve. Hover your cursor over the chart to inspect monthly rate elasticity.
          </p>
        </div>

        {/* 3D Interactive Card in Enclosed Minimalist Border */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
            transition: isHovering ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
          }}
          className="group relative rounded-2xl border border-white/15 bg-zinc-950/85 p-6 backdrop-blur-xl shadow-2xl overflow-hidden cursor-crosshair text-left"
        >
          {/* Subtle cursor-following spotlight glow */}
          <div
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `radial-gradient(600px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255, 255, 255, 0.08), transparent 70%)`,
            }}
          />

          {/* Top Bar: Exactly as requested: Route: Russia to India; Panamax vessel(75k ton) - nothing else */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div className="text-xs font-semibold text-zinc-200 tracking-wide">
              Route: Russia to India; Panamax vessel (75k ton)
            </div>
          </div>

          {/* Canvas Viewport */}
          <div className="relative w-full h-[380px] overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Hover Inspection Tooltip Floating Near Cursor */}
            {activeData && isHovering && (
              <div
                className="pointer-events-none absolute z-20 rounded-lg border border-white/20 bg-black/90 px-3 py-2 text-left text-xs shadow-2xl backdrop-blur-md font-mono"
                style={{
                  left: Math.min(Math.max(activeData.x - 60, 20), (canvasRef.current?.width || 800) - 180),
                  top: 20,
                }}
              >
                <div className="text-[10px] text-zinc-400 font-sans">{activeData.month} 2026 • Crude Oil</div>
                <div className="text-sm font-bold text-white mt-0.5 font-mono">
                  ${activeData.rate}.00 <span className="text-[10px] font-normal text-zinc-400">/ MT (Metric ton)</span>
                </div>
                {activeData.month === 'Sep' && (
                  <div className="text-[10px] text-emerald-400 font-sans mt-0.5">
                    ● Current Spot Benchmark
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
