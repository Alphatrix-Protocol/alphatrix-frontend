"use client";

import { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Cancel01Icon,
  Tick01Icon,
  Clock01Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons";

type OrderStatus = "pending" | "triggered" | "filled" | "cancelled";
type Side = "YES" | "NO";
type Venue = "polymarket" | "bayes";

interface LimitOrder {
  id:           string;
  market:       string;
  side:         Side;
  limitPrice:   number;
  currentPrice: number;
  size:         number;
  venue:        Venue;
  status:       OrderStatus;
  createdAt:    string;
  filledPct?:   number;
  filledAmt?:   number;
}

const ORDERS: LimitOrder[] = [
  {
    id:           "lo-1",
    market:       "Will the Fed cut rates in June 2025?",
    side:         "YES",
    limitPrice:   0.60,
    currentPrice: 0.67,
    size:         500,
    venue:        "polymarket",
    status:       "pending",
    createdAt:    "2h ago",
  },
  {
    id:           "lo-2",
    market:       "Will Bitcoin exceed $120k before July 2025?",
    side:         "NO",
    limitPrice:   0.50,
    currentPrice: 0.44,
    size:         300,
    venue:        "bayes",
    status:       "triggered",
    createdAt:    "4h ago",
    filledPct:    40,
    filledAmt:    120,
  },
  {
    id:           "lo-3",
    market:       "Will US CPI fall below 3% in Q2 2025?",
    side:         "YES",
    limitPrice:   0.72,
    currentPrice: 0.69,
    size:         200,
    venue:        "polymarket",
    status:       "pending",
    createdAt:    "6h ago",
  },
  {
    id:           "lo-4",
    market:       "Will Ethereum ETF inflows exceed $1B in Q2?",
    side:         "YES",
    limitPrice:   0.45,
    currentPrice: 0.45,
    size:         750,
    venue:        "bayes",
    status:       "filled",
    createdAt:    "1d ago",
  },
  {
    id:           "lo-5",
    market:       "Will UK general election happen before Sep 2025?",
    side:         "NO",
    limitPrice:   0.30,
    currentPrice: 0.38,
    size:         100,
    venue:        "polymarket",
    status:       "cancelled",
    createdAt:    "2d ago",
  },
];

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; border: string; icon: typeof Tick01Icon }> = {
  pending:   { label: "Pending",   color: "rgba(255,255,255,0.45)", bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.1)",  icon: Clock01Icon          },
  triggered: { label: "Triggered", color: "#f59e0b",                bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.2)",  icon: ArrowUpRight01Icon   },
  filled:    { label: "Filled",    color: "#34d399",                bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.15)", icon: Tick01Icon           },
  cancelled: { label: "Cancelled", color: "#f87171",                bg: "rgba(248,113,113,0.08)",border: "rgba(248,113,113,0.15)",icon: Cancel01Icon         },
};

const VENUE_TAG: Record<Venue, { label: string; color: string; bg: string; border: string }> = {
  polymarket: { label: "Poly",  color: "#a78bfa", bg: "rgba(123,110,244,0.1)",  border: "rgba(123,110,244,0.15)" },
  bayes:      { label: "Bayes", color: "rgba(255,255,255,0.4)", bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.1)" },
};

const COLS = "2fr 52px 64px 64px 70px 64px 80px 44px";

const ACTIVE_STATUSES: OrderStatus[] = ["pending", "triggered"];

export default function LimitOrdersPanel() {
  const [filter, setFilter]   = useState<"active" | "all">("active");
  const [hovered, setHovered] = useState<string | null>(null);

  const orders = filter === "active"
    ? ORDERS.filter((o) => ACTIVE_STATUSES.includes(o.status))
    : ORDERS;

  const activeCount = ORDERS.filter((o) => ACTIVE_STATUSES.includes(o.status)).length;

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border:     "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>
            Limit Orders
          </span>
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5"
            style={{
              color:      "#7B6EF4",
              background: "rgba(123,110,244,0.12)",
              border:     "1px solid rgba(123,110,244,0.2)",
            }}
          >
            {activeCount} active
          </span>

          {/* Filter toggle */}
          <div
            className="flex items-center"
            style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
          >
            {(["active", "all"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-2.5 py-[3px] text-[10px] font-medium transition-all capitalize"
                style={{
                  color:      filter === f ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.25)",
                  background: filter === f ? "rgba(255,255,255,0.06)" : "transparent",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <Link
          href="/portfolio"
          className="flex items-center gap-1 transition-all"
          style={{ color: "rgba(255,255,255,0.25)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.25)")}
        >
          <span className="text-[11px]">View all</span>
          <HugeiconsIcon icon={ArrowRight01Icon} size={10} color="currentColor" strokeWidth={2} />
        </Link>
      </div>

      {/* Column labels */}
      <div
        className="grid items-center px-4 py-1.5"
        style={{ gridTemplateColumns: COLS, color: "rgba(255,255,255,0.2)" }}
      >
        {["Market", "Side", "Limit", "Current", "Size", "Venue", "Status", ""].map((col, i) => (
          <span key={i} className="text-[10px] uppercase tracking-widest">{col}</span>
        ))}
      </div>

      {/* Rows */}
      {orders.length === 0 ? (
        <div className="px-4 py-8 text-center">
          <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.2)" }}>
            No active limit orders
          </span>
        </div>
      ) : (
        orders.map((order) => {
          const status  = STATUS_CONFIG[order.status];
          const venue   = VENUE_TAG[order.venue];
          const isHov   = hovered === order.id;
          const atLimit = order.currentPrice <= order.limitPrice;

          return (
            <div
              key={order.id}
              className="grid items-center px-4 py-2.5 transition-all"
              style={{
                gridTemplateColumns: COLS,
                borderTop:  "1px solid rgba(255,255,255,0.04)",
                background: isHov ? "rgba(255,255,255,0.025)" : "transparent",
              }}
              onMouseEnter={() => setHovered(order.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Market */}
              <span
                className="text-[12px] truncate pr-4"
                style={{ color: isHov ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.65)" }}
              >
                {order.market}
              </span>

              {/* Side */}
              <span>
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5"
                  style={{
                    color:      order.side === "YES" ? "#34d399" : "#f87171",
                    background: order.side === "YES" ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
                    border:     `1px solid ${order.side === "YES" ? "rgba(52,211,153,0.15)" : "rgba(248,113,113,0.15)"}`,
                  }}
                >
                  {order.side}
                </span>
              </span>

              {/* Limit price */}
              <span className="text-[12px] font-medium tabular-nums text-white">
                {(order.limitPrice * 100).toFixed(0)}¢
              </span>

              {/* Current price — highlight if at or below limit */}
              <span
                className="text-[12px] tabular-nums"
                style={{ color: atLimit ? "#34d399" : "rgba(255,255,255,0.4)" }}
              >
                {(order.currentPrice * 100).toFixed(0)}¢
              </span>

              {/* Size */}
              <span className="text-[12px] tabular-nums" style={{ color: "rgba(255,255,255,0.5)" }}>
                ${order.size.toLocaleString()}
              </span>

              {/* Venue */}
              <span>
                <span
                  className="text-[10px] font-medium px-1.5 py-0.5"
                  style={{ color: venue.color, background: venue.bg, border: `1px solid ${venue.border}` }}
                >
                  {venue.label}
                </span>
              </span>

              {/* Status */}
              <span className="flex flex-col gap-1">
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 w-fit"
                  style={{ color: status.color, background: status.bg, border: `1px solid ${status.border}` }}
                >
                  <HugeiconsIcon icon={status.icon} size={9} color="currentColor" strokeWidth={2} />
                  {status.label}
                </span>
                {order.status === "triggered" && order.filledPct !== undefined && (
                  <span className="flex flex-col gap-0.5">
                    <div className="w-full h-[3px] overflow-hidden" style={{ background: "rgba(245,158,11,0.15)" }}>
                      <div
                        className="h-full"
                        style={{ width: `${order.filledPct}%`, background: "rgba(245,158,11,0.7)" }}
                      />
                    </div>
                    <span className="text-[9px] tabular-nums" style={{ color: "rgba(255,255,255,0.3)" }}>
                      ${order.filledAmt} of ${order.size} filled
                    </span>
                  </span>
                )}
              </span>

              {/* Cancel action — only for pending */}
              <span className="flex justify-end">
                {order.status === "pending" && (
                  <button
                    className="flex items-center justify-center w-5 h-5 transition-all"
                    style={{
                      color:      isHov ? "rgba(248,113,113,0.7)" : "rgba(255,255,255,0.15)",
                      border:     `1px solid ${isHov ? "rgba(248,113,113,0.25)" : "rgba(255,255,255,0.07)"}`,
                      background: isHov ? "rgba(248,113,113,0.08)" : "transparent",
                    }}
                    title="Cancel order"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={9} color="currentColor" strokeWidth={2} />
                  </button>
                )}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
}
