'use client';

import { QRCodeCanvas } from 'qrcode.react';
import { Download } from 'lucide-react';
import { useRef } from 'react';

interface QRCodeFrameProps {
  url?: string;
  size?: number;
  showDownload?: boolean;
  frameStyle?: 'notebook' | 'elegant' | 'minimal';
}

export default function QRCodeFrame({
  url = 'https://mulesoo.com',
  size = 250,
  showDownload = true,
  frameStyle = 'notebook',
}: QRCodeFrameProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas') as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'mulesoo-qr-code.png';
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Notebook Frame */}
      {frameStyle === 'notebook' && (
        <div className="relative">
          {/* Outer notebook border */}
          <div className="bg-gradient-to-br from-[#1A2332] to-[#0F1624] border-4 border-[#E8B84B] rounded-2xl p-8 shadow-2xl"
            style={{
              boxShadow: '0 0 30px rgba(232, 184, 75, 0.3), inset 0 0 20px rgba(232, 184, 75, 0.1)'
            }}>
            {/* Inner white section for QR */}
            <div className="bg-white rounded-xl p-6 flex flex-col items-center gap-6">
              {/* QR Code */}
              <div ref={qrRef} className="bg-white p-4 rounded-lg">
                <QRCodeCanvas
                  value={url}
                  size={size}
                  level="H"
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
              </div>

              {/* Scan Me Text */}
              <div className="text-center">
                <p className="text-2xl font-bold text-black mb-2">👁️ SCAN ME 👁️</p>
                <p className="text-sm text-gray-600 font-semibold">Tap to visit MuleSoo</p>
              </div>

              {/* URL Display */}
              <p className="text-xs text-gray-500 font-mono text-center">{url}</p>
            </div>

            {/* Gold accent lines */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#E8B84B]"></div>
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#E8B84B]"></div>
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#E8B84B]"></div>
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#E8B84B]"></div>
          </div>
        </div>
      )}

      {/* Elegant Frame */}
      {frameStyle === 'elegant' && (
        <div className="bg-gradient-to-br from-[#0A0E17] to-[#0F1624] border-2 border-[#00C8FF] rounded-xl p-8 shadow-xl"
          style={{ boxShadow: '0 0 40px rgba(0, 200, 255, 0.2)' }}>
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-4">
            <div ref={qrRef} className="bg-white p-4">
              <QRCodeCanvas
                value={url}
                size={size}
                level="H"
              />
            </div>
            <p className="text-lg font-bold text-black">SCAN TO VISIT</p>
            <p className="text-xs text-gray-500 font-mono">{url}</p>
          </div>
        </div>
      )}

      {/* Minimal Frame */}
      {frameStyle === 'minimal' && (
        <div className="flex flex-col items-center gap-4">
          <div ref={qrRef} className="bg-white p-4 rounded-lg shadow-lg">
            <QRCodeCanvas value={url} size={size} level="H" />
          </div>
          <p className="text-white font-bold">Scan to visit MuleSoo</p>
        </div>
      )}

      {/* Download Button */}
      {showDownload && (
        <button
          onClick={downloadQR}
          className="mt-8 bg-[#00C8FF] hover:bg-[#00B3E6] text-black font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition transform hover:scale-105"
        >
          <Download size={20} /> Download QR Code
        </button>
      )}
    </div>
  );
}
