import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "ghost" | "secondary" | "danger";
type Size = "sm" | "md" | "lg";
type Shape = "slant" | "parallelogram" | "arrow" | "notch";
type Corner = "bottom-right" | "bottom-left" | "top-right" | "top-left";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  shape?: Shape;
  corner?: Corner;
}

const SLANT_CUT: Record<Corner, Record<Size, string>> = {
  "bottom-right": {
    sm: "polygon(0 0, 100% 0, 100% calc(100% - 8px),  calc(100% - 8px)  100%, 0 100%)",
    md: "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)",
    lg: "polygon(0 0, 100% 0, 100% calc(100% - 13px), calc(100% - 13px) 100%, 0 100%)",
  },
  "bottom-left": {
    sm: "polygon(0 0, 100% 0, 100% 100%, 8px  100%, 0 calc(100% - 8px))",
    md: "polygon(0 0, 100% 0, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
    lg: "polygon(0 0, 100% 0, 100% 100%, 13px 100%, 0 calc(100% - 13px))",
  },
  "top-right": {
    sm: "polygon(0 0, calc(100% - 8px)  0, 100% 8px,  100% 100%, 0 100%)",
    md: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
    lg: "polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 0 100%)",
  },
  "top-left": {
    sm: "polygon(8px  0, 100% 0, 100% 100%, 0 100%, 0 8px)",
    md: "polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 10px)",
    lg: "polygon(13px 0, 100% 0, 100% 100%, 0 100%, 0 13px)",
  },
};

// parallelogram: both left and right sides slanted — reads like momentum
// arrow: right edge converges to a point — ultra directional CTA
// notch: small rectangular step cut from bottom-right — technical/circuit feel
const CLIP: Record<Exclude<Shape, "slant">, Record<Size, string>> = {
  parallelogram: {
    sm: "polygon(7px 0, 100% 0, calc(100% - 7px) 100%, 0 100%)",
    md: "polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)",
    lg: "polygon(13px 0, 100% 0, calc(100% - 13px) 100%, 0 100%)",
  },
  arrow: {
    sm: "polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)",
    md: "polygon(0 0, calc(100% - 13px) 0, 100% 50%, calc(100% - 13px) 100%, 0 100%)",
    lg: "polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%)",
  },
  notch: {
    sm: "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)",
    md: "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)",
    lg: "polygon(0 0, 100% 0, 100% calc(100% - 13px), calc(100% - 13px) calc(100% - 13px), calc(100% - 13px) 100%, 0 100%)",
  },
};

const SIZE: Record<Size, string> = {
  sm: "px-3 py-1.5 text-[11px]",
  md: "px-4 py-2 text-xs",
  lg: "px-5 py-2.5 text-sm",
};

const VARIANT: Record<Variant, { base: string; hover: string }> = {
  primary: {
    base:  "bg-primary text-white",
    hover: "hover:bg-primary-hover",
  },
  ghost: {
    base:  "bg-white/3 text-white/60 border border-white/[0.12]",
    hover: "hover:bg-white/[0.04] hover:text-white/80 hover:border-white/20",
  },
  secondary: {
    base:  "bg-white/[0.07] text-white/70",
    hover: "hover:bg-white/[0.11] hover:text-white",
  },
  danger: {
    base:  "bg-red-500/10 text-red-400 border border-red-500/20",
    hover: "hover:bg-red-500/20 hover:text-red-300",
  },
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", shape = "slant", corner = "bottom-right", className = "", style, children, ...props }, ref) => {
    const v = VARIANT[variant];
    const clipPath = shape === "slant" ? SLANT_CUT[corner][size] : CLIP[shape][size];

    return (
      <button
        ref={ref}
        style={{ clipPath, ...style }}
        className={[
          "inline-flex items-center justify-center gap-2",
          "font-medium tracking-wide",
          "transition-all duration-150",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          "outline-none",
          SIZE[size],
          v.base,
          v.hover,
          className,
        ].join(" ")}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps, Variant as ButtonVariant, Size as ButtonSize, Shape as ButtonShape, Corner as ButtonCorner };
