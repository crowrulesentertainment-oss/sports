# CrowRules Sports V5 — Personalized Fan Experience

## What changed
- Adds a sitewide V5 My Sports shortcut with the current followed-team count.
- Rebuilds the existing Watchlist page into a personalized dashboard.
- Adds a searchable PNW team directory with Washington, Oregon, British Columbia and Idaho filters.
- Reuses the existing `crs_favs` localStorage key and existing team-follow behavior.
- Adds local-device alert preferences for game start, score changes and final score.
- Links fans to the existing Global Game Center and PNW hub.

## Data and notification honesty
Team follows and alert preferences are stored locally on the current browser/device. They are not yet synchronized across devices or attached to a universal CrowRules member profile. Alert preference toggles are saved preferences only; this release does not deliver browser push notifications, email, SMS, or background alerts. Real event-specific alerts require a deployed authorized data feed and a notification delivery service with opt-in/permission handling.

## Security and preservation
- No Supabase schema, table, record, RLS, authentication, membership, admin, or Edge Function changes.
- No provider credentials or secrets added to client code.
- Existing `crs_favs` watchlist data is reused rather than migrated.
- No changes to other CrowRules divisions.

## Validation notes
- Static source validation should confirm the V5 stylesheet and script are loaded after the existing V4 assets on every public page.
- Browser interaction testing and cross-device sync are not claimed. The production V4 provider feed remains separately dependent on SportsDataIO subscription, Supabase secret configuration, and Edge Function deployment.
