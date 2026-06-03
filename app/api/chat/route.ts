import { NextRequest, NextResponse } from 'next/server';

function generateResponse(userMessage: string): string {
  if (!userMessage || typeof userMessage !== 'string') {
    return `I'm Soo, MuleSoo's AI assistant! 👋 I can help you with:\n\n✅ Website Design (R3,500-R15,000+)\n✅ AI Chatbots (R2,500-R8,000+)\n✅ Logo Design (R800-R3,500+)\n✅ QR Codes, Email Setup, PDF Guides\n\nWhat service interests you most?`;
  }

  const msg = userMessage.toLowerCase().trim();

  // Who are you
  if (msg.includes('who') || msg.includes('purpose') || msg.includes('you are')) {
    return `I'm Soo, MuleSoo's AI assistant! 👋\n\nI help answer questions about our services, pricing, and how we work. We're a world-class tech agency in Pretoria, South Africa, building premium websites, chatbots, logos, and digital solutions.\n\nWhat would you like to know about?`;
  }

  // Website Design
  if (msg.includes('website') || msg.includes('web design') || msg.includes('web')) {
    return `I'd love to help with your website! 🌐\n\nWe offer three tiers:\n• Starter (R3,500): 3 pages, SEO basics, 2-week turnaround\n• Business (R7,500): 6+ pages, animations, AI chatbot included, MOST POPULAR\n• Enterprise (R15,000+): Unlimited pages, 3D effects, e-commerce\n\nWhat's your budget and timeline?`;
  }

  // Chatbot
  if (msg.includes('chatbot') || msg.includes('bot') || msg.includes('ai assistant')) {
    return `Great question! Our AI chatbots work 24/7 to handle your customer service. 🤖\n\n• Starter (R2,500): Basic bot with lead collection\n• Business (R4,500): WhatsApp integration + logging\n• Enterprise (R8,000+): Custom workflows & API integrations\n\nWhat kind of support would your business need?`;
  }

  // Logo Design
  if (msg.includes('logo') || msg.includes('branding') || msg.includes('brand identity')) {
    return `Perfect for standing out! 🎨\n\n• Starter (R800): 2 concepts, 2 revisions\n• Business (R1,800): 4 concepts, unlimited revisions\n• Enterprise (R3,500+): Full branding package with guidelines\n\nWould you like multiple concepts?`;
  }

  // QR Codes
  if (msg.includes('qr')) {
    return `Custom branded QR codes with analytics! 📱\n\n• Starter (R300): Basic branded QR\n• Business (R600): With tracking analytics\n• Enterprise (R1,200+): Multiple codes + campaign tracking\n\nWhat would you use these for?`;
  }

  // Email Setup
  if (msg.includes('email') || msg.includes('@')) {
    return `Professional email setup builds instant credibility! 📧\n\n• Starter (R400): Setup only\n• Business (R800): Setup + 1 month management\n• Enterprise (R1,500+): Full email marketing suite\n\nHow many team members need email?`;
  }

  // PDF Guides / Store
  if (msg.includes('pdf') || msg.includes('guide') || msg.includes('course') || msg.includes('store')) {
    return `We sell expert guides! 📚\n\n• Claude Code Master Guide (R299) - 52 pages\n• n8n Automation Bible (R249) - 44 pages\n• Chatbot Business Blueprint (R199) - 38 pages\n• Netlify Deployment Guide (R149) - 28 pages\n\nWhich one interests you?`;
  }

  // Pricing
  if (msg.includes('price') || msg.includes('cost') || msg.includes('how much')) {
    return `Our pricing is transparent! 💰\n\nWebsites: R3,500 - R15,000+\nChatbots: R2,500 - R8,000+\nLogos: R800 - R3,500+\nQR Codes: R300 - R1,200+\nEmail: R400 - R1,500+\nPDF Guides: R149 - R299\n\nWhat catches your interest?`;
  }

  // Process
  if (msg.includes('process') || msg.includes('how do you work') || msg.includes('timeline')) {
    return `Our process is simple & fast: ⚡\n\n1️⃣ Discovery - We learn your goals\n2️⃣ Design - You approve mockups (5 days)\n3️⃣ Build - We develop using world-class tech\n4️⃣ Launch - Live in weeks, not months\n\nReady to start?`;
  }

  // Contact / Get started
  if (msg.includes('contact') || msg.includes('start') || msg.includes('book') || msg.includes('ready') || msg.includes('interested')) {
    return `Awesome! Let's get your project started. 🚀\n\nI just need your contact info so Ethan can follow up on WhatsApp within 2 hours.\n\nWhat's your full name?`;
  }

  // Default friendly response
  return `I'm Soo, MuleSoo's AI assistant! 👋 I can help you with:\n\n✅ Website Design (R3,500-R15,000+)\n✅ AI Chatbots (R2,500-R8,000+)\n✅ Logo Design (R800-R3,500+)\n✅ QR Codes, Email Setup, PDF Guides\n✅ Our process & timeline\n✅ Pricing & packages\n\nWhat service interests you most?`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body?.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({
        reply: 'Please send a message!'
      });
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || !lastMessage.content) {
      return NextResponse.json({
        reply: 'I didn\'t catch that. Could you try again?'
      });
    }

    const userText = String(lastMessage.content).trim();
    const reply = generateResponse(userText);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({
      reply: 'I\'m having a moment. Please try again!'
    });
  }
}
