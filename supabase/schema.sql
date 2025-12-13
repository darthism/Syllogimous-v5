-- Syllogimous: Supabase schema for cloud persistence
-- Tables:
-- - public.user_kv: localStorage key/value sync (raw strings)
-- - public.rrt_history: RRTHistory persistence (progress graph + auto progression)
-- Storage:
-- - images bucket: background images (per-user folder)

-- 1) KV sync table
create table if not exists public.user_kv (
  user_id uuid not null references auth.users(id) on delete cascade,
  key text not null,
  value_text text,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

alter table public.user_kv enable row level security;

drop policy if exists "user_kv_owner_read" on public.user_kv;
create policy "user_kv_owner_read"
on public.user_kv for select
using (auth.uid() = user_id);

drop policy if exists "user_kv_owner_write" on public.user_kv;
create policy "user_kv_owner_write"
on public.user_kv for insert
with check (auth.uid() = user_id);

drop policy if exists "user_kv_owner_update" on public.user_kv;
create policy "user_kv_owner_update"
on public.user_kv for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "user_kv_owner_delete" on public.user_kv;
create policy "user_kv_owner_delete"
on public.user_kv for delete
using (auth.uid() = user_id);

-- 2) RRT history table
create table if not exists public.rrt_history (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  key text not null,
  timestamp bigint not null,
  time_elapsed_ms bigint not null default 0,
  did_trigger_progress boolean not null default false,
  data jsonb not null,
  created_at timestamptz not null default now()
);

-- Ensure column exists even if table already existed before this migration.
alter table public.rrt_history
  add column if not exists time_elapsed_ms bigint not null default 0;

create index if not exists rrt_history_user_key_ts_desc on public.rrt_history (user_id, key, timestamp desc);
create index if not exists rrt_history_user_ts_asc on public.rrt_history (user_id, timestamp asc);

-- Backfill (safe if column already existed)
update public.rrt_history
set time_elapsed_ms = coalesce((data->>'timeElapsed')::bigint, 0)
where time_elapsed_ms = 0;

alter table public.rrt_history enable row level security;

drop policy if exists "rrt_history_owner_read" on public.rrt_history;
create policy "rrt_history_owner_read"
on public.rrt_history for select
using (auth.uid() = user_id);

drop policy if exists "rrt_history_owner_write" on public.rrt_history;
create policy "rrt_history_owner_write"
on public.rrt_history for insert
with check (auth.uid() = user_id);

drop policy if exists "rrt_history_owner_delete" on public.rrt_history;
create policy "rrt_history_owner_delete"
on public.rrt_history for delete
using (auth.uid() = user_id);

-- 2B) Total minutes leaderboard (public read, auto-updated from rrt_history inserts)
create table if not exists public.leaderboard_minutes (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_path text,
  total_ms bigint not null default 0,
  updated_at timestamptz not null default now()
);

-- Ensure column exists even if table already existed before this migration.
alter table public.leaderboard_minutes
  add column if not exists avatar_path text;

-- 2C) Points leaderboard (public read, owner upsert)
create table if not exists public.leaderboard_points (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_path text,
  points integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.leaderboard_points
  add column if not exists avatar_path text;

alter table public.leaderboard_points
  add column if not exists points integer not null default 0;

create index if not exists leaderboard_points_points_desc on public.leaderboard_points (points desc);

alter table public.leaderboard_points enable row level security;

drop policy if exists "leaderboard_points_read_all" on public.leaderboard_points;
create policy "leaderboard_points_read_all"
on public.leaderboard_points for select
using (true);

drop policy if exists "leaderboard_points_owner_write" on public.leaderboard_points;
create policy "leaderboard_points_owner_write"
on public.leaderboard_points for insert
with check (auth.uid() = user_id);

drop policy if exists "leaderboard_points_owner_update" on public.leaderboard_points;
create policy "leaderboard_points_owner_update"
on public.leaderboard_points for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

alter table public.leaderboard_minutes enable row level security;

drop policy if exists "leaderboard_minutes_read_all" on public.leaderboard_minutes;
create policy "leaderboard_minutes_read_all"
on public.leaderboard_minutes for select
using (true);

drop policy if exists "leaderboard_minutes_owner_write" on public.leaderboard_minutes;
create policy "leaderboard_minutes_owner_write"
on public.leaderboard_minutes for insert
with check (auth.uid() = user_id);

drop policy if exists "leaderboard_minutes_owner_update" on public.leaderboard_minutes;
create policy "leaderboard_minutes_owner_update"
on public.leaderboard_minutes for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Trigger to bump totals on each inserted history row.
create or replace function public.bump_leaderboard_minutes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform set_config('row_security', 'off', true);
  insert into public.leaderboard_minutes (user_id, total_ms, updated_at)
  values (new.user_id, coalesce(new.time_elapsed_ms, 0), now())
  on conflict (user_id) do update
    set total_ms = public.leaderboard_minutes.total_ms + coalesce(new.time_elapsed_ms, 0),
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_bump_leaderboard_minutes on public.rrt_history;
create trigger trg_bump_leaderboard_minutes
after insert on public.rrt_history
for each row execute function public.bump_leaderboard_minutes();

-- 3) Storage bucket + RLS for per-user image storage
insert into storage.buckets (id, name, public)
values ('images', 'images', false)
on conflict (id) do nothing;

-- Allow each user to manage objects only under their own prefix: `${auth.uid()}/...`
drop policy if exists "images_owner_read" on storage.objects;
create policy "images_owner_read"
on storage.objects for select
using (
  bucket_id = 'images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "images_owner_write" on storage.objects;
create policy "images_owner_write"
on storage.objects for insert
with check (
  bucket_id = 'images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "images_owner_update" on storage.objects;
create policy "images_owner_update"
on storage.objects for update
using (
  bucket_id = 'images'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "images_owner_delete" on storage.objects;
create policy "images_owner_delete"
on storage.objects for delete
using (
  bucket_id = 'images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- 3B) User profiles + avatars
create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  avatar_path text,
  updated_at timestamptz not null default now()
);

-- Unique usernames (case-insensitive-ish by lower())
create unique index if not exists user_profiles_username_lower_unique
on public.user_profiles ((lower(username)));

alter table public.user_profiles enable row level security;

drop policy if exists "user_profiles_owner_read" on public.user_profiles;
create policy "user_profiles_owner_read"
on public.user_profiles for select
using (auth.uid() = user_id);

drop policy if exists "user_profiles_owner_write" on public.user_profiles;
create policy "user_profiles_owner_write"
on public.user_profiles for insert
with check (auth.uid() = user_id);

drop policy if exists "user_profiles_owner_update" on public.user_profiles;
create policy "user_profiles_owner_update"
on public.user_profiles for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Avatars bucket (private; per-user prefix)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Ensure bucket is public even if it already existed from an earlier migration.
update storage.buckets set public = true where id = 'avatars';

drop policy if exists "avatars_owner_read" on storage.objects;
create policy "avatars_public_read"
on storage.objects for select
using (
  bucket_id = 'avatars'
);

drop policy if exists "avatars_owner_write" on storage.objects;
create policy "avatars_owner_write"
on storage.objects for insert
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "avatars_owner_update" on storage.objects;
create policy "avatars_owner_update"
on storage.objects for update
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "avatars_owner_delete" on storage.objects;
create policy "avatars_owner_delete"
on storage.objects for delete
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- 4) Public leaderboard (optional)
create table if not exists public.leaderboard_entries (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_path text,
  score integer not null,
  created_at timestamptz not null default now()
);

alter table public.leaderboard_entries
  add column if not exists avatar_path text;

create index if not exists leaderboard_score_desc on public.leaderboard_entries (score desc);

alter table public.leaderboard_entries enable row level security;

drop policy if exists "leaderboard_read_all" on public.leaderboard_entries;
create policy "leaderboard_read_all"
on public.leaderboard_entries for select
using (true);

drop policy if exists "leaderboard_write_owner" on public.leaderboard_entries;
create policy "leaderboard_write_owner"
on public.leaderboard_entries for insert
with check (auth.uid() = user_id);

-- 5) 2D Space (GQ) leaderboard (public read, owner upsert/delete)
create table if not exists public.leaderboard_2d_gq (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_path text,
  gq integer not null,
  premises integer not null,
  last_30_right integer not null,
  last_30_scramble_min integer not null,
  last_30_countdown_max integer not null,
  qualified_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.leaderboard_2d_gq
  add column if not exists avatar_path text;

create index if not exists leaderboard_2d_gq_gq_desc on public.leaderboard_2d_gq (gq desc);

alter table public.leaderboard_2d_gq enable row level security;

drop policy if exists "leaderboard_2d_gq_read_all" on public.leaderboard_2d_gq;
create policy "leaderboard_2d_gq_read_all"
on public.leaderboard_2d_gq for select
using (true);

drop policy if exists "leaderboard_2d_gq_owner_write" on public.leaderboard_2d_gq;
create policy "leaderboard_2d_gq_owner_write"
on public.leaderboard_2d_gq for insert
with check (auth.uid() = user_id);

drop policy if exists "leaderboard_2d_gq_owner_update" on public.leaderboard_2d_gq;
create policy "leaderboard_2d_gq_owner_update"
on public.leaderboard_2d_gq for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "leaderboard_2d_gq_owner_delete" on public.leaderboard_2d_gq;
create policy "leaderboard_2d_gq_owner_delete"
on public.leaderboard_2d_gq for delete
using (auth.uid() = user_id);


