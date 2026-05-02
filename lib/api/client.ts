import axios from "axios";
import { getAuthToken } from "@/lib/api/auth-token";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export const backendClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});

// Attach Privy JWT to every request — cap the token fetch at 3s so a slow
// Privy response never causes the whole request to time out
backendClient.interceptors.request.use(async (config) => {
  try {
    const token = await Promise.race([
      getAuthToken(),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 3_000)),
    ]);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {
    // proceed without auth header rather than blocking the request
  }
  return config;
});

// Normalise errors so callers get a plain Error with a message
backendClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const message: string =
      err?.response?.data?.message ??
      err?.response?.data?.error ??
      err?.message ??
      "Request failed";
    return Promise.reject(new Error(message));
  }
);

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  query?: Record<string, string | number | undefined>;
  body?: unknown;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", query, body } = options;

  const params: Record<string, string | number> = {};
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") params[k] = v;
    });
  }

  const res = await backendClient.request<T>({
    url: path,
    method,
    params: Object.keys(params).length ? params : undefined,
    data: body,
  });

  return res.data;
}
