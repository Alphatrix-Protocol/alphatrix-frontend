"use client";

import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  EyeIcon,
  ViewOffIcon,
  Add01Icon,
  ArrowDownLeft01Icon,
  ArrowUpRight01Icon,
  Notification01Icon,
  ArrowRight01Icon,
  Search01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import TrendingMarkets from "../_components/markets";
import LimitOrdersPanel from "../_components/limit-orders-panel";
import VenueStatus from "../_components/venue-status";
import FundModal from "../_components/fund-modal";
import { useAuthStore } from "@/lib/store/auth";
import { useSolBalance } from "@/lib/hooks/use-sol-balance";

const STATS = [
  { label: "Available",    raw: 8200,  format: (n: number) => `$${n.toLocaleString()}.00`, trend: "+1.92%", up: true,  points: [40,38,42,39,44,41,45,43,47,46,50,52] },
  { label: "In Positions", raw: 4250,  format: (n: number) => `$${n.toLocaleString()}.00`, trend: "+2.4%",  up: true,  points: [30,32,29,35,33,38,36,40,39,43,42,45] },
  { label: "Win Rate",     raw: 67,    format: (n: number) => `${n}%`,                     trend: "+3%",    up: true,  points: [55,58,54,60,57,63,61,65,64,67,66,67] },
  { label: "Markets",      raw: 23,    format: (n: number) => `${n}`,                       trend: "−2",     up: false, points: [28,26,30,25,27,23,26,22,24,21,23,20] },
];

function useCountUp(target: number, duration = 650, delay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf: number;
    const timer = setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
        setValue(Math.round(eased * target));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(timer); cancelAnimationFrame(raf); };
  }, [target, duration, delay]);
  return value;
}

function AnimatedStat({
  stat,
  index,
}: {
  stat: (typeof STATS)[number];
  index: number;
}) {
  const delay = 60 + index * 90;
  const count = useCountUp(stat.raw, 650, delay);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay - 40);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className="flex flex-col overflow-hidden transition-all"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.055)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.35s ease, transform 0.35s ease",
      }}
    >
      <div className="flex items-start justify-between px-4 pt-4 pb-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>
            {stat.label}
          </span>
          <span className="text-[19px] font-semibold text-white leading-none tracking-tight tabular-nums">
            {stat.format(count)}
          </span>
        </div>
        <span
          className="text-[10px] font-semibold px-1.5 py-0.5 mt-0.5"
          style={{
            color: stat.up ? "#34d399" : "#f87171",
            background: stat.up ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
            border: `1px solid ${stat.up ? "rgba(52,211,153,0.15)" : "rgba(248,113,113,0.15)"}`,
          }}
        >
          {stat.trend}
        </span>
      </div>
      <div className="w-full" style={{ height: 36 }}>
        <Sparkline points={stat.points} up={stat.up} w={300} h={36} />
      </div>
    </div>
  );
}

function Sparkline({ points, up, w = 120, h = 36 }: { points: number[]; up: boolean; w?: number; h?: number }) {
  const min = Math.min(...points), max = Math.max(...points);
  const range = max - min || 1;
  const pad = 2;
  const xs = points.map((_, i) => pad + (i / (points.length - 1)) * (w - pad * 2));
  const ys = points.map((p) => pad + (1 - (p - min) / range) * (h - pad * 2));
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  const fill = `${d} L${xs[xs.length - 1]},${h} L${xs[0]},${h} Z`;
  const color = up ? "#34d399" : "#f87171";
  const fillColor = up ? "rgba(52,211,153,0.07)" : "rgba(248,113,113,0.07)";
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} fill="none" preserveAspectRatio="none">
      <path d={fill} fill={fillColor} />
      <path d={d} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
    </svg>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [showFund,       setShowFund]       = useState(false);

  const { displayName, walletAddress } = useAuthStore();
  const { sol, loading: balLoading, refresh } = useSolBalance(walletAddress);

  return (
    <div className="flex flex-col min-h-screen">
      {showFund && walletAddress && (
        <FundModal address={walletAddress} onClose={() => setShowFund(false)} />
      )}

      {/* Top bar */}
      <div
        className="flex items-center justify-between px-8 pt-6 "
        // style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        {/* Greeting */}
        <div className="flex flex-col gap-0.5">
          <span className="text-lg font-semibold text-white">
            {greeting()}{displayName ? `, ${displayName.split("@")[0]}` : ""}.
          </span>
          <span className="text-[14px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            Markets are open — 14 active positions running.
          </span>
        </div>

        {/* Right: status + ask alpha + notifications */}
        <div className="flex items-center gap-3">

          {/* Ask Alpha command bar */}
          <div
            className="flex items-center gap-2.5 px-3 py-2 transition-all group"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              width: 220,
            }}
          >
            <HugeiconsIcon icon={Search01Icon} size={12} color="rgba(255,255,255,0.25)" strokeWidth={1.5} />
            <span className="text-[11px] flex-1" style={{ color: "rgba(255,255,255,0.25)" }}>
              Ask Alpha anything...
            </span>
            <div
              className="flex items-center justify-center w-4 h-4 shrink-0"
              style={{ background: "rgba(123,110,244,0.15)", border: "1px solid rgba(123,110,244,0.2)" }}
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={9} color="#7B6EF4" strokeWidth={2} />
            </div>
          </div>

          {/* Notification bell */}
          <button
            className="relative flex items-center justify-center w-8 h-8 transition-all"
            style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)")}
          >
            <HugeiconsIcon icon={Notification01Icon} size={14} color="rgba(255,255,255,0.4)" strokeWidth={1.5} />
            {/* unread dot */}
            <span className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-[#7B6EF4]" />
          </button>

        </div>
      </div>

      {/* Venue status bar */}
      <VenueStatus />

      {/* Main content */}
      <div className="flex flex-col gap-4 px-8 py-8">

        {/* Balance section */}
        <div
          className="flex items-start justify-between p-5"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            clipPath: "polygon(14px 0, 100% 0, 100% 100%, 0 100%, 0 14px)",
          }}
        >
          {/* Left: balance */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
                SOL Balance
              </span>
              <button onClick={refresh} className="transition-opacity hover:opacity-60">
                <HugeiconsIcon icon={RefreshIcon} size={11} color="rgba(255,255,255,0.2)" strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              {balanceVisible ? (
                <span className="text-[32px] font-semibold leading-none tracking-tight text-white tabular-nums">
                  {balLoading
                    ? <span className="text-[20px]" style={{ color: "rgba(255,255,255,0.2)" }}>fetching…</span>
                    : sol !== null
                      ? `${sol.toFixed(4)} SOL`
                      : "—"
                  }
                </span>
              ) : (
                <span className="text-[32px] font-semibold leading-none tracking-tight text-white">••••••</span>
              )}
              <button
                onClick={() => setBalanceVisible((v) => !v)}
                className="transition-opacity hover:opacity-70"
              >
                <HugeiconsIcon
                  icon={balanceVisible ? EyeIcon : ViewOffIcon}
                  size={15}
                  color="rgba(255,255,255,0.3)"
                  strokeWidth={1.5}
                />
              </button>
            </div>

            <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.2)" }}>
              Solana Mainnet · embedded wallet
            </span>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2 mt-1">
            <Button variant="primary" size="md" shape="slant" onClick={() => setShowFund(true)}>
              <HugeiconsIcon icon={Add01Icon} size={12} color="white" strokeWidth={2} />
              Add Funds
            </Button>
            <Button variant="ghost" size="md" shape="slant">
              <HugeiconsIcon icon={ArrowDownLeft01Icon} size={12} color="rgba(255,255,255,0.6)" strokeWidth={2} />
              Withdraw
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3">
          {STATS.map((stat, i) => (
            <AnimatedStat key={stat.label} stat={stat} index={i} />
          ))}
        </div>

      </div>

      {/* Limit Orders */}
      <div className="px-8 pb-4">
        <LimitOrdersPanel />
      </div>

      {/* Trending Markets */}
      <div className="px-8 pb-8">
        <TrendingMarkets />
      </div>
    </div>
  );
}
