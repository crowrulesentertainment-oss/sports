# CrowRules Sports

CrowRules Sports is the sports media and fan-engagement division of CrowRules Entertainment, built in Tacoma, Washington. The website is a responsive multi-page HTML/CSS/vanilla-JavaScript experience with a cinematic raven identity and professional sports-broadcast layout.

## Local preview

Serve the repository root with any static server:

```bash
python -m http.server 8080
```

Open `http://localhost:8080`.

## Public pages

- `index.html` — sports headquarters and verified events feed
- `sports.html` — all-sports directory (major, minor and adaptive)
- `minor-sports.html` — minor and emerging sports
- `high-school.html` — high school athletics and youth privacy safeguards
- `college.html` — NCAA, NAIA, NJCAA and community college coverage
- `scores.html` — published event scoreboard, search and status filters
- `standings.html` — standings data landing page
- `rankings.html` — rankings data landing page
- `stats.html` — statistics and athlete leaders landing page
- `pickem.html` — free-to-play, non-monetary predictions
- `videos.html` — authorized video and original-programming hub
- `news.html` — published CrowRules Sports Desk stories
- `teams.html` — team discovery directory
- `calendar.html` — published sports events
- `pnw.html` — Tacoma / Pacific Northwest sports hub
- `account.html` — shared CrowRules Supabase Auth sign-in and registration
- `watchlist.html` — personal team follows
- `podcasts.html` — CrowRules Sports audio / Podcasting connection landing page
- `about.html` — network mission and data promise
- `sport.html?sport=nfl` — retained legacy sport detail page

## Admin

`admin/index.html` is the dedicated Sports Admin workspace. It uses the shared CrowRules Universal Admin authentication helper and the existing `cr_admins` authorization table. It currently manages the existing `cr_sports_events` and `cr_sports_stories` tables. Supabase Row Level Security remains the authority for every database operation.

## Architecture

- `css/platform.css` — new responsive cinematic raven / sports broadcast design system
- `js/platform.js` — shared multi-page rendering, Supabase reads, shared Auth, team follows, Pick'em interactions and page behaviors
- `css/styles.css`, `js/app.js`, `js/data.js` — retained legacy front-end implementation and demo components
- `assets/stadium.svg` — retained legacy visual asset

## Existing Supabase connection

The public pages load the shared CrowRules browser configuration from the main CrowRules Entertainment site. It uses the Supabase project `cevylpnoexugwgygvtgu`, its public publishable key, and the shared browser storage key `sb-cevylpnoexugwgygvtgu-auth-token`. No service-role or secret key is included in public code.

The currently verified sports-specific tables are:

- `public.cr_sports_events` — published events, teams, scores, status, venue and source URL
- `public.cr_sports_stories` — published sports articles and editorial content

The public site reads only published event and story records through a separate anonymous Supabase client. Narrow SELECT policies permit `anon` to read only rows marked `is_published = true` or `status = 'published'`; column-level grants expose only public display fields and exclude event notes and audit timestamps. The existing authenticated Universal Admin policy remains in place for writes. The Sports Admin writes to these existing tables under the current RLS policies. No replacement sports database was created.

## Live sports API status

The website includes an optional secure feed adapter: define `window.CROWRULES_SPORTS_FEED_URL` before `js/platform.js` and have that endpoint return JSON with an `events` array. The feed endpoint must be hosted server-side (for example, a Supabase Edge Function or other protected backend) and must keep provider credentials off the browser.

**A licensed third-party sports provider has not yet been configured.** The repository currently reads CrowRules-published events from Supabase. Scores, standings, rankings and athlete statistics are not fabricated or labeled live when no verified feed exists. Choose a provider, confirm licensing/attribution, and configure the secure server-side endpoint before enabling third-party live data.

## Feature status and integrity

- Supabase public event and story reads: connected to existing tables, subject to existing RLS and Data API grants.
- Shared CrowRules authentication: uses the existing Supabase Auth session storage key.
- Sports Admin: shared Universal Admin authorization; event and story management.
- Team follows and Pick'em selections: browser-local at this stage; not cross-device or server-authoritative.
- Standings, rankings and athlete statistics: require a licensed feed and are intentionally shown as unavailable until connected.
- Videos: use authorized embeds or rights-holder submissions only; no unlicensed game broadcasts.
- High school coverage: student media and personal information require appropriate school/guardian permission and moderation.
- Pick'em: free-to-play predictions only; no wagering, paid entry, odds or cash prizes.

## Future integration work

1. Select and license a sports-data provider covering professional, college, high school and minor sports.
2. Build a protected server-side feed adapter and caching strategy.
3. Extend the existing database with reviewed, RLS-protected team, league, athlete, standings, rankings and Pick'em modules only when the schemas and policies are agreed.
4. Add cross-device member follows, prediction history, leaderboards and CrowPoints rules.
5. Connect the public-safe CrowRules Podcasting and video catalog feeds.
6. Add official source attribution, timestamps, stale-feed warnings and provider outage states.
