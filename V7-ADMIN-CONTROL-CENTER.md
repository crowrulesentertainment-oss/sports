# CrowRules Sports V7 — Admin Control Center

## Added
- Dedicated V7 Sports Admin Control Center entry alongside the existing admin workspaces.
- Operational overview cards for event volume, live events, published stories and review queue.
- Event-feed monitoring based on stored Supabase event rows, with latest stored timestamp and explicit provider-connectivity caveat.
- Publishing/moderation queue for unpublished events and draft stories, with publish actions.
- Searchable team and league/competition directory derived from existing event records.
- Operational analytics for sports, teams, leagues, final events and pending review.
- Responsive control-center panels.

## Security and data preservation
- Reuses the existing `window.CrowRulesAdminAuth.client` authenticated Supabase client.
- All reads and writes remain subject to existing Supabase RLS policies.
- No new tables, columns, policies, roles, credentials, service-role keys or provider secrets.
- Does not change existing CRUD workflows or Universal Admin authentication.
- Does not claim a live SportsDataIO upstream connection; feed health describes stored event data only.
- Team/league directory is derived from existing event rows, not a separate independently editable taxonomy.

## Validation scope
- Static source review only. Live admin login, RLS write authorization, browser layout and provider-feed behavior require testing in the deployed environment.
