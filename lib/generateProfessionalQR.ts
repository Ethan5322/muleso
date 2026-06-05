import QRCode from 'qrcode';

export interface QROptions {
  url: string;
  size?: number;
}

/**
 * Generate a professional QR code with company branding
 * Returns data URL that can be used in images or downloaded
 */
export const generateProfessionalQR = (options: QROptions): Promise<string> => {
  const { url, size = 300 } = options;

  return new Promise((resolve, reject) => {
    try {
      QRCode.toDataURL(
        url,
        {
          errorCorrectionLevel: 'H',
          margin: 2,
          width: size,
          color: {
            dark: '#00C8FF',
            light: '#FFFFFF',
          },
        },
        (error, dataUrl) => {
          if (error) {
            console.error('QR Code generation failed:', error);
            reject(error);
          } else {
            resolve(dataUrl);
          }
        }
      );
    } catch (error) {
      console.error('QR Code generation failed:', error);
      reject(error);
    }
  });
};

/**
 * Download QR code as PNG file
 */
export const downloadQRCode = async (
  url: string,
  filename: string = 'mulesoo-qr-code.png'
) => {
  try {
    const qrDataUrl = await generateProfessionalQR({
      url,
      size: 1200, // High resolution for printing
    });

    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Failed to download QR code:', error);
  }
};
