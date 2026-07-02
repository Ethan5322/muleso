import { isCorpModuleEnabled } from '@/lib/corp/auth';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'MuleSoo Corporate',
  robots: { index: false, follow: false },
};

export default async function CorporateRootLayout({ children }: { children: React.ReactNode }) {
  const enabled = await isCorpModuleEnabled();

  if (!enabled) {
    return (
      <div className="min-h-screen bg-[#050810] text-[#F0F2FA] flex items-center justify-center px-6 text-center">
        <div>
          <h1 className="text-2xl font-bold font-sora mb-2">Corporate module is disabled</h1>
          <p className="text-[#A8B2D0]">This area has been switched off by the Super Admin.</p>
        </div>
      </div>
    );
  }

  return <div className="min-h-screen bg-[#050810] text-[#F0F2FA]">{children}</div>;
}
