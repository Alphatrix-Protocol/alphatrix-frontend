"use client";

import { useEffect, useRef } from "react";
import { createChart, LineSeries, type IChartApi } from "lightweight-charts";
import type { PriceHistoryVenue, OhlcCandle, LinePoint } from "@/lib/api/types";

const VENUE_COLORS: Record<string, string> = {
  polymarket: "#7B6EF4",
  bayse: "#34d399",
  kalshi: "#60a5fa",
};

interface PriceChartProps {
  venues: PriceHistoryVenue[];
  isLoading?: boolean;
}

function toLineData(venue: PriceHistoryVenue): LinePoint[] {
  if (venue.type === "candle") {
    return (venue.data as OhlcCandle[]).map((c) => ({ time: c.time, value: c.close }));
  }
  return venue.data as LinePoint[];
}

function normalise(points: LinePoint[]): LinePoint[] {
  if (points.length === 0) return points;
  const max = Math.max(...points.map((p) => p.value));
  if (max <= 1) return points.map((p) => ({ ...p, value: p.value * 100 }));
  return points;
}

export default function PriceChart({ venues, isLoading }: PriceChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current || venues.length === 0) return;

    const chart = createChart(containerRef.current, {
      autoSize: true,
      layout: {
        background: { color: "transparent" },
        textColor: "rgba(255,255,255,0.3)",
        fontFamily: "Barlow, sans-serif",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.04)" },
        horzLines: { color: "rgba(255,255,255,0.04)" },
      },
      crosshair: {
        mode: 1,
        vertLine: { color: "rgba(255,255,255,0.12)", labelBackgroundColor: "#2a2a2a" },
        horzLine: { color: "rgba(255,255,255,0.12)", labelBackgroundColor: "#2a2a2a" },
      },
      rightPriceScale: {
        borderColor: "rgba(255,255,255,0.06)",
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        borderColor: "rgba(255,255,255,0.06)",
        fixLeftEdge: true,
        fixRightEdge: true,
      },
    });
    chartRef.current = chart;

    venues.forEach((venue, i) => {
      const color = VENUE_COLORS[venue.venueId] ?? "#ffffff";
      const data = normalise(toLineData(venue));

      chart.addSeries(LineSeries, {
        color,
        lineWidth: i === 0 ? 2 : 1,
        lineStyle: i === 0 ? 0 : 2,
        priceLineVisible: false,
        lastValueVisible: true,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 3,
        crosshairMarkerBorderColor: color,
        crosshairMarkerBackgroundColor: color,
        priceFormat: { type: "custom" as const, formatter: (v: number) => `${Math.round(v)}¢` },
      }).setData(data);
    });

    chart.timeScale().fitContent();

    return () => { chart.remove(); };
  }, [venues]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-8 h-8 rounded-full border-2 animate-spin"
            style={{ borderColor: "rgba(255,255,255,0.1)", borderTopColor: "#7B6EF4" }}
          />
          <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.2)" }}>
            Loading chart…
          </span>
        </div>
      </div>
    );
  }

  if (venues.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.2)" }}>
          No price history available yet
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-3 left-3 z-10 flex items-center gap-3 pointer-events-none">
        {venues.map((v, i) => {
          const color = VENUE_COLORS[v.venueId] ?? "#ffffff";
          const raw = toLineData(v);
          const last = raw.length > 0 ? normalise(raw).at(-1)!.value : null;
          return (
            <div key={v.venueId} className="flex items-center gap-1.5">
              {i > 0 && <div className="w-px h-3" style={{ background: "rgba(255,255,255,0.1)" }} />}
              <div
                className="rounded-full shrink-0"
                style={{ width: 8, height: 8, background: color, opacity: 0.85 }}
              />
              <span
                className="text-[10px] font-medium capitalize"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {v.venueId}
              </span>
              {last !== null && (
                <span className="text-[9px] font-bold" style={{ color }}>
                  {Math.round(last)}¢
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
