-- ============================================================================
-- MuleSoo Corporate Admin — v4: timed suspension + job role title.
-- Run once, after corporate_admin.sql. Additive & idempotent.
-- ============================================================================

alter table corp_department_admins add column if not exists suspended_until timestamptz;
alter table corp_department_admins add column if not exists role_title      text;
