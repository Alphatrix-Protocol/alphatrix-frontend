import Image from "next/image";

export const VENUE_DISPLAY_NAMES: Record<string, string> = {
  polymarket: "Polymarket",
  bayse: "Bayes Market",
  kalshi: "Kalshi",
};

interface PlatformLogoProps {
  platform: string;
  size?: number;
}

export default function PlatformLogo({ platform, size = 18 }: PlatformLogoProps) {
  if (platform === "polymarket") {
    return (
      <div className="rounded-full overflow-hidden shrink-0" style={{ width: size, height: size }}>
        <Image src="/polylogo.webp" alt="Polymarket" width={size} height={size} className="object-cover" />
      </div>
    );
  }

  if (platform === "bayse") {
    return (
      <div
        className="flex items-center justify-center rounded-full shrink-0 overflow-hidden"
        style={{ width: size, height: size, background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.12)" }}
      >
        <svg width={size * 0.75} height={size * 0.75} viewBox="4 4 18 14" fill="white">
          <mask id="bayse-logo-mask" width="18" height="14" x="4" y="4" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }}>
            <path fill="#fff" d="M9.421 17.665a5.26 5.26 0 0 1-5.257-5.26V9.586Q4.163 7.283 5.28 5.984q1.116-1.297 3.03-1.298 1.163 0 1.89.424.728.424 1.213.923.486.498.812.922c.217.283.442.425.666.425s.45-.142.666-.425q.326-.424.813-.922.485-.498 1.212-.923.728-.424 1.89-.424c1.277 0 2.29.43 3.03 1.286q1.117 1.285 1.116 3.614v2.82a5.26 5.26 0 0 1-5.258 5.259H9.416zm9.217-8.076q0-.93-.378-1.396c-.222-.274-.576-.398-.93-.371a1.54 1.54 0 0 0-.958.444q-.473.45-.96.993-.483.547-1.077 1.006-.594.46-1.442.461-.85 0-1.442-.461a8 8 0 0 1-1.078-1.006 15 15 0 0 0-.959-.993q-.472-.45-1.054-.45c-.388 0-.666.16-.885.474q-.327.474-.327 1.299v1.818a3.44 3.44 0 0 0 3.44 3.441H15.2c1.9 0 3.44-1.54 3.44-3.44v-1.82z" />
          </mask>
          <g mask="url(#bayse-logo-mask)">
            <path fill="white" d="M9.421 17.665a5.26 5.26 0 0 1-5.257-5.26V9.586Q4.163 7.283 5.28 5.984q1.116-1.297 3.03-1.298 1.163 0 1.89.424.728.424 1.213.923.486.498.812.922c.217.283.442.425.666.425s.45-.142.666-.425q.326-.424.813-.922.485-.498 1.212-.923.728-.424 1.89-.424c1.277 0 2.29.43 3.03 1.286q1.117 1.285 1.116 3.614v2.82a5.26 5.26 0 0 1-5.258 5.259H9.416zm9.217-8.076q0-.93-.378-1.396c-.222-.274-.576-.398-.93-.371a1.54 1.54 0 0 0-.958.444q-.473.45-.96.993-.483.547-1.077 1.006-.594.46-1.442.461-.85 0-1.442-.461a8 8 0 0 1-1.078-1.006 15 15 0 0 0-.959-.993q-.472-.45-1.054-.45c-.388 0-.666.16-.885.474q-.327.474-.327 1.299v1.818a3.44 3.44 0 0 0 3.44 3.441H15.2c1.9 0 3.44-1.54 3.44-3.44v-1.82z" />
          </g>
        </svg>
      </div>
    );
  }

  // Generic fallback — first letter of venueId
  return (
    <div
      className="flex items-center justify-center rounded-full font-bold shrink-0"
      style={{ width: size, height: size, background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", fontSize: size * 0.44 }}
    >
      {platform.charAt(0).toUpperCase()}
    </div>
  );
}
