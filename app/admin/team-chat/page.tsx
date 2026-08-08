'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Hash, Send, Loader2, Megaphone } from 'lucide-react';

interface Msg {
  id: string;
  sender_id: string;
  body: string;
  parent_message_id: string | null;
  target_department_id: number | null;
  created_at: string;
}

export default function AdminTeamChat() {
  const [channel, setChannel] = useState<{ id: string } | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [nameById, setNameById] = useState<Record<string, string>>({});
  const [deptNameById, setDeptNameById] = useState<Record<number, string>>({});
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
  const [me, setMe] = useState('');
  const [input, setInput] = useState('');
  const [target, setTarget] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const r = await fetch('/corporate/api/channel/messages');
      const d = await r.json();
      setChannel(d.channel);
      setMessages((d.messages ?? []).filter((m: Msg) => !m.parent_message_id));
      setNameById(d.nameById ?? {});
      setDeptNameById(d.deptNameById ?? {});
      setDepartments(d.departments ?? []);
      setMe(d.me ?? '');
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const poll = setInterval(load, 8000);
    return () => clearInterval(poll);
  }, [load]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // try/finally: a rejected fetch used to leave `sending` true, which disabled
  // the send button permanently until the page was reloaded.
  const send = async () => {
    if (!input.trim() || !channel) return;
    setSending(true);
    setErr(null);
    try {
      const res = await fetch('/corporate/api/channel/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel_id: channel.id, body: input, target_department_id: target || null }),
      });
      if (res.ok) {
        setInput('');
        await load();
      } else {
        const d = await res.json().catch(() => ({}));
        setErr(d.error || 'Could not post. (Seed your Super Admin row and set SUPABASE_SERVICE_ROLE_KEY.)');
      }
    } catch {
      setErr('Network error — your message was not sent. Check your connection and try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-2xl text-white">
      <div className="flex items-center gap-2 mb-1">
        <Hash className="text-[var(--color-action-primary)]" size={22} />
        <h1 className="text-2xl font-bold font-sora">Team Chat</h1>
      </div>
      <p className="text-[#7A8BA8] text-sm mb-5">
        Talk to the whole team, or announce to one department. Sub-admins see all-staff posts + posts to their own department.
      </p>

      <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-xl h-[60vh] flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <p className="text-[#7A8BA8] text-sm flex items-center gap-2"><Loader2 className="animate-spin" size={14} /> Loading…</p>
          ) : messages.length === 0 ? (
            <p className="text-center text-sm text-[#7A8BA8] py-10">No messages yet. Post the first update or announcement.</p>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`p-3 rounded-xl border ${m.sender_id === me ? 'bg-[var(--color-action-primary)]/5 border-[var(--color-action-primary)]/30' : 'bg-[#0D1528] border-[#1E3A5F]'}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-sm flex items-center gap-2">
                    {nameById[m.sender_id] || 'Admin'}
                    {m.target_department_id != null && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#7B2FFF]/15 text-[#a78bfa] inline-flex items-center gap-1">
                        <Megaphone size={10} /> {deptNameById[m.target_department_id] || `Dept ${m.target_department_id}`}
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] text-[#8296B8]">{new Date(m.created_at).toLocaleString()}</span>
                </div>
                <p className="text-sm text-[#D4DAEA] mt-1 whitespace-pre-wrap">{m.body}</p>
              </div>
            ))
          )}
          <div ref={endRef} />
        </div>

        {err && <div className="px-4 py-2 text-xs text-red-400 border-t border-[#1E3A5F]">{err}</div>}

        <div className="p-3 border-t border-[#1E3A5F] flex items-center gap-2">
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            title="Send to"
            className="bg-[#1A2332] border border-[#1E3A5F] rounded-lg px-2 py-2 text-xs text-[#A8B2D0] max-w-[150px]"
          >
            <option value="">📢 All staff</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), send())}
            placeholder={target ? 'Announce to this department…' : 'Message all staff…'}
            className="flex-1 bg-[#1A2332] border border-[#1E3A5F] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-action-primary)]"
          />
          <button
            type="button"
            onClick={send}
            disabled={sending || !input.trim()}
            className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-action-primary)] to-[#7B2FFF] text-white flex items-center justify-center disabled:opacity-50"
          >
            {sending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
