'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createCorpBrowserClient } from '@/lib/corp/supabaseBrowser';
import { Loader2, Send, MessageSquare, ArrowLeft } from 'lucide-react';

interface DM {
  id: string;
  sender_id: string;
  recipient_id: string;
  body: string;
  read_at: string | null;
  created_at: string;
}
interface Contact {
  id: string;
  display_name: string | null;
  department_name: string | null;
  department_id: number | null;
}

export default function MessagesPage() {
  const [me, setMe] = useState<string>('');
  const [messages, setMessages] = useState<DM[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [permError, setPermError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    const res = await fetch('/corporate/api/dm/messages');
    const data = await res.json();
    setMe(data.me);
    setMessages(data.messages ?? []);
    setContacts(data.contacts ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const poll = setInterval(load, 8000); // fallback if realtime isn't enabled
    return () => clearInterval(poll);
  }, [load]);

  // realtime: refetch on any DM addressed to me
  useEffect(() => {
    if (!me) return;
    const supabase = createCorpBrowserClient();
    const ch = supabase
      .channel('corp-dm-' + me)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'corp_direct_messages', filter: `recipient_id=eq.${me}` },
        () => load()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [me, load]);

  const markRead = useCallback(async (withId: string) => {
    await fetch('/corporate/api/dm/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ with: withId }),
    });
  }, []);

  const openThread = (id: string) => {
    setSelected(id);
    setPermError(null);
    markRead(id).then(load);
  };

  const thread = selected
    ? messages.filter(
        (m) =>
          (m.sender_id === selected && m.recipient_id === me) ||
          (m.sender_id === me && m.recipient_id === selected)
      )
    : [];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread.length, selected]);

  const unreadFrom = (id: string) =>
    messages.filter((m) => m.sender_id === id && m.recipient_id === me && !m.read_at).length;

  const lastWith = (id: string) => {
    const t = messages.filter(
      (m) => (m.sender_id === id && m.recipient_id === me) || (m.sender_id === me && m.recipient_id === id)
    );
    return t[t.length - 1];
  };

  const send = async () => {
    const body = input.trim();
    if (!body || !selected) return;
    setSending(true);
    setPermError(null);
    const res = await fetch('/corporate/api/dm/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient_id: selected, body }),
    });
    if (res.ok) {
      setInput('');
      await load();
    } else {
      const d = await res.json().catch(() => ({}));
      setPermError(d.error || 'Could not send.');
    }
    setSending(false);
  };

  const sortedContacts = [...contacts].sort((a, b) => {
    const la = lastWith(a.id)?.created_at || '';
    const lb = lastWith(b.id)?.created_at || '';
    return lb.localeCompare(la);
  });

  const selectedContact = contacts.find((c) => c.id === selected);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-[#A8B2D0] p-8">
        <Loader2 className="animate-spin" size={18} /> Loading messages…
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-160px)] flex gap-4">
      {/* Contact list (structured recipients) — full width on mobile, hidden when a thread is open */}
      <aside className={`${selected ? 'hidden md:flex' : 'flex'} w-full md:w-64 flex-shrink-0 bg-[#0A0F1E] border border-[#1A2640] rounded-xl overflow-hidden flex-col`}>
        <div className="px-4 py-3 border-b border-[#1A2640]">
          <h2 className="font-semibold font-sora text-sm">Messages</h2>
          <p className="text-[11px] text-[#6E7A91]">Private &amp; end-to-end by database rule</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sortedContacts.length === 0 && (
            <p className="p-4 text-xs text-[#6E7A91]">No other admins yet.</p>
          )}
          {sortedContacts.map((c) => {
            const unread = unreadFrom(c.id);
            const last = lastWith(c.id);
            return (
              <button
                key={c.id}
                onClick={() => openThread(c.id)}
                className={`w-full text-left px-4 py-3 border-b border-[#101a30] transition-colors ${
                  selected === c.id ? 'bg-[#00C8FF]/10' : 'hover:bg-[#0D1528]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-sm text-[#F0F2FA] truncate">
                    {c.display_name || 'Admin'}
                  </span>
                  {unread > 0 && (
                    <span className="text-[10px] font-bold bg-[#00C8FF] text-black rounded-full px-1.5 py-0.5">
                      {unread}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#6E7A91] truncate">
                  {last ? last.body : c.department_name || `Dept ${c.department_id ?? ''}`}
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Thread — full width on mobile, hidden until a contact is picked */}
      <section className={`${selected ? 'flex' : 'hidden md:flex'} flex-1 min-w-0 bg-[#0A0F1E] border border-[#1A2640] rounded-xl flex-col`}>
        {!selected ? (
          <div className="flex-1 flex flex-col items-center justify-center text-[#6E7A91]">
            <MessageSquare size={32} className="mb-2" />
            <p className="text-sm">Select an admin to start a private conversation.</p>
          </div>
        ) : (
          <>
            <div className="px-4 py-3 border-b border-[#1A2640] flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="md:hidden -ml-1 p-1 rounded-lg text-[#A8B2D0] hover:text-white"
                aria-label="Back to conversations"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <p className="font-semibold text-sm">{selectedContact?.display_name || 'Admin'}</p>
                <p className="text-[11px] text-[#6E7A91]">
                  {selectedContact?.department_name || `Dept ${selectedContact?.department_id ?? ''}`}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {thread.length === 0 && (
                <p className="text-center text-xs text-[#6E7A91] py-8">
                  No messages yet. Say hello 👋
                </p>
              )}
              {thread.map((m) => {
                const mine = m.sender_id === me;
                return (
                  <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[75%] px-3.5 py-2 text-sm rounded-2xl ${
                        mine
                          ? 'bg-gradient-to-br from-[#00C8FF] to-[#7B2FFF] text-white rounded-br-sm'
                          : 'bg-[#0D1528] text-[#F0F2FA] border border-[#1A2640] rounded-bl-sm'
                      }`}
                    >
                      {m.body}
                      <div className={`text-[9px] mt-1 ${mine ? 'text-white/70' : 'text-[#6E7A91]'}`}>
                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {mine && (m.read_at ? ' · Read' : ' · Sent')}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={endRef} />
            </div>

            {permError && (
              <div className="px-4 py-2 text-xs text-red-400 border-t border-[#1A2640]">{permError}</div>
            )}

            <div className="p-3 border-t border-[#1A2640] flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
                placeholder="Type a private message…"
                className="flex-1 bg-[#0D1528] border border-[#1A2640] rounded-lg px-3 py-2 text-sm text-[#F0F2FA] focus:outline-none focus:border-[#00C8FF]"
              />
              <button
                type="button"
                onClick={send}
                disabled={sending || !input.trim()}
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00C8FF] to-[#7B2FFF] text-white flex items-center justify-center disabled:opacity-50"
              >
                {sending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
