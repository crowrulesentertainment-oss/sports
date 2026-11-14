# CrowRules Sports V16 — Automatic Score Ingestion Engine

## What changes
- Adds stable SportsDataIO event identity metadata to `cr_sports_events` so repeated syncs update the same imported event rather than create duplicates.
- Extends sync-run audit counts with normalized and rejected record totals.
- Adds a conservative SportsDataIO scores-feed normalizer for the 13 configured sport codes.
- Writes imported score events as `is_published=false`; an authorized admin must review and publish them.
- Updates existing imported records without changing their publication flag. Legacy/manual records are not matched or overwritten.
- Keeps raw provider snapshots private and keeps the existing JWT + admin RLS path.
- Includes the additive V14 scheduler columns because V14's migration was merged but is not yet applied to this project.

## Normalization rules
- Requires a stable provider event ID and both team names; otherwise the record is rejected.
- Maps common SportsDataIO field names and wrapped arrays. Unknown or missing status becomes `unknown`; absent scores and start times remain null.
- Does not invent team identities, scores, dates, or live/final state.
- Unknown statuses are retained as short provider strings; known in-progress/final/scheduled/postponed/cancelled states are normalized.
- Other feeds (stats, odds, fantasy, projections, play-by-play, news) remain private snapshots; V16 only normalizes the scores feed.

## Rollout and limits
1. Review and merge this PR.
2. Apply `20261114060000_sports_score_ingestion_v16.sql`.
3. Deploy the updated `sportsdata-sync` Edge Function with JWT verification enabled.
4. Keep `SPORTSDATAIO_DATA_MODE` out of production until the commercial entitlement and server-side key are confirmed.
5. Configure reviewed endpoint jobs. The normalizer handles known event field aliases, but each configured endpoint should be validated against its actual licensed response shape before production activation.
6. Review imported drafts in the admin workflow and explicitly publish verified records.
7. Configure a trusted server-side scheduler separately. V16 does not activate Cron; the admin panel must continue to show that unattended scheduling is not active until a secure trigger is installed.

## Security and compatibility
- No RLS policies or grants are dropped or broadened.
- No service-role key, provider key, or scheduler secret is added to browser code.
- Existing public scoreboard continues to read only `is_published=true`.
- No database migration or Edge Function deployment is performed by this PR.
- Free Trial remains blocked before any provider HTTP request.
