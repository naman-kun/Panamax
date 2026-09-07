import React, { useState } from 'react';

export function LinearFigures() {
  const [hoveredFig, setHoveredFig] = useState<number | null>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x, y });
  };

  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-16 bg-black border-t border-b border-white/10">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
          
          {/* FIG 0.1: Purpose-built (Layered Slabs with Embossed Coin) */}
          <div
            className="p-8 sm:p-10 flex flex-col justify-between group cursor-pointer text-left transition-colors hover:bg-white/[0.015]"
            onMouseEnter={() => setHoveredFig(1)}
            onMouseLeave={() => setHoveredFig(null)}
            onMouseMove={handleMouseMove}
          >
            <div>
              <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest mb-10">
                FIG 0.1
              </div>

              {/* Wireframe Isometric Multi-Layer Stack */}
              <div className="h-56 flex items-center justify-center relative select-none">
                <svg
                  className="w-52 h-52 overflow-visible transition-transform duration-500 ease-out"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    transform:
                      hoveredFig === 1
                        ? `perspective(600px) rotateX(${mouseOffset.y * -15}deg) rotateY(${mouseOffset.x * 15}deg)`
                        : 'none',
                  }}
                >
                  {/* Layer 5 (Bottom Base) */}
                  <g
                    className="text-zinc-700 group-hover:text-zinc-500 transition-all duration-300"
                    style={{
                      transform: hoveredFig === 1 ? 'translateY(14px)' : 'translateY(0)',
                      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <path d="M 100 130 L 160 95 L 100 60 L 40 95 Z" stroke="currentColor" strokeWidth="1" />
                    <path d="M 40 95 L 40 108 L 100 143 L 160 108 L 160 95" stroke="currentColor" strokeWidth="1" />
                  </g>

                  {/* Layer 4 */}
                  <g
                    className="text-zinc-600 group-hover:text-zinc-400 transition-all duration-300"
                    style={{
                      transform: hoveredFig === 1 ? 'translateY(7px)' : 'translateY(0)',
                      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <path d="M 100 120 L 160 85 L 100 50 L 40 85 Z" stroke="currentColor" strokeWidth="1" />
                    <path d="M 40 85 L 40 98 L 100 133 L 160 98 L 160 85" stroke="currentColor" strokeWidth="1" />
                  </g>

                  {/* Layer 3 */}
                  <g
                    className="text-zinc-500 group-hover:text-zinc-300 transition-all duration-300"
                    style={{
                      transform: hoveredFig === 1 ? 'translateY(0px)' : 'translateY(0)',
                      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <path d="M 100 110 L 160 75 L 100 40 L 40 75 Z" stroke="currentColor" strokeWidth="1" />
                    <path d="M 40 75 L 40 88 L 100 123 L 160 88 L 160 75" stroke="currentColor" strokeWidth="1" />
                  </g>

                  {/* Layer 2 */}
                  <g
                    className="text-zinc-400 group-hover:text-zinc-200 transition-all duration-300"
                    style={{
                      transform: hoveredFig === 1 ? 'translateY(-8px)' : 'translateY(0)',
                      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <path d="M 100 100 L 160 65 L 100 30 L 40 65 Z" stroke="currentColor" strokeWidth="1" />
                    <path d="M 40 65 L 40 78 L 100 113 L 160 78 L 160 65" stroke="currentColor" strokeWidth="1" />
                  </g>

                  {/* Layer 1 (Top Slab with Circular Coin Emblem) */}
                  <g
                    className="text-zinc-300 group-hover:text-white transition-all duration-300"
                    style={{
                      transform: hoveredFig === 1 ? 'translateY(-18px)' : 'translateY(0)',
                      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    {/* Top slab surface */}
                    <path d="M 100 90 L 160 55 L 100 20 L 40 55 Z" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M 40 55 L 40 67 L 100 102 L 160 67 L 160 55" stroke="currentColor" strokeWidth="1.2" />

                    {/* Embossed isometric circle (ellipse in isometric plane) */}
                    <ellipse
                      cx="100"
                      cy="55"
                      rx="30"
                      ry="17"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeDasharray="1 1"
                    />
                    <ellipse cx="100" cy="55" rx="25" ry="14" stroke="currentColor" strokeWidth="1" />
                    {/* Internal horizon lines inside the circle */}
                    <line x1="82" y1="55" x2="118" y2="55" stroke="currentColor" strokeWidth="1" />
                    <line x1="86" y1="58" x2="114" y2="58" stroke="currentColor" strokeWidth="1" />
                    <line x1="91" y1="61" x2="109" y2="61" stroke="currentColor" strokeWidth="1" />
                  </g>
                </svg>
              </div>
            </div>

            <div className="pt-8">
              <h3 className="text-base font-semibold text-white tracking-tight">
                Purpose-built
              </h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Panamax is shaped by the practices and principles of world-class bulk commodity chartering teams.
              </p>
            </div>
          </div>

          {/* FIG 0.2: Powered by neural forecasting (Floating Isometric Cubes) */}
          <div
            className="p-8 sm:p-10 flex flex-col justify-between group cursor-pointer text-left transition-colors hover:bg-white/[0.015]"
            onMouseEnter={() => setHoveredFig(2)}
            onMouseLeave={() => setHoveredFig(null)}
            onMouseMove={handleMouseMove}
          >
            <div>
              <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest mb-10">
                FIG 0.2
              </div>

              {/* Wireframe Isometric 4-Cube Cluster */}
              <div className="h-56 flex items-center justify-center relative select-none">
                <svg
                  className="w-52 h-52 overflow-visible transition-transform duration-500 ease-out"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    transform:
                      hoveredFig === 2
                        ? `perspective(600px) rotateX(${mouseOffset.y * -15}deg) rotateY(${mouseOffset.x * 15}deg)`
                        : 'none',
                  }}
                >
                  {/* Subtle orbital ring arcs behind cubes */}
                  <ellipse
                    cx="100"
                    cy="105"
                    rx="68"
                    ry="35"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />

                  {/* Cube 1: Top Back */}
                  <g
                    className="text-zinc-500 group-hover:text-zinc-300 transition-all duration-300"
                    style={{
                      transform: hoveredFig === 2 ? 'translateY(-10px)' : 'translateY(0)',
                      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <path d="M 100 50 L 125 35 L 100 20 L 75 35 Z" stroke="currentColor" strokeWidth="1" />
                    <path d="M 75 35 L 75 60 L 100 75 L 125 60 L 125 35" stroke="currentColor" strokeWidth="1" />
                    <path d="M 100 50 L 100 75" stroke="currentColor" strokeWidth="1" />
                    {/* Top texture lines */}
                    <line x1="95" y1="36" x2="105" y2="34" stroke="currentColor" strokeWidth="0.8" />
                  </g>

                  {/* Cube 2: Left */}
                  <g
                    className="text-zinc-400 group-hover:text-zinc-200 transition-all duration-300"
                    style={{
                      transform: hoveredFig === 2 ? 'translate(-8px, -4px)' : 'translate(0, 0)',
                      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <path d="M 60 90 L 85 75 L 60 60 L 35 75 Z" stroke="currentColor" strokeWidth="1.1" />
                    <path d="M 35 75 L 35 108 L 60 123 L 85 108 L 85 75" stroke="currentColor" strokeWidth="1.1" />
                    <path d="M 60 90 L 60 123" stroke="currentColor" strokeWidth="1.1" />
                    <line x1="56" y1="76" x2="64" y2="74" stroke="currentColor" strokeWidth="0.8" />
                  </g>

                  {/* Cube 3: Right */}
                  <g
                    className="text-zinc-400 group-hover:text-zinc-200 transition-all duration-300"
                    style={{
                      transform: hoveredFig === 2 ? 'translate(8px, -4px)' : 'translate(0, 0)',
                      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <path d="M 140 90 L 165 75 L 140 60 L 115 75 Z" stroke="currentColor" strokeWidth="1.1" />
                    <path d="M 115 75 L 115 110 L 140 125 L 165 110 L 165 75" stroke="currentColor" strokeWidth="1.1" />
                    <path d="M 140 90 L 140 125" stroke="currentColor" strokeWidth="1.1" />
                  </g>

                  {/* Cube 4: Bottom Front */}
                  <g
                    className="text-zinc-300 group-hover:text-white transition-all duration-300"
                    style={{
                      transform: hoveredFig === 2 ? 'translateY(12px)' : 'translateY(0)',
                      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <path d="M 100 135 L 125 120 L 100 105 L 75 120 Z" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M 75 120 L 75 150 L 100 165 L 125 150 L 125 120" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M 100 135 L 100 165" stroke="currentColor" strokeWidth="1.2" />
                    {/* Top texture grid */}
                    <line x1="95" y1="121" x2="105" y2="119" stroke="currentColor" strokeWidth="0.8" />
                  </g>
                </svg>
              </div>
            </div>

            <div className="pt-8">
              <h3 className="text-base font-semibold text-white tracking-tight">
                Powered by neural forecasting
              </h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Designed for workflows shared by human charterers and predictive AI models. From spot fixtures to forward coverage.
              </p>
            </div>
          </div>

          {/* FIG 0.3: Designed for precision (Stepped Perspective Fan Rack) */}
          <div
            className="p-8 sm:p-10 flex flex-col justify-between group cursor-pointer text-left transition-colors hover:bg-white/[0.015]"
            onMouseEnter={() => setHoveredFig(3)}
            onMouseLeave={() => setHoveredFig(null)}
            onMouseMove={handleMouseMove}
          >
            <div>
              <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest mb-10">
                FIG 0.3
              </div>

              {/* Wireframe Stepped Perspective Vertical Panels */}
              <div className="h-56 flex items-center justify-center relative select-none">
                <svg
                  className="w-52 h-52 overflow-visible transition-transform duration-500 ease-out"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    transform:
                      hoveredFig === 3
                        ? `perspective(600px) rotateX(${mouseOffset.y * -15}deg) rotateY(${mouseOffset.x * 15}deg)`
                        : 'none',
                  }}
                >
                  {/* Stepped Panels Rack (10 vertical plates in perspective) */}
                  {[
                    { h: 30, x: 45, y: 135, op: 0.3 },
                    { h: 42, x: 55, y: 128, op: 0.4 },
                    { h: 54, x: 65, y: 121, op: 0.5 },
                    { h: 68, x: 75, y: 114, op: 0.6 },
                    { h: 82, x: 85, y: 107, op: 0.7 },
                    { h: 96, x: 95, y: 100, op: 0.8 },
                    { h: 110, x: 105, y: 93, op: 0.85 },
                    { h: 124, x: 115, y: 86, op: 0.9 },
                    { h: 138, x: 125, y: 79, op: 0.95 },
                    { h: 152, x: 135, y: 72, op: 1.0 },
                  ].map((p, i) => {
                    const lift = hoveredFig === 3 ? (i - 4.5) * 2.5 : 0;
                    return (
                      <g
                        key={i}
                        className="text-zinc-400 group-hover:text-zinc-200 transition-all duration-300"
                        style={{
                          transform: `translateY(${-lift}px)`,
                          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                          opacity: p.op,
                        }}
                      >
                        {/* Plate top */}
                        <path
                          d={`M ${p.x} ${p.y - p.h} L ${p.x + 8} ${p.y - p.h - 5} L ${p.x + 40} ${p.y - p.h - 5} L ${p.x + 32} ${p.y - p.h} Z`}
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                        {/* Plate face */}
                        <path
                          d={`M ${p.x} ${p.y - p.h} L ${p.x + 32} ${p.y - p.h} L ${p.x + 32} ${p.y} L ${p.x} ${p.y} Z`}
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                        {/* Plate side */}
                        <path
                          d={`M ${p.x + 32} ${p.y - p.h} L ${p.x + 40} ${p.y - p.h - 5} L ${p.x + 40} ${p.y - 5} L ${p.x + 32} ${p.y} Z`}
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            <div className="pt-8">
              <h3 className="text-base font-semibold text-white tracking-tight">
                Designed for precision
              </h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Eliminates demurrage risk and volatility exposure to help procurement teams charter with statistical confidence.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
