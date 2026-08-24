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

let pass = 0;
let fail = 0;
let warn = 0;

function ok(msg) {
  console.log(`[OK]   ${msg}`);
  pass++;
}
function bad(msg) {
  console.log(`[FAIL] ${msg}`);
  fail++;
}
function meh(msg) {
  console.log(`[WARN] ${msg}`);
  warn++;
}

async function main() {
  if (!fs.existsSync(".env.local")) {
    bad(".env.local not found - copy .env.example first");
  } else {
    ok(".env.local present");
  }

  const required = [
    "NEXT_PUBLIC_BASE_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
  ];
  for (const k of required) {
    if (env[k]) ok(`${k} set`);
    else bad(`${k} missing`);
  }

  const optional = [
    "VAPI_API_KEY",
    "RESEND_API_KEY",
    "OWNER_NOTIFY_EMAIL",
    "VAPI_WEBHOOK_SECRET",
  ];
  for (const k of optional) {
    if (env[k]) ok(`${k} set`);
    else meh(`${k} not set yet (fine before go-live)`);
  }

  if (env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/businesses?select=id,name&limit=1`,
        { headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` } }
      );
      if (res.ok) {
        const rows = await res.json();
        ok(
          `Supabase reachable${rows.length ? ` (${rows.length} business found)` : " but businesses table empty - run supabase/schema.sql + seed.sql"}`
        );
      } else {
        bad(`Supabase REST returned ${res.status} - check keys / ran schema.sql?`);
      }
    } catch {
      bad("Supabase unreachable from this machine");
    }
  }

  const base = env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  if (base.includes("localhost")) {
    meh("BASE_URL is localhost - start the app and re-run to test endpoints");
  }
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/api/calls?limit=1`);
    if (res.ok) {
      const data = await res.json();
      ok(`/api/calls responds (mode=${data.mode}, leads=${data.stats.totalCalls})`);
    } else {
      bad(`/api/calls returned ${res.status}`);
    }
  } catch {
    meh(`App not running at ${base} - run 'npm run dev' then re-run check`);
  }

  console.log(`\nResult: ${pass} ok, ${warn} warnings, ${fail} failures`);
  process.exit(fail > 0 ? 1 : 0);
}

main();
