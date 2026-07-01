'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react';
import { useSiteSettings } from '@/lib/useSiteSettings';

const LinkedInIcon = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0V8zm7.5 0h4.78v2.2h.07c.67-1.2 2.3-2.46 4.74-2.46C21.4 7.74 24 10 24 14.6V24h-5v-8.4c0-2-.04-4.6-2.8-4.6-2.8 0-3.2 2.18-3.2 4.44V24h-5V8z" />
  </svg>
);
const XIcon = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);
const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.43-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 4.32a5.52 5.52 0 100 11.04 5.52 5.52 0 000-11.04zm0 9.1a3.58 3.58 0 110-7.16 3.58 3.58 0 010 7.16zm7.03-9.32a1.29 1.29 0 11-2.58 0 1.29 1.29 0 012.58 0z" />
  </svg>
);

export default function Footer() {
  const s = useSiteSettings();
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
              {s.linkedin && (
                <a href={s.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                  className="text-[var(--text-secondary)] hover:text-[var(--accent-blue)] transition-colors">
                  <LinkedInIcon />
                </a>
              )}
              {s.twitter && (
                <a href={s.twitter} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)"
                  className="text-[var(--text-secondary)] hover:text-[var(--accent-blue)] transition-colors">
                  <XIcon />
                </a>
              )}
              {s.instagram && (
                <a href={s.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  className="text-[var(--text-secondary)] hover:text-[var(--accent-blue)] transition-colors">
                  <InstagramIcon />
                </a>
              )}
              {s.whatsapp && (
                <a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                  className="text-[var(--text-secondary)] hover:text-[#25D366] transition-colors">
                  <MessageCircle size={18} />
                </a>
              )}
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
                { label: 'AI Automation Library', href: '/ai-automation' },
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
                  href={`mailto:${s.email}`}
                  className="text-[var(--text-secondary)] hover:text-[var(--accent-blue)] transition-colors text-sm break-all"
                >
                  {s.email}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-[#25D366] mt-1 flex-shrink-0" />
                <a
                  href={`https://wa.me/${s.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-secondary)] hover:text-[#25D366] transition-colors text-sm"
                >
                  {s.phone} (WhatsApp)
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[var(--accent-blue)] mt-1 flex-shrink-0" />
                <p className="text-[var(--text-secondary)] text-sm">{s.address}</p>
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
