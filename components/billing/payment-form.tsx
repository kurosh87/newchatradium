'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  DollarSign, 
  Check, 
  Star,
  Zap,
  Shield,
  HeadphonesIcon,
  TrendingUp
} from 'lucide-react';
import { billingApi, redirectToCheckout, formatPrice } from '@/lib/stripe-client';
import { PRICING_TIERS } from '@/lib/stripe';
import { useToast } from '@/hooks/use-toast';

interface PaymentFormProps {
  userEmail?: string;
  userName?: string;
  userId?: string;
}

export function PaymentForm({ userEmail, userName, userId }: PaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('credits');
  const [creditAmount, setCreditAmount] = useState(25);
  const { toast } = useToast();

  const handleSubscription = async (tierKey: keyof typeof PRICING_TIERS) => {
    if (!userEmail) {
      toast({
        title: 'Email Required',
        description: 'Please provide an email address to continue.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const tier = PRICING_TIERS[tierKey];
      const { sessionId } = await billingApi.createCheckoutSession({
        priceId: tier.priceId,
        userEmail,
        userName,
        userId,
      });

      await redirectToCheckout(sessionId);
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: 'Payment Error',
        description: error instanceof Error ? error.message : 'Failed to start checkout process',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreditPurchase = async () => {
    if (!userEmail) {
      toast({
        title: 'Email Required',
        description: 'Please provide an email address to continue.',
        variant: 'destructive',
      });
      return;
    }

    if (creditAmount < 5) {
      toast({
        title: 'Minimum Amount',
        description: 'Minimum credit purchase is $5.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { sessionId } = await billingApi.createCheckoutSession({
        priceId: 'price_credits', // This would be a one-time price in Stripe
        userEmail,
        userName,
        userId,
      });

      await redirectToCheckout(sessionId);
    } catch (error) {
      console.error('Credit purchase error:', error);
      toast({
        title: 'Payment Error',
        description: error instanceof Error ? error.message : 'Failed to purchase credits',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="credits">Buy Credits</TabsTrigger>
          <TabsTrigger value="subscription">Subscription Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="credits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Purchase Credits
              </CardTitle>
              <CardDescription>
                Add credits to your account for pay-as-you-go usage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Credit Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="5"
                  max="1000"
                  step="5"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(Number(e.target.value))}
                  placeholder="Enter amount"
                />
                <p className="text-sm text-muted-foreground">
                  Minimum: $5 • Maximum: $1,000 per transaction
                </p>
              </div>

              <div className="flex gap-2">
                {[10, 25, 50, 100].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setCreditAmount(amount)}
                    className={creditAmount === amount ? 'bg-primary text-primary-foreground' : ''}
                  >
                    ${amount}
                  </Button>
                ))}
              </div>

              <Button
                onClick={handleCreditPurchase}
                disabled={loading || creditAmount < 5}
                className="w-full"
                size="lg"
              >
                {loading ? 'Processing...' : `Purchase ${formatPrice(creditAmount)} Credits`}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(PRICING_TIERS).map(([key, tier]) => (
              <Card 
                key={key} 
                className={`relative ${key === 'professional' ? 'border-primary shadow-md' : ''}`}
              >
                {key === 'professional' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    {key === 'starter' && <Zap className="h-5 w-5" />}
                    {key === 'professional' && <TrendingUp className="h-5 w-5" />}
                    {key === 'enterprise' && <Shield className="h-5 w-5" />}
                    {tier.name}
                  </CardTitle>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold">
                      {tier.price === 0 ? 'Free' : formatPrice(tier.price)}
                      {tier.price > 0 && (
                        <span className="text-sm font-normal text-muted-foreground">/month</span>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSubscription(key as keyof typeof PRICING_TIERS)}
                    disabled={loading}
                    variant={key === 'professional' ? 'default' : 'outline'}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? 'Processing...' : 
                     tier.price === 0 ? 'Get Started' : 'Subscribe Now'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Secure payment with Stripe
                </div>
                <div className="flex items-center gap-2">
                  <HeadphonesIcon className="h-4 w-4" />
                  24/7 support included
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Cancel anytime
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}