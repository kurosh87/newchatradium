'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Lightbulb, 
  Key, 
  Rocket, 
  Database, 
  Shield,
  Zap,
  BookOpen,
  TestTube
} from 'lucide-react';
import Link from 'next/link';
import { useOnboardingProgress } from './progress-provider';

interface NextStepSuggestion {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  badge?: string;
  priority: 'high' | 'medium' | 'low';
}

export function NextStepsCard() {
  const { progress } = useOnboardingProgress();

  // Generate contextual suggestions based on current progress
  const getNextSteps = (): NextStepSuggestion[] => {
    const suggestions: NextStepSuggestion[] = [];

    // Primary onboarding steps
    if (!progress.hasApiKeys) {
      suggestions.push({
        icon: <Key className="h-4 w-4 text-blue-500" />,
        title: 'Create API Key',
        description: 'Set up authentication to access your deployments programmatically',
        href: '/deploy/api-keys',
        badge: 'Required',
        priority: 'high'
      });
    }

    if (!progress.hasDeployments) {
      suggestions.push({
        icon: <Rocket className="h-4 w-4 text-purple-500" />,
        title: 'Deploy Your First Model',
        description: 'Launch an AI model and start making inference requests',
        href: '/deploy/new',
        badge: progress.hasApiKeys ? 'Ready' : 'After API key',
        priority: 'high'
      });
    }

    // Secondary/optional steps
    if (progress.hasApiKeys && progress.hasDeployments) {
      if (!progress.hasDatasets) {
        suggestions.push({
          icon: <Database className="h-4 w-4 text-green-500" />,
          title: 'Upload Training Dataset',
          description: 'Add your own data to fine-tune models for better performance',
          href: '/deploy/datasets',
          badge: 'Optional',
          priority: 'medium'
        });
      }

      // Secrets section removed for now
      if (false) {
        suggestions.push({
          icon: <Shield className="h-4 w-4 text-orange-500" />,
          title: 'Configure Environment Secrets',
          description: 'Securely store API keys and configuration for your deployments',
          href: '/deploy/secrets',
          badge: 'Optional',
          priority: 'medium'
        });
      }

      // Advanced features
      suggestions.push({
        icon: <TestTube className="h-4 w-4 text-indigo-500" />,
        title: 'Try the Model Playground',
        description: 'Interactively test and experiment with your deployed models',
        href: '/deploy/playground',
        priority: 'low'
      });

      suggestions.push({
        icon: <BookOpen className="h-4 w-4 text-teal-500" />,
        title: 'Explore API Documentation',
        description: 'Learn about endpoints, SDKs, and integration examples',
        href: '/api/docs',
        priority: 'low'
      });
    }

    return suggestions.slice(0, 3); // Show max 3 suggestions
  };

  const nextSteps = getNextSteps();

  if (nextSteps.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            You're All Set!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-2xl mb-2">🎉</div>
            <p className="text-muted-foreground mb-4">
              Great job! You've completed the essential setup steps. 
              Your AI platform is ready to use.
            </p>
            <div className="flex justify-center gap-3">
              <Link href="/deploy/playground">
                <Button variant="outline" size="sm" className="gap-2">
                  <TestTube className="h-4 w-4" />
                  Try Playground
                </Button>
              </Link>
              <Link href="/api/docs">
                <Button variant="outline" size="sm" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  View Docs
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Next Steps
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {nextSteps.map((step, index) => (
            <Link key={index} href={step.href}>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border/40 hover:border-border hover:bg-muted/30 transition-all duration-200 cursor-pointer group">
                <div className="flex-shrink-0 p-2 rounded-lg bg-muted/50 group-hover:bg-muted transition-colors">
                  {step.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    {step.badge && (
                      <Badge 
                        variant={step.priority === 'high' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {step.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {step.description}
                  </p>
                </div>
                
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}