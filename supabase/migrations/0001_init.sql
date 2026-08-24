create extension if not exists pgcrypto;

create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  trade text not null default 'real_estate',
  timezone text not null default 'Asia/Dubai',
  hours jsonb not null default '{"mon":["09:00","19:00"],"tue":["09:00","19:00"],"wed":["09:00","19:00"],"thu":["09:00","19:00"],"fri":["09:00","19:00"],"sat":["10:00","18:00"],"sun":null}'::jsonb,
  services jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists calls (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete set null,
  vapi_call_id text unique,
  caller_number text,
  started_at timestamptz,
  ended_at timestamptz,
  duration_seconds integer,
  outcome text check (outcome in ('booked','info','voicemail','spam','escalated','failed')),
  transcript text,
  summary text,
  recording_url text,
  created_at timestamptz not null default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete set null,
  call_id uuid references calls(id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  service text,
  scheduled_for text,
  notes text,
  status text not null default 'confirmed',
  created_at timestamptz not null default now()
);

create table if not exists leads_messages (
  id uuid primary key default gen_random_uuid(),
  channel text not null default 'whatsapp',
  contact_id text,
  contact_name text,
  message_text text,
  raw jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_calls_started on calls (started_at desc);
create index if not exists idx_bookings_business on bookings (business_id);

alter table businesses enable row level security;
alter table calls enable row level security;
alter table bookings enable row level security;
alter table leads_messages enable row level security;
