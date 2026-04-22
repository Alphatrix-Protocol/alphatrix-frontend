import { NextResponse } from "next/server";

const BAYSE = "https://relay.bayse.markets/v1/pm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const size     = searchParams.get("size")     ?? "20";
  const status   = searchParams.get("status")   ?? "open";
  const category = searchParams.get("category") ?? "";
  const trending = searchParams.get("trending") ?? "";

  const params = new URLSearchParams({ size, status });
  if (category) params.set("category", category);
  if (trending) params.set("trending", trending);

  const headers: HeadersInit = { "Content-Type": "application/json" };
  const pk = process.env.BAYSE_PUBLIC_KEY;
  if (pk) headers["X-Public-Key"] = pk;

  const res = await fetch(`${BAYSE}/events?${params}`, {
    headers,
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch Bayse events" }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
