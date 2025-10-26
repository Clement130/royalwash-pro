// QR Code generation helper for booking confirmations
// This creates QR codes that customers can scan for quick access to their booking details

import QRCode from 'qrcode';

/**
 * Generate a QR code as a data URL (base64 image)
 * @param bookingId - The unique booking identifier
 * @param bookingData - The booking information to encode
 * @returns Base64 data URL of the QR code image
 */
export async function generateBookingQRCode(
  bookingId: string,
  bookingData: {
    formula: string;
    date: string;
    time: string;
    customerName: string;
    customerEmail: string;
  }
): Promise<string> {
  // Create a URL that points to the booking confirmation page
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const confirmationUrl = `${baseUrl}/confirmation/${bookingId}`;

  // Generate QR code as data URL
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(confirmationUrl, {
      errorCorrectionLevel: 'H', // High error correction for better scanning
      type: 'image/png',
      quality: 1,
      margin: 2,
      width: 300,
      color: {
        dark: '#1E40AF', // Brand blue color
        light: '#FFFFFF',
      },
    });

    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Generate QR code with booking information embedded
 * This creates a more detailed QR code with booking data
 */
export async function generateDetailedQRCode(bookingData: {
  id: string;
  formula: string;
  date: string;
  time: string;
  customerName: string;
  customerEmail: string;
  address: string;
}): Promise<string> {
  // Create structured data for the QR code
  const qrData = JSON.stringify({
    type: 'BOOKING',
    id: bookingData.id,
    formula: bookingData.formula,
    date: bookingData.date,
    time: bookingData.time,
    customer: bookingData.customerName,
    email: bookingData.customerEmail,
    address: bookingData.address,
  });

  try {
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 1,
      margin: 2,
      width: 300,
      color: {
        dark: '#1E40AF',
        light: '#FFFFFF',
      },
    });

    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating detailed QR code:', error);
    throw new Error('Failed to generate detailed QR code');
  }
}
