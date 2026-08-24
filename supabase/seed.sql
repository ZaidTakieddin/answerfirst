insert into businesses (name, phone, trade, services)
select 'Palm Premier Realty', '+97140000000', 'real_estate',
       '["Apartments","Villas","Off-plan projects","Viewings"]'::jsonb
where not exists (
  select 1 from businesses where name = 'Palm Premier Realty'
);

insert into calls (business_id, vapi_call_id, caller_number, started_at, ended_at, duration_seconds, outcome, transcript, summary)
select b.id, c.vapi_call_id, c.caller_number, c.started_at, c.ended_at, c.duration_seconds, c.outcome, c.transcript, c.summary
from businesses b
cross join (values
  ('demo-seed-001', '+971505550142', '2026-08-21T10:03:00Z', '2026-08-21T10:06:48Z', 228, 'booked',
   'AI: Thank you for calling Palm Premier Realty, this is Sara.
Caller: I saw your listing for a 2BR in Downtown on Bayut. Is it still available?
AI: May I have your name and callback number? And is this to buy or rent?
Caller: Marcus, buying, around 2.5 million.
AI: We have slots today at 5 PM or tomorrow Saturday at 11 AM.
Caller: Tomorrow at 11 works.
AI: Booked for Saturday at 11:00 AM. The agent will confirm details beforehand.',
   'Bayut lead. Buyer 2BR Downtown ~AED 2.5M. Viewing booked Sat 11 AM.'),
  ('demo-seed-002', '+971555550177', '2026-08-21T07:41:00Z', '2026-08-21T07:43:20Z', 140, 'info',
   'AI: Thank you for calling Palm Premier Realty, this is Sara.
Caller: What are service charges in the JVC building? Is chiller free?
AI: The listing agent will confirm exact figures. Can I take your number?
Caller: Sure, 055 555 0177.',
   'JVC service charge question. Callback captured.'),
  ('demo-seed-003', '+971525550108', '2026-08-20T16:17:00Z', '2026-08-20T16:20:11Z', 191, 'escalated',
   'AI: Thank you for calling Palm Premier Realty, this is Sara.
Caller: Cash buyer, Palm Jumeirah, budget up to 12 million, relocating this month. Urgent.
AI: Flagging this as priority right now - a senior agent will contact you today.
Caller: Khalid, 052 555 0108.',
   'HOT LEAD: cash buyer Palm Jumeirah AED 12M relocating this month. Senior agent alerted.')
) as c(vapi_call_id, caller_number, started_at, ended_at, duration_seconds, outcome, transcript, summary)
where b.name = 'Palm Premier Realty'
  and not exists (select 1 from calls where calls.vapi_call_id = c.vapi_call_id);
