-- ============================================================================
-- MuleSoo Corporate Admin Layer — COMPLETE, ISOLATED, ADDITIVE schema.
-- Run this ONE file in Supabase → SQL Editor. Safe to re-run (idempotent).
-- Everything is prefixed `corp_` so it cannot collide with existing tables.
-- Then create your Super Admin auth user + run corporate_admin_seed.sql.
-- Department admins are created from inside the panel (registration flow).
-- ============================================================================

-- Staff-number counter (MSD-1001, MSD-1002, …)
create sequence if not exists corp_staff_seq start 1001;

-- ---------------------------------------------------------------------------
-- 1. TABLES
-- ---------------------------------------------------------------------------

-- Department admins (each is a Supabase Auth user). Roster-safe columns only.
create table if not exists corp_department_admins (
  id              uuid primary key references auth.users(id) on delete cascade,
  department_id   int,
  department_name text,
  display_name    text,
  email           text,
  staff_number    text unique,
  photo_data_url  text,                 -- 3:4 ID photo (data URL)
  status          text not null default 'active' check (status in ('active','suspended')),
  is_super_admin  boolean not null default false,
  created_at      timestamptz not null default now()
);

-- SENSITIVE login material — SEPARATE table, NO RLS policies granted, so it is
-- reachable ONLY via the service-role key (server routes). Other admins can
-- never read another admin's verification code / QR token / face descriptor.
create table if not exists corp_admin_secrets (
  department_admin_id uuid primary key references corp_department_admins(id) on delete cascade,
  verification_code   text unique,
  qr_token            text unique,
  face_descriptor     jsonb,            -- 128-float face-api descriptor
  created_at          timestamptz not null default now()
);

create table if not exists corp_admin_capabilities (
  id                  uuid primary key default gen_random_uuid(),
  department_admin_id uuid not null references corp_department_admins(id) on delete cascade,
  capability_key      text not null,
  enabled             boolean not null default false,
  updated_by          uuid references corp_department_admins(id),
  updated_at          timestamptz not null default now(),
  unique (department_admin_id, capability_key)
);

create table if not exists corp_direct_messages (
  id           uuid primary key default gen_random_uuid(),
  sender_id    uuid not null references corp_department_admins(id) on delete cascade,
  recipient_id uuid not null references corp_department_admins(id) on delete cascade,
  body         text not null,
  read_at      timestamptz,
  created_at   timestamptz not null default now()
);
create index if not exists idx_corp_dm_sender    on corp_direct_messages(sender_id);
create index if not exists idx_corp_dm_recipient on corp_direct_messages(recipient_id);

create table if not exists corp_team_channels (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists corp_team_channel_messages (
  id                uuid primary key default gen_random_uuid(),
  channel_id        uuid not null references corp_team_channels(id) on delete cascade,
  sender_id         uuid not null references corp_department_admins(id) on delete cascade,
  parent_message_id uuid references corp_team_channel_messages(id) on delete cascade,
  body              text not null,
  pinned            boolean not null default false,
  created_at        timestamptz not null default now()
);
create index if not exists idx_corp_channel_msgs on corp_team_channel_messages(channel_id, created_at);

create table if not exists corp_message_reactions (
  id                  uuid primary key default gen_random_uuid(),
  message_id          uuid not null references corp_team_channel_messages(id) on delete cascade,
  department_admin_id uuid not null references corp_department_admins(id) on delete cascade,
  emoji               text not null,
  unique (message_id, department_admin_id, emoji)
);

create table if not exists corp_admin_audit_log (
  id              uuid primary key default gen_random_uuid(),
  actor_id        uuid references corp_department_admins(id),
  action          text not null,
  target_admin_id uuid references corp_department_admins(id),
  detail          jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now()
);

create table if not exists corp_config (
  key   text primary key,
  value jsonb not null default '{}'::jsonb
);
insert into corp_config (key, value) values ('module_enabled', 'true'::jsonb)
on conflict (key) do nothing;

insert into corp_team_channels (name) values ('#team-updates')
on conflict (name) do nothing;

-- ---------------------------------------------------------------------------
-- 2. HELPER FUNCTIONS (SECURITY DEFINER — avoid recursive RLS)
-- ---------------------------------------------------------------------------
create or replace function corp_is_active_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from corp_department_admins where id = auth.uid() and status = 'active');
$$;

create or replace function corp_is_super_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from corp_department_admins where id = auth.uid() and is_super_admin = true and status = 'active');
$$;

-- Issue the next staff number (MSD-1001, MSD-1002, …). Called via service-role RPC.
create or replace function corp_next_staff() returns text
language sql security definer set search_path = public as $$
  select 'MSD-' || nextval('corp_staff_seq')::text;
$$;

-- ---------------------------------------------------------------------------
-- 3. ENABLE RLS
-- ---------------------------------------------------------------------------
alter table corp_department_admins     enable row level security;
alter table corp_admin_secrets         enable row level security;  -- NO policies => service-role only
alter table corp_admin_capabilities    enable row level security;
alter table corp_direct_messages       enable row level security;
alter table corp_team_channels         enable row level security;
alter table corp_team_channel_messages enable row level security;
alter table corp_message_reactions     enable row level security;
alter table corp_admin_audit_log       enable row level security;
alter table corp_config                enable row level security;

-- ---------------------------------------------------------------------------
-- 4. POLICIES
-- ---------------------------------------------------------------------------
drop policy if exists corp_admins_select on corp_department_admins;
create policy corp_admins_select on corp_department_admins
  for select using (corp_is_active_admin() or corp_is_super_admin());

drop policy if exists corp_admins_write on corp_department_admins;
create policy corp_admins_write on corp_department_admins
  for all using (corp_is_super_admin()) with check (corp_is_super_admin());

drop policy if exists corp_caps_select on corp_admin_capabilities;
create policy corp_caps_select on corp_admin_capabilities
  for select using (department_admin_id = auth.uid() or corp_is_super_admin());

drop policy if exists corp_caps_write on corp_admin_capabilities;
create policy corp_caps_write on corp_admin_capabilities
  for all using (corp_is_super_admin()) with check (corp_is_super_admin());

drop policy if exists corp_dm_select on corp_direct_messages;
create policy corp_dm_select on corp_direct_messages
  for select using (auth.uid() = sender_id or auth.uid() = recipient_id);

drop policy if exists corp_dm_insert on corp_direct_messages;
create policy corp_dm_insert on corp_direct_messages
  for insert with check (auth.uid() = sender_id and corp_is_active_admin());

drop policy if exists corp_dm_update on corp_direct_messages;
create policy corp_dm_update on corp_direct_messages
  for update using (auth.uid() = recipient_id) with check (auth.uid() = recipient_id);

drop policy if exists corp_channels_select on corp_team_channels;
create policy corp_channels_select on corp_team_channels
  for select using (corp_is_active_admin() or corp_is_super_admin());

drop policy if exists corp_channels_write on corp_team_channels;
create policy corp_channels_write on corp_team_channels
  for all using (corp_is_super_admin()) with check (corp_is_super_admin());

drop policy if exists corp_chan_msgs_select on corp_team_channel_messages;
create policy corp_chan_msgs_select on corp_team_channel_messages
  for select using (corp_is_active_admin() or corp_is_super_admin());

drop policy if exists corp_chan_msgs_insert on corp_team_channel_messages;
create policy corp_chan_msgs_insert on corp_team_channel_messages
  for insert with check (sender_id = auth.uid() and corp_is_active_admin());

drop policy if exists corp_chan_msgs_update on corp_team_channel_messages;
create policy corp_chan_msgs_update on corp_team_channel_messages
  for update using (sender_id = auth.uid() or corp_is_super_admin())
  with check (sender_id = auth.uid() or corp_is_super_admin());

drop policy if exists corp_react_select on corp_message_reactions;
create policy corp_react_select on corp_message_reactions
  for select using (corp_is_active_admin() or corp_is_super_admin());

drop policy if exists corp_react_write on corp_message_reactions;
create policy corp_react_write on corp_message_reactions
  for all using (department_admin_id = auth.uid()) with check (department_admin_id = auth.uid());

drop policy if exists corp_audit_select on corp_admin_audit_log;
create policy corp_audit_select on corp_admin_audit_log
  for select using (corp_is_super_admin());

drop policy if exists corp_config_select on corp_config;
create policy corp_config_select on corp_config
  for select using (corp_is_active_admin() or corp_is_super_admin());

drop policy if exists corp_config_write on corp_config;
create policy corp_config_write on corp_config
  for all using (corp_is_super_admin()) with check (corp_is_super_admin());

-- (corp_admin_secrets intentionally has RLS enabled and NO policies => only the
--  service-role key can read/write it. This keeps login credentials private.)

-- ---------------------------------------------------------------------------
-- 5. REALTIME (instant DM / channel delivery). Idempotent.
-- ---------------------------------------------------------------------------
do $$
begin
  begin execute 'alter publication supabase_realtime add table corp_direct_messages'; exception when others then null; end;
  begin execute 'alter publication supabase_realtime add table corp_team_channel_messages'; exception when others then null; end;
  begin execute 'alter publication supabase_realtime add table corp_message_reactions'; exception when others then null; end;
end $$;

-- ============================================================================
-- DONE. Next:
--  1) Authentication → Users → add YOUR user (Super Admin), copy the UID.
--  2) Run corporate_admin_seed.sql with that UID.
--  3) Log in at /corporate, then register department admins from the panel.
-- ============================================================================
