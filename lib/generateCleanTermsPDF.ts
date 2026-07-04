import jsPDF from 'jspdf';
import QRCode from 'qrcode';

export const generateCleanTermsPDF = async () => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
  const contentWidth = pageWidth - 2 * margin;

  doc.setFont('helvetica');

  let yPos = margin;

  // HEADER
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 200, 255);
  doc.text('MULESOO', margin, yPos);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Digital Services', margin, yPos + 5);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(232, 184, 75);
  doc.text('TERMS & CONDITIONS', pageWidth - margin, yPos + 2, { align: 'right' });

  // Add QR Code to Terms with callback pattern
  try {
    const qrDataUrl = await new Promise<string>((resolve, reject) => {
      QRCode.toDataURL(
        'https://mulesoo.vercel.app/terms',
        { width: 1200, margin: 0 },
        (error, dataUrl) => {
          if (error) reject(error);
          else resolve(dataUrl);
        }
      );
    });
    doc.addImage(qrDataUrl, 'PNG', pageWidth - margin - 18, yPos - 3, 18, 18);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 200, 255);
    doc.text('Scan', pageWidth - margin - 15, yPos + 16);
  } catch (err) {
    console.error('QR Code generation failed:', err);
  }

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  const currentDate = new Date().toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  doc.text('Effective: ' + currentDate, pageWidth - margin, yPos + 8, { align: 'right' });

  yPos += 14;

  // DIVIDER
  doc.setDrawColor(0, 200, 255);
  doc.setLineWidth(0.4);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 5;

  // SECTION 1: PAYMENT
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 200, 255);
  doc.text('1. PAYMENT & DEPOSIT', margin, yPos);
  yPos += 4;

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);

  const section1 = [
    'A 50% deposit is REQUIRED to start work; it is credited in full toward your total project fee.',
    'Balance (remaining 50%) due before final delivery — so you only pay the other half on completion.',
    'If you proceed and receive the service, the deposit forms part of your fee (never lost).',
    'If you cancel after paying the deposit, the deposit is non-refundable and is forfeited.',
    'Card & Instant EFT via Paystack, or direct bank transfer (EFT).',
  ];

  section1.forEach((text) => {
    const lines = doc.splitTextToSize('• ' + text, contentWidth - 2);
    lines.forEach((line: string) => {
      doc.text(line, margin + 1, yPos);
      yPos += 2.5;
    });
  });

  yPos += 2;

  // SECTION 2: DELIVERABLES
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(123, 47, 255);
  doc.text('2. DELIVERABLES', margin, yPos);
  yPos += 4;

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);

  const section2 = [
    'Source code and files provided ONLY after full payment.',
    'Ownership transfers after full payment received.',
    'We retain portfolio rights.',
  ];

  section2.forEach((text) => {
    const lines = doc.splitTextToSize('• ' + text, contentWidth - 2);
    lines.forEach((line: string) => {
      doc.text(line, margin + 1, yPos);
      yPos += 2.5;
    });
  });

  yPos += 2;

  // SECTION 3: TIMELINE
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 200, 255);
  doc.text('3. TIMELINE & DELIVERY', margin, yPos);
  yPos += 4;

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);

  const section3 = [
    'Timelines are estimates.',
    'Client delays do not extend our deadline.',
    'Final delivery after full payment.',
  ];

  section3.forEach((text) => {
    const lines = doc.splitTextToSize('• ' + text, contentWidth - 2);
    lines.forEach((line: string) => {
      doc.text(line, margin + 1, yPos);
      yPos += 2.5;
    });
  });

  yPos += 2;

  // SECTION 4: SUPPORT
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(123, 47, 255);
  doc.text('4. SUPPORT & REVISIONS', margin, yPos);
  yPos += 4;

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);

  const section4 = [
    '30 days FREE support for bug fixes.',
    'Up to 3 revision rounds included.',
    'Additional support: R250/hour.',
  ];

  section4.forEach((text) => {
    const lines = doc.splitTextToSize('• ' + text, contentWidth - 2);
    lines.forEach((line: string) => {
      doc.text(line, margin + 1, yPos);
      yPos += 2.5;
    });
  });

  yPos += 2;

  // SECTION 5: LIABILITY
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 200, 255);
  doc.text('5. LIABILITY', margin, yPos);
  yPos += 4;

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);

  const section5 = ['Our liability limited to amount paid.', 'Not responsible for client negligence.'];

  section5.forEach((text) => {
    const lines = doc.splitTextToSize('• ' + text, contentWidth - 2);
    lines.forEach((line: string) => {
      doc.text(line, margin + 1, yPos);
      yPos += 2.5;
    });
  });

  yPos += 5;

  // AGREEMENT
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(232, 184, 75);
  doc.text('CLIENT AGREEMENT', margin, yPos);
  yPos += 3;

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);

  const agreementText = doc.splitTextToSize(
    'By signing, you agree to all terms and conditions above. No exceptions without written consent.',
    contentWidth - 2
  );

  agreementText.forEach((line: string) => {
    doc.text(line, margin + 1, yPos);
    yPos += 2.5;
  });

  yPos += 5;

  // SIGNATURE SECTION
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text('SIGNATURE:', margin, yPos);

  yPos += 3;

  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(0.3);

  doc.line(margin, yPos, margin + 30, yPos);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Client Signature', margin, yPos + 2);

  doc.line(margin + 40, yPos, pageWidth - margin, yPos);
  doc.text('Date', margin + 40, yPos + 2);

  // FOOTER
  const footerY = pageHeight - 8;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY - 2, pageWidth - margin, footerY - 2);

  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('MuleSoo Digital Services | Pretoria | mulukenendashaw68@gmail.com | +27 68 852 9333', pageWidth / 2, footerY, {
    align: 'center',
  });

  const date = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
  const filename = `MuleSoo_Terms_and_Conditions_${date}.pdf`;
  doc.save(filename);
};
