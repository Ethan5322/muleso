-- ============================================================================
-- MuleSoo Corporate Admin — v5: department-targeted team messages.
-- Run once, after corporate_admin.sql. Additive & idempotent.
-- target_department_id: NULL = everyone (common group chat / all-staff announcement)
--                       <number> = only that department (+ the main/super admin) sees it
-- ============================================================================

alter table corp_team_channel_messages add column if not exists target_department_id int;
create index if not exists idx_corp_chan_target on corp_team_channel_messages(target_department_id);
