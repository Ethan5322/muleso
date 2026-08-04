-- ============================================================================
-- portfolio + pages — the two tables the app expects but Supabase never had.
--
-- Found by an end-to-end audit: every other table the code touches exists,
-- these two do not, so /admin/portfolio and /admin/pages fail on every read
-- and write ("Could not find the table 'public.portfolio' in the schema
-- cache"). The PUBLIC /portfolio page is unaffected — it falls back to its
-- hardcoded project list when the query fails.
--
-- Column shapes are taken verbatim from PortfolioItem and CustomPage in
-- lib/supabase.ts, so the existing admin editors work without code changes.
-- Safe to re-run.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. portfolio — projects shown on the public /portfolio page
-- ---------------------------------------------------------------------------
create table if not exists portfolio (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null default '',
  category    text not null default 'Website'
                check (category in ('Website','Chatbot','Logo','QR Code','PDF','Email','Video','Other')),
  client_name text not null default '',
  client_type text not null default '',
  image_url   text not null default '',
  video_url   text,
  tech_stack  jsonb not null default '[]'::jsonb,
  challenge   text not null default '',
  solution    text not null default '',
  result      text not null default '',
  link        text,
  featured    boolean not null default false,
  "order"     int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists idx_portfolio_order    on portfolio("order");
create index if not exists idx_portfolio_featured on portfolio(featured);

-- ---------------------------------------------------------------------------
-- 2. pages — custom CMS pages managed from /admin/pages
-- ---------------------------------------------------------------------------
create table if not exists pages (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  slug             text not null unique,
  content          text not null default '',
  meta_description text not null default '',
  published        boolean not null default false,
  "order"          int not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists idx_pages_slug      on pages(slug);
create index if not exists idx_pages_published on pages(published);

-- ---------------------------------------------------------------------------
-- 3. keep updated_at honest
-- ---------------------------------------------------------------------------
create or replace function touch_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists trg_portfolio_touch on portfolio;
create trigger trg_portfolio_touch before update on portfolio
  for each row execute function touch_updated_at();

drop trigger if exists trg_pages_touch on pages;
create trigger trg_pages_touch before update on pages
  for each row execute function touch_updated_at();

-- ---------------------------------------------------------------------------
-- 4. RLS
--
-- Writes always go through the admin API routes, which use the service-role
-- key and bypass RLS entirely — so no write policy is needed or wanted here.
--
-- Reads are the subtle part. app/portfolio/page.tsx reads `portfolio` from the
-- BROWSER with the anon key, so portfolio needs an anon SELECT policy or the
-- public page silently falls back to its hardcoded list forever.
--
-- `pages` gets no anon policy: drafts must not be world-readable. Note that
-- components/admin/PageManager.tsx currently reads `pages` with the anon
-- browser client too, so it will see nothing until it is switched to fetch
-- /api/admin/pages (service role) instead. Same applies to
-- PortfolioManager if you ever tighten the portfolio policy below.
-- ---------------------------------------------------------------------------
alter table portfolio enable row level security;
alter table pages     enable row level security;

drop policy if exists portfolio_public_read on portfolio;
create policy portfolio_public_read on portfolio
  for select using (true);

drop policy if exists pages_public_read_published on pages;
create policy pages_public_read_published on pages
  for select using (published = true);

-- ============================================================================
-- DONE. Verify with:
--   select count(*) from portfolio;
--   select count(*) from pages;
-- then reload /admin/portfolio and /admin/pages.
-- ============================================================================
