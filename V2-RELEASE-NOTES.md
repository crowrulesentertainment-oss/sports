# CrowRules Sports V2 — Sitewide Release Layer

This release introduces a shared V2 experience across every public division page while preserving the existing static HTML/CSS/vanilla-JavaScript architecture.

## Included
- Shared V2 visual system in `css/v2.css`: cinematic dark broadcast palette, raven identity, refined cards, responsive behavior, focus states and reduced-motion support.
- Shared V2 interaction layer in `js/v2.js`: universal search/command palette (Ctrl/⌘ + K), sport/team/page search, mobile quick navigation, active-page state, skip link and scroll progress.
- V2 assets loaded on all public pages, including the retained legacy sport detail route.
- Existing Supabase browser configuration, public-read architecture, shared CrowRules Auth, local Pick’em/team follows, Sports Admin and RLS remain untouched.

## Data integrity
V2 does not fabricate live scores, standings, rankings, athlete statistics, video rights or provider connectivity. Published CrowRules event/story records continue to be the source of truth until a licensed provider is connected through a protected server-side feed.

## Deploy
GitHub Pages serves the repository root. Merge the `v2-sitewide` branch into `main` after review to publish the sitewide layer.
