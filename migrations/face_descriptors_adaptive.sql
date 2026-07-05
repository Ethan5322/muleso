-- ============================================================
-- MuleSoo — admin face biometric templates (adaptive)
-- Ensures the table exists and has a created_at column so the
-- adaptive-learning login can keep the newest samples and prune old ones.
-- Safe to run multiple times.
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_face_descriptors (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label       TEXT,
  descriptor  JSONB,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE admin_face_descriptors ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE admin_face_descriptors ADD COLUMN IF NOT EXISTS label TEXT;

CREATE INDEX IF NOT EXISTS idx_face_descriptors_created_at ON admin_face_descriptors (created_at DESC);
