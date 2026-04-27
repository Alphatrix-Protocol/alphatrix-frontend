"use client";

import { useEffect, useState } from "react";
import { createSolanaRpc, address as toAddress } from "@solana/kit";

const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const RPC_URL   = process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.mainnet-beta.solana.com";

export interface UsdcBalance {
  amount:  number | null;
  loading: boolean;
  error:   string | null;
  refresh: () => void;
}

export function useUsdcBalance(walletAddress: string | null): UsdcBalance {
  const [amount,  setAmount]  = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [tick,    setTick]    = useState(0);

  useEffect(() => {
    if (!walletAddress) {
      console.log("[useUsdcBalance] no wallet address — skipping fetch");
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    console.log("[useUsdcBalance] fetching USDC for", walletAddress);

    (async () => {
      try {
        const rpc = createSolanaRpc(RPC_URL);

        const result = await rpc.getTokenAccountsByOwner(
          toAddress(walletAddress),
          { mint: toAddress(USDC_MINT) },
          { encoding: "jsonParsed" },
        ).send();

        if (cancelled) return;

        if (result.value.length === 0) {
          console.log("[useUsdcBalance] no USDC account found — balance is 0");
          setAmount(0);
          return;
        }

        const info = (result.value[0].account.data as {
          parsed: { info: { tokenAmount: { uiAmount: number } } };
        }).parsed.info;

        console.log("[useUsdcBalance] USDC balance:", info.tokenAmount.uiAmount);
        setAmount(info.tokenAmount.uiAmount);
      } catch (e) {
        console.error("[useUsdcBalance] fetch error:", e);
        if (!cancelled) setError("Failed to fetch balance");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [walletAddress, tick]);

  return {
    amount,
    loading,
    error,
    refresh: () => setTick((t) => t + 1),
  };
}
