'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, Plus, Trash2, Flag, CalendarDays, User, Building2, CheckCircle2, MessageSquare, Send, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { TASK_STATUS, TASK_PRIORITY, type CorpTask } from '@/lib/corp/constants';
import { downloadCSV } from '@/lib/csv';

/** Turn any failed response into the clearest sentence we can show the user. */
async function failureMessage(r: Response, fallback: string): Promise<string> {
  const d = await r.json().catch(() => ({} as { error?: string }));
  if (d?.error) return d.error;
  if (r.status === 401) return 'Your session expired. Sign in again to continue.';
  if (r.status === 403) return 'You do not have permission to do that.';
  return `${fallback} (HTTP ${r.status})`;
}

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
  const [roster, setRoster] = useState<{ id: string; display_name: string }[]>([]);
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
        setRoster(d.roster ?? []);
        setMe(d.me ?? '');
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  const mention = (nm: string) => setInput((v) => `${v}${v && !v.endsWith(' ') ? ' ' : ''}@${nm} `);

  useEffect(() => {
    load();
  }, [load]);

  // try/finally is load-bearing: without it a rejected fetch left `sending`
  // true forever and the send button stayed disabled until a page reload.
  const send = async () => {
    if (!input.trim()) return;
    setSending(true);
    try {
      const r = await fetch('/corporate/api/tasks/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId, body: input }),
      });
      if (r.ok) {
        setInput('');
        await load();
      } else {
        toast.error(await failureMessage(r, 'Could not post that note'));
      }
    } catch {
      toast.error('Network error — your note was not posted.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-[#1A2640]">
      {loading ? (
        <p className="text-[11px] text-[#8FA0BE] flex items-center gap-1"><Loader2 className="animate-spin" size={11} /> Loading…</p>
      ) : (
        <div className="space-y-2 mb-2 max-h-56 overflow-y-auto">
          {comments.length === 0 ? (
            <p className="text-[11px] text-[#8FA0BE]">No notes yet. Add the first progress note.</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className={`text-xs rounded-lg px-2.5 py-1.5 ${c.author_id === me ? 'bg-[#00C8FF]/5 border border-[#00C8FF]/20' : 'bg-[#0D1528] border border-[#1A2640]'}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-[#D4DAEA]">{c.author_id ? (nameById[c.author_id] || 'Admin') : 'Admin'}</span>
                  <span className="text-[10px] text-[#8FA0BE]">{new Date(c.created_at).toLocaleString()}</span>
                </div>
                <p className="text-[#A8B2D0] mt-0.5 whitespace-pre-wrap">{c.body}</p>
              </div>
            ))
          )}
        </div>
      )}
      <div className="flex items-center gap-2">
        {roster.length > 0 && (
          <select
            value=""
            onChange={(e) => e.target.value && mention(e.target.value)}
            title="Mention a teammate"
            className="bg-[#0D1528] border border-[#1A2640] rounded-lg px-1.5 py-1.5 text-xs text-[#00C8FF] max-w-[42px]"
          >
            <option value="">@</option>
            {roster.map((a) => (
              <option key={a.id} value={a.display_name}>{a.display_name}</option>
            ))}
          </select>
        )}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), send())}
          placeholder="Add a note… use @ to mention"
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

  // A mutation is in flight. The background poll must not overwrite the board
  // mid-write, or an optimistic change flickers back to its old value.
  const mutating = useRef(false);

  const load = useCallback(async (opts?: { background?: boolean }) => {
    if (opts?.background && mutating.current) return;
    try {
      const r = await fetch('/corporate/api/tasks');
      if (r.ok) {
        setData(await r.json());
        setErr(null);
      } else {
        setErr(await failureMessage(r, 'Could not load work'));
      }
    } catch {
      setErr('Network error loading work.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(() => load({ background: true }), 10000);
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

  /**
   * Apply a change to one task.
   *
   * `optimistic` paints the new value immediately so the click always produces
   * visible feedback, even while the round-trip to Supabase is in flight; it is
   * rolled back if the server rejects the change. The try/finally guarantees
   * `busy` clears — previously a rejected fetch threw straight out of here and
   * left every button on that row permanently disabled.
   */
  const patch = async (
    task_id: string,
    body: Record<string, unknown>,
    optimistic?: Partial<CorpTask>
  ) => {
    const snapshot = data;
    setBusy(task_id);
    setErr(null);
    mutating.current = true;

    if (optimistic) {
      setData((d) =>
        d ? { ...d, tasks: d.tasks.map((t) => (t.id === task_id ? { ...t, ...optimistic } : t)) } : d
      );
    }

    try {
      const r = await fetch('/corporate/api/tasks/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id, ...body }),
      });
      if (!r.ok) {
        if (snapshot) setData(snapshot); // roll the optimistic paint back
        const msg = await failureMessage(r, 'Update failed');
        setErr(msg);
        toast.error(msg);
        return;
      }
      await load();
    } catch {
      if (snapshot) setData(snapshot);
      const msg = 'Network error — that change was not saved.';
      setErr(msg);
      toast.error(msg);
    } finally {
      mutating.current = false;
      setBusy(null);
    }
  };

  const remove = async (task_id: string) => {
    if (!confirm('Delete this task? This cannot be undone.')) return;
    setBusy(task_id);
    mutating.current = true;
    try {
      const r = await fetch(`/corporate/api/tasks/update?id=${task_id}`, { method: 'DELETE' });
      if (!r.ok) {
        const msg = await failureMessage(r, 'Could not delete that task');
        setErr(msg);
        toast.error(msg);
        return;
      }
      toast.success('Task deleted');
      await load();
    } catch {
      toast.error('Network error — the task was not deleted.');
    } finally {
      mutating.current = false;
      setBusy(null);
    }
  };

  const create = async () => {
    if (!fTitle.trim()) return;
    setCreating(true);
    setErr(null);
    mutating.current = true;
    try {
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
        toast.success('Task created');
        await load();
      } else {
        const msg = await failureMessage(r, 'Could not create task');
        setErr(msg);
        toast.error(msg);
      }
    } catch {
      const msg = 'Network error — the task was not created.';
      setErr(msg);
      toast.error(msg);
    } finally {
      mutating.current = false;
      setCreating(false);
    }
  };

  const exportCsv = () => {
    if (!data) return;
    downloadCSV(
      `tasks-${new Date().toISOString().slice(0, 10)}.csv`,
      filtered.map((t) => ({
        title: t.title,
        status: t.status,
        priority: t.priority,
        department: t.department_id != null ? data.deptNameById[t.department_id] || `Dept ${t.department_id}` : '',
        assignee: t.assignee_id ? data.nameById[t.assignee_id] || '' : '',
        due_date: t.due_date || '',
        created: t.created_at.slice(0, 10),
        detail: t.detail || '',
      }))
    );
  };

  if (loading) {
    return <p className="text-[#7A8BA8] text-sm flex items-center gap-2"><Loader2 className="animate-spin" size={15} /> Loading work…</p>;
  }
  if (!data) {
    return (
      <div className="bg-[#0A0F1E] border border-[#1A2640] rounded-xl p-6 text-sm">
        <p className="text-[#FF5C7C] font-semibold mb-1">Could not load the work board.</p>
        <p className="text-[#A8B2D0]">{err || 'The corporate service did not respond.'}</p>
        <button type="button" onClick={() => { setLoading(true); load(); }} className="mt-3 px-3 py-1.5 rounded-lg bg-[#00C8FF] text-black text-xs font-semibold">
          Retry
        </button>
      </div>
    );
  }

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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={exportCsv}
            disabled={filtered.length === 0}
            title="Export the tasks shown to CSV"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#1A2640] text-[#A8B2D0] hover:text-white text-sm font-semibold disabled:opacity-40"
          >
            <Download size={15} /> Export
          </button>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-br from-[#00C8FF] to-[#7B2FFF] text-white text-sm font-semibold"
          >
            <Plus size={16} /> New task
          </button>
        </div>
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

      {err && (
        <div role="alert" className="flex items-start gap-2 text-xs text-[#FF5C7C] bg-[#FF5C7C]/10 border border-[#FF5C7C]/35 rounded-lg px-3 py-2 mb-3">
          <span className="flex-1">{err}</span>
          <button type="button" onClick={() => setErr(null)} className="text-[#FF5C7C]/70 hover:text-[#FF5C7C] font-bold" aria-label="Dismiss">
            ×
          </button>
        </div>
      )}

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
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-[#8FA0BE] flex-wrap">
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
                    <button type="button" onClick={() => remove(t.id)} disabled={busy === t.id} title="Delete task" className="text-[#8FA0BE] hover:text-[#FF5C7C] shrink-0">
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                  {busy === t.id && (
                    <Loader2 className="animate-spin text-[#00C8FF] shrink-0" size={13} aria-label="Saving" />
                  )}
                  {t.assignee_id !== data.me && t.status !== 'done' && (
                    <button
                      type="button"
                      onClick={() => patch(t.id, { action: 'claim' }, { assignee_id: data.me })}
                      disabled={busy === t.id}
                      className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#00C8FF]/15 text-[#00C8FF] hover:bg-[#00C8FF]/25 disabled:opacity-50"
                    >
                      Claim
                    </button>
                  )}
                  {/* Open / In progress / Blocked / Done. Each click repaints the
                      row immediately (optimistic) and only reverts if the server
                      rejects it, so pressing one is never a silent no-op. The
                      task's current status is the one disabled button — it is
                      filled with its status colour and says so on hover. */}
                  {TASK_STATUS.map((s) => {
                    const current = t.status === s.key;
                    return (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() =>
                          patch(
                            t.id,
                            { status: s.key },
                            {
                              status: s.key as CorpTask['status'],
                              completed_at: s.key === 'done' ? new Date().toISOString() : null,
                            }
                          )
                        }
                        disabled={busy === t.id || current}
                        aria-pressed={current}
                        title={current ? `Already ${s.label.toLowerCase()}` : `Move to ${s.label.toLowerCase()}`}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors disabled:cursor-not-allowed ${
                          current
                            ? 'text-black'
                            : 'text-[#C3CCE2] hover:text-white hover:border-[#00C8FF]/60 border border-[#243350] disabled:opacity-50'
                        }`}
                        style={current ? { background: s.color } : undefined}
                      >
                        {s.label}
                      </button>
                    );
                  })}
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
                      onChange={(e) =>
                        patch(t.id, { assignee_id: e.target.value || null }, { assignee_id: e.target.value || null })
                      }
                      disabled={busy === t.id}
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
