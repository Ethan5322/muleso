import type { Metadata } from 'next';
import HomeClient from './HomeClient';

/**
 * Server shell so the homepage can declare its own self-referencing canonical.
 * The page body is a client component (animations, chatbot context), and client
 * components cannot export metadata. Title/description fall through to the root
 * layout's defaults — only the canonical is set here.
 */
export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function Page() {
  return <HomeClient />;
}
