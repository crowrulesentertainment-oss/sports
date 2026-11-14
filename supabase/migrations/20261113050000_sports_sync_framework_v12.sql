-- CrowRules Sports V12: private provider-sync control plane.
create table if not exists public.cr_sports_sync_jobs (
 id uuid primary key default gen_random_uuid(),sport text not null,feed text not null,endpoint text not null,
 parameters jsonb not null default '{}'::jsonb,is_enabled boolean not null default false,
 interval_seconds integer not null default 900 check(interval_seconds between 60 and 86400),
 last_started_at timestamptz,last_completed_at timestamptz,last_status text,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 constraint cr_sports_sync_jobs_unique unique(sport,feed,endpoint),
 constraint cr_sports_sync_jobs_sport check(sport in('nfl','nba','mlb','nhl','cfb','cbb','wcb','wnba','soccer','golf','nascar','mma','f1')),
 constraint cr_sports_sync_jobs_feed check(feed in('scores','stats','odds','fantasy','projections','pbp','news')),
 constraint cr_sports_sync_jobs_endpoint check(endpoint ~ '^[A-Za-z][A-Za-z0-9]{0,79}(/[A-Za-z0-9._-]{1,64}){0,3}$')
);
create table if not exists public.cr_sports_sync_runs (
 id uuid primary key default gen_random_uuid(),job_id uuid references public.cr_sports_sync_jobs(id) on delete set null,
 status text not null check(status in('queued','running','success','blocked','error')),
 data_mode text not null check(data_mode in('FREE_TRIAL_BLOCKED','PRODUCTION','NOT_CONFIGURED')),
 records_received integer not null default 0 check(records_received>=0),error_code text,error_message text,
 details jsonb not null default '{}'::jsonb,triggered_by uuid references auth.users(id) on delete set null,
 started_at timestamptz not null default now(),finished_at timestamptz
);
create table if not exists public.cr_sports_provider_snapshots (
 id uuid primary key default gen_random_uuid(),sport text not null,feed text not null,endpoint text not null,
 payload jsonb not null,data_mode text not null check(data_mode='PRODUCTION'),
 retrieved_at timestamptz not null default now(),source_hash text not null,
 constraint cr_sports_provider_snapshots_unique unique(sport,feed,endpoint)
);
alter table public.cr_sports_sync_jobs enable row level security;
alter table public.cr_sports_sync_runs enable row level security;
alter table public.cr_sports_provider_snapshots enable row level security;
drop policy if exists cr_sports_sync_jobs_admin_all on public.cr_sports_sync_jobs;
create policy cr_sports_sync_jobs_admin_all on public.cr_sports_sync_jobs for all to authenticated using((select private.cr_universal_admin_check())) with check((select private.cr_universal_admin_check()));
drop policy if exists cr_sports_sync_runs_admin_all on public.cr_sports_sync_runs;
create policy cr_sports_sync_runs_admin_all on public.cr_sports_sync_runs for all to authenticated using((select private.cr_universal_admin_check())) with check((select private.cr_universal_admin_check()));
drop policy if exists cr_sports_provider_snapshots_admin_all on public.cr_sports_provider_snapshots;
create policy cr_sports_provider_snapshots_admin_all on public.cr_sports_provider_snapshots for all to authenticated using((select private.cr_universal_admin_check())) with check((select private.cr_universal_admin_check()));
revoke all privileges on table public.cr_sports_sync_jobs,public.cr_sports_sync_runs,public.cr_sports_provider_snapshots from anon,authenticated;
grant select,insert,update,delete on table public.cr_sports_sync_jobs,public.cr_sports_sync_runs,public.cr_sports_provider_snapshots to authenticated;
comment on table public.cr_sports_sync_jobs is 'Admin-only provider endpoint registry; disabled until production licensing and endpoint review.';
comment on table public.cr_sports_sync_runs is 'Admin-only audit trail for scheduled and manual provider synchronization.';
comment on table public.cr_sports_provider_snapshots is 'Private production provider payload cache; never exposed directly to public pages.';
