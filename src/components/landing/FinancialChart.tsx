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
  yAxisMode?: 'PercentChange' | 'Numeric' | 'BPI_Points';
  percentChangePanamax: number;
  percentChangeBenchmark: number;
  currentPanamaxRate: number;
  currentBenchmarkRate: number;
  currentBpiPoints?: number;
  targetBpiPoints?: number;
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
  currentBpiPoints = 1501,
  targetBpiPoints = 1420,
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

      // Transition animation matching PRD document/code reference 3.txt: SweepFromCategoryAxisMinimum for 1500ms
      (chart as any).isTransitionInEnabled = true;
      (chart as any).transitionInMode = 'SweepFromCategoryAxisMinimum';
      (chart as any).transitionInDuration = 1500;

      // Dark palette styling with crisp white Panamax AI curve
      chart.brushes = ['#ffffff', '#22c55e'];
      chart.outlines = ['#ffffff', '#22c55e'];
      (chart as any).yAxisMajorStroke = '#27272a';
      (chart as any).xAxisMajorStroke = '#27272a';

      // Axis mode
      if (yAxisMode === 'PercentChange') {
        chart.yAxisMode = FinancialChartYAxisMode.PercentChange;
        chart.yAxisTitle = 'Percent Changed (%)';
      } else if (yAxisMode === 'BPI_Points') {
        chart.yAxisMode = FinancialChartYAxisMode.Numeric;
        chart.yAxisTitle = 'Baltic Panamax Index (Points)';
      } else {
        chart.yAxisMode = FinancialChartYAxisMode.Numeric;
        chart.yAxisTitle = 'Freight Rate ($/MT)';
      }

      // Bind data sources
      chart.dataSource = [panamaxData, benchmarkData];

      // Replay transition animation smoothly on mount / view switch
      if (typeof (chart as any).replayTransitionIn === 'function') {
        (chart as any).replayTransitionIn();
      }
    } catch (err) {
      console.error('Failed to configure IgcFinancialChartComponent:', err);
    }
  }, [mounted, panamaxData, benchmarkData, title, subtitle, yAxisMode]);

  const isBpi = yAxisMode === 'BPI_Points';

  return (
    <div className="relative w-full rounded-2xl bg-zinc-950 border border-white/10 p-3 sm:p-5 overflow-hidden shadow-2xl">
      {/* Dynamic Endpoint Badges overlaying the top right matching reference screenshot */}
      <div className="flex flex-wrap items-center justify-end gap-2.5 mb-2 font-mono text-xs">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-900/90 border border-white/20 text-white font-semibold shadow-lg backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
          <span className="text-zinc-300">Panamax AI:</span>
          <strong className="text-white">
            {isBpi ? `${targetBpiPoints.toLocaleString()} pts` : `$${Number(currentPanamaxRate).toFixed(2)}/MT`}
          </strong>
          <span className="text-zinc-400">
            ({percentChangePanamax >= 0 ? `+${percentChangePanamax}%` : `${percentChangePanamax}%`})
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-semibold shadow-lg backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span>Spot Benchmark:</span>
          <strong className="text-white">
            {isBpi ? `${currentBpiPoints.toLocaleString()} pts` : `$${Number(currentBenchmarkRate).toFixed(2)}/MT`}
          </strong>
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
          is-transition-in-enabled="true"
          transition-in-mode="SweepFromCategoryAxisMinimum"
          transition-in-duration="1500"
        />
      </div>
    </div>
  );
}
