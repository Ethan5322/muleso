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

// Brand palette (matches website CSS variables)
const BLUE: [number, number, number] = [0, 200, 255];
const PURPLE: [number, number, number] = [123, 47, 255];
const GOLD: [number, number, number] = [232, 184, 75];
const INK: [number, number, number] = [20, 28, 46];
const MUTED: [number, number, number] = [110, 122, 145];

export const generateCleanBookingPDF = async (bookingData: BookingData): Promise<void> => {
  try {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 16;
    const contentWidth = pageWidth - 2 * margin;
    const centerX = pageWidth / 2;

    const verificationCode = bookingData.verificationCode || generateVerificationCode();

    // Pre-generate the company QR code (encodes the company site + booking ref for traceability)
    let qrDataUrl = '';
    try {
      qrDataUrl = await new Promise<string>((resolve, reject) => {
        QRCode.toDataURL(
          `https://mulesoo.vercel.app/?ref=${encodeURIComponent(bookingData.bookingReference || '')}`,
          { width: 600, margin: 0, color: { dark: '#0A0F1E', light: '#FFFFFF' } },
          (error, url) => (error ? reject(error) : resolve(url))
        );
      });
    } catch (err) {
      console.error('QR Code generation failed:', err);
    }

    // ============================================================
    // CORPORATE HEADER (company QR centered, no overlaps)
    // ============================================================
    const headerTop = 12;
    const qrSize = 20;

    // Top accent bar
    doc.setFillColor(...BLUE);
    doc.rect(0, 0, pageWidth, 3, 'F');
    doc.setFillColor(...GOLD);
    doc.rect(0, 3, pageWidth, 0.8, 'F');

    // LEFT: brand wordmark
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(...BLUE);
    doc.text('MULESOO', margin, headerTop + 7);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text('D I G I T A L   S E R V I C E S', margin, headerTop + 12);

    // CENTER: company QR code + caption (centered horizontally, clear of side blocks)
    if (qrDataUrl) {
      doc.addImage(qrDataUrl, 'PNG', centerX - qrSize / 2, headerTop - 1, qrSize, qrSize);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(...BLUE);
      doc.text('SCAN TO VISIT US', centerX, headerTop + qrSize + 2, { align: 'center' });
    }

    // RIGHT: contact details
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...INK);
    const rightX = pageWidth - margin;
    doc.text('Pretoria, South Africa', rightX, headerTop + 3, { align: 'right' });
    doc.text('+27 68 852 9333', rightX, headerTop + 7.5, { align: 'right' });
    doc.text('mulukenendashaw68@gmail.com', rightX, headerTop + 12, { align: 'right' });
    doc.text('mulesoo.vercel.app', rightX, headerTop + 16.5, { align: 'right' });

    // Divider below header
    let yPos = headerTop + qrSize + 7;
    doc.setDrawColor(...BLUE);
    doc.setLineWidth(0.6);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 9;

    // ============================================================
    // DOCUMENT TITLE + REFERENCE
    // ============================================================
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(17);
    doc.setTextColor(...INK);
    doc.text('PROJECT BOOKING AGREEMENT', margin, yPos);

    // Reference badge (right)
    const badgeW = 58;
    const badgeX = pageWidth - margin - badgeW;
    doc.setFillColor(245, 248, 255);
    doc.setDrawColor(...BLUE);
    doc.setLineWidth(0.4);
    doc.roundedRect(badgeX, yPos - 6, badgeW, 12, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...MUTED);
    doc.text('BOOKING REFERENCE', badgeX + 3, yPos - 2);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...BLUE);
    doc.text(bookingData.bookingReference || 'N/A', badgeX + 3, yPos + 3);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    const issued = new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });
    yPos += 6;
    doc.text(`Issued: ${issued}`, margin, yPos);
    yPos += 9;

    // Helper: section heading
    const sectionHeading = (label: string, color: [number, number, number] = BLUE) => {
      doc.setFillColor(...color);
      doc.rect(margin, yPos - 3.5, 1.6, 5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...color);
      doc.text(label, margin + 4, yPos);
      yPos += 6;
    };

    const field = (label: string, value: string, x: number, y: number, labelW: number) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...INK);
      doc.text(label, x, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 70, 90);
      doc.text(value || 'N/A', x + labelW, y);
    };

    const col1X = margin + 3;
    const col2X = margin + contentWidth / 2 + 3;

    // ============================================================
    // CLIENT INFORMATION
    // ============================================================
    sectionHeading('CLIENT INFORMATION');
    const clientBoxH = bookingData.clientID ? 34 : 26;
    doc.setFillColor(247, 250, 255);
    doc.setDrawColor(225, 232, 245);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, yPos, contentWidth, clientBoxH, 1.5, 1.5, 'FD');
    let r = yPos + 6;
    field('Full Name:', bookingData.fullName, col1X, r, 22);
    field('Email:', bookingData.email, col2X, r, 14);
    r += 7;
    field('Phone:', bookingData.phoneNumber, col1X, r, 22);
    field('Company:', bookingData.company || '—', col2X, r, 18);
    r += 7;
    field('Country:', bookingData.nationality, col1X, r, 22);
    field('Type:', bookingData.usageType, col2X, r, 14);
    if (bookingData.clientID) {
      r += 7;
      const idLabel = bookingData.clientIDType === 'passport' ? 'Passport:' : 'National ID:';
      field(idLabel, bookingData.clientID, col1X, r, 22);
    }
    yPos += clientBoxH + 9;

    // ============================================================
    // PROJECT SPECIFICATION
    // ============================================================
    sectionHeading('PROJECT SPECIFICATION', PURPLE);
    const descText = bookingData.improvedProjectDetails || bookingData.projectDetails || 'N/A';
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const descLines = doc.splitTextToSize(descText, contentWidth - 8);
    const shownDesc = descLines.slice(0, 5);
    const specBoxH = 22 + shownDesc.length * 4;
    doc.setFillColor(249, 247, 255);
    doc.setDrawColor(230, 224, 248);
    doc.roundedRect(margin, yPos, contentWidth, specBoxH, 1.5, 1.5, 'FD');
    r = yPos + 6;
    field('Service:', bookingData.service, col1X, r, 22);
    field('Budget:', bookingData.budget, col2X, r, 18);
    r += 7;
    field('Timeline:', bookingData.timeline, col1X, r, 22);
    field('Contact via:', bookingData.contactMethod, col2X, r, 22);
    r += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...INK);
    doc.text('Project Description:', col1X, r);
    r += 4.5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 70, 90);
    doc.text(shownDesc, col1X, r);
    yPos += specBoxH + 9;

    // ============================================================
    // VERIFICATION CODE
    // ============================================================
    doc.setFillColor(255, 251, 240);
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, yPos, contentWidth, 16, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...GOLD);
    doc.text('VERIFICATION CODE', col1X, yPos + 5.5);
    doc.setFontSize(13);
    doc.setTextColor(...INK);
    doc.text(verificationCode, col1X, yPos + 11.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...MUTED);
    doc.text('Keep this code safe — required to verify project completion.', rightX, yPos + 11.5, { align: 'right' });

    // ============================================================
    // PAGE 2+: TERMS & CONDITIONS
    // ============================================================
    doc.addPage();
    yPos = headerTop;

    doc.setFillColor(...BLUE);
    doc.rect(0, 0, pageWidth, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(...INK);
    doc.text('TERMS & CONDITIONS', margin, yPos + 4);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(`Ref: ${bookingData.bookingReference || 'N/A'}`, rightX, yPos + 4, { align: 'right' });
    yPos += 9;
    doc.setDrawColor(...BLUE);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 7;

    const addSection = (title: string, content: string[]) => {
      if (yPos > pageHeight - 24) {
        doc.addPage();
        yPos = headerTop;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(...BLUE);
      doc.text(title, margin, yPos);
      yPos += 4.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(40, 48, 66);
      content.forEach((line) => {
        const wrapped = doc.splitTextToSize(line, contentWidth - 3);
        wrapped.forEach((wLine: string) => {
          if (yPos > pageHeight - 16) {
            doc.addPage();
            yPos = headerTop;
          }
          doc.text(wLine, margin + 2, yPos);
          yPos += 3.6;
        });
      });
      yPos += 3;
    };

    addSection('1. SERVICE SCOPE & DELIVERABLES', [
      '1.1 MuleSoo Digital Services ("Service Provider") agrees to provide the professional digital services specified in this booking agreement.',
      '1.2 The scope of work is limited to the service selected and budget specified. Work beyond this scope is a separate project requiring a new agreement and additional payment.',
      '1.3 All deliverables are provided in industry-standard formats appropriate to the service type (web files, design files, documentation, etc.).',
      '1.4 The Service Provider maintains quality standards aligned with international best practices in web development, design, and digital solutions.',
    ]);

    addSection('2. PAYMENT TERMS & SCHEDULE', [
      '2.1 A 50% deposit is required to commence work. This secures your timeline and allows resources to be allocated.',
      '2.2 The remaining 50% is due upon project completion, before final delivery of all files and access.',
      '2.3 Accepted payment methods: Bank transfer (EFT), card via Stripe, and PayFast.',
      '2.4 All pricing is in South African Rands (ZAR) unless otherwise agreed in writing.',
      '2.5 Ownership and access to the completed project transfer only after payment is received in full.',
      '2.6 Late payments overdue by more than 7 days accrue 2% interest per month.',
    ]);

    addSection('3. PROJECT TIMELINE & DELIVERY', [
      '3.1 Timelines are estimates based on the agreed scope. The Service Provider will make reasonable efforts to meet stated deadlines.',
      '3.2 Delays may result from unclear feedback, scope changes, client unavailability, or circumstances beyond the Service Provider\'s control.',
      '3.3 The Service Provider is not liable for delays caused by client-side delays in materials, feedback, or approvals.',
      '3.4 Delivery dates commence from the signed agreement date and receipt of the 50% deposit.',
    ]);

    addSection('4. INTELLECTUAL PROPERTY & OWNERSHIP', [
      '4.1 Upon full payment, all intellectual property rights (designs, code, content, documentation) transfer to the client.',
      '4.2 Before full payment, the Service Provider retains ownership. Clients may not redistribute, resell, or claim ownership of unpaid work.',
      '4.3 The Service Provider may: (a) display completed work in its portfolio (with client permission), (b) reuse general methodologies, (c) retain archival backups.',
      '4.4 Third-party assets (stock images, plugins, frameworks) remain subject to their original licenses.',
    ]);

    addSection('5. CLIENT RESPONSIBILITIES', [
      '5.1 The client agrees to provide accurate information, materials, and content (text, images, branding) required for the project.',
      '5.2 The client is responsible for timely, clear feedback and approvals at project milestones.',
      '5.3 The client must hold the necessary permissions, copyrights, and licenses for any content they provide.',
      '5.4 Changes and additional requests must be communicated in writing.',
    ]);

    addSection('6. REVISIONS & MODIFICATIONS', [
      '6.1 The project fee includes up to 3 rounds of revisions on the agreed deliverables.',
      '6.2 Revisions cover modifications to agreed work; major redesigns or scope changes are not "revisions".',
      '6.3 Additional revisions are billed at R250/hour or as mutually agreed.',
      '6.4 Revision requests must be submitted in writing with specific details.',
    ]);

    addSection('7. SUPPORT & MAINTENANCE', [
      '7.1 The Service Provider provides 30 days of complimentary technical support after delivery.',
      '7.2 Support includes bug fixes, minor updates, and technical assistance.',
      '7.3 Support excludes new features, content updates, and recovery from client-caused data loss.',
      '7.4 After 30 days, ongoing maintenance is available at negotiated rates.',
    ]);

    addSection('8. CONFIDENTIALITY & DATA PROTECTION', [
      '8.1 Both parties agree to keep project details, pricing, and sensitive information confidential.',
      '8.2 Client information will not be disclosed to third parties without written consent.',
      '8.3 Client data is stored securely and processed in line with POPIA requirements.',
    ]);

    addSection('9. LIABILITY & DISCLAIMERS', [
      '9.1 Services are provided "as is" without warranties of merchantability or fitness for a specific purpose.',
      '9.2 The Service Provider is not liable for client data loss, misuse of deliverables, third-party claims, or indirect damages.',
      '9.3 Total liability is limited to the amount paid by the client for the project.',
    ]);

    addSection('10. CANCELLATION & REFUNDS', [
      '10.1 Cancellation before work commences: full refund of deposit.',
      '10.2 Cancellation during development: deposit is forfeited; completed work is billed pro-rata.',
      '10.3 Cancellation after 75% completion: the full project fee is payable.',
      '10.4 No refunds are issued for dissatisfaction where work meets the agreed specifications.',
    ]);

    addSection('11. DISPUTE RESOLUTION', [
      '11.1 Disputes are first addressed through good-faith negotiation, then mediation before any legal proceedings.',
      '11.2 This agreement is governed by the laws of South Africa, under the jurisdiction of South African courts.',
    ]);

    // ============================================================
    // ACCEPTANCE & SIGNATURES
    // ============================================================
    if (yPos > pageHeight - 45) {
      doc.addPage();
      yPos = headerTop;
    }
    yPos += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...GOLD);
    doc.text('ACCEPTANCE & SIGNATURES', margin, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(40, 48, 66);
    doc.text(
      doc.splitTextToSize(
        'By signing below, both parties acknowledge they have read, understood, and agree to be bound by these terms and conditions.',
        contentWidth
      ),
      margin,
      yPos
    );
    yPos += 16;

    doc.setDrawColor(...INK);
    doc.setLineWidth(0.3);
    const sigW = 60;
    doc.line(margin, yPos, margin + sigW, yPos);
    doc.line(rightX - sigW, yPos, rightX, yPos);
    doc.setFontSize(7);
    doc.setTextColor(...MUTED);
    doc.text('Client Signature & Date', margin, yPos + 4);
    doc.text('For MuleSoo Digital Services', rightX - sigW, yPos + 4);

    // ============================================================
    // PROFESSIONAL FOOTER + PAGE NUMBERS (all pages)
    // ============================================================
    const totalPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setDrawColor(225, 232, 245);
      doc.setLineWidth(0.3);
      doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...MUTED);
      doc.text('MuleSoo Digital Services  |  Professional Web, App & AI Solutions  |  Pretoria, South Africa', margin, pageHeight - 6.5);
      doc.text(`Page ${p} of ${totalPages}`, rightX, pageHeight - 6.5, { align: 'right' });
    }

    const date = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
    const filename = `MuleSoo_Booking_Agreement_${(bookingData.fullName || 'Client').replace(/\s+/g, '_')}_${date}.pdf`;

    // Robust, cross-device download (jsPDF's doc.save() silently fails on many
    // mobile / in-app browsers). Returns true only if a save was actually triggered.
    const blob = doc.output('blob');
    const ok = downloadBlob(blob, filename);
    if (!ok) {
      // last-resort fallback to jsPDF's own saver
      doc.save(filename);
    }
    console.log('✅ Corporate booking PDF generated:', filename);
  } catch (error) {
    console.error('❌ PDF generation failed:', error);
    throw error;
  }
};

/**
 * Download a Blob reliably across browsers.
 * - Desktop & Android: anchor with `download` attribute.
 * - Legacy Edge/IE: msSaveOrOpenBlob.
 * - iOS Safari (ignores `download`): open the PDF in a new tab so the user can
 *   save/share it via the system share sheet.
 * Returns true if a download/open was triggered.
 */
function downloadBlob(blob: Blob, filename: string): boolean {
  try {
    const nav = window.navigator as Navigator & {
      msSaveOrOpenBlob?: (b: Blob, name: string) => boolean;
    };
    if (typeof nav.msSaveOrOpenBlob === 'function') {
      nav.msSaveOrOpenBlob(blob, filename);
      return true;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const supportsDownload = 'download' in a;
    const ua = navigator.userAgent || '';
    const isIOS =
      /iP(hone|ad|od)/.test(ua) ||
      (navigator.platform === 'MacIntel' && (navigator as Navigator & { maxTouchPoints?: number }).maxTouchPoints! > 1);

    if (!supportsDownload || isIOS) {
      // iOS ignores the download attribute — open the file so it can be saved.
      const win = window.open(url, '_blank');
      if (!win) {
        // popup blocked — navigate the current tab to the PDF as a last resort
        window.location.href = url;
      }
      setTimeout(() => URL.revokeObjectURL(url), 15000);
      return true;
    }

    a.href = url;
    a.download = filename;
    a.rel = 'noopener';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 4000);
    return true;
  } catch (err) {
    console.error('downloadBlob failed:', err);
    return false;
  }
}

function generateVerificationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
    if ((i + 1) % 4 === 0 && i !== 11) code += '-';
  }
  return code;
}
