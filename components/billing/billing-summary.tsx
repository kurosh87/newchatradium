'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  Download, 
  ExternalLink,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { billingApi, formatPrice, getCardBrandIcon } from '@/lib/stripe-client';
import { useToast } from '@/hooks/use-toast';

interface BillingSummaryProps {
  userEmail?: string;
  customerId?: string;
}

interface CustomerData {
  customer: {
    id: string;
    email: string;
    name: string;
    created: number;
  };
  subscriptions: Array<{
    id: string;
    status: string;
    currentPeriodStart: number;
    currentPeriodEnd: number;
    cancelAtPeriodEnd: boolean;
  }>;
  invoices: Array<{
    id: string;
    status: string;
    amountPaid: number;
    amountDue: number;
    total: number;
    currency: string;
    created: number;
    pdfUrl: string;
  }>;
  paymentMethods: Array<{
    id: string;
    type: string;
    card: {
      brand: string;
      last4: string;
      expMonth: number;
      expYear: number;
    } | null;
  }>;
}

export function BillingSummary({ userEmail, customerId }: BillingSummaryProps) {
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchCustomerData() {
      if (!userEmail && !customerId) {
        setLoading(false);
        return;
      }

      try {
        const data = await billingApi.getCustomerInfo({
          email: userEmail,
          customerId,
        });
        setCustomerData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load billing data');
        console.error('Billing data fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCustomerData();
  }, [userEmail, customerId]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-6 bg-muted rounded w-2/3"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-muted-foreground">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!customerData) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No billing information found</p>
        </CardContent>
      </Card>
    );
  }

  const { customer, subscriptions, invoices, paymentMethods } = customerData;
  const activeSubscription = subscriptions.find(sub => sub.status === 'active');

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'past_due':
      case 'unpaid':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'trialing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Subscription Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeSubscription ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge className={getStatusColor(activeSubscription.status)}>
                    {activeSubscription.status.charAt(0).toUpperCase() + activeSubscription.status.slice(1)}
                  </Badge>
                  {activeSubscription.cancelAtPeriodEnd && (
                    <Badge variant="outline" className="ml-2">
                      <Clock className="h-3 w-3 mr-1" />
                      Cancels at period end
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Current Period</p>
                  <p className="font-medium">
                    {new Date(activeSubscription.currentPeriodStart * 1000).toLocaleDateString()} - {' '}
                    {new Date(activeSubscription.currentPeriodEnd * 1000).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Next Billing</p>
                  <p className="font-medium">
                    {new Date(activeSubscription.currentPeriodEnd * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No active subscription</p>
              <Button size="sm" className="mt-2">
                View Plans
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paymentMethods.length > 0 ? (
            <div className="space-y-3">
              {paymentMethods.map((pm) => (
                <div key={pm.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getCardBrandIcon(pm.card?.brand || 'unknown')}</span>
                    <div>
                      <p className="font-medium">
                        •••• •••• •••• {pm.card?.last4}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Expires {pm.card?.expMonth}/{pm.card?.expYear}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">Default</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No payment methods on file</p>
              <Button size="sm" variant="outline" className="mt-2">
                Add Payment Method
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Invoices
          </CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length > 0 ? (
            <div className="space-y-3">
              {invoices.slice(0, 5).map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {formatPrice(invoice.total / 100, invoice.currency)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(invoice.created * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status === 'paid' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                    {invoice.pdfUrl && (
                      <Button size="sm" variant="ghost" asChild>
                        <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No invoices yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}