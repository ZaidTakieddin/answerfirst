import { NextResponse } from "next/server";
import { computeStats, getRecentCalls, isDbConfigured } from "@/lib/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = Math.min(Number(url.searchParams.get("limit")) || 50, 200);
  const calls = await getRecentCalls(limit);
  return NextResponse.json({
    mode: isDbConfigured() ? "live" : "demo",
    stats: computeStats(calls),
    calls,
  });
}
