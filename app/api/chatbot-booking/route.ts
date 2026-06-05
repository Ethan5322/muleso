import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendBookingConfirmation, sendAdminNotification } from '@/lib/sendWhatsAppMessage';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const hasSupabase = !!supabaseUrl && !!supabaseKey;
const supabase = hasSupabase ? createClient(supabaseUrl, supabaseKey) : null;

function generateVerificationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
    if ((i + 1) % 4 === 0 && i !== 11) code += '-';
  }
  return code;
}

export async function POST(req: NextRequest) {
  try {
    const {
      fullName,
      phoneNumber,
      nationality,
      service,
      usageType,
      timeline,
      clientID,
      clientIDType,
      email,
      company,
      budget,
      contactMethod,
      projectDetails,
    } = await req.json();

    // Validate required fields
    if (!fullName || !phoneNumber || !nationality || !service || !usageType || !timeline) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();

    // Save to Supabase if configured
    if (hasSupabase && supabase) {
      const { error } = await supabase
        .from('bookings')
        .insert({
          name: fullName,
          email: email || '',
          phone: phoneNumber,
          country: nationality,
          company: company || null,
          service: service,
          budget: budget || null,
          timeline: timeline,
          contact_method: contactMethod || null,
          project_description: projectDetails || '',
          verification_code: verificationCode,
          client_id: clientID || null,
          client_id_type: clientIDType || null,
          status: 'Pending',
        })
        .select();

      if (error) {
        console.error('Supabase error:', error);
      }
    }

    console.log('Chatbot booking received:', {
      fullName,
      email,
      phoneNumber,
      service,
      verificationCode,
      timestamp: new Date().toISOString(),
    });

    // Send WhatsApp confirmation to customer
    try {
      await sendBookingConfirmation(phoneNumber, fullName, service, verificationCode);
      console.log('✅ WhatsApp confirmation sent to customer');
    } catch (error) {
      console.error('⚠️ Failed to send WhatsApp confirmation:', error);
      // Don't fail the entire request if WhatsApp fails
    }

    // Send admin notification
    try {
      await sendAdminNotification(fullName, service, verificationCode, budget || 'Not specified');
      console.log('✅ Admin notification sent');
    } catch (error) {
      console.error('⚠️ Failed to send admin notification:', error);
    }

    return NextResponse.json(
      {
        message: 'Booking received! Check your WhatsApp for confirmation. Ethan will contact you within 2 hours.',
        verificationCode: verificationCode,
        booking: {
          fullName,
          email,
          phoneNumber,
          service,
          timeline,
        },
        whatsappSent: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Chatbot booking error:', error);
    return NextResponse.json(
      { error: 'Failed to process booking' },
      { status: 500 }
    );
  }
}
