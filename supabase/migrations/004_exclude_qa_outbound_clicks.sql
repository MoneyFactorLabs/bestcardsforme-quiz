-- QA and release-verification clicks are tagged utm_source=bcfm-qa (e.g. bcfm-qa,
-- bcfm-qa-release). They stay in analytics_events for audit, but business reporting
-- views exclude them. Idempotent: only the view filters change, columns are unchanged.

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
  and coalesce(metadata ->> 'utm_source', '') not like 'bcfm-qa%'
group by 1, 2, 3, 4, 5;

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
  and coalesce(clicks.metadata ->> 'utm_source', '') not like 'bcfm-qa%'
group by 1;

-- QA clicks only, so release verification can confirm a tagged click was persisted.
create or replace view public.outbound_clicks_qa as
select
  created_at,
  source_card as card_id,
  source_page,
  metadata ->> 'utm_source' as utm_source,
  metadata ->> 'utm_campaign' as utm_campaign,
  metadata ->> 'clickId' as click_id
from public.analytics_events
where event_name = 'outbound_click'
  and coalesce(metadata ->> 'utm_source', '') like 'bcfm-qa%';
