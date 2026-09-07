import React, { useEffect, useRef, useState } from 'react';
import { ModuleManager } from 'igniteui-webcomponents-core';
import {
  IgcFinancialChartModule,
  IgcFinancialChartComponent,
  FinancialChartYAxisMode,
  FinancialChartType,
  FinancialChartZoomSliderType,
} from 'igniteui-webcomponents-charts';
import { StockItem } from '@/lib/simulationEngine';

// Ensure module registration on client-side
let isRegistered = false;
function registerIgniteUI() {
  if (typeof window !== 'undefined' && !isRegistered) {
    try {
      ModuleManager.register(IgcFinancialChartModule);
      isRegistered = true;
    } catch (e) {
      console.warn('IgcFinancialChartModule registration:', e);
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'igc-financial-chart': any;
    }
  }
}

interface FinancialChartProps {
  panamaxData: StockItem[];
  benchmarkData: StockItem[];
  title: string;
  subtitle: string;
  yAxisMode?: 'PercentChange' | 'Numeric';
  percentChangePanamax: number;
  percentChangeBenchmark: number;
  currentPanamaxRate: number;
  currentBenchmarkRate: number;
}

export function FinancialChart({
  panamaxData,
  benchmarkData,
  title,
  subtitle,
  yAxisMode = 'PercentChange',
  percentChangePanamax,
  percentChangeBenchmark,
  currentPanamaxRate,
  currentBenchmarkRate,
}: FinancialChartProps) {
  const chartRef = useRef<IgcFinancialChartComponent | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    registerIgniteUI();
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    const chart = chartRef.current;
    if (!chart) return;

    try {
      // Configuration matching reference screenshot
      chart.chartTitle = title;
      chart.subtitle = subtitle;
      chart.chartType = FinancialChartType.Line;
      chart.thickness = 2.5;
      chart.zoomSliderType = FinancialChartZoomSliderType.Line;
      chart.isToolbarVisible = true;

      // Dark palette styling
      chart.brushes = ['#a855f7', '#22c55e'];
      chart.outlines = ['#a855f7', '#22c55e'];
      (chart as any).yAxisMajorStroke = '#27272a';
      (chart as any).xAxisMajorStroke = '#27272a';

      // Axis mode
      if (yAxisMode === 'PercentChange') {
        chart.yAxisMode = FinancialChartYAxisMode.PercentChange;
        chart.yAxisTitle = 'Percent Changed';
      } else {
        chart.yAxisMode = FinancialChartYAxisMode.Numeric;
        chart.yAxisTitle = 'Freight Rate ($/MT)';
      }

      // Bind data sources
      chart.dataSource = [panamaxData, benchmarkData];
    } catch (err) {
      console.error('Failed to configure IgcFinancialChartComponent:', err);
    }
  }, [mounted, panamaxData, benchmarkData, title, subtitle, yAxisMode]);

  return (
    <div className="relative w-full rounded-2xl bg-zinc-950 border border-white/10 p-3 sm:p-5 overflow-hidden shadow-2xl">
      {/* Dynamic Endpoint Badges overlaying the top right matching reference screenshot */}
      <div className="flex flex-wrap items-center justify-end gap-2.5 mb-2 font-mono text-xs">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-purple-950/80 border border-purple-500/40 text-purple-300 font-semibold shadow-lg backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
          <span>Panamax AI:</span>
          <strong className="text-white">${currentPanamaxRate}/MT</strong>
          <span className="text-purple-400">
            ({percentChangePanamax >= 0 ? `+${percentChangePanamax}%` : `${percentChangePanamax}%`})
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-semibold shadow-lg backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span>Spot Benchmark:</span>
          <strong className="text-white">${currentBenchmarkRate}/MT</strong>
          <span className="text-emerald-400">
            ({percentChangeBenchmark >= 0 ? `+${percentChangeBenchmark}%` : `${percentChangeBenchmark}%`})
          </span>
        </div>
      </div>

      {/* Web Component Canvas */}
      <div className="w-full h-[520px] sm:h-[600px] rounded-xl overflow-hidden bg-zinc-950">
        <igc-financial-chart
          ref={chartRef}
          id="chart"
          width="100%"
          height="100%"
          chart-title={title}
          subtitle={subtitle}
          chart-type="Line"
          thickness="2"
        />
      </div>
    </div>
  );
}
