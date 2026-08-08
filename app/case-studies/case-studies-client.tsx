'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import PageHero from '@/components/PageHero';

export default function CaseStudiesClient() {
  const caseStudies = [
    {
      id: 'yoyo-gym',
      title: 'Yoyo Gym: Automate Membership Management',
      client: 'Yoyo Gym - Premium Fitness Brand',
      industry: 'Fitness & Wellness',
      challenge: 'Manual booking system causing no-shows, lost revenue from cancelled sessions, no automated reminders',
      solution: 'Built custom membership platform with AI booking assistant, automated SMS reminders, and face-check-in system',
      results: [
        { metric: '+300%', label: 'Booking Increase' },
        { metric: '95%+', label: 'Attendance Rate' },
        { metric: '-80%', label: 'Admin Time' },
        { metric: '24/7', label: 'Availability' },
      ],
      timeline: '3 weeks',
      technologies: ['Next.js', 'Supabase', 'Stripe', 'Claude API', 'Face Recognition'],
      testimonial: {
        quote: 'MuleSoo completely transformed our operations. Bookings tripled, no-shows almost disappeared, and I spend 80% less time on admin work.',
        author: 'Kgosi Moeng',
        role: 'Owner, Yoyo Gym',
      },
      image: '/yoyo-gym.jpg',
      highlight: 'Face-recognition check-in eliminates fake bookings and keeps the gym premium',
    },
    {
      id: 'shime-events',
      title: 'Shime Events: Bilingual AI Booking Engine',
      client: 'Shime Events - Luxury Event Planning',
      industry: 'Events & Celebrations',
      challenge: 'Lost leads to manual booking delays, no online payment collection, language barrier with diverse customer base',
      solution: 'Bilingual (English & Amharic) AI chatbot that takes bookings, collects deposits, and generates branded PDF contracts',
      results: [
        { metric: '100%', label: 'Leads Captured' },
        { metric: '2-hour', label: 'Response Time' },
        { metric: '80%', label: 'Self-Service' },
        { metric: '10x', label: 'Faster Quotes' },
      ],
      timeline: '2 weeks',
      technologies: ['Next.js', 'Claude API', 'Bilingual NLP', 'PDF Generation', 'WhatsApp API'],
      testimonial: {
        quote: "The AI chatbot handles every enquiry flawlessly — in English and Amharic. It's like having a dedicated booking agent working 24/7.",
        author: 'Thabo Sithole',
        role: 'Founder, Shime Events',
      },
      image: '/shime-events.jpg',
      highlight: 'Bilingual AI means no customer is turned away by language barriers',
    },
    {
      id: 'tsedi-catering',
      title: 'Tsedi Catering: Order & Delivery Management',
      client: 'Tsedi Catering - Premium Catering Service',
      industry: 'Food & Hospitality',
      challenge: 'Phone orders only, no online ordering, difficult to track delivery logistics',
      solution: 'Full-stack ordering platform with real-time delivery tracking, menu management, and automated invoicing',
      results: [
        { metric: '+200%', label: 'Online Orders' },
        { metric: '30 min', label: 'Faster Delivery' },
        { metric: '99%', label: 'On-Time Rate' },
        { metric: 'R50K+', label: 'Monthly Revenue' },
      ],
      timeline: '4 weeks',
      technologies: ['Next.js', 'Supabase', 'Stripe', 'Google Maps', 'Realtime Tracking'],
      testimonial: {
        quote: 'They delivered faster than any freelancer and better quality than any agency we tried. Our online orders grew 200% in the first month.',
        author: 'Alem Tekle',
        role: 'Manager, Tsedi Catering',
      },
      image: '/tsedi.jpg',
      highlight: 'Real-time GPS tracking builds customer trust and reduces "where is my order" calls',
    },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHero
          title="Case Studies"
          subtitle="Real businesses, real results. See how MuleSoo transformed operations and revenue for clients like Yoyo Gym, Shime Events, and Tsedi Catering."
        />

        <div className="space-y-20 mt-16">
          {caseStudies.map((study, idx) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <div className={idx % 2 === 1 ? 'lg:order-2' : ''}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-[var(--glow-action)] border border-[var(--color-action-on-dark)]/40"
                >
                  <span className="text-sm font-bold text-[var(--color-action-on-dark)]">{study.industry}</span>
                </motion.div>

                <h2 className="text-4xl md:text-5xl font-bold font-sora text-[var(--text-primary)] mb-3 gradient-text">
                  {study.title}
                </h2>
                <p className="text-lg text-[var(--text-secondary)] mb-6 leading-relaxed">
                  {study.highlight}
                </p>

                <div className="space-y-6 mb-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    viewport={{ once: true }}
                    className="glass-card p-5 border border-[var(--border)] hover:border-[var(--color-action-on-dark)] transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-1 h-1 rounded-full bg-[var(--color-action-primary)] mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[var(--color-action-on-dark)] uppercase tracking-wide mb-2">Challenge</p>
                        <p className="text-[var(--text-secondary)]">{study.challenge}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="glass-card p-5 border border-[var(--border)] hover:border-[var(--accent-purple)] transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-1 h-1 rounded-full bg-[var(--accent-purple)] mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[var(--accent-purple)] uppercase tracking-wide mb-2">Solution</p>
                        <p className="text-[var(--text-secondary)]">{study.solution}</p>
                      </div>
                    </div>
                  </motion.div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {study.results.map((result, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.25 + i * 0.05 }}
                        viewport={{ once: true }}
                        className="glass-card p-4 text-center"
                      >
                        <p className="text-2xl font-bold font-sora gradient-text mb-2">{result.metric}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{result.label}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="mb-8"
                >
                  <p className="text-sm font-bold text-[var(--accent-gold)] uppercase tracking-wide mb-3">Tech Stack</p>
                  <div className="flex flex-wrap gap-2">
                    {study.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--glow-purple)] border border-[var(--accent-purple)]/40 text-[var(--accent-purple)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                  viewport={{ once: true }}
                  className="glass-card p-6 border border-[var(--border)] bg-[var(--glow-action)]/5"
                >
                  <p className="text-[var(--text-primary)] italic mb-4">"{study.testimonial.quote}"</p>
                  <p className="font-bold text-[var(--text-primary)]">{study.testimonial.author}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{study.testimonial.role}</p>
                </motion.div>
              </div>

              <div className={idx % 2 === 1 ? 'lg:order-1' : ''}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className="relative rounded-2xl overflow-hidden border border-[var(--border)] hover:border-[var(--color-action-on-dark)] transition-all"
                >
                  <Image
                    src={study.image}
                    alt={study.client}
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="font-bold text-white text-lg mb-1">{study.client}</p>
                    <div className="flex items-center gap-2 text-sm text-[var(--accent-green)]">
                      <Clock size={16} />
                      <span>Timeline: {study.timeline}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-24 glass-card p-12 text-center border border-[var(--color-action-on-dark)]"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-sora mb-4 gradient-text">
            Your Business Could Be Next
          </h2>
          <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
            See what's possible when you pair premium design with AI automation.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-10 py-4 bg-[var(--color-action-primary)] hover:bg-[var(--color-action-hover)] text-[var(--color-action-ink)] font-bold font-sora rounded-lg hover:scale-105 transition-transform text-lg"
          >
            Start Your Case Study <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
