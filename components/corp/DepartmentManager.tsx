'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Plus, Building2, Users, ClipboardList, Pencil, Check, X, EyeOff, Eye } from 'lucide-react';

interface Dept {
  id: number;
  name: string;
  description: string | null;
  active: boolean;
  headcount: number;
  open_tasks: number;
}

export default function DepartmentManager() {
  const [depts, setDepts] = useState<Dept[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // create
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [creating, setCreating] = useState(false);

  // inline edit
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const load = useCallback(async () => {
    try {
      const r = await fetch('/corporate/api/departments');
      if (r.ok) setDepts((await r.json()).departments ?? []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = async () => {
    if (!name.trim()) return;
    setCreating(true);
    setErr(null);
    const r = await fetch('/corporate/api/departments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description: desc }),
    });
    if (r.ok) {
      setName('');
      setDesc('');
      await load();
    } else {
      setErr((await r.json().catch(() => ({}))).error || 'Could not create department');
    }
    setCreating(false);
  };

  const save = async (id: number, patch: Record<string, unknown>) => {
    setErr(null);
    const r = await fetch('/corporate/api/departments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...patch }),
    });
    if (r.ok) {
      setEditId(null);
      await load();
    } else {
      setErr((await r.json().catch(() => ({}))).error || 'Could not update department');
    }
  };

  const startEdit = (d: Dept) => {
    setEditId(d.id);
    setEditName(d.name);
    setEditDesc(d.description || '');
  };

  if (loading) {
    return <p className="text-[#7A8BA8] text-sm flex items-center gap-2"><Loader2 className="animate-spin" size={15} /> Loading departments…</p>;
  }

  return (
    <div className="text-white max-w-3xl">
      <div className="mb-4">
        <h1 className="text-2xl font-bold font-sora flex items-center gap-2"><Building2 className="text-[#00C8FF]" size={22} /> Departments</h1>
        <p className="text-[#7A8BA8] text-sm mt-0.5">
          Name your departments and see each one’s team size and open workload. Auto-routing sends leads to a
          <b className="text-[#A8B2D0]"> Sales</b> dept and bookings to an <b className="text-[#A8B2D0]">Operations</b>/Support dept.
        </p>
      </div>

      {/* Create */}
      <div className="bg-[#0A0F1E] border border-[#1A2640] rounded-xl p-4 mb-5">
        <div className="grid sm:grid-cols-[1fr_1.4fr_auto] gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Department name (e.g. Sales)"
            className="bg-[#0D1528] border border-[#1A2640] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00C8FF]"
          />
          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="What this department handles (optional)"
            className="bg-[#0D1528] border border-[#1A2640] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00C8FF]"
          />
          <button
            type="button"
            onClick={create}
            disabled={creating || !name.trim()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-br from-[#00C8FF] to-[#7B2FFF] text-white text-sm font-semibold disabled:opacity-50"
          >
            {creating ? <Loader2 className="animate-spin" size={15} /> : <Plus size={16} />} Add
          </button>
        </div>
        {err && <p className="text-xs text-red-400 mt-2">{err}</p>}
      </div>

      {/* List */}
      {depts.length === 0 ? (
        <p className="text-center text-sm text-[#7A8BA8] py-10 border border-dashed border-[#1A2640] rounded-xl">
          No departments yet. Add your first one above.
        </p>
      ) : (
        <div className="space-y-2.5">
          {depts.map((d) => (
            <div key={d.id} className={`bg-[#0A0F1E] border rounded-xl p-4 ${d.active ? 'border-[#1A2640]' : 'border-[#1A2640]/50 opacity-60'}`}>
              {editId === d.id ? (
                <div className="space-y-2">
                  <input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-[#0D1528] border border-[#1A2640] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00C8FF]" />
                  <input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} placeholder="Description" className="w-full bg-[#0D1528] border border-[#1A2640] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00C8FF]" />
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => save(d.id, { name: editName, description: editDesc, active: d.active })} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#00FF88]/15 text-[#00FF88] text-xs font-semibold"><Check size={14} /> Save</button>
                    <button type="button" onClick={() => setEditId(null)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#1A2640] text-[#A8B2D0] text-xs"><X size={14} /> Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">{d.name}</h3>
                      <span className="text-[10px] text-[#6E7A91]">#{d.id}</span>
                      {!d.active && <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1A2640] text-[#7A8BA8]">inactive</span>}
                    </div>
                    {d.description && <p className="text-xs text-[#A8B2D0] mt-0.5">{d.description}</p>}
                    <div className="flex items-center gap-4 mt-2 text-[11px] text-[#6E7A91]">
                      <span className="inline-flex items-center gap-1"><Users size={12} /> {d.headcount} member{d.headcount === 1 ? '' : 's'}</span>
                      <span className="inline-flex items-center gap-1"><ClipboardList size={12} /> {d.open_tasks} open task{d.open_tasks === 1 ? '' : 's'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button type="button" onClick={() => startEdit(d)} title="Rename" className="p-1.5 rounded-lg text-[#8A9AB8] hover:text-white hover:bg-[#141d2e]"><Pencil size={15} /></button>
                    <button
                      type="button"
                      onClick={() => save(d.id, { name: d.name, description: d.description, active: !d.active })}
                      title={d.active ? 'Deactivate' : 'Reactivate'}
                      className="p-1.5 rounded-lg text-[#8A9AB8] hover:text-white hover:bg-[#141d2e]"
                    >
                      {d.active ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
