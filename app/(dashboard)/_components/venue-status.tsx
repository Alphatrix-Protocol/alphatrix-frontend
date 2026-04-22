"use client";

import { useState, useEffect } from "react";

type VenueState = "live" | "connecting";

const VENUES: { name: string; state: VenueState }[] = [
  { name: "Polymarket",   state: "live"       },
  { name: "Bayes Market", state: "connecting" },
];

const LIVE_COUNT = VENUES.filter((v) => v.state === "live").length;

function StatusDot({ state }: { state: VenueState }) {
  return (
    <span
      style={{
        display:      "inline-block",
        width:        6,
        height:       6,
        borderRadius: "50%",
        flexShrink:   0,
        background:   state === "live" ? "#34d399" : "rgba(255,255,255,0.18)",
        boxShadow:    state === "live" ? "0 0 5px rgba(52,211,153,0.45)" : "none",
      }}
    />
  );
}

export default function VenueStatus() {
  const [latencies, setLatencies] = useState<Record<string, number>>({
    Polymarket: 9,
  });

  useEffect(() => {
    const tick = () =>
      setLatencies({
        Polymarket: Math.round(6 + Math.random() * 18),
      });
    const id = setInterval(tick, 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="flex items-center justify-between px-8 py-[7px]"
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        background:   "rgba(255,255,255,0.015)",
      }}
    >
      {/* Venue pills */}
      <div className="flex items-center gap-6">
        {VENUES.map(({ name, state }) => (
          <div key={name} className="flex items-center gap-2">
            <StatusDot state={state} />
            <span
              className="text-[11px] font-medium"
              style={{ color: state === "live" ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.2)" }}
            >
              {name}
            </span>
            {state === "live" ? (
              <span className="text-[10px] tabular-nums" style={{ color: "rgba(255,255,255,0.2)" }}>
                {latencies[name]}ms
              </span>
            ) : (
              <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.18)" }}>
                connecting...
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Right: engine status */}
      <div className="flex items-center gap-2">
        <span
          className="text-[10px] font-medium px-2 py-[3px]"
          style={{
            color:      "rgba(255,255,255,0.28)",
            background: "rgba(255,255,255,0.04)",
            border:     "1px solid rgba(255,255,255,0.07)",
          }}
        >
          Routing engine active
        </span>
        <span
          className="text-[10px] font-semibold px-2 py-[3px]"
          style={{
            color:      "#34d399",
            background: "rgba(52,211,153,0.08)",
            border:     "1px solid rgba(52,211,153,0.12)",
          }}
        >
          {LIVE_COUNT}/{VENUES.length} venues live
        </span>
      </div>
    </div>
  );
}
