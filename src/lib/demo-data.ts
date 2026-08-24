import type { CallRow } from "./types";

export const DEMO_CALLS: CallRow[] = [
  {
    id: "d1a10000-0000-4000-8000-000000000001",
    business_id: null,
    vapi_call_id: "demo-call-001",
    caller_number: "+971 50 555 0142",
    started_at: "2026-08-21T10:03:00.000Z",
    ended_at: "2026-08-21T10:06:48.000Z",
    duration_seconds: 228,
    outcome: "booked",
    transcript:
      "AI: Thank you for calling Palm Premier Realty, this is Sara. How can I help you today?\nCaller: Hi, I saw your listing for a 2BR in Downtown on Bayut. Is it still available?\nAI: I can help with that. May I have your name and a callback number, please?\nCaller: Marcus, and it's 050 555 0142.\nAI: Thanks, Marcus. So I book the right viewing - is this to buy or rent, and what's your budget range?\nCaller: Buying, around 2.5 million.\nAI: Perfect. We have viewing slots today at 5:00 PM or tomorrow Saturday at 11:00 AM. Which suits you?\nCaller: Tomorrow at 11 works.\nAI: You're booked for tomorrow, Saturday at 11:00 AM at the Downtown tower. The listing agent will meet you in the lobby and will confirm the current availability details beforehand. Anything else?\nCaller: No, that's great.",
    summary:
      "Bayut lead. Buyer, 2BR Downtown, budget ~AED 2.5M. Viewing booked Sat 11:00 AM. Marcus +971505550142.",
    recording_url: null,
  },
  {
    id: "d1a10000-0000-4000-8000-000000000002",
    business_id: null,
    vapi_call_id: "demo-call-002",
    caller_number: "+971 55 555 0177",
    started_at: "2026-08-21T07:41:00.000Z",
    ended_at: "2026-08-21T07:43:20.000Z",
    duration_seconds: 140,
    outcome: "info",
    transcript:
      "AI: Thank you for calling Palm Premier Realty, this is Sara. How may I help?\nCaller: What are the service charges like in that JVC building you listed? And is chiller free?\nAI: Good questions - I'll have the listing agent confirm the exact service charge per square foot and the chiller arrangement for you. Can I take your number so they can send the details today?\nCaller: Sure, 055 555 0177.\nAI: Noted. Someone will reach out shortly with the confirmed figures.",
    summary:
      "Service charges + chiller question on JVC listing. Agent to confirm figures. Callback captured.",
    recording_url: null,
  },
  {
    id: "d1a10000-0000-4000-8000-000000000003",
    business_id: null,
    vapi_call_id: "demo-call-003",
    caller_number: "+971 52 555 0108",
    started_at: "2026-08-20T16:17:00.000Z",
    ended_at: "2026-08-20T16:20:11.000Z",
    duration_seconds: 191,
    outcome: "escalated",
    transcript:
      "AI: Thank you for calling Palm Premier Realty, this is Sara. How can I help you tonight?\nCaller: I'm a cash buyer looking at Palm Jumeirah, budget up to 12 million, and I'm relocating to Dubai this month. I need to see options urgently.\nAI: Understood - that's exactly what our senior agent should handle personally. Let me flag this as priority right now.\nCaller: Yes please, I land Thursday.\nAI: A senior agent will contact you today to arrange viewings before Thursday. May I confirm your name and number?\nCaller: Khalid, 052 555 0108.\nAI: Confirmed, Khalid. You'll hear from us shortly.",
    summary:
      "HOT LEAD: cash buyer, Palm Jumeirah, budget AED 12M, relocating this month. Senior agent alerted immediately.",
    recording_url: null,
  },
  {
    id: "d1a10000-0000-4000-8000-000000000004",
    business_id: null,
    vapi_call_id: "demo-call-004",
    caller_number: "+971 56 555 0163",
    started_at: "2026-08-20T11:52:00.000Z",
    ended_at: "2026-08-20T11:55:37.000Z",
    duration_seconds: 225,
    outcome: "booked",
    transcript:
      "AI: Thank you for calling Palm Premier Realty, this is Sara. How can I help?\nCaller: Hello, my family wants to rent a 3BR villa in Arabian Ranches. Do you have anything?\nAI: We likely do. May I have your name and WhatsApp number? And when are you looking to move?\nCaller: Dana Whitfield, 056 555 0163, within two months.\nAI: Thanks Dana. And what's your monthly budget range?\nCaller: Around 180,000 a year.\nAI: Great. We have viewing slots Friday at 4:00 PM or Sunday at 12:00 PM. Which would you prefer?\nCaller: Friday afternoon works.\nAI: Booked - Friday at 4:00 PM. The agent will WhatsApp you the location pin beforehand. Anything else?",
    summary:
      "Rental lead: 3BR villa Arabian Ranches, AED 180k/yr, moving in 2 months. Viewing booked Fri 4 PM. Dana.",
    recording_url: null,
  },
  {
    id: "d1a10000-0000-4000-8000-000000000005",
    business_id: null,
    vapi_call_id: "demo-call-005",
    caller_number: "Unknown",
    started_at: "2026-08-19T15:28:00.000Z",
    ended_at: "2026-08-19T15:28:31.000Z",
    duration_seconds: 31,
    outcome: "spam",
    transcript:
      "AI: Thank you for calling Palm Premier Realty, this is Sara.\nCaller: ...Congratulations, your company has been selected for a Google ranking service...\nAI: This line is for property inquiries only. Goodbye.",
    summary: "Robocall/spam. Terminated.",
    recording_url: null,
  },
  {
    id: "d1a10000-0000-4000-8000-000000000006",
    business_id: null,
    vapi_call_id: "demo-call-006",
    caller_number: "+971 54 555 0126",
    started_at: "2026-08-19T18:04:00.000Z",
    ended_at: "2026-08-19T18:06:52.000Z",
    duration_seconds: 172,
    outcome: "voicemail",
    transcript:
      "AI: Thank you for calling Palm Premier Realty, this is Sara. How can I help?\nCaller: Yeah, I'm interested in the off-plan project you posted in Dubai South. Send me the payment plan and available units. Call me after six, I'm at work.\nAI: Absolutely - I'm logging your request and an agent will call you back after 6:00 PM with the payment plan and current unit availability. Best number is this one?\nCaller: Yes.\nAI: Noted. Talk to you soon.",
    summary:
      "Off-plan Dubai South inquiry. Wants payment plan + units. Callback after 6 PM requested.",
    recording_url: null,
  },
];
