"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  EyeIcon,
  ViewOffIcon,
  Add01Icon,
  ArrowDownLeft01Icon,
  RefreshIcon,
  Notification01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import TrendingMarkets from "../_components/markets";
import VenueStatusPills from "../_components/venue-status";
import FundModal from "../_components/fund-modal";
import { useAuthStore } from "@/lib/store/auth";
import { useSolBalance } from "@/lib/hooks/use-sol-balance";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [showFund, setShowFund] = useState(false);

  const { displayName, walletAddress } = useAuthStore();
  const { sol, loading: balLoading, refresh } = useSolBalance(walletAddress);

  const name = displayName ? displayName.split("@")[0] : null;

  return (
    <div className="flex flex-col min-h-screen">
      {showFund && walletAddress && (
        <FundModal address={walletAddress} onClose={() => setShowFund(false)} />
      )}

      {/* Top bar */}
      <div className="flex items-center justify-between px-8 pt-7 pb-5">
        <div className="flex flex-col gap-0.5">
          <span className="text-[17px] font-semibold text-white tracking-tight">
            {greeting()}{name ? `, ${name}` : ""}.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <VenueStatusPills />

          <button
            className="relative flex items-center justify-center w-8 h-8 transition-all rounded-sm"
            style={{
              border: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.03)",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)")
            }
          >
            <HugeiconsIcon
              icon={Notification01Icon}
              size={14}
              color="rgba(255,255,255,0.4)"
              strokeWidth={1.5}
            />
            <span className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-[#7B6EF4]" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col gap-5 px-8 pb-8">

        {/* Balance card */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] uppercase tracking-widest"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                SOL Balance
              </span>
              <button
                onClick={refresh}
                className="transition-opacity hover:opacity-60"
              >
                <HugeiconsIcon
                  icon={RefreshIcon}
                  size={10}
                  color="rgba(255,255,255,0.2)"
                  strokeWidth={1.5}
                />
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              {balanceVisible ? (
                <span className="text-[28px] font-semibold leading-none tracking-tight text-white tabular-nums">
                  {balLoading ? (
                    <span
                      className="text-[18px]"
                      style={{ color: "rgba(255,255,255,0.2)" }}
                    >
                      fetching…
                    </span>
                  ) : sol !== null ? (
                    `${sol.toFixed(4)} SOL`
                  ) : (
                    "—"
                  )}
                </span>
              ) : (
                <span className="text-[28px] font-semibold leading-none tracking-tight text-white">
                  ••••••
                </span>
              )}
              <button
                onClick={() => setBalanceVisible((v) => !v)}
                className="transition-opacity hover:opacity-70"
              >
                <HugeiconsIcon
                  icon={balanceVisible ? EyeIcon : ViewOffIcon}
                  size={14}
                  color="rgba(255,255,255,0.25)"
                  strokeWidth={1.5}
                />
              </button>
            </div>

            <span
              className="text-[10px]"
              style={{ color: "rgba(255,255,255,0.18)" }}
            >
              Solana Mainnet · embedded wallet
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="md"
              shape="slant"
              onClick={() => setShowFund(true)}
            >
              <HugeiconsIcon icon={Add01Icon} size={12} color="white" strokeWidth={2} />
              Add Funds
            </Button>
            <Button variant="ghost" size="md" shape="slant">
              <HugeiconsIcon
                icon={ArrowDownLeft01Icon}
                size={12}
                color="rgba(255,255,255,0.6)"
                strokeWidth={2}
              />
              Withdraw
            </Button>
          </div>
        </div>

        {/* Markets */}
        <TrendingMarkets />

      </div>
    </div>
  );
}
