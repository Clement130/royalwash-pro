// BookingSummary component - Final review before payment
// Shows all booking details and initiates Stripe Checkout

'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface BookingData {
  formula: string;
  date: string;
  time: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  carModel?: string;
  specialInstructions?: string;
}

interface BookingSummaryProps {
  bookingData: BookingData;
  onBack: () => void;
  isLoading: boolean;
  onConfirmPayment: () => Promise<void>;
}

const FORMULA_PRICES: Record<string, number> = {
  essentielle: 25,
  premium: 45,
  vip: 75,
};

const FORMULA_NAMES: Record<string, string> = {
  essentielle: 'Essentielle',
  premium: 'Premium',
  vip: 'VIP',
};

export function BookingSummary({ bookingData, onBack, isLoading, onConfirmPayment }: BookingSummaryProps) {
  const [acceptedCGV, setAcceptedCGV] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [error, setError] = useState('');

  const price = FORMULA_PRICES[bookingData.formula];
  const formulaName = FORMULA_NAMES[bookingData.formula];

  const handlePayment = async () => {
    if (!acceptedCGV || !acceptedPrivacy) {
      setError('Vous devez accepter les CGV et la politique de confidentialité');
      return;
    }

    setError('');

    try {
      await onConfirmPayment();
    } catch (err) {
      console.error('Payment error:', err);
      setError('Une erreur est survenue');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Récapitulatif de votre réservation
        </h2>
        <p className="text-gray-600">
          Vérifiez vos informations avant de procéder au paiement
        </p>
      </div>

      {/* Booking Summary Card */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6 space-y-4">
        {/* Formula */}
        <div className="flex justify-between items-center pb-4 border-b">
          <div>
            <p className="text-sm text-gray-600">Formule</p>
            <p className="text-lg font-semibold text-gray-900">{formulaName}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">{price} €</p>
          </div>
        </div>

        {/* Date & Time */}
        <div className="pb-4 border-b">
          <p className="text-sm text-gray-600">Date et heure</p>
          <p className="text-lg font-medium text-gray-900">
            {format(new Date(bookingData.date), 'EEEE d MMMM yyyy', { locale: fr })}
          </p>
          <p className="text-gray-700">{bookingData.time}</p>
        </div>

        {/* Customer Info */}
        <div className="pb-4 border-b">
          <p className="text-sm text-gray-600 mb-2">Vos coordonnées</p>
          <div className="space-y-1 text-sm">
            <p className="font-medium text-gray-900">{bookingData.customerInfo.name}</p>
            <p className="text-gray-700">{bookingData.customerInfo.email}</p>
            <p className="text-gray-700">{bookingData.customerInfo.phone}</p>
          </div>
        </div>

        {/* Address */}
        <div className="pb-4 border-b">
          <p className="text-sm text-gray-600 mb-2">Adresse du lavage</p>
          <div className="text-sm text-gray-700">
            <p>{bookingData.customerInfo.address}</p>
            <p>{bookingData.customerInfo.postalCode} {bookingData.customerInfo.city}</p>
          </div>
        </div>

        {/* Optional Info */}
        {(bookingData.carModel || bookingData.specialInstructions) && (
          <div>
            {bookingData.carModel && (
              <div className="mb-2">
                <p className="text-sm text-gray-600">Véhicule</p>
                <p className="text-gray-700">{bookingData.carModel}</p>
              </div>
            )}
            {bookingData.specialInstructions && (
              <div>
                <p className="text-sm text-gray-600">Instructions</p>
                <p className="text-gray-700">{bookingData.specialInstructions}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legal Checkboxes */}
      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptedCGV}
            onChange={(e) => setAcceptedCGV(e.target.checked)}
            className="mt-1 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-600"
          />
          <span className="text-sm text-gray-700">
            J'accepte les{' '}
            <a href="/cgv" target="_blank" className="text-blue-600 hover:underline">
              Conditions Générales de Vente
            </a>
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptedPrivacy}
            onChange={(e) => setAcceptedPrivacy(e.target.checked)}
            className="mt-1 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-600"
          />
          <span className="text-sm text-gray-700">
            J'accepte la{' '}
            <a href="/politique-confidentialite" target="_blank" className="text-blue-600 hover:underline">
              Politique de confidentialité
            </a>
          </span>
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Retour
        </button>
        <button
          onClick={handlePayment}
          disabled={!acceptedCGV || !acceptedPrivacy || isLoading}
          className={`
            px-8 py-3 rounded-lg font-medium transition-all
            ${acceptedCGV && acceptedPrivacy && !isLoading
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              Redirection...
            </span>
          ) : (
            `Payer ${price} €`
          )}
        </button>
      </div>

      {/* Payment Info */}
      <div className="text-center text-sm text-gray-600 pt-4">
        <p>🔒 Paiement 100% sécurisé par Stripe</p>
        <p className="mt-1">Vous allez être redirigé vers notre plateforme de paiement sécurisée</p>
      </div>
    </div>
  );
}
