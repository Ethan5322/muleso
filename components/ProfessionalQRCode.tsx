'use client';

import { useState, useEffect, useRef } from 'react';
import { Download, Copy, Check, Printer, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showMobileButton, setShowMobileButton] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const generateQR = async () => {
      try {
        setIsLoading(true);
        const qr = await generateProfessionalQR({
          url,
          size,
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

  // Check if mobile
  useEffect(() => {
    const handleResize = () => {
      setShowMobileButton(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handlePrint = () => {
    if (!printRef.current) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>MuleSoo Business Card</title>
          <style>
            body { margin: 0; padding: 10px; background: #f5f5f5; font-family: Arial, sans-serif; }
            .card {
              width: 85mm; height: 55mm;
              background: #000; color: #fff;
              display: flex; align-items: center; justify-content: center;
              flex-direction: column;
              gap: 8px;
              border-radius: 4px;
              margin: 20px auto;
              padding: 0;
              box-sizing: border-box;
            }
            .logo { font-size: 24px; font-weight: bold; letter-spacing: 2px; background: linear-gradient(135deg, #00C8FF, #7B2FFF); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 4px; }
            .qr { width: 40mm; height: 40mm; }
            .website { font-size: 12px; color: #00C8FF; letter-spacing: 1px; margin-top: 4px; }
            .tagline { font-size: 9px; color: #aaa; }
            @media print { body { background: none; margin: 0; padding: 0; } }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="logo">MULESOO</div>
            <img src="${qrImage}" class="qr" />
            <div class="website">www.mulesoo.com</div>
            <div class="tagline">AI-Powered Digital Solutions</div>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 250);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md mx-auto"
      >
        {/* Title */}
        <div className="text-center space-y-2 mb-6 hidden md:block">
          <h3 className="text-xl font-bold text-[var(--text-primary)] font-sora">
            {title}
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">{description}</p>
        </div>

        {/* Premium QR Code Card */}
        <div className="relative">
          {/* Glow Background */}
          <div className="absolute -inset-4 bg-gradient-to-r from-[#00BFFF] via-[#7B2FBE] to-[#00BFFF] rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />

          {/* Card Container */}
          <div className="relative bg-[#0a0a0a] border border-[#00BFFF] rounded-2xl p-8 space-y-6 shadow-[0_0_30px_rgba(0,191,255,0.3)]">
            {/* Company Badge */}
            <div className="absolute -top-3 -left-3 bg-gradient-to-r from-[#00BFFF] to-[#7B2FBE] text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-lg">
              MULESOO
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center gap-6">
              {/* Loading State */}
              {isLoading ? (
                <div className="w-64 h-64 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-xl flex items-center justify-center animate-pulse border border-[#00BFFF]/20">
                  <span className="text-[var(--text-secondary)] text-sm">Generating Premium QR...</span>
                </div>
              ) : (
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative group"
                >
                  {/* QR Code with Glow */}
                  <div className="relative bg-white p-4 rounded-xl border border-[#00BFFF]/40 shadow-[0_0_20px_rgba(0,191,255,0.4)]">
                    <img
                      src={qrImage}
                      alt="MuleSoo QR Code"
                      className="w-64 h-64"
                      style={{ imageRendering: 'crisp-edges' }}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-4 rounded-lg bg-gradient-to-br from-[#00BFFF]/5 to-[#7B2FBE]/5 pointer-events-none" />
                  </div>

                  {/* Animated Glow Ring */}
                  <div className="absolute inset-0 rounded-xl border-2 border-[#00BFFF]/0 group-hover:border-[#00BFFF]/50 transition-all duration-500" />
                </motion.div>
              )}

              {/* Text Below QR */}
              <div className="text-center space-y-2">
                <p className="text-2xl font-bold font-sora bg-gradient-to-r from-[#00BFFF] to-[#7B2FBE] bg-clip-text text-transparent">
                  Scan to Visit MuleSoo
                </p>
                <p className="text-xs text-[#00BFFF]">www.mulesoo.com</p>
              </div>
            </div>

            {/* Booking Reference Badge */}
            {bookingReference && (
              <div className="text-center">
                <div className="inline-block bg-gradient-to-r from-[#00BFFF] to-[#7B2FBE] text-white px-3 py-1 rounded-lg text-xs font-bold">
                  #{bookingReference}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-[#00BFFF]/20">
              {/* Download Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownload}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#00BFFF] to-[#7B2FBE] text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#00BFFF]/50 transition-all disabled:opacity-50 text-sm"
              >
                <Download size={16} />
                Download Premium QR Code
              </motion.button>

              {/* Print Slip Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowPrintModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1a1a1a] border border-[#00BFFF]/40 text-[#00BFFF] font-bold rounded-lg hover:bg-[#2a2a2a] hover:border-[#00BFFF]/60 transition-all text-sm"
              >
                <Printer size={16} />
                Print Business Card
              </motion.button>

              {/* Copy URL Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCopyUrl}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#00BFFF]/30 text-[var(--text-secondary)] rounded-lg hover:border-[#00BFFF]/60 transition-all text-xs"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-[#00FF88]" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    Copy URL
                  </>
                )}
              </motion.button>
            </div>

            {/* Info Text */}
            <p className="text-xs text-[var(--text-secondary)] text-center">
              ✓ Premium design • Print-ready 300 DPI • Transparent background
            </p>
          </div>
        </div>
      </motion.div>

      {/* Mobile Floating Button */}
      <AnimatePresence>
        {showMobileButton && (
          <motion.button
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            onClick={() => {
              const element = document.querySelector('[data-qr-section]');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="fixed bottom-6 right-6 md:hidden bg-gradient-to-r from-[#00BFFF] to-[#7B2FBE] text-white px-4 py-3 rounded-full font-bold shadow-lg hover:shadow-[0_0_20px_rgba(0,191,255,0.5)] transition-all flex items-center gap-2 z-40"
          >
            <span>📱 Scan</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Print Modal */}
      <AnimatePresence>
        {showPrintModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
            onClick={() => setShowPrintModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0a0a0a] border border-[#00BFFF] rounded-2xl p-8 max-w-sm w-full space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[var(--text-primary)] font-sora">
                  Print Business Card
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowPrintModal(false)}
                  className="text-[var(--text-secondary)] hover:text-[#00BFFF] transition-colors"
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Preview */}
              <div
                ref={printRef}
                className="flex justify-center"
              >
                <div
                  style={{
                    width: '85mm',
                    height: '55mm',
                    background: '#000',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: '8px',
                    borderRadius: '4px',
                    padding: '12px',
                    boxSizing: 'border-box',
                    border: '1px solid #00BFFF',
                  }}
                >
                  <div style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    letterSpacing: '2px',
                    background: 'linear-gradient(135deg, #00BFFF, #7B2FBE)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    MULESOO
                  </div>
                  <img
                    src={qrImage}
                    style={{
                      width: '30mm',
                      height: '30mm',
                      borderRadius: '4px',
                    }}
                  />
                  <div style={{ fontSize: '11px', color: '#00BFFF', letterSpacing: '1px' }}>
                    www.mulesoo.com
                  </div>
                  <div style={{ fontSize: '8px', color: '#888' }}>
                    AI-Powered Digital Solutions
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="bg-[#1a1a1a] border border-[#00BFFF]/30 rounded-lg p-4">
                <p className="text-xs text-[var(--text-secondary)] space-y-2">
                  <span className="block">📏 <strong>Size:</strong> 85mm × 55mm (Business Card)</span>
                  <span className="block">🖨️ <strong>Paper:</strong> Matte or glossy premium card</span>
                  <span className="block">✨ <strong>Finish:</strong> Professional & premium</span>
                </p>
              </div>

              {/* Print Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePrint}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#00BFFF] to-[#7B2FBE] text-white font-bold rounded-lg hover:shadow-lg transition-all"
              >
                <Printer size={18} />
                Open Print Dialog
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
