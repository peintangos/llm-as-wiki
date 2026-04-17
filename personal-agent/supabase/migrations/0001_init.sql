-- prd-personal-agent spec-002 migration
-- Creates goals, metrics, actuals with RLS + seeds the metrics lookup table.
-- Apply via: Supabase Dashboard SQL Editor or `npx supabase db push`.

-- =============================================================================
-- metrics: shared reference data (not user-scoped).
-- All authenticated users may read; only service_role can write.
-- =============================================================================
create table if not exists public.metrics (
  key text primary key,
  label text not null,
  unit text not null
);

-- =============================================================================
-- goals: user-scoped goals across 4 horizons, tagged behavior / outcome.
-- =============================================================================
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  goal_type text not null check (goal_type in ('behavior', 'outcome')),
  horizon text not null check (horizon in ('3yr', '1yr', 'half', 'month')),
  period_start date not null,
  period_end date not null,
  metric_key text references public.metrics(key),
  target_value numeric,
  created_at timestamptz not null default now()
);

create index if not exists goals_owner_idx on public.goals(owner_id);
create index if not exists goals_owner_horizon_idx on public.goals(owner_id, horizon);

-- =============================================================================
-- actuals: user-scoped recorded values per metric per day.
-- source='manual' for hand-entered, 'rss' for auto-ingested (spec-005).
-- =============================================================================
create table if not exists public.actuals (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  metric_key text not null references public.metrics(key),
  value numeric not null,
  recorded_date date not null,
  source text not null check (source in ('manual', 'rss')),
  note text,
  created_at timestamptz not null default now()
);

create index if not exists actuals_owner_metric_date_idx
  on public.actuals(owner_id, metric_key, recorded_date);

-- =============================================================================
-- Row Level Security
-- =============================================================================
alter table public.metrics enable row level security;
alter table public.goals enable row level security;
alter table public.actuals enable row level security;

-- metrics: readable by any authenticated user, no writes via PostgREST.
drop policy if exists "Authenticated can read metrics" on public.metrics;
create policy "Authenticated can read metrics"
  on public.metrics
  for select
  to authenticated
  using (true);

-- goals: owner-only full CRUD.
drop policy if exists "Owner can read own goals" on public.goals;
create policy "Owner can read own goals"
  on public.goals
  for select
  to authenticated
  using (auth.uid() = owner_id);

drop policy if exists "Owner can insert own goals" on public.goals;
create policy "Owner can insert own goals"
  on public.goals
  for insert
  to authenticated
  with check (auth.uid() = owner_id);

drop policy if exists "Owner can update own goals" on public.goals;
create policy "Owner can update own goals"
  on public.goals
  for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "Owner can delete own goals" on public.goals;
create policy "Owner can delete own goals"
  on public.goals
  for delete
  to authenticated
  using (auth.uid() = owner_id);

-- actuals: owner-only full CRUD.
drop policy if exists "Owner can read own actuals" on public.actuals;
create policy "Owner can read own actuals"
  on public.actuals
  for select
  to authenticated
  using (auth.uid() = owner_id);

drop policy if exists "Owner can insert own actuals" on public.actuals;
create policy "Owner can insert own actuals"
  on public.actuals
  for insert
  to authenticated
  with check (auth.uid() = owner_id);

drop policy if exists "Owner can update own actuals" on public.actuals;
create policy "Owner can update own actuals"
  on public.actuals
  for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "Owner can delete own actuals" on public.actuals;
create policy "Owner can delete own actuals"
  on public.actuals
  for delete
  to authenticated
  using (auth.uid() = owner_id);

-- =============================================================================
-- Seed metrics (idempotent)
-- =============================================================================
insert into public.metrics (key, label, unit) values
  ('note_count', 'note 記事数', 'articles'),
  ('zenn_count', 'Zenn 記事数', 'articles'),
  ('x_posts',    'X ポスト数',  'posts'),
  ('meetings',   '社長アポ数',   'meetings'),
  ('events',     'イベント出席数', 'events'),
  ('deals',      '商談成功数',   'deals')
on conflict (key) do nothing;
