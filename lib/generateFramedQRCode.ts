import QRCode from 'qrcode';
import jsPDF from 'jspdf';

/**
 * Generate a professional framed QR code optimized for scanning
 * Returns a canvas element that can be downloaded
 */
export const generateFramedQRCode = async (
  url: string = 'https://mulesoo.com',
  size: number = 800
): Promise<string> => {
  try {
    // Generate QR code with high error correction and proper settings
    const qrDataUrl = await new Promise<string>((resolve, reject) => {
      QRCode.toDataURL(url, {
        width: 500,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'H', // High error correction for better scanning
      }, (error, dataUrl) => {
        if (error) reject(error);
        else resolve(dataUrl);
      });
    });

    // Create canvas for framing
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    const padding = 60;
    const frameWidth = size + padding * 2;
    const frameHeight = size + padding * 2 + 150; // Extra space for text

    // Set canvas size
    canvas.width = frameWidth;
    canvas.height = frameHeight;

    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw decorative frame (outer cyan border - doesn't interfere with QR)
    ctx.strokeStyle = '#7FB3FF';
    ctx.lineWidth = 6;
    ctx.strokeRect(15, 15, frameWidth - 30, size - 30);

    // Draw inner gold accent line
    ctx.strokeStyle = '#D97645';
    ctx.lineWidth = 2;
    ctx.strokeRect(25, 25, frameWidth - 50, size - 50);

    // Company branding at top (above QR code)
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('MULESOO', frameWidth / 2, 45);

    // Load and draw the QR code image in the center
    const qrImage = new Image();
    qrImage.src = qrDataUrl;

    await new Promise<void>((resolve) => {
      qrImage.onload = () => {
        // Center the QR code horizontally, place it in upper-middle area
        const qrDisplaySize = size - padding;
        const qrX = (frameWidth - qrDisplaySize) / 2;
        const qrY = padding;

        // Draw white background behind QR to ensure contrast
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(qrX - 5, qrY - 5, qrDisplaySize + 10, qrDisplaySize + 10);

        // Draw the QR code
        ctx.drawImage(qrImage, qrX, qrY, qrDisplaySize, qrDisplaySize);
        resolve();
      };
    });

    // "SCAN ME" text - prominently displayed below QR
    ctx.fillStyle = '#7FB3FF';
    ctx.font = 'bold 56px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('↓ SCAN ME ↓', frameWidth / 2, size + padding + 80);

    // Website URL at very bottom
    ctx.fillStyle = '#D97645';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('www.mulesoo.com', frameWidth / 2, frameHeight - 15);

    // Return canvas as data URL with high quality
    return canvas.toDataURL('image/png', 1.0);
  } catch (error) {
    console.error('Failed to generate framed QR code:', error);
    throw error;
  }
};

/**
 * Generate ultra-clean, highly scannable QR code (minimal frame version)
 */
export const generateCleanQRCode = async (
  url: string = 'https://mulesoo.com',
  size: number = 600
): Promise<string> => {
  try {
    const qrDataUrl = await new Promise<string>((resolve, reject) => {
      QRCode.toDataURL(url, {
        width: 450,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'H',
      }, (error, dataUrl) => {
        if (error) reject(error);
        else resolve(dataUrl);
      });
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    canvas.width = size;
    canvas.height = size + 80;

    // Pure white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Minimal frame (just two thin lines at corners for elegance)
    ctx.strokeStyle = '#7FB3FF';
    ctx.lineWidth = 3;
    ctx.strokeRect(8, 8, size - 16, size - 16);

    const qrImage = new Image();
    qrImage.src = qrDataUrl;

    await new Promise<void>((resolve) => {
      qrImage.onload = () => {
        const qrDisplaySize = size - 32;
        const qrX = (size - qrDisplaySize) / 2;
        const qrY = 16;

        ctx.drawImage(qrImage, qrX, qrY, qrDisplaySize, qrDisplaySize);
        resolve();
      };
    });

    // Scan me text
    ctx.fillStyle = '#7FB3FF';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Scan to visit', size / 2, size + 50);

    return canvas.toDataURL('image/png', 1.0);
  } catch (error) {
    console.error('Failed to generate clean QR code:', error);
    throw error;
  }
};

/**
 * Download the framed QR code as a PNG image
 */
export const downloadFramedQRCode = async (filename: string = 'MuleSoo_QRCode.png') => {
  try {
    const dataUrl = await generateFramedQRCode('https://mulesoo.com', 800);

    // Create download link
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log('✅ QR code downloaded:', filename);
  } catch (error) {
    console.error('Failed to download QR code:', error);
    throw error;
  }
};

/**
 * Download clean scannable version
 */
export const downloadCleanQRCode = async (filename: string = 'MuleSoo_QRCode_Clean.png') => {
  try {
    const dataUrl = await generateCleanQRCode('https://mulesoo.com', 600);

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log('✅ Clean QR code downloaded:', filename);
  } catch (error) {
    console.error('Failed to download clean QR code:', error);
    throw error;
  }
};

/**
 * Generate QR code PDF for printing
 */
export const generateQRCodePDF = async () => {
  try {
    const dataUrl = await generateFramedQRCode('https://mulesoo.com', 800);

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Center the QR code
    const qrWidth = 150; // mm
    const xPos = (pageWidth - qrWidth) / 2;
    const yPos = (pageHeight - qrWidth) / 2;

    // Add QR code
    const img = new Image();
    img.src = dataUrl;

    await new Promise<void>((resolve) => {
      img.onload = () => {
        doc.addImage(dataUrl, 'PNG', xPos, yPos, qrWidth, qrWidth);
        resolve();
      };
    });

    // Add header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 200, 255);
    doc.text('MULESOO DIGITAL SERVICES', pageWidth / 2, 20, { align: 'center' });

    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Scan for more information • www.mulesoo.com', pageWidth / 2, pageHeight - 10, {
      align: 'center',
    });

    doc.save('MuleSoo_QRCode_Print.pdf');
    console.log('✅ QR code PDF generated');
  } catch (error) {
    console.error('Failed to generate QR code PDF:', error);
    throw error;
  }
};
