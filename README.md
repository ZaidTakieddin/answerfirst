# AnswerFirst AI — MVP (Dubai Real Estate)

AI lead desk for Dubai real-estate brokerages. Answers every portal/phone lead instantly in English or Arabic, qualifies the buyer, books viewings, escalates hot leads to senior agents, and shows pipeline value in a dashboard.

**Stack:** Next.js 15 (App Router) · Supabase (Postgres) · Vapi (voice) · Gemini/Groq/Cartesia (BYO keys) · Resend (email) · deployable free on Netlify.

## Repo layout

```
src/app/page.tsx                  landing page
src/app/dashboard/page.tsx        agent dashboard (lead feed + pipeline stats)
src/app/api/vapi/webhook/route.ts receives end-of-call reports -> Supabase + email
src/app/api/vapi/function/route.ts handles in-call tools: check_availability / book_viewing / notify_agent
src/app/api/whatsapp/webhook/route.ts Meta Cloud API webhook (verification + inbound lead capture)
src/app/api/calls/route.ts        JSON feed of calls + stats
src/lib/                          db, email, hours logic, types, demo data
supabase/migrations/0001_init.sql  schema-as-code (applied via CLI or CI on push)
supabase/seed.sql                  sample agency + leads (also loaded by supabase db reset)
vapi/assistant-config.json        importable Vapi assistant definition (bilingual prompt)
scripts/provision-vapi.mjs        one command: create the assistant on Vapi via API
scripts/setup-check.mjs           pre-flight check of env, Supabase, and endpoints (npm run check)
outreach/playbook.md              DM / cold-call / follow-up scripts for broker pilots
.github/workflows/keepalive.yml   pings Supabase every 3h so Free tier never pauses
```

## Quick start (local, $0)

1. **Install & run**

   ```powershell
   npm install
   copy .env.example .env.local
   npm run dev
   ```

   Open http://localhost:3000 — landing page works immediately; `/dashboard` shows sample data in DEMO MODE.

2. **Supabase (free tier)**
   - Create a project at supabase.com → SQL Editor.
   - Paste and run `supabase/migrations/0001_init.sql`, then `supabase/seed.sql`.
   - Copy `Project URL` → `.env.local` as `NEXT_PUBLIC_SUPABASE_URL`.
   - Settings → API → copy `service_role` secret → `SUPABASE_SERVICE_ROLE_KEY`.
   - Restart `npm run dev`. Dashboard badge flips to LIVE.

### Schema as code (migrations)

The schema lives in `supabase/migrations/`. Never edit the dashboard SQL editor for structural changes — add a migration instead:

```powershell
npx supabase login                                  # one-time, opens browser
npx supabase link --project-ref <your-project-ref>  # from Supabase Settings > General
npx supabase db push                                # applies pending migrations
```

To change schema: create `supabase/migrations/0002_whatever.sql` with plain `ALTER TABLE` statements and push. Already-applied files are tracked in `supabase_migrations.schema_migrations` on the remote and never re-run.

**Automatic via GitHub:** every push to `main` that touches `supabase/migrations/**` triggers `.github/workflows/apply-migrations.yml`, which pushes migrations for you. One-time repo secrets to set (Settings → Secrets and variables → Actions):

| Secret | Where to get it |
|---|---|
| SUPABASE_ACCESS_TOKEN | supabase.com/dashboard/account/tokens ("Generate new token") |
| SUPABASE_PROJECT_ID | The ref string in Settings → General → Reference Information |

3. **Vapi (voice brain)** — dashboard.vapi.ai
   - Add provider keys: Google (Gemini API key), Deepgram (STT — config uses `nova-2` with `multi` language for Arabic/English code-switching), Cartesia or ElevenLabs (TTS).
   - Recreate/import the assistant from `vapi/assistant-config.json`. Replace `{{BASE_URL}}`, `{{VAPI_WEBHOOK_SECRET}}`, `{{CARTESIA_VOICE_ID}}`.
   - Test Arabic and English calls yourself before any pilot. Dialect quality is the #1 failure mode for Gulf voice AI — verify it handles Emirati/Egyptian/Levantine callers you actually serve.
   - Get a phone number in Vapi (trial credit covers it) and call it. Leads land in Supabase → dashboard.

4. **Deploy (free, commercial OK)**
   - Netlify free tier supports Next.js natively. Alternative: Cloudflare Workers via `@opennextjs/cloudflare`. Avoid Vercel Hobby for commercial use (ToS).
   - Set all env vars in the host dashboard; point Vapi webhook/function URLs at the deployed domain.
   - Forward the agency's number with their carrier's conditional-call-forwarding code (Etisalat/du support `**21*` style codes).

5. **Email summaries (optional but recommended)**
   - resend.com free account → fill `RESEND_API_KEY`, `OWNER_NOTIFY_EMAIL`, optional `EMAIL_FROM`.

## Go-live runbook (the day your UAE number arrives)

Prereq: steps 1–3 of Quick Start done, app deployed with HTTPS URL.

1. `npm run check` — everything must pass except VAPI_API_KEY warnings.
2. Add `VAPI_API_KEY` to `.env.local`, then `npm run provision`.
   This creates the assistant on Vapi with all placeholders filled. It prints the assistant id.
3. dashboard.vapi.ai → Provider Keys: add Google (Gemini), Deepgram, Cartesia keys.
4. Phone Numbers: create/import a number and attach the assistant from step 2.
5. On the UAE mobile, forward to the Vapi number:
   - Activate: dial `**21*<vapi-number>#` then call button
   - Cancel: `##21#`
   - Variants: `*61*` no-answer, `*62*` unreachable, `*67*` busy
6. Call the +971 number yourself (English, then Arabic). Confirm the lead shows on `/dashboard`.
7. Register WhatsApp Business on the same SIM; set webhook URL to
   `https://<your-domain>/api/whatsapp/webhook` with `WHATSAPP_VERIFY_TOKEN`, then click Verify in Meta.
8. Start outreach (`outreach/playbook.md`) — every prospect dials your +971 line as the demo.

Total time once keys are in hand: ~15–20 minutes.

## UAE-specific notes

- **Telephony:** Twilio does not offer local UAE numbers. Start with a Vapi-provided international number for pilots; move to an e&/du SIP trunk for production landline presence.
- **Payments:** Stripe operates in UAE; bank transfer is also normal for SMEs. Price in AED (landing defaults to AED 1,499/mo per agent line).
- **Calendar:** default hours use the UAE work week (Mon–Fri + Sat, closed Sunday); Ramadan hours are just a rows update.
- **WhatsApp channel:** the biggest Gulf SMBs live on WhatsApp. Next milestone after voice pilots: WhatsApp Business Cloud API inbound agent reusing the same qualification logic and Supabase tables.
- **Arabic roadmap:** current prompt is bilingual via Gemini + Deepgram multi. For dialect depth, evaluate regional STT/TTS partners later.

## Env vars

| Var | Purpose |
|---|---|
| NEXT_PUBLIC_BASE_URL | Public URL used when configuring Vapi server URLs |
| NEXT_PUBLIC_DEMO_PHONE | Phone shown on landing page CTA |
| NEXT_PUBLIC_TALLY_URL | Lead form link |
| NEXT_PUBLIC_SUPABASE_URL | Supabase project URL |
| SUPABASE_SERVICE_ROLE_KEY | Server-only DB key (never expose to browser) |
| RESEND_API_KEY | Email delivery |
| EMAIL_FROM | From header |
| OWNER_NOTIFY_EMAIL | Where call summaries go |
| VAPI_WEBHOOK_SECRET | Shared secret checked against `x-vapi-secret` header |
| BUSINESS_NAME | Agency name used in email summaries |
| VAPI_API_KEY | Used by `npm run provision` to create the assistant via API |
| CARTESIA_VOICE_ID | Voice for the agent (pick one in Cartesia dashboard) |
| WHATSAPP_VERIFY_TOKEN | Shared token for Meta webhook verification |
| WHATSAPP_TOKEN | Meta Cloud API access token (for sending replies later) |
| WHATSAPP_PHONE_NUMBER_ID | Meta Cloud API phone number id (for sending replies later) |

## Security notes

- Service-role key is used only in server routes/lib — never shipped to the client.
- Webhook validates the shared secret when `VAPI_WEBHOOK_SECRET` is set.
- RLS is enabled on all tables with no public policies: only server-side service-role access works until you add client auth later.

## Pilot metrics that matter

- Median first-response time to portal leads (get baseline from the agency first)
- After-hours / missed leads recovered per week
- Viewings booked per week and show-up rate
- Deals attributed within 90 days (ask agents to tag them)
- Full-price conversion by day 60, else pivot the vertical and keep the stack

## Upgrade triggers (only when pilots pay)

- Real phone numbers (~AED 15/mo equivalent each)
- Paid STT/TTS once free tiers cap out (~AED 0.10–0.20/min total)
- Supabase Pro ($25) if >500MB or backups needed
