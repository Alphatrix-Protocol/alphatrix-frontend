import { apiRequest } from "@/lib/api/client";
import type { MeResponse } from "@/lib/api/types";

export const authService = {
  getMe() {
    return apiRequest<MeResponse>("/auth/me");
  },
};
