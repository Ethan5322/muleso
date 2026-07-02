-- ============================================================================
-- MuleSoo Corporate Admin — v2 additions (run once, after corporate_admin.sql)
-- Adds: read-only "visitor" role + temporary access expiry.
-- Idempotent & additive — nothing existing is changed.
-- ============================================================================

alter table corp_department_admins add column if not exists is_visitor boolean not null default false;
alter table corp_department_admins add column if not exists expires_at timestamptz;

-- Main-admin identity (for the main admin's own ID card). One row.
insert into corp_config (key, value) values ('main_admin_card', '{}'::jsonb)
on conflict (key) do nothing;
