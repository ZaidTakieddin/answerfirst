import { NextResponse } from "next/server";
import { isDbConfigured, upsertCall } from "@/lib/db";
import { sendCallSummary } from "@/lib/email";
import type { CallRow, Outcome } from "@/lib/types";

interface VapiMessage {
  type?: string;
  call?: {
    id?: string;
    from?: string;
    startedAt?: string;
    endedAt?: string;
  };
  artifact?: { transcript?: string; recordingUrl?: string };
  transcript?: string;
  analysis?: { summary?: string };
  messagesSummary?: Array<{ summary?: string }>;
}

function inferOutcome(summary: string, transcript: string): Outcome {
  const text = `${summary} ${transcript}`.toLowerCase();
  if (
    /cash buyer|ready to buy|relocating this (month|week)|urgent|investor/.test(
      text
    )
  )
    return "escalated";
  if (/viewing|booked|appointment confirmed/.test(text)) return "booked";
  if (/callback|call (you|me) back|after \d|send (me )?(the )?(options|listings|payment plan)/.test(text))
    return "voicemail";
  if (/robocall|selected for|ranking service|warranty department/.test(text))
    return "spam";
  return "info";
}

export async function POST(request: Request) {
  const secret = process.env.VAPI_WEBHOOK_SECRET;
  if (secret && request.headers.get("x-vapi-secret") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: VapiMessage;
  try {
    body = (await request.json()) as VapiMessage;
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  if (!isDbConfigured()) {
    console.log("[webhook] received event but DB not configured:", body.type);
    return NextResponse.json({
      received: true,
      warning: "SUPABASE not configured - event logged only",
    });
  }

  if (body.type === "end-of-call-report" || body.call?.id) {
    const started = body.call?.startedAt
      ? new Date(body.call.startedAt)
      : null;
    const ended = body.call?.endedAt ? new Date(body.call.endedAt) : null;
    const duration =
      started && ended ? Math.round((ended.getTime() - started.getTime()) / 1000) : null;
    const transcript =
      body.artifact?.transcript ?? body.transcript ?? "";
    const summary =
      body.analysis?.summary ?? body.messagesSummary?.[0]?.summary ?? "";

    const row: Partial<CallRow> & { vapi_call_id: string } = {
      vapi_call_id: body.call?.id ?? `unknown-${Date.now()}`,
      caller_number: body.call?.from ?? null,
      started_at: body.call?.startedAt ?? new Date().toISOString(),
      ended_at: body.call?.endedAt ?? new Date().toISOString(),
      duration_seconds: duration,
      outcome: inferOutcome(summary, transcript),
      transcript,
      summary,
      recording_url: body.artifact?.recordingUrl ?? null,
    };

    await upsertCall(row);

    if (
      process.env.OWNER_NOTIFY_EMAIL &&
      process.env.RESEND_API_KEY &&
      row.outcome !== "spam"
    ) {
      await sendCallSummary(
        {
          outcome: row.outcome ?? "info",
          caller_number: row.caller_number ?? null,
          duration_seconds: row.duration_seconds ?? null,
          summary: row.summary ?? null,
          transcript: row.transcript ?? null,
        },
        process.env.BUSINESS_NAME || "your business"
      );
    }
  }

  return NextResponse.json({ received: true });
}
