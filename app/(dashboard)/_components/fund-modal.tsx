"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import { HugeiconsIcon } from "@hugeicons/react";
import { Copy01Icon, Tick01Icon, Cancel01Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";

interface FundModalProps {
  address: string;
  onClose: () => void;
}

const ASSETS = [
  { id: "sol",  label: "SOL",  sub: "Native gas token",   color: "#9945FF" },
  { id: "usdc", label: "USDC", sub: "USD Coin · Solana",  color: "#2775CA" },
] as const;

export default function FundModal({ address, onClose }: FundModalProps) {
  const [copied,       setCopied]       = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<"sol" | "usdc">("usdc");

  function copy() {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  const short = `${address.slice(0, 12)}...${address.slice(-10)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="flex flex-col w-[420px] overflow-hidden"
        style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.08)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] font-semibold text-white">Fund account</span>
            <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
              Send assets to your Solana wallet
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 transition-all"
            style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={12} color="currentColor" strokeWidth={2} />
          </button>
        </div>

        <div className="flex flex-col gap-5 p-5">

          {/* Asset selector */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>
              Asset
            </span>
            <div className="grid grid-cols-2 gap-2">
              {ASSETS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedAsset(a.id)}
                  className="flex items-center gap-2.5 px-3 py-2.5 transition-all text-left"
                  style={{
                    background: selectedAsset === a.id ? `${a.color}14` : "rgba(255,255,255,0.03)",
                    border:     `1px solid ${selectedAsset === a.id ? `${a.color}40` : "rgba(255,255,255,0.07)"}`,
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold"
                    style={{ background: a.color, color: "#fff" }}
                  >
                    {a.label[0]}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-semibold text-white leading-none">{a.label}</span>
                    <span className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{a.sub}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* QR code */}
          <div className="flex justify-center">
            <div className="p-3" style={{ background: "#fff" }}>
              <QRCode value={address} size={160} />
            </div>
          </div>

          {/* Address */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>
              Your wallet address
            </span>
            <div
              className="flex items-center justify-between gap-3 px-3 py-3"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <span className="text-[12px] font-mono" style={{ color: "rgba(255,255,255,0.6)" }}>
                {short}
              </span>
              <button
                onClick={copy}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium transition-all shrink-0"
                style={{
                  background: copied ? "rgba(52,211,153,0.1)" : "rgba(255,255,255,0.06)",
                  border:     `1px solid ${copied ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.1)"}`,
                  color:      copied ? "#34d399" : "rgba(255,255,255,0.6)",
                }}
              >
                <HugeiconsIcon icon={copied ? Tick01Icon : Copy01Icon} size={11} color="currentColor" strokeWidth={2} />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Note */}
          <div
            className="flex items-start gap-2.5 px-3 py-3"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <HugeiconsIcon icon={InformationCircleIcon} size={13} color="rgba(255,255,255,0.25)" strokeWidth={1.5} className="shrink-0 mt-px" />
            <span className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
              Only send <strong style={{ color: "rgba(255,255,255,0.6)" }}>
                {selectedAsset === "usdc" ? "USDC" : "SOL"}
              </strong> on the <strong style={{ color: "rgba(255,255,255,0.6)" }}>Solana</strong> network to this address.
              Sending other assets or using a different network will result in permanent loss.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
