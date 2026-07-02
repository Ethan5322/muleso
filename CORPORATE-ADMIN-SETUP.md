# MuleSoo Corporate Admin — Setup & Operations

An **isolated, additive** module at `/corporate`. It does not touch the existing
`/admin` panel, its auth, or its tables. Kill-switch: set `corp_config.module_enabled`
to `false` to disable instantly (no redeploy).

## One-time setup

### 1. Run the schema (one file)
Supabase → SQL Editor → run **`migrations/corporate_admin.sql`** once.
(Creates all `corp_` tables, RLS, the secrets table, staff-number function, and
enables realtime. Safe to re-run.)

### 2. Create YOUR Super Admin account
Supabase → **Authentication → Users → Add user** (your email + password).
Copy your **User UID**.

### 3. Register yourself as Super Admin
Edit **`migrations/corporate_admin_seed.sql`** — paste your UID + email — and run it.

### 4. Environment (Vercel)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`  ← **required** for registration, ID cards, and face/code/QR login

### 5. Log in and add your team
Go to **`/corporate`** → sign in with your password → **Control Panel →
Register new admin**. For each admin you:
- enter name / email / password / department / capabilities,
- **capture their face + 3:4 ID photo** with the camera,
- click **Register & issue ID** → then **Download ID card** (PDF with photo,
  staff number, verification code, and a login QR).

Department admins are created entirely from the panel — no manual Supabase steps.

## How admins log in (any of these)
- **Password** (email + password you set)
- **Face** — biometric scan matched to their enrolment
- **Verification code** — the code printed on their ID card
- **QR** — scan the ID-card QR (opens `/corporate/qr-login`)

## Super Admin powers
- **Capabilities grid** — grant/revoke per admin (checked server-side + RLS)
- **Suspend / reactivate** — blocks access without deleting data or touching passwords
- **Delete** — permanently removes an admin + all their data
- **Audit log** — every capability change, suspension, registration and deletion

## Privacy
- DMs: Postgres RLS returns a message only to its sender or recipient.
- Super Admin: DM **metadata only** (never the body).
- Login secrets (verification code, QR token, face descriptor) live in
  `corp_admin_secrets` — reachable only by the server (service-role), never by
  other admins.
