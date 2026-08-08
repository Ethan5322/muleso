'use client';

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

interface VideoTestimonial {
  id: string;
  clientName: string;
  role: string;
  company: string;
  videoUrl: string; // YouTube or Vimeo embed URL
  thumbnail: string; // Placeholder image
  quote: string;
}

interface VideoTestimonialSectionProps {
  testimonials?: VideoTestimonial[];
  title?: string;
  subtitle?: string;
}

// Default placeholder testimonials (replace with real video URLs when available)
const DEFAULT_TESTIMONIALS: VideoTestimonial[] = [
  {
    id: '1',
    clientName: 'Kgosi Moeng',
    role: 'Owner',
    company: 'Yoyo Gym',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Replace with real video
    thumbnail: '/yoyo-gym.jpg',
    quote: 'The website design is clean, the AI chatbot handles FAQs automatically, and our phone stopped ringing with basic questions.',
  },
  {
    id: '2',
    clientName: 'Thabo Sithole',
    role: 'Founder',
    company: 'Shime Events',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Replace with real video
    thumbnail: '/shime-events.jpg',
    quote: 'The chatbot handles everything. Customers love the instant responses. We haven\'t missed a single lead since we launched it.',
  },
  {
    id: '3',
    clientName: 'Alem Tekle',
    role: 'Manager',
    company: 'Tsedi Catering',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Replace with real video
    thumbnail: '/tsedi.jpg',
    quote: 'Faster than any freelancer, better quality than any agency. They delivered our website in 10 days and the chatbot integration was seamless.',
  },
];

export default function VideoTestimonialSection({
  testimonials = DEFAULT_TESTIMONIALS,
  title = 'Watch Our Clients Tell Their Story',
  subtitle = 'Real business owners sharing real results',
}: VideoTestimonialSectionProps) {
  const [selectedVideo, setSelectedVideo] = React.useState<string | null>(null);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold font-sora mb-6 gradient-text">{title}</h2>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col"
            >
              {/* Video Thumbnail */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedVideo(testimonial.videoUrl)}
                className="relative mb-6 cursor-pointer rounded-2xl overflow-hidden group"
              >
                <img
                  src={testimonial.thumbnail}
                  alt={testimonial.clientName}
                  className="w-full h-64 object-cover group-hover:brightness-75 transition-all"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition-all">
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="w-16 h-16 rounded-full bg-[var(--color-action-primary)] flex items-center justify-center"
                  >
                    <Play size={28} className="text-white ml-1" />
                  </motion.div>
                </div>
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[var(--color-action-primary)] text-white text-xs font-bold">
                  Video
                </div>
              </motion.div>

              {/* Client Info Card */}
              <motion.div
                whileHover={{ translateY: -4 }}
                className="glass-card p-6 border border-[var(--border)] hover:border-[var(--color-action-primary)] transition-all flex-1"
              >
                <p className="text-[var(--text-secondary)] italic mb-4 leading-relaxed">"{testimonial.quote}"</p>
                <div className="border-t border-[var(--border)] pt-4">
                  <p className="font-bold text-[var(--text-primary)]">{testimonial.clientName}</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Video Modal */}
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedVideo(null)}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl aspect-video"
            >
              <iframe
                width="100%"
                height="100%"
                src={selectedVideo}
                title="Client Testimonial Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-xl"
              />
            </motion.div>
          </motion.div>
        )}

        {/* Call-to-Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-[var(--text-secondary)] mb-4">Ready to become our next success story?</p>
          <a
            href="/contact"
            className="inline-block px-10 py-4 bg-[var(--color-action-primary)] hover:bg-[var(--color-action-hover)] text-[var(--color-action-ink)] font-bold font-sora rounded-lg hover:scale-105 transition-transform"
          >
            Schedule Your Consultation
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// Also export individual VideoTestimonial component for use elsewhere
export function VideoTestimonialCard({ testimonial }: { testimonial: VideoTestimonial }) {
  const [isPlaying, setIsPlaying] = React.useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-card p-6 border border-[var(--border)] hover:border-[var(--color-action-primary)] transition-all cursor-pointer"
      onClick={() => setIsPlaying(!isPlaying)}
    >
      {isPlaying ? (
        <div className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={testimonial.videoUrl}
            title={testimonial.clientName}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          />
        </div>
      ) : (
        <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
          <img
            src={testimonial.thumbnail}
            alt={testimonial.clientName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition-all">
            <Play size={24} className="text-white ml-1" />
          </div>
        </div>
      )}
      <p className="text-[var(--text-secondary)] italic mb-3">"{testimonial.quote}"</p>
      <p className="font-bold text-[var(--text-primary)]">{testimonial.clientName}</p>
      <p className="text-sm text-[var(--text-secondary)]">
        {testimonial.role} at {testimonial.company}
      </p>
    </motion.div>
  );
}

// Import React for useState
import React from 'react';
