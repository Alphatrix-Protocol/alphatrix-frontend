"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  TelegramIcon,
  WhatsappIcon,
  Notification02Icon,
  Search01Icon,
  ArrowRight01Icon,
  Notification01Icon,
  CheckmarkCircle01Icon,
  LinkIcon,
  FlashIcon,
  ChartIcon,
  AiBrain01Icon,
  Add01Icon,
  Cancel01Icon,
  ToggleOnIcon,
  ToggleOffIcon,
  FilterIcon,
  MessageMultiple01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

// ── Channel data ───────────────────────────────────────────────────────────────
const CHANNELS = [
  {
    id: "email",
    label: "Email",
    handle: "notifications@alpatrix.io",
    description: "Receive detailed market alerts and daily digests directly to your inbox.",
    icon: Mail01Icon,
    color: "#7B6EF4",
    bg: "rgba(123,110,244,0.08)",
    border: "rgba(123,110,244,0.18)",
    connected: false,
    placeholder: "your@email.com",
    inputLabel: "Email address",
  },
  {
    id: "telegram",
    label: "Telegram",
    handle: "@AlpatrixBot",
    description: "Get instant push alerts on Telegram. Fast, lightweight and always on.",
    icon: TelegramIcon,
    color: "#29B6F6",
    bg: "rgba(41,182,246,0.08)",
    border: "rgba(41,182,246,0.18)",
    connected: true,
    placeholder: "Your Telegram username",
    inputLabel: "Telegram username",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    handle: "+1 (555) 000-0000",
    description: "Send alerts to your WhatsApp number via the Alpatrix notification bot.",
    icon: WhatsappIcon,
    color: "#25D366",
    bg: "rgba(37,211,102,0.08)",
    border: "rgba(37,211,102,0.18)",
    connected: false,
    placeholder: "+1 234 567 8900",
    inputLabel: "Phone number",
  },
  {
    id: "discord",
    label: "Discord",
    handle: "Alpatrix#0001",
    description: "Connect your Discord account to receive alerts in your DMs or a server channel.",
    icon: MessageMultiple01Icon,
    color: "#5865F2",
    bg: "rgba(88,101,242,0.08)",
    border: "rgba(88,101,242,0.18)",
    connected: false,
    placeholder: "Discord username",
    inputLabel: "Discord username",
  },
];

// ── Alert types ────────────────────────────────────────────────────────────────
const ALERT_TYPES = [
  {
    id: "high-value",
    label: "High Value Markets",
    description: "Alert when a market exceeds $500K in volume",
    icon: ChartIcon,
    color: "#7B6EF4",
    enabled: true,
  },
  {
    id: "price-move",
    label: "Sharp Price Movement",
    description: "Alert when a market moves more than 10% in 1 hour",
    icon: FlashIcon,
    color: "#f59e0b",
    enabled: true,
  },
  {
    id: "ai-edge",
    label: "Alpha AI Picks",
    description: "Get notified when Alpha detects a market edge",
    icon: AiBrain01Icon,
    color: "#34d399",
    enabled: false,
  },
  {
    id: "position",
    label: "Position Updates",
    description: "Alert on significant changes to your open positions",
    icon: Notification02Icon,
    color: "#60a5fa",
    enabled: true,
  },
  {
    id: "close",
    label: "Market Closing Soon",
    description: "Remind me 24h before a market I'm in closes",
    icon: FilterIcon,
    color: "#f87171",
    enabled: false,
  },
];

// ── Connect modal ──────────────────────────────────────────────────────────────
function ConnectModal({
  channel,
  onClose,
  onConnect,
}: {
  channel: (typeof CHANNELS)[number];
  onClose: () => void;
  onConnect: () => void;
}) {
  const [value, setValue] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div
        className="flex flex-col gap-5 p-6 w-[400px]"
        style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center shrink-0"
              style={{ width: 36, height: 36, background: channel.bg, border: `1px solid ${channel.border}` }}
            >
              <HugeiconsIcon icon={channel.icon} size={16} color={channel.color} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-white">Connect {channel.label}</p>
              <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>{channel.handle}</p>
            </div>
          </div>
          <button onClick={onClose}>
            <HugeiconsIcon icon={Cancel01Icon} size={13} color="rgba(255,255,255,0.3)" strokeWidth={1.5} />
          </button>
        </div>

        <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
          {channel.description}
        </p>

        {/* Input */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>
            {channel.inputLabel}
          </span>
          <div
            className="flex items-center gap-2 px-3"
            style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${value ? channel.border : "rgba(255,255,255,0.08)"}`, transition: "border-color 0.15s" }}
          >
            <HugeiconsIcon icon={channel.icon} size={12} color="rgba(255,255,255,0.2)" strokeWidth={1.5} />
            <input
              type="text"
              placeholder={channel.placeholder}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="flex-1 bg-transparent outline-none border-none text-[13px] text-white placeholder:text-white/20 py-3"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-[11px] font-medium transition-all"
            style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.02)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)")}
          >
            Cancel
          </button>
          <button
            onClick={() => { if (value.trim()) { onConnect(); onClose(); } }}
            className="flex-1 py-2.5 text-[11px] font-semibold text-[#0a0a0a] flex items-center justify-center gap-1.5 transition-all"
            style={{
              background: value.trim() ? channel.color : "rgba(255,255,255,0.1)",
              color: value.trim() ? "#0a0a0a" : "rgba(255,255,255,0.2)",
              clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%)",
            }}
          >
            <HugeiconsIcon icon={LinkIcon} size={10} color={value.trim() ? "#0a0a0a" : "rgba(255,255,255,0.2)"} strokeWidth={1.5} />
            Connect
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function AlertsPage() {
  const [channels, setChannels] = useState(CHANNELS);
  const [alertTypes, setAlertTypes] = useState(ALERT_TYPES);
  const [modal, setModal] = useState<string | null>(null);

  const activeChannel = channels.find((c) => c.id === modal);
  const connectedCount = channels.filter((c) => c.connected).length;

  function connect(id: string) {
    setChannels((prev) => prev.map((c) => (c.id === id ? { ...c, connected: true } : c)));
  }

  function disconnect(id: string) {
    setChannels((prev) => prev.map((c) => (c.id === id ? { ...c, connected: false } : c)));
  }

  function toggleAlert(id: string) {
    setAlertTypes((prev) => prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)));
  }

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-8 pt-6">
        <div className="flex flex-col gap-0.5">
          <span className="text-lg font-semibold text-white">Alerts</span>
          <span className="text-[14px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            Connect your channels and choose what to be notified about.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-3 py-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", width: 220 }}>
            <HugeiconsIcon icon={Search01Icon} size={12} color="rgba(255,255,255,0.25)" strokeWidth={1.5} />
            <span className="text-[11px] flex-1" style={{ color: "rgba(255,255,255,0.25)" }}>Ask Alpha anything...</span>
            <div className="flex items-center justify-center w-4 h-4 shrink-0" style={{ background: "rgba(123,110,244,0.15)", border: "1px solid rgba(123,110,244,0.2)" }}>
              <HugeiconsIcon icon={ArrowRight01Icon} size={9} color="#7B6EF4" strokeWidth={2} />
            </div>
          </div>
          <button
            className="relative flex items-center justify-center w-8 h-8 transition-all"
            style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)")}
          >
            <HugeiconsIcon icon={Notification01Icon} size={14} color="rgba(255,255,255,0.4)" strokeWidth={1.5} />
            <span className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-[#7B6EF4]" />
          </button>
        </div>
      </div>

      <div className="flex gap-5 px-8 py-6 pb-12">

        {/* ── LEFT: channels + alert types ── */}
        <div className="flex flex-col gap-6 flex-1 min-w-0">

          {/* Channels */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={LinkIcon} size={13} color="rgba(255,255,255,0.25)" strokeWidth={1.5} />
              <span className="text-[13px] font-semibold text-white">Notification Channels</span>
              <span className="text-[10px] px-1.5 py-0.5" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.07)" }}>
                {connectedCount}/{channels.length} connected
              </span>
            </div>

            <div className="flex flex-col gap-0" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              {channels.map((ch, i) => (
                <div
                  key={ch.id}
                  className="flex items-center gap-4 px-5 py-4 transition-colors"
                  style={{ borderBottom: i < channels.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.015)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  {/* Platform icon */}
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{ width: 40, height: 40, background: ch.bg, border: `1px solid ${ch.border}` }}
                  >
                    <HugeiconsIcon icon={ch.icon} size={18} color={ch.color} strokeWidth={1.5} />
                  </div>

                  {/* Info */}
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-white">{ch.label}</span>
                      {ch.connected && (
                        <div className="flex items-center gap-1 px-1.5 py-0.5" style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}>
                          <HugeiconsIcon icon={CheckmarkCircle01Icon} size={9} color="#34d399" strokeWidth={1.5} />
                          <span className="text-[9px] font-semibold" style={{ color: "#34d399" }}>Connected</span>
                        </div>
                      )}
                    </div>
                    <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>{ch.description}</span>
                    {ch.connected && (
                      <span className="text-[10px] mt-0.5" style={{ color: ch.color, opacity: 0.7 }}>{ch.handle}</span>
                    )}
                  </div>

                  {/* Action */}
                  {ch.connected ? (
                    <button
                      onClick={() => disconnect(ch.id)}
                      className="shrink-0 px-3 py-1.5 text-[10px] font-medium transition-all"
                      style={{ border: "1px solid rgba(248,113,113,0.2)", color: "rgba(248,113,113,0.6)", background: "rgba(248,113,113,0.05)" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.1)";
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(248,113,113,0.35)";
                        (e.currentTarget as HTMLElement).style.color = "#f87171";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.05)";
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(248,113,113,0.2)";
                        (e.currentTarget as HTMLElement).style.color = "rgba(248,113,113,0.6)";
                      }}
                    >
                      Disconnect
                    </button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      shape="slant"
                      corner="bottom-right"
                      onClick={() => setModal(ch.id)}
                      className="shrink-0"
                    >
                      <HugeiconsIcon icon={Add01Icon} size={10} color="#0a0a0a" strokeWidth={2} />
                      Connect
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Alert types */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Settings01Icon} size={13} color="rgba(255,255,255,0.25)" strokeWidth={1.5} />
              <span className="text-[13px] font-semibold text-white">Alert Preferences</span>
              <span className="text-[10px] px-1.5 py-0.5" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.07)" }}>
                {alertTypes.filter((a) => a.enabled).length} active
              </span>
            </div>

            <div className="flex flex-col gap-0" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              {alertTypes.map((alert, i) => (
                <div
                  key={alert.id}
                  className="flex items-center gap-4 px-5 py-4 transition-colors"
                  style={{ borderBottom: i < alertTypes.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.015)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{ width: 36, height: 36, background: `${alert.color}12`, border: `1px solid ${alert.color}25` }}
                  >
                    <HugeiconsIcon icon={alert.icon} size={15} color={alert.color} strokeWidth={1.5} />
                  </div>

                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className="text-[13px] font-semibold text-white">{alert.label}</span>
                    <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>{alert.description}</span>
                  </div>

                  <button onClick={() => toggleAlert(alert.id)} className="shrink-0 transition-opacity hover:opacity-80">
                    <HugeiconsIcon
                      icon={alert.enabled ? ToggleOnIcon : ToggleOffIcon}
                      size={28}
                      color={alert.enabled ? "#7B6EF4" : "rgba(255,255,255,0.15)"}
                      strokeWidth={1.5}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: summary panel ── */}
        <div className="flex flex-col gap-4 shrink-0" style={{ width: 260 }}>

          {/* Status summary */}
          <div className="flex flex-col gap-0" style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.012)" }}>
            <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span className="text-[11px] font-semibold text-white">Connection Status</span>
            </div>
            <div className="flex flex-col gap-0">
              {channels.map((ch, i) => (
                <div
                  key={ch.id}
                  className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: i < channels.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                >
                  <div className="flex items-center gap-2.5">
                    <HugeiconsIcon icon={ch.icon} size={13} color={ch.connected ? ch.color : "rgba(255,255,255,0.2)"} strokeWidth={1.5} />
                    <span className="text-[11px]" style={{ color: ch.connected ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)" }}>{ch.label}</span>
                  </div>
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: ch.connected ? "#34d399" : "rgba(255,255,255,0.12)" }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div className="flex flex-col gap-0" style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.012)" }}>
            <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span className="text-[11px] font-semibold text-white">How it works</span>
            </div>
            <div className="flex flex-col gap-4 px-4 py-4">
              {[
                { step: "1", text: "Connect one or more notification channels above." },
                { step: "2", text: "Enable the alert types you care about." },
                { step: "3", text: "Alpha monitors markets 24/7 and pings you instantly." },
              ].map(({ step, text }) => (
                <div key={step} className="flex items-start gap-3">
                  <div
                    className="flex items-center justify-center shrink-0 text-[9px] font-bold"
                    style={{ width: 18, height: 18, background: "rgba(123,110,244,0.15)", border: "1px solid rgba(123,110,244,0.25)", color: "#7B6EF4" }}
                  >
                    {step}
                  </div>
                  <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Alpha alert CTA */}
          <div
            className="flex flex-col gap-3 px-4 py-4"
            style={{ background: "rgba(123,110,244,0.06)", border: "1px solid rgba(123,110,244,0.14)" }}
          >
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={AiBrain01Icon} size={13} color="#7B6EF4" strokeWidth={1.5} />
              <span className="text-[11px] font-semibold" style={{ color: "rgba(123,110,244,0.9)" }}>Alpha Smart Alerts</span>
            </div>
            <p className="text-[10px] leading-relaxed" style={{ color: "rgba(255,255,255,0.3)" }}>
              Let Alpha automatically flag markets with unusual activity, odds shifts, or arbitrage opportunities across all platforms.
            </p>
            <Button variant="primary" size="sm" shape="slant" corner="bottom-right" className="w-full justify-center">
              Enable Alpha Alerts
            </Button>
          </div>

        </div>
      </div>

      {/* ── Connect modal ── */}
      {modal && activeChannel && (
        <ConnectModal
          channel={activeChannel}
          onClose={() => setModal(null)}
          onConnect={() => connect(modal)}
        />
      )}
    </div>
  );
}
