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
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let yPos = 15;

  doc.setFont('helvetica');

  // HEADER
  doc.setFillColor(240, 242, 250);
  doc.rect(0, 0, pageWidth, 45, 'F');

  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 200, 255);
  doc.text('MULE', margin, 18);
  doc.setTextColor(30, 30, 30);
  doc.text('SOO', margin + 25, 18);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('Digital Services | World-Class Solutions for Africa', margin, 24);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 200, 255);
  doc.text('SERVICE REQUEST FORM', pageWidth - margin, 18, { align: 'right' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  const currentDate = new Date().toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(`Date: ${currentDate}`, pageWidth - margin, 25, { align: 'right' });

  yPos = 50;

  // DIVIDER
  doc.setDrawColor(0, 200, 255);
  doc.setLineWidth(0.8);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // CLIENT INFORMATION
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 200, 255);
  doc.text('CLIENT INFORMATION', margin, yPos);
  yPos += 8;

  const infoBoxHeight = 58;
  doc.setFillColor(240, 242, 250);
  doc.rect(margin, yPos, contentWidth, infoBoxHeight, 'F');
  doc.setDrawColor(0, 200, 255);
  doc.setLineWidth(0.5);
  doc.rect(margin, yPos, contentWidth, infoBoxHeight);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);

  const infoStartY = yPos + 5;
  const colWidth = contentWidth / 2 - 3;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(232, 184, 75);
  doc.text('Full Name:', margin + 3, infoStartY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  doc.text(bookingData.fullName || '_______________', margin + 30, infoStartY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(232, 184, 75);
  doc.text('WhatsApp/Phone:', margin + 3, infoStartY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  doc.text(bookingData.phoneNumber || '_______________', margin + 30, infoStartY + 12);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(232, 184, 75);
  doc.text('Country:', margin + 3, infoStartY + 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  doc.text(bookingData.nationality || '_______________', margin + 30, infoStartY + 24);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(232, 184, 75);
  doc.text('Usage Type:', margin + 3 + colWidth + 3, infoStartY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  doc.text(bookingData.usageType || '_______________', margin + 30 + colWidth + 3, infoStartY);

  yPos += infoBoxHeight + 8;

  // SERVICE & TIMELINE
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(123, 47, 255);
  doc.text('PROJECT DETAILS', margin, yPos);
  yPos += 8;

  const serviceBoxHeight = 40;
  doc.setFillColor(240, 242, 250);
  doc.rect(margin, yPos, contentWidth, serviceBoxHeight, 'F');
  doc.setDrawColor(123, 47, 255);
  doc.setLineWidth(0.5);
  doc.rect(margin, yPos, contentWidth, serviceBoxHeight);

  const serviceStartY = yPos + 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(232, 184, 75);
  doc.text('Service Needed:', margin + 3, serviceStartY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  doc.text(bookingData.service || '_______________', margin + 35, serviceStartY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(232, 184, 75);
  doc.text('Timeline:', margin + 3, serviceStartY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  doc.text(bookingData.timeline || '_______________', margin + 35, serviceStartY + 12);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(232, 184, 75);
  doc.text('Project Brief:', margin + 3, serviceStartY + 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 30, 30);
  const briefText = bookingData.projectDetails || 'No details provided';
  const wrappedBrief = doc.splitTextToSize(briefText, contentWidth - 10);
  if (wrappedBrief.length > 0) {
    doc.text(wrappedBrief[0], margin + 35, serviceStartY + 24);
  }

  yPos += serviceBoxHeight + 8;

  // NEXT STEPS
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(232, 184, 75);
  doc.text('NEXT STEPS', margin, yPos);
  yPos += 6;

  const noticeBoxHeight = 28;
  doc.setFillColor(255, 252, 240);
  doc.rect(margin, yPos, contentWidth, noticeBoxHeight, 'F');
  doc.setDrawColor(232, 184, 75);
  doc.setLineWidth(0.5);
  doc.rect(margin, yPos, contentWidth, noticeBoxHeight);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 30, 30);
  const noticeLines = doc.splitTextToSize(
    '✓ Ena Muluken will review your request within 2 hours on business days\n✓ You will receive a WhatsApp or email with pricing and next steps\n✓ A 50% deposit is required to begin work',
    contentWidth - 6
  );

  let noticeY = yPos + 3;
  noticeLines.forEach((line: string) => {
    doc.text(line, margin + 3, noticeY);
    noticeY += 5;
  });

  yPos += noticeBoxHeight + 10;

  // CONTACT INFO
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 200, 255);
  doc.text('📧 Email:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('hello@mulesoo.com', margin + 25, yPos);

  yPos += 6;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 200, 255);
  doc.text('📱 WhatsApp:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('+27 68 852 9333', margin + 35, yPos);

  // FOOTER
  const footerY = doc.internal.pageSize.getHeight() - 12;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(128, 128, 128);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
  doc.text('MuleSoo Digital Services | Pretoria, South Africa | www.mulesoo.com', pageWidth / 2, footerY, {
    align: 'center',
  });

  const date = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
  const filename = `MuleSoo_ServiceRequest_${bookingData.fullName.replace(/\s+/g, '_')}_${date}.pdf`;

  doc.save(filename);
};
