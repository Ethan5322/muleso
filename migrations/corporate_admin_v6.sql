-- ============================================================================
-- MuleSoo Corporate Admin — v6: DEPARTMENTS + WORK/TASK SYSTEM
-- Gives each department a real job: assignable tasks with status, priority,
-- owner and due date. Main admin assigns; departments work their queue.
-- Safe to re-run (idempotent). Prefixed corp_ — isolated from public site.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. CANONICAL DEPARTMENTS (was just free text on each admin)
-- ---------------------------------------------------------------------------
create table if not exists corp_departments (
  id          int primary key,
  name        text not null,
  description text,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Backfill from the departments already referenced by existing admins so the
-- ids stay aligned with what admins/messages already use.
insert into corp_departments (id, name)
select distinct department_id, coalesce(nullif(department_name, ''), 'Department ' || department_id)
from corp_department_admins
where department_id is not null
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 2. TASKS — the unit of work each department performs
-- ---------------------------------------------------------------------------
create table if not exists corp_tasks (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  detail        text,
  department_id int references corp_departments(id) on delete set null,
  assignee_id   uuid references corp_department_admins(id) on delete set null,
  created_by    uuid references corp_department_admins(id) on delete set null,
  status        text not null default 'open'   check (status in ('open','in_progress','blocked','done')),
  priority      text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  due_date      date,
  completed_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists idx_corp_tasks_dept     on corp_tasks(department_id);
create index if not exists idx_corp_tasks_assignee on corp_tasks(assignee_id);
create index if not exists idx_corp_tasks_status   on corp_tasks(status);

-- keep updated_at fresh
create or replace function corp_touch_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists trg_corp_tasks_touch on corp_tasks;
create trigger trg_corp_tasks_touch before update on corp_tasks
  for each row execute function corp_touch_updated_at();

-- ---------------------------------------------------------------------------
-- 3. RLS (APIs use service-role; these are a backstop)
-- ---------------------------------------------------------------------------
alter table corp_departments enable row level security;
alter table corp_tasks       enable row level security;

drop policy if exists corp_dept_select on corp_departments;
create policy corp_dept_select on corp_departments
  for select using (corp_is_active_admin() or corp_is_super_admin());

drop policy if exists corp_dept_write on corp_departments;
create policy corp_dept_write on corp_departments
  for all using (corp_is_super_admin()) with check (corp_is_super_admin());

-- A sub-admin can see tasks for their own department OR assigned to them; super sees all.
drop policy if exists corp_tasks_select on corp_tasks;
create policy corp_tasks_select on corp_tasks
  for select using (
    corp_is_super_admin()
    or assignee_id = auth.uid()
    or department_id in (select department_id from corp_department_admins where id = auth.uid())
  );

-- Sub-admins can update tasks in their department (claim / move status); super can do anything.
drop policy if exists corp_tasks_update on corp_tasks;
create policy corp_tasks_update on corp_tasks
  for update using (
    corp_is_super_admin()
    or assignee_id = auth.uid()
    or department_id in (select department_id from corp_department_admins where id = auth.uid())
  );

drop policy if exists corp_tasks_insert on corp_tasks;
create policy corp_tasks_insert on corp_tasks
  for insert with check (corp_is_active_admin() or corp_is_super_admin());

-- ---------------------------------------------------------------------------
-- 4. REALTIME (live task board). Idempotent.
-- ---------------------------------------------------------------------------
do $$
begin
  begin execute 'alter publication supabase_realtime add table corp_tasks'; exception when others then null; end;
end $$;

-- ============================================================================
-- DONE. Departments are now real, and each department has a live task queue.
--  • Main admin: /admin/tasks  → assign work to a department or a person.
--  • Sub-admin:  /corporate → My Work → claim & work the queue.
-- ============================================================================
