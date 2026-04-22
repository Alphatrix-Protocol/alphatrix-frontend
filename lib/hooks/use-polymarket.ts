import { useQuery } from "@tanstack/react-query";
import {
  fetchMarkets,
  fetchEventBySlug,
  fetchMarketsByCategory,
  fetchClosedMarkets,
  fetchOrderbook,
  fetchPrice,
} from "@/services/polymarket.service";

// ── Query keys ────────────────────────────────────────────────────────────────
export const polymarketKeys = {
  all:        ()                         => ["polymarket"]                              as const,
  markets:    (limit?: number)           => ["polymarket", "markets", limit]            as const,
  category:   (cat: string, limit?: number) => ["polymarket", "category", cat, limit]  as const,
  event:      (slug: string)             => ["polymarket", "event", slug]               as const,
  closed:     (limit?: number)           => ["polymarket", "closed", limit]             as const,
  orderbook:  (tokenId: string)          => ["polymarket", "orderbook", tokenId]        as const,
  price:      (tokenId: string)          => ["polymarket", "price", tokenId]            as const,
};

// ── Hooks ─────────────────────────────────────────────────────────────────────

/** Active markets as opportunity briefs */
export function useMarkets(limit = 20) {
  return useQuery({
    queryKey: polymarketKeys.markets(limit),
    queryFn:  () => fetchMarkets(limit),
    staleTime: 60_000,
  });
}

/** Markets filtered by category */
export function useMarketsByCategory(category: string, limit = 20) {
  return useQuery({
    queryKey: polymarketKeys.category(category, limit),
    queryFn:  () => fetchMarketsByCategory(category, limit),
    enabled:  !!category && category !== "All",
    staleTime: 60_000,
  });
}

/** Single event by slug */
export function useEvent(slug: string) {
  return useQuery({
    queryKey: polymarketKeys.event(slug),
    queryFn:  () => fetchEventBySlug(slug),
    enabled:  !!slug,
    staleTime: 30_000,
  });
}

/** Closed markets */
export function useClosedMarkets(limit = 20) {
  return useQuery({
    queryKey: polymarketKeys.closed(limit),
    queryFn:  () => fetchClosedMarkets(limit),
    staleTime: 120_000,
  });
}

/** CLOB orderbook — short stale time for live data */
export function useOrderbook(tokenId: string) {
  return useQuery({
    queryKey: polymarketKeys.orderbook(tokenId),
    queryFn:  () => fetchOrderbook(tokenId),
    enabled:  !!tokenId,
    staleTime: 10_000,
    refetchInterval: 15_000,
  });
}

/** CLOB spot price */
export function usePrice(tokenId: string) {
  return useQuery({
    queryKey: polymarketKeys.price(tokenId),
    queryFn:  () => fetchPrice(tokenId),
    enabled:  !!tokenId,
    staleTime: 10_000,
    refetchInterval: 15_000,
  });
}
