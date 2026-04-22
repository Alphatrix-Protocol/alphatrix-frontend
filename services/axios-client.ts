import axios from "axios";

// ── Proxy client → /api/polymarket/* (Next.js routes, no CORS) ───────────────
const appBase =
  typeof window !== "undefined"
    ? ""
    : process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const polymarketProxyClient = axios.create({
  baseURL: `${appBase}/api/polymarket`,
  timeout: 20_000,
  headers: { "Content-Type": "application/json" },
});

export const bayseProxyClient = axios.create({
  baseURL: `${appBase}/api/bayse`,
  timeout: 20_000,
  headers: { "Content-Type": "application/json" },
});

// ── Internal Next.js API routes ───────────────────────────────────────────────
export const apiClient = axios.create({
  baseURL: appBase,
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});

// ── Keep gammaClient for server-side use only (API routes calling Gamma) ──────
export const gammaClient = axios.create({
  baseURL: "https://gamma-api.polymarket.com",
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

export const clobClient = axios.create({
  baseURL: "https://clob.polymarket.com",
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

// ── Shared response interceptor: unwrap .data, surface errors cleanly ─────────
[gammaClient, clobClient, apiClient].forEach((client) => {
  client.interceptors.response.use(
    (res) => res,
    (err) => {
      const message =
        err?.response?.data?.error ??
        err?.response?.data?.message ??
        err?.message ??
        "Unknown error";
      return Promise.reject(new Error(message));
    }
  );
});
