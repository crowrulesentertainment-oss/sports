-- CrowRules Sports V8: independent teams, leagues, and seasonal participation.
-- Additive only: legacy event text fields and all existing records remain untouched.

create table if not exists public.cr_sports_teams (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) > 0),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  sport text not null check (length(btrim(sport)) > 0),
  level text not null default 'other' check (level in ('professional','college','high_school','amateur','youth','international','adaptive','other')),
  abbreviation text not null default '', nickname text not null default '',
  city text not null default '', region text not null default '', country text not null default 'United States',
  logo_url text, website_url text, description text not null default '',
  primary_color text, secondary_color text, external_provider text, external_id text,
  is_active boolean not null default true, is_published boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint cr_sports_teams_external_ref_unique unique (external_provider, external_id)
);
create table if not exists public.cr_sports_leagues (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) > 0),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  sport text not null check (length(btrim(sport)) > 0),
  level text not null default 'other' check (level in ('professional','college','high_school','amateur','youth','international','adaptive','other')),
  region text not null default '', country text not null default 'United States', season_label text not null default '',
  logo_url text, website_url text, description text not null default '',
  external_provider text, external_id text, is_active boolean not null default true, is_published boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint cr_sports_leagues_external_ref_unique unique (external_provider, external_id)
);
create table if not exists public.cr_sports_league_teams (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references public.cr_sports_leagues(id) on delete cascade,
  team_id uuid not null references public.cr_sports_teams(id) on delete cascade,
  season_label text not null default '', division text not null default '', conference text not null default '',
  joined_on date, left_on date, is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint cr_sports_league_teams_season_unique unique (league_id, team_id, season_label),
  constraint cr_sports_league_teams_dates_check check (left_on is null or joined_on is null or left_on >= joined_on)
);
alter table public.cr_sports_events add column if not exists home_team_id uuid, add column if not exists away_team_id uuid, add column if not exists league_id uuid;
do $$
begin
 if not exists(select 1 from pg_constraint where conname='cr_sports_events_home_team_id_fkey') then
  alter table public.cr_sports_events add constraint cr_sports_events_home_team_id_fkey foreign key(home_team_id) references public.cr_sports_teams(id) on delete set null;
 end if;
 if not exists(select 1 from pg_constraint where conname='cr_sports_events_away_team_id_fkey') then
  alter table public.cr_sports_events add constraint cr_sports_events_away_team_id_fkey foreign key(away_team_id) references public.cr_sports_teams(id) on delete set null;
 end if;
 if not exists(select 1 from pg_constraint where conname='cr_sports_events_league_id_fkey') then
  alter table public.cr_sports_events add constraint cr_sports_events_league_id_fkey foreign key(league_id) references public.cr_sports_leagues(id) on delete set null;
 end if;
end $$;
create index if not exists cr_sports_teams_sport_level_idx on public.cr_sports_teams(sport,level);
create index if not exists cr_sports_teams_region_idx on public.cr_sports_teams(region,country);
create index if not exists cr_sports_teams_public_idx on public.cr_sports_teams(is_published,is_active,sport);
create index if not exists cr_sports_leagues_sport_level_idx on public.cr_sports_leagues(sport,level);
create index if not exists cr_sports_leagues_region_idx on public.cr_sports_leagues(region,country);
create index if not exists cr_sports_leagues_public_idx on public.cr_sports_leagues(is_published,is_active,sport);
create index if not exists cr_sports_league_teams_team_idx on public.cr_sports_league_teams(team_id,is_active);
create index if not exists cr_sports_league_teams_league_idx on public.cr_sports_league_teams(league_id,is_active);
create index if not exists cr_sports_events_home_team_id_idx on public.cr_sports_events(home_team_id);
create index if not exists cr_sports_events_away_team_id_idx on public.cr_sports_events(away_team_id);
create index if not exists cr_sports_events_league_id_idx on public.cr_sports_events(league_id);
alter table public.cr_sports_teams enable row level security;
alter table public.cr_sports_leagues enable row level security;
alter table public.cr_sports_league_teams enable row level security;
drop policy if exists cr_sports_teams_public_read_published on public.cr_sports_teams;
create policy cr_sports_teams_public_read_published on public.cr_sports_teams for select to anon,authenticated using(is_published=true and is_active=true);
drop policy if exists cr_sports_teams_universal_admin_manage on public.cr_sports_teams;
create policy cr_sports_teams_universal_admin_manage on public.cr_sports_teams for all to authenticated using((select private.cr_universal_admin_check())) with check((select private.cr_universal_admin_check()));
drop policy if exists cr_sports_leagues_public_read_published on public.cr_sports_leagues;
create policy cr_sports_leagues_public_read_published on public.cr_sports_leagues for select to anon,authenticated using(is_published=true and is_active=true);
drop policy if exists cr_sports_leagues_universal_admin_manage on public.cr_sports_leagues;
create policy cr_sports_leagues_universal_admin_manage on public.cr_sports_leagues for all to authenticated using((select private.cr_universal_admin_check())) with check((select private.cr_universal_admin_check()));
drop policy if exists cr_sports_league_teams_public_read_published on public.cr_sports_league_teams;
create policy cr_sports_league_teams_public_read_published on public.cr_sports_league_teams for select to anon,authenticated using(is_active=true and exists(select 1 from public.cr_sports_teams t where t.id=team_id and t.is_active=true and t.is_published=true) and exists(select 1 from public.cr_sports_leagues l where l.id=league_id and l.is_active=true and l.is_published=true));
drop policy if exists cr_sports_league_teams_universal_admin_manage on public.cr_sports_league_teams;
create policy cr_sports_league_teams_universal_admin_manage on public.cr_sports_league_teams for all to authenticated using((select private.cr_universal_admin_check())) with check((select private.cr_universal_admin_check()));
revoke all privileges on table public.cr_sports_teams,public.cr_sports_leagues,public.cr_sports_league_teams from anon,authenticated;
grant select on table public.cr_sports_teams,public.cr_sports_leagues,public.cr_sports_league_teams to anon,authenticated;
grant insert,update,delete on table public.cr_sports_teams,public.cr_sports_leagues,public.cr_sports_league_teams to authenticated;
comment on table public.cr_sports_teams is 'Independent CrowRules Sports team directory; public rows require active and published flags.';
comment on table public.cr_sports_leagues is 'Independent CrowRules Sports league and competition directory; public rows require active and published flags.';
comment on table public.cr_sports_league_teams is 'Season-specific many-to-many team participation in leagues.';
comment on column public.cr_sports_events.home_team_id is 'Optional managed team relation; legacy home_team text is retained.';
comment on column public.cr_sports_events.away_team_id is 'Optional managed team relation; legacy away_team text is retained.';
comment on column public.cr_sports_events.league_id is 'Optional managed league relation; legacy league text is retained.';
insert into public.cr_sports_leagues(name,slug,sport,level,is_active,is_published)
select distinct btrim(e.league),trim(both '-' from regexp_replace(lower(btrim(e.league)),'[^a-z0-9]+','-','g'))||'-'||substr(md5(lower(btrim(e.sport))||'|'||lower(btrim(e.league))),1,6),btrim(e.sport),'other',true,false
from public.cr_sports_events e where btrim(coalesce(e.league,''))<>'' and btrim(coalesce(e.sport,''))<>'' on conflict(slug) do nothing;
insert into public.cr_sports_teams(name,slug,sport,level,is_active,is_published)
select distinct btrim(x.team_name),trim(both '-' from regexp_replace(lower(btrim(x.team_name)),'[^a-z0-9]+','-','g'))||'-'||substr(md5(lower(btrim(e.sport))||'|'||lower(btrim(x.team_name))),1,6),btrim(e.sport),'other',true,false
from public.cr_sports_events e cross join lateral(values(e.home_team),(e.away_team)) as x(team_name)
where btrim(coalesce(x.team_name,''))<>'' and btrim(coalesce(e.sport,''))<>'' on conflict(slug) do nothing;
update public.cr_sports_events e set home_team_id=t.id from public.cr_sports_teams t where e.home_team_id is null and lower(btrim(e.home_team))=lower(t.name) and lower(btrim(e.sport))=lower(t.sport);
update public.cr_sports_events e set away_team_id=t.id from public.cr_sports_teams t where e.away_team_id is null and lower(btrim(e.away_team))=lower(t.name) and lower(btrim(e.sport))=lower(t.sport);
update public.cr_sports_events e set league_id=l.id from public.cr_sports_leagues l where e.league_id is null and lower(btrim(e.league))=lower(l.name) and lower(btrim(e.sport))=lower(l.sport);
insert into public.cr_sports_league_teams(league_id,team_id,season_label)
select distinct e.league_id,t.id,'' from public.cr_sports_events e join public.cr_sports_teams t on t.id=e.home_team_id or t.id=e.away_team_id where e.league_id is not null
on conflict(league_id,team_id,season_label) do nothing;
