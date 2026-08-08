import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { verifyRecaptchaToken } from '@/lib/captcha';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hello@mulesoo.com';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, service, budget, details, source, website, recaptchaToken } = body;

    // Honeypot: real users never fill this hidden field
    if (website) {
      return NextResponse.json({ message: 'Thank you for your enquiry.' }, { status: 200 });
    }

    // Validation
    if (!name || !email || !service || !budget || !details) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // Optional bot check (only enforced when reCAPTCHA is configured).
    // Fail-OPEN: if verification errors out (misconfig, network), never lose a
    // genuine enquiry — only reject on a clear low-score bot signal.
    if (process.env.RECAPTCHA_SECRET_KEY && recaptchaToken) {
      try {
        const result = await verifyRecaptchaToken(recaptchaToken);
        if (result.success && result.score < 0.3) {
          return NextResponse.json({ error: 'Verification failed. Please try again.' }, { status: 400 });
        }
      } catch (e) {
        console.error('reCAPTCHA check errored (continuing):', e);
      }
    }

    // Store the lead — check Supabase's returned error (it does NOT throw), so
    // a schema problem is logged loudly instead of silently dropping the lead.
    try {
      const { error: insertError } = await supabaseAdmin.from('leads').insert({
        name,
        email,
        company: company || null,
        service,
        budget,
        details,
        source: source || null,
        status: 'New',
        created_at: new Date().toISOString(),
      });
      if (insertError) {
        console.error('Lead insert error (continuing to alert owner):', insertError.message, insertError.details || '');
      }
    } catch (e) {
      console.error('Lead save threw (continuing):', e);
    }

    // Auto-create a Sales follow-up task for the corporate team (best-effort).
    try {
      const { autoTaskFromLead } = await import('@/lib/corp/autoTask');
      await autoTaskFromLead({ name, email, service, budget, details });
    } catch (e) {
      console.error('Lead auto-task failed (continuing):', e);
    }

    // Alert the owner instantly (WhatsApp + Telegram) — don't block the response.
    try {
      const { sendLeadNotification } = await import('@/lib/sendWhatsAppMessage');
      await sendLeadNotification(name, service, email, {
        company,
        budget,
        projectDetails: details,
        source,
      });
    } catch (e) {
      console.error('Lead alert failed (continuing):', e);
    }

    // Deliver the lead by email
    if (resend) {
      const html = `
        <div style="font-family:Arial,sans-serif;color:#0A0F1E">
          <h2 style="color:#7FB3FF">New enquiry from www.mulesoo.com</h2>
          <table style="border-collapse:collapse">
            <tr><td style="padding:4px 12px"><b>Name</b></td><td style="padding:4px 12px">${escapeHtml(name)}</td></tr>
            <tr><td style="padding:4px 12px"><b>Email</b></td><td style="padding:4px 12px">${escapeHtml(email)}</td></tr>
            <tr><td style="padding:4px 12px"><b>Company</b></td><td style="padding:4px 12px">${escapeHtml(company || '—')}</td></tr>
            <tr><td style="padding:4px 12px"><b>Service</b></td><td style="padding:4px 12px">${escapeHtml(service)}</td></tr>
            <tr><td style="padding:4px 12px"><b>Budget</b></td><td style="padding:4px 12px">${escapeHtml(budget)}</td></tr>
            <tr><td style="padding:4px 12px"><b>Source</b></td><td style="padding:4px 12px">${escapeHtml(source || '—')}</td></tr>
          </table>
          <p style="margin-top:12px"><b>Details:</b><br/>${escapeHtml(details).replace(/\n/g, '<br/>')}</p>
        </div>`;

      // Email is a bonus channel — the lead is already saved + the owner
      // already alerted on WhatsApp, so an email failure must NOT fail the
      // request (that would tell the client it didn't go through when it did).
      try {
        const { error } = await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: ADMIN_EMAIL,
          replyTo: email,
          subject: `New enquiry: ${name} — ${service}`,
          html,
        });
        if (error) console.error('Resend error (lead already saved + alerted):', error);
      } catch (e) {
        console.error('Resend threw (lead already saved + alerted):', e);
      }
    } else {
      // No email provider configured — log so the lead isn't silently dropped
      console.warn('RESEND_API_KEY not set. Lead received but not emailed:', { name, email, service });
    }

    return NextResponse.json(
      { message: 'Thank you for your enquiry. We will be in touch within 2 hours.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
