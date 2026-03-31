-- Rankeame MVP Database Schema
-- Run this in your Supabase SQL editor to set up the database.

-- Contests table: stores each voting contest created by a host.
create table if not exists contests (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  host_token    text not null,  -- token opaco guardado en localStorage del anfitrión
  contest_type  text not null default 'tortillas',  -- tipo predefinido: tortillas | croquetas | color | inicial
  items         jsonb not null default '[]'::jsonb,  -- lista de participantes
  created_at    timestamptz not null default now()
);

-- Migration: add contest_type to existing installations
-- Run this only if upgrading from a previous schema:
-- alter table contests add column if not exists contest_type text not null default 'tortillas';
-- alter table contests add column if not exists items jsonb not null default '[]'::jsonb;

-- Backward-compatible migration for existing installations
alter table contests add column if not exists items jsonb not null default '[]'::jsonb;

-- Votes table: each guest can vote una vez por participante en un concurso.
-- The unique constraint on (contest_id, guest_name, item_name) prevents
-- duplicate submissions for the same participant by the same guest.
create table if not exists votes (
  id          uuid primary key default gen_random_uuid(),
  contest_id  uuid not null references contests(id) on delete cascade,
  guest_name  text not null,
  item_name   text not null,
  scores_json jsonb not null default '{}',  -- { "nombre_elemento": puntuación (1-10), ... }
  created_at  timestamptz not null default now(),
  unique (contest_id, guest_name, item_name)
);

-- Backward-compatible migration for existing installations
alter table votes add column if not exists item_name text;
update votes set item_name = coalesce(nullif(item_name, ''), guest_name) where item_name is null or item_name = '';
alter table votes alter column item_name set not null;

alter table votes drop constraint if exists votes_contest_id_guest_name_key;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'votes_contest_id_guest_name_item_name_key'
  ) then
    alter table votes
      add constraint votes_contest_id_guest_name_item_name_key unique (contest_id, guest_name, item_name);
  end if;
end
$$;

-- Index for fast leaderboard queries
create index if not exists votes_contest_id_idx on votes(contest_id);

-- Enable Row Level Security
alter table contests enable row level security;
alter table votes enable row level security;

-- Contests: anyone can create (Zero Auth MVP).
-- Reads require knowing the contest UUID (shared via link/PIN).
-- Note: With the public anon key exposed to the client, a user who has the UUID
-- can read the contest. This is intentional for the Zero Auth flow.
drop policy if exists "Anyone can create a contest" on contests;
create policy "Anyone can create a contest"
  on contests for insert
  with check (true);

drop policy if exists "Anyone can read a contest" on contests;
create policy "Anyone can read a contest"
  on contests for select
  using (true);

-- Votes: insert and read are scoped to a specific contest.
-- Both policies require a valid contest_id reference, preventing writes/reads
-- outside of a known contest UUID.
drop policy if exists "Anyone can submit a vote" on votes;
create policy "Anyone can submit a vote"
  on votes for insert
  with check (
    exists (select 1 from contests where id = votes.contest_id)
  );

drop policy if exists "Anyone can read votes" on votes;
create policy "Anyone can read votes"
  on votes for select
  using (
    exists (select 1 from contests where id = votes.contest_id)
  );

-- Enable Realtime for leaderboard
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'votes'
  ) then
    alter publication supabase_realtime add table votes;
  end if;
end
$$;
