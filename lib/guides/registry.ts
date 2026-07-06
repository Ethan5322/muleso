import type { Guide } from './buildGuide';
import { makeMoneyChatbots } from './content/makeMoneyChatbots';
import { beginnerToProWebsite } from './content/beginnerToProWebsite';

/**
 * Slug → book content. A guide is deliverable only if it appears here.
 * Add more books over time; the store marks the rest "coming soon".
 */
export const GUIDES: Record<string, Guide> = {
  'make-money-ai-chatbots': makeMoneyChatbots,
  'beginner-to-pro-website': beginnerToProWebsite,
};

export const getGuide = (slug: string): Guide | undefined => GUIDES[slug];
