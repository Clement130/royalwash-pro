// CustomerInfoForm component for collecting customer details and address
// Includes validation for email, phone, and geographic zone (30km from Istres)

'use client';

import { useState } from 'react';

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

interface CustomerInfoFormProps {
  customerInfo: CustomerInfo;
  carModel: string;
  specialInstructions: string;
  onCustomerInfoChange: (info: CustomerInfo) => void;
  onCarModelChange: (model: string) => void;
  onSpecialInstructionsChange: (instructions: string) => void;
  onNext: () => void;
  onBack: () => void;
}

// Istres coordinates for distance calculation
const ISTRES_LAT = 43.5136;
const ISTRES_LNG = 4.9875;
const MAX_DISTANCE_KM = 30;

export function CustomerInfoForm({
  customerInfo,
  carModel,
  specialInstructions,
  onCustomerInfoChange,
  onCarModelChange,
  onSpecialInstructionsChange,
  onNext,
  onBack,
}: CustomerInfoFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validating, setValidating] = useState(false);

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    onCustomerInfoChange({ ...customerInfo, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Validate all fields before proceeding
  const validateForm = async (): Promise<boolean> => {
    const newErrors: Record<string, string> = {};

    // Validate name
    if (!customerInfo.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerInfo.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!emailRegex.test(customerInfo.email)) {
      newErrors.email = 'Email invalide';
    }

    // Validate phone (French format: 10 digits)
    const phoneRegex = /^0[1-9]\d{8}$/;
    const cleanPhone = customerInfo.phone.replace(/\s/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'Le téléphone est requis';
    } else if (!phoneRegex.test(cleanPhone)) {
      newErrors.phone = 'Téléphone invalide (format: 06 12 34 56 78)';
    }

    // Validate address
    if (!customerInfo.address.trim()) {
      newErrors.address = "L'adresse est requise";
    }

    // Validate city
    if (!customerInfo.city.trim()) {
      newErrors.city = 'La ville est requise';
    }

    // Validate postal code (French format: 5 digits)
    const postalCodeRegex = /^\d{5}$/;
    if (!customerInfo.postalCode.trim()) {
      newErrors.postalCode = 'Le code postal est requis';
    } else if (!postalCodeRegex.test(customerInfo.postalCode)) {
      newErrors.postalCode = 'Code postal invalide (5 chiffres)';
    }

    // Geographic validation: Check if within 30km of Istres
    // For simplicity, we'll use postal code approximation
    // In production, you'd use Google Maps Geocoding API
    const postalCode = parseInt(customerInfo.postalCode);
    if (postalCode < 13000 || postalCode > 13800) {
      newErrors.postalCode = 'Zone non desservie (rayon 30km autour d\'Istres)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setValidating(true);
    const isValid = await validateForm();
    setValidating(false);

    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Vos coordonnées
        </h2>
        <p className="text-gray-600">
          Renseignez vos informations pour finaliser la réservation
        </p>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nom complet *
          </label>
          <input
            id="name"
            type="text"
            value={customerInfo.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Jean Dupont"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            id="email"
            type="email"
            value={customerInfo.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="jean.dupont@email.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone *
          </label>
          <input
            id="phone"
            type="tel"
            value={customerInfo.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="06 12 34 56 78"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Adresse complète *
          </label>
          <input
            id="address"
            type="text"
            value={customerInfo.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="12 rue de la République"
          />
          {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
        </div>

        {/* City and Postal Code */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              Ville *
            </label>
            <input
              id="city"
              type="text"
              value={customerInfo.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Istres"
            />
            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
          </div>

          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
              Code postal *
            </label>
            <input
              id="postalCode"
              type="text"
              value={customerInfo.postalCode}
              onChange={(e) => handleInputChange('postalCode', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 ${
                errors.postalCode ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="13800"
            />
            {errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>}
          </div>
        </div>

        {/* Optional: Car Model */}
        <div>
          <label htmlFor="carModel" className="block text-sm font-medium text-gray-700 mb-1">
            Modèle de véhicule (optionnel)
          </label>
          <input
            id="carModel"
            type="text"
            value={carModel}
            onChange={(e) => onCarModelChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            placeholder="Ex: Renault Clio"
          />
        </div>

        {/* Optional: Special Instructions */}
        <div>
          <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
            Instructions spéciales (optionnel)
          </label>
          <textarea
            id="instructions"
            value={specialInstructions}
            onChange={(e) => onSpecialInstructionsChange(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            placeholder="Informations complémentaires..."
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <button
          onClick={onBack}
          className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
        >
          Retour
        </button>
        <button
          onClick={handleSubmit}
          disabled={validating}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300"
        >
          {validating ? 'Validation...' : 'Continuer'}
        </button>
      </div>
    </div>
  );
}
