import { NextRequest, NextResponse } from 'next/server';
import { 
  getCustomerSubscriptions, 
  getCustomerInvoices, 
  getCustomerPaymentMethods,
  stripe 
} from '@/lib/stripe';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const email = searchParams.get('email');

    if (!customerId && !email) {
      return NextResponse.json(
        { error: 'Either customerId or email is required' },
        { status: 400 }
      );
    }

    let customer;

    // Get customer by ID or email
    if (customerId) {
      customer = await stripe.customers.retrieve(customerId);
    } else if (email) {
      const customers = await stripe.customers.list({
        email,
        limit: 1,
      });
      customer = customers.data[0];
    }

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    const customerObj = customer as any;

    // Get customer's subscriptions, invoices, and payment methods
    const [subscriptions, invoices, paymentMethods] = await Promise.all([
      getCustomerSubscriptions(customerObj.id),
      getCustomerInvoices(customerObj.id, 10),
      getCustomerPaymentMethods(customerObj.id),
    ]);

    // Format the response
    const response = {
      customer: {
        id: customerObj.id,
        email: customerObj.email,
        name: customerObj.name,
        created: customerObj.created,
        metadata: customerObj.metadata,
      },
      subscriptions: subscriptions.data.map(sub => ({
        id: sub.id,
        status: sub.status,
        currentPeriodStart: (sub as any).current_period_start,
        currentPeriodEnd: (sub as any).current_period_end,
        cancelAtPeriodEnd: (sub as any).cancel_at_period_end,
        items: (sub as any).items.data.map((item: any) => ({
          id: item.id,
          priceId: item.price.id,
          productId: item.price.product,
          quantity: item.quantity,
        })),
      })),
      invoices: invoices.data.map(invoice => ({
        id: invoice.id,
        status: invoice.status,
        amountPaid: (invoice as any).amount_paid,
        amountDue: (invoice as any).amount_due,
        total: invoice.total,
        currency: invoice.currency,
        created: invoice.created,
        pdfUrl: (invoice as any).hosted_invoice_url,
      })),
      paymentMethods: paymentMethods.data.map(pm => ({
        id: pm.id,
        type: pm.type,
        card: (pm as any).card ? {
          brand: (pm as any).card.brand,
          last4: (pm as any).card.last4,
          expMonth: (pm as any).card.exp_month,
          expYear: (pm as any).card.exp_year,
        } : null,
      })),
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Customer retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve customer information' },
      { status: 500 }
    );
  }
}