# CrowRules Sports V14 — Scheduler readiness

## What V14 adds
- Per-job schedule eligibility, next-run timestamp, attempt timestamp, consecutive failure count, and last-error timestamp.
- Due-job filtering in the existing protected sync worker.
- Exponential retry backoff (5 minutes initially, capped at 24 hours) and reset-on-success.
- A responsive admin panel to opt jobs into future scheduling and safely test due jobs.

## Important operational boundary
The schedule flag and next-run timestamp are configuration only. V14 does **not** install or activate a recurring Cron job. A trusted server-side trigger and its secret must be configured and verified separately before automatic execution can be claimed. No browser timer is used.

## Safe rollout
1. Apply migration `20261114050000_sports_sync_scheduler_v14.sql`.
2. Deploy the updated `sportsdata-sync` function with JWT verification still enabled.
3. Open `/admin/`, sign in, and configure jobs in Automatic Sync.
4. Use Schedule & Reliability to mark jobs eligible. Leave them disabled until production licensing, endpoint mappings, and a trusted timer are approved.
5. While the Free Trial is configured, the worker records blocked runs and makes zero provider calls.

## Data safety
- Uses the existing admin RLS policies and signed-in Supabase session.
- Does not alter public scoreboards or publish provider snapshots.
- No service-role key, provider key, or scheduler secret is added to browser code.
