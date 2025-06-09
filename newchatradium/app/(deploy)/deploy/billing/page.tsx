'use client';

import { useState, useEffect } from 'react';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { PaymentForm } from '@/components/billing/payment-form';
import { BillingSummary } from '@/components/billing/billing-summary';

// Mock user data - in real app, this would come from authentication context
const mockUser = {
  email: 'user@example.com',
  name: 'John Doe',
  id: 'user_123',
};

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Check for Stripe session ID in URL (after successful payment)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const session_id = urlParams.get('session_id');
    if (session_id) {
      setSessionId(session_id);
      // Remove session_id from URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-muted/20 font-sans">
      <header className="flex sticky top-0 z-[100] bg-gradient-to-r from-background/80 via-muted/40 to-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-gradient-to-r supports-[backdrop-filter]:from-background/60 supports-[backdrop-filter]:via-muted/20 supports-[backdrop-filter]:to-background/60 py-1.5 items-center px-2 md:px-2 gap-2 border-b border-border/60">
        <SidebarToggle />
        <h1 className="text-lg font-semibold tracking-tight">Billing</h1>
        <Link href="/deploy/dashboard" className="hidden md:block order-4 md:ml-auto">
          <Button variant="outline" className="flex items-center gap-2 text-sm py-1.5 h-8 px-4 rounded-lg border-border/40 hover:border-border transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </header>

      <div className="flex-1 overflow-auto p-4 md:p-6 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_50%_50%,_theme(colors.purple.500),transparent_50%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight mb-2">Billing</h1>
            <p className="text-muted-foreground">
              Manage your billing, subscriptions, and payment methods{' '}
              <Link href="#" className="text-orange-500 hover:text-orange-600 underline">
                Learn more
              </Link>
            </p>
          </div>

          {/* Success message for returning from Stripe */}
          {sessionId && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              Payment successful! Your subscription has been activated.
            </div>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="spending">Spending Limits</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <BillingSummary 
                userEmail={mockUser.email}
                customerId={undefined}
              />
            </TabsContent>

            <TabsContent value="payment" className="space-y-6">
              <PaymentForm 
                userEmail={mockUser.email}
                userName={mockUser.name}
                userId={mockUser.id}
              />
            </TabsContent>

            <TabsContent value="spending" className="space-y-6">
              <div className="mb-6">
                <p className="text-muted-foreground mb-4">
                  Spending limits restrict how much you can spend on the Radium platform per calendar month. The spending limit is determined by your total historical Radium spend. You can purchase prepaid credits to immediately increase your historical spend.
                </p>
                <p className="text-muted-foreground mb-4">
                  <Link href="#" className="text-orange-500 hover:text-orange-600 underline">Visit our FAQ</Link> for answers to common billing questions.
                </p>
                <p className="text-sm text-muted-foreground italic">
                  Note: Credits are counted against your spending limit, so it is possible to hit the spending limit before all of your current credits are depleted.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}