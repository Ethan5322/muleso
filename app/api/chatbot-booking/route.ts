import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { fullName, phoneNumber, nationality, service, usageType } = await req.json();

    // Validate required fields
    if (!fullName || !phoneNumber || !service || !usageType || !nationality) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Log booking (in production: save to Supabase)
    const bookingData = {
      fullName,
      phoneNumber,
      nationality,
      service,
      usageType,
      timestamp: new Date().toISOString(),
      source: 'chatbot',
    };

    console.log('Chatbot booking submission:', bookingData);

    // Send email notification (implement with Resend API or email service)
    // await sendNotificationEmail(bookingData);

    // In production, you would:
    // 1. Save to Supabase database
    // 2. Send email to hello@mulesoo.com
    // 3. Send auto-reply to client
    // 4. Create CRM entry

    return NextResponse.json(
      {
        message: 'Booking received. Ethan will contact you shortly.',
        data: bookingData,
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
