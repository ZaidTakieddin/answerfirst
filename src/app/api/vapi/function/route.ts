import { NextResponse } from "next/server";
import { defaultHours, isOpenNow, nextOpenings, parseArgs } from "@/lib/hours";
import { insertBooking, isDbConfigured } from "@/lib/db";

interface ToolCall {
  id: string;
  function?: { name?: string; arguments?: unknown };
}

interface VapiFunctionBody {
  message?: {
    type?: string;
    toolCallList?: ToolCall[];
  };
}

function str(args: Record<string, unknown>, key: string): string {
  const v = args[key];
  return typeof v === "string" ? v.trim() : "";
}

async function runTool(
  name: string,
  args: Record<string, unknown>
): Promise<string> {
  if (name === "check_availability") {
    const hours = defaultHours();
    if (isOpenNow(hours)) {
      const slots = nextOpenings(hours, 3);
      return `The office is open right now. The earliest available viewing slots are: ${slots.join(
        ", "
      )}. Offer these to the caller.`;
    }
    const slots = nextOpenings(hours, 3);
    return `The office is currently closed. The next available viewing slots are: ${slots.join(
      ", "
    )}. Offer these to the caller.`;
  }

  if (name === "book_viewing") {
    const customerName = str(args, "customer_name");
    const customerPhone = str(args, "customer_phone");
    const preferredTime = str(args, "preferred_time") || str(args, "scheduled_for");
    const propertyRef = str(args, "property_ref");
    if (!customerName || !customerPhone || !preferredTime) {
      return "Missing required details. Ask the caller for their name, phone number, and preferred viewing time before booking.";
    }
    const detail = propertyRef
      ? `Viewing: ${propertyRef}`
      : "Property viewing";
    const ref = await insertBooking({
      customer_name: customerName,
      customer_phone: customerPhone,
      service: detail,
      scheduled_for: preferredTime,
      notes:
        str(args, "notes") ||
        [
          str(args, "buy_or_rent") && `type=${str(args, "buy_or_rent")}`,
          str(args, "budget") && `budget=${str(args, "budget")}`,
          str(args, "area") && `area=${str(args, "area")}`,
        ]
          .filter(Boolean)
          .join(", ") || null,
    });
    const display = ref ?? String(Math.floor(1000 + Math.random() * 9000));
    return `Viewing confirmed for ${customerName} at ${preferredTime}. Reference number ${display}. Confirm the time and that the agent will WhatsApp them the location beforehand.`;
  }

  if (name === "notify_agent") {
    const reason = str(args, "reason");
    console.log(
      `[hot-lead] senior agent notified${isDbConfigured() ? "" : " (demo mode)"}: ${reason}`
    );
    return "A senior agent has been alerted and will follow up shortly. Reassure the caller that someone will contact them very soon.";
  }

  return `Unknown tool ${name}`;
}

export async function POST(request: Request) {
  let body: VapiFunctionBody;
  try {
    body = (await request.json()) as VapiFunctionBody;
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const toolCalls = body.message?.toolCallList ?? [];
  const results = await Promise.all(
    toolCalls.map(async (tc) => ({
      toolCallId: tc.id,
      result: await runTool(tc.function?.name ?? "", parseArgs(tc.function?.arguments)),
    }))
  );

  return NextResponse.json({ results });
}
