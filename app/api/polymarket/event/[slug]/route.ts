import { NextResponse } from "next/server";

const GAMMA = "https://gamma-api.polymarket.com";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await fetch(`${GAMMA}/events/slug/${encodeURIComponent(slug)}`, {
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Event not found" }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
