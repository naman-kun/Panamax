import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  Search,
  Clock,
  Settings,
  Plus,
  ChevronsUpDown,
  ChevronRight,
  TrendingUp,
  Ship,
  RotateCw,
  ShieldCheck,
  BarChart2,
  Table as TableIcon,
  Sparkles,
  Users,
  FileText,
  Download,
  Trash2,
  PanelLeftClose,
  PanelLeftOpen,
  Inbox,
  Archive,
  CheckCheck,
  Check,
  Bell,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

export type DashboardPageId =
  | 'pillar-a'
  | 'pillar-b'
  | 'pillar-c'
  | 'pillar-d'
  | 'tradingview'
  | 'fixtures'
  | 'ai-sandbox';

interface NotionSidebarProps {
  activePage: DashboardPageId;
  onSelectPage: (pageId: DashboardPageId) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export function NotionSidebar({
  activePage,
  onSelectPage,
  isOpen,
  onToggleOpen,
}: NotionSidebarProps) {
  const [updatesOpen, setUpdatesOpen] = useState(false);
  const [updatesTab, setUpdatesTab] = useState<'inbox' | 'archived' | 'all'>('inbox');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [workspaceSwitcherOpen, setWorkspaceSwitcherOpen] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState('Panamax Chartering Desk');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const notifications = [
    {
      id: '1',
      title: 'Trough Window Detected',
      time: '12m ago',
      desc: 'Optimal 3-Voyage COA fixture entry projected on Taboneo → Paradip in 18 days.',
      read: false,
    },
    {
      id: '2',
      title: 'Monsoon Wave Warning',
      time: '1h ago',
      desc: 'Significant wave height >3.8m in Bay of Bengal. Potential 2-day discharge delay at Gangavaram.',
      read: false,
    },
    {
      id: '3',
      title: 'Bunker Hedging Opportunity',
      time: '3h ago',
      desc: 'Singapore VLSFO dip to $585/MT triggers recommended 30-day bunker swap contract.',
      read: true,
    },
  ];

  if (!isOpen) {
    return (
      <button
        onClick={onToggleOpen}
        title="Open Sidebar"
        className="fixed top-4 left-4 z-50 flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-white/15 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all shadow-xl"
      >
        <PanelLeftOpen className="h-4 w-4" />
      </button>
    );
  }

  return (
    <>
      <aside className="w-64 h-screen bg-[#191919] border-r border-white/10 flex flex-col justify-between select-none text-zinc-300 text-xs shrink-0 font-sans z-40">
        
        {/* Top Workspace Header */}
        <div className="p-3 space-y-2">
          
          {/* Workspace Switcher Popover */}
          <Popover open={workspaceSwitcherOpen} onOpenChange={setWorkspaceSwitcherOpen}>
            <PopoverTrigger asChild>
              <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group">
                <div className="flex items-center gap-2.5 truncate">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-black font-bold text-xs shadow-sm">
                    P
                  </div>
                  <div className="truncate text-left">
                    <div className="font-semibold text-white truncate leading-tight">
                      {activeWorkspace}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      SIH 2026 Enterprise
                    </div>
                  </div>
                </div>
                <ChevronsUpDown className="h-3.5 w-3.5 text-zinc-500 group-hover:text-zinc-300 shrink-0" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2 bg-[#202020] border-white/15 text-xs text-zinc-200 shadow-2xl" align="start">
              <div className="text-[10px] uppercase font-mono text-zinc-500 px-2 py-1">
                Select Workspace
              </div>
              <div className="space-y-1 mt-1">
                {[
                  { name: 'Panamax Chartering Desk', type: 'Primary Chartering' },
                  { name: 'East Coast Procurement Team', type: 'Bulk Import Ops' },
                  { name: 'SIH Hackathon 2026 Sandbox', type: 'Predictive Lab' },
                ].map((ws) => (
                  <button
                    key={ws.name}
                    onClick={() => {
                      setActiveWorkspace(ws.name);
                      setWorkspaceSwitcherOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                      activeWorkspace === ws.name
                        ? 'bg-white/10 text-white font-medium'
                        : 'hover:bg-white/5 text-zinc-300'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{ws.name}</div>
                      <div className="text-[10px] text-zinc-500">{ws.type}</div>
                    </div>
                    {activeWorkspace === ws.name && <Check className="h-3.5 w-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Quick Utility Items (Search, Updates, Settings) */}
          <div className="space-y-0.5 pt-1">
            
            {/* Quick Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5" />
                <span>Search</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-600 bg-white/5 px-1.5 py-0.5 rounded border border-white/10 group-hover:text-zinc-400">
                ⌘K
              </span>
            </button>

            {/* Notion Updates Popover (Exact match to user screenshot 9.26.16 AM) */}
            <Popover open={updatesOpen} onOpenChange={setUpdatesOpen}>
              <PopoverTrigger asChild>
                <button className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Updates</span>
                  </div>
                  <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 bg-[#202020] border-white/15 text-xs text-zinc-200 shadow-2xl overflow-hidden" align="start">
                
                {/* Updates Tabs: Inbox / Archived / All */}
                <div className="flex items-center border-b border-white/10 px-3 pt-2 gap-4 bg-[#1e1e1e]">
                  {(['inbox', 'archived', 'all'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setUpdatesTab(t)}
                      className={`pb-2 text-xs capitalize transition-colors font-medium border-b-2 ${
                        updatesTab === t
                          ? 'border-white text-white'
                          : 'border-transparent text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Notification List */}
                <div className="p-2 space-y-1.5 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2 rounded-lg bg-zinc-900/50 border border-white/5 hover:border-white/15 transition-all text-left"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-white text-[11px]">{n.title}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">{n.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="p-2 border-t border-white/10 bg-zinc-950/50 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>3 unread alerts</span>
                  <button className="text-white hover:underline">Mark all read</button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Settings & Members Dialog Trigger */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Settings className="h-3.5 w-3.5" />
                <span>Settings & members</span>
              </div>
            </button>

          </div>

          <div className="h-px bg-white/10 my-2" />

          {/* Section: SIH PROBLEM WORKSPACES */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 px-2 py-1 font-semibold">
              SIH Problem Statements
            </div>

            {[
              { id: 'pillar-a', icon: TrendingUp, label: 'Pillar A: Rate Forecast & COA', badge: 'Core' },
              { id: 'pillar-b', icon: Ship, label: 'Pillar B: Vessel Optimizer', badge: '4 Fleet' },
              { id: 'pillar-c', icon: RotateCw, label: 'Pillar C: Idle Fleet Intel', badge: 'Cabotage' },
              { id: 'pillar-d', icon: ShieldCheck, label: 'Pillar D: Risk Sentinel', badge: 'Queues' },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectPage(item.id as DashboardPageId)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all ${
                    isActive
                      ? 'bg-white/10 text-white font-medium border border-white/10 shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-white/5">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Section: ADVANCED TERMINALS */}
          <div className="space-y-1 pt-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 px-2 py-1 font-semibold">
              Terminals & Data
            </div>

            {[
              { id: 'tradingview', icon: BarChart2, label: 'TradingView Terminal', highlight: true },
              { id: 'fixtures', icon: TableIcon, label: 'Fixture Database' },
              { id: 'ai-sandbox', icon: Sparkles, label: 'Notion AI Sandbox' },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectPage(item.id as DashboardPageId)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all ${
                    isActive
                      ? 'bg-white/10 text-white font-medium border border-white/10 shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.highlight && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-950/80 text-blue-300 border border-blue-500/30">
                      LIVE
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Section: WORKSPACE TOOLS */}
          <div className="space-y-0.5 pt-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 px-2 py-1 font-semibold">
              Tools
            </div>
            <button
              onClick={() => alert('Teamspace creation: Add chartering brokers and cargo superintendents.')}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Users className="h-3.5 w-3.5" />
              <span>Create a teamspace</span>
            </button>
            <button
              onClick={() => alert('Template Gallery: 3-Voyage COA Term Sheet, Demurrage Calculation Notice, Laytime Statement.')}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Templates</span>
            </button>
            <button
              onClick={() => alert('Import: Upload Baltic Dry index historical CSV or fixture fixtures.')}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Import</span>
            </button>
            <button
              onClick={() => alert('Trash: No archived fixtures in the recycling bin.')}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Trash</span>
            </button>
          </div>

        </div>

        {/* Bottom Bar (+ New Page & Collapse Button) */}
        <div className="p-3 border-t border-white/10 flex items-center justify-between text-zinc-400">
          <button
            onClick={() => onSelectPage('fixtures')}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:text-white hover:bg-white/5 transition-colors text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New page</span>
          </button>

          <button
            onClick={onToggleOpen}
            title="Collapse Sidebar (<<)"
            className="p-1.5 rounded-md hover:text-white hover:bg-white/5 transition-colors"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>

      </aside>

      {/* Quick Search Dialog (⌘K) */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-lg p-0 bg-[#202020] border-white/15 text-zinc-200 overflow-hidden shadow-2xl">
          <div className="flex items-center border-b border-white/10 px-3 py-2.5 gap-2">
            <Search className="h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search corridors, vessels, fixtures, or metrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-white placeholder:text-zinc-500 text-sm focus:outline-none"
              autoFocus
            />
          </div>
          <div className="p-2 space-y-1 max-h-64 overflow-y-auto text-xs">
            <div className="text-[10px] uppercase font-mono text-zinc-500 px-2 py-1">Quick Navigation</div>
            {[
              { id: 'pillar-a', title: 'Pillar A: Rate Forecast & COA Arbitrage' },
              { id: 'pillar-b', title: 'Pillar B: Vessel Type Optimizer & Port Limits' },
              { id: 'pillar-c', title: 'Pillar C: Idle Fleet & Coastal Cabotage' },
              { id: 'pillar-d', title: 'Pillar D: Risk Sentinel & Congestion Index' },
              { id: 'tradingview', title: 'TradingView Terminal (Infragistics Chart)' },
              { id: 'fixtures', title: 'Commercial Fixtures Database (Table View)' },
            ]
              .filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectPage(item.id as DashboardPageId);
                    setSearchOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white text-left transition-colors"
                >
                  <span>{item.title}</span>
                  <ArrowRight className="h-3 w-3 text-zinc-500" />
                </button>
              ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Notion Workspace Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-xl p-6 bg-[#202020] border-white/15 text-zinc-200 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">Workspace Settings</DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Manage your Panamax chartering organization, team members, and telemetry integrations.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2 text-xs">
            <div className="p-3 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Workspace Domain</div>
                <div className="text-zinc-500 text-[11px]">panamax-freight.sih2026.gov.in</div>
              </div>
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 font-mono">
                Active Tier
              </Badge>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900 border border-white/10 space-y-2">
              <div className="font-semibold text-white">Port Telemetry Feeds</div>
              <div className="text-[11px] text-zinc-400 leading-relaxed">
                Connected: Paradip, Visakhapatnam, Gangavaram, Dhamra, Gopalpur, Haldia, Sagar-Sandheads.
              </div>
            </div>

            <Button
              className="w-full bg-white hover:bg-zinc-200 text-black font-semibold"
              onClick={() => setSettingsOpen(false)}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
