"use client";

import { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useWallets } from "@privy-io/react-auth/solana";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store/auth";
import { registerTokenGetter } from "@/lib/api/auth-token";
import { authService } from "@/lib/api/services/auth.service";
import { apiQueryKeys } from "@/lib/api/query-keys";

export default function AuthSync() {
  const { ready, authenticated, user, getAccessToken } = usePrivy();
  const { wallets } = useWallets();
  const { setAuth, clear } = useAuthStore();

  // Wire Privy's JWT into the axios interceptor once on mount
  useEffect(() => {
    registerTokenGetter(() => getAccessToken());
    return () => registerTokenGetter(null);
  }, [getAccessToken]);

  // Fetch backend user — auto-creates on first call, gives us the internal UUID
  const { data: backendMe } = useQuery({
    queryKey: apiQueryKeys.auth.me(),
    queryFn:  () => authService.getMe(),
    enabled:  ready && authenticated,
    staleTime: 5 * 60_000,
    retry: 1,
  });

  useEffect(() => {
    if (!ready) return;

    if (!authenticated || !user) {
      clear();
      return;
    }

    const email = user.email?.address ?? (user.google as { email?: string } | undefined)?.email ?? null;

    // Find the Privy-embedded Solana wallet from the user's linked accounts
    // (typed accurately — walletClientType and chainType are on WalletWithMetadata)
    const embeddedSolana = user.linkedAccounts.find(
      (a) =>
        a.type === "wallet" &&
        (a as { chainType?: string }).chainType === "solana" &&
        (a as { walletClientType?: string }).walletClientType === "privy",
    ) as { address: string } | undefined;

    // Fall back to first Solana wallet from the hook (e.g. external wallet connected)
    const solanaAddress = embeddedSolana?.address ?? wallets[0]?.address ?? null;

    setAuth({
      isReady:          true,
      isAuthenticated:  true,
      privyUserId:      user.id,
      email:            backendMe?.email ?? email,
      walletAddress:    solanaAddress,
      // Backend fields — set when /auth/me resolves; undefined leaves existing value intact
      ...(backendMe && {
        backendUserId:    backendMe.id,
        solanaAddress:    backendMe.solanaAddress,
        usdcTokenAddress: backendMe.usdcTokenAddress,
      }),
    });
  }, [ready, authenticated, user, wallets, backendMe, setAuth, clear]);

  return null;
}
