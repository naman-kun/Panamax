import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Table as TableIcon,
  Kanban,
  Calendar,
  Clock,
  Filter,
  ArrowUpDown,
  Plus,
  Ship,
  Anchor,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

interface FixtureRecord {
  id: string;
  vesselName: string;
  vesselClass: string;
  dwt: number;
  origin: string;
  dischargePort: string;
  parcelMT: number;
  rateUSD: number;
  laycan: string;
  status: 'FIXED' | 'NEGOTIATING' | 'DISCHARGING' | 'BALLASTING';
  demurrageDays: number;
}

const INITIAL_FIXTURES: FixtureRecord[] = [
  {
    id: 'FIX-01',
    vesselName: 'M/V Panamax Pioneer',
    vesselClass: 'Panamax',
    dwt: 75000,
    origin: 'Taboneo Anchorage (ID)',
    dischargePort: 'Paradip Port (OD)',
    parcelMT: 75000,
    rateUSD: 12.54,
    laycan: 'Oct 14 - Oct 20',
    status: 'FIXED',
    demurrageDays: 2.1,
  },
  {
    id: 'FIX-02',
    vesselName: 'M/V Cape Enterprise',
    vesselClass: 'Capesize',
    dwt: 170000,
    origin: 'Gladstone (AU)',
    dischargePort: 'Gangavaram Port (AP)',
    parcelMT: 165000,
    rateUSD: 18.20,
    laycan: 'Nov 02 - Nov 08',
    status: 'NEGOTIATING',
    demurrageDays: 3.5,
  },
  {
    id: 'FIX-03',
    vesselName: 'M/V Supramax Navigator',
    vesselClass: 'Supramax',
    dwt: 58000,
    origin: 'Maputo (MZ)',
    dischargePort: 'Haldia Port (WB)',
    parcelMT: 52000,
    rateUSD: 16.40,
    laycan: 'Oct 28 - Nov 04',
    status: 'FIXED',
    demurrageDays: 1.8,
  },
  {
    id: 'FIX-04',
    vesselName: 'M/V Ocean Sentinel',
    vesselClass: 'Panamax',
    dwt: 76000,
    origin: 'Ust-Luga (RU)',
    dischargePort: 'Visakhapatnam (AP)',
    parcelMT: 74000,
    rateUSD: 41.50,
    laycan: 'Nov 12 - Nov 18',
    status: 'DISCHARGING',
    demurrageDays: 4.0,
  },
  {
    id: 'FIX-05',
    vesselName: 'M/V Coastal Triangulator',
    vesselClass: 'Handysize',
    dwt: 35000,
    origin: 'Paradip (IN Coastal)',
    dischargePort: 'Ennore Port (TN)',
    parcelMT: 33000,
    rateUSD: 6.80,
    laycan: 'Prompt (48 hrs)',
    status: 'BALLASTING',
    demurrageDays: 0.8,
  },
];

export function NotionFixtureDatabase() {
  const [viewMode, setViewMode] = useState<'table' | 'board' | 'timeline'>('table');
  const [fixtures, setFixtures] = useState<FixtureRecord[]>(INITIAL_FIXTURES);
  const [filterText, setFilterText] = useState('');

  const filtered = fixtures.filter(
    (f) =>
      f.vesselName.toLowerCase().includes(filterText.toLowerCase()) ||
      f.origin.toLowerCase().includes(filterText.toLowerCase()) ||
      f.dischargePort.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="w-full space-y-4 text-left">
      
      {/* Database Views Header Bar matching Notion Database */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-2">
        
        {/* View Tabs: Table | Board | Timeline */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'table'
                ? 'bg-white/10 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <TableIcon className="h-3.5 w-3.5" />
            <span>Table View</span>
          </button>

          <button
            onClick={() => setViewMode('board')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'board'
                ? 'bg-white/10 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Kanban className="h-3.5 w-3.5" />
            <span>Board View</span>
          </button>

          <button
            onClick={() => setViewMode('timeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'timeline'
                ? 'bg-white/10 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Timeline</span>
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/10 text-xs">
            <Filter className="h-3 w-3 text-zinc-500" />
            <input
              type="text"
              placeholder="Filter fixtures..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="bg-transparent text-white placeholder:text-zinc-500 focus:outline-none w-32 sm:w-44 text-[11px]"
            />
          </div>

          <Button
            size="sm"
            className="h-7 text-xs bg-white text-black hover:bg-neutral-200 font-semibold"
            onClick={() => {
              const newRec: FixtureRecord = {
                id: `FIX-0${fixtures.length + 1}`,
                vesselName: 'M/V Ocean Trader',
                vesselClass: 'Panamax',
                dwt: 75000,
                origin: 'Hay Point (AU)',
                dischargePort: 'Dhamra Port (OD)',
                parcelMT: 75000,
                rateUSD: 17.50,
                laycan: 'Nov 18 - Nov 25',
                status: 'NEGOTIATING',
                demurrageDays: 2.4,
              };
              setFixtures([...fixtures, newRec]);
            }}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>New Fixture</span>
          </Button>
        </div>

      </div>

      {/* View 1: Notion Table View */}
      {viewMode === 'table' && (
        <div className="rounded-xl border border-white/10 bg-zinc-950 overflow-hidden shadow-lg">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white/10 bg-zinc-900/50">
                <TableHead className="text-zinc-400 text-xs font-mono">Vessel Name</TableHead>
                <TableHead className="text-zinc-400 text-xs font-mono">Fleet Class</TableHead>
                <TableHead className="text-zinc-400 text-xs font-mono">Export Origin</TableHead>
                <TableHead className="text-zinc-400 text-xs font-mono">Discharge Port</TableHead>
                <TableHead className="text-zinc-400 text-xs font-mono">Parcel (MT)</TableHead>
                <TableHead className="text-zinc-400 text-xs font-mono">Fixture Rate</TableHead>
                <TableHead className="text-zinc-400 text-xs font-mono">Laycan Window</TableHead>
                <TableHead className="text-zinc-400 text-xs font-mono">Status</TableHead>
                <TableHead className="text-zinc-400 text-xs font-mono text-right">Demurrage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => (
                <TableRow key={row.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell className="font-semibold text-white text-xs flex items-center gap-2">
                    <Ship className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{row.vesselName}</span>
                  </TableCell>
                  <TableCell className="text-xs text-zinc-300 font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-white/10 text-[11px]">
                      {row.vesselClass}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-zinc-300 truncate max-w-[140px]">{row.origin}</TableCell>
                  <TableCell className="text-xs text-white font-medium">{row.dischargePort}</TableCell>
                  <TableCell className="text-xs text-zinc-300 font-mono">{row.parcelMT.toLocaleString()} MT</TableCell>
                  <TableCell className="text-xs text-emerald-400 font-mono font-bold">${row.rateUSD.toFixed(2)}/MT</TableCell>
                  <TableCell className="text-xs text-zinc-400 font-mono">{row.laycan}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        row.status === 'FIXED'
                          ? 'default'
                          : row.status === 'NEGOTIATING'
                          ? 'outline'
                          : 'secondary'
                      }
                      className="text-[10px] font-mono"
                    >
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-right font-mono">
                    <span className={row.demurrageDays > 3 ? 'text-amber-400 font-bold' : 'text-zinc-400'}>
                      {row.demurrageDays}d
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* View 2: Notion Board View (Kanban) */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(['FIXED', 'NEGOTIATING', 'DISCHARGING', 'BALLASTING'] as const).map((st) => {
            const cards = filtered.filter((f) => f.status === st);

            return (
              <div key={st} className="p-3 rounded-xl bg-zinc-950 border border-white/10 space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-white/5">
                  <span className="text-xs font-mono font-semibold text-zinc-400 tracking-wider">
                    {st}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded">
                    {cards.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      className="p-3 rounded-lg bg-zinc-900/80 border border-white/5 hover:border-white/20 transition-all space-y-2 cursor-pointer shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white text-xs">{card.vesselName}</span>
                        <span className="text-[10px] font-mono text-zinc-500">{card.vesselClass}</span>
                      </div>
                      <div className="text-[11px] text-zinc-400 space-y-0.5">
                        <div>{card.origin} → {card.dischargePort}</div>
                        <div className="text-zinc-500 font-mono">{card.parcelMT.toLocaleString()} MT @ ${card.rateUSD}/MT</div>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] font-mono text-zinc-500">
                        <span>Laycan: {card.laycan}</span>
                        <span className="text-emerald-400 font-semibold">{card.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View 3: Notion Timeline View */}
      {viewMode === 'timeline' && (
        <div className="p-6 rounded-xl bg-zinc-950 border border-white/10 text-xs font-mono text-zinc-300 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-white uppercase tracking-wider">Oct - Nov 2026 Fixture Schedule</span>
            <span className="text-zinc-500">Current Window: 45 Days Forward</span>
          </div>
          <div className="space-y-2">
            {filtered.map((f, i) => (
              <div key={f.id} className="p-2.5 rounded-lg bg-zinc-900/60 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-zinc-500 text-[10px] w-12">{f.id}</span>
                  <span className="font-semibold text-white">{f.vesselName}</span>
                  <span className="text-zinc-400">({f.vesselClass})</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-zinc-400">{f.laycan}</span>
                  <Badge variant="outline" className="text-[10px] font-mono border-white/20 text-white">
                    {f.dischargePort.split(' ')[0]}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
