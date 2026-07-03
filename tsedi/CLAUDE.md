# TSEDI CATERING & EVENTS — AI BOOKING CHATBOT

## Business Identity
Business Name: Tsedi Catering & Events
Owner: [Your Name]
Location: Pretoria, South Africa
Contact: [Your WhatsApp Number]
Type: Catering and event management service
Tagline: "Where Every Occasion Becomes Unforgettable"

## Project Purpose
Tsedi AI is a QR code that clients scan with their phone to open
a personal booking assistant in their browser. There is no website.
The AI collects all the booking information the owner needs, checks
the Google Calendar for availability, takes a deposit payment via
Stripe, and sends the client a verification code — all automatically,
24 hours a day, without the owner manually replying to every inquiry.
On event day the owner scans the client's code using the admin page
to verify and check them in.

## Brand Colors
- Primary Warm Red: #8B2500
- Gold Accent: #C8922A
- Cream Background: #FDF6EC
- Dark Text: #1A1A1A

## Information Tsedi AI Collects (IN THIS ORDER)
1. Full Name
2. Phone Number
3. WhatsApp Number (confirm if same as phone or different)
4. Gmail / Email Address
5. Event Type (Wedding / Birthday / Corporate / Private Party)
6. Number of Guests (approximate)
7. Special Requests (dietary, theme, specific dishes, extras)
8. Preferred Date
9. Preferred Time (between 9AM and 8PM)

## Tsedi AI Personality
- Warm, friendly, enthusiastic, professional
- Uses food and celebration emojis naturally
- Speaks in clear simple English
- Affirms each client response warmly before asking next question
- Never rushes the client
- Always addresses client by their first name after collecting it

## Booking Flow Logic
STEP 1: Collect all 9 fields above conversationally
STEP 2: Check Google Calendar for date + time availability
- If TAKEN: "I'm sorry [name], that time is already reserved!
  Here are the next available slots: [show 3 options as buttons]"
- If FREE: Show full booking summary and deposit button

STEP 3: Stripe deposit payment
- Wedding: R1500 deposit
- Birthday: R500 deposit
- Corporate: R800 deposit
- Private Party: R500 deposit

STEP 4: After payment success:
- Generate unique code: TSE-XXXXX (5 random uppercase chars)
- Save full booking to Supabase bookings table
- Send confirmation email via EmailJS with code and summary
- Show code on screen

STEP 5: Closing message (EXACT TEXT):
"Thank you [name]! We have received your booking request and
your deposit payment. Our team will contact you within 24
hours on WhatsApp to confirm all the final details.
We look forward to making your [event type] truly special!
Your verification code is [CODE] - please save it carefully."

## Closing Thank You (Always show this regardless of payment)
If client completes information but has not paid yet:
"Thank you [name]! We have received all your details.
Our team will contact you within 24 hours on WhatsApp
to confirm availability and arrange your deposit."

## Tech Stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Netlify Serverless Functions (netlify/functions/)
- Database: Supabase (bookings table)
- Calendar: Google Calendar API (service account)
- Payment: Stripe Checkout (South African Rand)
- Email: EmailJS
- Hosting: Netlify (free)
- QR Code: Generated separately, points to Netlify URL

## Supabase Table: bookings
id, full_name, phone, whatsapp, email, event_type,
guest_count, special_requests, booking_date, booking_time,
deposit_amount, payment_status, verification_code,
payment_intent_id, used (boolean), used_at, created_at

## Environment Variables Required
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
GOOGLE_CALENDAR_ID=xxx@group.calendar.google.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
GOOGLE_SERVICE_ACCOUNT_EMAIL=xxx@xxx.iam.gserviceaccount.com
VITE_EMAILJS_SERVICE_ID=service_xxx
VITE_EMAILJS_TEMPLATE_ID=template_xxx
VITE_EMAILJS_PUBLIC_KEY=xxx
ADMIN_PASSWORD=TsediAdmin2025!

## Code Quality Rules
- Mobile-first responsive design (most clients use phones)
- All API calls use async/await with try/catch error handling
- Show loading spinner during calendar check and payment
- All user inputs must be validated before proceeding
- Never show raw error messages to clients
- Use warm, friendly error messages matching Tsedi personality
