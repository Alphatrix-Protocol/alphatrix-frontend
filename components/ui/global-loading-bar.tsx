"use client";

import { useNetworkActivityStore } from "@/lib/store/network-activity";

export default function GlobalLoadingBar() {
  const isBusy = useNetworkActivityStore((state) => state.isBusy);

  return (
    <div
      aria-hidden={!isBusy}
      aria-busy={isBusy}
      className={`pointer-events-none fixed left-0 top-0 z-[100] h-0.5 w-full overflow-hidden transition-opacity duration-200 ${
        isBusy ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="h-full w-1/3 animate-[global-loading_1.2s_ease-in-out_infinite] bg-primary" />
    </div>
  );
}
