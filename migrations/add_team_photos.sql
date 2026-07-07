-- ============================================================
-- MuleSoo — team photo columns on site_settings (About page)
-- Required so the admin "Team Photos" upload can save.
-- Safe to run multiple times.
-- ============================================================

ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS team_vp_photo     TEXT DEFAULT '';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS team_social_photo TEXT DEFAULT '';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS team_sales_photo  TEXT DEFAULT '';
