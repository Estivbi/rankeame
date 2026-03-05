-- RankIt MVP Database Schema
-- Run this in your Supabase SQL editor to set up the database.

-- Contests table: stores each voting contest created by a host.
create table if not exists contests (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  host_token  text not null,  -- opaque token stored in host's localStorage
  created_at  timestamptz not null default now()
);

-- Votes table: each guest submits one vote per contest.
create table if not exists votes (
  id          uuid primary key default gen_random_uuid(),
  contest_id  uuid not null references contests(id) on delete cascade,
  guest_name  text not null,
  scores_json jsonb not null default '{}',  -- { "item_name": score (1-10), ... }
  created_at  timestamptz not null default now()
);

-- Index for fast leaderboard queries
create index if not exists votes_contest_id_idx on votes(contest_id);

-- Enable Row Level Security
alter table contests enable row level security;
alter table votes enable row level security;

-- Contests: anyone can create and read (Zero Auth MVP)
create policy "Anyone can create a contest"
  on contests for insert
  with check (true);

create policy "Anyone can read a contest"
  on contests for select
  using (true);

-- Votes: anyone can insert and read votes for a contest
create policy "Anyone can submit a vote"
  on votes for insert
  with check (true);

create policy "Anyone can read votes"
  on votes for select
  using (true);

-- Enable Realtime for leaderboard
alter publication supabase_realtime add table votes;
