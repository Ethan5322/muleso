import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const {
      fullName,
      phoneNumber,
      nationality,
      service,
      usageType,
      timeline,
    } = await req.json();

    // Validate required fields
    if (!fullName || !phoneNumber || !nationality || !service || !usageType || !timeline) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In a production app, you would:
    // 1. Save to Supabase
    // 2. Send email via Resend API
    // 3. Log to analytics

    console.log('Chatbot booking submission:', {
      fullName,
      phoneNumber,
      nationality,
      service,
      usageType,
      timeline,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        message: 'Booking received! Ethan will contact you within 2 hours.',
        booking: {
          fullName,
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
