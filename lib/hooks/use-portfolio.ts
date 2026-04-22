import { useQuery } from "@tanstack/react-query";

export const portfolioKeys = {
  all:          ()           => ["portfolio"]                    as const,
  positions:    ()           => ["portfolio", "positions"]       as const,
  transactions: ()           => ["portfolio", "transactions"]    as const,
  performance:  (range: string) => ["portfolio", "performance", range] as const,
};

async function fetchPositions() {
  const res = await fetch("/api/portfolio/positions");
  if (!res.ok) throw new Error("Failed to fetch positions");
  return res.json();
}

async function fetchTransactions() {
  const res = await fetch("/api/portfolio/transactions");
  if (!res.ok) throw new Error("Failed to fetch transactions");
  return res.json();
}

async function fetchPerformance(range: string) {
  const res = await fetch(`/api/portfolio/performance?range=${range}`);
  if (!res.ok) throw new Error("Failed to fetch performance");
  return res.json();
}

export function usePositions() {
  return useQuery({
    queryKey: portfolioKeys.positions(),
    queryFn:  fetchPositions,
  });
}

export function useTransactions() {
  return useQuery({
    queryKey: portfolioKeys.transactions(),
    queryFn:  fetchTransactions,
  });
}

export function usePerformance(range: string) {
  return useQuery({
    queryKey: portfolioKeys.performance(range),
    queryFn:  () => fetchPerformance(range),
  });
}
