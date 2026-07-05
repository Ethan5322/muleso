-- ============================================================
-- MuleSoo — leads table (contact-form enquiries)
-- Safe to run multiple times. Creates the table if missing and
-- back-fills any missing columns the app reads/writes.
-- ============================================================

CREATE TABLE IF NOT EXISTS leads (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ DEFAULT now(),
  name        TEXT,
  email       TEXT,
  company     TEXT,
  service     TEXT,
  budget      TEXT,
  details     TEXT,
  source      TEXT,
  status      TEXT DEFAULT 'New',
  notes       TEXT
);

-- Back-fill columns in case an older/partial table already exists
ALTER TABLE leads ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE leads ADD COLUMN IF NOT EXISTS name    TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS email   TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS service TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS budget  TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS details TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source  TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS status  TEXT DEFAULT 'New';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes   TEXT;

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);
