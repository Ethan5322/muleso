'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createCorpBrowserClient } from '@/lib/corp/supabaseBrowser';
import { Loader2, Send, Pin, PinOff, CornerDownRight, Hash } from 'lucide-react';

interface Msg {
  id: string;
  channel_id: string;
  sender_id: string;
  parent_message_id: string | null;
  body: string;
  pinned: boolean;
  created_at: string;
}
interface Reaction {
  id: string;
  message_id: string;
  department_admin_id: string;
  emoji: string;
}

const EMOJIS = ['👍', '💡', '🔥'];

export default function ChannelPage() {
  const [me, setMe] = useState('');
  const [isSuper, setIsSuper] = useState(false);
  const [channel, setChannel] = useState<{ id: string; name: string } | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [nameById, setNameById] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    const res = await fetch('/corporate/api/channel/messages');
    const d = await res.json();
    setMe(d.me);
    setIsSuper(!!d.isSuper);
    setChannel(d.channel);
    setMessages(d.messages ?? []);
    setReactions(d.reactions ?? []);
    setNameById(d.nameById ?? {});
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const poll = setInterval(load, 8000);
    return () => clearInterval(poll);
  }, [load]);

  useEffect(() => {
    if (!channel) return;
    const supabase = createCorpBrowserClient();
    const ch = supabase
      .channel('corp-channel-' + channel.id)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'corp_team_channel_messages', filter: `channel_id=eq.${channel.id}` },
        () => load()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [channel, load]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const send = async (body: string, parent?: string) => {
    if (!body.trim() || !channel) return;
    setSending(true);
    setErr(null);
    const res = await fetch('/corporate/api/channel/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel_id: channel.id, body, parent_message_id: parent || null }),
    });
    if (res.ok) {
      if (parent) {
        setReplyText('');
        setReplyTo(null);
      } else setInput('');
      await load();
    } else {
      const d = await res.json().catch(() => ({}));
      setErr(d.error || 'Could not post.');
    }
    setSending(false);
  };

  const react = async (message_id: string, emoji: string) => {
    await fetch('/corporate/api/channel/react', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message_id, emoji }),
    });
    load();
  };

  const pin = async (message_id: string, pinned: boolean) => {
    await fetch('/corporate/api/channel/pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message_id, pinned }),
    });
    load();
  };

  const reactionsFor = (id: string) => {
    const rs = reactions.filter((r) => r.message_id === id);
    const grouped: Record<string, { count: number; mine: boolean }> = {};
    rs.forEach((r) => {
      grouped[r.emoji] = grouped[r.emoji] || { count: 0, mine: false };
      grouped[r.emoji].count++;
      if (r.department_admin_id === me) grouped[r.emoji].mine = true;
    });
    return grouped;
  };

  const topLevel = messages.filter((m) => !m.parent_message_id);
  const repliesOf = (id: string) => messages.filter((m) => m.parent_message_id === id);
  const pinned = messages.filter((m) => m.pinned);

  const MessageCard = ({ m, isReply = false }: { m: Msg; isReply?: boolean }) => {
    const rx = reactionsFor(m.id);
    const canPin = m.sender_id === me || isSuper;
    return (
      <div className={`${isReply ? 'ml-6 border-l border-[#1A2640] pl-3' : ''}`}>
        <div className="bg-[#0D1528] border border-[#1A2640] rounded-xl px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-sm text-[#F0F2FA]">{nameById[m.sender_id] || 'Admin'}</span>
            <div className="flex items-center gap-2">
              {m.pinned && <Pin size={12} className="text-[#E8B84B]" />}
              <span className="text-[10px] text-[#6E7A91]">
                {new Date(m.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
          <p className="text-sm text-[#D4DAEA] mt-1 whitespace-pre-wrap">{m.body}</p>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {EMOJIS.map((e) => {
              const g = rx[e];
              return (
                <button
                  key={e}
                  onClick={() => react(m.id, e)}
                  className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                    g?.mine
                      ? 'border-[#00C8FF] bg-[#00C8FF]/10 text-[#00C8FF]'
                      : 'border-[#1A2640] text-[#A8B2D0] hover:border-[#00C8FF]'
                  }`}
                >
                  {e} {g?.count ? g.count : ''}
                </button>
              );
            })}
            {!isReply && (
              <button
                onClick={() => setReplyTo(replyTo === m.id ? null : m.id)}
                className="text-xs text-[#6E7A91] hover:text-[#00C8FF] inline-flex items-center gap-1"
              >
                <CornerDownRight size={12} /> Reply
              </button>
            )}
            {canPin && (
              <button
                onClick={() => pin(m.id, !m.pinned)}
                className="text-xs text-[#6E7A91] hover:text-[#E8B84B] inline-flex items-center gap-1"
              >
                {m.pinned ? <PinOff size={12} /> : <Pin size={12} />} {m.pinned ? 'Unpin' : 'Pin'}
              </button>
            )}
          </div>
        </div>

        {/* replies */}
        {!isReply && repliesOf(m.id).map((r) => <div key={r.id} className="mt-2"><MessageCard m={r} isReply /></div>)}

        {/* reply composer */}
        {replyTo === m.id && (
          <div className="ml-6 mt-2 flex items-center gap-2">
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), send(replyText, m.id))}
              placeholder="Reply…"
              className="flex-1 bg-[#0D1528] border border-[#1A2640] rounded-lg px-3 py-1.5 text-sm text-[#F0F2FA] focus:outline-none focus:border-[#00C8FF]"
            />
            <button
              onClick={() => send(replyText, m.id)}
              disabled={sending || !replyText.trim()}
              className="w-8 h-8 rounded-lg bg-[#00C8FF] text-black flex items-center justify-center disabled:opacity-50"
            >
              <Send size={14} />
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-[#A8B2D0] p-8">
        <Loader2 className="animate-spin" size={18} /> Loading channel…
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col bg-[#0A0F1E] border border-[#1A2640] rounded-xl">
      <div className="px-5 py-3 border-b border-[#1A2640] flex items-center gap-2">
        <Hash size={16} className="text-[#00C8FF]" />
        <h1 className="font-semibold font-sora text-sm">{channel?.name?.replace('#', '') || 'team-updates'}</h1>
        <span className="text-xs text-[#6E7A91]">· share what you&apos;re building</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {pinned.length > 0 && (
          <div className="bg-[#12101f] border border-[#E8B84B]/30 rounded-xl p-3">
            <p className="text-[11px] font-semibold text-[#E8B84B] uppercase tracking-wide mb-2 flex items-center gap-1">
              <Pin size={12} /> Pinned
            </p>
            <div className="space-y-2">
              {pinned.map((m) => (
                <p key={m.id} className="text-sm text-[#D4DAEA]">
                  <span className="font-semibold text-[#F0F2FA]">{nameById[m.sender_id] || 'Admin'}:</span> {m.body}
                </p>
              ))}
            </div>
          </div>
        )}

        {topLevel.length === 0 && (
          <p className="text-center text-sm text-[#6E7A91] py-10">
            No posts yet. Be the first to share what you&apos;re building 🚀
          </p>
        )}
        {topLevel.map((m) => <MessageCard key={m.id} m={m} />)}
        <div ref={endRef} />
      </div>

      {err && <div className="px-4 py-2 text-xs text-red-400 border-t border-[#1A2640]">{err}</div>}

      <div className="p-3 border-t border-[#1A2640] flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send(input))}
          placeholder="Share an update with the team…"
          className="flex-1 bg-[#0D1528] border border-[#1A2640] rounded-lg px-3 py-2 text-sm text-[#F0F2FA] focus:outline-none focus:border-[#00C8FF]"
        />
        <button
          onClick={() => send(input)}
          disabled={sending || !input.trim()}
          className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00C8FF] to-[#7B2FFF] text-white flex items-center justify-center disabled:opacity-50"
        >
          {sending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
        </button>
      </div>
    </div>
  );
}
