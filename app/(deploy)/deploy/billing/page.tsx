'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Check, 
  ExternalLink, 
  ArrowLeft, 
  CreditCard, 
  DollarSign,
  Calendar,
  FileText,
  Settings,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const invoices = [
  {
    id: '1',
    date: 'July 1, 2025',
    amount: '$0.00',
    status: 'Upcoming',
    description: 'Monthly billing cycle',
  },
  {
    id: '2',
    date: 'June 1, 2025',
    amount: '$0.00',
    status: 'Success',
    description: 'Monthly billing cycle',
  },
  {
    id: '3',
    date: 'May 15, 2025',
    amount: '$0.00',
    status: 'Success',
    description: 'Monthly billing cycle',
  },
  {
    id: '4',
    date: 'May 1, 2025',
    amount: '$0.00',
    status: 'Success',
    description: 'Monthly billing cycle',
  },
];

const spendingTiers = [
  {
    name: 'Tier 1',
    limit: '$50 / month',
    qualification: 'Default with valid payment method added',
    isCurrent: true,
  },
  {
    name: 'Tier 2',
    limit: '$500 / month',
    qualification: 'Total historical spend of $50+',
    isCurrent: false,
  },
  {
    name: 'Tier 3',
    limit: '$5,000 / month',
    qualification: 'Total historical spend of $500+',
    isCurrent: false,
  },
  {
    name: 'Tier 4',
    limit: '$50,000 / month',
    qualification: 'Total historical spend of $5,000+',
    isCurrent: false,
  },
  {
    name: 'Custom',
    limit: 'Contact us at inquiries@radium.ai',
    qualification: 'Enterprise customers',
    isCurrent: false,
  },
];

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  const handleAddPayment = () => {
    // Handle add payment logic here
    setIsAddPaymentOpen(false);
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setCardholderName('');
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-muted/20 font-sans">
      <header className="flex sticky top-0 bg-background/95 backdrop-blur-sm py-1.5 items-center px-2 md:px-2 gap-2 border-b border-border/40">
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
              Manage the billing and spending limits for your account{' '}
              <Link href="#" className="text-orange-500 hover:text-orange-600 underline">
                Learn more
              </Link>
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'overview' ? 'default' : 'outline'}
                className={`rounded-full px-6 ${activeTab === 'overview' ? 'bg-black text-white' : 'text-muted-foreground'}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </Button>
              <Button
                variant={activeTab === 'spending' ? 'default' : 'outline'}
                className={`rounded-full px-6 ${activeTab === 'spending' ? 'bg-black text-white' : 'text-muted-foreground'}`}
                onClick={() => setActiveTab('spending')}
              >
                Spending Limits
              </Button>
            </div>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Monthly Billing Section */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Monthly Billing (Jun 1 - Jun 30)</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Total Spend Card */}
                  <Card className="border border-border/60 shadow-sm bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium text-sm text-muted-foreground mb-1">Total Spend</h3>
                          <div className="text-3xl font-bold">$0.00</div>
                          <div className="text-sm text-muted-foreground">$50.00 Spending Limit</div>
                          <Link href="#" className="text-purple-500 hover:text-purple-600 text-sm underline">Adjust Limit</Link>
                        </div>
                        <div className="relative w-20 h-20">
                          <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                          <div className="absolute inset-0 rounded-full border-8 border-transparent border-l-purple-500 transform rotate-0"></div>
                          <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">0%</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Prepaid Credits Card */}
                  <Card className="border border-border/60 shadow-sm bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">Prepaid Credits</h3>
                      <div className="text-3xl font-bold text-muted-foreground mb-2">$0</div>
                      <Link href="#" className="text-purple-500 hover:text-purple-600 text-sm underline">Buy Credits</Link>
                    </CardContent>
                  </Card>
                </div>

                {/* Amount Due */}
                <Card className="border border-border/60 shadow-sm bg-card/50 backdrop-blur-sm mb-6">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Amount Due on Jul 1</span>
                      <span className="text-xl font-bold">$0.00</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Payments Section */}
                <Card className="border border-border/60 shadow-sm bg-card/50 backdrop-blur-sm mb-6">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-6 w-6 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium">Payments</h3>
                          <p className="text-sm text-muted-foreground">No payment methods available</p>
                        </div>
                      </div>
                      <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
                        <DialogTrigger asChild>
                          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                            Add Payment Method
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Add Payment Method</DialogTitle>
                            <DialogDescription>
                              Add a credit or debit card to your account.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-4 space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="cardNumber">Card Number*</Label>
                              <Input
                                id="cardNumber"
                                placeholder="1234 5678 9012 3456"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="expiry">Expiry Date*</Label>
                                <Input
                                  id="expiry"
                                  placeholder="MM/YY"
                                  value={expiryDate}
                                  onChange={(e) => setExpiryDate(e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="cvv">CVV*</Label>
                                <Input
                                  id="cvv"
                                  placeholder="123"
                                  value={cvv}
                                  onChange={(e) => setCvv(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="name">Cardholder Name*</Label>
                              <Input
                                id="name"
                                placeholder="John Doe"
                                value={cardholderName}
                                onChange={(e) => setCardholderName(e.target.value)}
                              />
                            </div>
                            <div className="flex justify-end pt-4">
                              <Button 
                                onClick={handleAddPayment}
                                disabled={!cardNumber || !expiryDate || !cvv || !cardholderName}
                                className="bg-orange-500 hover:bg-orange-600 text-white"
                              >
                                Add Payment Method
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>

                {/* Invoices Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Invoices</h3>
                  <Card className="border border-border/60 shadow-sm bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-0">
                      <div className="space-y-0">
                        {invoices.map((invoice, index) => (
                          <div key={invoice.id} className={`flex items-center justify-between p-4 ${index !== invoices.length - 1 ? 'border-b border-border/40' : ''}`}>
                            <div className="flex items-center gap-3">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{invoice.date}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge 
                                variant={invoice.status === 'Success' ? 'default' : 'secondary'}
                                className={invoice.status === 'Success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'}
                              >
                                {invoice.status}
                              </Badge>
                              <span className="font-bold">{invoice.amount}</span>
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'spending' && (
            <div className="space-y-6">
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

              <Card className="border border-border/60 shadow-sm bg-card/50 backdrop-blur-sm">
                <CardContent className="p-0">
                  <div className="p-4 border-b border-border/40">
                    <div className="grid grid-cols-3 gap-4 text-sm font-medium text-muted-foreground">
                      <div>Name</div>
                      <div>Spending Limits</div>
                      <div>Qualifications</div>
                    </div>
                  </div>
                  <div className="space-y-0">
                    {spendingTiers.map((tier, index) => (
                      <div key={tier.name} className={`p-4 ${index !== spendingTiers.length - 1 ? 'border-b border-border/40' : ''}`}>
                        <div className="grid grid-cols-3 gap-4 items-center">
                          <div className="font-medium">{tier.name}</div>
                          <div>
                            {tier.name === 'Custom' ? (
                              <Link href="mailto:inquiries@radium.ai" className="text-purple-500 hover:text-purple-600 underline">
                                {tier.limit}
                              </Link>
                            ) : (
                              <span className="font-medium">{tier.limit}</span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{tier.qualification}</span>
                            {tier.isCurrent ? (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                Current Tier
                              </Badge>
                            ) : (
                              tier.name !== 'Custom' && (
                                <Button variant="outline" size="sm">
                                  Buy Credits
                                </Button>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  If you do not have a payment method on file, your account will be suspended after credits are depleted. To avoid any service interruption, please make sure to monitor spending, add a valid payment method and submit payment promptly.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}