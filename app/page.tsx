"use client";

import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

export default function LandingPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "#0d0d0d",
        color: "#fff",
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.032) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.032) 1px, transparent 1px)
        `,
        backgroundSize: "44px 44px",
      }}
    >
      {/* Radial fade at center — softens the grid */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 42%, rgba(13,13,13,0) 0%, rgba(13,13,13,0.72) 100%)",
          zIndex: 0,
        }}
      />
      {/* Top fade */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-40"
        style={{
          background: "linear-gradient(to bottom, #0d0d0d 0%, transparent 100%)",
          zIndex: 0,
        }}
      />
      {/* Bottom fade */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 h-40"
        style={{
          background: "linear-gradient(to top, #0d0d0d 0%, transparent 100%)",
          zIndex: 0,
        }}
      />

      {/* Nav */}
      <nav
        className="relative flex items-center justify-between px-8 py-5 max-w-5xl mx-auto w-full"
        style={{ zIndex: 10 }}
      >
        <div className="flex items-center gap-2.5">
          <div className="size-7 bg-white rounded-md overflow-hidden">
            <Image
              src="/applogo.png"
              alt="Alpatrix"
              width={28}
              height={28}
              className="object-cover"
            />
          </div>
          <span className="text-[17px] font-semibold tracking-tight">Alpatrix</span>
        </div>

        <div className="flex items-center gap-5">
          <span
            className="text-[13px] hidden sm:block"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            Built on Solana
          </span>
          <Link
            href="/auth"
            className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium rounded-sm transition-all"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.09)",
              color: "rgba(255,255,255,0.7)",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.1)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.06)")
            }
          >
            Sign in
          </Link>
        </div>
      </nav>

      {/* Hero — full height centre */}
      <section
        className="relative flex flex-col items-center justify-center text-center gap-7 flex-1 px-6"
        style={{ zIndex: 10, minHeight: "calc(100vh - 72px)" }}
      >
        {/* Purple glow blob behind headline */}
        <div
          className="pointer-events-none absolute"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -54%)",
            width: 520,
            height: 320,
            background:
              "radial-gradient(ellipse at center, rgba(123,110,244,0.13) 0%, transparent 70%)",
            filter: "blur(0px)",
          }}
        />

        {/* Live pill */}
        <div
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full"
          style={{
            border: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.03)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse"
            style={{
              background: "#34d399",
              boxShadow: "0 0 6px rgba(52,211,153,0.6)",
            }}
          />
          <span
            className="text-[12px] tracking-wide"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Live on Polymarket · Bayes Market
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-[58px] sm:text-[72px] font-bold leading-[1.04] tracking-tight"
          style={{ letterSpacing: "-0.03em" }}
        >
          The execution layer
          <br />
          for{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #a78bfa 0%, #7B6EF4 50%, #6366f1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            prediction markets.
          </span>
        </h1>

        {/* Subtext */}
        <p
          className="text-[16px] sm:text-[17px] leading-relaxed max-w-sm"
          style={{ color: "rgba(255,255,255,0.32)" }}
        >
          Aggregate, compare, and execute across every venue — with limit orders and
          best-price routing, all non-custodial.
        </p>

        {/* CTA row */}
        <div className="flex items-center gap-3 pt-1">
          <Link
            href="/auth"
            className="flex items-center gap-2 px-6 py-3 text-[14px] font-semibold rounded-sm transition-all"
            style={{ background: "#7B6EF4", color: "#fff" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "#6d62e0")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "#7B6EF4")
            }
          >
            Get started
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} color="#fff" strokeWidth={2} />
          </Link>
          <a
            href="#"
            className="px-6 py-3 text-[14px] font-medium rounded-sm transition-all"
            style={{
              color: "rgba(255,255,255,0.35)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)")
            }
          >
            Read docs
          </a>
        </div>

        {/* Venue row */}
        <div
          className="flex items-center gap-6 mt-4"
          style={{ color: "rgba(255,255,255,0.18)", fontSize: 12 }}
        >
          <VenuePill name="Polymarket" state="live" />
          <span style={{ width: 1, height: 14, background: "rgba(255,255,255,0.07)", display: "block" }} />
          <VenuePill name="Bayes Market" state="live" />
        </div>
      </section>

      {/* Footer — anchored at bottom */}
      <footer
        className="relative flex items-center justify-between px-8 py-5 max-w-5xl mx-auto w-full"
        style={{
          zIndex: 10,
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.14)" }}>
          © 2025 Alpatrix
        </span>
        <div className="flex items-center gap-5">
          {[
            { label: "X",        href: "#" },
            { label: "Discord",  href: "#" },
            { label: "Telegram", href: "#" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] transition-colors"
              style={{ color: "rgba(255,255,255,0.18)" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.18)")
              }
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
    <div className="flex items-center gap-2">
      <span
        style={{
          display: "inline-block",
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: state === "live" ? "#34d399" : "rgba(255,255,255,0.15)",
          boxShadow: state === "live" ? "0 0 5px rgba(52,211,153,0.5)" : "none",
        }}
      />
      <span
        className="text-[12px] font-medium"
        style={{
          color: state === "live" ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.2)",
        }}
      >
        {name}
      </span>
      {state === "soon" && (
        <span
          className="text-[10px] px-1.5 py-0.5 rounded-sm"
          style={{
            color: "rgba(255,255,255,0.22)",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          soon
        </span>
      )}
    </div>
  );
}
