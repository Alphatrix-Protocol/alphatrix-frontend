import { useQuery } from "@tanstack/react-query";
import {
  fetchBayseMarkets,
  fetchBayseTrending,
  fetchBayseByCategory,
} from "@/services/bayse.service";

export const bayseKeys = {
  all:      ()                          => ["bayse"]                             as const,
  markets:  (size?: number)             => ["bayse", "markets", size]            as const,
  trending: (size?: number)             => ["bayse", "trending", size]           as const,
  category: (cat: string, size?: number) => ["bayse", "category", cat, size]    as const,
};

export function useBayseMarkets(size = 20) {
  return useQuery({
    queryKey:  bayseKeys.markets(size),
    queryFn:   () => fetchBayseMarkets(size),
    staleTime: 60_000,
  });
}

export function useBayseTrending(size = 10) {
  return useQuery({
    queryKey:  bayseKeys.trending(size),
    queryFn:   () => fetchBayseTrending(size),
    staleTime: 60_000,
  });
}

export function useBayseByCategory(category: string, size = 20) {
  return useQuery({
    queryKey: bayseKeys.category(category, size),
    queryFn:  () => fetchBayseByCategory(category, size),
    enabled:  !!category && category !== "All",
    staleTime: 60_000,
  });
}
