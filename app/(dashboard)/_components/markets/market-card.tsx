import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon, ArrowDownRight01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import PlatformLogo from "./platform-logo";
import { Market, PLATFORM_META } from "./data";

export default function MarketCard({ market }: { market: Market }) {
  const up = market.change >= 0;
  const diff = market.cross ? Math.abs(market.price - market.cross.price) : null;

  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Header: thumbnail + platform + title */}
      <div className="flex gap-3 p-3.5 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="relative shrink-0 overflow-hidden rounded-lg" style={{ width: 44, height: 44 }}>
          <Image src={market.image} alt={market.title} fill className="object-cover" sizes="44px" />
        </div>

        <div className="flex flex-col justify-between min-w-0 flex-1 gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <PlatformLogo platform={market.platform} size={16} />
              <span className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
                {PLATFORM_META[market.platform].label}
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
            <span className="text-xl font-bold text-white leading-none">{market.price}¢</span>
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>/ $1</span>
          </div>
          <div
            className="flex items-center gap-1 px-2 py-0.5"
            style={{
              background: up ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)",
              border: `1px solid ${up ? "rgba(52,211,153,0.18)" : "rgba(248,113,113,0.18)"}`,
            }}
          >
            <HugeiconsIcon icon={up ? ArrowUpRight01Icon : ArrowDownRight01Icon} size={10} color={up ? "#34d399" : "#f87171"} strokeWidth={2} />
            <span className="text-[10px] font-semibold" style={{ color: up ? "#34d399" : "#f87171" }}>
              {up ? "+" : ""}{market.change}%
            </span>
          </div>
        </div>

        {/* Cross-platform comparison */}
        {market.cross && diff !== null && (
          <div
            className="flex items-center justify-between px-2.5 py-2"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="flex items-center gap-1.5">
              <PlatformLogo platform={market.platform} size={13} />
              <span className="text-[11px] font-medium text-white/60">{market.price}¢</span>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.5" style={{ background: "rgba(123,110,244,0.15)", color: "#7B6EF4" }}>
              Δ {diff}¢
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-white/60">{market.cross.price}¢</span>
              <PlatformLogo platform={market.cross.platform} size={13} />
            </div>
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between">
          <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>Vol {market.volume}</span>
          <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>Closes {market.closeDate}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/markets/${market.id}`} className="flex-1">
            <Button variant="primary" size="sm" shape="slant" corner="bottom-left" className="w-full justify-center">
              Trade
            </Button>
          </Link>
          <Link href={`/markets/${market.id}`} className="flex-1">
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
