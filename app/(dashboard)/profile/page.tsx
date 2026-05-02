"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useAuthStore } from "@/lib/store/auth";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  Copy01Icon,
  Tick01Icon,
  UserCircleIcon,
  ShieldKeyIcon,
  Link01Icon,
  Calendar01Icon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons";

const ACCENT = "#7B6EF4";

function truncate(addr: string) {
  return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button onClick={copy} className="flex items-center justify-center transition-opacity hover:opacity-70">
      <HugeiconsIcon
        icon={copied ? Tick01Icon : Copy01Icon}
        size={13}
        color={copied ? "#34d399" : "rgba(255,255,255,0.25)"}
        strokeWidth={1.5}
      />
    </button>
  );
}

function InfoRow({ label, value, mono = false, action }: { label: string; value: string; mono?: boolean; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <span className="text-[11px] shrink-0" style={{ color: "rgba(255,255,255,0.3)", width: 130 }}>{label}</span>
      <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
        <span
          className={`text-[12px] truncate ${mono ? "font-mono" : "font-medium"}`}
          style={{ color: "rgba(255,255,255,0.75)" }}
        >
          {value}
        </span>
        {action}
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: typeof Mail01Icon; children: React.ReactNode }) {
  return (
    <div style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}>
      <div className="flex items-center gap-2 px-5 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <HugeiconsIcon icon={icon} size={13} color="rgba(255,255,255,0.25)" strokeWidth={1.5} />
        <span className="text-[11px] font-semibold text-white uppercase tracking-widest">{title}</span>
      </div>
      <div className="px-5">{children}</div>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = usePrivy();
  const { email, walletAddress, avatarChar, privyUserId } = useAuthStore();

  const createdAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "—";

  const linkedAccounts = user?.linkedAccounts ?? [];
  const linkedTypes    = linkedAccounts.map((a) => a.type);

  const hasEmail  = linkedTypes.includes("email");
  const hasGoogle = linkedTypes.includes("google_oauth");
  const hasWallet = !!walletAddress;

  return (
    <div className="flex flex-col min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between px-8 pt-6 pb-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex flex-col gap-0.5">
          <span className="text-lg font-semibold text-white">Profile</span>
          <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            Your account details and linked identities.
          </span>
        </div>
      </div>

      <div className="flex gap-6 px-8 py-6">

        {/* Left column */}
        <div className="flex flex-col gap-5 flex-1 min-w-0">

          {/* Avatar card */}
          <div
            className="flex items-center gap-5 p-5"
            style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 text-[24px] font-bold"
              style={{ background: `linear-gradient(135deg, ${ACCENT}, #a78bfa)`, color: "white" }}
            >
              {avatarChar}
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-[18px] font-semibold text-white truncate">
                {email ?? (walletAddress ? truncate(walletAddress) : "Unnamed user")}
              </span>
              <div className="flex items-center gap-2">
                {hasEmail  && <Badge label="Email"  color="#7B6EF4" />}
                {hasGoogle && <Badge label="Google" color="#60a5fa" />}
                {hasWallet && <Badge label="Wallet" color="#34d399" />}
              </div>
            </div>
          </div>

          {/* Identity */}
          <Section title="Identity" icon={UserCircleIcon}>
            {email && (
              <InfoRow
                label="Email address"
                value={email}
                action={<CopyButton value={email} />}
              />
            )}
            {hasGoogle && (() => {
              const g = linkedAccounts.find((a) => a.type === "google_oauth") as { email?: string } | undefined;
              return g?.email ? (
                <InfoRow label="Google account" value={g.email} action={<CopyButton value={g.email} />} />
              ) : null;
            })()}
            <InfoRow
              label="User ID"
              value={privyUserId ?? "—"}
              mono
              action={privyUserId ? <CopyButton value={privyUserId} /> : undefined}
            />
            <InfoRow label="Member since" value={createdAt} />
          </Section>

          {/* Wallet */}
          <Section title="Solana Wallet" icon={ShieldKeyIcon}>
            {walletAddress ? (
              <>
                <InfoRow
                  label="Address"
                  value={truncate(walletAddress)}
                  mono
                  action={<CopyButton value={walletAddress} />}
                />
                <InfoRow label="Type" value="Embedded (Privy)" />
                <InfoRow label="Network" value="Solana Mainnet" />
              </>
            ) : (
              <div className="py-5 text-center">
                <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                  No wallet linked
                </span>
              </div>
            )}
          </Section>

        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5 shrink-0" style={{ width: 260 }}>

          {/* Linked accounts */}
          <Section title="Linked Accounts" icon={Link01Icon}>
            <div className="flex flex-col gap-0">
              <LinkedAccountRow
                label="Email"
                icon={Mail01Icon}
                linked={hasEmail}
                value={email}
              />
              <LinkedAccountRow
                label="Google"
                icon={CheckmarkCircle01Icon}
                linked={hasGoogle}
                value={hasGoogle ? "Connected" : null}
              />
              <LinkedAccountRow
                label="Solana wallet"
                icon={ShieldKeyIcon}
                linked={hasWallet}
                value={hasWallet ? "Connected" : null}
                last
              />
            </div>
          </Section>

          {/* Session */}
          <Section title="Session" icon={Calendar01Icon}>
            <InfoRow label="Status" value="Active" />
            <InfoRow label="Provider" value="Privy" />
          </Section>

        </div>
      </div>
    </div>
  );
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="text-[9px] font-semibold px-1.5 py-0.5 uppercase tracking-wide"
      style={{ color, background: `${color}18`, border: `1px solid ${color}30` }}
    >
      {label}
    </span>
  );
}

function LinkedAccountRow({
  label, icon, linked, value, last = false,
}: {
  label: string;
  icon: typeof Mail01Icon;
  linked: boolean;
  value: string | null;
  last?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-3 py-3"
      style={{ borderBottom: last ? "none" : "1px solid rgba(255,255,255,0.04)" }}
    >
      <div
        className="flex items-center justify-center w-7 h-7 shrink-0"
        style={{
          background: linked ? "rgba(52,211,153,0.08)" : "rgba(255,255,255,0.03)",
          border:     `1px solid ${linked ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.07)"}`,
        }}
      >
        <HugeiconsIcon icon={icon} size={12} color={linked ? "#34d399" : "rgba(255,255,255,0.2)"} strokeWidth={1.5} />
      </div>
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span className="text-[11px] font-medium text-white">{label}</span>
        {value && (
          <span className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.3)" }}>{value}</span>
        )}
      </div>
      <span
        className="text-[9px] font-semibold px-1.5 py-0.5 shrink-0"
        style={{
          color:      linked ? "#34d399" : "rgba(255,255,255,0.2)",
          background: linked ? "rgba(52,211,153,0.08)" : "rgba(255,255,255,0.04)",
          border:     `1px solid ${linked ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.07)"}`,
        }}
      >
        {linked ? "Linked" : "Not linked"}
      </span>
    </div>
  );
}
