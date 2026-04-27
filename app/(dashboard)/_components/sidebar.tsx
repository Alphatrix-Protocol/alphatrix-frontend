"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home01Icon,
  News01Icon,
  PieChart01Icon,
  Notification01Icon,
  Settings01Icon,
  ArrowRight01Icon,
  Robot01Icon,
  Copy01Icon,
  Tick01Icon,
  LogoutIcon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import { useLogout } from "@privy-io/react-auth";
import { useAuthStore } from "@/lib/store/auth";

const NAV = [
  { label: "Dashboard",   href: "/dashboard",    icon: Home01Icon         },
  { label: "Feeds",       href: "/feeds",         icon: News01Icon         },
  { label: "Portfolio",   href: "/portfolio",     icon: PieChart01Icon     },
  { label: "Alerts",      href: "/alerts",        icon: Notification01Icon },
  { label: "Alpha Agent", href: "/alpha-agent",   icon: Robot01Icon        },
  { label: "Settings",    href: "/settings",      icon: Settings01Icon     },
];

const ACCENT = "#7B6EF4";

function Timestamp() {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const day = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      setDisplay(`${day} · ${time}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <span className="text-[13px] tabular-nums text-gray-400">{display}</span>;
}

function truncate(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function SignOutModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onCancel}
    >
      <div
        className="flex flex-col gap-4 p-5 w-[280px]"
        style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-1">
          <span className="text-[14px] font-semibold text-white">Sign out?</span>
          <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.35)" }}>
            You&apos;ll need to sign back in to access your account.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2 text-[12px] font-medium transition-all"
            style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)", background: "transparent" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 text-[12px] font-semibold transition-all"
            style={{ background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.2)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.12)")}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

function UserCard() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);

  const { logout } = useLogout({ onSuccess: () => router.replace("/") });
  const { email, walletAddress, displayName, avatarChar } = useAuthStore();

  const displayAddress = walletAddress ? truncate(walletAddress) : null;

  async function handleSignOut() {
    setShowSignOut(false);
    await logout();
  }

  function copy() {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      {showSignOut && (
        <SignOutModal
          onConfirm={handleSignOut}
          onCancel={() => setShowSignOut(false)}
        />
      )}

      <div className="relative overflow-hidden rounded-xl p-px">
        {/* Rotating gradient border */}
        <div
          className="absolute"
          style={{
            inset: "-60%",
            background: "conic-gradient(from 0deg, transparent 0%, transparent 40%, #7B6EF4 55%, #a78bfa 65%, transparent 80%)",
            animation: "gradient-spin 4s linear infinite",
          }}
        />

        <div
          className="relative flex flex-col gap-2 p-2.5 rounded-xl"
          style={{ background: "#1a1a1a" }}
        >
          {/* Top row: avatar + identity */}
          <Link href="/profile" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[12px] font-bold"
              style={{ background: `linear-gradient(135deg, ${ACCENT}, #a78bfa)`, color: "white" }}
            >
              {avatarChar}
            </div>
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <span className="text-[11px] font-semibold text-white leading-none truncate">
                {displayName ?? "Connected"}
              </span>
              <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>View profile</span>
            </div>
          </Link>

          {/* Wallet address row */}
          {displayAddress && (
            <div
              className="flex items-center justify-between px-2 py-1.5"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span className="text-[14px] font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>
                {displayAddress}
              </span>
              <button
                onClick={copy}
                className="flex items-center justify-center transition-opacity hover:opacity-80 shrink-0 ml-1"
              >
                <HugeiconsIcon
                  icon={copied ? Tick01Icon : Copy01Icon}
                  size={14}
                  color={copied ? "#34d399" : "rgba(255,255,255,0.25)"}
                  strokeWidth={1.5}
                />
              </button>
            </div>
          )}

          {/* Sign out */}
          <button
            onClick={() => setShowSignOut(true)}
            className="flex items-center gap-1.5 px-2 py-1 transition-all w-full"
            style={{ color: "rgba(255,255,255,0.2)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(248,113,113,0.7)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.2)")}
          >
            <HugeiconsIcon icon={LogoutIcon} size={11} color="currentColor" strokeWidth={1.5} />
            <span className="text-[13px] font-medium">Sign out</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="flex flex-col w-[210px] h-screen sticky top-0 shrink-0 overflow-hidden"
      style={{ background: "#1a1a1a", borderRight: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* Logo */}
      <div className="px-5 pt-5 pb-1 flex items-center gap-2">
        <div className="size-6 bg-white rounded">
          <Image src="/applogo.png" alt="Alpatrix Logo" width={20} height={20} className="object-cover" />
        </div>
        <span className="text-[16px] font-semibold tracking-wide text-white">Alpatrix</span>
      </div>

      {/* Timestamp */}
      <div className="mx-5 pb-4">
        <Timestamp />
      </div>

      <div className="mb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }} />

      {/* Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-px">
        {NAV.map(({ label, href, icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-[7px] rounded-md transition-colors"
              style={{
                background: active ? "rgba(255,255,255,0.06)" : "transparent",
                color: active ? "#fff" : "rgba(255,255,255,0.35)",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)";
                }
              }}
            >
              <HugeiconsIcon
                icon={icon}
                size={14}
                strokeWidth={active ? 2 : 1.5}
                color={active ? ACCENT : "currentColor"}
              />
              <span className="text-[15px] font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User card */}
      <div className="px-3 pb-4">
        <UserCard />
      </div>
    </aside>
  );
}
