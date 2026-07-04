-- ============================================================
-- MuleSoo — add Paystack deposit-payment columns to bookings
-- Safe to run multiple times (IF NOT EXISTS on every column).
-- ============================================================

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status   TEXT DEFAULT 'unpaid';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS deposit_amount   NUMERIC;      -- ZAR (rands, not cents)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_reference TEXT;        -- Paystack transaction reference
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS amount_paid      NUMERIC;      -- ZAR actually received
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS paid_at          TIMESTAMPTZ;

-- Helpful index for the admin dashboard's "paid vs unpaid" filtering
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings (payment_status);
