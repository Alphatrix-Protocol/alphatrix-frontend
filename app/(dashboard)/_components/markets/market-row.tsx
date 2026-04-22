import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon, ArrowDownRight01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import PlatformLogo from "./platform-logo";
import { Market, PLATFORM_META } from "./data";

export default function MarketRow({ market }: { market: Market }) {
  const up = market.change >= 0;
  const diff = market.cross ? Math.abs(market.price - market.cross.price) : null;

  return (
    <div
      className="flex items-center gap-4 px-4 py-3 transition-colors"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
    >
      {/* Image + platform + title */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="relative shrink-0 overflow-hidden rounded-md" style={{ width: 32, height: 32 }}>
          <Image src={market.image} alt={market.title} fill className="object-cover" sizes="32px" />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <PlatformLogo platform={market.platform} size={12} />
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
              {PLATFORM_META[market.platform].label}
            </span>
          </div>
          <span className="text-xs text-white/80 truncate font-medium">{market.title}</span>
        </div>
      </div>

      {/* Price */}
      <span className="text-sm font-bold text-white w-14 text-right shrink-0">{market.price}¢</span>

      {/* Change */}
      <div className="flex items-center gap-1 w-16 justify-end shrink-0">
        <HugeiconsIcon icon={up ? ArrowUpRight01Icon : ArrowDownRight01Icon} size={11} strokeWidth={2} color={up ? "#34d399" : "#f87171"} />
        <span className="text-[11px] font-semibold" style={{ color: up ? "#34d399" : "#f87171" }}>
          {up ? "+" : ""}{market.change}%
        </span>
      </div>

      {/* Cross-platform delta */}
      <div className="w-32 flex items-center justify-end gap-1.5 shrink-0">
        {market.cross && diff !== null ? (
          <>
            <PlatformLogo platform={market.cross.platform} size={13} />
            <span className="text-[10px] text-white/30">{market.cross.price}¢</span>
            <span className="text-[9px] px-1.5 py-0.5 font-bold" style={{ background: "rgba(123,110,244,0.15)", color: "#7B6EF4" }}>
              Δ {diff}¢
            </span>
          </>
        ) : (
          <span className="text-[10px] text-white/15">—</span>
        )}
      </div>

      {/* Volume */}
      <span className="text-[11px] text-white/25 w-16 text-right shrink-0">{market.volume}</span>

      {/* Actions */}
      <div className="flex gap-1.5 shrink-0">
        <Link href={`/markets/${market.id}`}>
          <Button variant="primary" size="sm" shape="slant">Trade</Button>
        </Link>
        <Link href={`/markets/${market.id}`}>
          <Button variant="ghost" size="sm" shape="slant">View</Button>
        </Link>
      </div>
    </div>
  );
}
