-- ============================================================================
-- MuleSoo Corporate Admin — v9: @MENTIONS IN TASK NOTES
-- Ping a specific teammate on a task; they get a badge until they open it.
-- Requires v8 (corp_task_comments). Idempotent.
-- ============================================================================

create table if not exists corp_task_mentions (
  id                 uuid primary key default gen_random_uuid(),
  task_id            uuid not null references corp_tasks(id) on delete cascade,
  comment_id         uuid references corp_task_comments(id) on delete cascade,
  mentioned_admin_id uuid not null references corp_department_admins(id) on delete cascade,
  read_at            timestamptz,
  created_at         timestamptz not null default now()
);
create index if not exists idx_corp_task_mentions_admin on corp_task_mentions(mentioned_admin_id, read_at);

alter table corp_task_mentions enable row level security;

drop policy if exists corp_task_mentions_select on corp_task_mentions;
create policy corp_task_mentions_select on corp_task_mentions
  for select using (mentioned_admin_id = auth.uid() or corp_is_super_admin());

drop policy if exists corp_task_mentions_update on corp_task_mentions;
create policy corp_task_mentions_update on corp_task_mentions
  for update using (mentioned_admin_id = auth.uid()) with check (mentioned_admin_id = auth.uid());

-- (Inserts happen server-side via the service-role key.)

do $$
begin
  begin execute 'alter publication supabase_realtime add table corp_task_mentions'; exception when others then null; end;
end $$;
