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
              <div className="w-12 h-12">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <defs>
                    <linearGradient id="blueGradientFooter" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor:'#00C8FF',stopOpacity:1}} />
                      <stop offset="100%" style={{stopColor:'#00A8D8',stopOpacity:1}} />
                    </linearGradient>
                    <linearGradient id="purpleGradientFooter" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" style={{stopColor:'#7B2FFF',stopOpacity:1}} />
                      <stop offset="100%" style={{stopColor:'#A855F7',stopOpacity:1}} />
                    </linearGradient>
                  </defs>
                  <circle cx="70" cy="100" r="35" fill="url(#purpleGradientFooter)" opacity="0.9"/>
                  <circle cx="130" cy="100" r="35" fill="url(#blueGradientFooter)" opacity="0.9"/>
                  <circle cx="55" cy="85" r="4" fill="#00C8FF"/>
                  <circle cx="70" cy="70" r="4" fill="#7B2FFF"/>
                  <circle cx="85" cy="85" r="4" fill="#00FF88"/>
                  <circle cx="115" cy="85" r="4" fill="#00C8FF"/>
                  <circle cx="130" cy="70" r="4" fill="#7B2FFF"/>
                  <circle cx="145" cy="85" r="4" fill="#00FF88"/>
                  <line x1="55" y1="85" x2="100" y2="100" stroke="#00C8FF" strokeWidth="2" opacity="0.6"/>
                  <line x1="70" y1="70" x2="100" y2="100" stroke="#7B2FFF" strokeWidth="2" opacity="0.6"/>
                  <line x1="145" y1="85" x2="100" y2="100" stroke="#00C8FF" strokeWidth="2" opacity="0.6"/>
                  <line x1="130" y1="70" x2="100" y2="100" stroke="#7B2FFF" strokeWidth="2" opacity="0.6"/>
                  <path d="M 80 100 Q 70 90 80 80 Q 90 70 100 80 Q 110 70 120 80 Q 130 90 120 100 Q 110 110 100 100 Q 90 110 80 100" fill="none" stroke="#E8B84B" strokeWidth="2.5" opacity="0.8"/>
                </svg>
              </div>
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
                href="https://wa.me/27123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[var(--accent-blue)] transition-colors"
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
                { label: 'Privacy Policy', href: '#' },
                { label: 'Terms', href: '#' },
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
                  href="mailto:hello@mulesoo.com"
                  className="text-[var(--text-secondary)] hover:text-[var(--accent-blue)] transition-colors text-sm"
                >
                  hello@mulesoo.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-[var(--accent-blue)] mt-1 flex-shrink-0" />
                <a
                  href="https://wa.me/27123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-secondary)] hover:text-[var(--accent-blue)] transition-colors text-sm"
                >
                  +27 12 345 6789
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
          <p className="text-[var(--text-secondary)]">
            Built with Claude Code 🤖
          </p>
        </div>
      </div>
    </footer>
  );
}
