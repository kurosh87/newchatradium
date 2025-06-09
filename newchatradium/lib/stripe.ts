import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

// Initialize Stripe with sandbox configuration
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil',
  typescript: true,
});

// Stripe configuration constants
export const STRIPE_CONFIG = {
  currency: 'usd',
  successUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/deploy/billing?session_id={CHECKOUT_SESSION_ID}`,
  cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/deploy/billing`,
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
};

// Pricing tiers for the platform
export const PRICING_TIERS = {
  starter: {
    priceId: 'price_starter', // Will be created in Stripe dashboard
    name: 'Starter',
    price: 0,
    features: [
      '$5 in free credits',
      'Community support',
      'Basic analytics',
      'Standard GPUs (limited)'
    ]
  },
  professional: {
    priceId: 'price_professional',
    name: 'Professional', 
    price: 29,
    features: [
      'Everything in Starter',
      'Priority support',
      'Advanced analytics',
      'All GPU types',
      'Custom deployments'
    ]
  },
  enterprise: {
    priceId: 'price_enterprise',
    name: 'Enterprise',
    price: 99,
    features: [
      'Everything in Professional',
      'Dedicated support',
      'Custom pricing',
      'SLA guarantees',
      'Private cloud options'
    ]
  }
} as const;

// Helper functions for Stripe operations
export async function createCustomer(
  email: string,
  name?: string,
  metadata?: Record<string, string>
): Promise<Stripe.Customer> {
  return await stripe.customers.create({
    email,
    name,
    metadata,
  });
}

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  quantity: number = 1
): Promise<Stripe.Checkout.Session> {
  return await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity,
      },
    ],
    mode: 'subscription',
    success_url: STRIPE_CONFIG.successUrl,
    cancel_url: STRIPE_CONFIG.cancelUrl,
    metadata: {
      environment: 'sandbox',
    },
  });
}

export async function createPaymentIntent(
  amount: number,
  customerId: string,
  description?: string
): Promise<Stripe.PaymentIntent> {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: STRIPE_CONFIG.currency,
    customer: customerId,
    description,
    metadata: {
      environment: 'sandbox',
    },
  });
}

export async function getCustomerSubscriptions(
  customerId: string
): Promise<Stripe.ApiList<Stripe.Subscription>> {
  return await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
  });
}

export async function getCustomerInvoices(
  customerId: string,
  limit: number = 10
): Promise<Stripe.ApiList<Stripe.Invoice>> {
  return await stripe.invoices.list({
    customer: customerId,
    limit,
  });
}

export async function getCustomerPaymentMethods(
  customerId: string
): Promise<Stripe.ApiList<Stripe.PaymentMethod>> {
  return await stripe.paymentMethods.list({
    customer: customerId,
    type: 'card',
  });
}

// Webhook handling
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  if (!STRIPE_CONFIG.webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
  }
  
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    STRIPE_CONFIG.webhookSecret
  );
}

// Usage-based billing helpers (to be implemented when needed)
// Note: Usage records are not included in this version for simplicity