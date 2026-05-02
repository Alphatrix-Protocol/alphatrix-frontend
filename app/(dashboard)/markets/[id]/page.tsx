"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowUpRight01Icon,
  ArrowDownRight01Icon,
  Clock01Icon,
  BarChartIcon,
  LinkSquareIcon,
} from "@hugeicons/core-free-icons";
import TradePanel from "./_components/trade-panel";
import PlatformLogo, { VENUE_DISPLAY_NAMES } from "../../_components/markets/platform-logo";
import {
  useBackendMarket,
  useMarketPriceHistory,
  useMarketTrades,
} from "@/lib/api/hooks/use-backend-markets";

const PriceChart = dynamic(() => import("./_components/price-chart"), {
  ssr: false,
});

const TABS = ["Summary", "Recent Trades"] as const;
type Tab = (typeof TABS)[number];

export default function MarketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Summary");
  const [range, setRange] = useState("3M");

  const { data, isLoading, isError } = useBackendMarket(id ?? "");
  const { data: historyData, isLoading: historyLoading } =
    useMarketPriceHistory(id ?? "", range);
  const { data: tradesData, isLoading: tradesLoading } = useMarketTrades(
    id ?? "",
  );

  const event = data?.event;
  const brief = data?.brief;
  const venues = data?.venues ?? [];
  const priceHistoryVenues = historyData?.venues ?? [];
  const trades = tradesData?.trades ?? [];

  const bestYesPrice = venues.reduce(
    (best, venue) => Math.min(best, venue.yesPrice),
    Number.MAX_SAFE_INTEGER,
  );
  const bestNoPrice = venues.reduce(
    (best, venue) => Math.min(best, venue.noPrice),
    Number.MAX_SAFE_INTEGER,
  );

  const title = event?.title ?? (isLoading ? "" : "Market not found");
  const description = event?.description ?? "";
  const category = event?.category ?? "";
  const image =
    event?.image || event?.icon || `https://picsum.photos/seed/${id}/52/52`;
  const closesAt = event?.endDate
    ? new Date(event.endDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";
  const volumeFormatted = brief
    ? brief.volume >= 1_000_000
      ? `$${(brief.volume / 1_000_000).toFixed(1)}M Vol`
      : `$${(brief.volume / 1_000).toFixed(0)}K Vol`
    : "";
  const liquidityFormatted = brief
    ? brief.liquidity >= 1_000_000
      ? `$${(brief.liquidity / 1_000_000).toFixed(1)}M`
      : `$${(brief.liquidity / 1_000).toFixed(0)}K`
    : "";
  const probability = brief?.marketProbability ?? 0;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <div
        className="flex items-center gap-3 px-8 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <button
          className="flex items-center justify-center w-7 h-7 transition-all"
          style={{
            border: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.03)",
          }}
          onClick={() => router.back()}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.background =
              "rgba(255,255,255,0.06)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background =
              "rgba(255,255,255,0.03)")
          }
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            size={13}
            color="rgba(255,255,255,0.5)"
            strokeWidth={1.5}
          />
        </button>
        <span
          className="text-[13px]"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          Markets
        </span>
        <span
          className="text-[13px]"
          style={{ color: "rgba(255,255,255,0.15)" }}
        >
          /
        </span>
        <span
          className="text-[13px] font-medium truncate max-w-md"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          {isLoading ? "Loading…" : title}
        </span>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 gap-0">
        {/* Left: chart + tabs */}
        <div className="flex flex-col flex-1 min-w-0 px-8 py-6 gap-5">
          {/* Market header */}
          <div className="flex items-start gap-4">
            <div
              className="relative shrink-0 overflow-hidden rounded-xl"
              style={{
                width: 52,
                height: 52,
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {isLoading ? (
                <div
                  style={{
                    width: 52,
                    height: 52,
                    background: "rgba(255,255,255,0.06)",
                    animation: "skeleton-pulse 1.5s ease-in-out infinite",
                  }}
                />
              ) : (
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="52px"
                />
              )}
            </div>

            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {isLoading ? (
                  <div
                    style={{
                      width: 80,
                      height: 16,
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: 3,
                      animation: "skeleton-pulse 1.5s ease-in-out infinite",
                    }}
                  />
                ) : (
                  venues
                    .map((v) => v.venueId)
                    .filter((id, idx, arr) => arr.indexOf(id) === idx)
                    .map((venueId) => (
                      <div key={venueId} className="flex items-center gap-1.5">
                        <PlatformLogo platform={venueId} size={16} />
                        <span
                          className="text-[10px] font-medium"
                          style={{ color: "rgba(255,255,255,0.4)" }}
                        >
                          {VENUE_DISPLAY_NAMES[venueId] ?? venueId}
                        </span>
                      </div>
                    ))
                )}
                {category && (
                  <span
                    className="text-[10px]"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                  >
                    {category}
                  </span>
                )}
                {closesAt && (
                  <div className="flex items-center gap-1 ml-auto">
                    <HugeiconsIcon
                      icon={Clock01Icon}
                      size={10}
                      color="rgba(255,255,255,0.2)"
                      strokeWidth={1.5}
                    />
                    <span
                      className="text-[10px]"
                      style={{ color: "rgba(255,255,255,0.25)" }}
                    >
                      Closes {closesAt}
                    </span>
                  </div>
                )}
              </div>
              {isLoading ? (
                <div
                  style={{
                    width: "70%",
                    height: 20,
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: 3,
                    animation: "skeleton-pulse 1.5s ease-in-out infinite",
                  }}
                />
              ) : (
                <h1 className="text-[18px] font-semibold text-white leading-snug">
                  {title}
                </h1>
              )}
              <div className="flex items-center gap-4">
                {volumeFormatted && (
                  <div className="flex items-center gap-1.5">
                    <HugeiconsIcon
                      icon={BarChartIcon}
                      size={11}
                      color="rgba(255,255,255,0.2)"
                      strokeWidth={1.5}
                    />
                    <span
                      className="text-[11px]"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      {volumeFormatted}
                    </span>
                  </div>
                )}
                {/* current probability */}
                {!isLoading && brief && (
                  <div className="flex items-center gap-1.5 ml-auto">
                    <span className="text-[22px] font-bold text-white leading-none">
                      {probability}¢
                    </span>
                    <div
                      className="flex items-center gap-1 px-1.5 py-0.5"
                      style={{
                        background: "rgba(52,211,153,0.1)",
                        border: "1px solid rgba(52,211,153,0.15)",
                      }}
                    >
                      <HugeiconsIcon
                        icon={ArrowUpRight01Icon}
                        size={10}
                        color="#34d399"
                        strokeWidth={2}
                      />
                      <span
                        className="text-[10px] font-semibold"
                        style={{ color: "#34d399" }}
                      >
                        YES
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Venue comparison strip */}
          <div className="grid grid-cols-3 gap-2">
            {venues.map((v) => {
              const isBestYes = v.yesPrice === bestYesPrice;
              const isBestNo = v.noPrice === bestNoPrice;
              return (
                <div
                  key={`${v.venueId}-${v.venueMarketId}`}
                  className="flex flex-col gap-2.5 p-3"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {/* Venue identity */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <PlatformLogo
                        platform={
                          v.venueId as "polymarket" | "kalshi" | "bayse"
                        }
                        size={14}
                      />
                      <span
                        className="text-[11px] font-medium"
                        style={{ color: "rgba(255,255,255,0.55)" }}
                      >
                        {VENUE_DISPLAY_NAMES[v.venueId] ?? v.venueId}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {v.marketUrl && (
                        <a
                          href={v.marketUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-1.5 py-0.5 transition-all"
                          style={{
                            border: "1px solid rgba(255,255,255,0.07)",
                            background: "rgba(255,255,255,0.03)",
                            color: "rgba(255,255,255,0.3)",
                            textDecoration: "none",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                            (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                            (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)";
                          }}
                        >
                          <HugeiconsIcon icon={LinkSquareIcon} size={10} color="currentColor" strokeWidth={1.5} />
                          <span className="text-[9px] font-medium">View</span>
                        </a>
                      )}
                      {(isBestYes || isBestNo) && (
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{
                            background: "#34d399",
                            boxShadow: "0 0 4px rgba(52,211,153,0.5)",
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* YES / NO prices */}
                  <div className="flex items-center gap-2">
                    <div
                      className="flex flex-col items-center gap-0.5 flex-1 py-1.5"
                      style={{
                        background: isBestYes
                          ? "rgba(52,211,153,0.07)"
                          : "rgba(255,255,255,0.02)",
                        border: `1px solid ${isBestYes ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.05)"}`,
                      }}
                    >
                      <span
                        className="text-[9px] uppercase tracking-widest"
                        style={{
                          color: isBestYes
                            ? "#34d399"
                            : "rgba(255,255,255,0.2)",
                        }}
                      >
                        YES
                      </span>
                      <div className="flex items-center gap-0.5">
                        <span
                          className="text-[15px] font-bold"
                          style={{
                            color: isBestYes
                              ? "#34d399"
                              : "rgba(255,255,255,0.75)",
                          }}
                        >
                          {v.yesPrice}¢
                        </span>
                        {isBestYes && (
                          <HugeiconsIcon
                            icon={ArrowDownRight01Icon}
                            size={10}
                            color="#34d399"
                            strokeWidth={2}
                          />
                        )}
                      </div>
                    </div>
                    <div
                      className="flex flex-col items-center gap-0.5 flex-1 py-1.5"
                      style={{
                        background: isBestNo
                          ? "rgba(52,211,153,0.07)"
                          : "rgba(255,255,255,0.02)",
                        border: `1px solid ${isBestNo ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.05)"}`,
                      }}
                    >
                      <span
                        className="text-[9px] uppercase tracking-widest"
                        style={{
                          color: isBestNo ? "#34d399" : "rgba(255,255,255,0.2)",
                        }}
                      >
                        NO
                      </span>
                      <div className="flex items-center gap-0.5">
                        <span
                          className="text-[15px] font-bold"
                          style={{
                            color: isBestNo
                              ? "#34d399"
                              : "rgba(255,255,255,0.75)",
                          }}
                        >
                          {v.noPrice}¢
                        </span>
                        {isBestNo && (
                          <HugeiconsIcon
                            icon={ArrowDownRight01Icon}
                            size={10}
                            color="#34d399"
                            strokeWidth={2}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {!isLoading && !isError && venues.length === 0 && (
            <div
              className="py-6 text-center text-[12px]"
              style={{
                color: "rgba(255,255,255,0.35)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              No venue pricing available for this market yet.
            </div>
          )}

          {/* Chart */}
          <div
            className="flex flex-col"
            style={{
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.015)",
            }}
          >
            {/* Chart toolbar */}
            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
            >
              <span
                className="text-[10px] uppercase tracking-widest"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
                YES probability
              </span>
              <div className="flex items-center gap-0.5">
                {["1W", "1M", "3M", "All"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className="px-2 py-1 text-[10px] font-medium transition-all"
                    style={{
                      color: range === r ? "white" : "rgba(255,255,255,0.3)",
                      background:
                        range === r ? "rgba(255,255,255,0.07)" : "transparent",
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ height: 280 }}>
              <PriceChart
                venues={priceHistoryVenues}
                isLoading={historyLoading}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-col gap-0">
            <div
              className="flex items-center gap-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="px-4 py-2.5 text-[12px] font-medium transition-all relative"
                  style={{
                    color: tab === t ? "white" : "rgba(255,255,255,0.3)",
                  }}
                >
                  {t}
                  {tab === t && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-px"
                      style={{ background: "#7B6EF4" }}
                    />
                  )}
                </button>
              ))}
            </div>

            {tab === "Summary" && (
              <div className="flex flex-col gap-4 py-4">
                {isLoading ? (
                  <div className="flex flex-col gap-2">
                    {[90, 75, 60].map((w) => (
                      <div
                        key={w}
                        style={{
                          width: `${w}%`,
                          height: 10,
                          background: "rgba(255,255,255,0.06)",
                          borderRadius: 2,
                          animation: "skeleton-pulse 1.5s ease-in-out infinite",
                        }}
                      />
                    ))}
                  </div>
                ) : description ? (
                  <p
                    className="text-[13px] leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {description}
                  </p>
                ) : null}
                <div
                  className="grid grid-cols-2 gap-px"
                  style={{
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.06)",
                  }}
                >
                  {[
                    {
                      label: "Liquidity",
                      value: isLoading ? "…" : liquidityFormatted || "—",
                    },
                    {
                      label: "Volume",
                      value: isLoading ? "…" : volumeFormatted || "—",
                    },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex flex-col gap-1 px-4 py-3"
                      style={{ background: "rgba(255,255,255,0.015)" }}
                    >
                      <span
                        className="text-[10px] uppercase tracking-widest"
                        style={{ color: "rgba(255,255,255,0.25)" }}
                      >
                        {label}
                      </span>
                      <span className="text-[15px] font-semibold text-white">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "Recent Trades" && (
              <div className="flex flex-col">
                <div
                  className="grid grid-cols-5 px-4 py-2"
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  {["Side", "Price", "Shares", "Value", "Time"].map((h) => (
                    <span
                      key={h}
                      className="text-[10px] uppercase tracking-widest"
                      style={{ color: "rgba(255,255,255,0.2)" }}
                    >
                      {h}
                    </span>
                  ))}
                </div>
                {tradesLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-5 gap-4 px-4 py-3"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.03)",
                      }}
                    >
                      {[60, 30, 40, 45, 35].map((w, j) => (
                        <div
                          key={j}
                          style={{
                            height: 10,
                            width: `${w}%`,
                            background: "rgba(255,255,255,0.06)",
                            borderRadius: 2,
                            animation:
                              "skeleton-pulse 1.5s ease-in-out infinite",
                          }}
                        />
                      ))}
                    </div>
                  ))
                ) : trades.length === 0 ? (
                  <div
                    className="py-8 text-center text-[12px]"
                    style={{ color: "rgba(255,255,255,0.2)" }}
                  >
                    No trades recorded yet
                  </div>
                ) : (
                  trades.map((trade, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-5 px-4 py-2.5 transition-colors"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.03)",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.background =
                          "rgba(255,255,255,0.02)")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.background =
                          "transparent")
                      }
                    >
                      <span
                        className="text-[11px] font-semibold uppercase"
                        style={{
                          color: trade.side === "yes" ? "#34d399" : "#f87171",
                        }}
                      >
                        {trade.side}
                      </span>
                      <span className="text-[11px] text-white">
                        {trade.price}¢
                      </span>
                      <span
                        className="text-[11px]"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        {trade.shares}
                      </span>
                      <span className="text-[11px] text-white">
                        ${trade.value}
                      </span>
                      <span
                        className="text-[11px]"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                      >
                        {trade.time}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: trade panel */}
        <div
          className="w-[30%] shrink-0 sticky top-0 self-start pt-6 pb-6 px-5"
          style={{ borderLeft: "1px solid rgba(255,255,255,0.05)" }}
        >
          <TradePanel venues={venues} />
        </div>
      </div>
    </div>
  );
}
