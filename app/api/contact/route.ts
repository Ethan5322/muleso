import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, email, company, service, budget, details, source } = await req.json();

    // Validate required fields
    if (!name || !email || !service || !budget || !details) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In a real app, you would:
    // 1. Save to Supabase
    // 2. Send email via Resend API
    // 3. Handle webhooks

    console.log('Contact form submission:', {
      name,
      email,
      company,
      service,
      budget,
      details,
      source,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { message: 'Thank you for your enquiry. We will be in touch soon!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact error:', error);
    return NextResponse.json(
      { error: 'Failed to process contact form' },
      { status: 500 }
    );
  }
}
