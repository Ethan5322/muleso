'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Copy, Printer, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateFramedQRCode, downloadFramedQRCode, generateQRCodePDF } from '@/lib/generateFramedQRCode';

export default function QRDownloadPage() {
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const loadQR = async () => {
      try {
        setLoading(true);
        const dataUrl = await generateFramedQRCode('https://mulesoo.com', 800);
        setQrImage(dataUrl);
      } catch (error) {
        console.error('Failed to load QR code:', error);
        toast.error('Failed to load QR code');
      } finally {
        setLoading(false);
      }
    };

    loadQR();
  }, []);

  const handleDownloadPNG = async () => {
    try {
      toast.loading('Generating PNG...');
      await downloadFramedQRCode('MuleSoo_QRCode.png');
      toast.dismiss();
      toast.success('✅ QR code downloaded!');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to download QR code');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      toast.loading('Generating PDF...');
      await generateQRCodePDF();
      toast.dismiss();
      toast.success('✅ PDF ready for printing!');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to generate PDF');
    }
  };

  const handlePrint = () => {
    window.print();
    toast.success('Print dialog opened');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://mulesoo.com');
    toast.success('Link copied to clipboard');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MuleSoo Digital Services',
          text: 'Visit MuleSoo for professional digital solutions',
          url: 'https://mulesoo.com',
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      toast.error('Share not supported on this device');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-20">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00BFFF] rounded-full mix-blend-screen filter blur-3xl opacity-5" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#7B2FBE] rounded-full mix-blend-screen filter blur-3xl opacity-5" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold font-sora mb-4">
            <span className="text-[var(--accent-blue)]">MuleSoo</span>
            <span className="text-[var(--text-primary)]"> Official</span>
          </h1>
          <h2 className="text-3xl font-bold font-sora mb-4 text-[var(--accent-gold)]">
            QR Code
          </h2>
          <p className="text-[var(--text-secondary)] text-lg">
            Download, print, or share your official MuleSoo QR code
          </p>
        </motion.div>

        {/* QR Code Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-8 sm:p-12 mb-12 flex flex-col items-center"
        >
          {loading ? (
            <div className="text-[var(--accent-blue)] text-lg font-semibold">
              Generating QR Code...
            </div>
          ) : qrImage ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-md"
            >
              <img
                src={qrImage}
                alt="MuleSoo Official QR Code"
                className="w-full rounded-lg shadow-2xl"
              />
              <p className="text-center text-[var(--text-secondary)] text-sm mt-4">
                Right-click to save or use the buttons below
              </p>
            </motion.div>
          ) : (
            <div className="text-red-400">Failed to load QR code</div>
          )}
        </motion.div>

        {/* Download Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {/* Download PNG */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadPNG}
            disabled={loading}
            className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] rounded-xl text-white font-bold hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Download size={28} className="mb-2" />
            <span className="text-sm text-center">Download PNG</span>
            <span className="text-xs opacity-90 mt-1">(For screens)</span>
          </motion.button>

          {/* Download PDF */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadPDF}
            disabled={loading}
            className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[var(--accent-gold)] to-[#FFC107] rounded-xl text-black font-bold hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Download size={28} className="mb-2" />
            <span className="text-sm text-center">Download PDF</span>
            <span className="text-xs opacity-90 mt-1">(For printing)</span>
          </motion.button>

          {/* Print */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrint}
            disabled={loading || !qrImage}
            className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[var(--accent-green)] to-[#00FF88] rounded-xl text-black font-bold hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Printer size={28} className="mb-2" />
            <span className="text-sm text-center">Print</span>
            <span className="text-xs opacity-90 mt-1">(Direct print)</span>
          </motion.button>

          {/* Copy Link */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopyLink}
            className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[var(--accent-purple)] to-[#9C27B0] rounded-xl text-white font-bold hover:shadow-lg transition-all"
          >
            <Copy size={28} className="mb-2" />
            <span className="text-sm text-center">Copy Link</span>
            <span className="text-xs opacity-90 mt-1">(www.mulesoo.com)</span>
          </motion.button>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-[var(--accent-blue)] mb-6">
            How to Use Your QR Code
          </h3>

          <div className="space-y-6">
            {/* For Office */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[var(--accent-blue)]">
                  <span className="text-white font-bold">1</span>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                  Frame it in Your Office
                </h4>
                <p className="text-[var(--text-secondary)]">
                  Download the PNG or PDF version. Print it and frame it on your office wall,
                  desk, or business location for clients to scan.
                </p>
              </div>
            </div>

            {/* For Business Card */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[var(--accent-gold)]">
                  <span className="text-black font-bold">2</span>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                  Add to Business Cards
                </h4>
                <p className="text-[var(--text-secondary)]">
                  Use the PNG image to add the QR code to your business card design for
                  easy contact sharing.
                </p>
              </div>
            </div>

            {/* For Marketing */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[var(--accent-green)]">
                  <span className="text-black font-bold">3</span>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                  Share on Marketing Materials
                </h4>
                <p className="text-[var(--text-secondary)]">
                  Include the QR code in flyers, posters, brochures, and social media to drive
                  traffic to your website.
                </p>
              </div>
            </div>

            {/* For Digital */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[var(--accent-purple)]">
                  <span className="text-white font-bold">4</span>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                  Share Digitally
                </h4>
                <p className="text-[var(--text-secondary)]">
                  Email the PNG image, post on social media, or include in digital documents
                  to make your contact information easily accessible.
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 pt-8 border-t border-[var(--border)] grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-[var(--accent-blue)]">100%</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Professional</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[var(--accent-gold)]">HD</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">High Resolution</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[var(--accent-green)]">Branded</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Your Design</p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-[var(--text-secondary)] text-lg mb-6">
            Ready to share your MuleSoo QR code with the world?
          </p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            href="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold rounded-xl hover:shadow-lg transition-all"
          >
            Back to Home
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}
