-- Migration 002: Add participants (items) to contests and item_name to votes
-- Run this in your Supabase SQL editor after schema.sql.

-- 1. Add items column to contests (array of participant names, e.g. ["Tortilla Juan", "Tortilla María"])
alter table contests
  add column if not exists items text[] not null default '{}';

-- 2. Add item_name column to votes (which participant this vote is for).
--    Nullable so existing rows are unaffected; the API enforces non-empty on new writes.
alter table votes
  add column if not exists item_name text;

-- 3. Drop the old unique constraint (contest_id, guest_name) — one vote per guest per contest
--    (PostgreSQL auto-generates the constraint name as <table>_<col1>_<col2>_key)
alter table votes
  drop constraint if exists votes_contest_id_guest_name_key;

-- 4. Create new unique constraint: a guest can vote for each item only once,
--    but can vote for multiple different items in the same contest.
alter table votes
  add constraint votes_contest_id_guest_name_item_name_key
  unique (contest_id, guest_name, item_name);
