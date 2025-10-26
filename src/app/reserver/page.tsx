// Main booking page that displays the BookingWizard component
// This is the entry point for the booking funnel

'use client';

import { BookingWizard } from '@/components/booking/BookingWizard';

export default function ReserverPage() {
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
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <BookingWizard />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 pb-8 text-center text-sm text-gray-600">
        <p>Des questions ? Contactez-nous au 06 12 34 56 78</p>
        <p className="mt-2">
          <a href="/cgv" className="text-blue-600 hover:underline">CGV</a>
          {' · '}
          <a href="/politique-confidentialite" className="text-blue-600 hover:underline">Confidentialité</a>
          {' · '}
          <a href="/mentions-legales" className="text-blue-600 hover:underline">Mentions légales</a>
        </p>
      </footer>
    </div>
  );
}
