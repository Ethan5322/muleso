'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, BookOpen, Inbox, Loader2 } from 'lucide-react';

interface Rec {
  id: string;
  name?: string;
  email?: string;
  service?: string;
  status?: string;
  verification_code?: string;
  kind: 'booking' | 'lead';
}

export default function AdminSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [data, setData] = useState<Rec[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadData = useCallback(async () => {
    if (loaded) return;
    setLoading(true);
    try {
      const [b, l] = await Promise.all([
        fetch('/api/admin/bookings').then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch('/api/admin/leads').then((r) => (r.ok ? r.json() : [])).catch(() => []),
      ]);
      const recs: Rec[] = [
        ...(Array.isArray(b) ? b : []).map((x: Rec) => ({ ...x, kind: 'booking' as const })),
        ...(Array.isArray(l) ? l : []).map((x: Rec) => ({ ...x, kind: 'lead' as const })),
      ];
      setData(recs);
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  }, [loaded]);

  useEffect(() => {
    if (open) {
      loadData();
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, loadData]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const term = q.trim().toLowerCase();
  const results =
    term.length < 2
      ? []
      : data
          .filter((r) =>
            [r.name, r.email, r.service, r.verification_code]
              .filter(Boolean)
              .some((f) => String(f).toLowerCase().includes(term))
          )
          .slice(0, 8);

  const go = (r: Rec) => {
    setOpen(false);
    setQ('');
    router.push(r.kind === 'booking' ? '/admin/bookings' : '/admin/leads');
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0F1624] border border-[#1E3A5F] text-[#8296B8] hover:text-white transition-colors"
        aria-label="Search"
      >
        <Search size={16} />
        <span className="hidden md:inline text-xs">Search…</span>
        <span className="hidden md:inline text-[10px] border border-[#1E3A5F] rounded px-1 text-[#7A8BA8]">Ctrl K</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-[#0A0E17] border border-[#1E3A5F] rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[#1E3A5F]">
            <Search size={16} className="text-[#8296B8]" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search bookings & leads…"
              className="flex-1 bg-transparent text-sm text-white focus:outline-none"
            />
            {q && (
              <button type="button" onClick={() => setQ('')} className="text-[#8296B8] hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {loading && (
              <p className="px-4 py-4 text-xs text-[#8296B8] flex items-center gap-2">
                <Loader2 size={13} className="animate-spin" /> Loading…
              </p>
            )}
            {!loading && term.length < 2 && (
              <p className="px-4 py-4 text-xs text-[#8296B8]">Type a name, email, service or code…</p>
            )}
            {!loading && term.length >= 2 && results.length === 0 && (
              <p className="px-4 py-4 text-xs text-[#8296B8]">No matches.</p>
            )}
            {results.map((r) => (
              <button
                key={`${r.kind}-${r.id}`}
                type="button"
                onClick={() => go(r)}
                className="w-full text-left flex items-center gap-3 px-4 py-2.5 hover:bg-[#141d2e] transition-colors"
              >
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    r.kind === 'booking' ? 'bg-[#00C8FF]/10 text-[#00C8FF]' : 'bg-[#7B2FFF]/10 text-[#a78bfa]'
                  }`}
                >
                  {r.kind === 'booking' ? <BookOpen size={15} /> : <Inbox size={15} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-white truncate">
                    {r.name || 'Unknown'} <span className="text-[#8296B8] font-normal">· {r.service || r.kind}</span>
                  </span>
                  <span className="block text-[11px] text-[#8296B8] truncate">{r.email}</span>
                </span>
                {r.status && <span className="text-[10px] text-[#8296B8]">{r.status}</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
