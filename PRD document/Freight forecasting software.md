# Frontend Specification: Intelligent Freight Forecasting Model

## 1. Project Context
**Project:** Smart India Hackathon (SIH) Freight Forecasting & Vessel Chartering Optimizer.
**Business Goal:** Help an Indian company minimize total procurement and transportation costs by predicting maritime freight rates (e.g., Panamax vessels bringing coal from Indonesia to the East Coast of India) and recommending the optimal time to charter a vessel.
**Frontend Purpose:** An internal executive dashboard to visualize historical freight trends, view 30/60/90-day AI forecasts, track external variables (bunker fuel, port congestion), and display actionable optimization recommendations.

---

## 2. Tech Stack & Agent Autonomy
**Agent Directive:** You have full autonomy to select, swap, or configure the tech stack and libraries as you see fit to best achieve the dashboard's requirements. If a different charting library, state manager, or framework is better suited for handling time-series ML data, you are free to implement it. 

**Recommended Baseline Stack (Use unless you determine a better alternative):**
- **Framework:** Next.js (App Router) or React + Vite.
- **Styling:** Tailwind CSS.
- **UI Component Library:** `shadcn/ui` (Radix primitives) for rapid, accessible dashboard building.
- **Icons:** `lucide-react`.
- **Charts:** `recharts` (via shadcn/ui chart component) for time-series forecasting visualization.
- **Data Tables:** `@tanstack/react-table` for complex historical data grids.

**Architectural Rules:**
1. Prioritize clean UI/UX suitable for a B2B executive dashboard. 
2. Keep UI components pure. Isolate complex ML data fetching and state management away from presentation layers.
3. If using Next.js, default to Server Components for layouts, and restrict `"use client"` to interactive islands (charts, data tables, theme toggles).

---

## 3. Recommended Directory Architecture (Adapt as needed)
Implement a scalable, colocation-based architecture:
```text
src/ (or app/ if using Next.js)
├── (dashboard)/            # Route group for the authenticated app shell
│   ├── layout.tsx          # Main shell (SidebarProvider + Header)
│   ├── page.tsx            # Main KPI & Forecasting Dashboard
│   ├── chartering/         # Route: Vessel chartering recommendations
│   └── historical-data/    # Route: Tabular view of past freight rates
components/
├── ui/                     # Reusable UI primitives (e.g., shadcn components)
├── layout/                 # Sidebar, Topbar, ThemeToggle
├── charts/                 # Implementations for time-series & ML uncertainty visualization
└── features/               # Complex SIH-specific components (e.g., OptimizationCard)
lib/                        # Utility functions (cn, date formatting, math helpers)

## 4. Frontend design specifications
Use the shadcn ui design specifications to build the frontend. The design is available in the Figma file to which u have access through the mcp. Ensure that the frontend is responsive and can be used on different devices. For whatever component you cannot find in the shadcn design system u can match the exact way it would look as per the shadcn design system design principles. 

**Detailed design layout guidelines:
1. Make use of ShadCN UI Components to build the frontend.
2. Make a pagewise system
3. first page is the landing page which must be very impressive with vector animations of graphs moving in a enclosed area with a minimalistic border around it. the whole software has a dark mode theme and the design system of shadcn should be used as the primary source of truth for the design system from the components to the fonts to the colors to the icons as well.
4. use mainly black and shades of black and gray only everywhere and white mainly for the software especially the landing page.
5. make a landing page like this: https://linear.app/ only but with our stuff like freight rates and chart animations in cards where they have put the boxes and cubes in boxes and the interesting animation which interacts with the position of ur cursor and the cards in the stack move with it there it could be a 3d animation of a curvy line graph that interacts with the cursor and changes shape. the top hero section where they have put the tagline "The product development
system for teams and agents" we could write our own tagline "Predict the freight. Time the charter. Optimize the cost." on top the horizontal bar should look like this only just made by using shadcn components and design system like in the reference image below: 
reference images/Screenshot 2026-09-06 at 6.57.13 PM.png. Also each button on the top sidebar should have seperators between them also each of the button should be a hover popover giving options like linear below it. also necessary buttons must have tooltip when hovered on them. below the hero text (the tagline) they have put a interative picture of their software we can't do that but add a picture of a ship sailing on a sea with our logo on it or something related to the software. 

##5. See what panamax can do section:
# Frontend Architecture & UI/UX Specification: Intelligent Maritime Freight Forecasting Showcase

## 1. AI Coding Agent Directives (CRITICAL)
Before executing any code, you must adhere to the following architectural and design rules:
- **Frontend-Only Execution:** This is a high-fidelity interactive demo for a landing page. **Do not write any backend code (no Python, no FastAPI, no database).** All logic, filtering, math, and state management must be handled entirely in the browser using React state, Zustand/Context, and robust TypeScript mock data generators.
- **Strict UI/UX Framework:** You must strictly and exclusively use the **shadcn/ui** design system (React/Next.js components via Radix primitives). 
- **Figma MCP Integration:** You are instructed to use your **Figma MCP (Model Context Protocol)** tool to access the official "shadcn/ui Design System" file from the Figma Community. Extract exact spacing, border radii, typography scales (Inter/Geist), and component states (hover, focus, disabled) directly from the Figma file to ensure a flawless, professional enterprise UI.
- **Design Aesthetic:** Implement a dark-mode-first, industrial "Bloomberg/Linear" aesthetic. Use `zinc-950` backgrounds, `zinc-800` borders, `font-mono` for all numerical/financial data, and semantic accent colors (Cyan for forecasts, Violet for confidence intervals, Emerald for savings, Rose for demurrage/losses).
- **Execution:** Do not hallucinate gimmicky features. Every component must be functional and tied directly to the maritime business logic detailed below. Sliders must actively recalculate the mock data arrays and trigger React re-renders for the charts.

---

## 2. Executive Summary & SIH Problem Translation
Indian conglomerates (power, steel) import millions of tonnes of dry bulk commodities (coal, iron ore). They face massive unhedged exposure to ocean freight rate volatility. Making a chartering decision on a 75,000 MT Panamax shipment at the wrong time by just $1.50/MT costs $112,500 USD per voyage.

This frontend showcase demonstrates our two core engines:
1. **Predictive Engine:** Forecasts rates 15/30/60/90 days out with 95% Confidence Interval corridors.
2. **Prescriptive Engine:** Evaluates forecasts against port congestion and holding costs to output a binary decision: **"CHARTER TODAY"** vs. **"DELAY FIXTURE"**.

---

## 3. Maritime Domain Context (For Realistic Mock Data)
To make the frontend demo feel authentic, your TypeScript mock data functions must respect these realities:
- **Vessel Class:** Panamax (75,000 MT cargo capacity).
- **Corridor:** Indonesia (e.g., Taboneo) to East Coast India (e.g., Paradip, Vizag). 
- **Demurrage:** $20,000–$35,000 USD/day penalty if port congestion delays the vessel beyond allowed contractual laytime.
- **Baseline Freight:** $10.00 to $15.00 USD/MT.
- **Baseline VLSFO Bunker Fuel:** $550 to $650 USD/MT.

---

## 4. Frontend State & Mock Data Architecture
Create a dedicated simulation engine (`src/lib/simulationEngine.ts`) that generates base timeseries data and applies multipliers when users move UI sliders.

**State Management Logic:**
- Base historical array: 365 days of past freight rates, fuel prices, and coal prices.
- Base forecast array: 90 days of predicted rates, including upper/lower CI bounds.
- When a user moves the "Bunker Offset +20%" slider, the simulation engine maps over the base array, increases the fuel price by 20%, recalculates the predicted freight rate curve (Freight goes up when fuel goes up), and updates the React state to immediately re-render the Recharts component.

---

## 5. Interactive Feature Sandbox UI (The 4 Modules)
Build an interactive Next.js section where clients can toggle between 4 distinct tabs/cards to test the core features.

### Feature 1: Multi-Factor Freight Rate Predictor
- **Controls:** Popovers for Lookback Window (3M, 1Y, 3Y), Vessel Class, Route.
- **Chart:** Recharts `ComposedChart`. Primary Y: Freight ($/MT). Secondary Y: Fuel ($/MT). Use a solid white line for historical, a dashed cyan line for the forecast, and a purple shaded `<Area />` for the 95% CI Corridor.
- **Interactive State:** A slider for "Bunker Market Shock (-30% to +30%)". Dragging this must instantly shift both the Fuel line and the Freight forecast line on the chart.

### Feature 2: Voyage Tracker & Demurrage Radar
- **Controls:** Shipment switcher (e.g., "MV Eastern Glory - En Route"). Slider for "Live Port Queue (0-120h)".
- **Visuals:** SVG static route map (Indonesia to Paradip) with a glowing pulse animation indicating current vessel position.
- **Interactive State:** A financial metric HUD that dynamically updates based on the port queue slider.
  - Queue < 72h: UI is Green, showing "Despatch Earned: +$X".
  - Queue > 72h: UI turns Red, showing "Demurrage Penalty: -$Y".

### Feature 3: Strategic Chartering Optimizer
- **Controls:** Cargo Volume Slider (50k to 300k MT), Delivery Window target.
- **Visuals:** A massive alert banner rendering the calculated verdict (e.g., "VERDICT: FIX 1 VESSEL NOW, DELAY 2ND").
- **Interactive State:** A Recharts `<BarChart />` acting as a Landed Cost Waterfall. As the user toggles between "Current Spot Cost" vs. "Optimized AI Cost", the waterfall bars (FOB Cargo + Freight + Fuel + Fees) adjust to show the total net savings in monospace green text.

### Feature 4: Supply Chain Stress Simulator
- **Controls:** One-click scenario preset buttons: `[Malacca Bottleneck]`, `[Bunker Shock]`, `[Cyclone Alert]`.
- **Visuals:** Four metric cards showing immediate financial impact.
- **Interactive State:** Clicking a scenario button injects a hardcoded multiplier into the `simulationEngine`, causing the metric cards to instantly count up to new values (e.g., "Freight Inflation: +24%", "Delivery Slippage: +6 Days").

---

## 6. Step-by-Step AI Execution Prompts
*Agent: Execute these steps sequentially upon user command.*

### Prompt 1: Project Init & Design System Setup
"Use Figma MCP to analyze the official shadcn/ui design system. Initialize a Next.js App Router project (or Vite + React). Install tailwind, lucide-react, recharts, and the following shadcn components: card, button, slider, tabs, select, popover, badge. Set up the root layout with a dark `zinc-950` industrial aesthetic."

### Prompt 2: Mock Data & Simulation Engine
"Create a frontend-only data simulation layer at `src/lib/simulationEngine.ts`. It should export a function that generates realistic timeseries data (Date, FreightRate, PredictedRate, CILower, CIUpper, VlsfoPrice, CoalPrice). The function must accept an `overrides` object (e.g., `{ bunkerShiftPct: 0.15 }`) that mathematically deforms the generated curves. Build this cleanly so our React components can call it when sliders change."

### Prompt 3: Sandbox Layout & Tab Navigation
"Build `InteractiveShowcaseSection.tsx`. This is a full-width container with a sleek header and a side-navigation or tabbed interface to switch between the 4 modules (Predictor, Tracker, Optimizer, Simulator). Include placeholder empty components for the 4 modules. Ensure active/inactive tab states match Linear's subtle gray/white contrast styles."

### Prompt 4: Feature 1 - Freight Predictor Chart
"Implement `FreightPredictorModule.tsx`. Use Recharts to build the multi-axis ComposedChart showing historical freight, forecasted freight, the CI corridor, and fuel prices. Add a shadcn UI Slider for 'Bunker Offset'. Wire the slider's `onValueChange` event to trigger a re-run of the `simulationEngine` and update the chart's React state in real-time."

### Prompt 5: Feature 2 - Tracker & Demurrage
"Implement `VoyageTrackerModule.tsx`. Build a stylized static SVG map layout on the left. On the right, build the 'Port Waiting Queue' slider and the Financial Impact Gauge. Write the frontend math so that if the slider crosses 72 hours, the UI dynamically changes color classes from emerald (despatch) to rose (demurrage) and calculates the exact dollar penalty based on a $25k/day rate."

### Prompt 6: Features 3 & 4 - Optimizer and Simulator
"Implement `CharterOptimizerModule.tsx` and `StressSimulatorModule.tsx`. For the Optimizer, build the Landed Cost Waterfall chart using Recharts and a large 'VERDICT' banner component. For the Simulator, build a grid of Metric Cards and wire up preset buttons (e.g., 'Cyclone Alert') that instantly alter the metric states to show supply chain disruption impacts."

