import fs from "node:fs";

function loadEnvFile(file) {
  if (!fs.existsSync(file)) return {};
  const out = {};
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return out;
}

const env = { ...loadEnvFile(".env.local"), ...loadEnvFile(".env"), ...process.env };

if (!env.VAPI_API_KEY) {
  console.error("[FAIL] VAPI_API_KEY missing in .env.local");
  console.error("       Get it from dashboard.vapi.ai > API Keys (Privacy section)");
  process.exit(1);
}
if (!env.NEXT_PUBLIC_BASE_URL || env.NEXT_PUBLIC_BASE_URL.includes("localhost")) {
  console.error(
    "[FAIL] NEXT_PUBLIC_BASE_URL must be your deployed HTTPS URL (Vapi cloud must reach it)."
  );
  process.exit(1);
}

const raw = fs.readFileSync("vapi/assistant-config.json", "utf8");
const filled = raw
  .replace(/\{\{BASE_URL\}\}/g, env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, ""))
  .replace(/\{\{VAPI_WEBHOOK_SECRET\}\}/g, env.VAPI_WEBHOOK_SECRET || "")
  .replace(/\{\{CARTESIA_VOICE_ID\}\}/g, env.CARTESIA_VOICE_ID || "");
const assistant = JSON.parse(filled);

const res = await fetch("https://api.vapi.ai/assistant", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${env.VAPI_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(assistant),
});

const text = await res.text();
if (!res.ok) {
  console.error(`[FAIL] Vapi API ${res.status}: ${text.slice(0, 400)}`);
  process.exit(1);
}
const created = JSON.parse(text);
console.log(`[OK]   Assistant created: ${created.name} (id=${created.id})`);
console.log(`
NEXT STEPS
1. dashboard.vapi.ai > Provider Keys: add Google (Gemini), Deepgram, Cartesia keys.
2. Attach a phone number to assistant id ${created.id}
   (Phone Numbers > Create/Buy, or import from Twilio/Telnyx).
3. Forward your UAE mobile to that number:
     du / Etisalat: dial **21*<vapi-number># then call key
     cancel anytime: ##21#
4. Call it. Leads appear on ${env.NEXT_PUBLIC_BASE_URL}/dashboard
`);
