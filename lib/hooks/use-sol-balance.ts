"use client";

import { useEffect, useState } from "react";
import { createSolanaRpc, address as toAddress } from "@solana/kit";

interface SolBalance {
  lamports: bigint | null;
  sol:      number | null;
  loading:  boolean;
  error:    string | null;
  refresh:  () => void;
}

const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.mainnet-beta.solana.com";

export function useSolBalance(walletAddress: string | null): SolBalance {
  const [lamports, setLamports] = useState<bigint | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [tick,     setTick]     = useState(0);

  useEffect(() => {
    if (!walletAddress) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const rpc    = createSolanaRpc(RPC_URL);
        const result = await rpc.getBalance(toAddress(walletAddress)).send();
        if (!cancelled) setLamports(result.value);
      } catch (e) {
        if (!cancelled) setError("Failed to fetch balance");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [walletAddress, tick]);

  return {
    lamports,
    sol:     lamports !== null ? Number(lamports) / 1e9 : null,
    loading,
    error,
    refresh: () => setTick((t) => t + 1),
  };
}
