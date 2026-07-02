-- ============================================================================
-- MuleSoo Corporate Admin — SEED admins
-- Run AFTER corporate_admin.sql, and AFTER you have created the Auth users in
-- Supabase Dashboard → Authentication → Users (email + password for each).
--
-- For each user, copy their UUID (the "User UID" column) and fill it in below.
-- Re-runnable: uses upsert.
-- ============================================================================

-- 1) SUPER ADMIN (you, Muluken) --------------------------------------------
insert into corp_department_admins (id, department_id, department_name, display_name, status, is_super_admin)
values ('00000000-0000-0000-0000-000000000000', 0, 'Executive', 'Muluken (Super Admin)', 'active', true)
on conflict (id) do update
  set is_super_admin = excluded.is_super_admin,
      display_name   = excluded.display_name,
      status         = 'active';

-- 2) DEPARTMENT ADMINS 1–5 --------------------------------------------------
-- Replace each UUID and the names. Delete any rows you don't need yet.
insert into corp_department_admins (id, department_id, department_name, display_name, status, is_super_admin) values
  ('11111111-1111-1111-1111-111111111111', 1, 'Sales',          'Department Admin 1', 'active', false),
  ('22222222-2222-2222-2222-222222222222', 2, 'Development',     'Department Admin 2', 'active', false),
  ('33333333-3333-3333-3333-333333333333', 3, 'Client Support', 'Department Admin 3', 'active', false),
  ('44444444-4444-4444-4444-444444444444', 4, 'Marketing',      'Department Admin 4', 'active', false),
  ('55555555-5555-5555-5555-555555555555', 5, 'Finance',        'Department Admin 5', 'active', false)
on conflict (id) do update
  set department_id   = excluded.department_id,
      department_name = excluded.department_name,
      display_name    = excluded.display_name;

-- 3) Seed default capabilities for every department admin (all enabled) ------
insert into corp_admin_capabilities (department_admin_id, capability_key, enabled)
select da.id, cap.key, true
from corp_department_admins da
cross join (values
  ('can_send_dm'),
  ('can_post_channel'),
  ('can_view_department_reports'),
  ('can_manage_bookings'),
  ('can_export_data')
) as cap(key)
where da.is_super_admin = false
on conflict (department_admin_id, capability_key) do nothing;
