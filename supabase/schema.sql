-- Run this once in your Supabase project's SQL Editor.

create table if not exists habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  color text not null,
  frequency text not null default 'daily' check (frequency in ('daily', 'custom')),
  days int[] not null default '{}',
  created_at date not null default current_date,
  inserted_at timestamptz not null default now()
);

create table if not exists entries (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references habits(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  entry_date date not null,
  done boolean not null default false,
  note text not null default '',
  unique (habit_id, entry_date)
);

alter table habits enable row level security;
alter table entries enable row level security;

-- Each person can only ever see or touch their own rows.
create policy "habits_select_own" on habits for select using (auth.uid() = user_id);
create policy "habits_insert_own" on habits for insert with check (auth.uid() = user_id);
create policy "habits_update_own" on habits for update using (auth.uid() = user_id);
create policy "habits_delete_own" on habits for delete using (auth.uid() = user_id);

create policy "entries_select_own" on entries for select using (auth.uid() = user_id);
create policy "entries_insert_own" on entries for insert with check (auth.uid() = user_id);
create policy "entries_update_own" on entries for update using (auth.uid() = user_id);
create policy "entries_delete_own" on entries for delete using (auth.uid() = user_id);

create index if not exists entries_habit_date_idx on entries (habit_id, entry_date);
