import type { Guide } from './buildGuide';
import { makeMoneyChatbots } from './content/makeMoneyChatbots';
import { beginnerToProWebsite } from './content/beginnerToProWebsite';
import { buildProWebsiteClaudeCode } from './content/buildProWebsiteClaudeCode';
import { claudeCodeMcpMaster } from './content/claudeCodeMcpMaster';
import { githubWebsitePublishing } from './content/githubWebsitePublishing';
import { growthPlaybook } from './content/growthPlaybook';

/**
 * Slug → book content. A guide is deliverable only if it appears here.
 * Add more books over time; the store marks the rest "coming soon".
 */
export const GUIDES: Record<string, Guide> = {
  'make-money-ai-chatbots': makeMoneyChatbots,
  'beginner-to-pro-website': beginnerToProWebsite,
  'build-pro-website-claude-code': buildProWebsiteClaudeCode,
  'claude-code-mcp-master': claudeCodeMcpMaster,
  'github-website-publishing': githubWebsitePublishing,
  'mulesoo-growth-playbook': growthPlaybook,
};

export const getGuide = (slug: string): Guide | undefined => GUIDES[slug];
