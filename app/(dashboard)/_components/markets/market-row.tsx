import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon, ArrowDownRight01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import PlatformLogo, { VENUE_DISPLAY_NAMES } from "./platform-logo";
import type { MarketListItem } from "@/lib/api/types";

function fmtVolume(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export default function MarketRow({ market }: { market: MarketListItem }) {
  const yesPrice = market.yesPrice;
  const change   = market.change24h;
  const up       = change !== null && change >= 0;
  const navId    = market.matchGroupId ?? market.id;

  return (
    <div
      className="flex items-center gap-4 px-4 py-3 transition-colors"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
    >
      {/* Venue + title */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <PlatformLogo platform={market.venueId} size={12} />
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
              {VENUE_DISPLAY_NAMES[market.venueId] ?? market.venueId}
            </span>
            <span style={{ color: "rgba(255,255,255,0.12)" }}>·</span>
            <span className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.2)" }}>
              {market.category}
            </span>
          </div>
          <span className="text-[12px] text-white/80 truncate font-medium">{market.title}</span>
        </div>
      </div>

      {/* Price */}
      <span className="text-sm font-bold text-white w-14 text-right shrink-0">
        {yesPrice !== null ? `${yesPrice}¢` : "—"}
      </span>

      {/* Change */}
      <div className="flex items-center gap-1 w-16 justify-end shrink-0">
        {change !== null ? (
          <>
            <HugeiconsIcon
              icon={up ? ArrowUpRight01Icon : ArrowDownRight01Icon}
              size={11}
              strokeWidth={2}
              color={up ? "#34d399" : "#f87171"}
            />
            <span className="text-[11px] font-semibold" style={{ color: up ? "#34d399" : "#f87171" }}>
              {up ? "+" : ""}{change}%
            </span>
          </>
        ) : (
          <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>—</span>
        )}
      </div>

      {/* Volume */}
      <span className="text-[11px] text-white/25 w-16 text-right shrink-0">
        {fmtVolume(market.volume24h)}
      </span>

      {/* Actions */}
      <div className="flex gap-1.5 shrink-0">
        <Link href={`/markets/${navId}`}>
          <Button variant="primary" size="sm" shape="slant">Trade</Button>
        </Link>
        <Link href={`/markets/${navId}`}>
          <Button variant="ghost" size="sm" shape="slant">View</Button>
        </Link>
      </div>
    </div>
  );
}
