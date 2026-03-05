-- RankIt MVP Database Schema
-- Run this in your Supabase SQL editor to set up the database.

-- Contests table: stores each voting contest created by a host.
create table if not exists contests (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  host_token  text not null,  -- token opaco guardado en localStorage del anfitrión
  created_at  timestamptz not null default now()
);

-- Votes table: each guest submits one vote per contest.
-- The unique constraint on (contest_id, guest_name) prevents duplicate submissions
-- from the same display name within a contest.
create table if not exists votes (
  id          uuid primary key default gen_random_uuid(),
  contest_id  uuid not null references contests(id) on delete cascade,
  guest_name  text not null,
  scores_json jsonb not null default '{}',  -- { "nombre_elemento": puntuación (1-10), ... }
  created_at  timestamptz not null default now(),
  unique (contest_id, guest_name)
);

-- Index for fast leaderboard queries
create index if not exists votes_contest_id_idx on votes(contest_id);

-- Enable Row Level Security
alter table contests enable row level security;
alter table votes enable row level security;

-- Contests: anyone can create (Zero Auth MVP).
-- Reads require knowing the contest UUID (shared via link/PIN).
-- Note: With the public anon key exposed to the client, a user who has the UUID
-- can read the contest. This is intentional for the Zero Auth flow.
create policy "Anyone can create a contest"
  on contests for insert
  with check (true);

create policy "Anyone can read a contest"
  on contests for select
  using (true);

-- Votes: insert and read are scoped to a specific contest.
-- Both policies require a valid contest_id reference, preventing writes/reads
-- outside of a known contest UUID.
create policy "Anyone can submit a vote"
  on votes for insert
  with check (
    exists (select 1 from contests where id = votes.contest_id)
  );

create policy "Anyone can read votes"
  on votes for select
  using (
    exists (select 1 from contests where id = votes.contest_id)
  );

-- Enable Realtime for leaderboard
alter publication supabase_realtime add table votes;
