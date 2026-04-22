import { polymarketProxyClient, clobClient } from "./axios-client";

// ── Types ─────────────────────────────────────────────────────────────────────
export type PolymarketEvent = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category?: string;
  image?: string;
  icon?: string;
  liquidity: number;
  volume: number;
  volume24hr?: number;
  active: boolean;
  closed: boolean;
  endDate: string;
  markets: PolymarketMarket[];
};

export type PolymarketMarket = {
  id: string;
  question: string;
  conditionId: string;
  slug: string;
  outcomes: string;
  outcomePrices: string;
  volume: string;
  liquidity?: string;
  active: boolean;
  closed: boolean;
  clobTokenIds?: string;
  lastTradePrice?: number;
  bestAsk?: number;
  bestBid?: number;
};

export type OpportunityBrief = {
  id: string;
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  marketId: string;
  marketQuestion: string;
  category: string;
  platform: "polymarket" | "bayse" | "kalshi";
  image?: string;
  marketProbability: number;
  liquidity: number;
  volume: number;
  volume24hr?: number;
  opportunitySummary: string;
  edgeLevel: "HIGH" | "MEDIUM" | "LOW";
  edgePercent: number;
  closesAt: string;
};

export type ClobOrderbook = {
  market: string;
  asset_id: string;
  bids: { price: string; size: string }[];
  asks: { price: string; size: string }[];
  hash: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function parseJsonArray<T>(raw: string | undefined): T[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function pickBestMarket(event: PolymarketEvent): PolymarketMarket | null {
  const active = event.markets.filter((m) => m.active && !m.closed);
  if (!active.length) return null;
  return active.sort((a, b) => parseFloat(b.volume || "0") - parseFloat(a.volume || "0"))[0];
}

function buildBrief(event: PolymarketEvent, market: PolymarketMarket): OpportunityBrief {
  const prices = parseJsonArray<number>(market.outcomePrices);
  const outcomes = parseJsonArray<string>(market.outcomes);
  const yesIdx = outcomes.findIndex((o) => o.toLowerCase() === "yes");
  const marketProbability =
    yesIdx >= 0 && prices[yesIdx] != null ? Math.round(Number(prices[yesIdx]) * 100) : 50;

  const liquidity = event.liquidity ?? 0;
  const volume = event.volume ?? 0;
  const vol24 = event.volume24hr ?? 0;

  let edgeLevel: "HIGH" | "MEDIUM" | "LOW" = "MEDIUM";
  let edgePercent = 0;
  if (vol24 > 0 && volume > 0) {
    const ratio = vol24 / (volume / 30);
    edgePercent = Math.min(25, Math.round(ratio * 10));
    edgeLevel = edgePercent >= 15 ? "HIGH" : edgePercent <= 5 ? "LOW" : "MEDIUM";
  } else {
    edgePercent = liquidity > 100_000 ? 12 : liquidity > 10_000 ? 8 : 5;
    edgeLevel = edgePercent >= 12 ? "HIGH" : edgePercent >= 8 ? "MEDIUM" : "LOW";
  }

  const desc = (event.description || "").slice(0, 200);
  const opportunitySummary =
    desc +
    (desc ? ". " : "") +
    `$${(liquidity / 1_000).toFixed(0)}k liquidity · $${(volume / 1_000_000).toFixed(2)}M volume.`;

  return {
    id: `${event.id}-${market.id}`,
    eventId: event.id,
    eventSlug: event.slug,
    eventTitle: event.title,
    marketId: market.id,
    marketQuestion: market.question,
    category: event.category || "Other",
    platform: "polymarket",
    image: event.image || event.icon,
    marketProbability,
    liquidity,
    volume,
    volume24hr: vol24,
    opportunitySummary,
    edgeLevel,
    edgePercent,
    closesAt: event.endDate,
  };
}

// ── API calls ─────────────────────────────────────────────────────────────────

/** Fetch active Polymarket events and shape them into opportunity briefs */
export async function fetchMarkets(limit = 20): Promise<OpportunityBrief[]> {
  const { data } = await polymarketProxyClient.get<PolymarketEvent[]>("/events", {
    params: { limit, active: true, closed: false },
  });

  return data.flatMap((event) => {
    const market = pickBestMarket(event);
    return market ? [buildBrief(event, market)] : [];
  });
}

/** Fetch a single event by slug */
export async function fetchEventBySlug(
  slug: string
): Promise<{ event: PolymarketEvent; brief: OpportunityBrief } | null> {
  const { data } = await polymarketProxyClient.get<PolymarketEvent>(
    `/event/${encodeURIComponent(slug)}`
  );
  const market = pickBestMarket(data);
  if (!market) return null;
  return { event: data, brief: buildBrief(data, market) };
}

/** Fetch events filtered by category */
export async function fetchMarketsByCategory(
  category: string,
  limit = 20
): Promise<OpportunityBrief[]> {
  const { data } = await polymarketProxyClient.get<PolymarketEvent[]>("/events", {
    params: { limit, active: true, closed: false, category },
  });

  return data.flatMap((event) => {
    const market = pickBestMarket(event);
    return market ? [buildBrief(event, market)] : [];
  });
}

/** Fetch closed markets */
export async function fetchClosedMarkets(limit = 20): Promise<OpportunityBrief[]> {
  const { data } = await polymarketProxyClient.get<PolymarketEvent[]>("/events", {
    params: { limit, closed: true },
  });

  return data.flatMap((event) => {
    const markets = event.markets ?? [];
    const market = markets.sort(
      (a, b) => parseFloat(b.volume || "0") - parseFloat(a.volume || "0")
    )[0];
    return market ? [buildBrief(event, market)] : [];
  });
}

/** Fetch CLOB orderbook for a token id */
export async function fetchOrderbook(tokenId: string): Promise<ClobOrderbook> {
  const { data } = await clobClient.get<ClobOrderbook>("/book", {
    params: { token_id: tokenId },
  });
  return data;
}

/** Fetch CLOB price for a token */
export async function fetchPrice(tokenId: string): Promise<{ price: string }> {
  const { data } = await clobClient.get<{ price: string }>("/price", {
    params: { token_id: tokenId, side: "buy" },
  });
  return data;
}
