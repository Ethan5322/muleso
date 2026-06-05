import jsPDF from 'jspdf';

interface BookingData {
  fullName: string;
  phoneNumber: string;
  nationality: string;
  service: string;
  usageType: string;
  timeline: string;
  projectDetails?: string;
}

export const generateServiceRequestPDF = (bookingData: BookingData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let yPos = 15;

  const colors = {
    darkBg: [5, 8, 16],
    accentBlue: [0, 200, 255],
    accentPurple: [123, 47, 255],
    accentGold: [232, 184, 75],
    textDark: [30, 30, 30],
    textGray: [80, 80, 80],
    lightGray: [240, 242, 250],
  };

  // ===== HEADER =====
  doc.setFillColor(...colors.lightGray);
  doc.rect(0, 0, pageWidth, 45, 'F');

  // Logo & Brand Name
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.accentBlue);
  doc.text('MULE', margin, 18);
  doc.setTextColor(...colors.textDark);
  doc.text('SOO', margin + 25, 18);

  // Tagline
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.textGray);
  doc.text('Digital Services | World-Class Solutions for Africa', margin, 24);

  // Document Title
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.accentBlue);
  doc.text('SERVICE REQUEST FORM', pageWidth - margin, 18, { align: 'right' });

  // Current Date
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.textGray);
  const currentDate = new Date().toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(`Date: ${currentDate}`, pageWidth - margin, 25, { align: 'right' });

  yPos = 50;

  // ===== DIVIDER =====
  doc.setDrawColor(...colors.accentBlue);
  doc.setLineWidth(0.8);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // ===== SECTION 1: CLIENT DETAILS =====
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.accentBlue);
  doc.text('CLIENT INFORMATION', margin, yPos);
  yPos += 8;

  // Info Box Background
  const infoBoxHeight = 58;
  doc.setFillColor(...colors.lightGray);
  doc.rect(margin, yPos, contentWidth, infoBoxHeight, 'F');
  doc.setDrawColor(...colors.accentBlue);
  doc.setLineWidth(0.5);
  doc.rect(margin, yPos, contentWidth, infoBoxHeight);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.textDark);

  const infoStartY = yPos + 5;
  const colWidth = contentWidth / 2 - 3;

  // Left Column
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...colors.accentGold);
  doc.text('Full Name:', margin + 3, infoStartY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...colors.textDark);
  doc.text(bookingData.fullName || '_______________', margin + 30, infoStartY);

  // Phone
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...colors.accentGold);
  doc.text('WhatsApp/Phone:', margin + 3, infoStartY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...colors.textDark);
  doc.text(bookingData.phoneNumber || '_______________', margin + 30, infoStartY + 12);

  // Country
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...colors.accentGold);
  doc.text('Country:', margin + 3, infoStartY + 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...colors.textDark);
  doc.text(bookingData.nationality || '_______________', margin + 30, infoStartY + 24);

  // Right Column
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...colors.accentGold);
  doc.text('Usage Type:', margin + 3 + colWidth + 3, infoStartY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...colors.textDark);
  doc.text(bookingData.usageType || '_______________', margin + 30 + colWidth + 3, infoStartY);

  yPos += infoBoxHeight + 8;

  // ===== SECTION 2: SERVICE & TIMELINE =====
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.accentPurple);
  doc.text('PROJECT DETAILS', margin, yPos);
  yPos += 8;

  // Service Box
  const serviceBoxHeight = 40;
  doc.setFillColor(...colors.lightGray);
  doc.rect(margin, yPos, contentWidth, serviceBoxHeight, 'F');
  doc.setDrawColor(...colors.accentPurple);
  doc.setLineWidth(0.5);
  doc.rect(margin, yPos, contentWidth, serviceBoxHeight);

  const serviceStartY = yPos + 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...colors.accentGold);
  doc.text('Service Needed:', margin + 3, serviceStartY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...colors.textDark);
  doc.text(bookingData.service || '_______________', margin + 35, serviceStartY);

  // Timeline
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...colors.accentGold);
  doc.text('Timeline:', margin + 3, serviceStartY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...colors.textDark);
  doc.text(bookingData.timeline || '_______________', margin + 35, serviceStartY + 12);

  // Project Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...colors.accentGold);
  doc.text('Project Brief:', margin + 3, serviceStartY + 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...colors.textDark);
  const briefText = bookingData.projectDetails || 'No details provided';
  const wrappedBrief = doc.splitTextToSize(briefText, contentWidth - 10);
  if (wrappedBrief.length > 0) {
    doc.text(wrappedBrief[0], margin + 35, serviceStartY + 24);
  }

  yPos += serviceBoxHeight + 8;

  // ===== SECTION 3: IMPORTANT NOTICE =====
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.accentGold);
  doc.text('NEXT STEPS', margin, yPos);
  yPos += 6;

  const noticeBoxHeight = 28;
  doc.setFillColor(255, 252, 240);
  doc.rect(margin, yPos, contentWidth, noticeBoxHeight, 'F');
  doc.setDrawColor(...colors.accentGold);
  doc.setLineWidth(0.5);
  doc.rect(margin, yPos, contentWidth, noticeBoxHeight);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.textDark);
  const noticeLines = doc.splitTextToSize(
    '✓ Ethan will review your request within 2 hours on business days\n✓ You will receive a WhatsApp or email with pricing and next steps\n✓ A 50% deposit is required to begin work',
    contentWidth - 6
  );

  let noticeY = yPos + 3;
  noticeLines.forEach((line: string) => {
    doc.text(line, margin + 3, noticeY);
    noticeY += 5;
  });

  yPos += noticeBoxHeight + 10;

  // ===== CONTACT INFO =====
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.accentBlue);
  doc.text('📧 Email:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.textGray);
  doc.text('mulukenendashaw68@gmail.com', margin + 25, yPos);

  yPos += 6;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.accentBlue);
  doc.text('📱 WhatsApp:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.textGray);
  doc.text('+27 78 1500968', margin + 35, yPos);

  // ===== FOOTER =====
  const footerY = pageHeight - 12;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(128, 128, 128);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
  doc.text('MuleSoo Digital Services | Pretoria, South Africa | www.mulesoo.com', pageWidth / 2, footerY, {
    align: 'center',
  });

  // Generate filename
  const date = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
  const filename = `MuleSoo_ServiceRequest_${bookingData.fullName.replace(/\s+/g, '_')}_${date}.pdf`;

  doc.save(filename);
};
