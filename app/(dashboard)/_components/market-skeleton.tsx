// Skeleton pulse base
function Bone({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={className}
      style={{
        background: "rgba(255,255,255,0.06)",
        animation: "skeleton-pulse 1.6s ease-in-out infinite",
        ...style,
      }}
    />
  );
}

// ── Card skeleton ──────────────────────────────────────────────────────────────
export function MarketCardSkeleton() {
  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Header */}
      <div className="flex gap-3 p-3.5 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <Bone className="shrink-0 rounded-lg" style={{ width: 44, height: 44 }} />
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-1.5">
            <Bone className="rounded" style={{ width: 14, height: 14 }} />
            <Bone className="rounded" style={{ width: 60, height: 10 }} />
          </div>
          <Bone className="rounded" style={{ width: "90%", height: 12 }} />
          <Bone className="rounded" style={{ width: "65%", height: 12 }} />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-3.5">
        <div className="flex items-center justify-between">
          <Bone className="rounded" style={{ width: 56, height: 20 }} />
          <Bone className="rounded" style={{ width: 52, height: 20 }} />
        </div>
        <div className="flex items-center justify-between">
          <Bone className="rounded" style={{ width: 48, height: 10 }} />
          <Bone className="rounded" style={{ width: 64, height: 10 }} />
        </div>
        <div className="flex gap-2">
          <Bone className="flex-1 rounded" style={{ height: 30 }} />
          <Bone className="flex-1 rounded" style={{ height: 30 }} />
        </div>
      </div>

    </div>
  );
}

// ── Row skeleton ───────────────────────────────────────────────────────────────
export function MarketRowSkeleton() {
  return (
    <div
      className="flex items-center gap-4 px-4 py-3"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
    >
      <Bone className="shrink-0 rounded" style={{ width: 36, height: 36 }} />
      <div className="flex flex-col gap-1.5 flex-1">
        <Bone className="rounded" style={{ width: "55%", height: 11 }} />
        <Bone className="rounded" style={{ width: "35%", height: 10 }} />
      </div>
      <Bone className="rounded" style={{ width: 36, height: 16 }} />
      <Bone className="rounded" style={{ width: 40, height: 16 }} />
      <Bone className="rounded" style={{ width: 80, height: 16 }} />
      <Bone className="rounded" style={{ width: 48, height: 16 }} />
      <Bone className="rounded" style={{ width: 80, height: 28 }} />
    </div>
  );
}
