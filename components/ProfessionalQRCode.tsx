'use client';

import { useState, useEffect } from 'react';
import { Download, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { generateProfessionalQR, downloadQRCode } from '@/lib/generateProfessionalQR';
import toast from 'react-hot-toast';

interface ProfessionalQRCodeProps {
  url: string;
  title?: string;
  description?: string;
  bookingReference?: string;
  size?: number;
}

export default function ProfessionalQRCode({
  url,
  title = 'Scan to Visit MuleSoo',
  description = 'Frame this QR code and let your clients scan to visit our website',
  bookingReference,
  size = 280,
}: ProfessionalQRCodeProps) {
  const [qrImage, setQrImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const generateQR = async () => {
      try {
        setIsLoading(true);
        const qr = await generateProfessionalQR({
          url,
          size,
          color: {
            dark: '#00C8FF',
            light: '#FFFFFF',
          },
        });
        setQrImage(qr);
      } catch (error) {
        console.error('Failed to generate QR code:', error);
        toast.error('Failed to generate QR code');
      } finally {
        setIsLoading(false);
      }
    };

    generateQR();
  }, [url, size]);

  const handleDownload = async () => {
    try {
      const filename = bookingReference
        ? `MuleSoo-QR-${bookingReference}.png`
        : 'MuleSoo-QR-Code.png';
      await downloadQRCode(url, filename);
      toast.success('📥 QR code downloaded! Ready to print and frame.');
    } catch (error) {
      toast.error('Failed to download QR code');
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('✓ URL copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Card Container */}
      <div className="glass-card p-8 rounded-2xl border border-[var(--border)] space-y-6">
        {/* Title */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-[var(--text-primary)] font-sora">
            {title}
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">{description}</p>
        </div>

        {/* QR Code Container */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="relative"
          >
            {/* Professional Frame Effect */}
            <div className="relative bg-white p-6 rounded-xl shadow-2xl border-4 border-[var(--accent-gold)]">
              {/* Company Badge on Frame */}
              <div className="absolute -top-4 -left-4 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg">
                MULESOO
              </div>

              {/* QR Code */}
              {isLoading ? (
                <div className="w-64 h-64 bg-[var(--bg-card)] rounded-lg flex items-center justify-center animate-pulse">
                  <span className="text-[var(--text-secondary)] text-sm">
                    Generating QR...
                  </span>
                </div>
              ) : (
                <img
                  src={qrImage}
                  alt="MuleSoo QR Code"
                  className="w-64 h-64 rounded-lg"
                  style={{ imageRendering: 'crisp-edges' }}
                />
              )}

              {/* Booking Reference Badge (if provided) */}
              {bookingReference && (
                <div className="absolute -bottom-4 -right-4 bg-[var(--accent-gold)] text-black px-3 py-1 rounded-lg text-xs font-bold shadow-lg">
                  #{bookingReference}
                </div>
              )}
            </div>

            {/* Corner Decorations */}
            <div className="absolute -top-2 -right-2 w-8 h-8 border-2 border-[var(--accent-blue)] rounded-full opacity-50" />
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-2 border-[var(--accent-purple)] rounded-full opacity-50" />
          </motion.div>
        </div>

        {/* URL Display */}
        <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-4">
          <p className="text-xs text-[var(--text-secondary)] mb-2 font-semibold uppercase">
            Links To:
          </p>
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-[var(--text-primary)] truncate font-mono">{url}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyUrl}
              className="p-2 hover:bg-[var(--glow-blue)] rounded-lg transition-colors flex-shrink-0"
            >
              {copied ? (
                <Check size={16} className="text-[var(--accent-green)]" />
              ) : (
                <Copy size={16} className="text-[var(--accent-blue)]" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-[var(--glow-blue)] border border-[var(--accent-blue)] rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold text-[var(--accent-blue)]">📋 How to Use:</p>
          <ol className="text-xs text-[var(--text-secondary)] space-y-1">
            <li>✓ Download the QR code image</li>
            <li>✓ Print at high resolution (300 DPI recommended)</li>
            <li>✓ Frame it in your office or business space</li>
            <li>✓ Clients can scan with any smartphone camera</li>
            <li>✓ They'll be directed to your website instantly</li>
          </ol>
        </div>

        {/* Download Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDownload}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          <Download size={20} />
          Download QR Code (Print Quality)
        </motion.button>

        {/* Additional Info */}
        <div className="text-center space-y-1">
          <p className="text-xs text-[var(--text-secondary)]">
            High resolution PNG • Transparent background ready
          </p>
          <p className="text-xs text-[var(--accent-gold)] font-semibold">
            Professional grade • Print & frame ready
          </p>
        </div>
      </div>

      {/* Share Options */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const text = `Check out MuleSoo Digital Services - World-class web design, AI chatbots, and digital solutions. ${url}`;
            if (navigator.share) {
              navigator.share({ title: 'MuleSoo', text });
            } else {
              navigator.clipboard.writeText(text);
              toast.success('Copied to clipboard!');
            }
          }}
          className="p-3 bg-[var(--glow-blue)] border border-[var(--accent-blue)] rounded-lg hover:bg-[var(--bg-card)] transition-all text-center"
        >
          <p className="text-xs font-bold text-[var(--accent-blue)]">📤 Share</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const whatsappText = `Check out MuleSoo! 🚀 ${url}`;
            window.open(
              `https://wa.me/?text=${encodeURIComponent(whatsappText)}`,
              '_blank'
            );
          }}
          className="p-3 bg-[var(--glow-gold)] border border-[var(--accent-gold)] rounded-lg hover:bg-[var(--bg-card)] transition-all text-center"
        >
          <p className="text-xs font-bold text-[var(--accent-gold)]">💬 WhatsApp</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const emailText = `Discover MuleSoo Digital Services\n\nVisit: ${url}\n\nWorld-class web design, AI chatbots, and digital solutions.`;
            window.location.href = `mailto:?subject=Check out MuleSoo&body=${encodeURIComponent(emailText)}`;
          }}
          className="p-3 bg-[var(--glow-purple)] border border-[var(--accent-purple)] rounded-lg hover:bg-[var(--bg-card)] transition-all text-center"
        >
          <p className="text-xs font-bold text-[var(--accent-purple)]">📧 Email</p>
        </motion.button>
      </div>
    </motion.div>
  );
}
