"use client";

import { useQuery } from "@tanstack/react-query";
import { apiQueryKeys } from "@/lib/api/query-keys";
import { authService } from "@/lib/api/services/auth.service";

export function useBackendMe(enabled: boolean) {
  return useQuery({
    queryKey: apiQueryKeys.auth.me(),
    queryFn: () => authService.getMe(),
    enabled,
    staleTime: 60_000,
    retry: 1,
  });
}
