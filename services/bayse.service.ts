import { bayseProxyClient } from "./axios-client";
import type { OpportunityBrief } from "./polymarket.service";

// ── Types ─────────────────────────────────────────────────────────────────────

export type BayseMarket = {
  id: string;
  title: string;
  status: string;
  outcome1Id: string;
  outcome1Label: string;
  outcome1Price: number;
  outcome2Id: string;
  outcome2Label: string;
  outcome2Price: number;
  yesBuyPrice: number;
  noBuyPrice: number;
  feePercentage: number;
  totalOrders: number;
  rules?: string;
};

export type BayseEvent = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  type: string;
  engine: string;
  status: string;
  resolutionDate: string;
  closingDate: string;
  imageUrl?: string;
  liquidity: number;
  totalVolume: number;
  totalOrders: number;
  supportedCurrencies: string[];
  userWatchlisted?: boolean;
  markets: BayseMarket[];
};

type BayseEventsResponse = {
  events: BayseEvent[];
  pagination: { page: number; size: number; lastPage: number; totalCount: number };
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function pickBestMarket(event: BayseEvent): BayseMarket | null {
  const open = event.markets.filter((m) => m.status === "open");
  if (!open.length) return event.markets[0] ?? null;
  return open.sort((a, b) => b.totalOrders - a.totalOrders)[0];
}

function buildBrief(event: BayseEvent, market: BayseMarket): OpportunityBrief {
  const marketProbability = Math.round(market.yesBuyPrice * 100);

  const liquidity = event.liquidity ?? 0;
  const volume    = event.totalVolume ?? 0;

  // Simple edge: compare implied price to 50% baseline
  const delta = Math.abs(marketProbability - 50);
  const edgePercent =
    delta > 25 ? Math.min(20, Math.round(delta * 0.4)) :
    delta > 10 ? Math.min(12, Math.round(delta * 0.3)) : 5;
  const edgeLevel: "HIGH" | "MEDIUM" | "LOW" =
    edgePercent >= 14 ? "HIGH" : edgePercent >= 8 ? "MEDIUM" : "LOW";

  const desc = (event.description || "").slice(0, 200);
  const opportunitySummary =
    desc +
    (desc ? ". " : "") +
    `$${(liquidity / 1_000).toFixed(0)}k liquidity · $${(volume / 1_000_000).toFixed(2)}M volume.`;

  return {
    id: `bayse-${event.id}-${market.id}`,
    eventId: event.id,
    eventSlug: event.slug,
    eventTitle: event.title,
    marketId: market.id,
    marketQuestion: market.title,
    category: event.category ?? "Other",
    platform: "bayse",
    image: event.imageUrl,
    marketProbability,
    liquidity,
    volume,
    opportunitySummary,
    edgeLevel,
    edgePercent,
    closesAt: event.closingDate || event.resolutionDate,
  };
}

// ── API calls ─────────────────────────────────────────────────────────────────

/** Fetch open Bayse events as opportunity briefs */
export async function fetchBayseMarkets(size = 20): Promise<OpportunityBrief[]> {
  const { data } = await bayseProxyClient.get<BayseEventsResponse>("/events", {
    params: { size, status: "open" },
  });

  return (data.events ?? []).flatMap((event) => {
    const market = pickBestMarket(event);
    return market ? [buildBrief(event, market)] : [];
  });
}

/** Fetch trending Bayse events */
export async function fetchBayseTrending(size = 10): Promise<OpportunityBrief[]> {
  const { data } = await bayseProxyClient.get<BayseEventsResponse>("/events", {
    params: { size, status: "open", trending: "true" },
  });

  return (data.events ?? []).flatMap((event) => {
    const market = pickBestMarket(event);
    return market ? [buildBrief(event, market)] : [];
  });
}

/** Fetch Bayse events by category */
export async function fetchBayseByCategory(
  category: string,
  size = 20
): Promise<OpportunityBrief[]> {
  const { data } = await bayseProxyClient.get<BayseEventsResponse>("/events", {
    params: { size, status: "open", category },
  });

  return (data.events ?? []).flatMap((event) => {
    const market = pickBestMarket(event);
    return market ? [buildBrief(event, market)] : [];
  });
}
