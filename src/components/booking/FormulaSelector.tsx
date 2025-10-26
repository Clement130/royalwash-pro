'use client';

import React from 'react';

interface FormulaSelectorProps {
  selectedFormula: string;
  onSelectFormula: (formula: 'essentielle' | 'premium' | 'vip') => void;
}

const formulas = [
  {
    id: 'essentielle' as const,
    name: 'Essentielle',
    price: 25,
    duration: '60 min',
    badge: '',
    features: [
      'Lavage extérieur complet',
      'Rinçage haute pression',
      'Séchage microfibre',
      'Nettoyage jantes',
      'Brillance carrosserie',
    ],
    color: 'from-gray-400 to-gray-600',
  },
  {
    id: 'premium' as const,
    name: 'Premium',
    price: 45,
    duration: '90 min',
    badge: 'Le plus populaire',
    features: [
      'Tout de la formule Essentielle',
      'Nettoyage intérieur complet',
      'Aspiration sièges et tapis',
      'Nettoyage vitres intérieures',
      'Lustrage tableau de bord',
      'Désodorisant cabine',
    ],
    color: 'from-blue-500 to-blue-700',
  },
  {
    id: 'vip' as const,
    name: 'VIP',
    price: 75,
    duration: '120 min',
    badge: 'Premium',
    features: [
      'Tout de la formule Premium',
      'Traitement céramique express',
      'Protection anti-UV',
      'Polish carrosserie',
      'Nettoyage moteur',
      'Traitement cuirs',
      'Garantie brillance 2 semaines',
    ],
    color: 'from-purple-500 to-purple-700',
  },
];

export function FormulaSelector({ selectedFormula, onSelectFormula }: FormulaSelectorProps) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">
        Choisissez votre formule
      </h2>
      <p className="text-gray-600 text-center mb-8">
        Sélectionnez la formule qui correspond le mieux à vos besoins
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {formulas.map((formula) => (
          <div
            key={formula.id}
            className={`
              relative rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300
              ${
                selectedFormula === formula.id
                  ? 'border-blue-600 shadow-2xl scale-105'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
              }
            `}
            onClick={() => onSelectFormula(formula.id)}
          >
            {/* Badge */}
            {formula.badge && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                  {formula.badge}
                </span>
              </div>
            )}

            {/* Header avec gradient */}
            <div className={`bg-gradient-to-r ${formula.color} rounded-xl p-4 text-white mb-4`}>
              <h3 className="text-2xl font-bold">{formula.name}</h3>
              <div className="flex items-baseline mt-2">
                <span className="text-4xl font-bold">{formula.price}€</span>
                <span className="ml-2 text-sm opacity-80">/ lavage</span>
              </div>
              <p className="text-sm mt-1 opacity-90">Durée : {formula.duration}</p>
            </div>

            {/* Features */}
            <ul className="space-y-3">
              {formula.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Bouton de sélection */}
            <button
              className={`
                w-full mt-6 py-3 rounded-lg font-semibold transition-all duration-300
                ${
                  selectedFormula === formula.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {selectedFormula === formula.id ? 'Sélectionné ✓' : 'Choisir cette formule'}
            </button>
          </div>
        ))}
      </div>

      {/* Informations complémentaires */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg
            className="w-6 h-6 text-blue-600 mr-3 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-sm text-gray-700">
            <p className="font-semibold mb-1">Informations importantes :</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Lavage à domicile dans un rayon de 30km autour d'Istres</li>
              <li>Paiement sécurisé en ligne obligatoire</li>
              <li>Annulation gratuite jusqu'à 24h avant le rendez-vous</li>
              <li>Satisfaction garantie ou lavage refait gratuitement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
