-- Rankeame: Continuous Rankings Schema
-- Run this in your Supabase SQL editor to set up the Continuous Rankings feature.

-- Rankings table: stores each long-term ranking created by a host.
create table if not exists rankings (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  host_token  text not null,  -- token opaco guardado en localStorage del anfitrión
  created_at  timestamptz not null default now()
);

-- Places table: the items being ranked (restaurants, bars, etc.).
create table if not exists places (
  id          uuid primary key default gen_random_uuid(),
  ranking_id  uuid not null references rankings(id) on delete cascade,
  name        text not null,
  lat         numeric,        -- Latitud para el mapa futuro
  lng         numeric,        -- Longitud para el mapa futuro
  address     text,
  created_at  timestamptz not null default now()
);

-- Reviews table: the votes and comments for each place.
create table if not exists reviews (
  id          uuid primary key default gen_random_uuid(),
  place_id    uuid not null references places(id) on delete cascade,
  guest_name  text not null,
  score       numeric check (score >= 1 and score <= 10),
  comment     text,
  created_at  timestamptz not null default now()
);

-- Indexes for fast queries
create index if not exists places_ranking_id_idx on places(ranking_id);
create index if not exists reviews_place_id_idx on reviews(place_id);

-- Enable Row Level Security
alter table rankings enable row level security;
alter table places enable row level security;
alter table reviews enable row level security;

-- Rankings: anyone can create and read (Zero Auth MVP).
drop policy if exists "Anyone can create a ranking" on rankings;
create policy "Anyone can create a ranking"
  on rankings for insert
  with check (true);

drop policy if exists "Anyone can read a ranking" on rankings;
create policy "Anyone can read a ranking"
  on rankings for select
  using (true);

-- Places: anyone can create and read.
drop policy if exists "Anyone can create a place" on places;
create policy "Anyone can create a place"
  on places for insert
  with check (
    exists (select 1 from rankings where id = places.ranking_id)
  );

drop policy if exists "Anyone can read places" on places;
create policy "Anyone can read places"
  on places for select
  using (
    exists (select 1 from rankings where id = places.ranking_id)
  );

-- Reviews: anyone can create and read.
drop policy if exists "Anyone can create a review" on reviews;
create policy "Anyone can create a review"
  on reviews for insert
  with check (
    exists (select 1 from places where id = reviews.place_id)
  );

drop policy if exists "Anyone can read reviews" on reviews;
create policy "Anyone can read reviews"
  on reviews for select
  using (
    exists (select 1 from places where id = reviews.place_id)
  );
