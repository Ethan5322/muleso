import jsPDF from 'jspdf';

interface BookingData {
  fullName: string;
  phoneNumber: string;
  nationality: string;
  service: string;
  usageType: string;
  timeline: string;
  projectDetails: string;
  improvedProjectDetails?: string;
}

export const generateProfessionalPDF = (bookingData: BookingData) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - 2 * margin;

  let yPos = margin;

  // ===== HEADER SECTION =====
  // Logo area (light background)
  doc.setFillColor(240, 242, 250);
  doc.rect(0, 0, pageWidth, 20, 'F');

  // Brand name
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 200, 255);
  doc.text('MULE', margin + 2, 12);
  doc.setTextColor(30, 30, 30);
  doc.text('SOO', margin + 20, 12);

  // Document title on right
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 200, 255);
  doc.text('SERVICE REQUEST', pageWidth - margin - 2, 10, { align: 'right' });

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  const currentDate = new Date().toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  doc.text(currentDate, pageWidth - margin - 2, 15, { align: 'right' });

  yPos = 22;

  // ===== DIVIDER =====
  doc.setDrawColor(0, 200, 255);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 3;

  // ===== CLIENT INFO SECTION (Compact) =====
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 200, 255);
  doc.text('CLIENT', margin, yPos);
  yPos += 4;

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);

  const colWidth = contentWidth / 2 - 1;

  // Left column
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('Name:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);
  doc.text(bookingData.fullName, margin + 15, yPos);

  // Right column
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('Country:', margin + colWidth + 1, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);
  doc.text(bookingData.nationality, margin + colWidth + 16, yPos);

  yPos += 3;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('Phone:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);
  doc.text(bookingData.phoneNumber, margin + 15, yPos);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('Type:', margin + colWidth + 1, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);
  doc.text(bookingData.usageType, margin + colWidth + 16, yPos);

  yPos += 5;

  // ===== PROJECT DETAILS SECTION =====
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 200, 255);
  doc.text('PROJECT BRIEF', margin, yPos);
  yPos += 3;

  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);

  const briefText = bookingData.improvedProjectDetails || bookingData.projectDetails;
  const briefLines = doc.splitTextToSize(briefText, contentWidth - 1);
  briefLines.forEach((line: string) => {
    if (yPos < 110) {
      doc.text(line, margin + 1, yPos);
      yPos += 2.5;
    }
  });

  yPos += 2;

  // ===== SERVICE & TIMELINE (Compact) =====
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(123, 47, 255);
  doc.text('SERVICE & TIMELINE', margin, yPos);
  yPos += 3;

  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('Service:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);
  doc.text(bookingData.service, margin + 18, yPos);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('Timeline:', margin + colWidth + 1, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);
  doc.text(bookingData.timeline, margin + colWidth + 18, yPos);

  yPos += 6;

  // ===== CLIENT NOTICE (Small) =====
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(232, 184, 75);

  const noticeText =
    '✓ Ethan will contact you within 2 hours on business days • A 50% deposit is required to begin work • Upon full payment, you own all work';
  const noticeLines = doc.splitTextToSize(noticeText, contentWidth - 2);
  noticeLines.forEach((line: string) => {
    doc.text(line, margin + 1, yPos);
    yPos += 2;
  });

  yPos += 1;

  // ===== CONTACT INFO (Small) =====
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 200, 255);
  doc.text('📧 mulukenendashaw68@gmail.com', margin, yPos);
  doc.text('📱 +27 78 1500968', pageWidth / 2 + margin / 2, yPos);

  yPos += 3;

  // ===== DIVIDER =====
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, yPos, pageWidth - margin, yPos);

  yPos += 2;

  // ===== TERMS & CONDITIONS (Very Small - fits at bottom) =====
  doc.setFontSize(5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);

  const tcText = [
    '• 50% DEPOSIT REQUIRED to begin work. 50% balance due before final delivery. • NO REFUNDS once work begins. • FULL PAYMENT required to receive source code, PDFs, and all deliverables. • 30 days FREE support included; additional support at R250/hour. • Projects completed within estimated timeline; delays due to feedback/payment not our responsibility. • Maximum liability limited to amount paid.',
  ];

  tcText.forEach((term) => {
    const tcLines = doc.splitTextToSize(term, contentWidth - 1);
    tcLines.forEach((line: string) => {
      if (yPos < pageHeight - 4) {
        doc.text(line, margin + 0.5, yPos);
        yPos += 1.8;
      }
    });
  });

  // ===== FOOTER =====
  doc.setFontSize(5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text('MuleSoo Digital Services | Pretoria, South Africa | www.mulesoo.com', pageWidth / 2, pageHeight - 2, {
    align: 'center',
  });

  // Generate filename
  const date = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
  const filename = `MuleSoo_${bookingData.fullName.replace(/\s+/g, '_')}_${date}.pdf`;

  doc.save(filename);
};
