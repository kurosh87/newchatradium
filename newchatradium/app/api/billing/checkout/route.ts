import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession, createCustomer, PRICING_TIERS } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { priceId, userEmail, userName, userId } = body;

    if (!priceId || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: priceId and userEmail' },
        { status: 400 }
      );
    }

    // Validate priceId against our known tiers
    const validPriceIds = Object.values(PRICING_TIERS).map(tier => tier.priceId);
    if (!validPriceIds.includes(priceId)) {
      return NextResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      );
    }

    // Create or get customer
    const customer = await createCustomer(
      userEmail,
      userName,
      {
        userId: userId || 'unknown',
        source: 'ai-platform',
        environment: 'sandbox'
      }
    );

    // Create checkout session
    const session = await createCheckoutSession(customer.id, priceId);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      customerId: customer.id,
    });

  } catch (error) {
    console.error('Checkout session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}