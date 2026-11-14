# CrowRules Sports V12 — automatic sync foundation

## Safety and current mode
- SportsDataIO Free Trial stays in the existing V9/V10 endpoint lab only.
- Scrambled trial responses are never written into public scores, schedules, standings, team or statistics tables.
- The new `sportsdata-sync` function makes no provider calls unless `SPORTSDATAIO_DATA_MODE=production` and a licensed production `SPORTSDATAIO_API_KEY` are both configured as Supabase Edge Function secrets.
- Production responses are stored in an admin-only private snapshot cache. They are not automatically published.

## Database and deployment
1. After merging, apply `supabase/migrations/20261113050000_sports_sync_framework_v12.sql`.
2. Deploy `supabase/functions/sportsdata-sync/index.ts` as `sportsdata-sync` with JWT verification enabled.
3. The function uses the signed-in user's Supabase session and RLS; no service-role key is sent to the browser.
4. The endpoint registry is disabled by default. Configure reviewed sport/feed/endpoint combinations only after confirming the paid SportsDataIO entitlement.

## Later production activation
1. Confirm the licensed Leagues API sports and feeds.
2. Store the production key as `SPORTSDATAIO_API_KEY` in Supabase Edge Function secrets.
3. Set `SPORTSDATAIO_DATA_MODE=production` only after the license is active.
4. Add approved endpoint jobs to `cr_sports_sync_jobs`; keep disabled until reviewed.
5. Build and test sport-specific normalizers before any data is written to public CrowRules tables.
6. Configure Supabase Cron and Vault after selecting provider-safe refresh intervals and verifying project-plan limits.

## Scope boundary
This PR adds the secure foundation, not a completed public all-sports feed. It does not apply the migration, deploy the function, change existing RLS, alter provider secrets, or modify public score records. The existing Free Trial endpoint lab is untouched.
