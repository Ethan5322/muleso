'use client';

import { useSearchParams } from 'next/navigation';
import QRCodeFrame from '@/components/QRCodeFrame';
import { CheckCircle, Home } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function BookingConfirmationContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('id') || 'MULE-2026-001';
  const clientName = searchParams.get('name') || 'Client Name';
  const email = searchParams.get('email') || 'client@example.com';
  const service = searchParams.get('service') || 'Website Design';
  const price = searchParams.get('price') || 'R7,500';

  const handleDownloadQR = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `booking-${bookingId}-qr.png`;
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-[#050810] text-white py-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <CheckCircle size={80} className="text-[#00FF88] animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold mb-4">Booking Confirmed! 🎉</h1>
          <p className="text-gray-400 text-lg">
            Thank you, {clientName}! Your booking has been received and confirmed.
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#1D4ED8] mb-6">Booking Details</h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Booking ID:</span>
              <span className="text-white font-semibold">{bookingId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Name:</span>
              <span className="text-white font-semibold">{clientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Email:</span>
              <span className="text-white font-semibold">{email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Service:</span>
              <span className="text-white font-semibold">{service}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Investment:</span>
              <span className="text-[#7FB3FF] font-bold text-lg">{price}</span>
            </div>
          </div>

          <div className="border-t border-[#1E3A5F] mt-6 pt-6">
            <p className="text-gray-400 text-sm mb-4">
              A confirmation email has been sent to <span className="text-[#1D4ED8]">{email}</span>
            </p>
            <p className="text-gray-400 text-sm">
              We will reach out within 2 hours to discuss your project in detail.
            </p>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-gradient-to-br from-[#0A0E17] to-[#0F1624] border border-[#1E3A5F] rounded-xl p-12 mb-8">
          <h2 className="text-2xl font-bold text-center mb-8">Your Booking QR Code</h2>
          <p className="text-center text-gray-400 mb-8">
            Scan this QR code to return to MuleSoo website anytime
          </p>

          <div className="flex justify-center mb-8">
            <QRCodeFrame
              url="https://mulesoo.com"
              frameStyle="notebook"
              size={250}
              showDownload={false}
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleDownloadQR}
              className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition transform hover:scale-105"
            >
              Download QR Code
            </button>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-xl p-8 mb-8">
          <h3 className="text-xl font-bold mb-6">What Happens Next?</h3>
          <ol className="space-y-4">
            <li className="flex gap-4">
              <span className="bg-[#1D4ED8] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                1
              </span>
              <div>
                <p className="font-semibold">Initial Consultation</p>
                <p className="text-gray-400 text-sm">We'll contact you within 2 hours to discuss your vision and requirements</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="bg-[#7B2FFF] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                2
              </span>
              <div>
                <p className="font-semibold">Project Planning</p>
                <p className="text-gray-400 text-sm">We'll create a detailed timeline and scope document for your approval</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="bg-[#1D4ED8] text-black rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                3
              </span>
              <div>
                <p className="font-semibold">Development & Delivery</p>
                <p className="text-gray-400 text-sm">We build and deliver your project on schedule with regular updates</p>
              </div>
            </li>
          </ol>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/">
            <button className="bg-[#0A0E17] hover:bg-[#1A2332] border border-[#1E3A5F] text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition">
              <Home size={20} /> Back to Home
            </button>
          </Link>
          <Link href="/contact">
            <button className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold py-3 px-8 rounded-lg transition transform hover:scale-105">
              Contact Us
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function BookingConfirmationFallback() {
  return (
    <div className="min-h-screen bg-[#050810] text-white py-20 px-4 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        <div className="animate-pulse">
          <div className="h-20 w-20 bg-[#1D4ED8] rounded-full mx-auto mb-6"></div>
          <div className="h-8 bg-gray-700 rounded-lg w-64 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-800 rounded-lg w-96 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<BookingConfirmationFallback />}>
      <BookingConfirmationContent />
    </Suspense>
  );
}
