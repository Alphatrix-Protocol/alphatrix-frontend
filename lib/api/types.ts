export type VenueId = "polymarket" | "bayse" | string;
export type MarketStatus = "open" | "closed" | "resolved" | string;

// ── Auth ────────────────────────────────────────────────────────────────────

export interface MeResponse {
  id: string;
  privyUserId: string;
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
  solanaAddress: string | null;
  usdcTokenAddress: string | null;
}

// ── Market list ─────────────────────────────────────────────────────────────

export interface MarketsQuery {
  category?: string;
  status?: "open" | "closed" | "resolved";
  venueId?: "polymarket" | "bayse";
  page?: number;
  size?: number;
}

export interface MarketListItem {
  id: string;
  venueId: string;
  venueMarketId: string;
  title: string;
  category: string;
  status: "open" | "closed" | "resolved";
  volume24h: number;
  liquidity: number;
  yesPrice: number | null;
  noPrice: number | null;
  change24h: number | null;
  image: string | null;
  icon: string | null;
  matchGroupId?: string | null;
  engine?: string;
  closingDate?: string | null;
  rawData?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface MarketListResponse {
  data: MarketListItem[];
  total: number;
  page: number;
  size: number;
}

// ── Market detail ───────────────────────────────────────────────────────────

export interface VenueMarketRow {
  venueId: VenueId;
  venueMarketId: string;
  ticker: string | null;
  marketUrl: string | null;
  yesPrice: number;
  noPrice: number;
  openInterest: number | null;
  volume24h: number;
  liquidity: number;
  outcomes: {
    id: string;
    label: string;
    price: number;
    ticker: string | null;
    marketUrl: string | null;
    volume: number | null;
    volume24h: number | null;
    openInterest: number | null;
    yesMint: string | null;
    noMint: string | null;
  }[];
}

export interface MarketDetailResponse {
  event: {
    id: string;
    title: string;
    description: string | null;
    category: string;
    image: string | null;
    icon: string | null;
    endDate: string | null;
    status: MarketStatus;
  };
  brief: {
    volume: number;
    liquidity: number;
    marketProbability: number;
  };
  venues: VenueMarketRow[];
}

// ── Price history ───────────────────────────────────────────────────────────

export interface OhlcCandle {
  time: string;  // "YYYY-MM-DD"
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface LinePoint {
  time: string;  // "YYYY-MM-DD"
  value: number;
}

export interface PriceHistoryVenue {
  venueId: string;
  type: "candle" | "line";
  data: OhlcCandle[] | LinePoint[];
}

export interface PriceHistoryResponse {
  venues: PriceHistoryVenue[];
}

// ── Trades ──────────────────────────────────────────────────────────────────

export interface Trade {
  side: "yes" | "no";
  price: number;
  shares: number;
  value: number;
  time: string;
  user: string;
}

export interface TradesResponse {
  trades: Trade[];
}

// Backward-compat aliases
export type OHLCPoint = OhlcCandle;
export type TradeItem = Trade;
