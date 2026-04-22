import { useMarkets } from "./use-polymarket";
import { useBayseMarkets } from "./use-bayse";
import type { OpportunityBrief } from "@/services/polymarket.service";

/** Round-robin interleave: picks one from each list alternately */
function interleave(a: OpportunityBrief[], b: OpportunityBrief[]): OpportunityBrief[] {
  const result: OpportunityBrief[] = [];
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (i < a.length) result.push(a[i]);
    if (i < b.length) result.push(b[i]);
  }
  return result;
}

/**
 * Fetches markets from both Polymarket and Bayse and interleaves them
 * so they appear mixed rather than all of one platform at the bottom.
 */
export function useCombinedMarkets(limitEach = 20) {
  const poly = useMarkets(limitEach);
  const bayse = useBayseMarkets(limitEach);

  const isLoading = poly.isLoading || bayse.isLoading;
  const isError   = poly.isError && bayse.isError;

  const combined = interleave(poly.data ?? [], bayse.data ?? []);

  return { data: combined, isLoading, isError };
}
