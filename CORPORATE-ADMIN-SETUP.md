# MuleSoo Corporate Admin — Setup & Operations

An **isolated, additive** module at `/corporate`. It does not touch the existing
`/admin` panel, its auth, or its tables. Kill-switch: set `corp_config.module_enabled`
to `false` to disable instantly (no redeploy).

## One-time setup

### 1. Run the schema
Supabase → SQL Editor → run each file once:
1. `migrations/corporate_admin.sql` — tables + RLS (safe to re-run)
2. `migrations/corporate_admin_realtime.sql` — instant delivery (optional; UI polls otherwise)

### 2. Create login accounts
Supabase → **Authentication → Users → Add user** (email + password) for:
- You (Super Admin)
- Up to 5 department admins

Copy each **User UID**.

### 3. Register them
Edit `migrations/corporate_admin_seed.sql`, replace the placeholder UUIDs/names
with the real ones, delete rows you don't need, and run it.

### 4. Environment
In Vercel, ensure these are set (you already have the first two):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`  ← needed for the control panel + DM-metadata oversight

## Using it
- Sign in at **`/corporate`** (redirects to `/corporate/login`).
- **Super Admin** → Control Panel: toggle each admin's capabilities, suspend/reactivate
  (never touches passwords), and review the audit log.
- **Everyone** → Messages (private, DB-enforced), Team Channel (threaded, reactions, pins).

## Capabilities
`can_send_dm`, `can_post_channel`, `can_view_department_reports`,
`can_manage_bookings`, `can_export_data`. Checked server-side on every action.

## Privacy model
- DMs: Postgres RLS returns a message only to its sender or recipient — enforced by
  the database, not just the UI.
- Super Admin sees DM **metadata only** by default (that a message exists, between
  whom, when) — never the body. (Chosen policy.)

## To add a WhatsApp/email ping (optional, later)
Baseline notifications are in-app realtime badges. External pings can reuse the
existing CallMeBot / Resend integrations once per-admin contact details are added.
