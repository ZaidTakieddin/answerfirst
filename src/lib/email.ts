import { Resend } from "resend";
import type { CallRow } from "./types";

type SummaryPayload = Pick<
  CallRow,
  "outcome" | "caller_number" | "duration_seconds" | "summary" | "transcript"
>;

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildHtml(call: SummaryPayload, businessName: string): string {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:auto">
    <h2 style="color:#111">New call handled for ${esc(businessName)}</h2>
    <table style="border-collapse:collapse;width:100%">
      <tr><td style="padding:6px;color:#555">Outcome</td><td style="padding:6px"><b>${esc(
        call.outcome ?? "ended"
      )}</b></td></tr>
      <tr><td style="padding:6px;color:#555">Caller</td><td style="padding:6px">${esc(
        call.caller_number ?? "unknown"
      )}</td></tr>
      <tr><td style="padding:6px;color:#555">Duration</td><td style="padding:6px">${esc(
        String(call.duration_seconds ?? 0)
      )}s</td></tr>
    </table>
    <p style="color:#333"><b>Summary:</b> ${esc(call.summary ?? "n/a")}</p>
    <details style="margin-top:12px">
      <summary style="cursor:pointer;color:#4f8cff">View transcript</summary>
      <pre style="white-space:pre-wrap;background:#f5f7fa;padding:12px;border-radius:8px;font-size:13px">${esc(
        call.transcript ?? ""
      )}</pre>
    </details>
  </div>`;
}

export async function sendCallSummary(
  call: SummaryPayload,
  businessName: string
): Promise<boolean> {
  const to = process.env.OWNER_NOTIFY_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;
  if (!to || !apiKey) {
    console.log("[email] skipped: RESEND_API_KEY or OWNER_NOTIFY_EMAIL missing");
    return false;
  }
  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "AnswerFirst <onboarding@resend.dev>",
      to: [to],
      subject: `Call ${call.outcome ?? "ended"} | ${businessName} | ${
        call.caller_number ?? "unknown"
      }`,
      html: buildHtml(call, businessName),
    });
    return true;
  } catch (err) {
    console.error("[email] send failed", err);
    return false;
  }
}
