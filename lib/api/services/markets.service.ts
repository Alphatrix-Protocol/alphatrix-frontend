import { apiRequest } from "@/lib/api/client";
import type {
  MarketDetailResponse,
  MarketListResponse,
  MarketsQuery,
  PriceHistoryResponse,
  TradesResponse,
} from "@/lib/api/types";

export const marketsService = {
  listMarkets(query?: MarketsQuery) {
    return apiRequest<MarketListResponse>("/markets", {
      query: query
        ? {
            category: query.category,
            status: query.status,
            venueId: query.venueId,
            page: query.page,
            size: query.size,
          }
        : undefined,
    });
  },

  getMarket(id: string) {
    return apiRequest<MarketDetailResponse>(`/markets/${encodeURIComponent(id)}`);
  },

  triggerSync() {
    return apiRequest<{ message: string }>("/markets/sync", { method: "POST" });
  },

  getPriceHistory(id: string, range: string) {
    return apiRequest<PriceHistoryResponse>(`/markets/${encodeURIComponent(id)}/price-history`, {
      query: { range },
    });
  },

  getTrades(id: string, limit: number) {
    return apiRequest<TradesResponse>(`/markets/${encodeURIComponent(id)}/trades`, {
      query: { limit },
    });
  },
};
