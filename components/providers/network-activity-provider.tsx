"use client";

import { useEffect } from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { useNetworkActivityStore } from "@/lib/store/network-activity";

export default function NetworkActivityProvider() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const setPendingCount = useNetworkActivityStore((state) => state.setPendingCount);

  useEffect(() => {
    setPendingCount(isFetching + isMutating);
  }, [isFetching, isMutating, setPendingCount]);

  return null;
}
