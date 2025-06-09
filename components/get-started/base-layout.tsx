'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ExternalLink, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface GetStartedStep {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}

interface GetStartedLayoutProps {
  title: string;
  description: string;
  hero: {
    badge?: string;
    title: string;
    subtitle: string;
    backgroundGradient?: string;
  };
  steps: GetStartedStep[];
  primaryAction: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  secondaryActions?: {
    text: string;
    href: string;
    external?: boolean;
  }[];
  benefits?: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }[];
  className?: string;
}

export function GetStartedLayout({
  title,
  description,
  hero,
  steps,
  primaryAction,
  secondaryActions = [],
  benefits = [],
  className = '',
}: GetStartedLayoutProps) {
  return (
    <div className={`flex flex-col h-full bg-gradient-to-br from-background via-background to-muted/20 font-sans ${className}`}>
      {/* Hero Section */}
      <div className={`relative overflow-hidden ${hero.backgroundGradient || 'bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-emerald-600/10'}`}>
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(white,transparent_70%)]" />
        <div className="relative px-4 py-16 md:py-24 text-center">
          {hero.badge && (
            <Badge variant="secondary" className="mb-4 bg-background/80 backdrop-blur-sm">
              {hero.badge}
            </Badge>
          )}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-6">
            {hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {hero.subtitle}
          </p>
        </div>
      </div>

      <div className="flex-1 px-4 py-8 md:px-6 md:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Steps Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How it works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get started in just a few simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <Card key={index} className="relative group hover:shadow-md transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                        {step.icon}
                      </div>
                      {step.badge && (
                        <Badge variant="outline" className="text-xs">
                          {step.badge}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Step {index + 1}
                      </span>
                      <div className="h-px bg-border flex-1" />
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          {benefits.length > 0 && (
            <div className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Why choose this approach</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Built for scale, security, and performance
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="text-center">
                    <div className="inline-flex p-4 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 mb-4">
                      {benefit.icon}
                    </div>
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Section */}
          <div className="text-center">
            <Card className="inline-block p-8 bg-gradient-to-r from-background to-muted/20 border-dashed">
              <CardContent className="p-0">
                <h3 className="text-xl font-semibold mb-4">Ready to get started?</h3>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {primaryAction.onClick ? (
                    <Button
                      size="lg"
                      onClick={primaryAction.onClick}
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    >
                      {primaryAction.text}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Link href={primaryAction.href}>
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                      >
                        {primaryAction.text}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                  
                  {secondaryActions.map((action, index) => (
                    <Link key={index} href={action.href} target={action.external ? '_blank' : '_self'}>
                      <Button variant="outline" size="lg" className="gap-2">
                        {action.external ? <ExternalLink className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                        {action.text}
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}