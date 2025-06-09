import { NextRequest, NextResponse } from 'next/server';
import { generateMockBillingAccount, formatRelativeTime } from '@/lib/mock-data';

// GET /api/deploy/billing - Get billing information
export async function GET(request: NextRequest) {
  try {
    const userId = 'mock-user-id';

    // Generate mock billing account
    const billingAccount = generateMockBillingAccount(userId);

    // Mock invoice history
    const invoices = [
      {
        id: 'inv_1',
        date: '2024-01-01',
        amount: '0.00',
        status: 'Upcoming',
        description: 'Monthly billing cycle',
        downloadUrl: '/api/deploy/billing/invoices/inv_1/download',
      },
      {
        id: 'inv_2',
        date: '2023-12-01',
        amount: '15.42',
        status: 'Paid',
        description: 'Monthly billing cycle',
        downloadUrl: '/api/deploy/billing/invoices/inv_2/download',
      },
      {
        id: 'inv_3',
        date: '2023-11-01',
        amount: '8.67',
        status: 'Paid',
        description: 'Monthly billing cycle',
        downloadUrl: '/api/deploy/billing/invoices/inv_3/download',
      },
    ];

    // Mock spending tiers
    const spendingTiers = [
      {
        name: 'Tier 1',
        limit: '$50 / month',
        qualification: 'Default with valid payment method added',
        isCurrent: billingAccount.billingTier === 'tier1',
        requirements: 'Add payment method',
      },
      {
        name: 'Tier 2',
        limit: '$500 / month',
        qualification: 'Total historical spend of $50+',
        isCurrent: billingAccount.billingTier === 'tier2',
        requirements: 'Reach $50 total spend',
      },
      {
        name: 'Tier 3',
        limit: '$5,000 / month',
        qualification: 'Total historical spend of $500+',
        isCurrent: billingAccount.billingTier === 'tier3',
        requirements: 'Reach $500 total spend',
      },
      {
        name: 'Tier 4',
        limit: '$50,000 / month',
        qualification: 'Total historical spend of $5,000+',
        isCurrent: billingAccount.billingTier === 'tier4',
        requirements: 'Reach $5,000 total spend',
      },
      {
        name: 'Custom',
        limit: 'Contact us at inquiries@radium.ai',
        qualification: 'Enterprise customers',
        isCurrent: billingAccount.billingTier === 'custom',
        requirements: 'Contact sales',
      },
    ];

    // Calculate usage percentage
    const currentSpend = parseFloat(billingAccount.currentSpend || '0');
    const spendingLimit = parseFloat(billingAccount.spendingLimit || '0');
    const usagePercentage = (currentSpend / spendingLimit) * 100;

    const response = {
      account: {
        ...billingAccount,
        currentSpendFormatted: `$${currentSpend.toFixed(2)}`,
        spendingLimitFormatted: `$${spendingLimit.toFixed(2)}`,
        usagePercentage: Math.round(usagePercentage),
        hasPaymentMethod: !!billingAccount.paymentMethodId,
        createdFormatted: formatRelativeTime(billingAccount.createdAt),
      },
      invoices: invoices.map(invoice => ({
        ...invoice,
        amountFormatted: `$${invoice.amount}`,
        dateFormatted: new Date(invoice.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      })),
      spendingTiers,
      paymentMethods: billingAccount.paymentMethodId ? [
        {
          id: billingAccount.paymentMethodId,
          type: 'card',
          last4: '4242',
          brand: 'visa',
          expiryMonth: 12,
          expiryYear: 2025,
          isDefault: true,
        },
      ] : [],
      upcomingInvoice: {
        amount: currentSpend,
        amountFormatted: `$${currentSpend.toFixed(2)}`,
        periodStart: new Date().toISOString(),
        periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    };

    return NextResponse.json({ data: response });
  } catch (error) {
    console.error('Error fetching billing information:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/deploy/billing - Update billing settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = 'mock-user-id';
    
    const { action, ...data } = body;

    switch (action) {
      case 'add_payment_method':
        // Simulate adding payment method
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return NextResponse.json({
          data: {
            paymentMethodId: 'pm_mock_' + Math.random().toString(36).substr(2, 9),
            last4: data.cardNumber?.slice(-4) || '4242',
            brand: 'visa',
            expiryMonth: data.expiryMonth,
            expiryYear: data.expiryYear,
          },
          message: 'Payment method added successfully',
        });

      case 'update_spending_limit':
        if (!data.spendingLimit || data.spendingLimit < 0) {
          return NextResponse.json(
            { error: 'Invalid spending limit' },
            { status: 400 }
          );
        }

        return NextResponse.json({
          data: {
            spendingLimit: data.spendingLimit,
            spendingLimitFormatted: `$${data.spendingLimit.toFixed(2)}`,
          },
          message: 'Spending limit updated successfully',
        });

      case 'remove_payment_method':
        return NextResponse.json({
          message: 'Payment method removed successfully',
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error updating billing settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}