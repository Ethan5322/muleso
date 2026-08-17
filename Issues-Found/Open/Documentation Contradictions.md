---
title: Documentation Contradictions
type: issue
status: open
severity: medium
found: 2026-08-17
tags: [issue, documentation, open]
---

# Documentation Contradictions

Surfaced by the graphify extraction pass over the 37 project documents. These
are not code faults — they are documents disagreeing with each other and with
the running system, which is how a wrong instruction gets followed later.

## 1. Two different admin passwords

| Document | Password given |
|---|---|
| `ADMIN_SUMMARY.txt` | `MuleSoo2024!` |
| `ADMIN_PANEL_GUIDE.md`, all login-journey docs | `M53223344m.&.M` |

Only one can be current. Anyone following the wrong document is locked out and
burns [[Login Dropped Connection]] attempts finding out.

## 2. Security features documented as absent

`ADMIN_SUMMARY.txt` and `ADMIN_QUICK_REFERENCE.md` both list 2FA, audit logs
and rate limiting as **"✗ NO (optional)"**.

`IMPLEMENTATION_COMPLETE.md` and `2FA_INTEGRATION_SUMMARY.md` describe all
three as built and live — and 2FA demonstrably *is* live, since it is what
[[2FA Codes Rejected As Invalid]] was about.

The older documents predate Phase 1 but carry no superseded marker.

## 3. Next.js version

| Source | Version |
|---|---|
| `CLAUDE.md` (build instructions) | Next.js **14** App Router |
| `PROJECT_STATUS_REPORT.md` | Next.js **16.2.7** with Turbopack |
| Actual build output | **16.2.7** |

`AGENTS.md` separately warns that the installed version has breaking changes
compared to model training data — which makes the stale `CLAUDE.md` mandate
actively risky for anyone generating code from it.

## Suggested fix

Add a `superseded-by:` line to the frontmatter of the outdated docs, or move
them into an `Archive/` folder. Correct the Next.js version in `CLAUDE.md`,
since that file is read by every AI session as authoritative.

## Related

- [[Live API Keys Committed]] — the same doc set breaks its own key-handling rule
- [[Verification Method]]

---
Back to [[Issues MOC]]
