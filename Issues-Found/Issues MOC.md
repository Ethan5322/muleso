---
title: Issues MOC
type: moc
status: active
updated: 2026-08-17
tags: [moc, issues, mulesoo]
---

# Issues MOC

Map of Content for every fault found in the MuleSoo platform during the
August 2026 debugging sessions. Every note in this vault links back here, and
this note links to every one of them — there are no orphan notes.

Scope is the **MuleSoo project only**. [[Separated Projects]] covers the four
client codebases that were moved out.

---

## 🔴 Open — needs your action

| Issue | Severity | Why it is still open |
|---|---|---|
| [[Live API Keys Committed]] | Critical | Keys must be rotated by the account owner |
| [[Promised PDF Agreement Never Sent]] | Medium | Clients are told to expect a document that does not exist |
| [[Documentation Contradictions]] | Medium | Docs disagree with each other and with the code |

## ✅ Fixed — verified in production

| Issue | What it broke |
|---|---|
| [[2FA Codes Rejected As Invalid]] | Nobody could log into the admin panel |
| [[Admin Redirect Loop]] | "Admin panel is loading…" forever |
| [[Login Dropped Connection]] | Correct codes reported as invalid after a retry |
| [[Bookings Never Saved]] | Every chatbot booking silently lost |
| [[Booking Schema Mismatch]] | Second, independent cause of the same loss |
| [[Payment Link Never Sent]] | Clients had no way to pay after leaving the chat |
| [[Back Button Did Not Allow Editing]] | Clients could not correct an earlier answer mid-booking |

---

## How these connect

The [[Booking Payment Flow]] note is the through-line: four separate faults all
had to be cleared before a single client could book and pay. The admin faults
([[2FA Codes Rejected As Invalid]], [[Admin Redirect Loop]],
[[Login Dropped Connection]]) share a root cause pattern described in
[[Two Halves Disagreeing]].

## Related

- [[Separated Projects]]
- [[Verification Method]]
