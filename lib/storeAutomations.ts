import type { AccentKey } from './storeProducts';

// The most-demanded AI automation from each of the 9 departments, surfaced in
// the store. Like the systems, these are booked through the chatbot widget
// (deposit via Paystack) — they're built for the client, not downloaded.
// Prices are quoted in ZAR, the agency's currency and what Paystack settles.
// The USD figure is kept only as a smaller secondary line for overseas clients,
// converted at R16.60 — the rate implied by the guide catalogue in storeProducts.

export interface AutomationPick {
  slug: string; // matches /ai-automation/[slug]
  name: string;
  category: string; // department
  emoji: string; // represents the system on its cover
  desc: string;
  fromPrice: number; // setup, USD — secondary figure
  fromPriceZAR: number; // setup, ZAR — what we lead with
  monthly: number; // monthly, USD — secondary figure
  monthlyZAR: number; // monthly, ZAR — what we lead with
  accent: AccentKey;
}

export const AUTOMATION_PICKS: AutomationPick[] = [
  {
    slug: 'hotel-booking-system',
    emoji: '🏨',
    name: 'AI Hotel Booking System',
    category: 'Booking & Hospitality',
    desc: 'Guests ask about rooms, check availability, book and get confirmations — automatically, 24/7.',
    fromPrice: 229,
    fromPriceZAR: 3800,
    monthly: 35,
    monthlyZAR: 580,
    accent: 'blue',
  },
  {
    slug: 'doctor-appointment-booking',
    emoji: '🩺',
    name: 'AI Doctor Appointment Booking',
    category: 'Healthcare & Wellness',
    desc: 'Schedules consultations, collects patient details and sends reminders that cut no-shows.',
    fromPrice: 199,
    fromPriceZAR: 3300,
    monthly: 29,
    monthlyZAR: 480,
    accent: 'green',
  },
  {
    slug: 'salon-booking-system',
    emoji: '💇',
    name: 'AI Salon Booking System',
    category: 'Beauty, Fitness & Lifestyle',
    desc: 'Books salon services, upsells add-ons and sends reminders so chairs stay full.',
    fromPrice: 169,
    fromPriceZAR: 2800,
    monthly: 25,
    monthlyZAR: 420,
    accent: 'purple',
  },
  {
    slug: 'restaurant-reservation-system',
    emoji: '🍽️',
    name: 'AI Restaurant Reservation System',
    category: 'Food, Restaurants & Catering',
    desc: 'Takes table reservations, manages the waitlist and answers menu questions instantly.',
    fromPrice: 169,
    fromPriceZAR: 2800,
    monthly: 25,
    monthlyZAR: 420,
    accent: 'gold',
  },
  {
    slug: 'real-estate-lead-bot',
    emoji: '🏡',
    name: 'AI Real Estate Lead Bot',
    category: 'Real Estate & Property',
    desc: 'Captures buyer/renter leads, qualifies serious ones and follows up fast — before competitors do.',
    fromPrice: 229,
    fromPriceZAR: 3800,
    monthly: 35,
    monthlyZAR: 580,
    accent: 'blue',
  },
  {
    slug: 'law-firm-intake-system',
    emoji: '⚖️',
    name: 'AI Law Firm Intake System',
    category: 'Legal, Finance & Professional',
    desc: 'Collects case details, screens clients and books consultations — professional intake on autopilot.',
    fromPrice: 229,
    fromPriceZAR: 3800,
    monthly: 35,
    monthlyZAR: 580,
    accent: 'gold',
  },
  {
    slug: 'tutoring-booking-system',
    emoji: '🎓',
    name: 'AI Tutoring Booking System',
    category: 'Education & Training',
    desc: 'Schedules tutoring sessions, handles rescheduling and keeps students and parents updated.',
    fromPrice: 169,
    fromPriceZAR: 2800,
    monthly: 25,
    monthlyZAR: 420,
    accent: 'green',
  },
  {
    slug: 'cleaning-booking-system',
    emoji: '🧹',
    name: 'AI Cleaning Booking System',
    category: 'Home Services & Local',
    desc: 'Books home and office cleaning jobs, confirms details and sends reminders automatically.',
    fromPrice: 169,
    fromPriceZAR: 2800,
    monthly: 25,
    monthlyZAR: 420,
    accent: 'purple',
  },
  {
    slug: 'invoice-reminder-system',
    emoji: '🧾',
    name: 'AI Invoice Reminder System',
    category: 'Logistics, Sales & Operations',
    desc: 'Chases unpaid invoices with polite, automatic reminders so you get paid faster.',
    fromPrice: 169,
    fromPriceZAR: 2800,
    monthly: 25,
    monthlyZAR: 420,
    accent: 'blue',
  },
];

// Shared value points shown on every automation card.
export const AUTOMATION_FEATURES = ['24/7 on web & WhatsApp', 'Books & captures leads', 'Takes deposits', 'Admin dashboard'];
