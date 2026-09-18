import { DashboardPageId } from "@/components/dashboard/NotionSidebar";

export interface DashboardRoute { id: DashboardPageId; hash: string; title: string; icon: string }

export const DASHBOARD_ROUTES: DashboardRoute[] = [
  { id: "pillar-a", hash: "#dashboard/pillar-a", title: "Pillar A: Rate Forecast & COA Arbitrage", icon: "📈" },
  { id: "pillar-b", hash: "#dashboard/pillar-b", title: "Pillar B: Vessel Type Optimizer & Port Constraints", icon: "🚢" },
  { id: "pillar-c", hash: "#dashboard/pillar-c", title: "Pillar C: Post-Discharge Idle Fleet & Cabotage", icon: "🔄" },
  { id: "pillar-d", hash: "#dashboard/pillar-d", title: "Pillar D: Risk Sentinel & Congestion Index", icon: "🛡️" },
  { id: "tradingview", hash: "#dashboard/tradingview", title: "TradingView Terminal (Live Model Chart)", icon: "📊" },
  { id: "fixtures", hash: "#dashboard/fixtures", title: "Commercial Fixtures Database", icon: "📋" },
  { id: "ai-sandbox", hash: "#dashboard/ai-sandbox", title: "AI Sandbox (Agent Executive Report)", icon: "✨" },
];

export function routeIdFromHash(hash: string): DashboardPageId {
  const found = DASHBOARD_ROUTES.find((r) => r.hash === hash);
  if (found) return found.id;
  if (hash.startsWith("#dashboard/")) {
    const slug = hash.replace("#dashboard/", "");
    const byId = DASHBOARD_ROUTES.find((r) => r.id === slug);
    if (byId) return byId.id;
  }
  return "pillar-a";
}

export function hashForRoute(id: DashboardPageId): string {
  return DASHBOARD_ROUTES.find((r) => r.id === id)?.hash ?? "#dashboard/pillar-a";
}
