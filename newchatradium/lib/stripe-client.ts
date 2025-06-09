'use client';

import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

// Get Stripe.js instance
export const getStripe = () => {
  if (!stripePromise) {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set');
    }
    
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

// API client for billing operations
export class BillingApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/billing') {
    this.baseUrl = baseUrl;
  }

  async createCheckoutSession(data: {
    priceId: string;
    userEmail: string;
    userName?: string;
    userId?: string;
  }) {
    const response = await fetch(`${this.baseUrl}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create checkout session');
    }

    return response.json();
  }

  async createPaymentIntent(data: {
    amount: number;
    userEmail: string;
    userName?: string;
    userId?: string;
    description?: string;
  }) {
    const response = await fetch(`${this.baseUrl}/payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create payment intent');
    }

    return response.json();
  }

  async getCustomerInfo(params: { customerId?: string; email?: string }) {
    const searchParams = new URLSearchParams();
    if (params.customerId) searchParams.set('customerId', params.customerId);
    if (params.email) searchParams.set('email', params.email);

    const response = await fetch(`${this.baseUrl}/customer?${searchParams}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get customer info');
    }

    return response.json();
  }
}

// Singleton instance
export const billingApi = new BillingApiClient();

// Utility functions
export async function redirectToCheckout(sessionId: string) {
  const stripe = await getStripe();
  if (!stripe) {
    throw new Error('Failed to load Stripe');
  }

  const { error } = await stripe.redirectToCheckout({
    sessionId,
  });

  if (error) {
    throw new Error(error.message || 'Failed to redirect to checkout');
  }
}

export function formatPrice(
  amount: number,
  currency: string = 'usd',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
}

export function getCardBrandIcon(brand: string): string {
  const icons: Record<string, string> = {
    visa: '💳',
    mastercard: '💳',
    amex: '💳',
    discover: '💳',
    jcb: '💳',
    diners: '💳',
    unionpay: '💳',
    unknown: '💳',
  };
  
  return icons[brand.toLowerCase()] || icons.unknown;
}