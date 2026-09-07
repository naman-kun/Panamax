# Panamax — Maritime Freight Intelligence & Chartering Optimizer

> **Predict the freight. Time the charter. Optimize the cost.**  
> AI-driven maritime freight rate forecasting and vessel chartering optimizer for bulk commodity procurement desks.

---

## Overview

Indian conglomerates (power, steel) and global commodity trading houses import millions of tonnes of dry bulk commodities (thermal coal, coking coal, iron ore, crude oil). They face massive unhedged exposure to ocean freight rate volatility:

> **The $1.50/MT Problem**: Making a chartering fixture decision on a 75,000 MT Panamax shipment at the wrong time by just **$1.50/MT** costs **$112,500 USD** in avoidable capital loss per single voyage.

**Panamax** unifies two core decision engines:
1. **Predictive Engine:** Multi-factor rate forecasting 15, 30, 60, and 90 days forward with 95% Confidence Interval corridors.
2. **Prescriptive Engine:** Evaluates forward curves against port congestion, bunkering spreads, and holding costs to output a clear binary decision: **"CHARTER TODAY"** vs. **"DELAY FIXTURE"**.

Built from the ground up strictly adhering to the **shadcn/ui** design system with a dark `zinc-950` industrial aesthetic, monospace financial telemetry, and client-side simulation models.

---

## Core Capabilities ("See What Panamax Can Do")

### 1. Multi-Factor Freight Rate Predictor
- **Multi-Axis Recharts ComposedChart:**
  - **Solid White Line:** Historical realized freight rates.
  - **Dashed Cyan Line:** 90-day forward predictive trajectory.
  - **Purple Shaded Area:** 95% Confidence Interval fan corridor.
  - **Amber Line (Secondary Y-Axis):** Singapore VLSFO bunker fuel price benchmark.
- **Interactive Bunker Market Shock Slider (-30% to +30%):** Dragging the slider dynamically deforms both the fuel price and the projected freight curve in real-time.
- **Configurable Controls:** Popovers for Historical Lookback Window (`3M`, `1Y`, `3Y`), Vessel Deadweight Class (`Panamax 75k MT`, `Supramax`, `Capesize`), and Benchmark Corridors.

### 2. Voyage Tracker & Demurrage Radar
- **Tactical SVG Nautical Map:** Visualizes key trading corridors (e.g. Indonesia / Taboneo Anchorage to East Coast India / Paradip Port) with a pulsing sonar vessel ping, heading, coordinates, and nautical mile telemetry.
- **Shipment Switcher:** Toggle active fixtures (`MV Eastern Glory`, `MV Pacific Pioneer`, `MV Nordic Sagar`).
- **Live Port Queue Slider (0–120 Hours):**
  - **Queue < 72 Hours (Allowed Laytime):** UI turns Emerald Green, calculating **"Despatch Bonus Earned"** ($12,500/day credit).
  - **Queue > 72 Hours (Laytime Exceeded):** UI turns Rose Red, calculating **"Demurrage Penalty Incurred"** ($25,000/day penalty).
- **Laytime Gauge:** Real-time percentage consumption bar with operational advisory.

### 3. Strategic Chartering Optimizer
- **Cargo Volume Slider (50,000 to 300,000 MT):** Automatically computes the required Panamax fleet parcel count and optimal fixture split.
- **Calculated Verdict Banner:** Prominent decision directive (e.g., `"VERDICT: FIX 1 VESSEL NOW ($11.45/MT), DELAY 2ND FIXTURE BY 14 DAYS"`).
- **Landed Cost Waterfall BarChart:** Side-by-side comparison of **Current Spot Cost** vs. **Optimized AI Cost** across FOB Cargo, Ocean Freight, Bunker Fuel, and Port Laytime Buffer.
- **Financial Monospace Callout:** Displays net savings (e.g., `+$360,000 USD` / `-$2.40/MT`).

### 4. Supply Chain Stress Simulator
- **One-Click Macro Disruption Presets:**
  - `[Baseline]`: Standard operating conditions.
  - `[Malacca Bottleneck]`: Chokepoint congestion and speed restrictions (+24% freight inflation, +6.5 days slippage).
  - `[Bunker Shock]`: Crude oil spike (+25% fuel cost, +31% freight inflation).
  - `[Cyclone Alert]`: Bay of Bengal monsoon depression (+42% freight inflation, +11.0 days port closure).
- **Four Financial Impact Metric Cards:** Freight Inflation, Delivery Slippage, Demurrage Exposure, and Model Confidence.

### 5. Linear-Inspired 3D Isometric Art
- **FIG 0.1 Purpose-built:** Multi-layered stacked isometric slabs with embossed circular emblem and vertical expansion on cursor hover.
- **FIG 0.2 Powered by neural forecasting:** 4 floating isometric cubes in an orbital cluster with 3D tilt and layer separation.
- **FIG 0.3 Designed for precision:** Stepped perspective fan rack of 10 vertical panels with perspective wave lift.

---

## Technical Stack & Design System

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/) | High-performance SPA with fast HMR |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict type safety across mathematical models and props |
| **Design Tokens** | [shadcn/ui](https://ui.shadcn.com/) | Neutral `zinc-950` palette, subtle white borders (`border-white/10`) |
| **Primitives** | [Radix UI](https://www.radix-ui.com/) | Accessible Dialogs, Popovers, Sliders, Tabs, Hover Cards, Tooltips |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) | Atomic utility classes and responsive breakpoints |
| **Data Viz** | [Recharts 3](https://recharts.org/) | Multi-axis ComposedCharts, Areas, and Waterfall BarCharts |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, minimalist vector iconography |

---

## Repository Structure

```
.
├── PRD document/
│   └── Freight forecasting software.md   # Maritime PRD and domain specifications
├── public/                                # Static public assets
├── reference images/                      # Linear and Notion UI/UX inspiration references
├── src/
│   ├── components/
│   │   ├── landing/
│   │   │   ├── modules/
│   │   │   │   ├── CharterOptimizerModule.tsx # Landed cost waterfall & verdict banner
│   │   │   │   ├── FreightPredictorModule.tsx # Multi-axis ComposedChart & bunker slider
│   │   │   │   ├── StressSimulatorModule.tsx  # Macro stress presets & impact cards
│   │   │   │   └── VoyageTrackerModule.tsx    # SVG route map & demurrage radar
│   │   │   ├── BentoGrid.tsx                  # 3D tilt feature bento grid
│   │   │   ├── DemoModal.tsx                  # Interactive simulation dialog
│   │   │   ├── Footer.tsx                     # Minimalist dark footer
│   │   │   ├── Hero.tsx                       # Left-aligned hero headline & market cards
│   │   │   ├── InteractiveGraph.tsx           # 3D cursor-elastic stock chart
│   │   │   ├── LinearFigures.tsx              # Isometric wireframe art (FIG 0.1–0.3)
│   │   │   ├── Navbar.tsx                     # Topbar with Radix hover cards & popovers
│   │   │   └── SeeWhatPanamaxCanDo.tsx        # Notion-style card strip master section
│   │   └── ui/                                # Official shadcn/ui components
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── dialog.tsx
│   │       ├── hover-card.tsx
│   │       ├── popover.tsx
│   │       ├── separator.tsx
│   │       ├── slider.tsx
│   │       ├── switch.tsx
│   │       ├── tabs.tsx
│   │       └── tooltip.tsx
│   ├── lib/
│   │   ├── simulationEngine.ts                # Real-time mathematical simulation engine
│   │   └── utils.ts                           # Tailwind class merging utility (cn)
│   ├── App.tsx                                # Main application layout
│   ├── index.css                              # Tailwind tokens and dark theme styles
│   └── main.tsx                               # Application entrypoint
├── index.html                                 # HTML template with JetBrains Mono / Inter fonts
├── package.json                               # Dependencies and scripts
├── postcss.config.js                          # PostCSS configuration
├── tailwind.config.js                         # Tailwind dark theme configuration
├── tsconfig.json                              # TypeScript configuration
└── vite.config.ts                             # Vite configuration with path aliases (@/*)
```

---

## Mathematical Simulation Engine (`src/lib/simulationEngine.ts`)

### 1. Bunker Fuel Sensitivity
Because bunker fuel accounts for approximately **40% to 45%** of a Panamax vessel's daily operating voyage cost, any shock $\Delta F_{bunker}$ deforms the forward freight forecast $R_{predicted}$:

$$\Delta R_{freight} = \left(\frac{P_{bunker} - P_{base}}{P_{base}}\right) \times 4.20$$

### 2. Laytime & Demurrage Accounting
For standard 75,000 MT Panamax charter parties with 72 hours contractual laytime:
- **Daily Demurrage Rate ($D$):** $\$25,000 \text{ USD/day}$ ($\approx \$1,041.67/\text{hour}$)
- **Daily Despatch Rate ($d$):** $\$12,500 \text{ USD/day}$ ($\approx \$520.83/\text{hour}$, 50% of demurrage)

$$\text{Financial Outcome} = 
\begin{cases} 
(72 - T_{queue}) \times \frac{12,500}{24} & \text{if } T_{queue} \le 72 \text{ hrs (Despatch Bonus)} \\
-(T_{queue} - 72) \times \frac{25,000}{24} & \text{if } T_{queue} > 72 \text{ hrs (Demurrage Penalty)}
\end{cases}$$

### 3. CIF Landed Cost Waterfall
$$\text{Total CIF Cost} = \text{Volume} \times \left( \text{FOB}_{\text{Cargo}} + \text{Freight}_{\text{Ocean}} + \text{Fuel}_{\text{VLSFO}} + \text{Fees}_{\text{Port/Laytime}} \right)$$

---

## Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** (or **pnpm** / **yarn**)

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/panamax.git

# Navigate into the project directory
cd panamax

# Install dependencies
npm install
```

### Development
Start the local Vite development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open your browser at: **`http://localhost:5173/`**

### Production Build
Compile TypeScript and bundle the production assets:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

---

## Domain Glossary

- **Panamax:** Bulk carriers designed to pass through the original Panama Canal locks, typically 65,000–85,000 DWT (standard parcel: 75,000 MT).
- **VLSFO:** Very Low Sulphur Fuel Oil (maximum 0.50% sulphur content) complying with IMO 2020 international marine emissions standards.
- **Laytime:** Contractual period agreed between shipowner and charterer during which the vessel must be loaded or discharged without penalty.
- **Demurrage:** Liquidated damages paid by the charterer to the shipowner if the vessel is detained at port beyond the agreed laytime.
- **Despatch:** Bonus money paid by the shipowner to the charterer for loading or discharging faster than the allowed laytime (customarily half the demurrage rate).
- **FOB (Free on Board):** Buyer assumes freight costs and voyage risk once cargo is loaded on board at the origin port.

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
