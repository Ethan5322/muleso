import { NextRequest, NextResponse } from 'next/server';

// Knowledge base for the chatbot
const KNOWLEDGE_BASE = {
  services: {
    website: {
      name: 'Website Design',
      tiers: {
        starter: { price: 3500, features: ['3 pages', 'Mobile responsive', 'Basic SEO', 'Contact form', '2-week delivery'] },
        business: { price: 7500, features: ['6+ pages', 'Advanced animations', 'AI chatbot included', 'Full SEO', '3-week delivery'], popular: true },
        enterprise: { price: 15000, features: ['Unlimited pages', '3D animations', 'E-commerce ready', 'Monthly maintenance', 'Priority support'] }
      },
      description: 'Stunning, fast websites built to convert visitors into clients'
    },
    chatbot: {
      name: 'AI Chatbots',
      tiers: {
        starter: { price: 2500, features: ['Basic bot', 'Trained on your info', 'Lead collection'] },
        business: { price: 4500, features: ['WhatsApp integration', 'Advanced conversations', 'Lead logging'] },
        enterprise: { price: 8000, features: ['Custom workflows', 'API integrations', 'Advanced automation'] }
      },
      description: '24/7 intelligent assistants that handle your customer service'
    },
    logo: {
      name: 'Logo Design',
      tiers: {
        starter: { price: 800, features: ['2 concepts', '2 revisions'] },
        business: { price: 1800, features: ['4 concepts', 'Unlimited revisions', 'Multiple formats'] },
        enterprise: { price: 3500, features: ['Full branding', 'Color palette', 'Brand guidelines'] }
      },
      description: 'Professional brand identity that makes you unforgettable'
    },
    qr: {
      name: 'QR Code Design',
      tiers: {
        starter: { price: 300, features: ['Basic branded QR'] },
        business: { price: 600, features: ['Branded QR', 'Tracking analytics'] },
        enterprise: { price: 1200, features: ['Multiple QRs', 'Campaign tracking'] }
      },
      description: 'Custom branded QR codes with built-in analytics'
    },
    email: {
      name: 'Custom Email Setup',
      tiers: {
        starter: { price: 400, features: ['Email setup'] },
        business: { price: 800, features: ['Setup', '1 month management'] },
        enterprise: { price: 1500, features: ['Full email suite', 'Marketing tools'] }
      },
      description: 'Professional @yourdomain.com email that builds credibility'
    },
    pdf: {
      name: 'PDF Guides',
      products: [
        { title: 'Claude Code Master Guide', price: 299, pages: 52, desc: 'AI web development' },
        { title: 'n8n Automation Bible', price: 249, pages: 44, desc: 'Workflow automation' },
        { title: 'Chatbot Business Blueprint', price: 199, pages: 38, desc: 'Start a chatbot agency' },
        { title: 'Netlify Deployment Guide', price: 149, pages: 28, desc: 'Deployment guide' }
      ]
    }
  }
};

function generateResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();

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
    return `Perfect for standing out! 🎨\n\n• Starter (R800): 2 concepts, 2 revisions\n• Business (R1,800): 4 concepts, unlimited revisions\n• Enterprise (R3,500+): Full branding package with guidelines\n\nWould you like multiple concepts to choose from?`;
  }

  // QR Codes
  if (msg.includes('qr') || msg.includes('qr code')) {
    return `Custom branded QR codes with analytics! 📱\n\n• Starter (R300): Basic branded QR\n• Business (R600): With tracking analytics\n• Enterprise (R1,200+): Multiple codes + campaign tracking\n\nWhat would you use these for?`;
  }

  // Email Setup
  if (msg.includes('email') || msg.includes('@yourdomain')) {
    return `Professional email setup builds instant credibility! 📧\n\n• Starter (R400): Setup only\n• Business (R800): Setup + 1 month management\n• Enterprise (R1,500+): Full email marketing suite\n\nHow many team members need email accounts?`;
  }

  // PDF Guides / Store
  if (msg.includes('pdf') || msg.includes('guide') || msg.includes('course') || msg.includes('store')) {
    return `We sell expert guides! 📚\n\n• Claude Code Master Guide (R299) - 52 pages\n• n8n Automation Bible (R249) - 44 pages\n• Chatbot Business Blueprint (R199) - 38 pages\n• Netlify Deployment Guide (R149) - 28 pages\n\nWhich one interests you?`;
  }

  // Pricing
  if (msg.includes('price') || msg.includes('cost') || msg.includes('how much')) {
    return `Our pricing is transparent and flexible! 💰\n\nWebsites: R3,500 - R15,000+\nChatbots: R2,500 - R8,000+\nLogos: R800 - R3,500+\nQR Codes: R300 - R1,200+\nEmail: R400 - R1,500+\nPDF Guides: R149 - R299\n\nAll include support and revisions. What catches your interest?`;
  }

  // Process
  if (msg.includes('process') || msg.includes('how do you work') || msg.includes('timeline')) {
    return `Our process is simple & fast: ⚡\n\n1️⃣ Discovery - We learn your goals\n2️⃣ Design - You approve mockups (5 days)\n3️⃣ Build - We develop using world-class tech\n4️⃣ Launch - Live in weeks, not months\n\nMost projects complete in 2-3 weeks. Ready to start?`;
  }

  // About / Who
  if (msg.includes('who') || msg.includes('about') || msg.includes('team')) {
    return `MuleSoo Digital Services - based in Pretoria, South Africa 🇿🇦\n\nWe're a world-class tech agency building premium websites, chatbots, and digital tools for African businesses. Our founder Ethan has built 12+ projects across restaurants, law firms, e-commerce, and events.\n\nWhat would you like to build?`;
  }

  // Contact / Get started
  if (msg.includes('contact') || msg.includes('start') || msg.includes('book') || msg.includes('ready') || msg.includes('interested')) {
    return `Awesome! Let's get your project started. 🚀\n\nI just need your contact info so Ethan can follow up with you on WhatsApp within 2 hours.\n\nWhat's your full name?`;
  }

  // Default friendly response
  return `I'm Soo, MuleSoo's AI assistant! 👋 I can help you with:\n\n✅ Website Design (R3,500-R15,000+)\n✅ AI Chatbots (R2,500-R8,000+)\n✅ Logo Design (R800-R3,500+)\n✅ QR Codes, Email Setup, PDF Guides\n✅ Our process & timeline\n✅ Pricing & packages\n\nWhat service interests you most?`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ reply: 'Please send a message!' });
    }

    const lastMessage = messages[messages.length - 1];
    const userText = String(lastMessage?.content || '');

    if (!userText.trim()) {
      return NextResponse.json({ reply: 'Please send a message!' });
    }

    const reply = generateResponse(userText);
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Chat error:', error?.message || error);
    return NextResponse.json({
      reply: 'Sorry, I encountered an error. Please try again.'
    });
  }
}
