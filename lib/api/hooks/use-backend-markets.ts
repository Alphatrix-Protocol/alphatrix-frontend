"use client";

import { useMutation, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { apiQueryKeys } from "@/lib/api/query-keys";
import { marketsService } from "@/lib/api/services/markets.service";
import type { MarketsQuery } from "@/lib/api/types";

const PAGE_SIZE = 20;

export function useInfiniteMarkets(query?: Omit<MarketsQuery, "page" | "size">) {
  return useInfiniteQuery({
    queryKey: ["api", "markets", "infinite", query ?? {}],
    queryFn: ({ pageParam }) =>
      marketsService.listMarkets({ ...query, page: pageParam as number, size: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const fetched = (lastPage.page - 1) * lastPage.size + lastPage.data.length;
      return fetched < lastPage.total ? lastPage.page + 1 : undefined;
    },
    staleTime: 30_000,
  });
}

const DEFAULT_TRADE_LIMIT = 20;

export function useBackendMarkets(query?: MarketsQuery, enabled = true) {
  return useQuery({
    queryKey: apiQueryKeys.markets.list(query),
    queryFn: () => marketsService.listMarkets(query),
    enabled,
    staleTime: 30_000,
  });
}

export function useBackendMarket(id?: string) {
  return useQuery({
    queryKey: apiQueryKeys.markets.detail(id ?? ""),
    queryFn: () => marketsService.getMarket(id ?? ""),
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}

export function useTriggerMarketSync() {
  return useMutation({
    mutationFn: () => marketsService.triggerSync(),
  });
}

export function useMarketPriceHistory(id: string, range = "3M") {
  return useQuery({
    queryKey: apiQueryKeys.markets.priceHistory(id, range),
    queryFn:  () => marketsService.getPriceHistory(id, range),
    enabled:  Boolean(id),
    staleTime: 60_000,
  });
}

export function useMarketTrades(id: string, limit = DEFAULT_TRADE_LIMIT) {
  return useQuery({
    queryKey: apiQueryKeys.markets.trades(id, limit),
    queryFn:  () => marketsService.getTrades(id, limit),
    enabled:  Boolean(id),
    staleTime: 15_000,
  });
}
