'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, Plus, Trash2, Flag, CalendarDays, User, Building2, CheckCircle2, MessageSquare, Send } from 'lucide-react';
import { TASK_STATUS, TASK_PRIORITY, type CorpTask } from '@/lib/corp/constants';

interface TaskComment {
  id: string;
  task_id: string;
  author_id: string | null;
  body: string;
  created_at: string;
}

function TaskComments({ taskId }: { taskId: string }) {
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [nameById, setNameById] = useState<Record<string, string>>({});
  const [me, setMe] = useState('');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await fetch(`/corporate/api/tasks/comments?task_id=${taskId}`);
      if (r.ok) {
        const d = await r.json();
        setComments(d.comments ?? []);
        setNameById(d.nameById ?? {});
        setMe(d.me ?? '');
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    load();
  }, [load]);

  const send = async () => {
    if (!input.trim()) return;
    setSending(true);
    const r = await fetch('/corporate/api/tasks/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task_id: taskId, body: input }),
    });
    if (r.ok) {
      setInput('');
      await load();
    }
    setSending(false);
  };

  return (
    <div className="mt-3 pt-3 border-t border-[#1A2640]">
      {loading ? (
        <p className="text-[11px] text-[#6E7A91] flex items-center gap-1"><Loader2 className="animate-spin" size={11} /> Loading…</p>
      ) : (
        <div className="space-y-2 mb-2 max-h-56 overflow-y-auto">
          {comments.length === 0 ? (
            <p className="text-[11px] text-[#6E7A91]">No notes yet. Add the first progress note.</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className={`text-xs rounded-lg px-2.5 py-1.5 ${c.author_id === me ? 'bg-[#00C8FF]/5 border border-[#00C8FF]/20' : 'bg-[#0D1528] border border-[#1A2640]'}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-[#D4DAEA]">{c.author_id ? (nameById[c.author_id] || 'Admin') : 'Admin'}</span>
                  <span className="text-[10px] text-[#5A6B88]">{new Date(c.created_at).toLocaleString()}</span>
                </div>
                <p className="text-[#A8B2D0] mt-0.5 whitespace-pre-wrap">{c.body}</p>
              </div>
            ))
          )}
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), send())}
          placeholder="Add a progress note…"
          className="flex-1 bg-[#0D1528] border border-[#1A2640] rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#00C8FF]"
        />
        <button type="button" onClick={send} disabled={sending || !input.trim()} className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00C8FF] to-[#7B2FFF] text-white flex items-center justify-center disabled:opacity-50">
          {sending ? <Loader2 className="animate-spin" size={13} /> : <Send size={13} />}
        </button>
      </div>
    </div>
  );
}

interface Dept { id: number; name: string }
interface RosterAdmin { id: string; display_name: string; department_id: number | null }

interface Payload {
  tasks: CorpTask[];
  nameById: Record<string, string>;
  deptNameById: Record<number, string>;
  departments: Dept[];
  roster: RosterAdmin[];
  me: string;
  isSuper: boolean;
  departmentId: number | null;
}

const FILTERS = [
  { key: 'active', label: 'Active' },
  { key: 'mine', label: 'Mine' },
  { key: 'open', label: 'Open' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'done', label: 'Done' },
];

function priorityMeta(p: string) {
  return TASK_PRIORITY.find((x) => x.key === p) ?? TASK_PRIORITY[1];
}
function statusMeta(s: string) {
  return TASK_STATUS.find((x) => x.key === s) ?? TASK_STATUS[0];
}

export default function TaskBoard({ title = 'Work' }: { title?: string }) {
  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [openComments, setOpenComments] = useState<string | null>(null);

  // create form
  const [showForm, setShowForm] = useState(false);
  const [fTitle, setFTitle] = useState('');
  const [fDetail, setFDetail] = useState('');
  const [fPriority, setFPriority] = useState('normal');
  const [fDue, setFDue] = useState('');
  const [fDept, setFDept] = useState('');
  const [fAssignee, setFAssignee] = useState('');
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await fetch('/corporate/api/tasks');
      if (r.ok) setData(await r.json());
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, [load]);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.tasks.filter((t) => {
      if (filter === 'active') return t.status !== 'done';
      if (filter === 'mine') return t.assignee_id === data.me;
      return t.status === filter;
    });
  }, [data, filter]);

  const patch = async (task_id: string, patch: Record<string, unknown>) => {
    setBusy(task_id);
    setErr(null);
    const r = await fetch('/corporate/api/tasks/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task_id, ...patch }),
    });
    if (!r.ok) setErr((await r.json().catch(() => ({}))).error || 'Update failed');
    await load();
    setBusy(null);
  };

  const remove = async (task_id: string) => {
    setBusy(task_id);
    await fetch(`/corporate/api/tasks/update?id=${task_id}`, { method: 'DELETE' });
    await load();
    setBusy(null);
  };

  const create = async () => {
    if (!fTitle.trim()) return;
    setCreating(true);
    setErr(null);
    const r = await fetch('/corporate/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: fTitle,
        detail: fDetail,
        priority: fPriority,
        due_date: fDue || null,
        department_id: fDept || null,
        assignee_id: fAssignee || null,
      }),
    });
    if (r.ok) {
      setFTitle(''); setFDetail(''); setFPriority('normal'); setFDue(''); setFDept(''); setFAssignee('');
      setShowForm(false);
      await load();
    } else {
      setErr((await r.json().catch(() => ({}))).error || 'Could not create task');
    }
    setCreating(false);
  };

  if (loading) {
    return <p className="text-[#7A8BA8] text-sm flex items-center gap-2"><Loader2 className="animate-spin" size={15} /> Loading work…</p>;
  }
  if (!data) return <p className="text-[#7A8BA8] text-sm">Could not load the work board.</p>;

  const assigneesForDept = data.roster.filter((a) => !fDept || a.department_id === Number(fDept));

  return (
    <div className="text-white">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold font-sora flex items-center gap-2"><CheckCircle2 className="text-[#00C8FF]" size={22} /> {title}</h1>
          <p className="text-[#7A8BA8] text-sm mt-0.5">
            {data.isSuper ? 'Assign work to any department or person, and track it to done.' : 'Your department’s queue. Claim a task and move it to done.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-br from-[#00C8FF] to-[#7B2FFF] text-white text-sm font-semibold"
        >
          <Plus size={16} /> New task
        </button>
      </div>

      {showForm && (
        <div className="bg-[#0A0F1E] border border-[#1A2640] rounded-xl p-4 mb-4 space-y-3">
          <input
            value={fTitle}
            onChange={(e) => setFTitle(e.target.value)}
            placeholder="What needs doing? (task title)"
            className="w-full bg-[#0D1528] border border-[#1A2640] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00C8FF]"
          />
          <textarea
            value={fDetail}
            onChange={(e) => setFDetail(e.target.value)}
            placeholder="Details (optional)"
            rows={2}
            className="w-full bg-[#0D1528] border border-[#1A2640] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00C8FF]"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <select value={fPriority} onChange={(e) => setFPriority(e.target.value)} title="Priority" className="bg-[#0D1528] border border-[#1A2640] rounded-lg px-2 py-2 text-sm text-[#A8B2D0]">
              {TASK_PRIORITY.map((p) => <option key={p.key} value={p.key}>{p.label} priority</option>)}
            </select>
            <input type="date" value={fDue} onChange={(e) => setFDue(e.target.value)} title="Due date" className="bg-[#0D1528] border border-[#1A2640] rounded-lg px-2 py-2 text-sm text-[#A8B2D0]" />
            {data.isSuper && (
              <select value={fDept} onChange={(e) => { setFDept(e.target.value); setFAssignee(''); }} title="Department" className="bg-[#0D1528] border border-[#1A2640] rounded-lg px-2 py-2 text-sm text-[#A8B2D0]">
                <option value="">Any / unassigned dept</option>
                {data.departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            )}
            {data.isSuper && (
              <select value={fAssignee} onChange={(e) => setFAssignee(e.target.value)} title="Assignee" className="bg-[#0D1528] border border-[#1A2640] rounded-lg px-2 py-2 text-sm text-[#A8B2D0]">
                <option value="">Unassigned</option>
                {assigneesForDept.map((a) => <option key={a.id} value={a.id}>{a.display_name}</option>)}
              </select>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={create} disabled={creating || !fTitle.trim()} className="px-4 py-2 rounded-lg bg-[#00C8FF] text-black text-sm font-semibold disabled:opacity-50 inline-flex items-center gap-2">
              {creating && <Loader2 className="animate-spin" size={14} />} Create task
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-[#1A2640] text-sm text-[#A8B2D0]">Cancel</button>
          </div>
        </div>
      )}

      {err && <div className="text-xs text-red-400 mb-3">{err}</div>}

      <div className="flex items-center gap-1.5 mb-4 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${filter === f.key ? 'bg-gradient-to-br from-[#00C8FF] to-[#7B2FFF] text-white' : 'border border-[#1A2640] text-[#A8B2D0] hover:text-white'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-[#7A8BA8] py-12 border border-dashed border-[#1A2640] rounded-xl">
          No tasks here. {data.isSuper ? 'Assign the first one.' : 'Nothing assigned to your department yet.'}
        </p>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((t) => {
            const pm = priorityMeta(t.priority);
            const overdue = t.due_date && t.status !== 'done' && new Date(t.due_date) < new Date(new Date().toDateString());
            return (
              <div key={t.id} className={`bg-[#0A0F1E] border rounded-xl p-4 ${t.status === 'done' ? 'border-[#00FF88]/25 opacity-70' : 'border-[#1A2640]'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: pm.color + '22', color: pm.color }}>
                        <Flag size={9} className="inline mr-0.5" />{pm.label}
                      </span>
                      <h3 className={`font-semibold text-sm ${t.status === 'done' ? 'line-through text-[#7A8BA8]' : ''}`}>{t.title}</h3>
                    </div>
                    {t.detail && <p className="text-xs text-[#A8B2D0] mt-1 whitespace-pre-wrap">{t.detail}</p>}
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-[#6E7A91] flex-wrap">
                      {t.department_id != null && (
                        <span className="inline-flex items-center gap-1"><Building2 size={11} /> {data.deptNameById[t.department_id] || `Dept ${t.department_id}`}</span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <User size={11} /> {t.assignee_id ? (data.nameById[t.assignee_id] || 'Admin') : 'Unassigned'}
                      </span>
                      {t.due_date && (
                        <span className={`inline-flex items-center gap-1 ${overdue ? 'text-[#FF5C7C]' : ''}`}>
                          <CalendarDays size={11} /> {new Date(t.due_date).toLocaleDateString()}{overdue ? ' · overdue' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  {data.isSuper && (
                    <button type="button" onClick={() => remove(t.id)} disabled={busy === t.id} title="Delete task" className="text-[#6E7A91] hover:text-[#FF5C7C] shrink-0">
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                  {t.assignee_id !== data.me && t.status !== 'done' && (
                    <button type="button" onClick={() => patch(t.id, { action: 'claim' })} disabled={busy === t.id} className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#00C8FF]/15 text-[#00C8FF] hover:bg-[#00C8FF]/25">
                      Claim
                    </button>
                  )}
                  {TASK_STATUS.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => patch(t.id, { status: s.key })}
                      disabled={busy === t.id || t.status === s.key}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${t.status === s.key ? 'text-black' : 'text-[#A8B2D0] hover:text-white border border-[#1A2640]'}`}
                      style={t.status === s.key ? { background: s.color } : undefined}
                    >
                      {s.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setOpenComments((v) => (v === t.id ? null : t.id))}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold inline-flex items-center gap-1 border ${openComments === t.id ? 'bg-[#7B2FFF]/15 text-[#a78bfa] border-[#7B2FFF]/40' : 'text-[#A8B2D0] hover:text-white border-[#1A2640]'}`}
                  >
                    <MessageSquare size={11} /> Notes
                  </button>
                  {data.isSuper && (
                    <select
                      value={t.assignee_id || ''}
                      onChange={(e) => patch(t.id, { assignee_id: e.target.value || null })}
                      title="Reassign"
                      className="ml-auto bg-[#0D1528] border border-[#1A2640] rounded-md px-2 py-1 text-[11px] text-[#A8B2D0]"
                    >
                      <option value="">Unassigned</option>
                      {data.roster.map((a) => <option key={a.id} value={a.id}>{a.display_name}</option>)}
                    </select>
                  )}
                </div>

                {openComments === t.id && <TaskComments taskId={t.id} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
