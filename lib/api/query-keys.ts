import type { MarketsQuery } from "@/lib/api/types";

export const apiQueryKeys = {
  auth: {
    me: () => ["api", "auth", "me"] as const,
  },
  markets: {
    list:         (query?: MarketsQuery) => ["api", "markets", "list", query ?? {}] as const,
    detail:       (id: string)           => ["api", "markets", "detail", id] as const,
    priceHistory: (id: string, range: string) => ["api", "markets", "price-history", id, range] as const,
    trades:       (id: string, limit: number) => ["api", "markets", "trades", id, limit] as const,
  },
};
