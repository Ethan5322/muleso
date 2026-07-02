-- ============================================================================
-- MuleSoo Corporate Admin — seed the SUPER ADMIN (you).
-- Run AFTER corporate_admin.sql, and AFTER creating your own user in
-- Supabase → Authentication → Users. Paste your real User UID below.
-- Department admins are NOT seeded here — you create them from the panel
-- (Control Panel → Register admin), which captures their face + issues an ID.
-- ============================================================================

insert into corp_department_admins (id, department_id, department_name, display_name, email, staff_number, status, is_super_admin)
values (
  '00000000-0000-0000-0000-000000000000',   -- << replace with YOUR Auth User UID
  0, 'Executive', 'Muluken (Super Admin)', 'you@example.com', 'MSD-0001', 'active', true
)
on conflict (id) do update
  set is_super_admin = true,
      status = 'active',
      display_name = excluded.display_name;
