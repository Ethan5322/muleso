'use client';

import { useEffect, useState, useCallback } from 'react';
import { CAPABILITIES, type CorpAdmin } from '@/lib/corp/constants';
import { Loader2, ShieldCheck, Ban, RotateCcw, ScrollText, Trash2 } from 'lucide-react';
import RegisterAdmin from './RegisterAdmin';

interface Capability {
  department_admin_id: string;
  capability_key: string;
  enabled: boolean;
}
interface AuditLog {
  id: string;
  actor_id: string | null;
  action: string;
  target_admin_id: string | null;
  detail: Record<string, unknown>;
  created_at: string;
}

export default function ControlPanel() {
  const [admins, setAdmins] = useState<CorpAdmin[]>([]);
  const [caps, setCaps] = useState<Capability[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [nameById, setNameById] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [a, l] = await Promise.all([
      fetch('/corporate/api/admins').then((r) => r.json()),
      fetch('/corporate/api/audit').then((r) => r.json()),
    ]);
    setAdmins(a.admins ?? []);
    setCaps(a.capabilities ?? []);
    setLogs(l.logs ?? []);
    setNameById(l.nameById ?? {});
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const isOn = (adminId: string, key: string) =>
    caps.find((c) => c.department_admin_id === adminId && c.capability_key === key)?.enabled ?? false;

  const toggle = async (adminId: string, key: string, next: boolean) => {
    setBusy(`${adminId}:${key}`);
    // optimistic
    setCaps((prev) => {
      const found = prev.find((c) => c.department_admin_id === adminId && c.capability_key === key);
      if (found) return prev.map((c) => (c === found ? { ...c, enabled: next } : c));
      return [...prev, { department_admin_id: adminId, capability_key: key, enabled: next }];
    });
    const res = await fetch('/corporate/api/capability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ department_admin_id: adminId, capability_key: key, enabled: next }),
    });
    if (!res.ok) await load(); // revert on failure
    else load();
    setBusy(null);
  };

  const setStatus = async (adminId: string, status: 'active' | 'suspended') => {
    setBusy(`status:${adminId}`);
    await fetch('/corporate/api/admin-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ department_admin_id: adminId, status }),
    });
    await load();
    setBusy(null);
  };

  const deleteAdmin = async (adminId: string, name: string) => {
    if (!confirm(`Permanently delete ${name}? This removes their account and all their data.`)) return;
    setBusy(`del:${adminId}`);
    await fetch('/corporate/api/admin-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ department_admin_id: adminId }),
    });
    await load();
    setBusy(null);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-[#A8B2D0] p-8">
        <Loader2 className="animate-spin" size={18} /> Loading control panel…
      </div>
    );
  }

  const deptAdmins = admins.filter((a) => !a.is_super_admin);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-[#00C8FF]" size={22} />
          <h1 className="text-2xl font-bold font-sora">Super Admin Control Panel</h1>
        </div>
        <RegisterAdmin onDone={load} />
      </div>

      {/* Capability grid */}
      <section className="bg-[#0A0F1E] border border-[#1A2640] rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[#1A2640]">
          <h2 className="font-semibold font-sora text-sm">Capabilities</h2>
          <p className="text-xs text-[#6E7A91]">Toggle what each department admin is allowed to do.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-[#1A2640] text-[#6E7A91]">
                <th className="text-left p-3 font-semibold">Admin</th>
                {CAPABILITIES.map((c) => (
                  <th key={c.key} className="p-3 font-semibold text-center" title={c.hint}>
                    {c.label}
                  </th>
                ))}
                <th className="p-3 font-semibold text-center">Access</th>
              </tr>
            </thead>
            <tbody>
              {deptAdmins.length === 0 && (
                <tr>
                  <td colSpan={CAPABILITIES.length + 2} className="p-6 text-center text-[#6E7A91]">
                    No department admins yet. Use “Register new admin” above to add one.
                  </td>
                </tr>
              )}
              {deptAdmins.map((a) => (
                <tr key={a.id} className="border-b border-[#101a30] last:border-0">
                  <td className="p-3">
                    <div className="font-semibold text-[#F0F2FA] flex items-center gap-2">
                      {a.display_name || 'Unnamed'}
                      {a.is_visitor && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#E8B84B]/15 text-[#E8B84B] uppercase tracking-wide">
                          Visitor
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#6E7A91] flex items-center gap-2 mt-0.5">
                      <span>{a.department_name || `Dept ${a.department_id ?? ''}`}</span>
                      {a.status === 'suspended' && <span className="text-red-400 font-semibold">· suspended</span>}
                      {a.expires_at && (
                        <span className={new Date(a.expires_at) < new Date() ? 'text-red-400 font-semibold' : 'text-[#8A9AB8]'}>
                          · {new Date(a.expires_at) < new Date() ? 'Expired' : `Expires ${new Date(a.expires_at).toLocaleDateString()}`}
                        </span>
                      )}
                    </div>
                  </td>
                  {CAPABILITIES.map((c) => {
                    const on = isOn(a.id, c.key);
                    const key = `${a.id}:${c.key}`;
                    return (
                      <td key={c.key} className="p-3 text-center">
                        <button
                          type="button"
                          disabled={busy === key || a.status === 'suspended'}
                          onClick={() => toggle(a.id, c.key, !on)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-40 ${
                            on ? 'bg-[#00C8FF]' : 'bg-[#1A2640]'
                          }`}
                          title={`${on ? 'Disable' : 'Enable'} ${c.label} for ${a.display_name || 'admin'}`}
                        >
                          <span
                            className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                              on ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>
                    );
                  })}
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-3">
                      {a.status === 'active' ? (
                        <button
                          type="button"
                          disabled={busy === `status:${a.id}`}
                          onClick={() => setStatus(a.id, 'suspended')}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-red-400 hover:text-red-300 disabled:opacity-40"
                        >
                          <Ban size={14} /> Suspend
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={busy === `status:${a.id}`}
                          onClick={() => setStatus(a.id, 'active')}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#00FF88] hover:text-[#4dffab] disabled:opacity-40"
                        >
                          <RotateCcw size={14} /> Reactivate
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={busy === `del:${a.id}`}
                        onClick={() => deleteAdmin(a.id, a.display_name || 'this admin')}
                        title="Permanently delete"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#6E7A91] hover:text-red-400 disabled:opacity-40"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Audit log */}
      <section className="bg-[#0A0F1E] border border-[#1A2640] rounded-xl">
        <div className="px-5 py-3 border-b border-[#1A2640] flex items-center gap-2">
          <ScrollText size={16} className="text-[#E8B84B]" />
          <h2 className="font-semibold font-sora text-sm">Audit log</h2>
        </div>
        <div className="divide-y divide-[#101a30] max-h-96 overflow-y-auto">
          {logs.length === 0 && <p className="p-5 text-sm text-[#6E7A91]">No activity yet.</p>}
          {logs.map((log) => (
            <div key={log.id} className="px-5 py-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[#F0F2FA]">
                  <span className="font-semibold">{log.actor_id ? nameById[log.actor_id] || 'Super Admin' : 'System'}</span>{' '}
                  <span className="text-[#A8B2D0]">{prettyAction(log.action)}</span>{' '}
                  {log.target_admin_id && (
                    <span className="font-semibold">{nameById[log.target_admin_id] || 'an admin'}</span>
                  )}
                </span>
                <span className="text-xs text-[#6E7A91] whitespace-nowrap">
                  {new Date(log.created_at).toLocaleString()}
                </span>
              </div>
              {Object.keys(log.detail || {}).length > 0 && (
                <div className="text-xs text-[#6E7A91] mt-0.5 font-mono">{JSON.stringify(log.detail)}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function prettyAction(action: string): string {
  switch (action) {
    case 'capability_toggled':
      return 'changed a capability for';
    case 'account_suspended':
      return 'suspended';
    case 'account_reactivated':
      return 'reactivated';
    default:
      return action.replace(/_/g, ' ');
  }
}
