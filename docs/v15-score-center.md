# CrowRules Sports V15 — Verified Score Center

## Changes
- Removes the V9 League API trial endpoint tester from the Home, Scores, and PNW pages, including its visible V9 branding, endpoint controls, and raw provider-response panel.
- Adds a compact verified-score status strip to those pages.
- Reuses the existing V3 scoreboard query against published `cr_sports_events` and its 60-second refresh cycle. No synthetic scores or trial payloads are shown.
- Leaves SportsDataIO credentials server-side and keeps raw provider snapshots private.

## Important data limitation
The connected SportsDataIO credential is a Free Trial key. SportsDataIO confirms Free Trial score and stat values are scrambled. Accurate current scores require a suitable real-data entitlement. Discovery Lab is next-day delayed for eight sports and is licensed for personal, non-commercial use; it is not an appropriate feed for a public CrowRules company site. Real-time Leagues API coverage for 13 sports requires a commercial agreement. See https://sportsdata.io/developers and https://sportsdata.io/help/scrambled-data.

V15 therefore enables automatic refresh of verified published score records but does not manufacture or publish provider scores. Provider ingestion, sport-specific normalization, and a licensed production key remain prerequisites for real automatic scores across all 13 sports.
