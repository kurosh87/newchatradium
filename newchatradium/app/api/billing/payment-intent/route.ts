import { NextRequest, NextResponse } from 'next/server';
import { createPaymentIntent, createCustomer } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, userEmail, userName, userId, description } = body;

    if (!amount || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: amount and userEmail' },
        { status: 400 }
      );
    }

    if (amount < 0.50) {
      return NextResponse.json(
        { error: 'Minimum amount is $0.50' },
        { status: 400 }
      );
    }

    // Create or get customer
    const customer = await createCustomer(
      userEmail,
      userName,
      {
        userId: userId || 'unknown',
        source: 'ai-platform-credits',
        environment: 'sandbox'
      }
    );

    // Create payment intent
    const paymentIntent = await createPaymentIntent(
      amount,
      customer.id,
      description || 'AI Platform Credits'
    );

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      customerId: customer.id,
    });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}