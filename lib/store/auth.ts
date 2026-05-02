import { create } from "zustand";

export interface AuthState {
  isReady:          boolean;
  isAuthenticated:  boolean;
  // Privy
  privyUserId:      string | null;
  email:            string | null;
  walletAddress:    string | null;   // Privy embedded wallet
  // Backend (populated after /auth/me resolves)
  backendUserId:    string | null;   // Alpatrix internal UUID — use this for orders/positions
  solanaAddress:    string | null;   // backend-managed Solana address
  usdcTokenAddress: string | null;
  // Derived display helpers
  displayName:      string | null;
  avatarChar:       string;
}

interface AuthActions {
  setAuth: (partial: Partial<AuthState>) => void;
  clear:   () => void;
}

const INITIAL: AuthState = {
  isReady:          false,
  isAuthenticated:  false,
  privyUserId:      null,
  email:            null,
  walletAddress:    null,
  backendUserId:    null,
  solanaAddress:    null,
  usdcTokenAddress: null,
  displayName:      null,
  avatarChar:       "U",
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  ...INITIAL,

  setAuth(partial) {
    set((prev) => {
      const next    = { ...prev, ...partial };
      const display = next.email ?? (next.walletAddress ? `${next.walletAddress.slice(0, 6)}...${next.walletAddress.slice(-4)}` : null);
      const avatar  = next.email ? next.email[0].toUpperCase() : next.walletAddress ? next.walletAddress[0].toUpperCase() : "U";
      return { ...next, displayName: display, avatarChar: avatar };
    });
  },

  clear() {
    set(INITIAL);
  },
}));
