# CrowRules Sports V6 — Complete Website & Admin Redesign

## Public experience
- New V6 visual system: premium broadcast-inspired dark interface, bold condensed sports typography, richer editorial spacing, stronger cards, red/gold accents and responsive navigation.
- Reworked hero, content sections, scoreboard cards, sport directory, PNW hub, footer, buttons, filters and member dashboard styling.
- Added global section search via the Search control or Ctrl/⌘+K.
- Preserves all existing public page routes and V2–V5 scripts, provider integration, data sources and account flows.

## Sports Admin
- Redesigned existing admin UI without replacing its login flow, Universal Admin Auth integration, Supabase client, CONFIG datasets, CRUD handlers, or RLS checks.
- Added published-event and published-story KPI counts using read-only count queries through the already authorized admin client.
- Added CSV export for the currently visible table rows and print-current-view.
- Added a workspace quick-find control.
- Preserves the existing two data workspaces (Games & Events and Sports Desk Stories) and existing table schemas.

## Security and preservation
- No schema migrations, table alterations, RLS policy changes, service-role keys, or provider secrets.
- No new authentication system. Admin continues to use the existing Universal Admin Auth and RLS.
- CSV export contains only the rows currently rendered in the table and should be treated as an admin download.
- No live scores, rankings, or push notifications are fabricated.

## Validation status
- Static source and integration changes are included in this branch.
- CI and browser-based responsive/access-control tests have not yet been confirmed.
