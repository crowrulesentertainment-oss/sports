-- CrowRules Sports V17: explicitly permit isolated Free Trial demo snapshots and audit runs.
alter table public.cr_sports_sync_runs
  drop constraint if exists cr_sports_sync_runs_data_mode_check;
alter table public.cr_sports_sync_runs
  add constraint cr_sports_sync_runs_data_mode_check
  check (data_mode in ('FREE_TRIAL_BLOCKED','FREE_TRIAL_DEMO','PRODUCTION','NOT_CONFIGURED'));

alter table public.cr_sports_provider_snapshots
  drop constraint if exists cr_sports_provider_snapshots_data_mode_check;
alter table public.cr_sports_provider_snapshots
  add constraint cr_sports_provider_snapshots_data_mode_check
  check (data_mode in ('FREE_TRIAL_DEMO','PRODUCTION'));

comment on column public.cr_sports_sync_runs.data_mode is
  'FREE_TRIAL_DEMO denotes scrambled evaluation data and is not a verified real-world result.';
comment on table public.cr_sports_provider_snapshots is
  'Private provider payload cache for trial demo and production modes; never exposed directly to public pages.';
