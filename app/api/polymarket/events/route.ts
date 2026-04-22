import { NextResponse } from "next/server";

const GAMMA = "https://gamma-api.polymarket.com";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit  = searchParams.get("limit")  ?? "20";
  const active = searchParams.get("active") ?? "true";
  const closed = searchParams.get("closed") ?? "false";

  const params = new URLSearchParams({ limit, active, closed });
  const res = await fetch(`${GAMMA}/events?${params}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch markets" }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
