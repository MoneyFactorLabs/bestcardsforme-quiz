create extension if not exists pgcrypto;

create table if not exists public.captured_emails (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source_page text not null,
  source_card text,
  created_at timestamptz not null default now()
);

create index if not exists captured_emails_created_at_idx
  on public.captured_emails (created_at desc);

create index if not exists captured_emails_email_idx
  on public.captured_emails (email);

alter table public.captured_emails enable row level security;

-- Inserts are performed only from the Next.js server route with the service role key.
-- No public anon policy is required for V2.5.
