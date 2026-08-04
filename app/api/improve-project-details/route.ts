import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { isIPLocked, recordFailedAttempt, resetRateLimit } from '@/lib/rateLimit';

const hasApiKey = !!process.env.ANTHROPIC_API_KEY;
const client = hasApiKey ? new Anthropic() : null;

// Get client IP from request headers (set by Netlify / reverse proxies)
function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function POST(req: NextRequest) {
  const clientIP = getClientIP(req);

  // Check if IP is locked out
  const lockStatus = isIPLocked(clientIP);
  if (lockStatus.locked) {
    return NextResponse.json(
      { error: `Rate limit exceeded. Try again in ${lockStatus.remainingSeconds} seconds.` },
      { status: 429 }
    );
  }

  let projectDetails = '';
  let service = '';

  try {
    const data = await req.json();
    projectDetails = data.projectDetails || '';
    service = data.service || '';

    if (!projectDetails || projectDetails.trim().length === 0) {
      return NextResponse.json({
        improved: 'No project details provided.',
      });
    }

    // If no API key, return original details
    if (!hasApiKey || !client) {
      return NextResponse.json({ improved: projectDetails });
    }

    const response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 300,
      system: `You are a professional project brief writer for MuleSoo Digital Services.
Your task is to take raw client input and rewrite it as a professional, concise project brief.

Guidelines:
- Be concise (2-3 sentences max)
- Use professional language
- Focus on business outcomes and objectives
- Be specific about deliverables
- Keep it clear and actionable

Output ONLY the improved brief, nothing else. No quotes, no markdown, just plain text.`,
      messages: [
        {
          role: 'user',
          content: `Service: ${service}\n\nRaw Project Details: ${projectDetails}\n\nPlease rewrite this as a professional project brief.`,
        },
      ],
    });

    const improved =
      response.content[0].type === 'text'
        ? response.content[0].text.trim()
        : projectDetails;

    // Success: reset rate limit for this IP
    resetRateLimit(clientIP);
    return NextResponse.json({ improved });
  } catch (error) {
    console.error('Error improving project details:', error);

    // Record failed attempt (cost-abuse detection)
    recordFailedAttempt(clientIP);

    return NextResponse.json(
      { improved: projectDetails || 'Unable to process project details' },
      { status: 200 }
    );
  }
}
