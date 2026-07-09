import QRCode from 'qrcode';

export interface BookingData {
  clientName: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  price: string;
  description?: string;
  bookingId: string;
}

export async function generateBookingConfirmationPDF(booking: BookingData) {
  // Dynamic import for jsPDF to avoid SSR issues
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();

  // Generate QR code
  const qrCodeDataUrl = await QRCode.toDataURL('https://mulesoo.com', {
    errorCorrectionLevel: 'H',
    width: 200,
    margin: 2,
  });

  // Colors as RGB arrays
  const primaryBlue: [number, number, number] = [0, 200, 255];
  const darkBg: [number, number, number] = [5, 8, 16];
  const gold: [number, number, number] = [232, 184, 75];
  const white: [number, number, number] = [255, 255, 255];
  const lightGray: [number, number, number] = [168, 178, 208];

  // Background
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, 210, 297, 'F');

  // Header - MuleSoo Logo and Title
  doc.setTextColor(...primaryBlue);
  doc.setFontSize(28);
  doc.text('MULE', 20, 20);
  doc.setTextColor(...white);
  doc.text('SOO', 48, 20);

  doc.setTextColor(...gold);
  doc.setFontSize(12);
  doc.text('BOOKING CONFIRMATION', 20, 30);

  // QR Code in center top
  doc.addImage(qrCodeDataUrl, 'PNG', 85, 40, 40, 40);
  doc.setTextColor(...gold);
  doc.setFontSize(8);
  doc.text('Scan for details', 105, 82, { align: 'center' });

  // Booking Details Section
  doc.setTextColor(...white);
  doc.setFontSize(11);
  doc.text('Booking Details', 20, 95);

  doc.setDrawColor(...gold);
  doc.line(20, 97, 190, 97);

  doc.setFontSize(9);
  doc.setTextColor(...gold);
  doc.text('Booking ID:', 20, 105);
  doc.setTextColor(...white);
  doc.text(booking.bookingId, 50, 105);

  doc.setTextColor(...gold);
  doc.text('Client Name:', 20, 115);
  doc.setTextColor(...white);
  doc.text(booking.clientName, 50, 115);

  doc.setTextColor(...gold);
  doc.text('Email:', 20, 125);
  doc.setTextColor(...white);
  doc.text(booking.email, 50, 125);

  doc.setTextColor(...gold);
  doc.text('Phone:', 20, 135);
  doc.setTextColor(...white);
  doc.text(booking.phone, 50, 135);

  // Service Details
  doc.setTextColor(...white);
  doc.setFontSize(11);
  doc.text('Service Information', 20, 150);

  doc.setDrawColor(...gold);
  doc.line(20, 152, 190, 152);

  doc.setFontSize(9);
  doc.setTextColor(...gold);
  doc.text('Service:', 20, 160);
  doc.setTextColor(...white);
  doc.text(booking.service, 50, 160);

  doc.setTextColor(...gold);
  doc.text('Date:', 20, 170);
  doc.setTextColor(...white);
  doc.text(booking.date, 50, 170);

  doc.setTextColor(...gold);
  doc.text('Time:', 20, 180);
  doc.setTextColor(...white);
  doc.text(booking.time, 50, 180);

  doc.setTextColor(...gold);
  doc.text('Price:', 20, 190);
  doc.setTextColor(...primaryBlue);
  doc.setFontSize(11);
  doc.text(booking.price, 50, 190);

  // Description if provided
  if (booking.description) {
    doc.setFontSize(9);
    doc.setTextColor(...white);
    doc.text('Notes:', 20, 205);
    const lines = doc.splitTextToSize(booking.description, 150);
    doc.setTextColor(...lightGray);
    doc.text(lines as string[], 20, 215);
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(...gold);
  doc.text('Thank you for choosing MuleSoo Digital Services', 105, 280, { align: 'center' });

  doc.setTextColor(...[122, 139, 168] as [number, number, number]);
  doc.text('Pretoria, South Africa | hello@mulesoo.com | www.www.mulesoo.com', 105, 287, { align: 'center' });

  // Save PDF
  doc.save(`booking-confirmation-${booking.bookingId}.pdf`);
}

export async function generateTermsAndConditionsPDF() {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();

  // Generate QR code
  const qrCodeDataUrl = await QRCode.toDataURL('https://mulesoo.com', {
    errorCorrectionLevel: 'H',
    width: 150,
    margin: 2,
  });

  const primaryBlue: [number, number, number] = [0, 200, 255];
  const darkBg: [number, number, number] = [5, 8, 16];
  const gold: [number, number, number] = [232, 184, 75];
  const white: [number, number, number] = [255, 255, 255];
  const lightGray: [number, number, number] = [168, 178, 208];

  // Background
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, 210, 297, 'F');

  // Header
  doc.setTextColor(...primaryBlue);
  doc.setFontSize(24);
  doc.text('MULE', 20, 20);
  doc.setTextColor(...white);
  doc.text('SOO', 44, 20);

  doc.setTextColor(...gold);
  doc.setFontSize(12);
  doc.text('Terms & Conditions', 20, 30);

  // QR Code
  doc.addImage(qrCodeDataUrl, 'PNG', 160, 15, 35, 35);

  // Content
  doc.setFontSize(10);
  doc.setTextColor(...white);
  doc.text('1. Booking Agreement', 20, 50);

  doc.setFontSize(8);
  doc.setTextColor(...lightGray);
  const content = [
    'By booking a service with MuleSoo Digital Services, you agree to our terms and conditions.',
    'All services are provided as described and must be paid in full before delivery.',
    'Clients are responsible for providing accurate information for their projects.',
  ];

  let yPos = 58;
  content.forEach((line) => {
    const lines = doc.splitTextToSize('• ' + line, 160);
    doc.text(lines as string[], 20, yPos);
    yPos += 8;
  });

  doc.setFontSize(10);
  doc.setTextColor(...white);
  doc.text('2. Payment Terms', 20, yPos + 5);

  doc.setFontSize(8);
  doc.setTextColor(...lightGray);
  yPos += 13;
  doc.text('• Payment must be received before project commencement', 20, yPos);
  yPos += 6;
  doc.text('• Invoices are due within 7 days unless otherwise agreed', 20, yPos);
  yPos += 6;
  doc.text('• Late payments may result in project suspension', 20, yPos);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(...gold);
  doc.text('MuleSoo Digital Services', 105, 280, { align: 'center' });
  doc.setTextColor(...[122, 139, 168] as [number, number, number]);
  doc.text('hello@mulesoo.com | www.www.mulesoo.com', 105, 287, { align: 'center' });

  doc.save('terms-and-conditions.pdf');
}
