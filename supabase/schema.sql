-- ===========================================
-- Khalifah TV — Supabase Database Schema
-- ===========================================
-- Run this SQL in your Supabase SQL Editor to create the videos table.

create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null,
  duration text,
  video_url text not null,
  video_key text not null,
  thumbnail_url text not null,
  thumbnail_key text not null,
  status text not null default 'draft' check (status in ('published', 'draft', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS)
alter table videos enable row level security;

-- Temporary Policy: Allow ALL operations for everyone.
-- WARNING: We will change this later when we add Admin Login!
create policy "Allow all access" on videos for all using (true) with check (true);

-- Optional: Add an index on status for filtering
create index if not exists videos_status_idx on videos(status);
create index if not exists idx_videos_status on videos (status);

-- Optional: Add an index on category for filtering
create index if not exists idx_videos_category on videos (category);

-- Optional: Row Level Security (RLS) — disabled for now, enable when adding auth
-- alter table videos enable row level security;
-- TODO: Add RLS policies when authentication is implemented
