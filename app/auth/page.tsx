"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, ArrowRight01Icon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail]         = useState("");
  const [magicSent, setMagicSent] = useState(false);
  const [loading, setLoading]     = useState<"google" | "passkey" | "magic" | null>(null);

  async function handleGoogle() {
    setLoading("google");
    // TODO: Google OAuth
    setTimeout(() => { setLoading(null); router.replace("/dashboard"); }, 800);
  }

  async function handlePasskey() {
    setLoading("passkey");
    // TODO: WebAuthn passkey
    setTimeout(() => { setLoading(null); router.replace("/dashboard"); }, 800);
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading("magic");
    // TODO: send magic link
    setTimeout(() => { setLoading(null); setMagicSent(true); }, 800);
  }

  return (
    <>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 0.7s linear infinite; }
      `}</style>

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
              <span className="text-[20px] font-semibold text-white tracking-tight">Alpatrix</span>
              <span className="text-[14px]" style={{ color: "rgba(255,255,255,0.3)" }}>Sign in to continue</span>
            </div>
          </div>

          {/* Auth options */}
          <div className="flex flex-col gap-3 w-full">

            <AuthBtn
              onClick={handleGoogle}
              loading={loading === "google"}
              icon={<GoogleSVG />}
              label="Continue with Google"
            />

            <AuthBtn
              onClick={handlePasskey}
              loading={loading === "passkey"}
              icon={<PasskeySVG />}
              label="Continue with Passkey"
            />

            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
              <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.2)" }}>or</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
            </div>

            {magicSent ? (
              <div className="flex flex-col items-center gap-3 py-5">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} size={24} color="#34d399" strokeWidth={1.5} />
                <div className="flex flex-col items-center gap-1 text-center">
                  <span className="text-[15px] font-medium text-white">Check your inbox</span>
                  <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                    Magic link sent to{" "}
                    <span style={{ color: "rgba(255,255,255,0.6)" }}>{email}</span>
                  </span>
                </div>
                <button
                  onClick={() => { setMagicSent(false); setEmail(""); }}
                  className="text-[13px] transition-colors"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.25)")}
                >
                  Try a different email
                </button>
              </div>
            ) : (
              <form onSubmit={handleMagicLink} className="flex flex-col gap-2.5">
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <HugeiconsIcon icon={Mail01Icon} size={15} color="rgba(255,255,255,0.22)" strokeWidth={1.5} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full pl-10 pr-4 py-3 text-[14px] text-white outline-none transition-colors placeholder:text-[rgba(255,255,255,0.2)]"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border:     "1px solid rgba(255,255,255,0.08)",
                    }}
                    onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.18)")}
                    onBlur={(e)  => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)")}
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={!email.trim() || loading === "magic"}
                  className="w-full justify-center"
                >
                  {loading === "magic" ? <Spinner /> : "Send magic link"}
                </Button>
              </form>
            )}
          </div>

          <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.15)" }}>
            Non-custodial · Built on Solana
          </span>
        </div>
      </div>
    </>
  );
}

function AuthBtn({
  onClick, loading, icon, label,
}: {
  onClick: () => void;
  loading: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center justify-center gap-3 w-full px-4 py-3 text-[14px] font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        background: "rgba(255,255,255,0.04)",
        border:     "1px solid rgba(255,255,255,0.08)",
        color:      "rgba(255,255,255,0.75)",
      }}
      onMouseEnter={(e) => {
        if (!e.currentTarget.disabled)
          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
      }}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)")}
    >
      <span className="w-5 h-5 flex items-center justify-center shrink-0">
        {loading ? <Spinner /> : icon}
      </span>
      {label}
    </button>
  );
}

function Spinner() {
  return (
    <svg className="spin" width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="5.5" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      <path d="M7.5 2a5.5 5.5 0 0 1 5.5 5.5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function GoogleSVG() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.874 2.6836-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.4673-.8059 5.9564-2.1805l-2.9087-2.2581c-.8059.54-1.8368.859-3.0477.859-2.3441 0-4.3282-1.5831-5.036-3.7104H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71c-.18-.54-.2827-1.1168-.2827-1.71s.1022-1.17.2827-1.71V4.9582H.9574C.3477 6.1731 0 7.5477 0 9s.3477 2.8268.9574 4.0418L3.964 10.71z" fill="#FBBC05"/>
      <path d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4632.8918 11.4259 0 9 0 5.4818 0 2.4382 2.0168.9574 4.9582L3.964 7.29C4.6718 5.1627 6.6559 3.5795 9 3.5795z" fill="#EA4335"/>
    </svg>
  );
}

function PasskeySVG() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="9" r="4" />
      <path d="M12 9h9M17 7v4" />
      <path d="M3 20c0-3 2.5-5 5-5h1" />
    </svg>
  );
}
