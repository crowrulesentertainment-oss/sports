-- CrowRules Sports V14: scheduler readiness and retry metadata.
alter table public.cr_sports_sync_jobs
  add column if not exists schedule_enabled boolean not null default false,
  add column if not exists next_run_at timestamptz,
  add column if not exists consecutive_failures integer not null default 0 check (consecutive_failures between 0 and 100),
  add column if not exists last_error_at timestamptz,
  add column if not exists last_attempt_at timestamptz;
create index if not exists cr_sports_sync_jobs_due_idx on public.cr_sports_sync_jobs (next_run_at) where is_enabled = true and schedule_enabled = true;
comment on column public.cr_sports_sync_jobs.schedule_enabled is 'Opt-in schedule flag. Does not activate a timer by itself; a trusted scheduler trigger is required.';
comment on column public.cr_sports_sync_jobs.next_run_at is 'Next eligible run timestamp, managed by the sync worker.';
comment on column public.cr_sports_sync_jobs.consecutive_failures is 'Consecutive provider sync failures; used for exponential retry backoff.';
