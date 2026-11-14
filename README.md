# CrowRules Sports

Every sport. Every level. Every fan. A CrowRules Entertainment division built in Tacoma, Washington.

Public GitHub Pages URL: https://crowrulesentertainment-oss.github.io/sports/

## Current website
Responsive cinematic black, crimson, white and gold sports network with a raven-inspired identity and real-world sports photography.

Pages include Home, Scores, Schedule, Standings, Rankings, Pick'em, Leaderboard, Live Fan Zone, Shows, Combat Sports, College Sports, High School Sports, Minor League Sports and Pacific Northwest Sports.

Coverage includes professional sports, minor leagues, NCAA/NAIA/NJCAA, high school, youth and amateur, international sports, professional wrestling, amateur/Olympic wrestling, UFC/MMA and boxing.

## Data status
Fixtures and standings shown in the first build are illustrative previews, not live results or verified schedules. No live sports data provider has been connected yet.

Pick'em selections and chat messages currently use browser local storage for a single-browser prototype. They are not shared between users and do not constitute a production competition or real-time chat service.

## Supabase preservation
The existing Supabase database and its 13 sports tables are intentionally preserved. This rebuild does not run migrations, delete tables, modify RLS policies or write to the database. Before connecting the site, inspect the exact existing schema and current security policies. Never expose a service-role key or private credential in GitHub Pages JavaScript.

Production chat requires authenticated users, reviewed chat tables, scoped RLS, moderation/reporting workflows and Supabase Realtime subscriptions. Production Pick'em requires verified event data, deadline/lock logic, scoring validation and abuse prevention.

## Stack
Static HTML, CSS and vanilla JavaScript. No build step required. GitHub Pages serves the repository root.
