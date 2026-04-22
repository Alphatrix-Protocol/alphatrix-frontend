"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUpRight01Icon,
  ArrowDownRight01Icon,
  InformationCircleIcon,
  AiBrain01Icon,
  ArrowRight01Icon,
  ArrowDown01Icon,
  CheckmarkCircle01Icon,
  Alert02Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

const PLATFORMS = [
  { id: "polymarket", label: "Polymarket", yes: 67, no: 33, logo: "poly"   as const, live: true  },
  { id: "kalshi",     label: "Kalshi",     yes: 64, no: 36, logo: "kalshi" as const, live: true  },
  { id: "bayse",      label: "Bayse",      yes: 62, no: 38, logo: "bayse"  as const, live: false }, // connecting
];

const LIVE_PLATFORMS = PLATFORMS.filter((p) => p.live);

function bestIndexForSide(side: "yes" | "no", liveOnly = true) {
  const pool = liveOnly ? LIVE_PLATFORMS : PLATFORMS;
  const best = pool.reduce((b, p) => (p[side] < b[side] ? p : b));
  return PLATFORMS.findIndex((p) => p.id === best.id);
}

function PlatformIcon({ logo, size = 14 }: { logo: "poly" | "kalshi" | "bayse"; size?: number }) {
  if (logo === "poly") {
    return (
      <div className="rounded-full overflow-hidden shrink-0" style={{ width: size, height: size }}>
        <Image src="/polylogo.webp" alt="Polymarket" width={size} height={size} className="object-cover" />
      </div>
    );
  }
  if (logo === "bayse") {
    return (
      <div
        className="flex items-center justify-center rounded-full shrink-0"
        style={{ width: size, height: size, background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.15)" }}
      >
        <svg width={size * 0.7} height={size * 0.7} viewBox="4 4 18 14" fill="white">
          <path d="M9.421 17.665a5.26 5.26 0 0 1-5.257-5.26V9.586Q4.163 7.283 5.28 5.984q1.116-1.297 3.03-1.298 1.163 0 1.89.424.728.424 1.213.923.486.498.812.922c.217.283.442.425.666.425s.45-.142.666-.425q.326-.424.813-.922.485-.498 1.212-.923.728-.424 1.89-.424c1.277 0 2.29.43 3.03 1.286q1.117 1.285 1.116 3.614v2.82a5.26 5.26 0 0 1-5.258 5.259H9.416zm9.217-8.076q0-.93-.378-1.396c-.222-.274-.576-.398-.93-.371a1.54 1.54 0 0 0-.958.444q-.473.45-.96.993-.483.547-1.077 1.006-.594.46-1.442.461-.85 0-1.442-.461a8 8 0 0 1-1.078-1.006 15 15 0 0 0-.959-.993q-.472-.45-1.054-.45c-.388 0-.666.16-.885.474q-.327.474-.327 1.299v1.818a3.44 3.44 0 0 0 3.44 3.441H15.2c1.9 0 3.44-1.54 3.44-3.44v-1.82z" />
        </svg>
      </div>
    );
  }
  return (
    <div
      className="flex items-center justify-center rounded-full font-bold shrink-0"
      style={{ width: size, height: size, background: "#fff", color: "#0050FF", fontSize: size * 0.44 }}
    >
      K
    </div>
  );
}

const SLIPPAGE_PRESETS = ["0.5", "1", "2"];

export default function TradePanel() {
  const [side, setSide]               = useState<"yes" | "no">("yes");
  const [orderType, setOrderType]     = useState<"market" | "limit">("market");
  const [amount, setAmount]           = useState("");
  const [limitPrice, setLimitPrice]   = useState("");
  const [open, setOpen]               = useState(false);
  const [manualIdx, setManualIdx]     = useState<number | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [slippage, setSlippage]       = useState("1");
  const [customSlippage, setCustomSlippage] = useState("");
  const dropRef                       = useRef<HTMLDivElement>(null);

  const bestIdx     = bestIndexForSide(side);
  const platformIdx = manualIdx ?? bestIdx;
  const platform    = PLATFORMS[platformIdx];
  const marketPrice = platform[side];
  const isAutoBest  = manualIdx === null;

  // Best price considering only live venues
  const bestLivePrice  = PLATFORMS[bestIdx][side];
  // Best price across all venues (incl. offline) — to detect if offline venue would win
  const bestAllIdx     = bestIndexForSide(side, false);
  const bestAllVenue   = PLATFORMS[bestAllIdx];
  const offlineWouldWin = !bestAllVenue.live && bestAllVenue[side] < bestLivePrice;

  const worstPrice = Math.max(...LIVE_PLATFORMS.map((p) => p[side]));
  const savings    = worstPrice - bestLivePrice;

  const execPrice = orderType === "limit"
    ? (limitPrice ? parseFloat(limitPrice) : null)
    : marketPrice;

  const shares = (amount && execPrice) ? (parseFloat(amount) / (execPrice / 100)).toFixed(2) : null;
  const payout = shares ? parseFloat(shares).toFixed(2) : null;

  const effectiveSlippage = slippage === "custom" ? parseFloat(customSlippage) || 0 : parseFloat(slippage);
  // Simple heuristic: large orders relative to typical liquidity
  const highSlippage = !!amount && parseFloat(amount) > 500 && effectiveSlippage < 1;

  const yesColor = "#34d399";
  const noColor  = "#f87171";
  const active   = side === "yes" ? yesColor : noColor;

  function handleSide(s: "yes" | "no") {
    setSide(s);
    setManualIdx(null);
  }

  function handleOrderType(t: "market" | "limit") {
    setOrderType(t);
    setLimitPrice("");
  }

  function handlePickPlatform(i: number) {
    setManualIdx(i === bestIdx ? null : i);
    setOpen(false);
  }

  const limitBelowMarket = orderType === "limit" && limitPrice
    ? parseFloat(limitPrice) < marketPrice
    : false;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex flex-col gap-0">

      {/* Platform selector */}
      <div className="mb-3">
        <p className="text-[14px] uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.2)" }}>
          Venue
        </p>
        <div ref={dropRef} className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 w-full px-3 py-2.5 transition-all"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${open ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.07)"}`,
            }}
          >
            <PlatformIcon logo={platform.logo} size={16} />
            <span className="text-[14px] font-medium text-white flex-1 text-left">{platform.label}</span>
            {isAutoBest && (
              <span
                className="text-[13px] font-semibold px-1.5 py-0.5"
                style={{ color: "#34d399", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}
              >
                Best
              </span>
            )}
            <div className="flex items-center gap-2">
              <span className="text-[14px]" style={{ color: yesColor }}>{platform.yes}¢ Y</span>
              <span className="text-[14px]" style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
              <span className="text-[14px]" style={{ color: noColor }}>{platform.no}¢ N</span>
            </div>
            <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.15 }}>
              <HugeiconsIcon icon={ArrowDown01Icon} size={11} color="rgba(255,255,255,0.25)" strokeWidth={1.5} />
            </motion.span>
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -6, scaleY: 0.92 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: -4, scaleY: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute top-full left-0 right-0 z-20 mt-1 flex flex-col origin-top"
                style={{ background: "#1e1e1e", border: "1px solid rgba(255,255,255,0.09)" }}
              >
                {PLATFORMS.map((p, i) => {
                  const isBest     = i === bestIdx;
                  const isSelected = i === platformIdx;
                  return (
                    <button
                      key={p.id}
                      onClick={() => { if (p.live) handlePickPlatform(i); }}
                      disabled={!p.live}
                      className="flex items-center gap-2.5 px-3 py-2.5 transition-all disabled:cursor-not-allowed"
                      style={{
                        background: isSelected ? "rgba(255,255,255,0.04)" : "transparent",
                        opacity: p.live ? 1 : 0.4,
                      }}
                      onMouseEnter={(e) => { if (!isSelected && p.live) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)"; }}
                      onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = isSelected ? "rgba(255,255,255,0.04)" : "transparent"; }}
                    >
                      <PlatformIcon logo={p.logo} size={15} />
                      <span className="text-[14px] font-medium text-white flex-1 text-left">{p.label}</span>
                      {!p.live && (
                        <span className="text-[12px] px-1.5 py-0.5" style={{ color: "rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                          connecting
                        </span>
                      )}
                      {isBest && p.live && (
                        <span className="text-[12px] font-semibold px-1.5 py-0.5" style={{ color: "#34d399", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.18)" }}>
                          best {side.toUpperCase()}
                        </span>
                      )}
                      <span className="text-[14px]" style={{ color: p.live ? yesColor : "rgba(255,255,255,0.2)" }}>{p.yes}¢</span>
                      <span className="text-[14px]" style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
                      <span className="text-[14px]" style={{ color: p.live ? noColor : "rgba(255,255,255,0.2)" }}>{p.no}¢</span>
                      {isSelected && (
                        <HugeiconsIcon icon={CheckmarkCircle01Icon} size={12} color="#7B6EF4" strokeWidth={1.5} />
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Best execution indicator */}
        <div
          className="flex items-center justify-between px-2.5 py-1.5 mt-1.5"
          style={{ background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.1)" }}
        >
          <div className="flex items-center gap-2">
            <PlatformIcon logo={PLATFORMS[bestIdx].logo} size={14} />
            <span className="text-[14px]" style={{ color: "rgba(255,255,255,0.35)" }}>
              Best execution via{" "}
              <span style={{ color: "rgba(255,255,255,0.7)" }}>{PLATFORMS[bestIdx].label}</span>
              {" "}at{" "}
              <span style={{ color: "#34d399" }}>{bestLivePrice}¢</span>
            </span>
          </div>
          {savings > 0 && (
            <span className="text-[14px] font-semibold" style={{ color: "#34d399" }}>saves {savings}¢</span>
          )}
        </div>

        {/* Offline venue would have been better */}
        {offlineWouldWin && (
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 mt-1"
            style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)" }}
          >
            <HugeiconsIcon icon={Alert02Icon} size={11} color="#f59e0b" strokeWidth={1.5} />
            <span className="text-[13px]" style={{ color: "rgba(245,158,11,0.8)" }}>
              {bestAllVenue.label} has better price ({bestAllVenue[side]}¢) but is currently offline
            </span>
          </div>
        )}
      </div>

      {/* YES / NO */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {(["yes", "no"] as const).map((s) => {
          const c = s === "yes" ? yesColor : noColor;
          const p = platform[s];
          const isActive = side === s;
          return (
            <button
              key={s}
              onClick={() => handleSide(s)}
              className="flex items-center justify-center gap-2 py-2 transition-all"
              style={{
                background: isActive ? `${c}12` : "rgba(255,255,255,0.02)",
                border: `1px solid ${isActive ? `${c}35` : "rgba(255,255,255,0.06)"}`,
              }}
            >
              <HugeiconsIcon
                icon={s === "yes" ? ArrowUpRight01Icon : ArrowDownRight01Icon}
                size={11}
                color={isActive ? c : "rgba(255,255,255,0.2)"}
                strokeWidth={2}
              />
              <span className="text-[14px] font-semibold uppercase tracking-wide" style={{ color: isActive ? c : "rgba(255,255,255,0.2)" }}>
                {s}
              </span>
              <span className="text-[13px] font-bold" style={{ color: isActive ? c : "rgba(255,255,255,0.15)" }}>
                {p}¢
              </span>
            </button>
          );
        })}
      </div>

      {/* Order type toggle */}
      <div className="mb-4">
        <div
          className="grid grid-cols-2"
          style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
        >
          {(["market", "limit"] as const).map((t) => (
            <button
              key={t}
              onClick={() => handleOrderType(t)}
              className="py-2 text-[13px] font-semibold uppercase tracking-wide transition-all"
              style={{
                background:  orderType === t ? "rgba(255,255,255,0.06)" : "transparent",
                color:       orderType === t ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.28)",
                borderRight: t === "market" ? "1px solid rgba(255,255,255,0.07)" : "none",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Limit price input */}
      <AnimatePresence>
        {orderType === "limit" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="overflow-hidden mb-4"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[14px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>Limit price</span>
                <div className="flex items-center gap-1">
                  <span className="text-[14px]" style={{ color: "rgba(255,255,255,0.2)" }}>Market:</span>
                  <span className="text-[14px] font-semibold" style={{ color: active }}>{marketPrice}¢</span>
                </div>
              </div>
              <div
                className="flex items-center gap-2 px-3"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${limitPrice ? "rgba(123,110,244,0.35)" : "rgba(255,255,255,0.07)"}`,
                  transition: "border-color 0.15s",
                }}
              >
                <input
                  type="number"
                  placeholder={`${marketPrice}`}
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  className="flex-1 bg-transparent outline-none border-none text-[22px] font-semibold text-white placeholder:text-white/10 min-w-0 py-3"
                />
                <span className="text-[13px] font-medium shrink-0" style={{ color: "rgba(255,255,255,0.2)" }}>¢</span>
              </div>
              {limitPrice && (
                <p className="text-[14px]" style={{ color: limitBelowMarket ? "#34d399" : "rgba(255,255,255,0.2)" }}>
                  {limitBelowMarket
                    ? `Order triggers when price drops to ${limitPrice}¢`
                    : `Current market price is ${marketPrice}¢ — set a lower price to queue a buy limit`}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Probability bar — market mode only */}
      {orderType === "market" && (
        <div className="flex items-center gap-2 mb-5">
          <span className="text-[13px] font-medium shrink-0" style={{ color: yesColor }}>YES {platform.yes}%</span>
          <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="h-full rounded-full" style={{ width: `${platform.yes}%`, background: `linear-gradient(to right, ${yesColor}, ${noColor})` }} />
          </div>
          <span className="text-[13px] font-medium shrink-0" style={{ color: noColor }}>NO {platform.no}%</span>
        </div>
      )}

      {/* Amount */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[14px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>Amount</span>
          <div className="flex items-center gap-1">
            {["25", "50", "100"].map((v) => (
              <button
                key={v}
                onClick={() => setAmount(v)}
                className="px-2 py-0.5 text-[13px] font-medium transition-all"
                style={{
                  background: amount === v ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
                  color:      amount === v ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)",
                  border:     `1px solid ${amount === v ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)"}`,
                }}
              >
                ${v}
              </button>
            ))}
          </div>
        </div>
        <div
          className="flex items-center gap-2 px-3"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${amount ? (orderType === "limit" ? "rgba(123,110,244,0.28)" : `${active}28`) : "rgba(255,255,255,0.07)"}`,
            transition: "border-color 0.15s",
          }}
        >
          <span className="text-[13px] font-medium py-3" style={{ color: "rgba(255,255,255,0.2)" }}>$</span>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 bg-transparent outline-none border-none text-[22px] font-semibold text-white placeholder:text-white/10 min-w-0 py-3"
          />
        </div>
      </div>

      {/* Advanced — slippage */}
      <div className="mb-4">
        <button
          onClick={() => setShowAdvanced((v) => !v)}
          className="flex items-center gap-1.5 w-full transition-all"
          style={{ color: "rgba(255,255,255,0.25)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.25)")}
        >
          <HugeiconsIcon icon={Settings01Icon} size={11} color="currentColor" strokeWidth={1.5} />
          <span className="text-[13px] font-medium">Advanced</span>
          <motion.span animate={{ rotate: showAdvanced ? 180 : 0 }} transition={{ duration: 0.15 }} className="ml-auto">
            <HugeiconsIcon icon={ArrowDown01Icon} size={10} color="currentColor" strokeWidth={1.5} />
          </motion.span>
        </button>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div
                className="flex flex-col gap-2.5 px-3 py-3 mt-2"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>Slippage tolerance</span>
                    <HugeiconsIcon icon={InformationCircleIcon} size={11} color="rgba(255,255,255,0.15)" strokeWidth={1.5} />
                  </div>
                  <span className="text-[13px] font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {slippage === "custom" ? (customSlippage || "—") : slippage}%
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {SLIPPAGE_PRESETS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setSlippage(p)}
                      className="flex-1 py-1.5 text-[13px] font-medium transition-all"
                      style={{
                        background: slippage === p ? "rgba(123,110,244,0.12)" : "rgba(255,255,255,0.03)",
                        border:     `1px solid ${slippage === p ? "rgba(123,110,244,0.3)" : "rgba(255,255,255,0.07)"}`,
                        color:      slippage === p ? "#a78bfa" : "rgba(255,255,255,0.35)",
                      }}
                    >
                      {p}%
                    </button>
                  ))}
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      placeholder="Custom"
                      value={customSlippage}
                      onChange={(e) => { setCustomSlippage(e.target.value); setSlippage("custom"); }}
                      className="w-full py-1.5 px-2 text-[13px] text-white bg-transparent outline-none text-center placeholder:text-white/20"
                      style={{
                        border: `1px solid ${slippage === "custom" ? "rgba(123,110,244,0.3)" : "rgba(255,255,255,0.07)"}`,
                        background: slippage === "custom" ? "rgba(123,110,244,0.06)" : "rgba(255,255,255,0.03)",
                      }}
                    />
                  </div>
                </div>

                {highSlippage && (
                  <div className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={Alert02Icon} size={11} color="#f59e0b" strokeWidth={1.5} />
                    <span className="text-[13px]" style={{ color: "rgba(245,158,11,0.8)" }}>
                      Large order — consider increasing slippage tolerance
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Order summary */}
      {shares && (
        <div
          className="flex flex-col gap-2.5 px-3 py-3 mb-4"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          {orderType === "market" ? (
            <>
              {[
                { label: "Price per share", value: `${marketPrice}¢`, tip: true  },
                { label: "Shares",          value: shares,             tip: false },
                { label: "Max payout",      value: `$${payout}`,      tip: true  },
              ].map(({ label, value, tip }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.3)" }}>{label}</span>
                    {tip && <HugeiconsIcon icon={InformationCircleIcon} size={10} color="rgba(255,255,255,0.12)" strokeWidth={1.5} />}
                  </div>
                  <span className="text-[13px] font-semibold text-white">{value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.3)" }}>Slippage max</span>
                <span className="text-[13px] font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>{effectiveSlippage}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.3)" }}>Potential return</span>
                <span className="text-[13px] font-semibold" style={{ color: active }}>
                  +{(100 - marketPrice).toFixed(0)}% on {side.toUpperCase()}
                </span>
              </div>
            </>
          ) : (
            <>
              {[
                { label: "Trigger price", value: `${limitPrice}¢`, tip: true  },
                { label: "Shares",        value: shares,            tip: false },
                { label: "Max payout",    value: `$${payout}`,     tip: true  },
              ].map(({ label, value, tip }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.3)" }}>{label}</span>
                    {tip && <HugeiconsIcon icon={InformationCircleIcon} size={10} color="rgba(255,255,255,0.12)" strokeWidth={1.5} />}
                  </div>
                  <span className="text-[13px] font-semibold text-white">{value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.3)" }}>Stored on-chain</span>
                <span className="text-[13px] font-semibold" style={{ color: "#7B6EF4" }}>Solana Order Manager</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Submit */}
      {orderType === "market" ? (
        <button
          className="w-full py-2.5 flex items-center justify-center gap-2 font-semibold text-[14px] transition-all mb-3"
          style={{
            background: side === "yes"
              ? "linear-gradient(135deg, rgba(52,211,153,0.85), rgba(52,211,153,0.65))"
              : "linear-gradient(135deg, rgba(248,113,113,0.85), rgba(248,113,113,0.65))",
            color:    "#0a0a0a",
            clipPath: side === "yes"
              ? "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)"
              : "polygon(0 0, 100% 0, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
          }}
        >
          <HugeiconsIcon
            icon={side === "yes" ? ArrowUpRight01Icon : ArrowDownRight01Icon}
            size={12} color="#0a0a0a" strokeWidth={2.5}
          />
          Buy {side === "yes" ? "Yes" : "No"} · {marketPrice}¢
          {amount && <span className="opacity-60 text-[14px] font-normal">· ${amount}</span>}
        </button>
      ) : (
        <Button variant="primary" size="lg" shape="slant" disabled={!amount || !limitPrice} className="w-full justify-center mb-3">
          Place Limit Order
          {amount && limitPrice && (
            <span className="opacity-60 text-[13px] font-normal">· {limitPrice}¢ / ${amount}</span>
          )}
        </Button>
      )}

      {/* AI Analysis */}
      <button
        className="w-full flex items-center gap-2.5 px-3 py-2.5 transition-all mb-4"
        style={{ background: "rgba(123,110,244,0.06)", border: "1px solid rgba(123,110,244,0.14)" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(123,110,244,0.11)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(123,110,244,0.26)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(123,110,244,0.06)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(123,110,244,0.14)"; }}
      >
        <HugeiconsIcon icon={AiBrain01Icon} size={13} color="#7B6EF4" strokeWidth={1.5} />
        <div className="flex flex-col items-start gap-0.5 flex-1">
          <span className="text-[13px] font-medium" style={{ color: "rgba(123,110,244,0.9)" }}>Get Alpha Analysis</span>
          <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.2)" }}>AI breakdown · edge detection</span>
        </div>
        <HugeiconsIcon icon={ArrowRight01Icon} size={10} color="rgba(123,110,244,0.4)" strokeWidth={1.5} />
      </button>

      <p className="text-center text-[14px]" style={{ color: "rgba(255,255,255,0.12)" }}>
        {orderType === "market"
          ? `Routed via ${platform.label}`
          : `Order stored on-chain · triggers at ${limitPrice ? `${limitPrice}¢` : "set price"}`}
      </p>
    </div>
  );
}
