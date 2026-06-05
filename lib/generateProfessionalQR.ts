import QRCode from 'qrcode';

export interface QROptions {
  url: string;
  size?: number;
  errorCorrection?: 'L' | 'M' | 'Q' | 'H';
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

/**
 * Generate a professional QR code with company branding
 * Returns data URL that can be used in images or downloaded
 */
export const generateProfessionalQR = async (options: QROptions): Promise<string> => {
  const {
    url,
    size = 300,
    errorCorrection = 'H',
    margin = 2,
    color = {
      dark: '#00C8FF', // Brand blue
      light: '#FFFFFF', // White (transparent-friendly)
    },
  } = options;

  try {
    const qrDataUrl = await QRCode.toDataURL(url, {
      errorCorrectionLevel: errorCorrection,
      type: 'image/png',
      quality: 0.95,
      margin: margin,
      width: size,
      color: {
        dark: color.dark,
        light: color.light,
      },
    });

    return qrDataUrl;
  } catch (error) {
    console.error('QR Code generation failed:', error);
    throw error;
  }
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
      color: {
        dark: '#00C8FF',
        light: '#FFFFFF',
      },
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

/**
 * Generate QR code with SVG format for vector quality
 */
export const generateProfessionalQRSVG = async (options: QROptions): Promise<string> => {
  const {
    url,
    size = 300,
    errorCorrection = 'H',
    margin = 2,
    color = {
      dark: '#00C8FF',
      light: '#FFFFFF',
    },
  } = options;

  try {
    const svgString = await QRCode.toString(url, {
      errorCorrectionLevel: errorCorrection,
      type: 'image/svg+xml',
      quality: 0.95,
      margin: margin,
      width: size,
      color: {
        dark: color.dark,
        light: color.light,
      },
    });

    return svgString;
  } catch (error) {
    console.error('QR Code SVG generation failed:', error);
    throw error;
  }
};
