import type { Guide } from './buildGuide';
import { makeMoneyChatbots } from './content/makeMoneyChatbots';

/**
 * Slug → book content. A guide is deliverable only if it appears here.
 * Add more books over time; the store marks the rest "coming soon".
 */
export const GUIDES: Record<string, Guide> = {
  'make-money-ai-chatbots': makeMoneyChatbots,
};

export const getGuide = (slug: string): Guide | undefined => GUIDES[slug];
