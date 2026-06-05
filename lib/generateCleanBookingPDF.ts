import jsPDF from 'jspdf';
import QRCode from 'qrcode';

interface BookingData {
  fullName: string;
  email: string;
  phoneNumber: string;
  company: string;
  nationality: string;
  service: string;
  usageType: string;
  budget: string;
  contactMethod: string;
  timeline: string;
  projectDetails: string;
  improvedProjectDetails: string;
  bookingReference: string;
}

export const generateCleanBookingPDF = async (bookingData: BookingData) => {
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
  doc.text('Digital Services | Pretoria, South Africa', margin, yPos + 5);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(232, 184, 75);
  doc.text('Booking: ' + bookingData.bookingReference, pageWidth - margin, yPos, { align: 'right' });

  // Add QR Code with callback pattern
  try {
    const qrDataUrl = await new Promise<string>((resolve, reject) => {
      QRCode.toDataURL(
        `https://muleso.vercel.app`,
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

  yPos += 12;

  doc.setDrawColor(0, 200, 255);
  doc.setLineWidth(0.4);
  doc.line(margin, yPos, pageWidth - margin, yPos);

  yPos += 5;

  // CLIENT INFORMATION
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 200, 255);
  doc.text('CLIENT INFORMATION', margin, yPos);

  yPos += 3.5;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);

  const col1X = margin;
  const col2X = margin + contentWidth / 2;

  // Client details - Row 1
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('Name:', col1X, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);
  doc.text(bookingData.fullName, col1X + 17, yPos);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('Email:', col2X, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);
  const emailLines = doc.splitTextToSize(bookingData.email, contentWidth / 2 - 5);
  doc.text(emailLines[0] || '', col2X + 13, yPos);

  yPos += 3;

  // Row 2
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('Phone:', col1X, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);
  doc.text(bookingData.phoneNumber, col1X + 17, yPos);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('Company:', col2X, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);
  doc.text(bookingData.company || 'N/A', col2X + 20, yPos);

  yPos += 3;

  // Row 3
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('Country:', col1X, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);
  doc.text(bookingData.nationality, col1X + 17, yPos);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('Type:', col2X, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);
  doc.text(bookingData.usageType, col2X + 13, yPos);

  yPos += 6;

  // PROJECT DESCRIPTION
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(123, 47, 255);
  doc.text('PROJECT DESCRIPTION', margin, yPos);

  yPos += 4;

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);

  const descriptionLines = doc.splitTextToSize(bookingData.improvedProjectDetails || bookingData.projectDetails, contentWidth - 1);
  descriptionLines.forEach((line: string) => {
    if (yPos < 110) {
      doc.text(line, margin + 1, yPos);
      yPos += 3;
    }
  });

  yPos += 3;

  // SERVICE & BUDGET
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 200, 255);
  doc.text('SERVICE & BUDGET', margin, yPos);

  yPos += 3.5;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('Service:', col1X, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);
  doc.text(bookingData.service, col1X + 17, yPos);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('Budget:', col2X, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);
  doc.text(bookingData.budget, col2X + 15, yPos);

  yPos += 3;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('Timeline:', col1X, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);
  doc.text(bookingData.timeline, col1X + 20, yPos);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('Contact:', col2X, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);
  doc.text(bookingData.contactMethod, col2X + 18, yPos);

  yPos += 6;

  // VERIFICATION CODE
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(232, 184, 75);
  doc.text('VERIFICATION CODE:', margin, yPos);

  yPos += 3;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 200, 255);
  const verificationCode = generateVerificationCode();
  doc.text(verificationCode, margin, yPos);

  yPos += 7;

  // PAYMENT TERMS
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(232, 184, 75);
  doc.text('PAYMENT TERMS:', margin, yPos);

  yPos += 3;

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);

  const termsText = [
    '• 50% deposit required to start work',
    '• Remaining 50% due before delivery',
  ];

  termsText.forEach((line) => {
    doc.text(line, margin + 2, yPos);
    yPos += 2.5;
  });

  yPos += 2;

  // NEXT STEPS
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(232, 184, 75);
  doc.text('NEXT STEPS:', margin, yPos);

  yPos += 3;

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);

  const noticeText = [
    '1. Download and read our Terms & Conditions PDF',
    '2. Print this document and sign below',
    '3. Send signed document via WhatsApp: +27 78 1500968',
    '4. Ethan will contact you within 2 hours to confirm',
  ];

  noticeText.forEach((line) => {
    doc.text(line, margin + 2, yPos);
    yPos += 2.5;
  });

  yPos += 3;

  // SIGNATURE SECTION
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text('CLIENT SIGNATURE:', margin, yPos);

  yPos += 3;

  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(0.3);
  doc.line(margin, yPos, margin + 40, yPos);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Signature', margin, yPos + 2);

  doc.line(margin + 50, yPos, margin + contentWidth, yPos);
  doc.text('Date', margin + 50, yPos + 2);

  yPos += 6;

  // FOOTER
  const footerY = pageHeight - 12;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('📧 mulukenendashaw68@gmail.com', margin, footerY);
  doc.text('📱 +27 78 1500968', margin + 50, footerY);

  doc.setFontSize(6);
  doc.setTextColor(120, 120, 120);
  doc.text('MuleSoo Digital Services | Pretoria, South Africa | www.mulesoo.com', pageWidth / 2, footerY + 5, {
    align: 'center',
  });

  const date = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
  const filename = `MuleSoo_Booking_${bookingData.fullName.replace(/\s+/g, '_')}_${date}.pdf`;

  doc.save(filename);
};

function generateVerificationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
    if ((i + 1) % 4 === 0 && i !== 11) code += '-';
  }
  return code;
}
