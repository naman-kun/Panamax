// Simulation Engine for Panamax Freight Forecasting & Decision Intelligence
// Authentic domain realities for 75,000 MT Panamax bulk commodity corridors

export interface FreightDataPoint {
  date: string;
  historicalFreight?: number;
  predictedFreight?: number;
  ciLower?: number;
  ciUpper?: number;
  bunkerPrice: number;
  coalPrice: number;
  isForecast?: boolean;
}

export interface SimulationOverrides {
  bunkerShiftPct?: number; // e.g. -0.30 to +0.30 (-30% to +30%)
  lookbackMonths?: number;  // 3, 12, 36
  route?: string;
  vesselClass?: string;
}

export function generateFreightTimeseries(overrides: SimulationOverrides = {}): FreightDataPoint[] {
  const { bunkerShiftPct = 0, lookbackMonths = 3 } = overrides;
  const data: FreightDataPoint[] = [];

  const baseBunker = 610; // USD/MT baseline VLSFO
  const adjustedBunker = baseBunker * (1 + bunkerShiftPct);

  // Freight sensitivity: ~42% of Panamax operating cost is bunker fuel
  const fuelImpactPerMT = ((adjustedBunker - baseBunker) / baseBunker) * 4.2;

  // Generate historical points (e.g. 14 points leading up to today)
  const historicalDates = [
    'May 15', 'May 29', 'Jun 12', 'Jun 26', 'Jul 10', 
    'Jul 24', 'Aug 07', 'Aug 21', 'Sep 04', 'Sep 18', 
    'Oct 02', 'Oct 16', 'Oct 30', 'Nov 13'
  ];

  const historicalBase = [
    11.20, 11.55, 11.90, 12.40, 12.10, 
    11.85, 12.30, 12.75, 13.10, 12.95, 
    13.40, 13.80, 13.50, 13.90
  ];

  historicalDates.forEach((date, i) => {
    const histFreight = historicalBase[i];
    const histBunker = 590 + Math.sin(i * 0.6) * 25;
    data.push({
      date,
      historicalFreight: Number(histFreight.toFixed(2)),
      bunkerPrice: Math.round(histBunker),
      coalPrice: Math.round(112 + Math.cos(i * 0.4) * 8),
      isForecast: false,
    });
  });

  // Last historical point connects smoothly to forecast
  const lastHist = data[data.length - 1];

  // Forecast points (next 8 steps: +15d, +30d, +45d, +60d, +75d, +90d, +105d, +120d)
  const forecastDates = [
    'Nov 27', 'Dec 11', 'Dec 25', 'Jan 08', 
    'Jan 22', 'Feb 05', 'Feb 19', 'Mar 05'
  ];

  // Bridge point
  data[data.length - 1] = {
    ...lastHist,
    predictedFreight: lastHist.historicalFreight,
    ciLower: lastHist.historicalFreight,
    ciUpper: lastHist.historicalFreight,
  };

  forecastDates.forEach((date, i) => {
    const step = i + 1;
    // Base trend: seasonal monsoon easing, plus bunker impact
    const trend = -0.35 * step + fuelImpactPerMT * (0.8 + step * 0.15);
    const predicted = Number((13.90 + trend).toFixed(2));
    
    // Expanding 95% Confidence Interval band
    const ciSpread = 0.28 + step * 0.18;
    const ciLower = Number((predicted - ciSpread).toFixed(2));
    const ciUpper = Number((predicted + ciSpread).toFixed(2));
    const bunker = Math.round(adjustedBunker + Math.sin(step) * 12);

    data.push({
      date,
      predictedFreight: predicted,
      ciLower: Math.max(8.0, ciLower),
      ciUpper: ciUpper,
      bunkerPrice: bunker,
      coalPrice: Math.round(116 + step * 1.2),
      isForecast: true,
    });
  });

  return data;
}

// Demurrage & Despatch Calculations (75,000 MT Panamax laytime: 72 hrs)
export interface DemurrageResult {
  queueHours: number;
  isDemurrage: boolean;
  amount: number;
  formattedAmount: string;
  statusLabel: string;
  dailyRate: number;
  laytimeHours: number;
  varianceHours: number;
}

export function calculateDemurrage(queueHours: number): DemurrageResult {
  const laytimeHours = 72;
  const dailyDemurrageRate = 25000; // $25,000/day
  const hourlyDemurrageRate = dailyDemurrageRate / 24; // ~$1,041.67/hr
  const hourlyDespatchRate = hourlyDemurrageRate / 2; // Despatch is 50% of demurrage

  const variance = queueHours - laytimeHours;
  const isDemurrage = variance > 0;

  if (isDemurrage) {
    const amount = Math.round(variance * hourlyDemurrageRate);
    return {
      queueHours,
      isDemurrage: true,
      amount,
      formattedAmount: `-$${amount.toLocaleString()}`,
      statusLabel: 'Demurrage Penalty Incurred',
      dailyRate: dailyDemurrageRate,
      laytimeHours,
      varianceHours: variance,
    };
  } else {
    const amount = Math.round(Math.abs(variance) * hourlyDespatchRate);
    return {
      queueHours,
      isDemurrage: false,
      amount,
      formattedAmount: `+$${amount.toLocaleString()}`,
      statusLabel: 'Despatch Bonus Earned',
      dailyRate: dailyDemurrageRate,
      laytimeHours,
      varianceHours: Math.abs(variance),
    };
  }
}

// Chartering Waterfall Optimization
export interface WaterfallComponent {
  name: string;
  spot: number;
  optimized: number;
  unit: string;
}

export interface CharterOptimizationResult {
  volumeMT: number;
  vesselsRequired: number;
  spotTotal: number;
  optimizedTotal: number;
  netSavings: number;
  verdict: string;
  verdictAction: 'IMMEDIATE' | 'STAGGER' | 'TIME_CHARTER';
  components: WaterfallComponent[];
}

export function calculateCharterOptimization(volumeMT: number): CharterOptimizationResult {
  const vesselsRequired = Math.ceil(volumeMT / 75000);
  
  // Cost per MT
  const fobRate = 110.00; // FOB Commodity Cost
  const spotFreightRate = 13.80;
  const optFreightRate = 11.45;
  const spotBunkerCostPerMT = 4.20;
  const optBunkerCostPerMT = 3.65;
  const spotPortFeesPerMT = 1.60;
  const optPortFeesPerMT = 1.15;

  const spotPerMT = fobRate + spotFreightRate + spotBunkerCostPerMT + spotPortFeesPerMT;
  const optPerMT = fobRate + optFreightRate + optBunkerCostPerMT + optPortFeesPerMT;

  const spotTotal = Math.round(spotPerMT * volumeMT);
  const optimizedTotal = Math.round(optPerMT * volumeMT);
  const netSavings = spotTotal - optimizedTotal;

  let verdict = '';
  let verdictAction: 'IMMEDIATE' | 'STAGGER' | 'TIME_CHARTER' = 'IMMEDIATE';

  if (volumeMT <= 75000) {
    verdict = 'VERDICT: FIX 1 PANAMAX VESSEL TODAY — LOCK 72H RATE WINDOW BEFORE MONSOON REBOUND';
    verdictAction = 'IMMEDIATE';
  } else if (volumeMT <= 150000) {
    verdict = `VERDICT: FIX 1 VESSEL NOW ($11.45/MT), DELAY 2ND FIXTURE BY 14 DAYS (NET SAVINGS $${netSavings.toLocaleString()})`;
    verdictAction = 'STAGGER';
  } else {
    verdict = `VERDICT: STAGGER FIXTURES — FIX 2 SPOT PANAMAX NOW, HEDGE BALANCE VIA 45-DAY PERIOD CHARTER`;
    verdictAction = 'TIME_CHARTER';
  }

  const components: WaterfallComponent[] = [
    {
      name: 'FOB Cargo',
      spot: Math.round(fobRate * volumeMT),
      optimized: Math.round(fobRate * volumeMT),
      unit: 'USD',
    },
    {
      name: 'Ocean Freight',
      spot: Math.round(spotFreightRate * volumeMT),
      optimized: Math.round(optFreightRate * volumeMT),
      unit: 'USD',
    },
    {
      name: 'Bunker Fuel',
      spot: Math.round(spotBunkerCostPerMT * volumeMT),
      optimized: Math.round(optBunkerCostPerMT * volumeMT),
      unit: 'USD',
    },
    {
      name: 'Port & Laytime',
      spot: Math.round(spotPortFeesPerMT * volumeMT),
      optimized: Math.round(optPortFeesPerMT * volumeMT),
      unit: 'USD',
    },
  ];

  return {
    volumeMT,
    vesselsRequired,
    spotTotal,
    optimizedTotal,
    netSavings,
    verdict,
    verdictAction,
    components,
  };
}

// Stress Test Scenarios
export type StressScenarioId = 'baseline' | 'malacca' | 'bunker' | 'cyclone';

export interface StressScenarioData {
  id: StressScenarioId;
  name: string;
  iconColor: string;
  description: string;
  freightInflationPct: number;
  deliverySlippageDays: number;
  demurrageExposureUSD: number;
  bunkerSpikePct: number;
  confidenceScore: number;
  recommendedAction: string;
}

export const STRESS_SCENARIOS: Record<StressScenarioId, StressScenarioData> = {
  baseline: {
    id: 'baseline',
    name: 'Normal Weather / Open Straits',
    iconColor: 'emerald',
    description: 'Current baseline shipping conditions across Sunda, Malacca, and Bay of Bengal.',
    freightInflationPct: 0,
    deliverySlippageDays: 0,
    demurrageExposureUSD: 0,
    bunkerSpikePct: 0,
    confidenceScore: 94.2,
    recommendedAction: 'Standard chartering schedule on 30-day forward forecast.',
  },
  malacca: {
    id: 'malacca',
    name: 'Malacca Chokepoint Bottleneck',
    iconColor: 'amber',
    description: 'Vessel queue surge and speed restrictions through Singapore & Malacca Straits.',
    freightInflationPct: 24,
    deliverySlippageDays: 6.5,
    demurrageExposureUSD: 162500,
    bunkerSpikePct: 8.5,
    confidenceScore: 89.6,
    recommendedAction: 'Reroute via Sunda Strait; secure laytime extensions in charter party.',
  },
  bunker: {
    id: 'bunker',
    name: 'Global Bunker Fuel Shock (+25%)',
    iconColor: 'rose',
    description: 'Sudden crude market dislocation driving Singapore VLSFO to $765/MT.',
    freightInflationPct: 31,
    deliverySlippageDays: 1.2,
    demurrageExposureUSD: 45000,
    bunkerSpikePct: 25.0,
    confidenceScore: 92.4,
    recommendedAction: 'Execute bunker swap hedging; favor eco-engine Panamax tonnage.',
  },
  cyclone: {
    id: 'cyclone',
    name: 'Bay of Bengal Cyclone Alert',
    iconColor: 'purple',
    description: 'Severe deep depression shutting Paradip, Dhamra & Vizag anchorages.',
    freightInflationPct: 42,
    deliverySlippageDays: 11.0,
    demurrageExposureUSD: 285000,
    bunkerSpikePct: 14.0,
    confidenceScore: 95.8,
    recommendedAction: 'Invoke force majeure clauses; drift in safe deep water outside EEZ.',
  },
};
