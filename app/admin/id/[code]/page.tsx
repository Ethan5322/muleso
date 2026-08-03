'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, CheckCircle2, XCircle, ShieldCheck, ScanBarcode } from 'lucide-react';

interface Staff {
  id?: string;
  display_name?: string;
  staff_number?: string;
  department_name?: string;
  role_title?: string;
  status?: string;
  is_visitor?: boolean;
  is_super_admin?: boolean;
  expires_at?: string | null;
  email?: string;
  photo_data_url?: string | null;
}

export default function StaffIdPage() {
  const params = useParams();
  const raw = Array.isArray(params.code) ? params.code[0] : params.code;
  const code = decodeURIComponent(raw || '');

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{ found: boolean; staff?: Staff } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`/api/admin/staff-lookup?code=${encodeURIComponent(code)}`);
        const d = await r.json();
        if (!cancelled) setResult(d);
      } catch {
        if (!cancelled) setResult({ found: false });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code]);

  const s = result?.staff;
  const expired = s?.expires_at && new Date(s.expires_at).getTime() < Date.now();
  const active = s?.status === 'active' && !expired;

  return (
    <div className="max-w-lg text-white">
      <div className="flex items-center gap-2 mb-6">
        <ShieldCheck className="text-[#00C8FF]" size={24} />
        <h1 className="text-2xl font-bold font-sora">Staff ID Verification</h1>
      </div>

      {loading ? (
        <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-xl p-10 flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-[#00C8FF]" size={28} />
          <p className="text-sm text-[#7A8BA8]">Reading ID {code}…</p>
        </div>
      ) : !result?.found ? (
        <div className="bg-[#0A0E17] border border-red-500/40 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <XCircle className="text-red-400" size={22} />
            <div>
              <p className="text-sm text-red-300 font-semibold">No staff member found for this ID.</p>
              <p className="text-xs text-[#7A8BA8] mt-1 font-mono">{code}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-xl overflow-hidden">
          {/* Verified banner */}
          <div
            className={`px-5 py-2.5 flex items-center gap-2 text-sm font-semibold ${
              active ? 'bg-[#00FF88]/10 text-[#00FF88]' : 'bg-red-500/10 text-red-400'
            }`}
          >
            {active ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            {active ? 'Valid — Active' : expired ? 'Expired' : 'Suspended / Inactive'}
          </div>

          <div className="p-5">
            <div className="flex items-start gap-4">
              {s?.photo_data_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.photo_data_url}
                  alt={s.display_name}
                  className="w-24 h-[124px] object-cover rounded-lg border border-[#1E3A5F]"
                />
              ) : (
                <div className="w-24 h-[124px] rounded-lg bg-[#1A2332] flex items-center justify-center text-[#7A8BA8] text-xs">
                  No photo
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold font-sora">{s?.display_name || 'Staff'}</h2>
                  {s?.is_super_admin && <Badge color="#00C8FF">Super Admin</Badge>}
                  {s?.is_visitor && <Badge color="#E8B84B">Visitor</Badge>}
                </div>
                <p className="text-sm text-[#00C8FF] font-mono mt-0.5">{s?.staff_number}</p>
                {s?.role_title && <p className="text-sm text-[#F0F2FA] font-semibold mt-1">{s.role_title}</p>}
                <p className="text-sm text-[#7A8BA8]">{s?.department_name}</p>
                {s?.email && <p className="text-xs text-[#7A8BA8] mt-1">{s.email}</p>}
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-[#1E3A5F] text-sm">
              <Field label="Verification Code" value={code} mono />
              <Field
                label="Status"
                value={active ? 'Active' : expired ? 'Expired' : 'Suspended'}
                valueClass={active ? 'text-[#00FF88]' : 'text-red-400'}
              />
              {s?.expires_at && (
                <Field label={expired ? 'Expired' : 'Valid Until'} value={new Date(s.expires_at).toLocaleDateString()} />
              )}
            </dl>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/admin/scan"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#00C8FF] to-[#7B2FFF] text-white"
              >
                <ScanBarcode size={14} /> Scan another ID
              </Link>
              <Link
                href="/admin/team"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1A2332] text-[#8A9AB8] border border-[#1E3A5F]"
              >
                Manage Team
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  mono,
  valueClass,
}: {
  label: string;
  value: string;
  mono?: boolean;
  valueClass?: string;
}) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wide text-[#7A8BA8]">{label}</dt>
      <dd className={`text-sm font-semibold ${mono ? 'font-mono' : ''} ${valueClass || 'text-[#F0F2FA]'}`}>{value}</dd>
    </div>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span
      className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide"
      style={{ color, backgroundColor: `${color}22` }}
    >
      {children}
    </span>
  );
}
