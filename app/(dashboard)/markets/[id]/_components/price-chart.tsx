"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  createChart,
  CandlestickSeries,
  LineSeries,
  type IChartApi,
} from "lightweight-charts";

type OHLCPoint = {
  time: `${number}-${number}-${number}`;
  open: number;
  high: number;
  low: number;
  close: number;
};

type LinePoint = {
  time: `${number}-${number}-${number}`;
  value: number;
};

function toDateStr(d: Date): `${number}-${number}-${number}` {
  return d.toISOString().split("T")[0] as `${number}-${number}-${number}`;
}

function generateOHLC(baseClose: number[]): OHLCPoint[] {
  const start = new Date("2024-10-01");
  return baseClose.map((close, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const swing = 1.5 + Math.random() * 1.5;
    const open = i === 0 ? close - 1 : baseClose[i - 1];
    const high = Math.max(open, close) + swing;
    const low  = Math.min(open, close) - swing;
    return { time: toDateStr(d), open, high, low, close };
  });
}

function generateLine(baseClose: number[], offset: number): LinePoint[] {
  const start = new Date("2024-10-01");
  return baseClose.map((v, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return {
      time: toDateStr(d),
      value: Math.max(1, Math.min(99, v + offset + Math.sin(i * 0.9) * 1.4)),
    };
  });
}

const BASE = [
  35,36,34,37,38,36,40,42,41,43,42,45,44,46,44,47,46,48,
  50,49,51,52,50,53,52,55,54,56,55,57,56,58,57,59,61,60,
  62,61,63,62,64,63,65,64,63,65,66,65,67,66,68,67,66,67,
  68,67,66,67,68,67,
];

const POLY_DATA  = generateOHLC(BASE);
const KALSHI_DATA = generateLine(BASE, -3.5);
const BAYSE_DATA  = generateLine(BASE, -6);

const PLATFORMS = [
  { name: "Polymarket", color: "#7B6EF4", type: "candle" as const },
  { name: "Kalshi",     color: "#60a5fa", type: "line"   as const },
  { name: "Bayse",      color: "#34d399", type: "line"   as const },
];

function BayseLogo({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="4 4 18 14" fill="white">
      <path d="M9.421 17.665a5.26 5.26 0 0 1-5.257-5.26V9.586Q4.163 7.283 5.28 5.984q1.116-1.297 3.03-1.298 1.163 0 1.89.424.728.424 1.213.923.486.498.812.922c.217.283.442.425.666.425s.45-.142.666-.425q.326-.424.813-.922.485-.498 1.212-.923.728-.424 1.89-.424c1.277 0 2.29.43 3.03 1.286q1.117 1.285 1.116 3.614v2.82a5.26 5.26 0 0 1-5.258 5.259H9.416zm9.217-8.076q0-.93-.378-1.396c-.222-.274-.576-.398-.93-.371a1.54 1.54 0 0 0-.958.444q-.473.45-.96.993-.483.547-1.077 1.006-.594.46-1.442.461-.85 0-1.442-.461a8 8 0 0 1-1.078-1.006 15 15 0 0 0-.959-.993q-.472-.45-1.054-.45c-.388 0-.666.16-.885.474q-.327.474-.327 1.299v1.818a3.44 3.44 0 0 0 3.44 3.441H15.2c1.9 0 3.44-1.54 3.44-3.44v-1.82z" />
    </svg>
  );
}

export default function PriceChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
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

    // Polymarket — candlestick primary series
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor:      "#7B6EF4",
      downColor:    "#f87171",
      wickUpColor:  "#7B6EF4",
      wickDownColor:"#f87171",
      borderVisible: false,
      priceFormat: { type: "custom", formatter: (v: number) => `${Math.round(v)}¢` },
    });
    candleSeries.setData(POLY_DATA);

    // Kalshi — line overlay
    const kalshiSeries = chart.addSeries(LineSeries, {
      color: "#60a5fa",
      lineWidth: 1,
      lineStyle: 2, // dashed
      priceLineVisible: false,
      lastValueVisible: true,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 3,
      crosshairMarkerBorderColor: "#60a5fa",
      crosshairMarkerBackgroundColor: "#60a5fa",
      priceFormat: { type: "custom", formatter: (v: number) => `${Math.round(v)}¢` },
    });
    kalshiSeries.setData(KALSHI_DATA);

    // Bayse — line overlay
    const bayseSeries = chart.addSeries(LineSeries, {
      color: "#34d399",
      lineWidth: 1,
      lineStyle: 2, // dashed
      priceLineVisible: false,
      lastValueVisible: true,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 3,
      crosshairMarkerBorderColor: "#34d399",
      crosshairMarkerBackgroundColor: "#34d399",
      priceFormat: { type: "custom", formatter: (v: number) => `${Math.round(v)}¢` },
    });
    bayseSeries.setData(BAYSE_DATA);

    chart.timeScale().fitContent();

    const ro = new ResizeObserver(() => {
      if (containerRef.current) {
        chart.applyOptions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      chart.remove();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Legend */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-3 pointer-events-none">
        {/* Polymarket */}
        <div className="flex items-center gap-1.5">
          <div className="rounded-full overflow-hidden shrink-0" style={{ width: 14, height: 14 }}>
            <Image src="/polylogo.webp" alt="Polymarket" width={14} height={14} className="object-cover" />
          </div>
          <span className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>Polymarket</span>
          <span className="text-[9px] font-bold" style={{ color: "#7B6EF4" }}>67¢</span>
        </div>

        <div className="w-px h-3" style={{ background: "rgba(255,255,255,0.1)" }} />

        {/* Kalshi */}
        <div className="flex items-center gap-1.5">
          <div
            className="flex items-center justify-center rounded-full font-bold shrink-0"
            style={{ width: 14, height: 14, background: "#fff", color: "#0050FF", fontSize: 7 }}
          >
            K
          </div>
          <span className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>Kalshi</span>
          <span className="text-[9px] font-bold" style={{ color: "#60a5fa" }}>63¢</span>
        </div>

        <div className="w-px h-3" style={{ background: "rgba(255,255,255,0.1)" }} />

        {/* Bayse */}
        <div className="flex items-center gap-1.5">
          <div
            className="flex items-center justify-center rounded-full shrink-0"
            style={{ width: 14, height: 14, background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <BayseLogo size={9} />
          </div>
          <span className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>Bayse</span>
          <span className="text-[9px] font-bold" style={{ color: "#34d399" }}>61¢</span>
        </div>
      </div>

      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
