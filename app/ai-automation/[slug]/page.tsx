'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Check, AlertCircle, Cog, Gauge, TrendingUp, MessageCircle,
  Sparkles, Bot, ShieldCheck, Zap, ArrowRight,
} from 'lucide-react';
import {
  findAutomation, getDetail, getDeptMeta, iconKeyFor, ADMIN_CONTROLS, SYSTEM_CAN_DO, AUTOMATIONS,
} from '@/lib/aiAutomations';
import AutomationIcon from '@/components/AutomationIcon';
import AutomationBanner from '@/components/AutomationBanner';
import { useChatbot } from '@/context/ChatbotContext';
import { useSiteSettings } from '@/lib/useSiteSettings';

export default function AutomationDetailPage() {
  const params = useParams();
  const { openChatbot } = useChatbot();
  const settings = useSiteSettings();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const automation = slug ? findAutomation(slug) : undefined;

  if (!automation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center py-20">
        <h1 className="text-3xl font-bold font-sora gradient-text mb-4">Automation not found</h1>
        <p className="text-[var(--text-secondary)] mb-8">This system may have moved or been renamed.</p>
        <Link href="/ai-automation" className="px-8 py-3 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold rounded-lg">
          ← Back to the AI Automation Library
        </Link>
      </div>
    );
  }

  const d = getDetail(automation.name);
  const meta = getDeptMeta(automation.category);
  const title = automation.name.replace(/^AI\s+/, '');
  const waNumber = settings.whatsapp || '27688529333';
  const waText = encodeURIComponent(`Hi MuleSoo, I'd like you to build the "${automation.name}" for my business.`);

  // "Buy / custom to buy" → opens the booking flow with THIS system auto-selected
  // as the first answer, then continues to budget and the rest of the questions.
  const startBooking = (mode: 'buy' | 'custom' = 'buy') =>
    openChatbot({
      service: mode === 'custom' ? `${title} (custom build)` : title,
      details: `${mode === 'custom' ? 'Custom build request' : 'Buy'}: ${title} — ${automation.desc}`,
      price: mode === 'custom' ? 'a custom quote' : 'R5,000',
    });

  // related systems from the same department
  const related = AUTOMATIONS.filter(
    (a) => a.category === automation.category && a.slug !== automation.slug
  ).slice(0, 3);

  const Section = ({ icon: Icon, color, label, children }: { icon: any; color: string; label: string; children: React.ReactNode }) => (
    <div>
      <h2 className="flex items-center gap-2 text-sm font-bold font-sora uppercase tracking-wide mb-2" style={{ color }}>
        <Icon size={16} /> {label}
      </h2>
      <div className="text-[var(--text-secondary)] leading-relaxed">{children}</div>
    </div>
  );

  return (
    <div className="min-h-screen pb-20">
      {/* ===== CORPORATE COVER ===== */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full bg-[var(--accent-blue)] opacity-[0.08] blur-[120px]" />
          <div className="absolute top-10 -right-32 w-[420px] h-[420px] rounded-full bg-[var(--accent-purple)] opacity-[0.08] blur-[110px]" />
          <div
            className="absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
              backgroundSize: '54px 54px',
              maskImage: 'radial-gradient(ellipse at 30% 0%, black 20%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(ellipse at 30% 0%, black 20%, transparent 70%)',
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          <Link href="/ai-automation" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-blue)] hover:underline mb-8">
            <ArrowLeft size={16} /> Back to Library
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">
            {/* left — selling copy */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center gap-3 mb-5">
                <span
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-[0_10px_30px_-8px_rgba(0,200,255,0.5)]"
                  style={{ background: `linear-gradient(135deg, ${meta.color}, var(--accent-purple))` }}
                >
                  <AutomationIcon iconKey={iconKeyFor(automation.name)} size={26} />
                </span>
                <div>
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold font-sora"
                    style={{ color: meta.color, backgroundColor: meta.glow }}
                  >
                    {automation.category}
                  </span>
                  <p className="text-[11px] font-mono text-[var(--text-secondary)] mt-1">
                    System #{String(automation.id).padStart(3, '0')} · MuleSoo AI Library
                  </p>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold font-sora gradient-text leading-[1.05] mb-4">{title}</h1>
              <p className="text-lg text-[var(--text-secondary)]">{automation.desc}</p>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--text-secondary)]">
                <span className="inline-flex items-center gap-1.5"><Zap size={15} className="text-[var(--accent-blue)]" /> Built with AI</span>
                <span className="inline-flex items-center gap-1.5"><Sparkles size={15} className="text-[var(--accent-green)]" /> Works 24/7</span>
                <span className="inline-flex items-center gap-1.5"><ShieldCheck size={15} className="text-[var(--accent-gold)]" /> You control it all</span>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => startBooking('buy')}
                  className="px-7 py-3.5 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold font-sora rounded-lg hover:scale-[1.03] transition-transform"
                >
                  Buy / Build This System →
                </button>
                <a
                  href={`https://wa.me/${waNumber}?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-7 py-3.5 border border-[var(--border)] text-[var(--text-primary)] font-bold rounded-lg hover:border-[#25D366] hover:text-[#25D366] transition-colors"
                >
                  <MessageCircle size={18} /> Ask on WhatsApp
                </a>
              </div>
            </motion.div>

            {/* right — live "working system" banner (coded, per-system demo) */}
            <div className="order-first lg:order-last">
              <AutomationBanner
                name={automation.name}
                title={title}
                iconKey={iconKeyFor(automation.name)}
                color={meta.color}
                glow={meta.glow}
                onStart={() => startBooking('buy')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== DETAIL ===== */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <div className="glass-card rounded-2xl p-8 space-y-7">
            <Section icon={AlertCircle} color="#FF6B6B" label="The problem">{d.problem}</Section>
            <Section icon={Cog} color="var(--accent-blue)" label="How it works">{d.howItWorks}</Section>

            <div>
              <h2 className="flex items-center gap-2 text-sm font-bold font-sora uppercase tracking-wide mb-3 text-[var(--accent-purple)]">
                <Sparkles size={16} /> Features
              </h2>
              <ul className="grid sm:grid-cols-2 gap-2">
                {d.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                    <Check size={16} className="text-[var(--accent-green)] mt-0.5 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h2 className="flex items-center gap-2 text-sm font-bold font-sora uppercase tracking-wide mb-3 text-[var(--accent-blue)]">
                  <Gauge size={16} /> What the admin controls
                </h2>
                <ul className="space-y-1.5">
                  {ADMIN_CONTROLS.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                      <Check size={15} className="text-[var(--accent-blue)] mt-0.5 flex-shrink-0" /> {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="flex items-center gap-2 text-sm font-bold font-sora uppercase tracking-wide mb-3 text-[var(--accent-green)]">
                  <Bot size={16} /> What it can do
                </h2>
                <ul className="space-y-1.5">
                  {SYSTEM_CAN_DO.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                      <Check size={15} className="text-[var(--accent-green)] mt-0.5 flex-shrink-0" /> {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Section icon={TrendingUp} color="var(--accent-gold)" label="How it grows your business">{d.businessBenefit}</Section>

            <div className="border-t border-[var(--border)] pt-5 text-sm text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--text-primary)]">Why MuleSoo: </span>{d.whyMuleSoo}
            </div>
          </div>

          {/* ===== WHY WE BEAT THE LATEST SYSTEMS ===== */}
          <div className="mt-8 glass-card rounded-2xl p-8">
            <div className="flex items-start gap-3 mb-2">
              <span
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: meta.glow, color: meta.color }}
              >
                <TrendingUp size={18} />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-sora text-[var(--text-primary)] leading-tight">
                  Already using the latest software? Here’s why ours still wins.
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  Compared with {meta.usesToday}, here’s how a MuleSoo AI system boosts your business:
                </p>
              </div>
            </div>

            {/* comparison table */}
            <div className="mt-6 overflow-x-auto">
              <table className="w-full border-collapse min-w-[520px]">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left p-3 text-xs font-sora font-semibold text-[var(--text-secondary)] uppercase tracking-wide w-1/4">
                      What matters
                    </th>
                    <th className="text-left p-3 text-xs font-sora font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                      The latest {automation.category.split(',')[0].split(' & ')[0].toLowerCase()} software
                    </th>
                    <th
                      className="text-left p-3 text-xs font-sora font-bold uppercase tracking-wide rounded-t-lg"
                      style={{ color: meta.color, backgroundColor: meta.glow }}
                    >
                      A MuleSoo AI system
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {meta.rows.map((row) => (
                    <tr key={row.dim} className="border-b border-[var(--border)] last:border-0 align-top">
                      <td className="p-3 text-sm font-semibold text-[var(--text-primary)]">{row.dim}</td>
                      <td className="p-3 text-sm text-[var(--text-secondary)]">{row.theirs}</td>
                      <td className="p-3 text-sm text-[var(--text-primary)]" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                        <span className="inline-flex items-start gap-1.5">
                          <Check size={15} className="mt-0.5 flex-shrink-0" style={{ color: meta.color }} />
                          <span>{row.ours}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* pitch */}
            <div
              className="mt-6 rounded-xl p-5 border"
              style={{ borderColor: meta.color, backgroundColor: meta.glow }}
            >
              <p className="text-[var(--text-primary)] font-semibold leading-relaxed">
                <Sparkles size={16} className="inline mr-1.5 -mt-1" style={{ color: meta.color }} />
                {meta.pitch}
              </p>
            </div>
          </div>

          {/* ===== BUY / CUSTOM TO BUY ===== */}
          <div className="mt-8 relative overflow-hidden glass-card rounded-2xl border border-[var(--accent-blue)] p-8 sm:p-10 text-center">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[var(--glow-blue)] to-[var(--glow-purple)] opacity-60" />
            <Bot className="mx-auto text-[var(--accent-blue)] mb-3" size={30} />
            <h2 className="text-2xl sm:text-3xl font-bold font-sora text-[var(--text-primary)] mb-2">
              Ready to put the <span className="gradient-text">{title}</span> to work?
            </h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto mb-6">
              Click below and our booking assistant will take your details and start your build —
              buy it as-is, or ask us to customise it to your exact workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => startBooking('buy')}
                className="px-8 py-4 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold font-sora rounded-lg hover:scale-[1.03] transition-transform"
              >
                Buy This System
              </button>
              <button
                type="button"
                onClick={() => startBooking('custom')}
                className="px-8 py-4 border border-[var(--accent-gold)] text-[var(--accent-gold)] font-bold font-sora rounded-lg hover:bg-[var(--glow-gold)] transition-colors"
              >
                Customise & Buy
              </button>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-4">
              🔒 No obligation · We reply within 2 hours · You own the final system
            </p>
          </div>

          {/* ===== RELATED ===== */}
          {related.length > 0 && (
            <div className="mt-14">
              <h3 className="text-sm font-bold font-sora uppercase tracking-wide text-[var(--text-secondary)] mb-4">
                More in {automation.category}
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/ai-automation/${r.slug}`}
                    className="group glass-card rounded-xl border border-[var(--border)] p-4 hover:border-[var(--accent-blue)] transition-all"
                  >
                    <h4 className="font-semibold font-sora text-sm text-[var(--text-primary)] group-hover:text-[var(--accent-blue)] transition-colors mb-1">
                      {r.name.replace(/^AI\s+/, '')}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2">{r.desc}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent-blue)] mt-2">
                      View <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
