import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { DEMO_CALLS } from "./demo-data";
import type { BookingInput, CallRow, Stats } from "./types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isDbConfigured(): boolean {
  return Boolean(url && key);
}

function admin(): SupabaseClient | null {
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function getRecentCalls(limit = 50): Promise<CallRow[]> {
  const client = admin();
  if (!client) return DEMO_CALLS.slice(0, limit);
  const { data, error } = await client
    .from("calls")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(limit);
  if (error || !data) {
    console.error("[db] getRecentCalls failed", error?.message);
    return [];
  }
  return data as CallRow[];
}

const EXPECTED_VIEWING_VALUE_AED = 2000;

export function computeStats(calls: CallRow[]): Stats {
  const booked = calls.filter((c) => c.outcome === "booked").length;
  const durations = calls
    .map((c) => c.duration_seconds)
    .filter((d): d is number => typeof d === "number");
  const avg =
    durations.length > 0
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : 0;
  return {
    totalCalls: calls.length,
    booked,
    pipelineValueAed: booked * EXPECTED_VIEWING_VALUE_AED,
    avgDurationSec: avg,
  };
}

export async function upsertCall(
  row: Partial<CallRow> & { vapi_call_id: string }
): Promise<void> {
  const client = admin();
  if (!client) {
    console.log("[db] skipped upsert (not configured)");
    return;
  }
  const { error } = await client
    .from("calls")
    .upsert(row, { onConflict: "vapi_call_id" });
  if (error) console.error("[db] upsertCall failed", error.message);
}

export async function insertBooking(b: BookingInput): Promise<string | null> {
  const client = admin();
  if (!client) {
    const ref = `DEMO-${Math.floor(1000 + Math.random() * 9000)}`;
    console.log(`[db] demo booking ${ref}`, b.customer_name);
    return ref;
  }
  const { data, error } = await client
    .from("bookings")
    .insert(b)
    .select("id")
    .single();
  if (error || !data) {
    console.error("[db] insertBooking failed", error?.message);
    return null;
  }
  return data.id as string;
}

export interface InboundMessage {
  channel: string;
  contact_id: string | null;
  contact_name: string | null;
  message_text: string;
  raw: unknown;
}

export async function insertInboundMessage(m: InboundMessage): Promise<void> {
  const client = admin();
  if (!client) {
    console.log("[db] inbound message skipped (not configured):", m.message_text.slice(0, 60));
    return;
  }
  const { error } = await client.from("leads_messages").insert({
    channel: m.channel,
    contact_id: m.contact_id,
    contact_name: m.contact_name,
    message_text: m.message_text,
    raw: m.raw as Record<string, unknown>,
  });
  if (error) console.error("[db] insertInboundMessage failed", error.message);
}
