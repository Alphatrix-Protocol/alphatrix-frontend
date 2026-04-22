"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AiBrain01Icon,
  ArrowRight01Icon,
  Search01Icon,
  News01Icon,
  ArrowUpRight01Icon,
  ArrowDownRight01Icon,
  Cancel01Icon,
  SparklesIcon,
  FireIcon,
  ChartIcon,
  ExternalLink,
  GridViewIcon,
  LayoutList,
} from "@hugeicons/core-free-icons";
import { FILTERS, PLATFORM_META, type Market } from "../_components/markets/data";
import PlatformLogo from "../_components/markets/platform-logo";
import MarketCard from "../_components/markets/market-card";
import { MarketCardSkeleton } from "../_components/market-skeleton";
import { useCombinedMarkets } from "@/lib/hooks/use-combined-markets";
import type { OpportunityBrief } from "@/services/polymarket.service";

function briefToMarket(b: OpportunityBrief): Market {
  return {
    id: b.eventSlug,
    title: b.eventTitle,
    image: b.image ?? `https://picsum.photos/seed/${b.eventSlug}/120/120`,
    category: b.category,
    price: b.marketProbability,
    change: b.edgePercent,
    volume: b.volume >= 1_000_000
      ? `$${(b.volume / 1_000_000).toFixed(1)}M`
      : `$${(b.volume / 1_000).toFixed(0)}K`,
    closeDate: new Date(b.closesAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    platform: b.platform ?? "polymarket",
  };
}

const QUICK_OPTIONS = [
  { id: "news",    label: "Top News Headlines", icon: News01Icon,    desc: "Latest from major sources" },
  { id: "hot",     label: "Hot Markets",         icon: FireIcon,      desc: "Highest volume today" },
  { id: "alpha",   label: "Alpha Picks",         icon: SparklesIcon,  desc: "AI-curated edges" },
];

const NEWS_HEADLINES = [
  {
    id: "n1",
    source: "Reuters",
    sourceLogo: "R",
    sourceColor: "#FF8000",
    title: "Federal Reserve signals cautious approach to rate cuts amid strong jobs data",
    time: "14m ago",
    category: "Economy",
    relatedMarkets: 3,
  },
  {
    id: "n2",
    source: "Bloomberg",
    sourceLogo: "B",
    sourceColor: "#1B75BB",
    title: "Bitcoin surges past $85K as institutional demand picks up ahead of halving",
    time: "31m ago",
    category: "Crypto",
    relatedMarkets: 5,
  },
  {
    id: "n3",
    source: "The Guardian",
    sourceLogo: "G",
    sourceColor: "#052962",
    title: "Arsenal's title push continues with commanding win over City at the Etihad",
    time: "1h ago",
    category: "Sports",
    relatedMarkets: 2,
  },
  {
    id: "n4",
    source: "TechCrunch",
    sourceLogo: "T",
    sourceColor: "#0A84FF",
    title: "Anthropic releases Claude 4.5, outperforming rivals on all major benchmarks",
    time: "2h ago",
    category: "Tech",
    relatedMarkets: 4,
  },
  {
    id: "n5",
    source: "AP News",
    sourceLogo: "A",
    sourceColor: "#E51837",
    title: "Trump approval rating dips to 48% in latest Gallup polling amid trade tensions",
    time: "3h ago",
    category: "Politics",
    relatedMarkets: 2,
  },
  {
    id: "n6",
    source: "CoinDesk",
    sourceLogo: "C",
    sourceColor: "#7B6EF4",
    title: "Ethereum developers set date for next major upgrade targeting scalability",
    time: "4h ago",
    category: "Crypto",
    relatedMarkets: 3,
  },
];


export default function FeedsPage() {
  const [query, setQuery]         = useState("");
  const [activeOption, setActiveOption] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [filter, setFilter]       = useState("All");
  const [platform, setPlatform]   = useState<"all" | "polymarket" | "bayse">("all");
  const [view, setView]           = useState<"list" | "grid">("list");
  const [findingFor, setFindingFor] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: briefs, isLoading, isError } = useCombinedMarkets(20);
  const markets: Market[] = briefs?.map(briefToMarket) ?? [];
  const filteredMarkets = markets
    .filter((m) => platform === "all" || m.platform === platform)
    .filter((m) => filter === "All" || m.category === filter);

  function openPanel(id: string) {
    setActiveOption(id);
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
    setTimeout(() => setActiveOption(null), 300);
  }

  function handleFindMarket(headline: string) {
    setFindingFor(headline);
    setTimeout(() => setFindingFor(null), 2000);
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden">

      {/* Main content */}
      <div
        className="flex flex-col flex-1 min-w-0 transition-all duration-300"
        style={{ paddingRight: panelOpen ? 360 : 0 }}
      >

        {/* ── Hero ── */}
        <div className="flex flex-col items-center justify-center px-8 pt-20 pb-14 gap-6">

          {/* Badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-1"
            style={{ border: "1px solid rgba(123,110,244,0.25)", background: "rgba(123,110,244,0.07)" }}
          >
            <HugeiconsIcon icon={AiBrain01Icon} size={11} color="#7B6EF4" strokeWidth={1.5} />
            <span className="text-[10px] font-medium" style={{ color: "rgba(123,110,244,0.9)" }}>Alpha Intelligence</span>
          </div>

          {/* Heading */}
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-[32px] font-bold leading-tight text-white">
              Let Alpha find your market
            </h1>
            <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.3)" }}>
              Describe any event or outcome — Alpha scans every platform to find the best odds.
            </p>
          </div>

          {/* Search box */}
          <div
            className="flex items-center gap-3 w-full max-w-2xl px-4 rounded-xl" 
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${query ? "rgba(123,110,244,0.35)" : "rgba(255,255,255,0.08)"}`,
              transition: "border-color 0.2s",
            }}
          >
            <HugeiconsIcon icon={Search01Icon} size={14} color="rgba(255,255,255,0.2)" strokeWidth={1.5} />
            <input
              ref={inputRef}
              type="text"
              placeholder="e.g. Will the Fed cut rates before June? Will Bitcoin hit $100K?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none border-none text-[13px] text-white placeholder:text-white/20 py-3.5 min-w-0"
            />
            {query && (
              <button onClick={() => setQuery("")}>
                <HugeiconsIcon icon={Cancel01Icon} size={12} color="rgba(255,255,255,0.2)" strokeWidth={1.5} />
              </button>
            )}
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 shrink-0"
              style={{
                background: "rgba(123,110,244,0.85)",
                clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)",
              }}
            >
              <HugeiconsIcon icon={AiBrain01Icon} size={11} color="#fff" strokeWidth={1.5} />
              <span className="text-[11px] font-semibold text-white">Find</span>
            </button>
          </div>

          {/* Quick options */}
          <div className="flex items-center gap-2">
            {QUICK_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => panelOpen && activeOption === opt.id ? closePanel() : openPanel(opt.id)}
                className="flex items-center gap-2 px-3 py-2 transition-all"
                style={{
                  background: activeOption === opt.id && panelOpen
                    ? "rgba(123,110,244,0.12)"
                    : "rgba(255,255,255,0.03)",
                  border: `1px solid ${activeOption === opt.id && panelOpen
                    ? "rgba(123,110,244,0.3)"
                    : "rgba(255,255,255,0.08)"}`,
                }}
              >
                <HugeiconsIcon
                  icon={opt.icon}
                  size={11}
                  color={activeOption === opt.id && panelOpen ? "#7B6EF4" : "rgba(255,255,255,0.35)"}
                  strokeWidth={1.5}
                />
                <span
                  className="text-[11px] font-medium"
                  style={{ color: activeOption === opt.id && panelOpen ? "rgba(123,110,244,0.9)" : "rgba(255,255,255,0.45)" }}
                >
                  {opt.label}
                </span>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={9}
                  color={activeOption === opt.id && panelOpen ? "rgba(123,110,244,0.5)" : "rgba(255,255,255,0.15)"}
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>
        </div>

        {/* ── Markets list ── */}
        <div className="flex flex-col px-8 pb-12 gap-4">
          {/* Section header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[16px] font-semibold text-white">Markets Feed</span>
              <span
                className="text-[10px] px-1.5 py-0.5"
                style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                {isLoading ? "…" : filteredMarkets.length}
              </span>
            </div>
            <div
              className="flex items-center"
              style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
            >
              {(["list", "grid"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className="flex items-center justify-center w-7 h-7 transition-all"
                  style={{ background: view === v ? "rgba(255,255,255,0.08)" : "transparent" }}
                >
                  <HugeiconsIcon
                    icon={v === "list" ? LayoutList : GridViewIcon}
                    size={12}
                    color={view === v ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.25)"}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Platform + category filters */}
          <div className="flex items-center justify-between gap-3">
            {/* Platform tabs */}
            <div className="flex items-center gap-1">
              {([
                { key: "all",        label: "All Platforms" },
                { key: "polymarket", label: "Polymarket" },
                { key: "bayse",      label: "Bayse" },
              ] as const).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setPlatform(key)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium transition-all"
                  style={{
                    background: platform === key ? "rgba(123,110,244,0.12)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${platform === key ? "rgba(123,110,244,0.3)" : "rgba(255,255,255,0.07)"}`,
                    color: platform === key ? "#7B6EF4" : "rgba(255,255,255,0.4)",
                  }}
                >
                  {key !== "all" && <PlatformLogo platform={key} size={12} />}
                  {label}
                </button>
              ))}
            </div>

            {/* Category filters */}
            <div className="flex items-center gap-1">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-2.5 py-1 text-[11px] font-medium transition-all"
                  style={{
                    color: filter === f ? "white" : "rgba(255,255,255,0.35)",
                    background: filter === f ? "rgba(255,255,255,0.07)" : "transparent",
                    border: `1px solid ${filter === f ? "rgba(255,255,255,0.12)" : "transparent"}`,
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {isError && (
            <div className="py-8 text-center text-[12px]" style={{ color: "rgba(248,113,113,0.6)" }}>
              Failed to load markets. Please try again.
            </div>
          )}

          {/* Grid view */}
          {view === "grid" && (
            <div className="grid grid-cols-3 gap-4">
              {isLoading
                ? Array.from({ length: 9 }).map((_, i) => <MarketCardSkeleton key={i} />)
                : filteredMarkets.map((market) => <MarketCard key={market.id} market={market} />)
              }
            </div>
          )}

          {/* List view */}
          {view === "list" && (
            <div className="flex flex-col gap-0" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 px-4 py-3.5"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", animation: "skeleton-pulse 1.5s ease-in-out infinite" }}
                    >
                      <div style={{ width: 36, height: 36, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }} />
                      <div className="flex flex-col gap-1.5 flex-1">
                        <div style={{ width: 80, height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 2 }} />
                        <div style={{ width: "60%", height: 10, background: "rgba(255,255,255,0.06)", borderRadius: 2 }} />
                      </div>
                      <div style={{ width: 120, height: 10, background: "rgba(255,255,255,0.06)", borderRadius: 2 }} />
                    </div>
                  ))
                : filteredMarkets.map((market, i) => {
                const isUp = market.change > 0;
                const changeColor = isUp ? "#34d399" : "#f87171";
                return (
                  <div
                    key={market.id}
                    className="flex items-center gap-4 px-4 py-3.5 transition-colors"
                    style={{
                      borderBottom: i < filteredMarkets.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                      background: "transparent",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                  >
                    <div
                      className="relative shrink-0 rounded overflow-hidden"
                      style={{ width: 36, height: 36, border: "1px solid rgba(255,255,255,0.07)" }}
                    >
                      <Image src={market.image} alt={market.title} fill className="object-cover" sizes="36px" />
                    </div>

                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <PlatformLogo platform={market.platform} size={13} />
                        <span className="text-[9px] font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>
                          {PLATFORM_META[market.platform].label}
                        </span>
                        <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
                        <span className="text-[9px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>
                          {market.category}
                        </span>
                      </div>
                      <Link
                        href={`/markets/${market.id}`}
                        className="text-[13px] font-medium text-white truncate hover:text-white/80 transition-colors"
                      >
                        {market.title}
                      </Link>
                    </div>

                    <div className="flex items-center gap-6 shrink-0">
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>Vol</span>
                        <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>{market.volume}</span>
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>Closes</span>
                        <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>{market.closeDate}</span>
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-[19px] font-bold text-white leading-none">{market.price}¢</span>
                        <div className="flex items-center gap-0.5">
                          <HugeiconsIcon
                            icon={isUp ? ArrowUpRight01Icon : ArrowDownRight01Icon}
                            size={9}
                            color={changeColor}
                            strokeWidth={2}
                          />
                          <span className="text-[10px] font-semibold" style={{ color: changeColor }}>
                            {isUp ? "+" : ""}{market.change}%
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/markets/${market.id}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold transition-all"
                        style={{
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "rgba(255,255,255,0.6)",
                          background: "rgba(255,255,255,0.03)",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                          (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.18)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                          (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                        }}
                      >
                        Trade
                        <HugeiconsIcon icon={ArrowRight01Icon} size={9} color="rgba(255,255,255,0.4)" strokeWidth={1.5} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── News side panel ── */}
      <AnimatePresence>
        {panelOpen && activeOption === "news" && (
          <motion.div
            initial={{ x: 360, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 360, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed top-0 right-0 h-full flex flex-col overflow-hidden z-30"
            style={{
              width: 360,
              background: "#141414",
              borderLeft: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {/* Panel header */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={News01Icon} size={13} color="rgba(255,255,255,0.4)" strokeWidth={1.5} />
                <span className="text-[13px] font-semibold text-white">Top News</span>
                <span
                  className="text-[9px] px-1.5 py-0.5"
                  style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  {NEWS_HEADLINES.length}
                </span>
              </div>
              <button
                onClick={closePanel}
                className="flex items-center justify-center w-6 h-6 transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)")}
              >
                <HugeiconsIcon icon={Cancel01Icon} size={10} color="rgba(255,255,255,0.4)" strokeWidth={1.5} />
              </button>
            </div>

            <p className="px-5 py-3 text-[10px] shrink-0" style={{ color: "rgba(255,255,255,0.2)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              From Reuters, Bloomberg, AP, TechCrunch · Updated 14m ago
            </p>

            {/* Headlines */}
            <div className="flex flex-col overflow-y-auto flex-1">
              {NEWS_HEADLINES.map((news, i) => (
                <div
                  key={news.id}
                  className="flex flex-col gap-3 px-5 py-4"
                  style={{ borderBottom: i < NEWS_HEADLINES.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                >
                  <div className="flex items-start">
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>{news.source}</span>
                        <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
                        <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>{news.time}</span>
                        <span
                          className="ml-auto text-[9px] px-1.5 py-0.5"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            color: "rgba(255,255,255,0.25)",
                            border: "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          {news.category}
                        </span>
                      </div>
                      <p className="text-[12px] font-medium text-white leading-snug">{news.title}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleFindMarket(news.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold flex-1 justify-center transition-all"
                      style={
                        findingFor === news.id
                          ? { background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", color: "#34d399" }
                          : { background: "rgba(123,110,244,0.08)", border: "1px solid rgba(123,110,244,0.2)", color: "rgba(123,110,244,0.9)" }
                      }
                    >
                      {findingFor === news.id ? (
                        <>
                          <HugeiconsIcon icon={AiBrain01Icon} size={10} color="#34d399" strokeWidth={1.5} />
                          Searching…
                        </>
                      ) : (
                        <>
                          <HugeiconsIcon icon={AiBrain01Icon} size={10} color="#7B6EF4" strokeWidth={1.5} />
                          Find market for this
                        </>
                      )}
                    </button>
                    <button
                      className="flex items-center justify-center w-7 h-7 shrink-0 transition-all"
                      style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)")}
                    >
                      <HugeiconsIcon icon={ExternalLink} size={10} color="rgba(255,255,255,0.3)" strokeWidth={1.5} />
                    </button>
                  </div>

                  {news.relatedMarkets > 0 && (
                    <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                      {news.relatedMarkets} related market{news.relatedMarkets > 1 ? "s" : ""} found
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
