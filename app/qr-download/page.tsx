'use client';

import QRCodeFrame from '@/components/QRCodeFrame';
import { Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function QRDownloadPage() {
  const [copied, setCopied] = useState(false);
  const websiteURL = 'https://mulesoo.vercel.app';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(websiteURL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050810] text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-[#00C8FF]">MuleSoo</span> QR Code
          </h1>
          <p className="text-gray-400 text-lg">
            Download elegant QR codes for your booking confirmations, PDFs, and marketing materials
          </p>
        </div>

        {/* Website URL Section */}
        <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-4">Official Website</h2>
          <div className="flex items-center gap-4 bg-[#1A2332] border border-[#1E3A5F] rounded-lg p-4">
            <code className="flex-1 text-[#00C8FF]">{websiteURL}</code>
            <button
              onClick={copyToClipboard}
              className="bg-[#7B2FFF] hover:bg-[#6B1FEF] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* QR Code Styles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold mb-8 text-[#E8B84B]">Notebook Style</h3>
            <p className="text-gray-400 text-sm mb-8 text-center">Perfect for booking confirmations and professional PDFs</p>
            <QRCodeFrame frameStyle="notebook" size={200} showDownload={false} />
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold mb-8 text-[#00C8FF]">Elegant Style</h3>
            <p className="text-gray-400 text-sm mb-8 text-center">Modern design with glowing blue border</p>
            <QRCodeFrame frameStyle="elegant" size={200} showDownload={false} />
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold mb-8 text-[#00FF88]">Minimal Style</h3>
            <p className="text-gray-400 text-sm mb-8 text-center">Clean and simple for basic use</p>
            <QRCodeFrame frameStyle="minimal" size={200} showDownload={false} />
          </div>
        </div>

        {/* Full Download Section */}
        <div className="bg-gradient-to-br from-[#0A0E17] to-[#0F1624] border border-[#1E3A5F] rounded-xl p-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Download Your QR Code</h2>
          <div className="flex justify-center mb-12">
            <QRCodeFrame frameStyle="notebook" size={300} showDownload={true} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-[#1A2332] border border-[#1E3A5F] rounded-lg p-6">
              <div className="text-3xl mb-3">📱</div>
              <h4 className="font-bold mb-2">Booking Confirmations</h4>
              <p className="text-gray-400 text-sm">Place at top center of PDF booking confirmation slips</p>
            </div>
            <div className="bg-[#1A2332] border border-[#1E3A5F] rounded-lg p-6">
              <div className="text-3xl mb-3">📄</div>
              <h4 className="font-bold mb-2">Terms & Conditions</h4>
              <p className="text-gray-400 text-sm">Include on T&C PDFs for easy website access</p>
            </div>
            <div className="bg-[#1A2332] border border-[#1E3A5F] rounded-lg p-6">
              <div className="text-3xl mb-3">🖼️</div>
              <h4 className="font-bold mb-2">Marketing Materials</h4>
              <p className="text-gray-400 text-sm">Use in print ads, flyers, and business cards</p>
            </div>
          </div>

          <div className="mt-12 bg-[#1A2332] border border-[#1E3A5F] rounded-lg p-8">
            <h3 className="font-bold text-lg mb-4">Integration Guide</h3>
            <ol className="space-y-3 text-gray-300 list-decimal list-inside">
              <li>Download the QR code in your preferred style</li>
              <li>Insert into PDF templates (booking confirmations, T&C)</li>
              <li>Place at the top center or bottom of the document</li>
              <li>Test scanning to ensure it directs to https://mulesoo.vercel.app</li>
              <li>Print or distribute digitally with confidence</li>
            </ol>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2 text-[#00C8FF]">✓</div>
            <p className="text-gray-300">Professional Design</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2 text-[#00FF88]">✓</div>
            <p className="text-gray-300">Easy to Scan</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2 text-[#E8B84B]">✓</div>
            <p className="text-gray-300">Print Ready</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2 text-[#7B2FFF]">✓</div>
            <p className="text-gray-300">Multiple Styles</p>
          </div>
        </div>
      </div>
    </div>
  );
}
