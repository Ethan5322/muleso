import type { AccentKey } from './storeProducts';

// The most-demanded AI automation from each of the 9 departments, surfaced in
// the store. Like the systems, these are booked through the chatbot widget
// (deposit via Paystack) — they're built for the client, not downloaded.
// Prices reflect 2026 South-African market rates for AI booking/chatbot systems.

export interface AutomationPick {
  slug: string; // matches /ai-automation/[slug]
  name: string;
  category: string; // department
  desc: string;
  fromPrice: number; // setup, ZAR
  monthly: number; // monthly, ZAR
  accent: AccentKey;
}

export const AUTOMATION_PICKS: AutomationPick[] = [
  {
    slug: 'hotel-booking-system',
    name: 'AI Hotel Booking System',
    category: 'Booking & Hospitality',
    desc: 'Guests ask about rooms, check availability, book and get confirmations — automatically, 24/7.',
    fromPrice: 3900,
    monthly: 590,
    accent: 'blue',
  },
  {
    slug: 'doctor-appointment-booking',
    name: 'AI Doctor Appointment Booking',
    category: 'Healthcare & Wellness',
    desc: 'Schedules consultations, collects patient details and sends reminders that cut no-shows.',
    fromPrice: 3500,
    monthly: 490,
    accent: 'green',
  },
  {
    slug: 'salon-booking-system',
    name: 'AI Salon Booking System',
    category: 'Beauty, Fitness & Lifestyle',
    desc: 'Books salon services, upsells add-ons and sends reminders so chairs stay full.',
    fromPrice: 2900,
    monthly: 390,
    accent: 'purple',
  },
  {
    slug: 'restaurant-reservation-system',
    name: 'AI Restaurant Reservation System',
    category: 'Food, Restaurants & Catering',
    desc: 'Takes table reservations, manages the waitlist and answers menu questions instantly.',
    fromPrice: 2900,
    monthly: 390,
    accent: 'gold',
  },
  {
    slug: 'real-estate-lead-bot',
    name: 'AI Real Estate Lead Bot',
    category: 'Real Estate & Property',
    desc: 'Captures buyer/renter leads, qualifies serious ones and follows up fast — before competitors do.',
    fromPrice: 3900,
    monthly: 590,
    accent: 'blue',
  },
  {
    slug: 'law-firm-intake-system',
    name: 'AI Law Firm Intake System',
    category: 'Legal, Finance & Professional',
    desc: 'Collects case details, screens clients and books consultations — professional intake on autopilot.',
    fromPrice: 3900,
    monthly: 590,
    accent: 'gold',
  },
  {
    slug: 'tutoring-booking-system',
    name: 'AI Tutoring Booking System',
    category: 'Education & Training',
    desc: 'Schedules tutoring sessions, handles rescheduling and keeps students and parents updated.',
    fromPrice: 2900,
    monthly: 390,
    accent: 'green',
  },
  {
    slug: 'cleaning-booking-system',
    name: 'AI Cleaning Booking System',
    category: 'Home Services & Local',
    desc: 'Books home and office cleaning jobs, confirms details and sends reminders automatically.',
    fromPrice: 2900,
    monthly: 390,
    accent: 'purple',
  },
  {
    slug: 'invoice-reminder-system',
    name: 'AI Invoice Reminder System',
    category: 'Logistics, Sales & Operations',
    desc: 'Chases unpaid invoices with polite, automatic reminders so you get paid faster.',
    fromPrice: 2900,
    monthly: 390,
    accent: 'blue',
  },
];

// Shared value points shown on every automation card.
export const AUTOMATION_FEATURES = ['24/7 on web & WhatsApp', 'Books & captures leads', 'Takes deposits', 'Admin dashboard'];
