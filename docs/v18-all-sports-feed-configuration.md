# CrowRules Sports V18 — All-Sports Feed Configuration

V18 adds a safe configuration and validation workflow for the 13 sport families already supported by the sync normalizer:

- NFL (`nfl`)
- NBA (`nba`)
- MLB (`mlb`)
- NHL (`nhl`)
- College Football (`cfb`)
- College Basketball (`cbb`)
- College Women's Basketball (`wcb`)
- WNBA (`wnba`)
- Soccer (`soccer`)
- Golf (`golf`)
- NASCAR (`nascar`)
- MMA (`mma`)
- Formula 1 (`f1`)

## Endpoint configuration

The Sports Admin Automatic Sync workspace now includes a 13-sport directory. Select a sport, choose a feed, enter the exact endpoint path and supported query parameters, and select **Test Endpoint**.

The test is performed by the authenticated `sportsdata-sync` Edge Function. The API key remains in Supabase Edge Function secrets. The test:
- makes one request to the exact sport/feed/endpoint combination;
- returns provider success/failure, record count, and field names from one sample record;
- reports how many score rows the current normalizer can accept;
- does not persist the provider payload, create events, or publish scores.

A sync job cannot be enabled in the admin form until that exact sport, feed, endpoint, and parameter combination has passed validation. If any of those values change, test again.

The interface deliberately does not guess one universal endpoint for every sport. SportsDataIO endpoint names and available feeds can vary by sport and Free Trial entitlement. Use the endpoint documented for the selected SportsDataIO API.

## Score import controls

- **Import enabled score feeds** invokes only enabled jobs with `feed=scores`.
- **Run all enabled jobs** invokes every enabled feed job.
- In Free Trial mode, successfully normalized score events are published with an explicit `FREE TRIAL DEMO` label and explanatory notes. The provider may scramble scores and statistics.
- Other feeds are saved only to the existing private provider snapshot table; V18 does not publish raw stats, odds, projections, play-by-play, or news.
- The existing 60-second public scoreboard refresh remains separate from provider import cadence.

## Server configuration

In Supabase Project Settings → Edge Functions → Secrets, configure:

- `SPORTSDATAIO_API_KEY`: the SportsDataIO Free Trial key.
- `SPORTSDATAIO_DATA_MODE`: `trial`.

Never put either value in browser JavaScript, GitHub Pages, repository files, or chat messages.

If the secrets are not configured, endpoint validation returns a clear configuration error and does not contact SportsDataIO.

## Security and data handling

- No schema migration is required.
- Existing Supabase authentication and RLS policies remain in place.
- The Edge Function requires a valid signed-in user and successful admin access to the existing sync-job table.
- The provider key is used only by the Edge Function.
- Endpoint test responses contain field names and counts, not provider score values or raw payloads.
- Test calls are not written to sync history or provider snapshots.
- No public or anonymous table grants are added.

## Important operational boundary

V18 validates endpoints and adds manual import controls. It does not install an unattended Cron worker. Refresh intervals remain configuration preferences until the secure scheduler milestone is deployed and configured. Free Trial availability and call limits are controlled by SportsDataIO.
