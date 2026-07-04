-- ============================================================================
-- MuleSoo Corporate Admin — v8: TASK COMMENTS / ACTIVITY
-- Lets a department discuss a task inline (progress notes, questions, hand-offs).
-- Requires v6 (corp_tasks). Idempotent. Prefixed corp_ — isolated.
-- ============================================================================

create table if not exists corp_task_comments (
  id         uuid primary key default gen_random_uuid(),
  task_id    uuid not null references corp_tasks(id) on delete cascade,
  author_id  uuid references corp_department_admins(id) on delete set null,
  body       text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_corp_task_comments_task on corp_task_comments(task_id, created_at);

alter table corp_task_comments enable row level security;

-- Read/write comments on a task you can see (own department, assigned, or super).
drop policy if exists corp_task_comments_select on corp_task_comments;
create policy corp_task_comments_select on corp_task_comments
  for select using (
    corp_is_super_admin()
    or exists (
      select 1 from corp_tasks t
      where t.id = corp_task_comments.task_id
        and (
          t.assignee_id = auth.uid()
          or t.department_id in (select department_id from corp_department_admins where id = auth.uid())
        )
    )
  );

drop policy if exists corp_task_comments_insert on corp_task_comments;
create policy corp_task_comments_insert on corp_task_comments
  for insert with check (author_id = auth.uid() and corp_is_active_admin());

do $$
begin
  begin execute 'alter publication supabase_realtime add table corp_task_comments'; exception when others then null; end;
end $$;
