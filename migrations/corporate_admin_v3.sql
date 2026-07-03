-- ============================================================================
-- MuleSoo Corporate Admin — v3: team-channel @mentions + notifications.
-- Run once, after corporate_admin.sql. Additive & idempotent.
-- ============================================================================

create table if not exists corp_channel_mentions (
  id                  uuid primary key default gen_random_uuid(),
  message_id          uuid not null references corp_team_channel_messages(id) on delete cascade,
  mentioned_admin_id  uuid not null references corp_department_admins(id) on delete cascade,
  read_at             timestamptz,
  created_at          timestamptz not null default now()
);
create index if not exists idx_corp_mentions_admin on corp_channel_mentions(mentioned_admin_id, read_at);

alter table corp_channel_mentions enable row level security;

drop policy if exists corp_mentions_select on corp_channel_mentions;
create policy corp_mentions_select on corp_channel_mentions
  for select using (mentioned_admin_id = auth.uid() or corp_is_super_admin());

drop policy if exists corp_mentions_update on corp_channel_mentions;
create policy corp_mentions_update on corp_channel_mentions
  for update using (mentioned_admin_id = auth.uid()) with check (mentioned_admin_id = auth.uid());

-- (Inserts happen server-side via the service-role key.)

do $$
begin
  begin execute 'alter publication supabase_realtime add table corp_channel_mentions'; exception when others then null; end;
end $$;
