'use client';

import { useEffect, useState } from 'react';

interface DigitalIdCardPreviewProps {
  name?: string;
  role?: string;
  institution?: string;
  idNumber?: string;
  code?: string;
  issued?: string;
  validThru?: string;
}

/**
 * A professional Digital ID card visual — same layout & size as the MuleSoo
 * staff ID, but labelled "DIGITAL ID", with NO photo (details-only) and a live
 * QR code + barcode. Used as the cover for the Digital ID service.
 *
 * Scales fluidly: all sizes use container-query width units (cqw), so the card
 * stays perfectly proportioned at any width.
 */
export default function DigitalIdCardPreview({
  name = 'AMANUEL TESFAYE',
  role = 'Verified Member',
  institution = 'Your Institution',
  idNumber = 'DID-2026-00147',
  code = 'D9E4-8MKX-SSM8',
  issued = '06 Jul 26',
  validThru = '06 Jul 28',
}: DigitalIdCardPreviewProps) {
  const [qr, setQr] = useState('');
  const [barcode, setBarcode] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const QRCode = (await import('qrcode')).default;
        const url = await QRCode.toDataURL(`https://mulesoo.com/verify?id=${code}`, {
          width: 320,
          margin: 0,
          color: { dark: '#0A0F1E', light: '#FFFFFF' },
        });
        if (!cancelled) setQr(url);
      } catch {
        /* ignore */
      }
      try {
        const JsBarcode = (await import('jsbarcode')).default;
        const canvas = document.createElement('canvas');
        JsBarcode(canvas, code.replace(/[^A-Za-z0-9]/g, ''), {
          format: 'CODE128',
          displayValue: false,
          margin: 0,
          height: 60,
          width: 2,
          background: '#ffffff',
          lineColor: '#0A0F1E',
        });
        if (!cancelled) setBarcode(canvas.toDataURL('image/png'));
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code]);

  const muted = '#8291AF';

  const Field = ({ label, value }: { label: string; value: string }) => (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: '2cqw', color: muted, letterSpacing: '0.08em' }}>{label}</div>
      <div
        className="text-white font-semibold"
        style={{ fontSize: '3cqw', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {value}
      </div>
    </div>
  );

  return (
    <div style={{ containerType: 'inline-size' }} className="w-full max-w-[560px] mx-auto">
      <div
        className="w-full flex flex-col overflow-hidden"
        style={{
          aspectRatio: '85.6 / 54',
          background: '#0D1528',
          border: '1px solid #1A2640',
          borderRadius: '4cqw',
          boxShadow: '0 24px 60px -20px rgba(0,0,0,0.7)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{ height: '21%', padding: '0 4cqw', background: 'linear-gradient(90deg,#00C8FF,#7B2FFF)' }}
        >
          <div className="flex items-center" style={{ gap: '2cqw' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/mulesoo-logo-icon.png" alt="MuleSoo" style={{ width: '9cqw', height: '9cqw' }} />
            <div style={{ lineHeight: 1.05 }}>
              <div className="font-bold text-white font-sora" style={{ fontSize: '4.4cqw' }}>
                MULESOO
              </div>
              <div className="text-white" style={{ fontSize: '1.8cqw', letterSpacing: '0.22em', opacity: 0.9 }}>
                DIGITAL SERVICES
              </div>
            </div>
          </div>
          <div className="font-bold font-sora" style={{ fontSize: '3cqw', color: '#0A0F1E' }}>
            DIGITAL ID
          </div>
        </div>
        <div style={{ height: '0.6cqw', background: '#E8B84B' }} />

        {/* Body */}
        <div className="flex-1 flex" style={{ padding: '3cqw 4cqw', gap: '3cqw', minHeight: 0 }}>
          <div className="flex-1 flex flex-col" style={{ minWidth: 0 }}>
            <div
              className="font-bold text-white font-sora"
              style={{ fontSize: '5.4cqw', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {name}
            </div>
            <div style={{ fontSize: '2.9cqw', color: muted, marginTop: '0.4cqw' }}>{role}</div>
            <div style={{ height: '0.35cqw', width: '58%', background: '#E8B84B', margin: '2.2cqw 0' }} />

            <div className="flex" style={{ gap: '6cqw', marginBottom: '2.4cqw' }}>
              <Field label="ISSUED" value={issued} />
              <Field label="VALID THRU" value={validThru} />
            </div>
            <div className="flex" style={{ gap: '6cqw', marginBottom: '2.4cqw' }}>
              <Field label="ID NUMBER" value={idNumber} />
              <Field label="INSTITUTION" value={institution} />
            </div>

            <div style={{ marginTop: 'auto' }}>
              <div style={{ fontSize: '2cqw', color: muted, letterSpacing: '0.1em' }}>VERIFICATION CODE</div>
              <div className="font-bold font-sora" style={{ fontSize: '4.8cqw', color: '#E8B84B' }}>
                {code}
              </div>
            </div>
          </div>

          {/* QR */}
          <div className="flex flex-col items-center" style={{ flexShrink: 0 }}>
            <div style={{ background: '#fff', borderRadius: '1.6cqw', padding: '1.2cqw' }}>
              {qr && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qr} alt="Verification QR code" style={{ width: '23cqw', height: '23cqw', display: 'block' }} />
              )}
            </div>
            <div style={{ fontSize: '1.9cqw', color: muted, marginTop: '1cqw', letterSpacing: '0.08em' }}>
              SCAN TO VERIFY
            </div>
          </div>
        </div>

        {/* Barcode */}
        <div style={{ padding: '0 4cqw 3cqw' }}>
          <div style={{ background: '#fff', borderRadius: '1.4cqw', padding: '1cqw 2cqw' }}>
            {barcode && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={barcode} alt="ID barcode" style={{ width: '100%', height: '7cqw', objectFit: 'fill', display: 'block' }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
