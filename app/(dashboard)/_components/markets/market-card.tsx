import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon, ArrowDownRight01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import PlatformLogo, { VENUE_DISPLAY_NAMES } from "./platform-logo";
import type { MarketListItem } from "@/lib/api/types";

function fmtVolume(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export default function MarketCard({ market }: { market: MarketListItem }) {
  const yesPrice = market.yesPrice;
  const change   = market.change24h;
  const up       = change !== null && change >= 0;
  const navId    = market.matchGroupId ?? market.id;
  const imgSrc   = market.image ?? market.icon ?? null;

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Header */}
      <div className="flex gap-3 p-3.5 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        {/* Thumbnail */}
        <div
          className="relative shrink-0 overflow-hidden rounded-lg"
          style={{ width: 44, height: 44, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {imgSrc ? (
            <Image src={imgSrc} alt={market.title} fill className="object-cover" sizes="44px" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-[16px] font-bold" style={{ color: "rgba(255,255,255,0.2)" }}>
                {market.category.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between min-w-0 flex-1 gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <PlatformLogo platform={market.venueId} size={14} />
              <span className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
                {VENUE_DISPLAY_NAMES[market.venueId] ?? market.venueId}
              </span>
            </div>
            <span className="text-[10px] shrink-0" style={{ color: "rgba(255,255,255,0.25)" }}>
              {market.category}
            </span>
          </div>
          <p className="text-[13px] font-semibold text-white leading-snug line-clamp-2">
            {market.title}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-3.5">
        {/* Price + change */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-white leading-none">
              {yesPrice !== null ? `${yesPrice}¢` : "—"}
            </span>
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>YES</span>
          </div>

          {change !== null ? (
            <div
              className="flex items-center gap-1 px-2 py-0.5"
              style={{
                background: up ? "rgba(52,211,153,0.08)"   : "rgba(248,113,113,0.08)",
                border:     `1px solid ${up ? "rgba(52,211,153,0.18)" : "rgba(248,113,113,0.18)"}`,
              }}
            >
              <HugeiconsIcon
                icon={up ? ArrowUpRight01Icon : ArrowDownRight01Icon}
                size={10}
                color={up ? "#34d399" : "#f87171"}
                strokeWidth={2}
              />
              <span className="text-[10px] font-semibold" style={{ color: up ? "#34d399" : "#f87171" }}>
                {up ? "+" : ""}{change}%
              </span>
            </div>
          ) : (
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.18)" }}>—</span>
          )}
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between">
          <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
            Vol {fmtVolume(market.volume24h)}
          </span>
          <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
            Liq {fmtVolume(market.liquidity)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/markets/${navId}`} className="flex-1">
            <Button variant="primary" size="sm" shape="slant" corner="bottom-left" className="w-full justify-center">
              Trade
            </Button>
          </Link>
          <Link href={`/markets/${navId}`} className="flex-1">
            <Button variant="ghost" size="sm" shape="slant" corner="bottom-right" className="w-full justify-center">
              <HugeiconsIcon icon={ArrowRight01Icon} size={11} color="rgba(255,255,255,0.5)" strokeWidth={1.5} />
              View
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
