# CrowRules Sports V4 Release Notes

V4 adds a SportsDataIO Global API-powered game center to the V3 broadcast experience.

## New capabilities
- Provider-driven sports catalog and competition selector.
- Date-based competition schedules across the Global API's documented schedule coverage.
- Live-and-final score feed and final-only results for sports where the Global API currently documents score endpoints.
- Participant scores, period breakdowns where supplied, venue, round, status and provider update timestamps.
- Automatic 15-second refresh while viewing supported live-score competitions; manual refresh and date selection.
- Global provider status and honest error messages for missing credentials, subscription limitations, unsupported score feeds, and provider outages.
- Sitewide Global Sports Network ribbon across all 20 public entry points.

## Architecture and security
- New read-only Supabase Edge Function source at `supabase/functions/sportsdata-global/index.ts`.
- Provider key is read only from `SPORTSDATAIO_GLOBAL_API_KEY` in Edge Function secrets.
- Browser client contains only the existing public Supabase project URL and publishable key.
- Strict GET/OPTIONS resource allowlist, parameter validation, allowed-origin check, per-instance IP throttling, short caching and upstream timeout.
- No service-role key, provider key, new database table, schema migration, or RLS policy change.
- Existing manually published CrowRules event data remains intact as the V3 fallback.

## Important provider coverage notes
- SportsDataIO currently documents schedules for 75+ sports.
- The Global API currently documents live/final score results for Soccer, Basketball, Baseball, American Football, Ice Hockey, and Tennis; other sports are schedule-first until score coverage is added.
- The Global API is a breadth-first schedules/scores product, not universal detailed play-by-play or advanced statistics. Those deeper feeds require separately entitled League APIs.
- Production use requires an appropriately licensed SportsDataIO Global API subscription. Trial/scrambled data must not be displayed as real sports results.

## Activation
See `V4-INTEGRATION-GUIDE.md` to add the server-side secret and deploy the Edge Function. This pull request contains the implementation source and front-end wiring; it does not activate a paid provider subscription or deploy the Edge Function automatically.
