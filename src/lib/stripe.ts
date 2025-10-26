// Stripe configuration and helper functions
// This file initializes Stripe with API keys and provides utilities

import Stripe from 'stripe';

// Lazy initialization of Stripe - only throws error when actually used
// This allows the app to run without Stripe keys during development
function getStripeInstance(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      'STRIPE_SECRET_KEY is not defined in environment variables. ' +
      'Please create a .env.local file with your Stripe keys. ' +
      'See .env.example for reference.'
    );
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-11-20.acacia',
    typescript: true,
  });
}

// Export a getter that initializes Stripe on first use
export const stripe = new Proxy({} as Stripe, {
  get(target, prop) {
    const instance = getStripeInstance();
    return (instance as any)[prop];
  }
});

// Formula prices mapping
// These must match the formulas defined in your system
export const FORMULA_PRICES = {
  essentielle: 2500, // 25.00 EUR in cents
  premium: 4500,     // 45.00 EUR in cents
  vip: 7500,         // 75.00 EUR in cents
} as const;

// Helper to get price in cents for a formula
export function getFormulaPrice(formula: keyof typeof FORMULA_PRICES): number {
  return FORMULA_PRICES[formula];
}

// Helper to format price for display (50.00 €)
export function formatPrice(cents: number): string {
  return `${(cents / 100).toFixed(2)} €`;
}
