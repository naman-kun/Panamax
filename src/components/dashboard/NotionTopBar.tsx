import React, { useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  ArrowLeft,
  Share2,
  MessageSquare,
  Clock,
  Star,
  MoreHorizontal,
  Lock,
  Globe,
  Copy,
  Check,
  Download,
  FileText,
  Trash2,
  History,
  Sliders,
  Sparkles,
  PanelLeftOpen,
} from 'lucide-react';
import { DashboardPageId } from './NotionSidebar';

export type NotionFontStyle = 'sans' | 'serif' | 'mono';

interface NotionTopBarProps {
  activePage: DashboardPageId;
  pageTitle: string;
  onBackToLanding: () => void;
  fontStyle: NotionFontStyle;
  onChangeFontStyle: (style: NotionFontStyle) => void;
  isSmallText: boolean;
  onToggleSmallText: (val: boolean) => void;
  isFullWidth: boolean;
  onToggleFullWidth: (val: boolean) => void;
  isLocked: boolean;
  onToggleLock: (val: boolean) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function NotionTopBar({
  activePage,
  pageTitle,
  onBackToLanding,
  fontStyle,
  onChangeFontStyle,
  isSmallText,
  onToggleSmallText,
  isFullWidth,
  onToggleFullWidth,
  isLocked,
  onToggleLock,
  sidebarOpen,
  onToggleSidebar,
}: NotionTopBarProps) {
  const [isStarred, setIsStarred] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [shareToWeb, setShareToWeb] = useState(true);
  const [commentsOpen, setCommentsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full h-12 border-b border-white/10 bg-[#191919]/90 backdrop-blur-md flex items-center justify-between px-3 sm:px-4 text-xs select-none">
      
      {/* Left Area: Sidebar Toggle & Breadcrumbs */}
      <div className="flex items-center gap-2.5 min-w-0">
        {!sidebarOpen && (
          <button
            onClick={onToggleSidebar}
            title="Expand Sidebar"
            className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        )}

        <button
          onClick={onBackToLanding}
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors group text-[11px]"
        >
          <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
          <span className="hidden sm:inline">Overview</span>
        </button>

        <div className="h-3.5 w-px bg-white/10 hidden sm:block" />

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" onClick={(e) => { e.preventDefault(); onBackToLanding(); }}>
                Panamax
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" onClick={(e) => e.preventDefault()}>
                Corridors
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="truncate max-w-[140px] sm:max-w-[220px]">
                {pageTitle}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right Area: Notion Top Actions */}
      <div className="flex items-center gap-1 text-zinc-400">
        
        <span className="text-[11px] text-zinc-500 font-normal hidden md:inline px-1">
          Edited just now
        </span>

        {/* Notion Share Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/10 hover:text-white text-xs transition-colors font-medium">
              <span>Share</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3 bg-[#202020] border-white/15 text-xs text-zinc-200 shadow-2xl space-y-3" align="end">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-emerald-400" />
                <div>
                  <div className="font-semibold text-white">Share to Web</div>
                  <div className="text-[10px] text-zinc-400">Publish live SIH forecast report</div>
                </div>
              </div>
              <Switch checked={shareToWeb} onCheckedChange={setShareToWeb} />
            </div>

            {shareToWeb && (
              <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-zinc-900 border border-white/10">
                <input
                  type="text"
                  readOnly
                  value="https://panamax.network/#/dashboard"
                  className="flex-1 bg-transparent text-[11px] text-zinc-300 font-mono px-1 focus:outline-none"
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 text-[10px]"
                  onClick={() => {
                    navigator.clipboard?.writeText('https://panamax.network/#/dashboard');
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 1500);
                  }}
                >
                  {copiedLink ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </Button>
              </div>
            )}

            <div className="text-[10px] text-zinc-500">
              Anyone with the link can view live forecast, port queues, and vessel evaluations.
            </div>
          </PopoverContent>
        </Popover>

        {/* Comments Popover */}
        <Popover open={commentsOpen} onOpenChange={setCommentsOpen}>
          <PopoverTrigger asChild>
            <button title="Page Comments" className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors">
              <MessageSquare className="h-3.5 w-3.5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3 bg-[#202020] border-white/15 text-xs text-zinc-200 shadow-2xl space-y-2" align="end">
            <div className="font-semibold text-white">Page Comments</div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Chartering brokers noted that Paradip coal berth 2 maintenance will reduce handling throughput to 30k TPD through next Tuesday.
            </p>
            <div className="text-[10px] font-mono text-zinc-500 pt-1 border-t border-white/10">
              — Chief Chartering Officer (14:20 IST)
            </div>
          </PopoverContent>
        </Popover>

        {/* Page History Clock */}
        <button
          title="Page History"
          onClick={() => alert('Page revision: Updated 4 minutes ago with latest Baltic spot fixtures.')}
          className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors"
        >
          <History className="h-3.5 w-3.5" />
        </button>

        {/* Favorite / Star Button */}
        <button
          onClick={() => setIsStarred(!isStarred)}
          title={isStarred ? 'Remove from favorites' : 'Add to favorites'}
          className="p-1.5 rounded hover:bg-white/10 transition-colors"
        >
          <Star className={`h-3.5 w-3.5 ${isStarred ? 'text-amber-400 fill-amber-400' : 'text-zinc-400 hover:text-white'}`} />
        </button>

        {/* Notion More Options Menu (...) matching user screenshot 9.25.52 AM */}
        <Popover>
          <PopoverTrigger asChild>
            <button title="Page Options" className="p-1.5 rounded hover:bg-white/10 hover:text-white transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3 bg-[#202020] border-white/15 text-xs text-zinc-200 shadow-2xl space-y-3" align="end">
            
            {/* Style Selector (Default / Serif / Mono) */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono text-zinc-500 font-semibold tracking-wider">
                Typography Style
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'sans', label: 'Default', sample: 'Ag' },
                  { id: 'serif', label: 'Serif', sample: 'Ag', fontClass: 'font-serif' },
                  { id: 'mono', label: 'Mono', sample: 'Ag', fontClass: 'font-mono' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => onChangeFontStyle(st.id as NotionFontStyle)}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      fontStyle === st.id
                        ? 'bg-white/15 border-white text-white font-bold shadow-sm'
                        : 'border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className={`text-base font-semibold ${st.fontClass || 'font-sans'}`}>{st.sample}</div>
                    <div className="text-[10px]">{st.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-white/10" />

            {/* Small text & Full width switches */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span>Small text</span>
                <Switch checked={isSmallText} onCheckedChange={onToggleSmallText} />
              </div>
              <div className="flex items-center justify-between">
                <span>Full width</span>
                <Switch checked={isFullWidth} onCheckedChange={onToggleFullWidth} />
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="h-3 w-3 text-zinc-400" />
                  <span>Lock page</span>
                </span>
                <Switch checked={isLocked} onCheckedChange={onToggleLock} />
              </div>
            </div>

            <div className="h-px bg-white/10" />

            {/* Export options */}
            <div className="space-y-1">
              <button
                onClick={() => alert('Exporting SIH Maritime Decision Sheet as Markdown...')}
                className="w-full flex items-center justify-between p-1.5 rounded hover:bg-white/5 text-zinc-300 hover:text-white transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <Download className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Export</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">PDF, CSV</span>
              </button>
            </div>

          </PopoverContent>
        </Popover>

      </div>

    </header>
  );
}
