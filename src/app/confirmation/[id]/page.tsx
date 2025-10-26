// Confirmation page after successful payment
// Displays booking details, QR code, and calendar download

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { generateBookingQRCode } from '@/lib/qrcode-helper';
import { generateCalendarEvent } from '@/lib/calendar';

interface Booking {
  id: string;
  formula: string;
  date: string;
  time: string;
  customerName: string;
  customerEmail: string;
  address: string;
  city: string;
  price: number;
  status: string;
}

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [qrCode, setQrCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (sessionId) {
      fetchBookingDetails(sessionId);
    } else {
      setError('Session invalide');
      setLoading(false);
    }
  }, [sessionId]);

  const fetchBookingDetails = async (sessionId: string) => {
    try {
      // In a real implementation, you would fetch from an API
      // For now, we'll load from bookings.json
      const response = await fetch('/bookings.json');
      if (!response.ok) throw new Error('Failed to load bookings');
      
      const bookings = await response.json();
      const foundBooking = bookings.find((b: Booking) => b.stripeSessionId === sessionId);
      
      if (!foundBooking) {
        throw new Error('Réservation non trouvée');
      }

      setBooking(foundBooking);

      // Generate QR code
      const qrCodeUrl = await generateBookingQRCode(foundBooking.id, {
        formula: foundBooking.formula,
        date: foundBooking.date,
        time: foundBooking.time,
        customerName: foundBooking.customerName,
        customerEmail: foundBooking.customerEmail,
      });
      setQrCode(qrCodeUrl);

    } catch (err) {
      console.error('Error fetching booking:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCalendar = () => {
    if (!booking) return;

    const icsContent = generateCalendarEvent({
      formula: booking.formula,
      date: booking.date,
      time: booking.time,
      customerName: booking.customerName,
      address: `${booking.address}, ${booking.city}`,
    });

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lavage-${booking.date}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de votre confirmation...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <svg className="w-16 h-16 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Erreur</h2>
            <p className="text-gray-700">{error || 'Réservation introuvable'}</p>
            <a
              href="/"
              className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retour à l'accueil
            </a>
          </div>
        </div>
      </div>
    );
  }

  const FORMULA_NAMES: Record<string, string> = {
    standard: 'Standard',
    premium: 'Premium',
    royal: 'Royal',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <a href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à l'accueil
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Réservation confirmée !
          </h1>
          <p className="text-gray-600">
            Votre paiement a été reçu et votre lavage est programmé
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Booking Details */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Détails de votre réservation</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Formule</p>
                <p className="text-lg font-semibold text-gray-900">{FORMULA_NAMES[booking.formula]}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Date et heure</p>
                <p className="text-lg font-medium text-gray-900">
                  {format(new Date(booking.date), 'EEEE d MMMM yyyy', { locale: fr })}
                </p>
                <p className="text-gray-700">{booking.time}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Adresse</p>
                <p className="text-gray-700">{booking.address}</p>
                <p className="text-gray-700">{booking.city}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Client</p>
                <p className="text-gray-700">{booking.customerName}</p>
                <p className="text-gray-700">{booking.customerEmail}</p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600">Total payé</p>
                <p className="text-2xl font-bold text-green-600">{booking.price} €</p>
              </div>
            </div>

            {/* Download Calendar Button */}
            <button
              onClick={handleDownloadCalendar}
              className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Ajouter au calendrier
            </button>
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">QR Code de confirmation</h2>
            
            {qrCode ? (
              <div className="text-center">
                <img src={qrCode} alt="QR Code" className="mx-auto mb-4" />
                <p className="text-sm text-gray-600">
                  Présentez ce QR code au laveur le jour du rendez-vous
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Génération du QR code...</p>
              </div>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-12 bg-blue-50 rounded-xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Prochaines étapes</h2>
          <div className="space-y-3 text-gray-700">
            <p>✅ Un email de confirmation vous a été envoyé à {booking.customerEmail}</p>
            <p>📅 Ajoutez ce rendez-vous à votre calendrier pour ne pas l'oublier</p>
            <p>🚗 Assurez-vous que votre véhicule soit accessible le jour du lavage</p>
            <p>💧 Nous apportons tout le matériel nécessaire, y compris l'eau</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 pb-8 text-center text-sm text-gray-600">
        <p>Besoin d'aide ? Contactez-nous au 06 12 34 56 78</p>
        <p className="mt-2">
          Référence de réservation : <span className="font-mono text-gray-900">{booking.id}</span>
        </p>
      </footer>
    </div>
  );
}
