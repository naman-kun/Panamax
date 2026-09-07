# Panamax — Maritime Freight Intelligence & Chartering Optimizer

> **Predict the freight. Time the charter. Optimize the cost.**  
> Enterprise-grade maritime freight rate forecasting and vessel chartering terminal for bulk commodity procurement desks.

---

## Overview

Indian conglomerates (power, steel, refineries) and global commodity trading houses import millions of tonnes of dry bulk commodities (thermal coal, coking coal, iron ore, crude oil). They face massive unhedged exposure to ocean freight rate volatility:

> **The $1.50/MT Problem**: Making a chartering fixture decision on a 75,000 MT Panamax shipment at the wrong time by just **$1.50/MT** costs **$112,500 USD** in avoidable capital loss per single voyage.

**Panamax** unifies predictive and prescriptive intelligence to forecast freight volatility and identify optimal booking windows across critical global export corridors to East Coast India.

Built from the ground up strictly adhering to the **shadcn/ui** design system with a dark `zinc-950` institutional terminal aesthetic, monospace financial telemetry, and real-time client-side simulation models.

---

## Core Capabilities ("See What Panamax Can Do")

### 1. Dual-Port Export Corridor Selector
- **Source Export Country / Port Dropdown:**
  - **Indonesia**: Taboneo (South Kalimantan), Muara Pantai, Balikpapan
  - **Russia**: Primorsk (Baltic Sea), Novorossiysk (Black Sea), Ust-Luga, Kozmino (Pacific)
  - **Australia**: Hay Point / Dalrymple Bay, Newcastle, Gladstone, Port Hedland
  - **South Africa**: Richards Bay (RBCT), Saldanha Bay
  - **United States**: Houston / Gulf Coast, Hampton Roads / Norfolk
  - **UAE / Middle East**: Fujairah, Ras Tanura
  - **Brazil**: Tubarão Terminal, Itaqui
  - **Mozambique**: Maputo (Matola Coal Hub)
- **Destination Indian Port Dropdown (East Coast India):**
  - Paradip Port (Odisha)
  - Visakhapatnam / Vizag (Andhra Pradesh)
  - Haldia Port / Kolkata Dock (West Bengal)
  - Dhamra Port (Odisha)
  - Krishnapatnam Port (Andhra Pradesh)
  - Ennore / Kamarajar Port (Tamil Nadu)
  - Chennai Port (Tamil Nadu)
  - Kakinada Deepwater Port (Andhra Pradesh)
  - Gopalpur Port (Odisha)
  - Gangavaram Port (Andhra Pradesh)
- **Live Corridor Telemetry Bar:** Real-time distance in nautical miles, vessel deadweight capacity, benchmark spot rates, and target AI forecasts.

### 2. Institutional Financial Chart Terminal
Modeled directly on the Infragistics / TradingView Financial Chart specification in dark mode:
- **Built-in Interactive Toolbar:**
  - `Indicators ▾` menu.
  - Multi-Horizon Time Range Buttons: `1M`, `3M`, `6M`, `YTD`, `1Y`, `ALL`.
  - Display mode switchers.
- **Dual Financial Curves:**
  - **Purple Curve (`#a855f7`):** Panamax AI Forward Forecast with dynamic endpoint value pill badge (e.g. `+122.4%`).
  - **Green Curve (`#22c55e`):** Baltic Realized Spot Benchmark with dynamic endpoint value pill badge (e.g. `+106.4%`).
- **Interactive Bottom Timeline Navigator:**
  - Integrated zoom slider with dual range drag handles `[||` ... `||]` for panning and zooming across historical and forward forecast timelines.
- **Smooth Real-Time Reactivity:**
  - Changing either the source country or the destination port dynamically shifts the curve values with fluid animation.

### 3. Linear-Inspired 3D Isometric Art
- **FIG 0.1 Purpose-built:** Multi-layered stacked isometric slabs with embossed circular emblem and vertical expansion on cursor hover.
- **FIG 0.2 Powered by neural forecasting:** 4 floating isometric cubes in an orbital cluster with 3D tilt and layer separation.
- **FIG 0.3 Designed for precision:** Stepped perspective fan rack of 10 vertical panels with perspective wave lift.

---

## Technical Stack & Design System

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/) | High-performance SPA with fast HMR |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict type safety across mathematical models and props |
| **Financial Viz** | [Ignite UI Financial Chart](https://www.infragistics.com/) | Institutional canvas financial chart with range slider |
| **Design Tokens** | [shadcn/ui](https://ui.shadcn.com/) | Neutral `zinc-950` palette, subtle white borders (`border-white/10`) |
| **Primitives** | [Radix UI](https://www.radix-ui.com/) | Accessible Dialogs, Popovers, Sliders, Tabs, Hover Cards, Tooltips |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) | Atomic utility classes and responsive breakpoints |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, minimalist monochrome vector iconography |

---

## Repository Structure

```
.
├── PRD document/
│   ├── Freight forecasting software.md   # Maritime PRD and domain specifications
│   └── code reference.txt                 # Financial chart component reference code
├── public/                                # Static public assets
├── reference images/                      # Linear and Notion UI/UX inspiration references
├── src/
│   ├── components/
│   │   ├── landing/
│   │   │   ├── modules/
│   │   │   │   └── FreightPredictorModule.tsx # Dual dropdown selector & forecaster terminal
│   │   │   ├── BentoGrid.tsx                  # 3D tilt feature bento grid
│   │   │   ├── DemoModal.tsx                  # Interactive simulation dialog
│   │   │   ├── FinancialChart.tsx             # IgcFinancialChartComponent in dark mode
│   │   │   ├── Footer.tsx                     # Minimalist dark footer
│   │   │   ├── Hero.tsx                       # Left-aligned hero headline & market cards
│   │   │   ├── InteractiveGraph.tsx           # 3D cursor-elastic stock chart
│   │   │   ├── LinearFigures.tsx              # Isometric wireframe art (FIG 0.1–0.3)
│   │   │   ├── Navbar.tsx                     # Topbar with Radix hover cards & popovers
│   │   │   └── SeeWhatPanamaxCanDo.tsx        # Streamlined forecaster master section
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
│   │   ├── simulationEngine.ts                # Route distances, port definitions & stock history
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

## Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** (or **pnpm** / **yarn**)

### Installation
```bash
# Clone the repository
git clone https://github.com/naman-kun/Panamax.git

# Navigate into the project directory
cd Panamax

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

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
