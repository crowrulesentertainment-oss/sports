-- CrowRules Sports V16: provider identity and controlled score ingestion.
-- Includes the additive V14 scheduler columns because the V14 migration file
-- was merged but is not yet present in this project's migration history.
alter table public.cr_sports_sync_jobs
  add column if not exists schedule_enabled boolean not null default false,
  add column if not exists next_run_at timestamptz,
  add column if not exists consecutive_failures integer not null default 0 check (consecutive_failures between 0 and 100),
  add column if not exists last_error_at timestamptz,
  add column if not exists last_attempt_at timestamptz;
create index if not exists cr_sports_sync_jobs_due_idx
  on public.cr_sports_sync_jobs (next_run_at)
  where is_enabled = true and schedule_enabled = true;

alter table public.cr_sports_events
  add column if not exists source_provider text,
  add column if not exists provider_event_id text,
  add column if not exists provider_updated_at timestamptz,
  add column if not exists last_synced_at timestamptz;

create unique index if not exists cr_sports_events_provider_identity_uidx
  on public.cr_sports_events (source_provider, sport, provider_event_id)
  where source_provider is not null and provider_event_id is not null;

alter table public.cr_sports_sync_runs
  add column if not exists records_normalized integer not null default 0,
  add column if not exists records_rejected integer not null default 0;

comment on column public.cr_sports_events.source_provider is
  'Provider identifier for imported events; null for manually managed legacy records.';
comment on column public.cr_sports_events.provider_event_id is
  'Stable provider event identifier used for idempotent synchronization.';
comment on column public.cr_sports_events.last_synced_at is
  'Last successful provider synchronization timestamp; does not imply public verification.';
comment on index public.cr_sports_events_provider_identity_uidx is
  'Prevents duplicate imported provider events while leaving legacy manual events unaffected.';
