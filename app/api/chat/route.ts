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
    return `We build stunning, fast websites that convert visitors into clients! 🌐\n\nWe can create everything from simple 3-page sites to complex e-commerce platforms with 3D animations.\n\n💬 For custom pricing based on your specific needs, reach out to Ethan:\n📧 Email: mulukenendashaw68@gmail.com\n📱 WhatsApp: +27 68 852 9333\n\nWhat features would your website need?`;
  }

  // Chatbot
  if (msg.includes('chatbot') || msg.includes('bot') || msg.includes('ai assistant')) {
    return `Our AI chatbots work 24/7 to handle customer service, answer FAQs, and collect leads! 🤖\n\nWe can integrate with WhatsApp, your website, and Telegram.\n\n💬 For custom pricing, contact Ethan directly:\n📧 Email: mulukenendashaw68@gmail.com\n📱 WhatsApp: +27 68 852 9333\n\nWhat kind of support would your business need?`;
  }

  // Logo Design
  if (msg.includes('logo') || msg.includes('branding') || msg.includes('brand identity')) {
    return `We create professional logos and brand identities that make your business unforgettable! 🎨\n\nFrom concept to final files, we deliver world-class design.\n\n💬 For pricing and packages, contact Ethan:\n📧 Email: mulukenendashaw68@gmail.com\n📱 WhatsApp: +27 68 852 9333\n\nDescribe your business vision!`;
  }

  // QR Codes
  if (msg.includes('qr')) {
    return `Custom branded QR codes with built-in analytics! 📱\n\nPerfect for marketing campaigns, product packaging, and event tracking.\n\n💬 For pricing, reach out:\n📧 Email: mulukenendashaw68@gmail.com\n📱 WhatsApp: +27 68 852 9333\n\nWhat would you use these for?`;
  }

  // Email Setup
  if (msg.includes('email') || msg.includes('@')) {
    return `Professional @yourdomain.com email setup builds instant credibility! 📧\n\nWe handle everything from setup to ongoing management.\n\n💬 For custom packages, contact Ethan:\n📧 Email: mulukenendashaw68@gmail.com\n📱 WhatsApp: +27 68 852 9333\n\nHow many team members need email?`;
  }

  // PDF Guides / Store
  if (msg.includes('pdf') || msg.includes('guide') || msg.includes('course') || msg.includes('store')) {
    return `We sell expert digital guides on Claude Code, automation, chatbots, and deployment! 📚\n\nYou can purchase them instantly from our store at a fixed price.\n\n💬 For pricing on custom guides or bulk orders:\n📧 Email: mulukenendashaw68@gmail.com\n📱 WhatsApp: +27 68 852 9333`;
  }

  // Pricing
  if (msg.includes('price') || msg.includes('cost') || msg.includes('how much')) {
    return `Great question! Pricing depends on your specific needs and project scope. 💰\n\nWe offer custom quotes for websites, chatbots, logos, email setup, and more.\n\n💬 Let's discuss your requirements:\n📧 Email: mulukenendashaw68@gmail.com\n📱 WhatsApp: +27 68 852 9333\n\nOr use the contact form below! 👇`;
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
