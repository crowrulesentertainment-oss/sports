# CrowRules Sports — Front-End Demo

A cinematic, multi-page sports hub built with HTML, CSS, and vanilla JavaScript.

## Run it

1. Extract the ZIP.
2. Open `index.html` in a modern browser, or serve the folder with any static web server (recommended for consistent local behavior).
3. No build step, package manager, API key, or framework is required.

For example, if Python is installed:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080` from the folder containing `index.html`.

## Pages

- `index.html` — cinematic homepage and demo live board
- `scores.html` — broadcast-style scores and game center with working search, sport filters, and status sorting
- `news.html` — CrowRules Sports Desk editorial concept cards with search and category filters
- `watchlist.html` — personal My Sports dashboard for locally saved favorite divisions
- `sports.html` — all sport categories
- `sport.html?sport=nfl` — sport detail pages driven by query parameter (`nfl`, `nba`, `mlb`, `nhl`, `soccer`, `ncaaf`, `ncaab`, `golf`, `tennis`, `motorsports`, `boxing`, `wwe`, `aew`, `ufc`)
- `pickem.html` — free picks, demo private leagues, and special-event bracket challenge
- `podcasts.html` — CrowRules Podcasting integration-ready show/episode shelf
- `stats.html` — demo leaders and stat cards
- `account.html` — demo sign-in / profile experience
- `about.html` — network mission and integration status

## Architecture

- `css/styles.css` — shared responsive design system, cinematic visual treatment, reusable page layouts
- `js/data.js` — centralized demo data catalog (sports, games, stats, podcasts, editorial concepts, challenges)
- `js/app.js` — shared navigation, rendering, account/local-storage helpers, page bootstrapping
- Each HTML file is a lightweight page shell with a shared header/footer and page-specific mount point.

## Important data status

This package is **demo-first**. Scores, schedules, teams, standings, stat leaders, picks, podcast episodes, and event cards are illustrative sample content and must not be treated as current or official. No live sports API is connected. No real authentication, secure private leagues, cross-device synchronization, payment system, or podcast backend connection is implemented.

### Local persistence

Demo account profile, submitted picks, leagues created in the browser, and favorite divisions in My Sports are stored in `localStorage` on that browser. This is not secure authentication or a real multi-user database. Clearing browser data removes the saved demo state. A league marked “private” is only a local demonstration and is not actually access-controlled.

## v2 additions

- Scores board search across teams, league, status, and period.
- Sort games with live/upcoming/final priorities.
- Sports Desk page with category filters and story search. Story cards clearly identify themselves as editorial concepts rather than published/current news.
- My Sports watchlist to add/remove favorite divisions, saved in localStorage.

## Suggested live integration roadmap

1. **Sports data adapter:** choose licensed providers and map their responses into the shape in `js/data.js`; handle rate limits, caching, attribution, delays, and provider outages.
2. **Backend:** add an API/serverless layer and database for accounts, league membership, picks, scoring rules, audit history, and leaderboard calculations. Never put privileged API keys in client-side JavaScript.
3. **Authentication:** use a real identity provider and server-side authorization for private leagues.
4. **CrowRules Podcasting:** connect the actual published-show/episode feed or Supabase tables, including public-safe read policies. The current page shows sample episodes only.
5. **Live updates:** use polling or provider-supported streaming with “last updated” timestamps and visible stale-data/error states.
6. **Legal/product review:** confirm data licensing, logos, trademarks, contest rules, age restrictions, and any applicable sweepstakes/gambling regulations before launch.

## Customization

Edit `js/data.js` to change demo sports, teams, scores, stats, podcast cards, and challenges. Update colors and typography tokens at the top of `css/styles.css`. Add a page by copying an existing HTML shell and registering a renderer in `js/app.js`.


## v3: League standings

The standings page provides locally filterable illustrative tables for NFL, NBA, MLB, NHL, and soccer. Search, group filters, sort order, and selected league are browser-side interactions. All records are demo examples, not current or official standings; no licensed live standings API is connected.
