import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent } from '@/lib/stripe';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;
    
    try {
      event = constructWebhookEvent(body, signature);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout session completed:', session.id);
        
        // Here you would typically:
        // 1. Update user's subscription status in your database
        // 2. Grant access to premium features
        // 3. Send confirmation email
        
        await handleCheckoutCompleted(session);
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);
        
        // Handle one-time payment success
        await handlePaymentSucceeded(paymentIntent);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Invoice payment succeeded:', invoice.id);
        
        // Handle recurring payment success
        await handleInvoicePaymentSucceeded(invoice);
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice;
        console.log('Invoice payment failed:', failedInvoice.id);
        
        // Handle payment failure
        await handleInvoicePaymentFailed(failedInvoice);
        break;

      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription cancelled:', subscription.id);
        
        // Handle subscription cancellation
        await handleSubscriptionCancelled(subscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  // TODO: Implement database updates for subscription activation
  console.log('Processing checkout completion for customer:', session.customer);
  
  // Example implementation:
  // 1. Update user's billing status
  // 2. Activate premium features
  // 3. Send welcome email
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  // TODO: Implement credit addition to user account
  console.log('Processing payment success for customer:', paymentIntent.customer);
  
  // Example implementation:
  // 1. Add credits to user account
  // 2. Update billing history
  // 3. Send receipt email
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  // TODO: Implement recurring payment processing
  console.log('Processing recurring payment for customer:', invoice.customer);
  
  // Example implementation:
  // 1. Extend subscription period
  // 2. Reset usage limits
  // 3. Send invoice receipt
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  // TODO: Implement payment failure handling
  console.log('Processing payment failure for customer:', invoice.customer);
  
  // Example implementation:
  // 1. Send payment failure notification
  // 2. Implement grace period logic
  // 3. Potentially suspend service after multiple failures
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  // TODO: Implement subscription cancellation
  console.log('Processing subscription cancellation:', subscription.id);
  
  // Example implementation:
  // 1. Update user's subscription status
  // 2. Set end-of-period access
  // 3. Send cancellation confirmation
}