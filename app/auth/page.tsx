"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { usePrivy, useLogin } from "@privy-io/react-auth";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";

function SolanaIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 128 128" fill="none">
      <path d="M21.7 96.6c.7-.7 1.6-1.1 2.6-1.1h88.4c1.6 0 2.4 2 1.3 3.1l-17.5 17.5c-.7.7-1.6 1.1-2.6 1.1H5.5c-1.6 0-2.4-2-1.3-3.1l17.5-17.5z" fill="rgba(255,255,255,0.6)"/>
      <path d="M21.7 11.6C22.4 10.9 23.3 10.5 24.3 10.5h88.4c1.6 0 2.4 2 1.3 3.1L96.5 31.1c-.7.7-1.6 1.1-2.6 1.1H5.5c-1.6 0-2.4-2-1.3-3.1l17.5-17.5z" fill="rgba(255,255,255,0.6)"/>
      <path d="M96.5 53.9c-.7-.7-1.6-1.1-2.6-1.1H5.5c-1.6 0-2.4 2-1.3 3.1l17.5 17.5c.7.7 1.6 1.1 2.6 1.1h88.4c1.6 0 2.4-2 1.3-3.1L96.5 53.9z" fill="rgba(255,255,255,0.6)"/>
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin" width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="5.5" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      <path d="M7.5 2a5.5 5.5 0 0 1 5.5 5.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function AuthPage() {
  const router  = useRouter();
  const { ready, authenticated } = usePrivy();

  const { login: loginEmail } = useLogin({
    onComplete: () => router.replace("/dashboard"),
  });

  const { login: loginWallet } = useLogin({
    onComplete: () => router.replace("/dashboard"),
  });

  useEffect(() => {
    if (ready && authenticated) router.replace("/dashboard");
  }, [ready, authenticated, router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#111" }}>
        <Spinner />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "#111111" }}
    >
      <div className="flex flex-col items-center gap-10 w-full max-w-[360px]">

        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 bg-white rounded-lg overflow-hidden">
            <Image src="/applogo.png" alt="Alpatrix" width={40} height={40} className="object-cover" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[20px] font-semibold text-white tracking-tight">Welcome back</span>
            <span className="text-[14px]" style={{ color: "rgba(255,255,255,0.3)" }}>
              Sign in to access your account
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full">

          {/* Email */}
          <button
            onClick={() => loginEmail({ loginMethods: ["email"] })}
            className="flex items-center justify-center gap-3 w-full px-4 py-3 text-[14px] font-semibold transition-all"
            style={{ background: "#7B6EF4", color: "#fff" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#6d62e0")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#7B6EF4")}
          >
            <HugeiconsIcon icon={Mail01Icon} size={15} color="#fff" strokeWidth={1.8} />
            Continue with Email
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
            <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.2)" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
          </div>

          {/* Solana wallet */}
          <button
            onClick={() => loginWallet({ loginMethods: ["wallet"] })}
            className="flex items-center justify-center gap-3 w-full px-4 py-3 text-[14px] font-medium transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border:     "1px solid rgba(255,255,255,0.08)",
              color:      "rgba(255,255,255,0.75)",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)")}
          >
            <SolanaIcon />
            Connect Solana Wallet
          </button>

          <span className="text-center text-[12px]" style={{ color: "rgba(255,255,255,0.2)" }}>
            We&apos;ll create a Solana wallet for you automatically.
          </span>
        </div>

        {/* Back */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[13px] transition-colors"
          style={{ color: "rgba(255,255,255,0.2)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.2)")}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={12} color="currentColor" strokeWidth={2} />
          Back to home
        </Link>

      </div>
    </div>
  );
}
