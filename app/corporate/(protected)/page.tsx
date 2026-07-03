import Link from 'next/link';
import { getCorpContext } from '@/lib/corp/auth';
import { createCorpServerClient } from '@/lib/corp/supabaseServer';
import { CAPABILITIES } from '@/lib/corp/constants';
import { MessageSquare, Hash, ShieldCheck, BadgeCheck, Check, CheckSquare } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CorporateDashboard() {
  const ctx = await getCorpContext();
  const admin = ctx!.admin;
  const supabase = await createCorpServerClient();

  // Load this admin's granted responsibilities (RLS lets them read their own).
  let enabledKeys: string[] = [];
  if (!admin.is_super_admin) {
    const { data } = await supabase
      .from('corp_admin_capabilities')
      .select('capability_key, enabled')
      .eq('department_admin_id', admin.id);
    enabledKeys = (data ?? []).filter((c) => c.enabled).map((c) => c.capability_key);
  }
  const responsibilities = CAPABILITIES.filter((c) => enabledKeys.includes(c.key));

  // Work at a glance (RLS scopes rows to this admin's department / assignments).
  const { data: myTasks } = await supabase.from('corp_tasks').select('status, assignee_id, due_date');
  const tasks = myTasks ?? [];
  const today = new Date(new Date().toDateString());
  const kpis = {
    open: tasks.filter((t) => t.status !== 'done').length,
    mine: tasks.filter((t) => t.assignee_id === admin.id && t.status !== 'done').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    overdue: tasks.filter((t) => t.status !== 'done' && t.due_date && new Date(t.due_date) < today).length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-sora">
          Welcome{admin.display_name ? `, ${admin.display_name}` : ''}
        </h1>
        <p className="text-[#A8B2D0] text-sm mt-1 flex flex-wrap items-center gap-2">
          {admin.is_super_admin ? (
            'You have Super Admin governance over the corporate workspace.'
          ) : (
            <>
              {admin.role_title && (
                <span className="inline-flex items-center gap-1 text-[#00C8FF] font-semibold">
                  <BadgeCheck size={14} /> {admin.role_title}
                </span>
              )}
              <span>· {admin.department_name || `Dept ${admin.department_id ?? ''}`}</span>
              {admin.is_visitor && <span className="text-[#E8B84B] font-semibold">· Read-only visitor</span>}
            </>
          )}
        </p>
      </div>

      {/* Work at a glance */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: admin.is_super_admin ? 'Open tasks' : 'Dept. open tasks', value: kpis.open, color: '#00C8FF' },
          { label: 'Assigned to me', value: kpis.mine, color: '#7B2FFF' },
          { label: 'In progress', value: kpis.inProgress, color: '#E8B84B' },
          { label: 'Overdue', value: kpis.overdue, color: kpis.overdue ? '#FF5C7C' : '#6E7A91' },
        ].map((k) => (
          <div key={k.label} className="bg-[#0A0F1E] border border-[#1A2640] rounded-xl p-4">
            <p className="text-3xl font-bold font-sora" style={{ color: k.color }}>{k.value}</p>
            <p className="text-[11px] text-[#A8B2D0] mt-1">{k.label}</p>
          </div>
        ))}
      </div>
      <Link
        href="/corporate/work"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-br from-[#00C8FF] to-[#7B2FFF] text-white text-sm font-semibold"
      >
        <CheckSquare size={16} /> Go to My Work
      </Link>

      {/* Responsibilities */}
      {!admin.is_super_admin && (
        <div className="bg-[#0A0F1E] border border-[#1A2640] rounded-xl p-5">
          <h2 className="font-semibold font-sora text-sm mb-3">Your responsibilities</h2>
          {responsibilities.length === 0 ? (
            <p className="text-sm text-[#6E7A91]">No responsibilities assigned yet. Ask the Super Admin to grant access.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
              {responsibilities.map((r) => (
                <div key={r.key} className="flex items-start gap-2 text-sm">
                  <Check size={15} className="text-[#00FF88] mt-0.5 flex-shrink-0" />
                  <span>
                    <span className="text-[#F0F2FA] font-medium">{r.label}</span>
                    <span className="text-[#6E7A91]"> — {r.hint}</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: MessageSquare, title: 'Private messages', desc: 'Direct, private admin-to-admin messaging.' },
          { icon: Hash, title: 'Team channel', desc: 'Share updates and @mention teammates.' },
          ...(admin.is_super_admin
            ? [{ icon: ShieldCheck, title: 'Control panel', desc: 'Register admins, capabilities, suspension & audit.' }]
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
    </div>
  );
}
