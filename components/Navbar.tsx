'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Store', href: '/store' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[rgba(5,8,16,0.85)] backdrop-blur-[20px] border-b border-[var(--border)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group hover:opacity-80 transition-opacity">
            <div className="w-10 h-10">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <defs>
                  <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#00C8FF',stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'#00A8D8',stopOpacity:1}} />
                  </linearGradient>
                  <linearGradient id="purpleGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" style={{stopColor:'#7B2FFF',stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'#A855F7',stopOpacity:1}} />
                  </linearGradient>
                </defs>
                <circle cx="70" cy="100" r="35" fill="url(#purpleGradient)" opacity="0.9"/>
                <circle cx="130" cy="100" r="35" fill="url(#blueGradient)" opacity="0.9"/>
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
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[var(--text-secondary)] hover:text-[var(--accent-blue)] transition-colors duration-200 text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button (Desktop) */}
          <div className="hidden md:block">
            <Link
              href="/contact"
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold text-sm font-sora hover:scale-105 transition-transform duration-200 hover:shadow-[0_0_30px_var(--glow-blue)]"
            >
              Get a Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-[var(--accent-blue)]"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 right-0 w-full h-screen bg-[var(--bg-secondary)] z-40 md:hidden flex flex-col pt-20 px-6"
            >
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-6 right-6 text-[var(--accent-blue)]"
              >
                <X size={28} />
              </button>

              <div className="flex flex-col gap-6 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[var(--text-primary)] text-lg font-sora font-bold hover:text-[var(--accent-blue)] transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold text-center font-sora mt-6"
                  onClick={() => setMenuOpen(false)}
                >
                  Get a Quote
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
