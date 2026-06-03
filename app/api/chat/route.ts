import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await client.messages.create({
      model: 'claude-opus-4-1-20250805',
      max_tokens: 300,
      system: `You are Soo, the friendly AI assistant for MuleSoo Digital Services in Pretoria, South Africa.
Your role: Help potential clients understand MuleSoo's services and pricing.

SERVICES AND PRICING:
- Website Design: R3,500 (Starter) | R7,500 (Business) | R15,000+ (Enterprise)
- AI Chatbots: R2,500 | R4,500 | R8,000+
- Logo Design: R800 | R1,800 | R3,500+
- QR Codes: R300 | R600 | R1,200+
- Custom Email Setup: R400 | R800 | R1,500+
- PDF Guides (for sale): R99 – R499

RULES:
- Be warm, professional, and concise (max 3 sentences per reply)
- Always end with a question to continue the conversation
- If they are ready to buy: direct them to fill the contact form at /contact
- Never make up information not listed above`,
      messages: messages,
    });

    const textContent = response.content[0];
    const reply = textContent.type === 'text' ? textContent.text : 'Sorry, I encountered an error. Please try again.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
