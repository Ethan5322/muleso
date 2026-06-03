import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, service } = await req.json();

    if (!name || !phone || !email || !service) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const leadMessage = `
📞 NEW LEAD FROM CHATBOT:
Name: ${name}
Phone: ${phone}
Email: ${email}
Service: ${service}
Time: ${new Date().toLocaleString()}

👉 Ready to follow up!
    `.trim();

    // Send to WhatsApp via Twilio (if configured)
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      try {
        const formData = new FormData();
        formData.append('From', `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`);
        formData.append('To', `whatsapp:+27781500968`);
        formData.append('Body', leadMessage);

        await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
          {
            method: 'POST',
            headers: {
              Authorization: `Basic ${Buffer.from(
                `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
              ).toString('base64')}`,
            },
            body: formData,
          }
        );
      } catch (whatsappError) {
        console.error('WhatsApp send error:', whatsappError);
        // Continue even if WhatsApp fails
      }
    }

    // Also send via email
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: 'chatbot@mulesoo.com',
            to: 'hello@mulesoo.com',
            subject: `🤖 New Chatbot Lead: ${name}`,
            html: `
<h2>New Lead from Chatbot</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Phone:</strong> ${phone}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Service Interested:</strong> ${service}</p>
<p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
<hr>
<p>👉 Contact them on WhatsApp at +${phone.replace(/\D/g, '')}</p>
            `,
          }),
        });
      } catch (emailError) {
        console.error('Email send error:', emailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process lead' },
      { status: 500 }
    );
  }
}
