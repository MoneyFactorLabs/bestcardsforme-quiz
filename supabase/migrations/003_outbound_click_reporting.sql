-- Outbound /go/ clicks are rows in analytics_events with event_name = 'outbound_click',
-- written server-side by app/go/[slug]/route.ts. Metadata holds clickId,
-- destinationType, and utm_* campaign fields; no IP address or user agent is stored.

create index if not exists analytics_events_click_id_idx
  on public.analytics_events ((metadata ->> 'clickId'))
  where event_name = 'outbound_click';

create or replace view public.outbound_clicks_daily as
select
  date_trunc('day', created_at)::date as day,
  source_card as card_id,
  source_page,
  coalesce(metadata ->> 'utm_source', '(none)') as utm_source,
  coalesce(metadata ->> 'utm_campaign', '(none)') as utm_campaign,
  count(*) as clicks
from public.analytics_events
where event_name = 'outbound_click'
group by 1, 2, 3, 4, 5;

-- Affiliate network conversions (e.g. CJ commission reports), joined to clicks
-- through the sub-ID the /go/ route appends when a card defines affiliateSubIdParam.
create table if not exists public.affiliate_conversions (
  id uuid primary key default gen_random_uuid(),
  network text not null,
  click_id text,
  card_id text,
  commission numeric(10, 2),
  currency text not null default 'USD',
  occurred_at timestamptz not null,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists affiliate_conversions_click_id_idx
  on public.affiliate_conversions (click_id);

alter table public.affiliate_conversions enable row level security;

create or replace view public.outbound_click_conversions as
select
  clicks.source_card as card_id,
  count(distinct clicks.metadata ->> 'clickId') as clicks,
  count(distinct conversions.id) as conversions,
  coalesce(sum(conversions.commission), 0) as commission
from public.analytics_events clicks
left join public.affiliate_conversions conversions
  on conversions.click_id = clicks.metadata ->> 'clickId'
where clicks.event_name = 'outbound_click'
group by 1;
