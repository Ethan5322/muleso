import jsPDF from 'jspdf';

export const generateTermsAndConditionsPDF = () => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPos = 15;

  // ===== HEADER WITH LOGO AND BRANDING =====
  doc.setFillColor(5, 8, 16);
  doc.rect(0, 0, pageWidth, 50, 'F');

  // MuleSoo Logo/Brand
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 200, 255);
  doc.text('MULESOO', margin, 20);

  // Slogan
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(232, 184, 75);
  doc.text('🚀 Building World-Class Digital Products for Africa', margin, 28);

  // Document title
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(160, 178, 208);
  doc.text('TERMS & CONDITIONS', pageWidth - margin, 20, { align: 'right' });

  // Date
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const currentDate = new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.text('Effective: ' + currentDate, pageWidth - margin, 28, { align: 'right' });

  yPos = 55;

  // ===== DIVIDER =====
  doc.setDrawColor(0, 200, 255);
  doc.setLineWidth(1.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 12;

  // ===== SECTION 1: PAYMENT & DEPOSITS =====
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(232, 184, 75);
  doc.text('1. PAYMENT & DEPOSIT REQUIREMENTS', margin, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);

  const section1Text = [
    '• A 50% deposit is REQUIRED to begin any project. Without this deposit, MuleSoo cannot allocate resources or start development.',
    '• The remaining 50% balance must be paid in full before the final deliverables are released.',
    '• Payment accepted via bank transfer (EFT), Stripe card payments, and PayFast.',
    '• All prices are in South African Rand (ZAR) unless otherwise specified.',
  ];

  section1Text.forEach(line => {
    const wrapped = doc.splitTextToSize(line, contentWidth - 5);
    wrapped.forEach((wrappedLine: string) => {
      doc.text(wrappedLine, margin + 2, yPos);
      yPos += 5;
    });
  });

  yPos += 5;

  // ===== SECTION 2: DELIVERABLES & PAYMENT =====
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 200, 255);
  doc.text('2. DELIVERABLES & FULL PAYMENT', margin, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);

  const section2Text = [
    '• WITHOUT FULL PAYMENT: Downloadable PDFs, source code files, and project archives will NOT be provided.',
    '• Partial Deliverables: If you request to stop work mid-project, you will receive only what has been completed up to that point, with no refund of the deposit.',
    '• Upon receipt of FULL PAYMENT: You will receive all project files including source code, design files, and downloadable deliverables.',
    '• Ownership: After full payment, you own all creative work and source code. MuleSoo retains the right to display projects in portfolio.',
  ];

  section2Text.forEach(line => {
    const wrapped = doc.splitTextToSize(line, contentWidth - 5);
    wrapped.forEach((wrappedLine: string) => {
      doc.text(wrappedLine, margin + 2, yPos);
      yPos += 5;
    });
  });

  yPos += 5;

  // ===== SECTION 3: PROJECT TIMELINE =====
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(123, 47, 255);
  doc.text('3. PROJECT TIMELINE & DELIVERY', margin, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);

  const section3Text = [
    '• Project timelines are estimates and subject to scope, complexity, and client feedback cycles.',
    '• Delays caused by client feedback, late payment, or scope changes are not MuleSoo\'s responsibility.',
    '• Rush delivery (shorter timelines) may incur additional fees of 20-30% of the project cost.',
    '• Final delivery occurs only after all revisions are complete and full payment is received.',
  ];

  section3Text.forEach(line => {
    const wrapped = doc.splitTextToSize(line, contentWidth - 5);
    wrapped.forEach((wrappedLine: string) => {
      doc.text(wrappedLine, margin + 2, yPos);
      yPos += 5;
    });
  });

  yPos += 5;

  // ===== SECTION 4: SUPPORT & REVISIONS =====
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 255, 136);
  doc.text('4. SUPPORT & REVISIONS', margin, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);

  const section4Text = [
    '• All projects include 30 days of FREE support for bug fixes and minor adjustments.',
    '• Up to 3 rounds of revisions are included. Additional revisions are charged at hourly rates (R250/hour).',
    '• Support beyond 30 days is available at R250/hour or via annual maintenance packages.',
    '• Support hours: Monday-Friday 8am-6pm SAST, Saturday 9am-1pm SAST.',
  ];

  section4Text.forEach(line => {
    const wrapped = doc.splitTextToSize(line, contentWidth - 5);
    wrapped.forEach((wrappedLine: string) => {
      doc.text(wrappedLine, margin + 2, yPos);
      yPos += 5;
    });
  });

  yPos += 5;

  // ===== SECTION 5: INTELLECTUAL PROPERTY =====
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(232, 184, 75);
  doc.text('5. INTELLECTUAL PROPERTY & USAGE RIGHTS', margin, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);

  const section5Text = [
    '• Upon full payment, you own all work product. MuleSoo retains the right to use the design/work in portfolio and case studies.',
    '• You may not resell, redistribute, or claim ownership of work before full payment is received.',
    '• Custom code and designs created during your project are your intellectual property after payment.',
    '• MuleSoo\'s templates, frameworks, and reusable components remain MuleSoo\'s property.',
  ];

  section5Text.forEach(line => {
    const wrapped = doc.splitTextToSize(line, contentWidth - 5);
    wrapped.forEach((wrappedLine: string) => {
      doc.text(wrappedLine, margin + 2, yPos);
      yPos += 5;
    });
  });

  // Add new page if needed
  if (yPos > pageHeight - 60) {
    doc.addPage();
    yPos = 20;
  } else {
    yPos += 5;
  }

  // ===== SECTION 6: REFUND POLICY =====
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 200, 255);
  doc.text('6. REFUND & CANCELLATION POLICY', margin, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);

  const section6Text = [
    '• DEPOSITS are NON-REFUNDABLE once work has begun. If you cancel before work starts, 100% deposit refund applies.',
    '• If you request cancellation after work begins, the deposit is forfeited. You will pay additional fees for work completed.',
    '• Refund requests must be made in writing within 7 days of cancellation.',
    '• MuleSoo reserves the right to cancel projects if payment is not received within 30 days of invoice date.',
  ];

  section6Text.forEach(line => {
    const wrapped = doc.splitTextToSize(line, contentWidth - 5);
    wrapped.forEach((wrappedLine: string) => {
      doc.text(wrappedLine, margin + 2, yPos);
      yPos += 5;
    });
  });

  yPos += 5;

  // ===== SECTION 7: LIABILITY =====
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(123, 47, 255);
  doc.text('7. LIABILITY & LIMITATIONS', margin, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);

  const section7Text = [
    '• MuleSoo is not liable for data loss, hacking, or security breaches caused by client negligence.',
    '• MuleSoo is not responsible for third-party platform changes (Google, Meta, etc.) that affect your site.',
    '• Client is responsible for maintaining backups of all project files.',
    '• Maximum liability is limited to the amount paid for the project.',
  ];

  section7Text.forEach(line => {
    const wrapped = doc.splitTextToSize(line, contentWidth - 5);
    wrapped.forEach((wrappedLine: string) => {
      doc.text(wrappedLine, margin + 2, yPos);
      yPos += 5;
    });
  });

  yPos += 10;

  // ===== AGREEMENT SIGNATURE SECTION =====
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(232, 184, 75);
  doc.text('CLIENT AGREEMENT', margin, yPos);
  yPos += 6;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);
  const agreeText = doc.splitTextToSize(
    'By engaging MuleSoo for services and submitting this form, you agree to all terms and conditions outlined in this document. No exceptions will be made without written consent from both parties.',
    contentWidth - 5
  );

  agreeText.forEach((line: string) => {
    doc.text(line, margin + 2, yPos);
    yPos += 5;
  });

  yPos += 10;

  // Signature lines
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Client Name: ________________________________     Date: ________________', margin, yPos);
  yPos += 8;
  doc.text('Signature: _________________________________', margin, yPos);

  // ===== FOOTER =====
  yPos = pageHeight - 15;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(128, 128, 128);
  doc.line(margin, yPos - 5, pageWidth - margin, yPos - 5);
  doc.text('MuleSoo Digital Services | Pretoria, South Africa', pageWidth / 2, yPos, { align: 'center' });
  doc.text('Phone: 0781500968 | Email: mulukenendashaw68@gmail.com | www.mulesoo.com', pageWidth / 2, yPos + 5, { align: 'center' });

  // Save the PDF
  const filename = `MuleSoo_Terms_and_Conditions_${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}.pdf`;
  doc.save(filename);
};
