create extension if not exists pgcrypto;

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  source_page text not null,
  source_card text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_created_at_idx
  on public.analytics_events (created_at desc);

create index if not exists analytics_events_event_name_idx
  on public.analytics_events (event_name);

create index if not exists analytics_events_source_card_idx
  on public.analytics_events (source_card);

alter table public.analytics_events enable row level security;

-- Events are written through Next.js server routes with the service role key.
-- No public anon insert policy is required.
