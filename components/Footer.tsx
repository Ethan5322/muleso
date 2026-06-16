'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Phone, Heart, Camera, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border)] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1 - Brand */}
          <div>
            <div className="flex items-center mb-4">
              <Image
                src="/mulesoo-logo.png"
                alt="MuleSoo Logo"
                width={80}
                height={80}
                className="h-16 w-auto object-contain"
              />
            </div>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">
              Building world-class digital products for Africa&apos;s boldest businesses.
            </p>
            <div className="flex gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[var(--accent-blue)] transition-colors"
              >
                <Heart size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[var(--accent-blue)] transition-colors"
              >
                💬
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[var(--accent-blue)] transition-colors"
              >
                <Camera size={18} />
              </a>
              <a
                href="https://wa.me/27759440377"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[#25D366] transition-colors"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Column 2 - Services */}
          <div>
            <h3 className="text-[var(--accent-gold)] text-xs font-bold uppercase tracking-widest mb-4 font-sora">
              Services
            </h3>
            <ul className="space-y-3">
              {['Website Design', 'AI Chatbots', 'Logo Design', 'QR Codes', 'Custom Email', 'PDF Guides'].map(
                (service) => (
                  <li key={service}>
                    <Link
                      href="/services"
                      className="text-[var(--text-secondary)] hover:text-[var(--accent-blue)] transition-colors text-sm"
                    >
                      {service}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Column 3 - Company */}
          <div>
            <h3 className="text-[var(--accent-gold)] text-xs font-bold uppercase tracking-widest mb-4 font-sora">
              Company
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Portfolio', href: '/portfolio' },
                { label: 'PDF Store', href: '/store' },
                { label: 'Contact', href: '/contact' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[var(--text-secondary)] hover:text-[var(--accent-blue)] transition-colors text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h3 className="text-[var(--accent-gold)] text-xs font-bold uppercase tracking-widest mb-4 font-sora">
              Get In Touch
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-[var(--accent-blue)] mt-1 flex-shrink-0" />
                <a
                  href="mailto:mulukenendashaw68@gmail.com"
                  className="text-[var(--text-secondary)] hover:text-[var(--accent-blue)] transition-colors text-sm"
                >
                  mulukenendashaw68@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-[#25D366] mt-1 flex-shrink-0" />
                <a
                  href="https://wa.me/27759440377"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-secondary)] hover:text-[#25D366] transition-colors text-sm"
                >
                  +27 759 440 377 (WhatsApp)
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[var(--accent-blue)] mt-1 flex-shrink-0" />
                <p className="text-[var(--text-secondary)] text-sm">Pretoria, South Africa</p>
              </div>
              <p className="text-[var(--accent-green)] text-xs font-semibold pt-2">⚡ Reply within 2 hours</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--border)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-[var(--text-secondary)]">
            © 2025 MuleSoo Digital Services. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
