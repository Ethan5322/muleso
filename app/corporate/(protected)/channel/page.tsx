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
  target_department_id: number | null;
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
  const [roster, setRoster] = useState<{ id: string; display_name: string }[]>([]);
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
  const [deptNameById, setDeptNameById] = useState<Record<number, string>>({});
  const [target, setTarget] = useState<string>(''); // '' = all staff
  const [mentionOpen, setMentionOpen] = useState(false);
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
    setRoster(d.roster ?? []);
    setDepartments(d.departments ?? []);
    setDeptNameById(d.deptNameById ?? {});
    setLoading(false);
    // viewing the channel clears mention notifications
    fetch('/corporate/api/channel/read-mentions', { method: 'POST' }).catch(() => {});
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

  // --- @mentions ---
  const activeQuery = (() => {
    const at = input.lastIndexOf('@');
    if (at === -1) return null;
    const after = input.slice(at + 1);
    if (after.includes('\n')) return null;
    return after;
  })();
  const suggestions =
    mentionOpen && activeQuery !== null
      ? roster.filter((r) => r.display_name.toLowerCase().includes(activeQuery.toLowerCase())).slice(0, 6)
      : [];
  const pickMention = (name: string) => {
    const at = input.lastIndexOf('@');
    setInput(input.slice(0, at) + '@' + name + ' ');
    setMentionOpen(false);
  };
  const onInputChange = (v: string) => {
    setInput(v);
    setMentionOpen(v.lastIndexOf('@') !== -1);
  };

  const allNames = [...roster.map((r) => r.display_name), nameById[me]].filter(Boolean) as string[];
  const renderBody = (text: string): React.ReactNode[] => {
    const names = [...allNames].sort((a, b) => b.length - a.length);
    const nodes: React.ReactNode[] = [];
    let idx = 0;
    while (idx < text.length) {
      if (text[idx] === '@') {
        const rest = text.slice(idx + 1);
        const match = names.find((n) => rest.startsWith(n));
        if (match) {
          const isMe = match === nameById[me];
          nodes.push(
            <span key={idx} className={`font-semibold ${isMe ? 'bg-[#00C8FF]/20 text-[#00C8FF] rounded px-0.5' : 'text-[#00C8FF]'}`}>
              @{match}
            </span>
          );
          idx += 1 + match.length;
          continue;
        }
      }
      const last = nodes[nodes.length - 1];
      if (typeof last === 'string') nodes[nodes.length - 1] = last + text[idx];
      else nodes.push(text[idx]);
      idx++;
    }
    return nodes;
  };

  const send = async (body: string, parent?: string) => {
    if (!body.trim() || !channel) return;
    setSending(true);
    setErr(null);
    const res = await fetch('/corporate/api/channel/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel_id: channel.id,
        body,
        parent_message_id: parent || null,
        // replies inherit the thread; top-level posts use the selected target
        target_department_id: parent ? null : target || null,
      }),
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
            <span className="font-semibold text-sm text-[#F0F2FA] flex items-center gap-2">
              {nameById[m.sender_id] || 'Admin'}
              {m.target_department_id != null && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#7B2FFF]/15 text-[#a78bfa]">
                  → {deptNameById[m.target_department_id] || `Dept ${m.target_department_id}`}
                </span>
              )}
            </span>
            <div className="flex items-center gap-2">
              {m.pinned && <Pin size={12} className="text-[#E8B84B]" />}
              <span className="text-[10px] text-[#6E7A91]">
                {new Date(m.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
          <p className="text-sm text-[#D4DAEA] mt-1 whitespace-pre-wrap">{renderBody(m.body)}</p>

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

      <div className="relative p-3 border-t border-[#1A2640] flex items-center gap-2">
        {/* @mention autocomplete */}
        {suggestions.length > 0 && (
          <div className="absolute bottom-full left-3 mb-1 w-64 bg-[#0A0F1E] border border-[#1A2640] rounded-lg shadow-2xl overflow-hidden z-20">
            <p className="px-3 py-1.5 text-[10px] uppercase tracking-wide text-[#6E7A91] border-b border-[#1A2640]">Mention</p>
            {suggestions.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => pickMention(r.display_name)}
                className="w-full text-left px-3 py-2 text-sm text-[#D4DAEA] hover:bg-[#0D1528]"
              >
                @{r.display_name}
              </button>
            ))}
          </div>
        )}
        {departments.length > 0 && (
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            title="Send to"
            className="bg-[#0D1528] border border-[#1A2640] rounded-lg px-2 py-2 text-xs text-[#A8B2D0] max-w-[130px]"
          >
            <option value="">📢 All staff</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        )}
        <input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send(input))}
          placeholder={target ? `Message ${deptNameById[Number(target)] || 'department'}…` : 'Share an update…  @ to mention'}
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
