"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isReady, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isReady && !isAuthenticated) router.replace("/");
  }, [isReady, isAuthenticated, router]);

  if (!isReady || !isAuthenticated) {
    return <div className="min-h-screen" style={{ background: "#111111" }} />;
  }

  return <>{children}</>;
}
