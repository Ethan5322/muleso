# CLAUDE.md — MuleSoo Corporate Admin Layer
### Multi-Department Admin Panels + Internal Messaging + Super Admin Control
**Site: mulesoo.vercel.app | MuleSoo Digital Solutions**

> This file specifies an ADDITIVE module for the existing MuleSoo website admin system. It does not replace, refactor, or modify the current main admin panel, its auth, its routes, or its data. Read the "Non-Negotiable Constraint" section first — it governs every decision below.

---

## 0. Non-Negotiable Constraint — Read This First

The current MuleSoo site (mulesoo.vercel.app) already has a working main admin panel. This module must be built as a **parallel, isolated system** that plugs in alongside it:

- **New database tables only.** Nothing in this spec alters, renames, or drops any existing table, column, or RLS policy. The only touchpoint with existing infrastructure is a read-only foreign key reference to `auth.users.id` (Supabase Auth's own user table), which every Supabase project already has.
- **New route tree only.** Everything lives under `/admin/corporate/*` or similar, separate from whatever routes the existing admin panel uses. The existing admin panel keeps working identically whether this module is on or off.
- **Feature-flagged.** A single system-level flag (`corporate_admin_module_enabled`) can disable the entire module instantly without a redeploy or any risk to the live site or the existing admin panel.
- **Claude Code should confirm existing admin panel routes/tables before writing any migration**, to guarantee zero collision.

---

## 1. What this module is

A **5-department admin structure** sitting above/alongside the current single main admin panel, with:
1. Five independent department-admin accounts, each with their own panel view.
2. A **private direct-messaging system** between any two admins — addressed explicitly by recipient, not readable by other admins.
3. A **shared team channel** where all department admins post updates, ideas, and what they're currently building — visible to all admins.
4. A **Super Admin control panel** that can grant/revoke specific capabilities per department admin, and suspend an admin's access entirely — without ever touching another admin's password or personal credentials.

This is the corporate governance layer for how MuleSoo's own team (or department heads, if you bring on staff/contractors per department) coordinates internally through the platform itself, instead of scattered WhatsApp/email threads.

---

## 2. Identity & Roles

| Role | Description |
|---|---|
| **Super Admin** | You (Muluken). Full visibility into capability grants, audit log, and account suspension power. Does not automatically get DM content access — see §6. |
| **Department Admin 1–5** | Independent Supabase Auth accounts. Each tagged with a fixed `department_id` (1–5) used for routing, filtering, and default panel scoping. Assign real department names when known (e.g. Sales, Development, Client Support, Marketing, Finance) — placeholder numbers are fine until then. |

**Independence rule:** every department admin's login (email/password or magic link) is their own Supabase Auth identity. No admin — including Super Admin — can view another admin's password (Supabase Auth never stores or exposes plaintext credentials to anyone). Super Admin's authority is over *capabilities and account status*, not credentials.

---

## 3. Data Model

```
department_admins
  id (uuid, references auth.users.id)
  department_id (int, 1–5)
  department_name (text)
  display_name (text)
  status (enum: active | suspended)
  created_at

admin_capabilities
  id
  department_admin_id (references department_admins.id)
  capability_key (text)  -- e.g. 'can_send_dm', 'can_post_channel', 'can_view_reports', 'can_manage_bookings'
  enabled (boolean, default false)
  updated_by (references department_admins.id, nullable — Super Admin's id)
  updated_at

direct_messages
  id
  sender_id (references department_admins.id)
  recipient_id (references department_admins.id)
  body (text)
  read_at (timestamp, nullable)
  created_at

team_channels
  id
  name (text)  -- e.g. '#general' — build for multiple channels even if only one ships at launch
  created_at

team_channel_messages
  id
  channel_id (references team_channels.id)
  sender_id (references department_admins.id)
  parent_message_id (references team_channel_messages.id, nullable — enables threaded replies)
  body (text)
  created_at

message_reactions
  id
  message_id (references team_channel_messages.id)
  department_admin_id (references department_admins.id)
  emoji (text)

admin_audit_log
  id
  actor_id (references department_admins.id)
  action (text)  -- e.g. 'capability_toggled', 'account_suspended', 'account_reactivated'
  target_admin_id (references department_admins.id, nullable)
  detail (jsonb)
  created_at
```

---

## 4. Private Messaging (Admin-to-Admin)

**How the addressing works, done properly:**
- Compose screen: sender selects the **recipient from a dropdown of the other 4 department admins** — never a freeform "type Admin 4 in the subject" text field. Freeform addressing is exactly how a message ends up visible to the wrong person; a structured recipient field is the sophisticated, correct way to do this.
- The message is written directly to `direct_messages` with `sender_id` and `recipient_id` set from authenticated session + dropdown selection.

**How privacy is actually enforced (this is the important part):**
- Supabase Row Level Security policy on `direct_messages`:
  ```sql
  create policy "dm_visibility" on direct_messages
  for select using (
    auth.uid() = sender_id or auth.uid() = recipient_id
  );
  ```
- This means the *database itself* refuses to return a row to anyone who isn't the sender or recipient — even if there's a bug in the frontend, Admin 1 or Admin 3 cannot query their way into Admin 2 → Admin 4's conversation. This is meaningfully stronger than hiding it in the UI, which is not real privacy.
- Realtime delivery via a Supabase Realtime channel scoped to the recipient's own user id, so messages arrive instantly.
- Unread badge count + read receipts (`read_at` timestamp set when the recipient opens the thread).

---

## 5. Shared Team Channel (Idea Sharing / "What I'm Building")

- One default channel at launch (`#general` or `#team-updates`), schema supports multiple channels from day one so adding `#dev-updates` or `#client-projects` later is a config change, not a rebuild.
- RLS policy: any active department admin can `select`/`insert` into `team_channel_messages` for channels they're a member of.
- Threaded replies via `parent_message_id` — keeps "here's what I'm building" conversations organized instead of a flat scroll.
- Lightweight emoji reactions (👍 💡 🔥) for quick acknowledgment without message clutter.
- Optional: pin important messages (a `pinned` boolean) so key decisions don't get buried.

---

## 6. Super Admin Control Panel

**Capability switchboard:**
A grid UI — 5 department admins (rows) × capability list (columns) — each cell a toggle. Example capabilities to seed:
- `can_send_dm`
- `can_post_channel`
- `can_view_department_reports`
- `can_manage_bookings` (or whatever operational actions apply per department)
- `can_export_data`

Toggling writes to `admin_capabilities.enabled` and is checked server-side on every relevant action (never trust a cached client-side permission state) — both via RLS where possible and an explicit server check in the API route as a second layer, since some actions (like "can this admin send a DM at all") are behavioral gates rather than pure row-visibility gates.

**Account suspension:**
Super Admin can flip a department admin's `status` to `suspended`, which:
- Immediately blocks new logins (checked at session validation)
- Does **not** delete their message history or data
- Is fully separate from capability toggles — suspension is "this person cannot use the system right now," capability toggles are "this person can use the system but not do X."

**Audit trail:**
Every capability change and every suspension/reactivation writes a row to `admin_audit_log` — who did it, to whom, when, what changed. This is what makes Super Admin's control provable and reviewable later, not just a claim.

**DM content visibility — a deliberate policy decision, not a default:**
Recommend Super Admin sees DM *metadata* only by default (that a message was sent, between whom, when — useful for oversight of activity/responsiveness) but **not the message body**, preserving the actual privacy purpose of the DM feature. If full content oversight is genuinely needed (e.g. for a dispute or compliance reason), that should be a logged, explicit "break-glass" action — not standing access. Confirm with Muluken which policy to implement before building this piece, since it's a real trust decision for whoever uses the 5 admin seats.

---

## 7. Notifications

- Baseline: in-app real-time badge via Supabase Realtime (new DM, new channel message, @mention).
- Optional: WhatsApp (CallMeBot) or email (Brevo) ping when a DM/mention arrives and the admin hasn't been active in the panel recently — reuses existing MuleSoo integrations, no new service needed.

---

## 8. UI Surfaces to Build

1. **Department Admin login** — separate from (or federated with, but not shared-credential with) the existing main admin login.
2. **Department Admin dashboard** — their own department's operational view (whatever their department manages on the existing site) + a persistent messaging sidebar (DMs + channel).
3. **DM inbox** — conversation list, thread view, recipient-dropdown compose.
4. **Team channel view** — threaded feed, reactions, pinned messages.
5. **Super Admin control panel** — capability grid, suspend/reactivate controls, audit log viewer.

---

## 9. Build Order for Claude Code

1. Confirm existing admin panel's table names and route structure first — do not proceed with migrations until this is verified to avoid any collision.
2. Migrate the schema in §3 as new, isolated Supabase tables + RLS policies.
3. Build Super Admin capability grid + audit log first — this is the governance backbone everything else checks against.
4. Build department admin auth + dashboards (scoped, independent logins).
5. Build DM system (§4) — recipient-dropdown compose, RLS-enforced privacy, realtime delivery.
6. Build team channel (§5) — threaded messages, reactions.
7. Wire notifications (§7) last, once the core messaging works reliably.
8. Confirm the DM-content visibility policy decision (§6) with Muluken before finalizing Super Admin's oversight scope.
