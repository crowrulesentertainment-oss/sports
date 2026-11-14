# CrowRules Sports V8 — Teams & Leagues Management

## Database migration
Applied to Supabase project `cevylpnoexugwgygvtgu` as migration `sports_teams_leagues_v8`.

Adds:
- `cr_sports_teams`: independent team profiles and publication controls.
- `cr_sports_leagues`: independent league/competition profiles and publication controls.
- `cr_sports_league_teams`: many-to-many team participation by season, division and conference.
- Nullable `home_team_id`, `away_team_id`, and `league_id` foreign keys on `cr_sports_events`.
- Existing Sports Admin event editor now includes managed home team, away team and league selectors; linked names also synchronize into legacy text fields for older integrations.

Existing event team/league text fields and all event/story records are preserved. Existing events are backfilled into directory records and linked where matching source values exist.

## Security
- RLS enabled on all three new tables.
- Public SELECT is limited to active and published teams/leagues; membership visibility requires both linked records to be active and published.
- Authenticated writes are limited by existing `private.cr_universal_admin_check()`.
- Explicit grants: SELECT for anon/authenticated; INSERT/UPDATE/DELETE for authenticated only. No TRUNCATE grant.
- Existing event/story policies are not replaced.
- No service-role key or secret is exposed.

## Admin
- Adds Teams Directory, Leagues Management, and League Memberships workspaces to Sports Admin.
- Supports create, edit, delete, search, publish and archive via active Universal Admin Supabase session.
- Memberships support season, division, conference and participation dates.

## Public directories
- Published team directory with team profile links.
- Published league directory with league profiles and participating teams.
- Search and mobile-responsive presentation.

## Verification
- Migration applied successfully.
- Verified all three new tables have RLS enabled and the intended public/admin policies.
- Initial table counts are zero; no existing Sports events or records were altered.
- Supabase security/performance advisor output also contains pre-existing findings in unrelated CrowRules divisions; V8 does not modify them.
- Browser-level admin CRUD and public directory tests still require deployment and authenticated session testing.
