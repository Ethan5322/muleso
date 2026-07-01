'use client';

import Link from 'next/link';
import { motion, useInView, useAnimation } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Globe, Bot, Palette, FileText, QrCode, Mail, Star, Search, Layers, Code2, Rocket, MessageCircle, AppWindow, CreditCard, CheckCircle, Gauge, ShieldCheck, Clock, Zap } from 'lucide-react';
import { useSiteSettings } from '@/lib/useSiteSettings';

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
      <div className="text-6xl font-bold gradient-text font-sora mb-3">{value}</div>
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
      className="glass-card p-8 hover:border-[var(--accent-blue)] transition-all duration-300"
    >
      <div className="flex gap-1 mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} size={16} className="fill-[var(--accent-gold)] text-[var(--accent-gold)]" />
        ))}
      </div>
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
      className="glass-card p-8 hover:border-[var(--accent-blue)] hover:glow-blue transition-all duration-300 hover:-translate-y-2 group"
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
  { quote: 'MuleSoo completely transformed our online presence. Our bookings tripled within 3 months. Professional, fast, and incredibly responsive.', author: 'Sarah Mkhize', role: 'CEO', company: 'Luxury Events SA', rating: 5 },
  { quote: 'The AI chatbot they built for us handles 80% of customer inquiries automatically. Best investment we have made. Highly recommend!', author: 'James Okonkwo', role: 'Manager', company: 'Tech Solutions Ltd', rating: 5 },
  { quote: 'From concept to launch in 2 weeks. The attention to detail is insane. Our logo and website are exactly what we needed. Worth every cent.', author: 'Patricia Nkosi', role: 'Founder', company: 'Beauty & Wellness Co', rating: 5 },
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
        <div className="max-w-5xl mx-auto w-full text-center">
          <motion.div className="space-y-6">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-block"
            >
              <div className="border border-[var(--accent-blue)] bg-[var(--glow-blue)] px-4 py-2 rounded-full w-fit mx-auto flex items-center gap-2">
                <Rocket size={16} className="text-[var(--accent-blue)]" />
                <span className="text-[var(--accent-blue)] font-sora text-sm font-bold">
                  {settings.hero_badge}
                </span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-bold font-sora leading-tight gradient-text"
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
              <Link
                href="/services"
                className="px-10 py-4 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold font-sora rounded-lg hover:scale-105 transition-transform hover:shadow-[0_0_30px_var(--glow-blue)]"
              >
                Explore Services
              </Link>
              <Link
                href="/portfolio"
                className="px-10 py-4 border-2 border-[var(--accent-blue)] text-[var(--accent-blue)] font-bold font-sora rounded-lg hover:bg-[var(--glow-blue)] transition-colors"
              >
                View Our Work
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 1.5 - TRUST BAR */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-secondary)] mb-6">
            Trusted by businesses across South Africa
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {['Habesha Celebration Events', 'Shime Events', 'YoYo Gym', 'Tsedi Catering', 'DR. Hospital'].map(
              (brand) => (
                <span
                  key={brand}
                  className="font-sora font-bold text-base sm:text-lg text-[var(--text-secondary)] opacity-60 hover:opacity-100 transition-opacity"
                >
                  {brand}
                </span>
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
            <h2 className="text-6xl md:text-7xl font-bold gradient-text font-sora mb-6">
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
            <div className="inline-flex items-center gap-2 border border-[var(--accent-blue)] bg-[var(--glow-blue)] px-4 py-2 rounded-full mb-6">
              <Zap size={16} className="text-[var(--accent-blue)]" />
              <span className="text-[var(--accent-blue)] font-sora text-sm font-bold">Our AI Booking System</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold gradient-text font-sora mb-6">
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
                  <span className="absolute top-3 right-4 text-4xl font-bold font-sora text-[var(--border)]">
                    {i + 1}
                  </span>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-white" size={26} />
                  </div>
                  <h3 className="font-bold font-sora text-[var(--text-primary)] mb-2">{step.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{step.desc}</p>
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
            className="text-6xl md:text-7xl font-bold gradient-text text-center font-sora mb-20"
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
                className="relative"
              >
                <div className="glass-card p-6 h-full">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] flex items-center justify-center mb-4">
                    <span className="text-white font-bold font-sora">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-bold font-sora text-[var(--text-primary)] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)]">{step.desc}</p>
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
            <h2 className="text-5xl md:text-6xl font-bold gradient-text font-sora mb-6">
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
                  className="glass-card p-6 hover:border-[var(--accent-blue)] transition-all flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-lg bg-[var(--glow-blue)] flex items-center justify-center flex-shrink-0">
                    <Icon className="text-[var(--accent-blue)]" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold font-sora text-[var(--text-primary)] mb-1">{item.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5 - TESTIMONIALS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-6xl md:text-7xl font-bold gradient-text font-sora mb-6">
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
            <h2 className="text-6xl md:text-7xl font-bold gradient-text font-sora mb-6">
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
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="glass-card p-6 hover:border-[var(--accent-blue)] transition-all"
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
            className="mt-12 p-8 glass-card border border-[var(--accent-blue)] text-center"
          >
            <p className="text-[var(--text-secondary)] mb-4">Still have questions?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:mulukenendashaw68@gmail.com"
                className="inline-block px-6 py-3 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold rounded-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                <Mail size={18} /> Email Us
              </a>
              <a
                href="https://wa.me/27688529333"
                className="inline-block px-6 py-3 bg-[#25D366] text-white font-bold rounded-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} /> WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
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
          <h2 className="text-5xl md:text-7xl font-bold gradient-text font-sora mb-8">
            Ready to Build Something Great?
          </h2>
          <p className="text-[var(--text-secondary)] text-lg md:text-xl mb-10 font-light">
            Let's discuss your project. We respond within 2 hours and deliver excellence.
          </p>
          <Link
            href="/contact"
            className="inline-block px-12 py-4 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold font-sora rounded-lg hover:scale-105 transition-transform text-lg hover:shadow-[0_0_30px_var(--glow-blue)]"
          >
            Start Your Project
          </Link>
        </motion.div>
      </section>
    </>
  );
}
