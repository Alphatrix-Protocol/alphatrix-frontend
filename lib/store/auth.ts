import { create } from "zustand";

export interface AuthState {
  isReady:         boolean;
  isAuthenticated: boolean;
  userId:          string | null;
  email:           string | null;
  walletAddress:   string | null;
  // Derived
  displayName:     string | null;
  avatarChar:      string;
}

interface AuthActions {
  setAuth: (state: Partial<AuthState>) => void;
  clear:   () => void;
}

const INITIAL: AuthState = {
  isReady:         false,
  isAuthenticated: false,
  userId:          null,
  email:           null,
  walletAddress:   null,
  displayName:     null,
  avatarChar:      "U",
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  ...INITIAL,

  setAuth(partial) {
    set((prev) => {
      const next     = { ...prev, ...partial };
      const display  = next.email ?? (next.walletAddress ? `${next.walletAddress.slice(0, 6)}...${next.walletAddress.slice(-4)}` : null);
      const avatar   = next.email ? next.email[0].toUpperCase() : next.walletAddress ? next.walletAddress[0].toUpperCase() : "U";
      return { ...next, displayName: display, avatarChar: avatar };
    });
  },

  clear() {
    set(INITIAL);
  },
}));
