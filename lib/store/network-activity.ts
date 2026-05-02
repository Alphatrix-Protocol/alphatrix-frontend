import { create } from "zustand";

interface NetworkActivityState {
  pendingCount: number;
  isBusy: boolean;
  setPendingCount: (count: number) => void;
}

export const useNetworkActivityStore = create<NetworkActivityState>((set) => ({
  pendingCount: 0,
  isBusy: false,
  setPendingCount: (count) =>
    set({
      pendingCount: count,
      isBusy: count > 0,
    }),
}));
