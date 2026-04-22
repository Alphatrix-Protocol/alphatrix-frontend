"use client";

import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  News01Icon,
  Tick01Icon,
  ArrowUpRight01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

const FEATURES = [
  {
    icon:  News01Icon,
    title: "Unified markets",
    body:  "Polymarket and Bayes Market aggregated into one normalised feed. No platform switching, no fragmented liquidity.",
  },
  {
    icon:  Tick01Icon,
    title: "Limit orders",
    body:  "Set a target price on any market. Orders execute automatically when conditions are met — stored on-chain via Solana.",
  },
  {
    icon:  ArrowUpRight01Icon,
    title: "Best-price execution",
    body:  "The aggregation layer evaluates depth across venues and splits orders to minimise slippage on every fill.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#111111", color: "#fff" }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="size-7 bg-white rounded-md overflow-hidden">
            <Image src="/applogo.png" alt="Alpatrix" width={28} height={28} className="object-cover" />
          </div>
          <span className="text-[17px] font-semibold tracking-tight">Alpatrix</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.3)" }}>Built on Solana</span>
          <Link
            href="/auth"
            className="flex items-center gap-1.5 px-4 py-2 text-[14px] font-medium transition-all"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.11)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)")}
          >
            Sign in
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center gap-7 px-6 pt-20 pb-24 max-w-3xl mx-auto w-full">

        <div
          className="flex items-center gap-2 px-3.5 py-1.5"
          style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: "#34d399", boxShadow: "0 0 5px rgba(52,211,153,0.5)" }}
          />
          <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>
            Live on Polymarket · Bayes Market coming soon
          </span>
        </div>

        <h1 className="text-[56px] font-bold leading-[1.06] tracking-tight">
          The execution layer for<br />
          <span style={{
            background: "linear-gradient(135deg, #a78bfa 0%, #7B6EF4 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            prediction markets.
          </span>
        </h1>

        <p className="text-[17px] leading-relaxed max-w-md" style={{ color: "rgba(255,255,255,0.38)" }}>
          Aggregate liquidity across venues. Execute with limit orders, smart routing,
          and best-price fills — from a single non-custodial interface.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <Link
            href="/auth"
            className="flex items-center gap-2 px-6 py-3 text-[15px] font-semibold transition-all"
            style={{ background: "#7B6EF4", color: "#fff" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#6d62e0")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#7B6EF4")}
          >
            Get started
            <HugeiconsIcon icon={ArrowRight01Icon} size={15} color="#fff" strokeWidth={2} />
          </Link>
          <a
            href="https://docs.alpatrix.xyz"
            className="px-6 py-3 text-[15px] font-medium transition-all"
            style={{ color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)")}
          >
            Read docs
          </a>
        </div>
      </section>

      {/* Stats row */}
      <section
        className="py-10"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center justify-center gap-20 max-w-5xl mx-auto w-full px-8">
          {[
            { value: "2,400+", label: "Markets aggregated" },
            { value: "2",      label: "Venues integrated"  },
            { value: "~3.2%",  label: "Avg fill improvement" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <span className="text-[32px] font-bold tracking-tight">{value}</span>
              <span className="text-[13px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-8 max-w-5xl mx-auto w-full">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="text-[12px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>
              What Alpatrix does
            </span>
            <h2 className="text-[30px] font-bold tracking-tight">
              One interface. Every market.
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="flex flex-col gap-4 p-6"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div
                  className="flex items-center justify-center w-9 h-9"
                  style={{ background: "rgba(123,110,244,0.1)", border: "1px solid rgba(123,110,244,0.18)" }}
                >
                  <HugeiconsIcon icon={f.icon} size={16} color="#7B6EF4" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[16px] font-semibold">{f.title}</span>
                  <span className="text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {f.body}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Venues */}
      <section
        className="py-14 px-8"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex flex-col items-center gap-6 max-w-5xl mx-auto w-full">
          <span className="text-[12px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>
            Integrated venues
          </span>
          <div className="flex items-center gap-8">
            <VenuePill name="Polymarket"   state="live" />
            <div className="w-px h-5" style={{ background: "rgba(255,255,255,0.07)" }} />
            <VenuePill name="Bayes Market" state="soon" />
          </div>
          <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.15)" }}>
            More venues extensible by design
          </span>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-20 px-8">
        <div
          className="flex flex-col items-center gap-6 max-w-xl mx-auto text-center py-14 px-8"
          style={{ background: "rgba(123,110,244,0.06)", border: "1px solid rgba(123,110,244,0.15)" }}
        >
          <h2 className="text-[28px] font-bold tracking-tight">Ready to trade smarter?</h2>
          <p className="text-[15px]" style={{ color: "rgba(255,255,255,0.35)" }}>
            Non-custodial. No sign-up required. Start in seconds.
          </p>
          <Link
            href="/auth"
            className="flex items-center gap-2 px-6 py-3 text-[15px] font-semibold transition-all"
            style={{ background: "#7B6EF4", color: "#fff" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#6d62e0")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#7B6EF4")}
          >
            Launch app
            <HugeiconsIcon icon={ArrowRight01Icon} size={15} color="#fff" strokeWidth={2} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="flex items-center justify-between px-8 py-5 mt-auto max-w-5xl mx-auto w-full"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.18)" }}>© 2025 Alpatrix</span>
        <div className="flex items-center gap-5">
          {[
            { label: "X",        href: "https://x.com/alpatrix"      },
            { label: "Discord",  href: "https://discord.gg/alpatrix" },
            { label: "Telegram", href: "https://t.me/alpatrix"       },
            { label: "GitHub",   href: "https://github.com/alpatrix" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] transition-colors"
              style={{ color: "rgba(255,255,255,0.22)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.22)")}
            >
              {label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}

function VenuePill({ name, state }: { name: string; state: "live" | "soon" }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        style={{
          display:      "inline-block",
          width:        7,
          height:       7,
          borderRadius: "50%",
          background:   state === "live" ? "#34d399" : "rgba(255,255,255,0.18)",
          boxShadow:    state === "live" ? "0 0 6px rgba(52,211,153,0.45)" : "none",
        }}
      />
      <span
        className="text-[15px] font-medium"
        style={{ color: state === "live" ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.25)" }}
      >
        {name}
      </span>
      {state === "soon" && (
        <span
          className="text-[11px] font-medium px-1.5 py-0.5"
          style={{ color: "rgba(255,255,255,0.28)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          soon
        </span>
      )}
    </div>
  );
}
