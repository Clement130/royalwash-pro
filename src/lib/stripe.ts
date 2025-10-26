// Stripe configuration and helper functions
// This file initializes Stripe with API keys and provides utilities

import Stripe from 'stripe';

// Initialize Stripe with secret key from environment variables
// The version parameter ensures compatibility with Stripe API
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

// Formula prices mapping
// These must match the formulas defined in your system
export const FORMULA_PRICES = {
  standard: 5000, // 50.00 EUR in cents
  premium: 7000,  // 70.00 EUR in cents
  royal: 9000,    // 90.00 EUR in cents
} as const;

// Helper to get price in cents for a formula
export function getFormulaPrice(formula: keyof typeof FORMULA_PRICES): number {
  return FORMULA_PRICES[formula];
}

// Helper to format price for display (50.00 €)
export function formatPrice(cents: number): string {
  return `${(cents / 100).toFixed(2)} €`;
}
