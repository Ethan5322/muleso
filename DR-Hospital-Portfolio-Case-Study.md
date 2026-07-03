# DR. Hospital
### AI-Powered Clinic & Hospital Management System
**MuleSoo Digital Solutions | Founder & Lead Developer: Muluken**

---

## Overview

DR. Hospital is a full-stack AI automation platform designed to run the entire patient journey for a clinic or small hospital — from the first QR code scan to the moment a patient walks out with their discharge summary. Where most booking systems digitize the front desk, DR. Hospital replaces the manual, repetitive parts of the clinical intake and administrative process with structured AI-driven workflows, while keeping every clinical decision in the hands of licensed doctors and nurses.

The system connects three groups who normally operate through disconnected tools — **patients, clinical staff, and management** — into one live, role-aware platform.

---

## The Problem

Clinics, especially smaller and mid-sized private practices, typically run on a patchwork of tools: a paper intake form, a WhatsApp group for reminders, a spreadsheet for the day's schedule, and a separate invoicing system. This creates friction at every step:

- Patients repeat their symptoms to three different people before seeing a doctor
- Front desk staff manually re-key handwritten intake forms
- Doctors start each consultation with a blank page instead of context
- Management has no real-time view of revenue, wait times, or no-show patterns
- Discharge is treated as "appointment closed" rather than a tracked, structured handoff

## The Solution

DR. Hospital automates the operational layer of a clinic without removing clinical judgment from the people qualified to exercise it.

**Patient-facing flow:**
QR scan → booking fee payment (Paystack) → personal information capture → AI-guided symptom & pain intake (structured pain mapping, severity, history, red-flag screening) → automatic queue placement → WhatsApp/SMS confirmations and live queue updates.

**Clinical flow:**
Doctors and nurses open a pre-organized AI summary of the patient's complaint instead of a raw intake form, capture vitals, document the consultation in a structured note, and issue a prescription — with AI offering to draft summaries that the clinician always reviews and approves before anything becomes part of the permanent record.

**Administrative flow:**
Front desk manages live scheduling, payments, and walk-ins. Management gets a real-time dashboard — revenue, doctor utilization, no-show rate, patient satisfaction — instead of end-of-month spreadsheet reconciliation.

**Discharge, done properly:**
Unlike most systems that simply close the appointment, DR. Hospital treats discharge as its own structured stage: an AI-drafted, patient-friendly summary of the diagnosis and instructions, a completion checklist (payment settled, prescription issued, follow-up booked), and an automated same-day satisfaction check-in.

---

## What Makes It Different

| | Typical clinic booking software | DR. Hospital |
|---|---|---|
| Intake | Static form, manually re-read by staff | AI-guided conversation → structured clinical data ready for the doctor |
| Emergency screening | None, or a vague chatbot suggestion | Deterministic, clinician-reviewable red-flag rule engine |
| QR code use | Check-in confirmation only | Booking, payment, queue tracking, and source attribution |
| Discharge | "Appointment closed" | Tracked stage with AI-drafted summary, checklist, and feedback loop |
| Channel | Requires a dedicated app | WhatsApp-first, works on budget Android devices and unreliable clinic Wi-Fi |
| Compliance | Often built around HIPAA/US insurance models | Built around POPIA, the National Health Act, and HPCSA confidentiality guidelines from day one |

The AI is deliberately scoped as an operational assistant, not a diagnostic authority — it structures information, flags risk patterns using clinician-defined rules, and drafts documentation, but every clinical decision requires a human sign-off. That boundary is enforced in the system design, not just the marketing copy.

---

## Tech Stack

- **Frontend/Framework:** Next.js (TypeScript), deployed on Vercel
- **Backend/Database:** Supabase (Postgres, Auth, Row-Level Security, Realtime, Storage)
- **AI Layer:** Anthropic Claude API — structured intake summarization, triage-support drafting, discharge summary generation
- **Payments:** Paystack, with Chapa as a secondary rail for Ethiopian market expansion
- **Communications:** WhatsApp (CallMeBot), SMS, and Brevo for transactional email
- **QR Infrastructure:** Server-generated QR codes with browser-based camera scanning
- **Version Control / CI:** GitHub → Vercel

---

## Role & Approach

As founder and sole developer at MuleSoo Digital Solutions, I led this project end-to-end: requirements definition, information architecture, data modeling, compliance research (POPIA special-personal-information rules, National Health Act confidentiality provisions), and the full build using Claude Code as an AI-assisted development environment. The system was scoped deliberately in phases — a single-clinic MVP first, with multi-branch, medical-aid integration, and inpatient workflows planned as later phases — to prioritize shipping a working product over building unused enterprise scope.

---

## Status

*In active development.* Currently building the Phase 1 MVP: public site, QR booking flow, AI symptom intake, and core admin/doctor dashboards for a single-clinic launch.

---

*MuleSoo Digital Solutions builds AI-powered booking systems, websites, and automation tools for service businesses across South Africa and beyond.*
