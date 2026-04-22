/**
 * Design tokens for use in inline styles and dynamic style logic.
 * For static Tailwind classes, use the CSS variables defined in globals.css.
 */

export const colors = {
  primary:      "#7B6EF4",
  primaryHover: "#6a5de3",
  success:      "#34d399",
  danger:       "#f87171",
  info:         "#60a5fa",
  bg:           "#161616",
  bgElevated:   "#1a1a1a",
  bgDeep:       "#0a0a0a",

  platform: {
    polymarket: "#6E3FF3",
    kalshi:     "#0050FF",
    bayse:      "#111111",
  },
} as const;

/** White-overlay surfaces for depth layering */
export const surfaces = {
  1:     "rgba(255, 255, 255, 0.02)",
  2:     "rgba(255, 255, 255, 0.04)",
  3:     "rgba(255, 255, 255, 0.06)",
  4:     "rgba(255, 255, 255, 0.08)",
  5:     "rgba(255, 255, 255, 0.12)",
  hover: "rgba(255, 255, 255, 0.03)",
} as const;

export const borders = {
  subtle:  "rgba(255, 255, 255, 0.04)",
  default: "rgba(255, 255, 255, 0.06)",
  mid:     "rgba(255, 255, 255, 0.08)",
  strong:  "rgba(255, 255, 255, 0.12)",
  primary: "rgba(123, 110, 244, 0.20)",
  success: "rgba(52,  211, 153, 0.20)",
  danger:  "rgba(248, 113, 113, 0.20)",
} as const;

export const text = {
  primary:   "rgba(255, 255, 255, 1.00)",
  secondary: "rgba(255, 255, 255, 0.60)",
  tertiary:  "rgba(255, 255, 255, 0.40)",
  muted:     "rgba(255, 255, 255, 0.25)",
  dim:       "rgba(255, 255, 255, 0.15)",
} as const;

/** Transparent variants of semantic colors for badges, highlights, etc. */
export const alpha = {
  primary: {
    10: "rgba(123, 110, 244, 0.10)",
    15: "rgba(123, 110, 244, 0.15)",
    20: "rgba(123, 110, 244, 0.20)",
    30: "rgba(123, 110, 244, 0.30)",
  },
  success: {
    10: "rgba(52,  211, 153, 0.10)",
    15: "rgba(52,  211, 153, 0.15)",
    20: "rgba(52,  211, 153, 0.20)",
  },
  danger: {
    10: "rgba(248, 113, 113, 0.10)",
    15: "rgba(248, 113, 113, 0.15)",
    20: "rgba(248, 113, 113, 0.20)",
  },
} as const;

export const radius = {
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
} as const;

export const duration = {
  fast:   "150ms",
  normal: "250ms",
  slow:   "400ms",
} as const;

export const layout = {
  sidebarWidth: "210px",
} as const;

/** Typography size scale (px) — matches the custom sizes used in components */
export const fontSize = {
  "2xs": "8px",
  xs:    "10px",
  sm:    "11px",
  base:  "13px",
  md:    "14px",
  lg:    "16px",
  xl:    "18px",
  "2xl": "22px",
  "3xl": "32px",
  "4xl": "48px",
} as const;

/**
 * Responsive breakpoints (mirrors Tailwind config).
 * Use in JS-driven conditional logic; prefer Tailwind classes for CSS.
 */
export const breakpoints = {
  xs:  375,
  sm:  640,
  md:  768,
  lg:  1024,
  xl:  1280,
  "2xl": 1536,
} as const;

/** Chart-specific colors (used with lightweight-charts) */
export const chartColors = {
  polymarket: {
    up:   colors.primary,
    down: colors.danger,
  },
  kalshi: {
    line: colors.info,
  },
  bayse: {
    line: colors.success,
  },
  grid:       "rgba(255, 255, 255, 0.04)",
  gridText:   "rgba(255, 255, 255, 0.30)",
  crosshair:  "rgba(255, 255, 255, 0.20)",
} as const;
