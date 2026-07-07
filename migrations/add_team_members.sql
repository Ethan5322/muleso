-- ============================================================
-- MuleSoo — team members (JSON) on site_settings (About page)
-- Stores the editable team (name, role, bio, photo) as one JSON column.
-- Safe to run multiple times.
-- ============================================================

ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS team_members TEXT DEFAULT '';
