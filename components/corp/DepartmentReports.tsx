'use client';

import { useEffect, useState } from 'react';
import { Loader2, BarChart3, Users, AlertTriangle, CheckCircle2, Inbox, Download } from 'lucide-react';
import { downloadCSV } from '@/lib/csv';

interface DeptReport {
  id: number;
  name: string;
  headcount: number;
  open: number;
  in_progress: number;
  blocked: number;
  done: number;
  overdue: number;
  total: number;
  completion: number;
}
interface Totals {
  departments: number;
  open: number;
  done: number;
  overdue: number;
  unassigned: number;
}

export default function DepartmentReports() {
  const [reports, setReports] = useState<DeptReport[]>([]);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/corporate/api/reports');
        if (r.ok) {
          const d = await r.json();
          setReports(d.reports ?? []);
          setTotals(d.totals ?? null);
        }
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <p className="text-[#7A8BA8] text-sm flex items-center gap-2"><Loader2 className="animate-spin" size={15} /> Building report…</p>;
  }

  return (
    <div className="text-white">
      <div className="mb-5 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold font-sora flex items-center gap-2"><BarChart3 className="text-[#00C8FF]" size={22} /> Department Reports</h1>
          <p className="text-[#7A8BA8] text-sm mt-0.5">Workload and completion rate for every department — see who’s delivering and where work is piling up.</p>
        </div>
        <button
          type="button"
          onClick={() =>
            downloadCSV(
              `department-report-${new Date().toISOString().slice(0, 10)}.csv`,
              reports.map((r) => ({
                department: r.name,
                members: r.headcount,
                open: r.open,
                in_progress: r.in_progress,
                blocked: r.blocked,
                done: r.done,
                overdue: r.overdue,
                total: r.total,
                completion_percent: r.completion,
              }))
            )
          }
          disabled={reports.length === 0}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#1A2640] text-[#A8B2D0] hover:text-white text-sm font-semibold disabled:opacity-40"
        >
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Totals */}
      {totals && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          {[
            { label: 'Departments', value: totals.departments, color: '#00C8FF', icon: Users },
            { label: 'Open tasks', value: totals.open, color: '#E8B84B', icon: Inbox },
            { label: 'Completed', value: totals.done, color: '#00FF88', icon: CheckCircle2 },
            { label: 'Overdue', value: totals.overdue, color: totals.overdue ? '#FF5C7C' : '#6E7A91', icon: AlertTriangle },
            { label: 'Unassigned', value: totals.unassigned, color: totals.unassigned ? '#7B2FFF' : '#6E7A91', icon: Inbox },
          ].map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="bg-[#0A0F1E] border border-[#1A2640] rounded-xl p-4">
                <Icon size={16} style={{ color: k.color }} />
                <p className="text-2xl font-bold font-sora mt-1" style={{ color: k.color }}>{k.value}</p>
                <p className="text-[11px] text-[#A8B2D0]">{k.label}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Per-department */}
      {reports.length === 0 ? (
        <p className="text-center text-sm text-[#7A8BA8] py-10 border border-dashed border-[#1A2640] rounded-xl">
          No departments yet. Add them in Departments.
        </p>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => {
            const active = r.open + r.in_progress + r.blocked;
            return (
              <div key={r.id} className="bg-[#0A0F1E] border border-[#1A2640] rounded-xl p-4">
                <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                  <div>
                    <h3 className="font-semibold text-sm">{r.name}</h3>
                    <p className="text-[11px] text-[#6E7A91] flex items-center gap-1 mt-0.5"><Users size={11} /> {r.headcount} member{r.headcount === 1 ? '' : 's'} · {r.total} task{r.total === 1 ? '' : 's'} total</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold font-sora" style={{ color: r.completion >= 70 ? '#00FF88' : r.completion >= 40 ? '#E8B84B' : '#FF5C7C' }}>{r.completion}%</span>
                    <p className="text-[10px] text-[#6E7A91]">completed</p>
                  </div>
                </div>

                {/* completion bar */}
                <div className="h-2 rounded-full bg-[#0D1528] overflow-hidden mb-3">
                  <div className="h-full rounded-full" style={{ width: `${r.completion}%`, background: 'linear-gradient(90deg,#00C8FF,#00FF88)' }} />
                </div>

                <div className="flex items-center gap-4 text-[11px] flex-wrap">
                  <Stat label="Open" value={r.open} color="#00C8FF" />
                  <Stat label="In progress" value={r.in_progress} color="#E8B84B" />
                  <Stat label="Blocked" value={r.blocked} color="#FF5C7C" />
                  <Stat label="Done" value={r.done} color="#00FF88" />
                  {r.overdue > 0 && <Stat label="Overdue" value={r.overdue} color="#FF5C7C" />}
                  <span className="ml-auto text-[#6E7A91]">{active} active</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
      <span className="text-[#A8B2D0]">{label}</span>
      <span className="font-semibold" style={{ color }}>{value}</span>
    </span>
  );
}
