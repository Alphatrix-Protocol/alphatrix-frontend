export type Platform = "polymarket" | "bayse";
export type View = "card" | "list";

export const PLATFORM_META: Record<Platform, { label: string }> = {
  polymarket: { label: "Polymarket"   },
  bayse:      { label: "Bayes Market" },
};

export const FILTERS = ["All", "crypto", "politics", "sports", "economics", "tech"];
