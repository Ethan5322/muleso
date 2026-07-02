import { getCorpContext } from '@/lib/corp/auth';
import ControlPanel from './ControlPanel';

export const dynamic = 'force-dynamic';

export default async function ControlPage() {
  const ctx = await getCorpContext();

  if (!ctx?.admin.is_super_admin) {
    return (
      <div className="bg-[#0A0F1E] border border-[#1A2640] rounded-xl p-8 text-center">
        <h1 className="text-xl font-bold font-sora mb-2">Restricted</h1>
        <p className="text-[#A8B2D0] text-sm">Only the Super Admin can access the control panel.</p>
      </div>
    );
  }

  return <ControlPanel />;
}
