'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView, useAnimation } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Globe, Bot, Palette, FileText, QrCode, Mail, Star, Search, Layers, Code2, Rocket, MessageCircle, AppWindow, CreditCard, CheckCircle, Gauge, ShieldCheck, Clock, Zap, Check, X } from 'lucide-react';
import { useSiteSettings } from '@/lib/useSiteSettings';
import FaqSection, { type Faq } from '@/components/FaqSection';

const HOME_FAQS: Faq[] = [
  { q: 'What does MuleSoo Digital Services do?', a: 'MuleSoo is a digital and AI agency in Pretoria, South Africa. We build professional websites, AI chatbots, whole-business Auto Pilot systems, AI automations, digital ID systems, logos, QR codes and custom apps for businesses across South Africa and Africa.' },
  { q: 'How much does a website cost?', a: 'Websites start from R3,500, business sites from R7,500, and enterprise builds are quoted on scope. AI chatbots start from R2,500 and full AI automation systems from R4,500.' },
  { q: 'How long does a project take?', a: 'Most websites and systems launch within about three weeks, depending on scope. We work fast and keep you updated throughout.' },
  { q: 'Do I own what you build?', a: 'Yes. After full payment, the complete source code, data and product are 100% yours — with no per-transaction commissions.' },
  { q: 'Where are you based and do you work remotely?', a: 'We are based in Pretoria, South Africa, and work with clients across South Africa and Africa, remotely worldwide.' },
  { q: 'How do I get started?', a: 'Message us on WhatsApp at +27 68 852 9333 or use the contact form for a free quote. We usually reply within 2 hours.' },
];

const StatCounter = ({ value, label }: { value: string; label: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <div className="text-6xl font-bold heading-section font-sora mb-3">{value}</div>
      <div className="text-[var(--text-secondary)] text-base font-light">{label}</div>
    </motion.div>
  );
};

const TestimonialCard = ({
  quote,
  author,
  role,
  company,
  rating,
  delay,
}: {
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  delay: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={controls}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-8 hover:border-[var(--accent-blue)] hover:shadow-lg hover:shadow-[var(--glow-blue)] transition-all duration-300"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.2, duration: 0.4 }}
        className="flex gap-1 mb-4"
      >
        {[...Array(rating)].map((_, i) => (
          <Star key={i} size={16} className="fill-[var(--accent-gold)] text-[var(--accent-gold)]" />
        ))}
      </motion.div>
      <p className="text-[var(--text-secondary)] mb-6 italic leading-relaxed">"{quote}"</p>
      <div className="border-t border-[var(--border)] pt-4">
        <p className="font-bold text-[var(--text-primary)]">{author}</p>
        <p className="text-sm text-[var(--text-secondary)]">{role} at {company}</p>
      </div>
    </motion.div>
  );
};

const ServiceCard = ({
  icon: IconComponent,
  title,
  description,
  delay,
}: {
  icon: any;
  title: string;
  description: string;
  delay: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={controls}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-8 hover:border-[var(--accent-blue)] hover:shadow-lg hover:shadow-[var(--glow-blue)] transition-all duration-300 hover:-translate-y-1 group"
    >
      <div className="w-14 h-14 rounded-full bg-[var(--glow-blue)] flex items-center justify-center mb-6 group-hover:bg-[var(--accent-blue)]">
        <IconComponent size={28} className="text-[var(--accent-blue)]" />
      </div>
      <h3 className="text-xl font-bold font-sora text-[var(--text-primary)] mb-3">
        {title}
      </h3>
      <p className="text-base text-[var(--text-secondary)] mb-6 leading-relaxed">{description}</p>
      <Link
        href="/services"
        className="text-[var(--accent-blue)] text-base font-medium hover:gap-2 inline-flex items-center transition-all"
      >
        Learn more →
      </Link>
    </motion.div>
  );
};

interface HomeTestimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
}

const FALLBACK_TESTIMONIALS: HomeTestimonial[] = [
  { quote: 'MuleSoo built our entire booking and member management system. We went from spreadsheets to fully automated operations. Bookings are up 300% and we have zero no-shows thanks to the reminder system.', author: 'Kgosi Moeng', role: 'Owner', company: 'Yoyo Gym', rating: 5 },
  { quote: 'The AI chatbot handles every single customer enquiry for our events business — bookings, pricing questions, payments. It works flawlessly. I cannot imagine running our business without it now.', author: 'Thabo Sithole', role: 'Founder', company: 'Shime Events', rating: 5 },
  { quote: 'Faster than any freelancer, better quality than any agency. They delivered our website in 10 days and the chatbot integration was seamless. Genuine, professional, and they actually care about results.', author: 'Alem Tekle', role: 'Manager', company: 'Tsedi Catering', rating: 5 },
];

export default function Home() {
  const settings = useSiteSettings();
  const [testimonials, setTestimonials] = useState<HomeTestimonial[]>(FALLBACK_TESTIMONIALS);

  useEffect(() => {
    fetch('/api/admin/testimonials')
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => {
        if (Array.isArray(d) && d.length > 0) {
          setTestimonials(
            d.map((t: any) => ({
              quote: t.quote,
              author: t.author,
              role: t.role || '',
              company: t.company || '',
              rating: t.rating || 5,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      {/* SECTION 1 - HERO */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* coded corporate backdrop (decorative, non-interactive) */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] rounded-full bg-[var(--accent-blue)] opacity-[0.035] blur-[150px]" />
          <div className="absolute top-24 -right-40 w-[500px] h-[500px] rounded-full bg-[var(--accent-purple)] opacity-[0.04] blur-[150px]" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
              maskImage: 'radial-gradient(ellipse at 50% 40%, black 25%, transparent 72%)',
              WebkitMaskImage: 'radial-gradient(ellipse at 50% 40%, black 25%, transparent 72%)',
            }}
          />
        </div>

        <div className="max-w-5xl mx-auto w-full text-center relative">
          <motion.div className="space-y-6">
            {/* Badge */}
            <Link href="/ai-automation">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-block px-6 py-3 rounded-full w-fit mx-auto border-2 border-[var(--accent-blue)] bg-[var(--glow-blue)] hover:bg-[var(--accent-blue)] hover:text-[var(--bg-primary)] transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[var(--glow-blue)] cursor-pointer"
              >
                <span className="text-[var(--accent-blue)] hover:text-[var(--bg-primary)] font-sora text-sm font-bold transition-colors duration-300">
                  ⚡ {settings.hero_badge}
                </span>
              </motion.div>
            </Link>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold font-sora leading-[1.05] tracking-[-0.035em] gradient-text"
            >
              {settings.hero_title}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed font-light"
            >
              {settings.hero_subtitle}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
            >
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link href="/services" className="btn-primary px-9 py-3.5 text-[15px]">
                  Explore Services
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link href="/portfolio" className="btn-secondary px-9 py-3.5 text-[15px]">
                  View Our Work
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust chips */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 pt-6 text-sm text-[var(--text-secondary)]"
            >
              <span className="inline-flex items-center gap-2">
                <Zap size={16} className="text-[var(--accent-blue)]" /> 200 AI systems
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck size={16} className="text-[var(--accent-gold)]" /> POPIA-compliant
              </span>
              <span className="inline-flex items-center gap-2">
                <Check size={16} className="text-[var(--accent-green)]" /> You own everything
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock size={16} className="text-[var(--accent-blue)]" /> 2-hour response
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 1.5 - TRUST BAR */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)] bg-gradient-to-r from-transparent via-[var(--glow-blue)]/5 to-transparent">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-secondary)] mb-8 font-bold">
            Trusted by businesses across the world
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
            {['Habesha Celebration Events', 'Shime Events', 'YoYo Gym', 'Tsedi Catering', 'DR. Hospital'].map(
              (brand) => (
                <motion.span
                  key={brand}
                  whileHover={{ scale: 1.05 }}
                  className="font-sora font-bold text-base sm:text-lg text-[var(--text-secondary)] opacity-60 hover:opacity-100 hover:text-[var(--accent-blue)] transition-all duration-200 cursor-default"
                >
                  {brand}
                </motion.span>
              )
            )}
          </div>
        </div>
      </section>

      {/* SECTION 2 - STATS BAR */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[var(--bg-secondary)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <StatCounter value={settings.stat1_value} label={settings.stat1_label} />
            <StatCounter value={settings.stat2_value} label={settings.stat2_label} />
            <StatCounter value={settings.stat3_value} label={settings.stat3_label} />
            <StatCounter value={settings.stat4_value} label={settings.stat4_label} />
          </div>
        </div>
      </section>

      {/* SECTION 3 - SERVICES GRID */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-7xl font-bold heading-section font-sora mb-6">
              Our Services
            </h2>
            <p className="text-[var(--text-secondary)] text-lg md:text-xl max-w-3xl mx-auto font-light">
              Complete digital solutions to build and grow your business
            </p>
          </motion.div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard
              icon={Globe}
              title="Website Design"
              description="Stunning, fast websites built to convert visitors into clients."
              delay={0}
            />
            <ServiceCard
              icon={Bot}
              title="AI Chatbots"
              description="24/7 intelligent assistants that handle your customer service."
              delay={0.08}
            />
            <ServiceCard
              icon={Palette}
              title="Logo Design"
              description="Professional brand identity that makes you unforgettable."
              delay={0.16}
            />
            <ServiceCard
              icon={FileText}
              title="PDF Guides"
              description="Expert knowledge packaged as downloadable products you sell forever."
              delay={0.24}
            />
            <ServiceCard
              icon={QrCode}
              title="QR Code Design"
              description="Custom branded QR codes with built-in analytics tracking."
              delay={0.32}
            />
            <ServiceCard
              icon={Mail}
              title="Custom Email"
              description="Professional @yourdomain.com email that builds instant credibility."
              delay={0.4}
            />
            <ServiceCard
              icon={AppWindow}
              title="Custom Apps Building"
              description="Bespoke web & mobile applications engineered to run your business end-to-end."
              delay={0.48}
            />
          </div>
        </div>
      </section>

      {/* SECTION 3.5 - HOW AI BOOKING WORKS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 pill-soft px-4 py-2 rounded-full mb-6">
              <Zap size={16} className="text-[var(--accent-blue)]" />
              <span className="text-[var(--accent-blue)] font-sora text-sm font-bold">Our AI Booking System</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold heading-section font-sora mb-6">
              Clients Book You on Autopilot
            </h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
              From a single QR code to a paid, verified booking — 24/7, while you focus on the work.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { icon: QrCode, title: 'Scan the QR', desc: 'Your customer scans your branded QR code — on a flyer, shop, or online.' },
              { icon: MessageCircle, title: 'Chat with AI', desc: 'A friendly assistant collects their details, needs and preferences.' },
              { icon: CreditCard, title: 'Pay online', desc: 'They pay a deposit or fee securely in a few taps.' },
              { icon: CheckCircle, title: 'Get verified', desc: 'Instant verification code + email confirmation, automatically.' },
              { icon: Gauge, title: 'You track it', desc: 'Every booking, payment and client in your admin dashboard.' },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  viewport={{ once: true }}
                  className="glass-card p-6 text-center relative"
                >
                  <span className="absolute top-4 right-6 text-5xl font-bold font-sora bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] bg-clip-text text-transparent opacity-20">
                    {i + 1}
                  </span>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[var(--glow-blue)]">
                    <Icon className="text-white" size={28} />
                  </div>
                  <h3 className="font-bold font-sora text-lg text-[var(--text-primary)] mb-3">{step.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4 - PROCESS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-6xl md:text-7xl font-bold heading-section text-center font-sora mb-20"
          >
            How We Work
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: 1, title: 'Discovery', icon: Search, desc: 'We learn your business, goals, and audience in detail.' },
              { number: 2, title: 'Design', icon: Layers, desc: 'We craft wireframes and visual concepts for your approval.' },
              { number: 3, title: 'Build', icon: Code2, desc: 'We develop with precision using the world\'s best tech stack.' },
              { number: 4, title: 'Launch', icon: Rocket, desc: 'We deploy, test, and hand you the keys to your new digital asset.' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ translateY: -4 }}
                className="relative"
              >
                <div className="glass-card p-8 h-full hover:border-[var(--accent-blue)] hover:shadow-lg hover:shadow-[var(--glow-blue)] transition-all duration-300">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] flex items-center justify-center mb-6 shadow-lg shadow-[var(--glow-blue)]">
                    <span className="text-white font-bold font-sora text-lg">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-bold font-sora text-[var(--text-primary)] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4.5 - WHY MULESOO */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-5xl md:text-6xl font-bold heading-section font-sora mb-6">
              Why Businesses Choose MuleSoo
            </h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
              Agency quality and real automation — without the agency price tag.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Code2, title: 'You Own Everything', desc: 'Full source code and data are yours after payment — no lock-in, ever.' },
              { icon: ShieldCheck, title: 'POPIA-Compliant', desc: 'Built to South African data-protection standards from day one.' },
              { icon: CreditCard, title: 'Secure Online Payments', desc: 'Take deposits and payments through the system, safely.' },
              { icon: Gauge, title: 'Real Admin Dashboard', desc: 'Track leads, bookings, payments and clients — all in one place.' },
              { icon: Clock, title: '2-Hour Response', desc: 'We reply fast and deliver on schedule, every time.' },
              { icon: Rocket, title: 'Fast, Premium Delivery', desc: 'World-class design and AI automation, launched in weeks.' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  viewport={{ once: true }}
                  whileHover={{ translateY: -4 }}
                  className="glass-card p-6 hover:border-[var(--accent-blue)] hover:shadow-lg hover:shadow-[var(--glow-blue)] transition-all duration-300 flex items-start gap-4"
                >
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[var(--glow-blue)] to-[rgba(123,47,255,0.1)] flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Icon className="text-[var(--accent-blue)]" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold font-sora text-lg text-[var(--text-primary)] mb-2">{item.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4.7 - FEATURED WORK */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-5xl md:text-6xl font-bold heading-section font-sora mb-6">Featured Work</h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
              Real systems, running real businesses. Explore the full case studies in our portfolio.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { img: 'mulesoo-website.jpg', title: 'MuleSoo Platform', category: 'Flagship', benefit: 'Captures leads, books clients with AI, and runs the whole business 24/7.' },
              { img: 'yoyo-gym.jpg', title: 'YoYo Gym', category: 'Gym Platform', benefit: 'Memberships, recurring billing and face check-in — on autopilot.' },
              { img: 'shime-events.jpg', title: 'Shime Events', category: 'Events', benefit: 'Bilingual AI bookings with online deposits and PDF contracts.' },
            ].map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ translateY: -6 }}
                className="group glass-card overflow-hidden rounded-2xl border border-[var(--border)] hover:border-[var(--accent-blue)] hover:shadow-xl hover:shadow-[var(--glow-blue)] transition-all duration-300"
              >
                <div className="relative w-full h-48 overflow-hidden">
                  <Image src={`/${p.img}`} alt={p.title} width={800} height={450} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold font-sora text-white bg-black/45 border border-white/20">{p.category.toUpperCase()}</span>
                </div>
                <div className="p-6">
                  <h3 className="font-bold font-sora text-lg text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-blue)] transition-colors">{p.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{p.benefit}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
              <Link href="/portfolio" className="btn-secondary px-9 py-3.5 text-[15px]">
                View Full Portfolio →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 4.8 - TRUSTED BY */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[var(--bg-primary)] to-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm uppercase tracking-wider font-semibold text-[var(--accent-blue)] mb-3">Trusted By Industry Leaders</p>
            <h3 className="text-2xl md:text-3xl font-bold font-sora text-[var(--text-primary)]">
              Businesses That Trust MuleSoo
            </h3>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {[
              { name: 'Yoyo Gym', category: 'Fitness' },
              { name: 'Shime Events', category: 'Events' },
              { name: 'Tsedi Catering', category: 'Catering' },
              { name: 'X-Boss Photography', category: 'Photography' },
              { name: 'Habesha Events', category: 'Wedding Planning' },
            ].map((client, i) => (
              <motion.div
                key={client.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="glass-card p-6 flex flex-col items-center justify-center text-center min-h-[140px] border border-[var(--border)] hover:border-[var(--accent-blue)] hover:shadow-lg hover:shadow-[var(--glow-blue)] transition-all duration-300 rounded-xl"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] flex items-center justify-center mb-3 flex-shrink-0">
                  <span className="text-white font-bold font-sora text-lg">{client.name.charAt(0)}</span>
                </div>
                <h4 className="font-bold font-sora text-[var(--text-primary)] text-sm mb-1">{client.name}</h4>
                <p className="text-xs text-[var(--text-secondary)]">{client.category}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 - TESTIMONIALS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-6xl md:text-7xl font-bold heading-section font-sora mb-6">
              What Clients Say
            </h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
              Real results from businesses we've helped grow
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <TestimonialCard
                key={`${t.author}-${i}`}
                quote={t.quote}
                author={t.author}
                role={t.role}
                company={t.company}
                rating={t.rating}
                delay={(i % 3) * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5.5 - RESULTS METRICS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-card)]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-5xl md:text-6xl font-bold heading-section font-sora mb-6">Proven Results</h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
              The real impact we deliver for our clients
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { metric: '+300%', label: 'Average Booking Growth', icon: '📈' },
              { metric: '80%+', label: 'Inquiries Handled by AI', icon: '🤖' },
              { metric: '24/7', label: 'Automated Response Time', icon: '⚡' },
              { metric: '100%', label: 'Client Ownership', icon: '✓' },
            ].map((item, i) => (
              <motion.div
                key={item.metric}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ translateY: -4 }}
                className="glass-card p-8 text-center border border-[var(--border)] hover:border-[var(--accent-blue)] hover:shadow-lg hover:shadow-[var(--glow-blue)] transition-all duration-300 rounded-xl"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <p className="text-4xl font-bold font-sora gradient-text mb-3">{item.metric}</p>
                <p className="text-[var(--text-secondary)] font-semibold">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 - FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-6xl md:text-7xl font-bold heading-section font-sora mb-6">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: 'How long does a project typically take?',
                a: 'Timeline depends on scope. Websites: 2-4 weeks. Logos: 5-10 days. Chatbots: 1-3 weeks. We provide exact timelines during consultation.',
              },
              {
                q: 'Do you work with businesses outside South Africa?',
                a: 'Yes! We serve clients across Africa and internationally. Time zones aren\'t an issue - we work asynchronously and via WhatsApp.',
              },
              {
                q: 'What if I\'m not happy with the final product?',
                a: 'We include unlimited revisions in our packages. We don\'t stop until you\'re 100% satisfied.',
              },
              {
                q: 'Do I own the final deliverables?',
                a: 'Absolutely! Once you pay in full, you own everything. We only ask to use completed work in our portfolio.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept bank transfer, Stripe card payments, and EFT. Flexible payment plans available for larger projects.',
              },
              {
                q: 'Do you provide support after the project is complete?',
                a: 'Yes! All services include 30-day post-launch support. After that, we\'re available for maintenance and updates.',
              },
              {
                q: 'What if the project costs more than my budget?',
                a: 'We always quote exactly what you need before starting. No hidden fees. If you have budget constraints, we\'ll scope the project to fit — launch smaller now, add features later. Payment plans available for larger projects.',
              },
              {
                q: 'How do I know MuleSoo can deliver on promises?',
                a: 'Check our portfolio — every project is a real business we built. Our clients (Yoyo Gym, Shime Events, Tsedi Catering) run live systems right now. We also include unlimited revisions — you only pay when 100% satisfied.',
              },
              {
                q: 'What happens if something breaks after launch?',
                a: 'All projects come with 30 days of free fixes. After that, we offer affordable maintenance plans. Plus, you own the source code — if you ever need another developer, they can step in anytime.',
              },
              {
                q: 'How do I get started?',
                a: 'Book a free 30-min consultation at /contact. No pitch, just a real conversation about your goals, timeline, and budget. We\'ll give you a custom quote and timeline before you commit to anything.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="glass-card p-6 hover:border-[rgba(0,200,255,0.28)] transition-all"
              >
                <h3 className="font-bold text-[var(--text-primary)] mb-3 text-lg">{item.q}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">{item.a}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-12 p-8 glass-card border border-[rgba(0,200,255,0.22)] text-center"
          >
            <p className="text-[var(--text-secondary)] mb-4">Still have questions?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} className="w-full">
                <a
                  href={`mailto:${settings.email}`}
                  className="btn-primary w-full px-6 py-3 text-[15px] block"
                >
                  <Mail size={18} /> Email Us
                </a>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-[#25D366] text-white font-bold rounded-lg transition-shadow hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} /> WhatsApp Us
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 6.3 - GUARANTEE */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[var(--accent-blue)]/5 to-[var(--accent-purple)]/5 border-t border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/30">
              <span className="text-lg">🛡️</span>
              <span className="text-sm font-bold text-[var(--accent-green)]">OUR GUARANTEE</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-bold font-sora text-[var(--text-primary)] mb-4">
              100% Satisfaction or Your Money Back
            </h3>
            <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto leading-relaxed">
              If you're not 100% happy with the final deliverable, we'll refund your deposit in full. No questions asked. We only get paid when you're thrilled with the results. That's how confident we are in our work.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              {[
                { icon: '✓', label: 'Unlimited Revisions', desc: 'We refine until perfect.' },
                { icon: '✓', label: '30-Day Support', desc: 'Free fixes post-launch.' },
                { icon: '✓', label: 'You Own Everything', desc: 'Full source code included.' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-[var(--accent-green)] mb-2">{item.icon}</div>
                  <p className="font-bold text-[var(--text-primary)] mb-1">{item.label}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 6.5 - COMPARISON */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--bg-secondary)]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-5xl md:text-6xl font-bold heading-section font-sora mb-6">The Smart Choice</h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
              Agency quality, freelancer value — plus AI automation neither one offers.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="overflow-x-auto glass-card rounded-2xl"
          >
            <table className="w-full border-collapse min-w-[560px]">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left p-4 text-[var(--text-secondary)] font-sora font-semibold text-sm">Feature</th>
                  <th className="p-4 text-center font-sora font-bold text-[var(--accent-gold)] bg-[var(--glow-gold)]">MuleSoo</th>
                  <th className="p-4 text-center font-sora font-semibold text-[var(--text-secondary)] text-sm">Freelancer</th>
                  <th className="p-4 text-center font-sora font-semibold text-[var(--text-secondary)] text-sm">Big Agency</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { f: 'World-class, custom design', m: 'yes', fr: 'maybe', a: 'yes' },
                  { f: 'Fast delivery (weeks, not months)', m: 'yes', fr: 'maybe', a: 'no' },
                  { f: 'Affordable, transparent pricing', m: 'yes', fr: 'yes', a: 'no' },
                  { f: 'AI booking & automation', m: 'yes', fr: 'no', a: 'no' },
                  { f: 'Admin dashboard included', m: 'yes', fr: 'no', a: 'maybe' },
                  { f: 'You own the code & data', m: 'yes', fr: 'maybe', a: 'no' },
                  { f: 'POPIA-compliant', m: 'yes', fr: 'no', a: 'yes' },
                  { f: 'Ongoing support', m: 'yes', fr: 'no', a: 'yes' },
                ].map((row, i) => {
                  const cell = (v: string) =>
                    v === 'yes' ? <Check size={20} className="text-[var(--accent-green)] mx-auto" />
                    : v === 'no' ? <X size={20} className="text-red-400/70 mx-auto" />
                    : <span className="text-[var(--text-secondary)] text-sm">Sometimes</span>;
                  return (
                    <tr key={i} className="border-b border-[var(--border)] last:border-0">
                      <td className="p-4 text-sm text-[var(--text-primary)]">{row.f}</td>
                      <td className="p-4 text-center bg-[var(--glow-gold)]/30">{cell(row.m)}</td>
                      <td className="p-4 text-center">{cell(row.fr)}</td>
                      <td className="p-4 text-center">{cell(row.a)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* SECTION 6.7 - AI AUTOMATION LIBRARY CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center glass-card rounded-2xl border border-[rgba(0,200,255,0.22)] p-10 md:p-14"
        >
          <span className="inline-flex items-center gap-2 pill-soft px-4 py-2 rounded-full mb-6">
            <Zap size={16} className="text-[var(--accent-blue)]" />
            <span className="text-[var(--accent-blue)] font-sora text-sm font-bold">200 AI Automation Systems</span>
          </span>
          <h2 className="text-4xl md:text-5xl font-bold heading-section font-sora mb-5">
            Not sure what you need? Explore what we can build.
          </h2>
          <p className="text-[var(--text-secondary)] text-lg mb-8 max-w-2xl mx-auto">
            Smart booking, payment, support and workflow systems for every industry — or request a fully
            custom build designed around your exact process.
          </p>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              href="/ai-automation"
              className="btn-primary px-9 py-3.5 text-base inline-block"
            >
              What do you want us to build for you? →
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* FAQ — visible + FAQPage schema (helps Google & AI answer engines) */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <FaqSection items={HOME_FAQS} />
      </section>

      {/* SECTION 7 - FINAL CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-y border-[var(--border)]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-5xl md:text-7xl font-bold heading-section font-sora mb-8">
            Ready to Build Something Great?
          </h2>
          <p className="text-[var(--text-secondary)] text-lg md:text-xl mb-10 font-light">
            Let's discuss your project. We respond within 2 hours and deliver excellence.
          </p>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              href="/contact"
              className="btn-primary px-10 py-3.5 text-base inline-block"
            >
              Start Your Project
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
