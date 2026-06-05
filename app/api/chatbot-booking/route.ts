import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

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

    // Save to Supabase
    const { data, error } = await supabase
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
      return NextResponse.json(
        { error: 'Failed to save booking' },
        { status: 500 }
      );
    }

    console.log('Chatbot booking saved to Supabase:', {
      fullName,
      email,
      phoneNumber,
      service,
      verificationCode,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        message: 'Booking received! Ethan will contact you within 2 hours.',
        verificationCode: verificationCode,
        booking: {
          fullName,
          email,
          phoneNumber,
          service,
          timeline,
        }
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
