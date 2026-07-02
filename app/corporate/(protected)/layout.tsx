import { redirect } from 'next/navigation';
import { getCorpContext } from '@/lib/corp/auth';
import CorpShell from './CorpShell';

export const dynamic = 'force-dynamic';

export default async function ProtectedCorporateLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getCorpContext();
  if (!ctx) redirect('/corporate/login');

  return (
    <CorpShell admin={ctx.admin} email={ctx.email}>
      {children}
    </CorpShell>
  );
}
