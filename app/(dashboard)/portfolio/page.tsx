"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Wallet01Icon,
  ArrowUpRight01Icon,
  ArrowDownRight01Icon,
  ArrowDownLeft01Icon,
  ChartLineData01Icon,
  Analytics01Icon,
  CheckmarkCircle01Icon,
  AlertCircleIcon,
  Clock01Icon,
  CoinsIcon,
  PercentIcon,
  Activity01Icon,
  MoneyBag01Icon,
  CashIcon,
  Search01Icon,
  ArrowRight01Icon,
  Notification01Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";
import {
  createChart,
  AreaSeries,
  type IChartApi,
} from "lightweight-charts";
import PlatformLogo from "../_components/markets/platform-logo";

type PositionStatus = "open" | "won" | "lost";
type TxType = "buy" | "sell" | "payout";
type Platform = "polymarket" | "kalshi" | "bayse";

interface PositionLeg {
  id:       string;
  platform: Platform;
  side:     "yes" | "no";
  entry:    number;
  current:  number;
  shares:   number;
  cost:     number;
  value:    number;
  pnl:      number;
  pnlPct:   number;
  status:   PositionStatus;
}

interface PositionGroup {
  id:        string;
  market:    string;
  image:     string;
  category:  string;
  closeDate: string;
  legs:      PositionLeg[];
}

const POSITION_GROUPS: PositionGroup[] = [
  {
    id: "g1", market: "Will the Fed cut rates in Q1 2025?", image: "https://picsum.photos/seed/federal/80/80", category: "Economy", closeDate: "Mar 31",
    legs: [
      { id: "p1a", platform: "polymarket", side: "yes", entry: 62, current: 67, shares: 150, cost: 93,   value: 100.5, pnl: +7.5, pnlPct: +8.06,  status: "open" },
      { id: "p1b", platform: "kalshi",     side: "yes", entry: 60, current: 67, shares: 80,  cost: 48,   value: 53.6,  pnl: +5.6, pnlPct: +11.67, status: "open" },
    ],
  },
  {
    id: "g2", market: "Will Arsenal win the 2025–26 Premier League?", image: "https://picsum.photos/seed/arsenal/80/80", category: "Sports", closeDate: "May 24",
    legs: [
      { id: "p2", platform: "kalshi", side: "yes", entry: 44, current: 48, shares: 200, cost: 88, value: 96, pnl: +8, pnlPct: +9.09, status: "open" },
    ],
  },
  {
    id: "g3", market: "Will Anthropic have the best AI model?", image: "https://picsum.photos/seed/anthropic/80/80", category: "Tech", closeDate: "Mar 17",
    legs: [
      { id: "p3", platform: "polymarket", side: "yes", entry: 68, current: 76, shares: 100, cost: 68, value: 76, pnl: +8, pnlPct: +11.76, status: "won" },
    ],
  },
  {
    id: "g4", market: "Will Google have the best AI model?", image: "https://picsum.photos/seed/google/80/80", category: "Tech", closeDate: "Mar 31",
    legs: [
      { id: "p4", platform: "bayse", side: "yes", entry: 22, current: 16, shares: 120, cost: 26.4, value: 19.2, pnl: -7.2, pnlPct: -27.27, status: "lost" },
    ],
  },
  {
    id: "g5", market: "Will Bitcoin hit $100K by end of March?", image: "https://picsum.photos/seed/bitcoin/80/80", category: "Crypto", closeDate: "Mar 31",
    legs: [
      { id: "p5a", platform: "polymarket", side: "no", entry: 71, current: 66, shares: 80, cost: 56.8, value: 52.8, pnl: -4,   pnlPct: -7.04, status: "open" },
      { id: "p5b", platform: "bayse",      side: "no", entry: 69, current: 66, shares: 50, cost: 34.5, value: 33,   pnl: -1.5, pnlPct: -4.35, status: "open" },
    ],
  },
  {
    id: "g6", market: "Will Tesla stock hit $400 before April?", image: "https://picsum.photos/seed/tesla/80/80", category: "Economy", closeDate: "Mar 28",
    legs: [
      { id: "p6", platform: "kalshi", side: "yes", entry: 38, current: 41, shares: 60, cost: 22.8, value: 24.6, pnl: +1.8, pnlPct: +7.89, status: "open" },
    ],
  },
];

function groupStatus(legs: PositionLeg[]): PositionStatus {
  if (legs.some((l) => l.status === "open")) return "open";
  if (legs.every((l) => l.status === "won")) return "won";
  return "lost";
}

const TRANSACTIONS = [
  { id: "t1", type: "payout" as TxType, market: "Anthropic best AI model", amount: +76,   date: "Mar 17",    platform: "polymarket" as Platform, side: "yes" as const },
  { id: "t2", type: "buy"    as TxType, market: "Bitcoin $100K",            amount: -56.8, date: "Mar 10",    platform: "polymarket" as Platform, side: "no"  as const },
  { id: "t3", type: "buy"    as TxType, market: "Arsenal Premier League",   amount: -88,   date: "Mar 8",     platform: "kalshi"     as Platform, side: "yes" as const },
  { id: "t4", type: "sell"   as TxType, market: "Trump approval rating",    amount: +34.2, date: "Mar 5",     platform: "polymarket" as Platform, side: "no"  as const },
  { id: "t5", type: "buy"    as TxType, market: "Fed rate cut Q1 2025",     amount: -93,   date: "Feb 28",    platform: "polymarket" as Platform, side: "yes" as const },
  { id: "t6", type: "payout" as TxType, market: "Tesla $400 before April",  amount: +48,   date: "Feb 20",    platform: "kalshi"     as Platform, side: "yes" as const },
];

const PORTFOLIO_CURVE = [
  { time: "2024-10-01" as const, value: 4000 },
  { time: "2024-10-20" as const, value: 4180 },
  { time: "2024-11-05" as const, value: 3920 },
  { time: "2024-11-20" as const, value: 4340 },
  { time: "2024-12-01" as const, value: 4600 },
  { time: "2024-12-15" as const, value: 4390 },
  { time: "2025-01-01" as const, value: 4780 },
  { time: "2025-01-18" as const, value: 5120 },
  { time: "2025-02-01" as const, value: 4870 },
  { time: "2025-02-15" as const, value: 5340 },
  { time: "2025-03-01" as const, value: 5690 },
  { time: "2025-03-07" as const, value: 5820 },
];

const PLATFORM_BREAKDOWN: { id: Platform; label: string; color: string; value: number; positions: number; pnl: number }[] = [
  { id: "polymarket", label: "Polymarket", color: "#7B6EF4", value: 229.3, positions: 3, pnl: +11.5  },
  { id: "kalshi",     label: "Kalshi",     color: "#60a5fa", value: 120.6, positions: 2, pnl: +9.8   },
  { id: "bayse",      label: "Bayse",      color: "#34d399", value: 19.2,  positions: 1, pnl: -7.2   },
];

const STATUS_CONFIG: Record<PositionStatus, { label: string; color: string; bg: string; border: string; icon: typeof CheckmarkCircle01Icon }> = {
  open:  { label: "Open", color: "#60a5fa", bg: "rgba(96,165,250,0.08)",  border: "rgba(96,165,250,0.2)",  icon: Clock01Icon           },
  won:   { label: "Won",  color: "#34d399", bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.2)",  icon: CheckmarkCircle01Icon },
  lost:  { label: "Lost", color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.2)", icon: AlertCircleIcon       },
};

const TX_CONFIG: Record<TxType, { label: string; color: string; icon: typeof ArrowUpRight01Icon }> = {
  buy:    { label: "Buy",    color: "#60a5fa", icon: ArrowDownLeft01Icon },
  sell:   { label: "Sell",   color: "#f87171", icon: ArrowUpRight01Icon  },
  payout: { label: "Payout", color: "#34d399", icon: MoneyBag01Icon      },
};

const STATUS_TABS = ["All", "Open", "Won", "Lost"] as const;

// ── Chart ──────────────────────────────────────────────────────────────────────
function PortfolioChart() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const chart = createChart(containerRef.current, {
      layout: { background: { color: "transparent" }, textColor: "rgba(255,255,255,0.25)", fontFamily: "Barlow, sans-serif", fontSize: 10 },
      grid: { vertLines: { color: "rgba(255,255,255,0.03)" }, horzLines: { color: "rgba(255,255,255,0.03)" } },
      crosshair: { vertLine: { color: "rgba(255,255,255,0.08)", labelBackgroundColor: "#252525" }, horzLine: { color: "rgba(255,255,255,0.08)", labelBackgroundColor: "#252525" } },
      rightPriceScale: { borderColor: "rgba(255,255,255,0.04)", scaleMargins: { top: 0.12, bottom: 0.08 } },
      timeScale: { borderColor: "rgba(255,255,255,0.04)", fixLeftEdge: true, fixRightEdge: true },
    });

    const series = chart.addSeries(AreaSeries, {
      lineColor: "#7B6EF4",
      topColor: "rgba(123,110,244,0.22)",
      bottomColor: "rgba(123,110,244,0.01)",
      lineWidth: 2,
      priceFormat: { type: "custom", formatter: (v: number) => `$${v.toLocaleString()}` },
      crosshairMarkerRadius: 5,
      crosshairMarkerBorderColor: "#7B6EF4",
      crosshairMarkerBackgroundColor: "#161616",
      crosshairMarkerBorderWidth: 2,
    });
    series.setData(PORTFOLIO_CURVE);
    chart.timeScale().fitContent();

    const ro = new ResizeObserver(() => {
      if (containerRef.current)
        chart.applyOptions({ width: containerRef.current.clientWidth, height: containerRef.current.clientHeight });
    });
    ro.observe(containerRef.current);
    return () => { ro.disconnect(); chart.remove(); };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}

// ── Sparkline ──────────────────────────────────────────────────────────────────
function Spark({ up }: { up: boolean }) {
  const color = up ? "#34d399" : "#f87171";
  const d = up ? "M0,11 L5,8 L10,9 L15,5 L20,2" : "M0,2 L5,5 L10,4 L15,8 L20,11";
  return (
    <svg width={20} height={13} viewBox="0 0 20 13" fill="none">
      <polyline points={d.replace(/[ML]/g, "").replace(/,/g, " ")} stroke={color} strokeWidth={1.5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ── Set Exit Modal ─────────────────────────────────────────────────────────────
type ExitTarget = { legId: string; market: string; current: number };

function SetExitModal({ market, currentPrice, onClose }: { market: string; currentPrice: number; onClose: () => void }) {
  const [exitPrice, setExitPrice] = useState(String(currentPrice));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="flex flex-col gap-5 p-5 w-[320px]"
        style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-1">
          <span className="text-[14px] font-semibold text-white">Set exit price</span>
          <span className="text-[11px] truncate" style={{ color: "rgba(255,255,255,0.3)" }}>{market}</span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>
            Sell limit price (¢)
          </span>
          <div className="relative">
            <input
              type="number"
              min={1}
              max={99}
              value={exitPrice}
              onChange={(e) => setExitPrice(e.target.value)}
              className="w-full px-3 py-2.5 text-[14px] font-semibold text-white outline-none tabular-nums"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
              onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(123,110,244,0.5)")}
              onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)")}
              placeholder={String(currentPrice)}
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px]"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >¢</span>
          </div>
          {Number(exitPrice) > currentPrice && (
            <span className="text-[10px]" style={{ color: "#34d399" }}>
              Exit above current price — will fill immediately if market is open
            </span>
          )}
          {Number(exitPrice) <= currentPrice && exitPrice !== "" && (
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
              Order will trigger when price reaches {exitPrice}¢
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-[12px] font-medium transition-all"
            style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)", background: "transparent" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 text-[12px] font-semibold transition-all"
            style={{ background: "#7B6EF4", color: "#fff" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#6d62e0")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#7B6EF4")}
          >
            Place sell limit
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function PortfolioPage() {
  const [statusTab, setStatusTab] = useState<typeof STATUS_TABS[number]>("All");
  const [chartRange, setChartRange] = useState("All");
  const [exitTarget, setExitTarget] = useState<ExitTarget | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    () => new Set(POSITION_GROUPS.filter((g) => g.legs.length > 1).map((g) => g.id))
  );

  function toggleGroup(id: string) {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const allLegs = POSITION_GROUPS.flatMap((g) => g.legs);
  const filteredGroups = statusTab === "All"
    ? POSITION_GROUPS
    : POSITION_GROUPS.filter((g) => {
        const gs = groupStatus(g.legs);
        return statusTab === "Open" ? gs === "open" : statusTab === "Won" ? gs === "won" : gs === "lost";
      });

  const totalValue  = allLegs.reduce((s, l) => s + l.value, 0);
  const totalCost   = allLegs.reduce((s, l) => s + l.cost,  0);
  const totalPnl    = totalValue - totalCost;
  const totalPnlPct = (totalPnl / totalCost) * 100;
  const openCount   = POSITION_GROUPS.filter((g) => groupStatus(g.legs) === "open").length;
  const wonCount    = POSITION_GROUPS.filter((g) => groupStatus(g.legs) === "won").length;
  const lostCount   = POSITION_GROUPS.filter((g) => groupStatus(g.legs) === "lost").length;
  const winRate     = Math.round((wonCount / (wonCount + lostCount)) * 100);
  const totalPlatformValue = PLATFORM_BREAKDOWN.reduce((s, p) => s + p.value, 0);

  return (
    <div className="flex flex-col min-h-screen">

      {exitTarget && (
        <SetExitModal
          market={exitTarget.market}
          currentPrice={exitTarget.current}
          onClose={() => setExitTarget(null)}
        />
      )}

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-8 pt-6">
        <div className="flex flex-col gap-0.5">
          <span className="text-lg font-semibold text-white">Portfolio</span>
          <span className="text-[14px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            Track your positions, performance and history.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-3 py-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", width: 220 }}>
            <HugeiconsIcon icon={Search01Icon} size={12} color="rgba(255,255,255,0.25)" strokeWidth={1.5} />
            <span className="text-[11px] flex-1" style={{ color: "rgba(255,255,255,0.25)" }}>Ask Alpha anything...</span>
            <div className="flex items-center justify-center w-4 h-4 shrink-0" style={{ background: "rgba(123,110,244,0.15)", border: "1px solid rgba(123,110,244,0.2)" }}>
              <HugeiconsIcon icon={ArrowRight01Icon} size={9} color="#7B6EF4" strokeWidth={2} />
            </div>
          </div>
          <button
            className="relative flex items-center justify-center w-8 h-8 transition-all"
            style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)")}
          >
            <HugeiconsIcon icon={Notification01Icon} size={14} color="rgba(255,255,255,0.4)" strokeWidth={1.5} />
            <span className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-[#7B6EF4]" />
          </button>
        </div>
      </div>

      {/* ── Two-column body ── */}
      <div className="flex gap-5 px-8 py-6 pb-12 flex-1 min-h-0">

        {/* ── LEFT COLUMN ── */}
        <div className="flex flex-col gap-5 flex-1 min-w-0">

          {/* Chart card */}
          <div style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.012)" }}>
            {/* Chart header — value overlay */}
            <div className="flex items-start justify-between px-5 pt-4 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>Total Portfolio Value</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-[30px] font-bold text-white leading-none">${totalValue.toFixed(2)}</span>
                  <div className="flex items-center gap-1 mb-0.5">
                    <HugeiconsIcon icon={totalPnl >= 0 ? ArrowUpRight01Icon : ArrowDownRight01Icon} size={11} color="#34d399" strokeWidth={2} />
                    <span className="text-[12px] font-semibold" style={{ color: "#34d399" }}>
                      +${totalPnl.toFixed(2)} ({totalPnlPct.toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>All time · {POSITION_GROUPS.length} markets</span>
              </div>
              <div className="flex items-center gap-0.5">
                {["1M", "3M", "All"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setChartRange(r)}
                    className="px-2.5 py-1 text-[10px] font-medium transition-all"
                    style={{
                      color: chartRange === r ? "white" : "rgba(255,255,255,0.3)",
                      background: chartRange === r ? "rgba(255,255,255,0.07)" : "transparent",
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ height: 220 }}>
              <PortfolioChart />
            </div>
          </div>

          {/* Positions */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={CoinsIcon} size={13} color="rgba(255,255,255,0.25)" strokeWidth={1.5} />
                <span className="text-[13px] font-semibold text-white">Positions</span>
                <span className="text-[10px] px-1.5 py-0.5" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  {filteredGroups.length}
                </span>
              </div>
              <div className="flex items-center" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                {STATUS_TABS.map((t, ti) => (
                  <button
                    key={t}
                    onClick={() => setStatusTab(t)}
                    className="px-3 py-1.5 text-[10px] font-medium transition-all flex items-center gap-1.5"
                    style={{
                      color: statusTab === t ? "white" : "rgba(255,255,255,0.3)",
                      background: statusTab === t ? "rgba(255,255,255,0.07)" : "transparent",
                      borderRight: ti < STATUS_TABS.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
                    }}
                  >
                    {t}
                    {t === "Open"  && <span className="text-[9px] px-1 py-px leading-none" style={{ background: "rgba(96,165,250,0.15)",  color: "#60a5fa" }}>{openCount}</span>}
                    {t === "Won"   && <span className="text-[9px] px-1 py-px leading-none" style={{ background: "rgba(52,211,153,0.15)",  color: "#34d399" }}>{wonCount}</span>}
                    {t === "Lost"  && <span className="text-[9px] px-1 py-px leading-none" style={{ background: "rgba(248,113,113,0.15)", color: "#f87171" }}>{lostCount}</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              {filteredGroups.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.2)" }}>No positions</span>
                </div>
              ) : filteredGroups.map((group, gi) => {
                const isMulti    = group.legs.length > 1;
                const isExpanded = expandedGroups.has(group.id);
                const gs         = groupStatus(group.legs);
                const gCfg       = STATUS_CONFIG[gs];
                const gPnl       = group.legs.reduce((s, l) => s + l.pnl, 0);
                const gValue     = group.legs.reduce((s, l) => s + l.value, 0);
                const gUp        = gPnl >= 0;

                return (
                  <div
                    key={group.id}
                    style={{ borderBottom: gi < filteredGroups.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                  >
                    {/* Group header */}
                    <div
                      className="flex items-center gap-3 px-4 py-2.5 transition-colors"
                      style={{ background: "rgba(255,255,255,0.01)" }}
                    >
                      <div className="relative shrink-0 overflow-hidden" style={{ width: 26, height: 26, border: "1px solid rgba(255,255,255,0.07)" }}>
                        <Image src={group.image} alt={group.market} fill className="object-cover" sizes="26px" />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>{group.category} · {group.closeDate}</span>
                        <Link href={`/markets/${group.id}`} className="text-[12px] font-semibold text-white truncate hover:opacity-70 transition-opacity">
                          {group.market}
                        </Link>
                      </div>
                      {isMulti && (
                        <span
                          className="text-[9px] font-semibold px-1.5 py-0.5 shrink-0"
                          style={{ color: "#7B6EF4", background: "rgba(123,110,244,0.1)", border: "1px solid rgba(123,110,244,0.15)" }}
                        >
                          {group.legs.length} venues
                        </span>
                      )}
                      <div className="flex items-center gap-0.5 shrink-0">
                        <HugeiconsIcon icon={gUp ? ArrowUpRight01Icon : ArrowDownRight01Icon} size={9} color={gUp ? "#34d399" : "#f87171"} strokeWidth={2} />
                        <span className="text-[10px] font-semibold tabular-nums" style={{ color: gUp ? "#34d399" : "#f87171" }}>
                          {gUp ? "+" : ""}${gPnl.toFixed(2)}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-white tabular-nums shrink-0">${gValue.toFixed(2)}</span>
                      <div className="inline-flex items-center gap-1 px-1.5 py-0.5 w-fit shrink-0" style={{ background: gCfg.bg, border: `1px solid ${gCfg.border}` }}>
                        <HugeiconsIcon icon={gCfg.icon} size={9} color={gCfg.color} strokeWidth={1.5} />
                        <span className="text-[9px] font-semibold" style={{ color: gCfg.color }}>{gCfg.label}</span>
                      </div>
                      {isMulti && (
                        <button
                          onClick={() => toggleGroup(group.id)}
                          className="flex items-center justify-center w-5 h-5 shrink-0 transition-all"
                          style={{ color: "rgba(255,255,255,0.25)", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
                        >
                          <HugeiconsIcon icon={ArrowDown01Icon} size={10} color="currentColor" strokeWidth={2} />
                        </button>
                      )}
                    </div>

                    {/* Leg rows */}
                    {(!isMulti || isExpanded) && group.legs.map((leg, li) => {
                      const isUp = leg.pnl >= 0;
                      const cfg  = STATUS_CONFIG[leg.status];
                      return (
                        <div
                          key={leg.id}
                          className="grid items-center pr-4 py-2 transition-colors"
                          style={{
                            gridTemplateColumns: "36px 1fr 55px 75px 105px 75px 70px 72px",
                            borderTop: "1px solid rgba(255,255,255,0.03)",
                            background: "transparent",
                          }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.015)")}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                        >
                          {/* indent line */}
                          <div className="flex items-center justify-center h-full">
                            {li === group.legs.length - 1
                              ? <div style={{ width: 1, height: "50%", background: "rgba(255,255,255,0.06)", alignSelf: "flex-start", marginLeft: 18 }} />
                              : <div style={{ width: 1, height: "100%", background: "rgba(255,255,255,0.06)", marginLeft: 18 }} />
                            }
                          </div>
                          {/* venue + side */}
                          <div className="flex items-center gap-1.5 min-w-0">
                            <PlatformLogo platform={leg.platform} size={12} />
                            <span className="text-[10px] font-medium capitalize" style={{ color: "rgba(255,255,255,0.4)" }}>
                              {leg.platform === "bayse" ? "Bayse" : leg.platform.charAt(0).toUpperCase() + leg.platform.slice(1)}
                            </span>
                            <span
                              className="text-[9px] font-bold uppercase px-1 py-px"
                              style={{ color: leg.side === "yes" ? "#34d399" : "#f87171", background: leg.side === "yes" ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)" }}
                            >
                              {leg.side}
                            </span>
                          </div>
                          {/* entry → current */}
                          <span className="text-[10px] tabular-nums" style={{ color: "rgba(255,255,255,0.35)" }}>{leg.entry}¢</span>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-medium text-white tabular-nums">{leg.current}¢</span>
                            <Spark up={isUp} />
                          </div>
                          {/* P&L */}
                          <div className="flex items-center gap-0.5">
                            <HugeiconsIcon icon={isUp ? ArrowUpRight01Icon : ArrowDownRight01Icon} size={8} color={isUp ? "#34d399" : "#f87171"} strokeWidth={2} />
                            <span className="text-[9px] font-semibold tabular-nums" style={{ color: isUp ? "#34d399" : "#f87171" }}>
                              {isUp ? "+" : ""}${leg.pnl.toFixed(2)} ({isUp ? "+" : ""}{leg.pnlPct.toFixed(1)}%)
                            </span>
                          </div>
                          {/* value */}
                          <span className="text-[10px] font-semibold text-white tabular-nums">${leg.value.toFixed(2)}</span>
                          {/* status */}
                          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 w-fit" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                            <HugeiconsIcon icon={cfg.icon} size={8} color={cfg.color} strokeWidth={1.5} />
                            <span className="text-[8px] font-semibold" style={{ color: cfg.color }}>{cfg.label}</span>
                          </div>
                          {/* set exit */}
                          <span>
                            {leg.status === "open" && (
                              <button
                                onClick={() => setExitTarget({ legId: leg.id, market: group.market, current: leg.current })}
                                className="px-2 py-1 text-[9px] font-semibold transition-all"
                                style={{ color: "rgba(248,113,113,0.6)", border: "1px solid rgba(248,113,113,0.15)", background: "rgba(248,113,113,0.05)" }}
                                onMouseEnter={(e) => {
                                  (e.currentTarget as HTMLElement).style.color = "#f87171";
                                  (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.1)";
                                }}
                                onMouseLeave={(e) => {
                                  (e.currentTarget as HTMLElement).style.color = "rgba(248,113,113,0.6)";
                                  (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.05)";
                                }}
                              >
                                Set exit
                              </button>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="flex flex-col gap-4 shrink-0" style={{ width: 280 }}>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Deployed",  value: `$${totalCost.toFixed(0)}`, color: "rgba(255,255,255,0.8)", icon: CashIcon       },
              { label: "Win Rate",  value: `${winRate}%`,               color: "#34d399",               icon: PercentIcon    },
              { label: "Open",      value: `${openCount}`,              color: "#60a5fa",               icon: Activity01Icon },
              { label: "Resolved",  value: `${wonCount + lostCount}`,   color: "rgba(255,255,255,0.5)", icon: ChartLineData01Icon },
            ].map(({ label, value, color, icon }) => (
              <div key={label} className="flex flex-col gap-2 p-3" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>{label}</span>
                  <HugeiconsIcon icon={icon} size={11} color="rgba(255,255,255,0.12)" strokeWidth={1.5} />
                </div>
                <span className="text-[20px] font-bold leading-none" style={{ color }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Platform breakdown */}
          <div className="flex flex-col" style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.012)" }}>
            <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <HugeiconsIcon icon={Wallet01Icon} size={12} color="rgba(255,255,255,0.2)" strokeWidth={1.5} />
              <span className="text-[11px] font-semibold text-white">Assets by Platform</span>
            </div>

            <div className="flex flex-col gap-0 px-4 py-3">
              {/* Stacked bar */}
              <div className="flex h-1.5 w-full overflow-hidden gap-px mb-4">
                {PLATFORM_BREAKDOWN.map((p) => (
                  <div
                    key={p.id}
                    className="h-full transition-all"
                    style={{ width: `${(p.value / totalPlatformValue) * 100}%`, background: p.color }}
                  />
                ))}
              </div>

              {PLATFORM_BREAKDOWN.map((p, i) => {
                const pct = ((p.value / totalPlatformValue) * 100).toFixed(0);
                const isUp = p.pnl >= 0;
                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 py-2.5"
                    style={{ borderBottom: i < PLATFORM_BREAKDOWN.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                  >
                    <PlatformLogo platform={p.id} size={18} />
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-white">{p.label}</span>
                        <span className="text-[12px] font-bold text-white">${p.value.toFixed(0)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
                          <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>{pct}% · {p.positions} position{p.positions > 1 ? "s" : ""}</span>
                        </div>
                        <span className="text-[10px] font-semibold" style={{ color: isUp ? "#34d399" : "#f87171" }}>
                          {isUp ? "+" : ""}${p.pnl.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent transactions */}
          <div className="flex flex-col" style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.012)" }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Analytics01Icon} size={12} color="rgba(255,255,255,0.2)" strokeWidth={1.5} />
                <span className="text-[11px] font-semibold text-white">Transactions</span>
              </div>
              <button className="text-[9px]" style={{ color: "rgba(123,110,244,0.8)" }}>View all</button>
            </div>

            <div className="flex flex-col">
              {TRANSACTIONS.map((tx, i) => {
                const cfg = TX_CONFIG[tx.type];
                const isPos = tx.amount >= 0;
                return (
                  <div
                    key={tx.id}
                    className="flex items-center gap-3 px-4 py-2.5 transition-colors"
                    style={{ borderBottom: i < TRANSACTIONS.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                  >
                    {/* Type icon circle */}
                    <div
                      className="flex items-center justify-center shrink-0"
                      style={{ width: 26, height: 26, background: `${cfg.color}12`, border: `1px solid ${cfg.color}25` }}
                    >
                      <HugeiconsIcon icon={cfg.icon} size={11} color={cfg.color} strokeWidth={1.5} />
                    </div>

                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-white truncate">{tx.market}</span>
                        <span className="text-[11px] font-semibold shrink-0 ml-2" style={{ color: isPos ? "#34d399" : "#f87171" }}>
                          {isPos ? "+" : ""}${Math.abs(tx.amount).toFixed(0)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <PlatformLogo platform={tx.platform} size={10} />
                        <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>{cfg.label} · {tx.date}</span>
                        <span className="text-[9px] font-semibold ml-auto" style={{ color: tx.side === "yes" ? "#34d399" : "#f87171" }}>
                          {tx.side.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
