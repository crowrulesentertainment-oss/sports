-- CrowRules Sports Fan Zone: dedicated channel chat foundation
-- Safe additive migration. Does not alter or drop existing CrowRules/Supabase tables.
-- Apply only after reviewing this migration in the Supabase SQL editor.

create table if not exists public.cr_sports_chat_channels (
  id text primary key,
  category text not null,
  name text not null,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.cr_sports_chat_messages (
  id uuid primary key default gen_random_uuid(),
  channel_id text not null references public.cr_sports_chat_channels(id),
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null,
  body text not null,
  status text not null default 'pending' check (status in ('pending','visible','hidden')),
  created_at timestamptz not null default now(),
  moderated_by uuid references auth.users(id),
  moderated_at timestamptz,
  moderation_note text,
  constraint cr_sports_chat_display_name_length check (char_length(btrim(display_name)) between 1 and 40),
  constraint cr_sports_chat_body_length check (char_length(btrim(body)) between 1 and 1000)
);

create table if not exists public.cr_sports_chat_reports (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.cr_sports_chat_messages(id) on delete cascade,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reason text not null,
  status text not null default 'open' check (status in ('open','reviewing','resolved','dismissed')),
  created_at timestamptz not null default now(),
  resolved_by uuid references auth.users(id),
  resolved_at timestamptz,
  constraint cr_sports_chat_report_reason_length check (char_length(btrim(reason)) between 3 and 500)
);

insert into public.cr_sports_chat_channels (id, category, name, description, sort_order)
values
 ('general-sports','General','General Sports','All-sports conversation',10),
 ('live-football','Live Game Rooms','Football Live','Game-day football discussion',20),
 ('live-basketball','Live Game Rooms','Basketball Live','Game-day basketball discussion',30),
 ('live-baseball','Live Game Rooms','Baseball Live','Game-day baseball discussion',40),
 ('nfl','Professional','NFL','Professional football',50),
 ('nba','Professional','NBA','Professional basketball',60),
 ('mlb','Professional','MLB','Professional baseball',70),
 ('nhl','Professional','NHL','Professional hockey',80),
 ('minor-league-talk','Minor League','Minor League','Minor league and developmental sports',90),
 ('prospects','Minor League','Prospects','Prospects and player development',100),
 ('college-football','College','College Football','NCAA, NAIA and NJCAA football',110),
 ('college-basketball','College','College Basketball','College basketball discussion',120),
 ('college-wrestling','College','College Wrestling','Collegiate wrestling',130),
 ('high-school-talk','High School','High School Sports','School sports discussion; protect student privacy',140),
 ('friday-night-lights','High School','Friday Night Lights','High school football discussion',150),
 ('wrestling','Combat Sports','Pro Wrestling','Professional wrestling promotions and events',160),
 ('ufc-mma','Combat Sports','UFC & MMA','Mixed martial arts',170),
 ('boxing','Combat Sports','Boxing','Professional and amateur boxing',180),
 ('international-sports','International','International','Sports around the world',190),
 ('weekly-pickem','Pick’em','Weekly Pick’em','Predictions and friendly competition; no wagering',200),
 ('sports-desk','Shows','Sports Desk','CrowRules Sports original shows',210),
 ('weekly-lineup','Shows','The Weekly Lineup','Weekly sports roundtable',220),
 ('tacoma-sports','PNW','Tacoma Sports','Tacoma and Pierce County sports',230),
 ('seattle-sports','PNW','Seattle Sports','Seattle and Puget Sound sports',240),
 ('fan-lounge','Fan Community','Fan Lounge','Meet other sports fans',250),
 ('fan-polls','Fan Community','Fan Polls','Community polls and debate',260)
on conflict (id) do update set
 category=excluded.category,
 name=excluded.name,
 description=excluded.description,
 sort_order=excluded.sort_order;

alter table public.cr_sports_chat_channels enable row level security;
alter table public.cr_sports_chat_messages enable row level security;
alter table public.cr_sports_chat_reports enable row level security;

drop policy if exists cr_sports_chat_channels_public_read on public.cr_sports_chat_channels;
create policy cr_sports_chat_channels_public_read
on public.cr_sports_chat_channels for select to anon, authenticated
using (is_active = true);

drop policy if exists cr_sports_chat_channels_admin_manage on public.cr_sports_chat_channels;
create policy cr_sports_chat_channels_admin_manage
on public.cr_sports_chat_channels for all to authenticated
using ((select private.cr_universal_admin_check()))
with check ((select private.cr_universal_admin_check()));

drop policy if exists cr_sports_chat_messages_public_read_visible on public.cr_sports_chat_messages;
create policy cr_sports_chat_messages_public_read_visible
on public.cr_sports_chat_messages for select to anon, authenticated
using (status = 'visible');

drop policy if exists cr_sports_chat_messages_own_read on public.cr_sports_chat_messages;
create policy cr_sports_chat_messages_own_read
on public.cr_sports_chat_messages for select to authenticated
using (user_id = (select auth.uid()));

drop policy if exists cr_sports_chat_messages_insert_pending on public.cr_sports_chat_messages;
create policy cr_sports_chat_messages_insert_pending
on public.cr_sports_chat_messages for insert to authenticated
with check (
  user_id = (select auth.uid())
  and status = 'pending'
  and exists (
    select 1 from public.cr_sports_chat_channels c
    where c.id = channel_id and c.is_active = true
  )
);

drop policy if exists cr_sports_chat_messages_admin_manage on public.cr_sports_chat_messages;
create policy cr_sports_chat_messages_admin_manage
on public.cr_sports_chat_messages for all to authenticated
using ((select private.cr_universal_admin_check()))
with check ((select private.cr_universal_admin_check()));

drop policy if exists cr_sports_chat_reports_own_read on public.cr_sports_chat_reports;
create policy cr_sports_chat_reports_own_read
on public.cr_sports_chat_reports for select to authenticated
using (reporter_id = (select auth.uid()));

drop policy if exists cr_sports_chat_reports_insert_own on public.cr_sports_chat_reports;
create policy cr_sports_chat_reports_insert_own
on public.cr_sports_chat_reports for insert to authenticated
with check (
  reporter_id = (select auth.uid())
  and exists (
    select 1 from public.cr_sports_chat_messages m
    where m.id = message_id and m.status = 'visible'
  )
);

drop policy if exists cr_sports_chat_reports_admin_manage on public.cr_sports_chat_reports;
create policy cr_sports_chat_reports_admin_manage
on public.cr_sports_chat_reports for all to authenticated
using ((select private.cr_universal_admin_check()))
with check ((select private.cr_universal_admin_check()));

grant select on public.cr_sports_chat_channels to anon, authenticated;
grant select, insert on public.cr_sports_chat_messages to authenticated;
grant select on public.cr_sports_chat_messages to anon;
grant select, insert on public.cr_sports_chat_reports to authenticated;

-- Add messages to Supabase Realtime only when the publication exists and table is not already included.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1 from pg_publication_tables
       where pubname = 'supabase_realtime'
         and schemaname = 'public'
         and tablename = 'cr_sports_chat_messages'
     ) then
    alter publication supabase_realtime add table public.cr_sports_chat_messages;
  end if;
end $$;
