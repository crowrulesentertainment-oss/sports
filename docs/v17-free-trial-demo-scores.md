# CrowRules Sports V17 — Free Trial Demo Score Ingestion

V17 allows CrowRules to use scores returned by the SportsDataIO Free Trial without representing them as accurate live results. Trial scores may be scrambled. This is a demonstration/testing mode, not a licensed production feed.

## Server configuration
Configure these Edge Function secrets on the server only:
- `SPORTSDATAIO_API_KEY`: the user's SportsDataIO Free Trial key.
- `SPORTSDATAIO_DATA_MODE=trial`: explicitly enables trial demonstration ingestion.

Use `SPORTSDATAIO_DATA_MODE=production` only after a commercial production entitlement and key are in place. Never place either key in GitHub Pages, browser JavaScript, or public repository files.

## Behavior
- The normalizer maps provider data without inventing scores, dates, teams, or game states.
- Trial event notes are prefixed with `FREE TRIAL DEMO`.
- Trial imports are published so the site can display available demonstration scores.
- Trial records are tagged in sync history as `FREE_TRIAL_DEMO`.
- Production-mode imports remain unpublished for admin review.
- No RLS policies are relaxed and no provider secret is exposed to the browser.

## Limits
V17 does not add a timer. Admin-triggered sync works first; unattended scheduled pulls still require the secure Cron worker milestone. Only configured and enabled SportsDataIO scores endpoints can return data. Coverage depends on Free Trial endpoint access and daily call limits.

## Rollout
1. Review and merge this PR.
2. Apply the V16 migration if it has not already been applied.
3. Deploy the updated `sportsdata-sync` Edge Function with JWT verification enabled.
4. Add the Free Trial key as the server-side `SPORTSDATAIO_API_KEY` secret and set `SPORTSDATAIO_DATA_MODE=trial`.
5. Configure documented scores endpoints for each sport and run a manual sync.
6. Confirm the public scoreboard labels imported events as Free Trial demo data.
7. Add secure unattended scheduling in a later milestone.
