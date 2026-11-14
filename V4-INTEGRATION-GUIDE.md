# CrowRules Sports V4 — SportsDataIO Global Integration

## Architecture
- Static GitHub Pages client calls a read-only Supabase Edge Function.
- Edge Function proxies only allowlisted SportsDataIO Global API GET resources.
- Provider credential is read only from the Edge Function secret `SPORTSDATAIO_GLOBAL_API_KEY`; it is never included in HTML, JavaScript, or GitHub.
- Existing Supabase project, auth, Sports tables, RLS, admin workflows, and membership architecture remain unchanged. V4 does not write provider data into the existing manually managed `cr_sports_events` table.
- Existing V3 scoreboard remains available as the manual CrowRules-published event fallback.

## Coverage model
SportsDataIO Global API is the selected provider because the priority is broad sports coverage. Its current documentation lists schedules for 75+ sports and score feeds currently for Soccer, Basketball, Baseball, American Football, Ice Hockey, and Tennis. It is a breadth-first API; it does not provide the same detailed play-by-play and advanced stats as selected League APIs. Coverage is determined by the user's subscription and competition entitlements.

## Provider endpoint
The function is `sportsdata-global`. Supported requests:
- `?resource=sports`
- `?resource=competitions&sport={slug}`
- `?resource=schedule&sport={slug}&competition={slug}&date=YYYY-MM-DD`
- `?resource=live&sport={slug}&competition={slug}&date=YYYY-MM-DD`
- `?resource=final&sport={slug}&competition={slug}&date=YYYY-MM-DD`

The function allows GET/OPTIONS only, validates all path parameters, applies an origin allowlist, per-instance IP throttling, and short response caching. It has no database write privileges and does not use a service-role key. For production hardening, add a global gateway/WAF rate limit because in-memory throttling is isolate-local.

## Enablement required
1. Obtain SportsDataIO Global API access that includes the sports and competitions CrowRules plans to display. A free trial is scrambled data and must not be displayed to visitors. A commercial Global API agreement is required for real production data.
2. In Supabase Dashboard > Edge Functions > Secrets, add `SPORTSDATAIO_GLOBAL_API_KEY` with the provider key. Do not paste it into chat or commit it to GitHub.
3. Deploy the function from the repository root with the Supabase CLI, targeting project `cevylpnoexugwgygvtgu`:
   `supabase functions deploy sportsdata-global --no-verify-jwt --project-ref cevylpnoexugwgygvtgu`
4. Confirm the GitHub Pages origin is in the function allowlist. The current production origin is `https://crowrulesentertainment-oss.github.io`.
5. Verify sports catalog, competitions, schedule, live scores (for a covered sport), final scores, 429 throttling, invalid slugs, and missing/invalid provider credentials.

## Provider limitations
- Schedules are documented for 75+ sports.
- Current Global API score endpoints are documented for Soccer, Basketball, Baseball, American Football, Ice Hockey, and Tennis; other sports may return schedules only.
- The Global API is not a universal play-by-play/advanced-stat product. If deeper stats are later needed for a league, add a separately entitled League API adapter behind the same server-side gateway.
- This build does not activate a paid SportsDataIO contract or create an API key.
