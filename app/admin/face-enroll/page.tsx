'use client';

import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Copy, Check } from 'lucide-react';
import FaceScanner from '@/components/admin/FaceScanner';

export default function FaceEnrollPage() {
  const [descriptor, setDescriptor] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCapture = (d: number[]) => {
    // Round to keep the env value compact
    const rounded = d.map((n) => Number(n.toFixed(5)));
    setDescriptor(JSON.stringify(rounded));
    toast.success('Face captured! Copy the value below into your env.');
  };

  const copy = async () => {
    if (!descriptor) return;
    await navigator.clipboard.writeText(descriptor);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl text-white">
      <Toaster position="top-center" />
      <h2 className="text-3xl font-bold font-sora mb-2">Enroll Your Face</h2>
      <p className="text-[#7A8BA8] mb-6">
        Capture your reference face once. You&apos;ll paste the result into the{' '}
        <code className="text-[#00C8FF]">ADMIN_FACE_DESCRIPTOR</code> environment variable so face login can verify you.
      </p>

      <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-2xl p-6 mb-6">
        <FaceScanner actionLabel="Capture Reference Face" onCapture={handleCapture} />
      </div>

      {descriptor && (
        <div className="bg-[#0A0E17] border border-[#1E3A5F] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Your face signature</h3>
            <button
              type="button"
              onClick={copy}
              className="flex items-center gap-2 bg-[#1A2332] hover:bg-[#253345] border border-[#1E3A5F] text-[#00C8FF] px-3 py-1.5 rounded-lg text-sm font-semibold"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            readOnly
            value={descriptor}
            aria-label="Face descriptor"
            className="w-full h-28 bg-[#1A2332] border border-[#1E3A5F] text-[#7A8BA8] text-xs rounded-lg p-3 font-mono resize-none"
          />
          <div className="text-sm text-[#7A8BA8] space-y-2">
            <p className="font-semibold text-white">Next steps:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Copy the value above.</li>
              <li>In Vercel → Project → Settings → Environment Variables, add <code className="text-[#00C8FF]">ADMIN_FACE_DESCRIPTOR</code> with this value.</li>
              <li>(Optional) Add <code className="text-[#00C8FF]">ADMIN_FACE_THRESHOLD</code> = <code>0.5</code> (lower = stricter).</li>
              <li>Redeploy. Then face login will recognize you.</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
