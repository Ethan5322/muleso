import QRCode from 'qrcode';
import jsPDF from 'jspdf';

/**
 * Generate a professional framed QR code with "SCAN ME" text
 * Returns a canvas element that can be downloaded
 */
export const generateFramedQRCode = async (
  url: string = 'https://mulesoo.vercel.app',
  size: number = 800
): Promise<string> => {
  try {
    // Generate QR code data
    const qrDataUrl = await new Promise<string>((resolve, reject) => {
      QRCode.toDataURL(url, { width: size - 100, margin: 10 }, (error, dataUrl) => {
        if (error) reject(error);
        else resolve(dataUrl);
      });
    });

    // Create canvas for framing
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Set canvas size
    canvas.width = size;
    canvas.height = size + 200; // Extra space for "SCAN ME" text

    // Background (white)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Outer frame (cyan border)
    ctx.strokeStyle = '#00C8FF';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, size - 40, size - 40);

    // Inner frame (gold border)
    ctx.strokeStyle = '#E8B84B';
    ctx.lineWidth = 3;
    ctx.strokeRect(35, 35, size - 70, size - 70);

    // Company name at top
    ctx.fillStyle = '#00C8FF';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('MULESOO', size / 2, 60);

    // Tagline
    ctx.fillStyle = '#666666';
    ctx.font = '14px Arial';
    ctx.fillText('Digital Services | Professional Solutions', size / 2, 80);

    // Add QR code image
    const qrImage = new Image();
    qrImage.src = qrDataUrl;

    await new Promise<void>((resolve) => {
      qrImage.onload = () => {
        const qrSize = size - 100;
        ctx.drawImage(qrImage, 50, 90, qrSize, qrSize);
        resolve();
      };
    });

    // "SCAN ME" text at bottom
    ctx.fillStyle = '#E8B84B';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('SCAN ME', size / 2, size + 150);

    // Website URL at very bottom
    ctx.fillStyle = '#00C8FF';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('www.mulesoo.com', size / 2, size + 185);

    // Return canvas as data URL
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Failed to generate framed QR code:', error);
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
