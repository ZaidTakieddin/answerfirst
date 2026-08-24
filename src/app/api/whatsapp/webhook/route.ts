import { NextResponse } from "next/server";
import { insertInboundMessage } from "@/lib/db";

interface MetaText {
  body?: string;
}

interface MetaMessage {
  from?: string;
  timestamp?: string;
  text?: MetaText;
  type?: string;
}

interface MetaContact {
  profile?: { name?: string };
  wa_id?: string;
}

interface MetaValue {
  contacts?: MetaContact[];
  messages?: MetaMessage[];
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  const configured = process.env.WHATSAPP_VERIFY_TOKEN;

  if (!configured) {
    return NextResponse.json({
      configured: false,
      hint: "Set WHATSAPP_VERIFY_TOKEN in .env.local, then re-verify in Meta App dashboard",
    });
  }

  if (mode === "subscribe" && token === configured && challenge) {
    return new Response(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }
  return new Response("forbidden", { status: 403 });
}

export async function POST(request: Request) {
  let body: { entry?: Array<{ changes?: Array<{ value?: MetaValue }> }> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ received: true });
  }

  for (const entry of body.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const value = change.value;
      const message = value?.messages?.[0];
      if (!message) continue;
      const contact = value?.contacts?.[0];
      const text =
        message.type === "text" ? message.text?.body ?? "" : `[${message.type}]`;
      await insertInboundMessage({
        channel: "whatsapp",
        contact_id: message.from ?? contact?.wa_id ?? null,
        contact_name: contact?.profile?.name ?? null,
        message_text: text,
        raw: message,
      });
      console.log(`[whatsapp] inbound from ${message.from}: ${text.slice(0, 80)}`);
    }
  }

  return NextResponse.json({ received: true });
}
