export type Platform = "kalshi" | "polymarket" | "bayse";
export type View = "card" | "list";

export interface Market {
  id: string;
  title: string;
  image: string;
  category: string;
  price: number;
  change: number;
  volume: string;
  closeDate: string;
  platform: Platform;
  cross?: { platform: Platform; price: number };
}

export const PLATFORM_META: Record<Platform, { label: string; color: string; bg: string }> = {
  kalshi:     { label: "Kalshi",     color: "#fff", bg: "#0050FF" },
  polymarket: { label: "Polymarket", color: "#fff", bg: "#6E3FF3" },
  bayse:      { label: "Bayse",      color: "#fff", bg: "#111" },
};

export const MARKETS: Market[] = [
  { id: "1", title: "Will Bitcoin hit $100K by end of March?",             category: "Crypto",   image: "https://picsum.photos/seed/bitcoin/120/120",     price: 34, change: +7.2, volume: "$2.1M", closeDate: "Mar 31", platform: "polymarket" },
  { id: "2", title: "Will the Fed cut rates in May 2026?",                  category: "Economy",  image: "https://picsum.photos/seed/federal/120/120",     price: 62, change: +3.1, volume: "$890K", closeDate: "May 7",  platform: "polymarket" },
  { id: "3", title: "Will Arsenal win the 2025–26 Premier League?",        category: "Sports",   image: "https://picsum.photos/seed/arsenal/120/120",     price: 48, change: +4.0, volume: "$672K", closeDate: "May 24", platform: "polymarket" },
  { id: "4", title: "Will Google have the best AI model at end of March?", category: "Tech",     image: "https://picsum.photos/seed/google/120/120",      price: 16, change: -4.6, volume: "$527K", closeDate: "Mar 31", platform: "polymarket" },
  { id: "5", title: "Will Anthropic have the best AI model in March?",     category: "Tech",     image: "https://picsum.photos/seed/anthropic/120/120",   price: 76, change: -3.8, volume: "$625K", closeDate: "Mar 17", platform: "polymarket" },
  { id: "6", title: "Will Ethereum flip Bitcoin in market cap 2026?",      category: "Crypto",   image: "https://picsum.photos/seed/ethereum/120/120",    price: 12, change: +1.5, volume: "$310K", closeDate: "Dec 31", platform: "polymarket" },
  { id: "7", title: "Will Trump approval rating exceed 55% this quarter?", category: "Politics", image: "https://picsum.photos/seed/politics2026/120/120", price: 28, change: -2.1, volume: "$1.4M", closeDate: "Jun 30", platform: "polymarket" },
  { id: "8", title: "Will Tesla stock hit $400 before April?",              category: "Economy",  image: "https://picsum.photos/seed/tesla/120/120",       price: 41, change: +5.9, volume: "$740K", closeDate: "Mar 28", platform: "polymarket" },
];

export const FILTERS = ["All", "Crypto", "Politics", "Sports", "Economy", "Tech"];
