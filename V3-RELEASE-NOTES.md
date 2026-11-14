# CrowRules Sports V3 — Live Sports Experience

V3 introduces a broadcast-inspired live game center across all 20 public entry points, including the legacy sport detail route.

## Experience
- A sitewide Live Sports Desk ribbon with connection and published-event status.
- A redesigned scoreboard module on Home, Scores, and the Pacific Northwest hub.
- Live, Upcoming, and Final filters; sport filters; team/league search; manual refresh.
- Score cards with away/home presentation, venue, scheduled time or published game state, and expandable event details.
- Live styling and animation only when the published event status identifies a game as live or in progress.
- Responsive scoreboards for desktop, tablet, and mobile, with reduced-motion support.

## Data and integrity
- Reads only published rows from the existing `public.cr_sports_events` table using the existing browser-safe Supabase configuration and public SELECT access.
- Refreshes the scoreboard every 60 seconds and supports manual refresh.
- Optional `CROWRULES_SPORTS_FEED_URL` integration remains a configurable endpoint; no provider, key, feed, or license is assumed.
- No synthetic games, scores, clocks, standings, or statistics are generated.
- The V3 experience does not alter Supabase schema, records, authentication, RLS policies, or administrative permissions.

## Provider readiness
The site now has a live-score presentation and refresh layer, but it is not itself a licensed real-time data provider. Official real-time scores require a supported provider endpoint that returns the documented event fields and is configured securely. Browser code must not contain provider secrets.

## Deployment
Merge this pull request into `main` to publish the V3 front-end experience through GitHub Pages. Full live-score coverage begins after the authorized feed is connected.
