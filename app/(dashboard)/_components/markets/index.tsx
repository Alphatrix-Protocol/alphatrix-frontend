"use client";

import { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { GridViewIcon, ListViewIcon, FilterIcon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { View, FILTERS } from "./data";
import MarketCard from "./market-card";
import MarketRow from "./market-row";
import { MarketCardSkeleton, MarketRowSkeleton } from "../market-skeleton";
import { useBackendMarkets } from "@/lib/api/hooks/use-backend-markets";
import type { MarketListItem } from "@/lib/api/types";

const LIMIT = 8;

export default function TrendingMarkets() {
  const [filter, setFilter] = useState("All");
  const [view, setView]     = useState<View>("card");

  const { data, isLoading, isError } = useBackendMarkets({ page: 1, size: LIMIT });
  const markets: MarketListItem[] = data?.data ?? [];
  const filtered = filter === "All"
    ? markets
    : markets.filter((m) => m.category.toLowerCase() === filter.toLowerCase());

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-xl font-semibold text-white">Trending Markets</span>
          <span className="text-[15px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            Best yields across platforms today
          </span>
        </div>
        <div
          className="flex items-center gap-1 p-1"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {(["card", "list"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="flex items-center justify-center w-7 h-7 transition-all"
              style={{
                background: view === v ? "rgba(255,255,255,0.08)" : "transparent",
                color: view === v ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)",
              }}
            >
              <HugeiconsIcon
                icon={v === "card" ? GridViewIcon : ListViewIcon}
                size={13}
                color="currentColor"
                strokeWidth={1.5}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 text-[11px] font-medium transition-all capitalize"
            style={{
              background: filter === f ? "rgba(123,110,244,0.12)" : "transparent",
              color:      filter === f ? "#7B6EF4" : "rgba(255,255,255,0.35)",
              border:     `1px solid ${filter === f ? "rgba(123,110,244,0.25)" : "rgba(255,255,255,0.06)"}`,
            }}
          >
            {f}
          </button>
        ))}
        <div
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5"
          style={{ border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" }}
        >
          <HugeiconsIcon icon={FilterIcon} size={11} color="currentColor" strokeWidth={1.5} />
          <span className="text-[11px]">Filter</span>
        </div>
      </div>

      {isError && (
        <div className="py-6 text-center text-[12px]" style={{ color: "rgba(248,113,113,0.6)" }}>
          Failed to load markets. Please try again.
        </div>
      )}

      {view === "card" ? (
        <div className="grid grid-cols-4 gap-3">
          {isLoading
            ? Array.from({ length: LIMIT }).map((_, i) => <MarketCardSkeleton key={i} />)
            : filtered.map((m) => <MarketCard key={m.id} market={m} />)
          }
        </div>
      ) : (
        <div style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
          <div
            className="flex items-center gap-4 px-4 py-2"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}
          >
            <span className="text-[10px] uppercase tracking-widest text-white/20 flex-1">Market</span>
            <span className="text-[10px] uppercase tracking-widest text-white/20 w-14 text-right">Price</span>
            <span className="text-[10px] uppercase tracking-widest text-white/20 w-16 text-right">24h</span>
            <span className="text-[10px] uppercase tracking-widest text-white/20 w-16 text-right">Volume</span>
            <div className="w-[116px]" />
          </div>
          {isLoading
            ? Array.from({ length: LIMIT }).map((_, i) => <MarketRowSkeleton key={i} />)
            : filtered.map((m) => <MarketRow key={m.id} market={m} />)
          }
        </div>
      )}

      {!isLoading && !isError && (
        <Link
          href="/feeds"
          className="flex items-center gap-1.5 self-start transition-all"
          style={{ color: "rgba(255,255,255,0.3)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)")}
        >
          <span className="text-[12px] font-medium">View more markets</span>
          <HugeiconsIcon icon={ArrowRight01Icon} size={11} color="currentColor" strokeWidth={1.5} />
        </Link>
      )}
    </div>
  );
}
