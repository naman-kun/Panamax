// Simulation Engine for Panamax Freight Forecasting & Decision Intelligence
// Authentic maritime realities for 75,000 MT Panamax bulk commodity corridors to India

export interface PortInfo {
  id: string;
  name: string;
  country: string;
  region: string;
  primaryCargo: string;
  baseRateUSD: number; // typical benchmark rate in $/MT
  volatilityIndex: number;
  nauticalMilesToEastIndia: number;
}

// Major countries and ports that export bulk commodities to India
export const SOURCE_EXPORT_PORTS: PortInfo[] = [
  // Indonesia (Coal & Minerals)
  {
    id: 'id-taboneo',
    name: 'Taboneo (South Kalimantan)',
    country: 'Indonesia',
    region: 'Southeast Asia',
    primaryCargo: 'Thermal Coal (GAR 4200/5000)',
    baseRateUSD: 11.80,
    volatilityIndex: 1.15,
    nauticalMilesToEastIndia: 2420,
  },
  {
    id: 'id-muara',
    name: 'Muara Pantai (East Kalimantan)',
    country: 'Indonesia',
    region: 'Southeast Asia',
    primaryCargo: 'Thermal & Coking Coal',
    baseRateUSD: 12.40,
    volatilityIndex: 1.18,
    nauticalMilesToEastIndia: 2510,
  },
  {
    id: 'id-balikpapan',
    name: 'Balikpapan (East Kalimantan)',
    country: 'Indonesia',
    region: 'Southeast Asia',
    primaryCargo: 'Crude & Heavy Fuel Oil',
    baseRateUSD: 13.10,
    volatilityIndex: 1.12,
    nauticalMilesToEastIndia: 2470,
  },

  // Russia (Crude Oil, Coal & Fertilizer)
  {
    id: 'ru-primorsk',
    name: 'Primorsk (Baltic Sea)',
    country: 'Russia',
    region: 'Baltic / Europe',
    primaryCargo: 'Urals Crude Oil',
    baseRateUSD: 88.50,
    volatilityIndex: 1.45,
    nauticalMilesToEastIndia: 8450,
  },
  {
    id: 'ru-novorossiysk',
    name: 'Novorossiysk (Black Sea)',
    country: 'Russia',
    region: 'Black Sea',
    primaryCargo: 'Siberian Light Crude & Grain',
    baseRateUSD: 74.20,
    volatilityIndex: 1.38,
    nauticalMilesToEastIndia: 5120,
  },
  {
    id: 'ru-ust-luga',
    name: 'Ust-Luga (Baltic Sea)',
    country: 'Russia',
    region: 'Baltic / Europe',
    primaryCargo: 'Anthracite Coal & Fertilizers',
    baseRateUSD: 82.00,
    volatilityIndex: 1.40,
    nauticalMilesToEastIndia: 8380,
  },
  {
    id: 'ru-kozmino',
    name: 'Kozmino (Nakhodka / Pacific)',
    country: 'Russia',
    region: 'Far East Pacific',
    primaryCargo: 'ESPO Blend Crude Oil',
    baseRateUSD: 66.80,
    volatilityIndex: 1.30,
    nauticalMilesToEastIndia: 5890,
  },

  // Australia (Metallurgical & Thermal Coal, Iron Ore)
  {
    id: 'au-haypoint',
    name: 'Hay Point / Dalrymple Bay',
    country: 'Australia',
    region: 'Queensland',
    primaryCargo: 'Prime Hard Coking Coal',
    baseRateUSD: 19.80,
    volatilityIndex: 1.25,
    nauticalMilesToEastIndia: 4950,
  },
  {
    id: 'au-newcastle',
    name: 'Newcastle Port',
    country: 'Australia',
    region: 'New South Wales',
    primaryCargo: 'High-CV Thermal Coal',
    baseRateUSD: 20.60,
    volatilityIndex: 1.22,
    nauticalMilesToEastIndia: 5350,
  },
  {
    id: 'au-gladstone',
    name: 'Gladstone Port',
    country: 'Australia',
    region: 'Queensland',
    primaryCargo: 'Coking Coal & Aluminum Bauxite',
    baseRateUSD: 19.20,
    volatilityIndex: 1.20,
    nauticalMilesToEastIndia: 4890,
  },
  {
    id: 'au-hedland',
    name: 'Port Hedland',
    country: 'Australia',
    region: 'Western Australia',
    primaryCargo: 'Iron Ore Fines & Lumps',
    baseRateUSD: 15.40,
    volatilityIndex: 1.15,
    nauticalMilesToEastIndia: 3420,
  },

  // South Africa (Coal & Minerals)
  {
    id: 'za-richardsbay',
    name: 'Richards Bay (RBCT)',
    country: 'South Africa',
    region: 'Indian Ocean / Africa',
    primaryCargo: 'RB1 Export Thermal Coal',
    baseRateUSD: 17.50,
    volatilityIndex: 1.28,
    nauticalMilesToEastIndia: 4720,
  },
  {
    id: 'za-saldanha',
    name: 'Saldanha Bay',
    country: 'South Africa',
    region: 'Atlantic / Africa',
    primaryCargo: 'High Grade Iron Ore',
    baseRateUSD: 18.90,
    volatilityIndex: 1.24,
    nauticalMilesToEastIndia: 5410,
  },

  // United States (Coal, Crude & Grains)
  {
    id: 'us-houston',
    name: 'Houston / Gulf Coast',
    country: 'United States',
    region: 'US Gulf',
    primaryCargo: 'WTI Midland Crude Oil',
    baseRateUSD: 48.00,
    volatilityIndex: 1.35,
    nauticalMilesToEastIndia: 11400,
  },
  {
    id: 'us-norfolk',
    name: 'Hampton Roads / Norfolk',
    country: 'United States',
    region: 'US East Coast',
    primaryCargo: 'Low-Vol Metallurgical Coal',
    baseRateUSD: 44.50,
    volatilityIndex: 1.30,
    nauticalMilesToEastIndia: 9800,
  },

  // UAE / Middle East (Crude & Bunkers)
  {
    id: 'ae-fujairah',
    name: 'Fujairah Anchorage',
    country: 'United Arab Emirates',
    region: 'Gulf of Oman',
    primaryCargo: 'Crude Oil & Condensates',
    baseRateUSD: 14.80,
    volatilityIndex: 1.18,
    nauticalMilesToEastIndia: 2050,
  },
  {
    id: 'sa-rastanura',
    name: 'Ras Tanura Terminal',
    country: 'Saudi Arabia',
    region: 'Persian Gulf',
    primaryCargo: 'Arab Light / Heavy Crude',
    baseRateUSD: 16.20,
    volatilityIndex: 1.22,
    nauticalMilesToEastIndia: 2480,
  },

  // Brazil (Iron Ore & Agribulk)
  {
    id: 'br-tubarao',
    name: 'Tubarão Terminal',
    country: 'Brazil',
    region: 'South America',
    primaryCargo: 'Carajás Iron Ore Pellets',
    baseRateUSD: 26.50,
    volatilityIndex: 1.32,
    nauticalMilesToEastIndia: 8850,
  },

  // Mozambique (Coking & Thermal Coal)
  {
    id: 'mz-maputo',
    name: 'Maputo (Matola Coal Hub)',
    country: 'Mozambique',
    region: 'East Africa',
    primaryCargo: 'Moatize Coking & Steam Coal',
    baseRateUSD: 15.60,
    volatilityIndex: 1.20,
    nauticalMilesToEastIndia: 4420,
  },
];

// All major East Coast India bulk discharge ports
export const DESTINATION_INDIAN_PORTS = [
  {
    id: 'in-paradip',
    name: 'Paradip Port',
    state: 'Odisha',
    draftMax: '17.1m (Capesize/Panamax)',
    specialty: 'Primary Crude Oil SPM, Thermal & Coking Coal',
    congestionIndex: 1.05,
  },
  {
    id: 'in-vizag',
    name: 'Visakhapatnam (Vizag) Port',
    state: 'Andhra Pradesh',
    draftMax: '18.1m Outer Harbour',
    specialty: 'Steel Plant Coking Coal, Crude & Petroleum',
    congestionIndex: 1.02,
  },
  {
    id: 'in-haldia',
    name: 'Haldia Port / Kolkata Dock',
    state: 'West Bengal',
    draftMax: '8.5m - 9.2m (Tidal / Handymax/Panamax)',
    specialty: 'Refinery Ingestion & Eastern Hinterland Coal',
    congestionIndex: 1.14,
  },
  {
    id: 'in-dhamra',
    name: 'Dhamra Port',
    state: 'Odisha',
    draftMax: '18.5m Deep Draft',
    specialty: 'All-Weather Deepwater Capesize Coal & Ore',
    congestionIndex: 0.98,
  },
  {
    id: 'in-krishnapatnam',
    name: 'Krishnapatnam Port',
    state: 'Andhra Pradesh',
    draftMax: '18.5m Deep Draft',
    specialty: 'Power Plant Coal & Minerals Terminal',
    congestionIndex: 0.99,
  },
  {
    id: 'in-ennore',
    name: 'Ennore (Kamarajar Port)',
    state: 'Tamil Nadu',
    draftMax: '16.0m Draft',
    specialty: 'TANGEDCO Dedicated Thermal Coal & Clean Cargo',
    congestionIndex: 1.01,
  },
  {
    id: 'in-chennai',
    name: 'Chennai Port',
    state: 'Tamil Nadu',
    draftMax: '16.5m Draft',
    specialty: 'Liquid Cargo & Industrial Bulk Terminal',
    congestionIndex: 1.03,
  },
  {
    id: 'in-kakinada',
    name: 'Kakinada Deepwater Port',
    state: 'Andhra Pradesh',
    draftMax: '14.5m Draft',
    specialty: 'Fertilizers, Grains & Off-shore Petroleum',
    congestionIndex: 1.00,
  },
  {
    id: 'in-gopalpur',
    name: 'Gopalpur Port',
    state: 'Odisha',
    draftMax: '14.5m Draft',
    specialty: 'Mineral Sands, Fertilizer & Coal',
    congestionIndex: 0.97,
  },
  {
    id: 'in-gangavaram',
    name: 'Gangavaram Port',
    state: 'Andhra Pradesh',
    draftMax: '20.2m Deepest Draft',
    specialty: 'Direct Conveyor Coking Coal for Steel Mills',
    congestionIndex: 0.96,
  },
];

// StockItem data model matching the Infragistics Financial Chart reference in code reference.txt
export class StockItem {
  public open: number = 0;
  public high: number = 0;
  public low: number = 0;
  public close: number = 0;
  public volume: number = 0;
  public date: Date = new Date();
}

/**
 * Generates realistic financial OHLC timeseries for the financial chart
 * Produces dual data series:
 * 1. Panamax Neural AI Forward Forecast (purple curve in reference)
 * 2. Baltic Realized Spot Market Benchmark (green curve in reference)
 */
export function generateRouteFinancialData(
  sourceId: string,
  destId: string,
  timeframe: '1M' | '3M' | '6M' | 'YTD' | '1Y' | 'ALL' = '1Y'
): {
  panamaxForecast: StockItem[];
  marketBenchmark: StockItem[];
  currentPanamaxRate: number;
  currentBenchmarkRate: number;
  percentChangePanamax: number;
  percentChangeBenchmark: number;
  source: PortInfo;
  destination: (typeof DESTINATION_INDIAN_PORTS)[0];
} {
  const source = SOURCE_EXPORT_PORTS.find((p) => p.id === sourceId) || SOURCE_EXPORT_PORTS[0];
  const destination = DESTINATION_INDIAN_PORTS.find((p) => p.id === destId) || DESTINATION_INDIAN_PORTS[0];

  // Base rate calculated from source rate + destination port factor
  const baseRate = source.baseRateUSD * destination.congestionIndex;
  const vol = source.volatilityIndex;

  // Determine number of trading days based on timeframe
  let days = 365;
  if (timeframe === '1M') days = 30;
  else if (timeframe === '3M') days = 90;
  else if (timeframe === '6M') days = 180;
  else if (timeframe === 'YTD') days = 250;
  else if (timeframe === '1Y') days = 365;
  else if (timeframe === 'ALL') days = 730;

  const now = new Date();
  const panamaxItems: StockItem[] = [];
  const benchmarkItems: StockItem[] = [];

  let pClose = baseRate * 0.88;
  let bClose = baseRate * 0.90;

  for (let i = days; i >= 0; i--) {
    const itemDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const progress = 1 - i / days; // 0 to 1

    // Realistic market wave patterns
    const seasonalWave = Math.sin(progress * Math.PI * 3.5) * 1.4 * vol;
    const microJitterP = (Math.sin(i * 1.7) + Math.cos(i * 0.9)) * 0.35 * vol;
    const microJitterB = (Math.cos(i * 1.5) + Math.sin(i * 1.1)) * 0.45 * vol;

    // AI model predictive edge: smoother upward optimization
    pClose = Number((baseRate * (0.90 + progress * 0.28) + seasonalWave + microJitterP).toFixed(2));
    bClose = Number((baseRate * (0.88 + progress * 0.20) + seasonalWave * 1.2 + microJitterB).toFixed(2));

    pClose = Math.max(5.0, pClose);
    bClose = Math.max(5.0, bClose);

    // Panamax Item (Purple)
    const pItem = new StockItem();
    pItem.date = itemDate;
    pItem.open = Number((pClose - 0.25).toFixed(2));
    pItem.high = Number((pClose + 0.45).toFixed(2));
    pItem.low = Number((pClose - 0.40).toFixed(2));
    pItem.close = pClose;
    pItem.volume = Math.round(75000 + Math.sin(i) * 15000);
    panamaxItems.push(pItem);

    // Benchmark Item (Green)
    const bItem = new StockItem();
    bItem.date = itemDate;
    bItem.open = Number((bClose - 0.30).toFixed(2));
    bItem.high = Number((bClose + 0.55).toFixed(2));
    bItem.low = Number((bClose - 0.50).toFixed(2));
    bItem.close = bClose;
    bItem.volume = Math.round(70000 + Math.cos(i) * 18000);
    benchmarkItems.push(bItem);
  }

  // Set data intent for Series Title exactly as in code reference.txt
  (panamaxItems as any).__dataIntents = {
    close: ['SeriesTitle/Panamax AI Neural Forecast'],
  };
  (benchmarkItems as any).__dataIntents = {
    close: ['SeriesTitle/Baltic Realized Spot Benchmark'],
  };

  const initialP = panamaxItems[0].close || baseRate;
  const currentP = panamaxItems[panamaxItems.length - 1].close || baseRate;
  const percentChangePanamax = Number((((currentP - initialP) / initialP) * 100).toFixed(1));

  const initialB = benchmarkItems[0].close || baseRate;
  const currentB = benchmarkItems[benchmarkItems.length - 1].close || baseRate;
  const percentChangeBenchmark = Number((((currentB - initialB) / initialB) * 100).toFixed(1));

  return {
    panamaxForecast: panamaxItems,
    marketBenchmark: benchmarkItems,
    currentPanamaxRate: currentP,
    currentBenchmarkRate: currentB,
    percentChangePanamax,
    percentChangeBenchmark,
    source,
    destination,
  };
}
