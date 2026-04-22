"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Robot01Icon,
  AiBrain01Icon,
  Add01Icon,
  ArrowRight01Icon,
  Search01Icon,
  Notification01Icon,
  FlashIcon,
  SecurityCheckIcon,
  Target01Icon,
  Analytics01Icon,
  TimeScheduleIcon,
  SparklesIcon,
  MagicWand01Icon,
  ChartLineData01Icon,
  ZapIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

const CAPABILITIES = [
  {
    icon: ChartLineData01Icon,
    color: "#7B6EF4",
    title: "Market Scanning",
    description: "Continuously monitors thousands of markets across Polymarket, Kalshi, and Bayse for opportunities matching your criteria.",
  },
  {
    icon: ZapIcon,
    color: "#f59e0b",
    title: "Autonomous Trading",
    description: "Executes trades on your behalf when Alpha detects a high-confidence edge — within your set risk limits.",
  },
  {
    icon: Target01Icon,
    color: "#34d399",
    title: "Strategy Targeting",
    description: "Define categories, odds ranges, volume thresholds, and platform preferences. Alpha only acts within your rules.",
  },
  {
    icon: SecurityCheckIcon,
    color: "#60a5fa",
    title: "Risk Controls",
    description: "Set max position size, daily spend limits, and stop-loss triggers. You stay in control, always.",
  },
  {
    icon: TimeScheduleIcon,
    color: "#f87171",
    title: "Scheduled Activity",
    description: "Run your agent 24/7 or set active hours. Pause, resume, or kill it at any time instantly.",
  },
  {
    icon: Analytics01Icon,
    color: "#a78bfa",
    title: "Full Audit Trail",
    description: "Every action is logged with reasoning. Review what Alpha did, why, and what the outcome was.",
  },
];

const HOW_IT_WORKS = [
  { step: "01", label: "Define your strategy", desc: "Set your categories, risk budget, odds range, and which platforms to trade on." },
  { step: "02", label: "Alpha scans 24/7",     desc: "The agent monitors live markets and cross-platform odds in real time." },
  { step: "03", label: "Edge detected",         desc: "When a qualifying opportunity appears, Alpha evaluates it against your rules." },
  { step: "04", label: "Trade executed",         desc: "If confidence is high enough, the agent places the trade and logs everything." },
];

export default function AlphaAgentPage() {
  const [hover, setHover] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-8 pt-6">
        <div className="flex flex-col gap-0.5">
          <span className="text-lg font-semibold text-white">Alpha Agent</span>
          <span className="text-[14px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            Autonomous trading — let Alpha act on edges for you.
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

      {/* ── Empty state hero ── */}
      <div className="flex flex-col items-center justify-center px-8 pt-16 pb-12 gap-8">

        {/* Animated agent icon */}
        <div className="relative flex items-center justify-center">
          {/* Outer pulse rings */}
          <div
            className="absolute rounded-full"
            style={{
              width: 140, height: 140,
              background: "radial-gradient(circle, rgba(123,110,244,0.06) 0%, transparent 70%)",
              border: "1px solid rgba(123,110,244,0.08)",
              animation: "ping 3s ease-in-out infinite",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 110, height: 110,
              background: "radial-gradient(circle, rgba(123,110,244,0.08) 0%, transparent 70%)",
              border: "1px solid rgba(123,110,244,0.12)",
              animation: "ping 3s ease-in-out infinite 0.5s",
            }}
          />
          {/* Core icon box */}
          <div
            className="relative flex items-center justify-center z-10"
            style={{
              width: 76, height: 76,
              background: "linear-gradient(135deg, rgba(123,110,244,0.2), rgba(123,110,244,0.06))",
              border: "1px solid rgba(123,110,244,0.3)",
            }}
          >
            {/* Corner cuts */}
            <div className="absolute top-0 left-0 w-2 h-2" style={{ background: "#161616" }} />
            <div className="absolute bottom-0 right-0 w-2 h-2" style={{ background: "#161616" }} />
            <HugeiconsIcon icon={Robot01Icon} size={32} color="#7B6EF4" strokeWidth={1.5} />
          </div>
        </div>

        {/* Copy */}
        <div className="flex flex-col items-center gap-3 text-center max-w-lg">
          <div
            className="flex items-center gap-1.5 px-3 py-1"
            style={{ border: "1px solid rgba(123,110,244,0.2)", background: "rgba(123,110,244,0.07)" }}
          >
            <HugeiconsIcon icon={SparklesIcon} size={10} color="#7B6EF4" strokeWidth={1.5} />
            <span className="text-[10px] font-medium" style={{ color: "rgba(123,110,244,0.9)" }}>No agents running</span>
          </div>
          <h2 className="text-[26px] font-bold text-white leading-tight">
            Your first agent is one<br />click away
          </h2>
          <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
            Alpha Agent watches markets around the clock, detects edges, and executes trades — all within the rules you define. Set it up once, let it run.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex items-center gap-3">
          <button
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className="flex items-center gap-2 px-6 py-3 text-[13px] font-semibold transition-all"
            style={{
              background: hover
                ? "linear-gradient(135deg, rgba(123,110,244,0.95), rgba(123,110,244,0.75))"
                : "linear-gradient(135deg, rgba(123,110,244,0.85), rgba(123,110,244,0.65))",
              color: "#0a0a0a",
              clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 9px), calc(100% - 9px) 100%, 0 100%)",
            }}
          >
            <HugeiconsIcon icon={Add01Icon} size={13} color="#0a0a0a" strokeWidth={2.5} />
            Create Agent
          </button>
          <button
            className="flex items-center gap-2 px-5 py-3 text-[13px] font-medium transition-all"
            style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.03)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)";
            }}
          >
            <HugeiconsIcon icon={AiBrain01Icon} size={12} color="rgba(255,255,255,0.4)" strokeWidth={1.5} />
            Learn how it works
            <HugeiconsIcon icon={ArrowRight01Icon} size={10} color="rgba(255,255,255,0.3)" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="mx-8 mb-10" style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

      {/* ── Capabilities grid ── */}
      <div className="flex flex-col gap-5 px-8 pb-12">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={MagicWand01Icon} size={13} color="rgba(255,255,255,0.25)" strokeWidth={1.5} />
          <span className="text-[13px] font-semibold text-white">What your agent can do</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {CAPABILITIES.map((cap) => (
            <div
              key={cap.title}
              className="flex flex-col gap-3 p-4 transition-all"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.035)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
              }}
            >
              <div
                className="flex items-center justify-center w-8 h-8 shrink-0"
                style={{ background: `${cap.color}12`, border: `1px solid ${cap.color}25` }}
              >
                <HugeiconsIcon icon={cap.icon} size={15} color={cap.color} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-semibold text-white">{cap.title}</span>
                <span className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>{cap.description}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── How it works ── */}
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={FlashIcon} size={13} color="rgba(255,255,255,0.25)" strokeWidth={1.5} />
            <span className="text-[13px] font-semibold text-white">How it works</span>
          </div>

          <div className="grid grid-cols-4 gap-0" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div
                key={step.step}
                className="flex flex-col gap-3 p-5"
                style={{ borderRight: i < HOW_IT_WORKS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[11px] font-bold tabular-nums"
                    style={{ color: "rgba(123,110,244,0.5)" }}
                  >
                    {step.step}
                  </span>
                  {i < HOW_IT_WORKS.length - 1 && (
                    <HugeiconsIcon icon={ArrowRight01Icon} size={10} color="rgba(255,255,255,0.1)" strokeWidth={1.5} />
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] font-semibold text-white">{step.label}</span>
                  <span className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.3)" }}>{step.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA strip ── */}
        <div
          className="flex items-center justify-between px-6 py-5 mt-2"
          style={{ background: "rgba(123,110,244,0.05)", border: "1px solid rgba(123,110,244,0.14)" }}
        >
          <div className="flex items-center gap-4">
            <div
              className="flex items-center justify-center shrink-0"
              style={{ width: 40, height: 40, background: "rgba(123,110,244,0.12)", border: "1px solid rgba(123,110,244,0.2)" }}
            >
              <HugeiconsIcon icon={Robot01Icon} size={18} color="#7B6EF4" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] font-semibold text-white">Ready to go autonomous?</span>
              <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                Create your first agent in under 2 minutes. No code needed.
              </span>
            </div>
          </div>
          <Button variant="primary" size="sm" shape="slant" corner="bottom-right" className="shrink-0">
            <HugeiconsIcon icon={Add01Icon} size={10} color="#0a0a0a" strokeWidth={2.5} />
            Create Agent
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes ping {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.08); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
