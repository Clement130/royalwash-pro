'use client';

import React, { useState } from 'react';
import { FormulaSelector } from './FormulaSelector';
import { DateTimePicker } from './DateTimePicker';
import { CustomerInfoForm } from './CustomerInfoForm';
import { BookingSummary } from './BookingSummary';

export interface BookingData {
  formula: 'essentielle' | 'premium' | 'vip' | '';
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

const initialBookingData: BookingData = {
  formula: '',
  date: '',
  time: '',
  customerInfo: {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  },
  carModel: '',
  specialInstructions: '',
};

export function BookingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>(initialBookingData);
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 4;

  // Fonction pour passer à l'étape suivante
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      // Scroll vers le haut de la page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Fonction pour revenir à l'étape précédente
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Mise à jour des données de réservation
  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...data }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Barre de progression */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold
                    ${
                      step === currentStep
                        ? 'bg-blue-600 text-white scale-110'
                        : step < currentStep
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }
                    transition-all duration-300
                  `}
                >
                  {step < currentStep ? '✓' : step}
                </div>
                {step < 4 && (
                  <div
                    className={`
                      h-1 w-16 sm:w-24 md:w-32
                      ${step < currentStep ? 'bg-green-500' : 'bg-gray-200'}
                      transition-all duration-300
                    `}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span className={currentStep === 1 ? 'font-semibold text-blue-600' : ''}>Formule</span>
            <span className={currentStep === 2 ? 'font-semibold text-blue-600' : ''}>Date & Heure</span>
            <span className={currentStep === 3 ? 'font-semibold text-blue-600' : ''}>Coordonnées</span>
            <span className={currentStep === 4 ? 'font-semibold text-blue-600' : ''}>Paiement</span>
          </div>
        </div>
        {/* Contenu des étapes */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-12">
          {currentStep === 1 && (
            <FormulaSelector
              selectedFormula={bookingData.formula}
              onSelectFormula={(formula) => {
                updateBookingData({ formula });
                goToNextStep();
              }}
            />
          )}

          {currentStep === 2 && (
            <DateTimePicker
              selectedDate={bookingData.date || null}
              selectedTime={bookingData.time || null}
              onDateChange={(date) => updateBookingData({ date })}
              onTimeChange={(time) => updateBookingData({ time })}
              onNext={() => goToNextStep()}
              onBack={goToPreviousStep}
            />
          )}

          {currentStep === 3 && (
            <CustomerInfoForm
              customerInfo={bookingData.customerInfo}
              carModel={bookingData.carModel || ''}
              specialInstructions={bookingData.specialInstructions || ''}
              onCustomerInfoChange={(info) => updateBookingData({ customerInfo: info })}
              onCarModelChange={(model) => updateBookingData({ carModel: model })}
              onSpecialInstructionsChange={(instructions) => updateBookingData({ specialInstructions: instructions })}
              onNext={() => goToNextStep()}
              onBack={goToPreviousStep}
            />
          )}
          {currentStep === 4 && (
            <BookingSummary
              bookingData={bookingData}
              onBack={goToPreviousStep}
              isLoading={isLoading}
              onConfirmPayment={async () => {
                setIsLoading(true);
                try {
                  const response = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookingData),
                  });

                  if (!response.ok) throw new Error('Erreur création session paiement');

                  const { url } = await response.json();
                  window.location.href = url;
                } catch (error) {
                  console.error('Erreur:', error);
                  alert('Erreur lors de la préparation du paiement.');
                  setIsLoading(false);
                }
              }}
            />
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <div className="flex items-center justify-center space-x-4">
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Paiement sécurisé par Stripe
            </span>
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Données protégées RGPD
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
