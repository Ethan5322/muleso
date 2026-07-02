import { getCorpContext } from '@/lib/corp/auth';
import { MessageSquare, Hash, ShieldCheck, LayoutDashboard } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CorporateDashboard() {
  const ctx = await getCorpContext();
  const admin = ctx!.admin;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-sora">
          Welcome{admin.display_name ? `, ${admin.display_name}` : ''}
        </h1>
        <p className="text-[#A8B2D0] text-sm mt-1">
          {admin.is_super_admin
            ? 'You have Super Admin governance over the corporate workspace.'
            : `Your department: ${admin.department_name || `Dept ${admin.department_id ?? ''}`}`}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: LayoutDashboard, title: 'Department dashboard', desc: 'Your operational view — coming next phase.' },
          { icon: MessageSquare, title: 'Private messages', desc: 'Direct, private admin-to-admin messaging.' },
          { icon: Hash, title: 'Team channel', desc: 'Share what you are building with the team.' },
          ...(admin.is_super_admin
            ? [{ icon: ShieldCheck, title: 'Control panel', desc: 'Capabilities, suspension & audit log.' }]
            : []),
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.title} className="bg-[#0A0F1E] border border-[#1A2640] rounded-xl p-5">
              <span className="w-10 h-10 rounded-lg bg-[#00C8FF]/10 text-[#00C8FF] flex items-center justify-center mb-3">
                <Icon size={20} />
              </span>
              <h3 className="font-semibold font-sora text-sm">{c.title}</h3>
              <p className="text-xs text-[#A8B2D0] mt-1">{c.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-[#0A0F1E] border border-[#1A2640] rounded-xl p-5 text-sm text-[#A8B2D0]">
        <p className="font-semibold text-[#F0F2FA] mb-1">Foundation is live ✅</p>
        Your login, isolated workspace and database security are in place. Messaging, the team
        channel and (for Super Admin) the control panel are being built next, phase by phase.
      </div>
    </div>
  );
}
