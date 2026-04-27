"use client";

import { useEffect } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useAuthStore } from "@/lib/store/auth";

export default function AuthSync() {
  const { ready, authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const { setAuth, clear } = useAuthStore();

  useEffect(() => {
    if (!ready) return;

    if (!authenticated || !user) {
      clear();
      return;
    }

    const email         = user.email?.address ?? (user.google as { email?: string } | undefined)?.email ?? null;
    const solanaWallet  = wallets.find((w) => !w.address.startsWith("0x"));
    const walletAddress = solanaWallet?.address ?? null;

    setAuth({
      isReady:         true,
      isAuthenticated: true,
      userId:          user.id,
      email,
      walletAddress,
    });
  }, [ready, authenticated, user, wallets, setAuth, clear]);

  return null;
}
