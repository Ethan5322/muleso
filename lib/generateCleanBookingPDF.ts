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
  clientID?: string;
  clientIDType?: 'national_id' | 'passport' | '';
  verificationCode?: string;
}

export const generateCleanBookingPDF = async (bookingData: BookingData): Promise<void> => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;

    let yPos = margin;

    // PAGE 1: HEADER & BOOKING DETAILS
    // ================================

    // Professional Header
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 200, 255);
    doc.text('MULESOO', margin, yPos);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 120, 140);
    doc.text('Digital Services | Professional Technology Solutions', margin, yPos + 6);

    // Company details (right side)
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text('Pretoria, South Africa', pageWidth - margin - 40, yPos);
    doc.text('Phone: +27 759 440 377', pageWidth - margin - 40, yPos + 4);
    doc.text('Email: mulukenendashaw68@gmail.com', pageWidth - margin - 40, yPos + 8);

    yPos += 15;

    // Separator line
    doc.setDrawColor(0, 200, 255);
    doc.setLineWidth(1);
    doc.line(margin, yPos, pageWidth - margin, yPos);

    yPos += 8;

    // Document title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('PROJECT BOOKING AGREEMENT', margin, yPos);

    yPos += 10;

    // Booking Reference & Code - Top Right (NO OVERLAP)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(232, 184, 75);
    doc.text('Booking Reference:', pageWidth - margin - 50, yPos);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 200, 255);
    doc.text(bookingData.bookingReference, pageWidth - margin - 50, yPos + 5);

    yPos += 15;

    // CLIENT INFORMATION SECTION
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 200, 255);
    doc.text('CLIENT INFORMATION', margin, yPos);

    yPos += 6;

    // Background for section
    doc.setFillColor(240, 248, 255);
    doc.rect(margin, yPos - 2, contentWidth, 50, 'F');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    const col1X = margin + 2;
    const col2X = margin + contentWidth / 2;

    // Row 1: Name & Email
    doc.setFont('helvetica', 'bold');
    doc.text('Full Name:', col1X, yPos + 4);
    doc.setFont('helvetica', 'normal');
    doc.text(bookingData.fullName || 'N/A', col1X + 22, yPos + 4);

    doc.setFont('helvetica', 'bold');
    doc.text('Email Address:', col2X, yPos + 4);
    doc.setFont('helvetica', 'normal');
    doc.text(bookingData.email || 'N/A', col2X + 25, yPos + 4);

    // Row 2: Phone & Company
    doc.setFont('helvetica', 'bold');
    doc.text('Phone Number:', col1X, yPos + 12);
    doc.setFont('helvetica', 'normal');
    doc.text(bookingData.phoneNumber || 'N/A', col1X + 25, yPos + 12);

    doc.setFont('helvetica', 'bold');
    doc.text('Company:', col2X, yPos + 12);
    doc.setFont('helvetica', 'normal');
    doc.text(bookingData.company || 'N/A', col2X + 18, yPos + 12);

    // Row 3: Country & Type
    doc.setFont('helvetica', 'bold');
    doc.text('Country:', col1X, yPos + 20);
    doc.setFont('helvetica', 'normal');
    doc.text(bookingData.nationality || 'N/A', col1X + 18, yPos + 20);

    doc.setFont('helvetica', 'bold');
    doc.text('Business Type:', col2X, yPos + 20);
    doc.setFont('helvetica', 'normal');
    doc.text(bookingData.usageType || 'N/A', col2X + 24, yPos + 20);

    // Row 4: Client ID (if provided)
    if (bookingData.clientID) {
      doc.setFont('helvetica', 'bold');
      const idLabel = bookingData.clientIDType === 'passport' ? 'Passport:' : 'National ID:';
      doc.text(idLabel, col1X, yPos + 28);
      doc.setFont('helvetica', 'normal');
      doc.text(bookingData.clientID, col1X + 22, yPos + 28);
    }

    yPos += 55;

    // PROJECT DETAILS SECTION
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 200, 255);
    doc.text('PROJECT SPECIFICATION', margin, yPos);

    yPos += 6;

    // Background for section
    doc.setFillColor(245, 245, 250);
    doc.rect(margin, yPos - 2, contentWidth, 45, 'F');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    // Service & Budget
    doc.setFont('helvetica', 'bold');
    doc.text('Service:', col1X, yPos + 4);
    doc.setFont('helvetica', 'normal');
    doc.text(bookingData.service || 'N/A', col1X + 15, yPos + 4);

    doc.setFont('helvetica', 'bold');
    doc.text('Budget Range:', col2X, yPos + 4);
    doc.setFont('helvetica', 'normal');
    doc.text(bookingData.budget || 'N/A', col2X + 22, yPos + 4);

    // Timeline & Contact
    doc.setFont('helvetica', 'bold');
    doc.text('Project Timeline:', col1X, yPos + 12);
    doc.setFont('helvetica', 'normal');
    doc.text(bookingData.timeline || 'N/A', col1X + 27, yPos + 12);

    doc.setFont('helvetica', 'bold');
    doc.text('Preferred Contact:', col2X, yPos + 12);
    doc.setFont('helvetica', 'normal');
    doc.text(bookingData.contactMethod || 'N/A', col2X + 28, yPos + 12);

    // Project Description
    doc.setFont('helvetica', 'bold');
    doc.text('Project Description:', col1X, yPos + 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const descLines = doc.splitTextToSize(
      bookingData.improvedProjectDetails || bookingData.projectDetails || 'N/A',
      contentWidth - 4
    );
    doc.text(descLines.slice(0, 2), col1X + 2, yPos + 25);

    yPos += 50;

    // VERIFICATION CODE SECTION
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(232, 184, 75);
    doc.text('VERIFICATION CODE', margin, yPos);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 200, 255);
    const verificationCode = bookingData.verificationCode || generateVerificationCode();
    doc.text(verificationCode, margin, yPos + 7);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('(Keep this code safe - required for project completion verification)', margin, yPos + 12);

    yPos += 18;

    // PAGE 1 FOOTER
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 120, 120);
    doc.text('MuleSoo Digital Services | Professional Web Development & Digital Solutions', pageWidth / 2, pageHeight - 8, {
      align: 'center',
    });

    // ADD NEW PAGE FOR TERMS & CONDITIONS
    doc.addPage();
    yPos = margin;

    // PAGE 2: DETAILED TERMS & CONDITIONS
    // ===================================

    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 200, 255);
    doc.text('TERMS & CONDITIONS', margin, yPos);

    yPos += 10;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    const addSection = (title: string, content: string[]) => {
      if (yPos > pageHeight - 20) {
        doc.addPage();
        yPos = margin;
      }

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 200, 255);
      doc.text(title, margin, yPos);
      yPos += 4;

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);

      content.forEach((line) => {
        if (yPos > pageHeight - 15) {
          doc.addPage();
          yPos = margin;
        }
        const wrappedLines = doc.splitTextToSize(line, contentWidth - 2);
        wrappedLines.forEach((wLine: string) => {
          doc.text(wLine, margin + 2, yPos);
          yPos += 3;
        });
      });

      yPos += 2;
    };

    // Terms and conditions content
    addSection('1. SERVICE SCOPE & DELIVERABLES', [
      '1.1 MuleSoo Digital Services (herein referred to as "Service Provider") agrees to provide professional digital services as specified in the project booking agreement.',
      '1.2 The scope of work is limited to the services selected and budget specified. Any work beyond this scope will be considered a separate project and will require a new agreement and additional payment.',
      '1.3 All deliverables will be provided in industry-standard formats suitable for the service type (web files, design files, documentation, etc.).',
      '1.4 The Service Provider will maintain professional quality standards aligned with international best practices in web development, design, and digital solutions.',
    ]);

    addSection('2. PAYMENT TERMS & SCHEDULE', [
      '2.1 A 50% deposit is required to commence work on the project. This deposit secures your project timeline and allows the Service Provider to allocate resources.',
      '2.2 The remaining 50% payment is due immediately upon project completion, before final delivery of all project files and access.',
      '2.3 Payment methods accepted: Bank transfer (EFT), Credit/Debit card via Stripe, and PayFast.',
      '2.4 All pricing is in South African Rands (ZAR) unless otherwise agreed in writing.',
      '2.5 Payment must be received in full before the Service Provider surrenders ownership and access to the completed project.',
      '2.6 Late payment penalties: 2% interest per month will be charged for payments overdue by more than 7 days.',
    ]);

    addSection('3. PROJECT TIMELINE & DELIVERY', [
      '3.1 Project timelines are estimates based on the specified scope. The Service Provider will make commercially reasonable efforts to meet stated deadlines.',
      '3.2 Delays may occur due to: unclear client feedback, scope changes, client unavailability for feedback/approvals, or circumstances beyond the Service Provider\'s control.',
      '3.3 The Service Provider is not liable for delays caused by client-side delays in providing materials, feedback, or approvals.',
      '3.4 Delivery dates commence from the date of the signed agreement and receipt of 50% payment deposit.',
      '3.5 The Service Provider reserves the right to extend timelines if the client requests significant scope changes or additional work.',
    ]);

    addSection('4. INTELLECTUAL PROPERTY & OWNERSHIP', [
      '4.1 Upon full payment, all intellectual property rights (including designs, code, content, and documentation) transfer to the client.',
      '4.2 Before full payment, the Service Provider retains ownership. Clients may not redistribute, resell, or claim ownership of incomplete or unpaid projects.',
      '4.3 The Service Provider retains the right to: (a) display completed work in portfolio/case studies (with client permission), (b) use project methodologies for future projects, (c) retain backup copies for archival purposes.',
      '4.4 The client grants the Service Provider a non-exclusive license to use project documentation for quality improvement and training purposes.',
      '4.5 Any third-party assets (stock images, plugins, frameworks) remain subject to their original licenses and terms.',
    ]);

    addSection('5. CLIENT RESPONSIBILITIES', [
      '5.1 Client agrees to provide accurate information, materials, and content required for the project (text, images, branding guidelines, etc.).',
      '5.2 Client is responsible for providing clear, detailed feedback and approvals on project milestones in a timely manner.',
      '5.3 Client is responsible for obtaining necessary permissions, copyrights, and licenses for any content provided to the Service Provider.',
      '5.4 Client must communicate changes and additional requests in writing to avoid misunderstandings.',
      '5.5 Client agrees not to use the Service Provider\'s work for competing services without explicit written permission.',
    ]);

    addSection('6. REVISION & MODIFICATION POLICY', [
      '6.1 The project fee includes up to 2 rounds of revisions after the initial delivery.',
      '6.2 Revisions are limited to modifications of the originally agreed-upon deliverables. Major redesigns or scope changes are not considered "revisions."',
      '6.3 Additional revisions beyond the included rounds will be charged at R500/hour or as mutually agreed.',
      '6.4 Revision requests must be submitted in writing with specific details about desired changes.',
      '6.5 The Service Provider will prioritize revisions and aim to complete them within 5 business days.',
    ]);

    addSection('7. SUPPORT & MAINTENANCE', [
      '7.1 The Service Provider provides 30 days of complimentary technical support for the delivered project.',
      '7.2 Support includes: bug fixes, minor updates, technical assistance, and hosting/domain support (if applicable).',
      '7.3 Support does not include: feature additions, content updates, security audits beyond scope, or backup recovery from client-caused data loss.',
      '7.4 After the 30-day support period, ongoing maintenance is available at negotiated rates (typically R2,000-R5,000/month depending on scope).',
      '7.5 The Service Provider will respond to support requests within 24 business hours.',
    ]);

    addSection('8. CONFIDENTIALITY & DATA PROTECTION', [
      '8.1 Both parties agree to maintain confidentiality regarding project details, pricing, and sensitive client information.',
      '8.2 The Service Provider will not disclose client information to third parties without written consent.',
      '8.3 Client data is stored securely using industry-standard encryption and security measures.',
      '8.4 The Service Provider complies with POPIA (Protection of Personal Information Act) requirements for any personal data processed.',
      '8.5 Upon project completion, client data is retained for 90 days for backup purposes, then securely deleted unless otherwise agreed.',
    ]);

    addSection('9. LIABILITY & DISCLAIMERS', [
      '9.1 The Service Provider provides services "as is" without warranties of merchantability or fitness for a specific purpose.',
      '9.2 The Service Provider is not liable for: client data loss, misuse of delivered products, third-party claims, or indirect damages.',
      '9.3 Total liability is limited to the amount paid by the client for the project (50% of total project cost before full completion).',
      '9.4 Client is responsible for backups, security, and proper usage of delivered products after project completion.',
      '9.5 The Service Provider is not responsible for website downtime caused by hosting providers or third-party services.',
    ]);

    addSection('10. CANCELLATION & REFUND POLICY', [
      '10.1 If client cancels before work commences: Full refund of deposit.',
      '10.2 If client cancels during development (after 25% work completion): Deposit is forfeited; client pays for completed work at pro-rata rates.',
      '10.3 If client cancels after 75% completion: Client must pay 100% of project fee.',
      '10.4 If Service Provider cannot complete project due to technical impossibility: Full refund of all payments.',
      '10.5 No refunds are issued for client dissatisfaction if work meets the agreed specifications.',
    ]);

    addSection('11. DISPUTE RESOLUTION', [
      '11.1 Any disputes arising from this agreement shall first be resolved through good-faith negotiation between both parties.',
      '11.2 If negotiation fails, disputes will be escalated to mediation before legal proceedings.',
      '11.3 Both parties agree to abide by the laws of South Africa. Jurisdiction: South African courts.',
      '11.4 Each party is responsible for their own legal fees unless otherwise awarded by a court.',
    ]);

    addSection('12. AMENDMENTS & CHANGES', [
      '12.1 Changes to this agreement must be made in writing and signed by both parties.',
      '12.2 Scope changes requested by the client may result in timeline extensions and additional fees.',
      '12.3 The Service Provider reserves the right to update these terms with 30 days written notice.',
    ]);

    // Add signature section
    yPos += 10;
    if (yPos > pageHeight - 30) {
      doc.addPage();
      yPos = margin;
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('ACCEPTANCE & SIGNATURES', margin, yPos);

    yPos += 8;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('By signing below, both parties acknowledge that they have read, understood, and agree to be bound by the terms and conditions outlined above.', margin, yPos, {
      maxWidth: contentWidth,
    });

    yPos += 15;

    // Client signature
    doc.line(margin, yPos, margin + 40, yPos);
    doc.setFontSize(7);
    doc.text('Client Signature', margin, yPos + 3);

    doc.line(margin + 50, yPos, margin + 90, yPos);
    doc.text('Date', margin + 50, yPos + 3);

    yPos += 10;

    // Service Provider signature
    doc.line(margin, yPos, margin + 40, yPos);
    doc.text('Service Provider', margin, yPos + 3);

    doc.line(margin + 50, yPos, margin + 90, yPos);
    doc.text('Date', margin + 50, yPos + 3);

    yPos += 12;

    // Footer
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text('This agreement is legally binding. Please retain a copy for your records.', margin, pageHeight - 5);

    // Save
    const date = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
    const filename = `MuleSoo_Professional_Agreement_${bookingData.fullName.replace(/\s+/g, '_')}_${date}.pdf`;

    doc.save(filename);
    console.log('✅ Professional PDF generated:', filename);
  } catch (error) {
    console.error('❌ PDF generation failed:', error);
    throw error;
  }
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
