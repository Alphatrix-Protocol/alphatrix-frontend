"use client";

type VenueState = "live" | "connecting" | "degraded";

interface Venue {
  name:  string;
  state: VenueState;
}

const VENUES: Venue[] = [
  { name: "Polymarket",   state: "live" },
  { name: "Bayes Market", state: "live" },
];

const DOT: Record<VenueState, { bg: string; glow: string }> = {
  live:       { bg: "#34d399", glow: "rgba(52,211,153,0.55)"  },
  connecting: { bg: "#f59e0b", glow: "rgba(245,158,11,0.45)"  },
  degraded:   { bg: "#f87171", glow: "rgba(248,113,113,0.45)" },
};

export default function VenueStatusPills() {
  return (
    <div className="flex items-center gap-2">
      {VENUES.map((v) => {
        const dot = DOT[v.state];
        return (
          <div
            key={v.name}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: dot.bg, boxShadow: `0 0 5px ${dot.glow}` }}
            />
            <span
              className="text-[11px] font-medium"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {v.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
