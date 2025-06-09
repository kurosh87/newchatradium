'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  Key, 
  Rocket, 
  Database, 
  Shield,
  BookOpen,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { useOnboardingProgress } from './progress-provider';

interface WelcomeTourProps {
  onClose: () => void;
}

export function WelcomeTour({ onClose }: WelcomeTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { progress } = useOnboardingProgress();

  const tourSteps = [
    {
      title: "Welcome to Radium AI! 🚀",
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            You're about to experience the fastest way to deploy and manage AI models at scale. 
            Let's get you set up in just a few minutes.
          </p>
          <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-900">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span className="font-medium text-blue-800 dark:text-blue-200">What you'll learn:</span>
            </div>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• How to create API keys for authentication</li>
              <li>• Deploy your first AI model in minutes</li>
              <li>• Upload datasets for custom fine-tuning</li>
              <li>• Manage secrets and environment variables</li>
            </ul>
          </div>
        </div>
      ),
      action: {
        text: "Let's get started",
        variant: "default" as const
      }
    },
    {
      title: "Step 1: Create API Key",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Key className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-medium">Authentication Setup</h3>
              <p className="text-sm text-muted-foreground">Required for all API access</p>
            </div>
            <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
              Required
            </Badge>
          </div>
          <p className="text-muted-foreground">
            API keys provide secure authentication for accessing your deployments. 
            You'll use this key in all API requests and SDK integrations.
          </p>
          <div className="p-3 rounded-lg bg-muted/30 border">
            <code className="text-sm">Authorization: Bearer sk-your-api-key</code>
          </div>
        </div>
      ),
      action: {
        text: progress.hasApiKeys ? "✓ Already completed" : "Create API Key",
        variant: progress.hasApiKeys ? "outline" as const : "default" as const,
        href: "/deploy/api-keys"
      }
    },
    {
      title: "Step 2: Deploy Your First Model",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Rocket className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h3 className="font-medium">Model Deployment</h3>
              <p className="text-sm text-muted-foreground">Launch AI models for inference</p>
            </div>
            <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
              Required
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Choose from 1000+ pre-trained models including GPT, Claude, Llama, and more. 
            Configure GPU resources, scaling rules, and deploy with one click.
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2 rounded bg-muted/30">
              <div className="font-medium">🤖 1000+ Models</div>
              <div className="text-muted-foreground">GPT, Claude, Llama</div>
            </div>
            <div className="p-2 rounded bg-muted/30">
              <div className="font-medium">⚡ Auto-scaling</div>
              <div className="text-muted-foreground">0 to millions of requests</div>
            </div>
          </div>
        </div>
      ),
      action: {
        text: progress.hasDeployments ? "✓ Already completed" : "Deploy Model",
        variant: progress.hasDeployments ? "outline" as const : "default" as const,
        href: "/deploy"
      }
    },
    {
      title: "Step 3: Upload Dataset (Optional)",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <Database className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h3 className="font-medium">Custom Training Data</h3>
              <p className="text-sm text-muted-foreground">For fine-tuning models</p>
            </div>
            <Badge variant="secondary">
              Optional
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Upload your own datasets to fine-tune models for your specific use case. 
            Supports JSONL, CSV, and TSV formats with automatic validation.
          </p>
          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
            <div className="text-sm text-green-800 dark:text-green-200">
              <strong>💡 Pro tip:</strong> Fine-tuned models typically show 20-40% improvement 
              in task-specific performance compared to base models.
            </div>
          </div>
        </div>
      ),
      action: {
        text: progress.hasDatasets ? "✓ Already completed" : "Upload Dataset",
        variant: progress.hasDatasets ? "outline" as const : "default" as const,
        href: "/deploy/datasets"
      }
    },
    {
      title: "Step 4: Configure Secrets (Optional)",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <Shield className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-medium">Environment Variables</h3>
              <p className="text-sm text-muted-foreground">Secure configuration management</p>
            </div>
            <Badge variant="secondary">
              Optional
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Securely store API keys, database URLs, and other sensitive configuration. 
            Secrets are encrypted and can be injected into your deployments.
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-muted-foreground" />
              <span>AES-256 encryption at rest</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-muted-foreground" />
              <span>Environment-specific injection</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-muted-foreground" />
              <span>Audit logging and access controls</span>
            </div>
          </div>
        </div>
      ),
      action: {
        text: false ? "✓ Already completed" : "Configure Secrets", // Secrets removed
        variant: false ? "outline" as const : "default" as const,
        href: "/deploy/secrets"
      }
    },
    {
      title: "You're All Set! 🎉",
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Congratulations! You now have everything you need to build powerful AI applications. 
            Here are some next steps to explore:
          </p>
          <div className="grid grid-cols-1 gap-3">
            <Link href="/deploy/playground" className="p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="font-medium">Try the Playground</div>
                  <div className="text-sm text-muted-foreground">Test your models interactively</div>
                </div>
              </div>
            </Link>
            <Link href="/api/docs" className="p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <BookOpen className="h-4 w-4 text-green-500" />
                <div>
                  <div className="font-medium">Explore API Documentation</div>
                  <div className="text-sm text-muted-foreground">Learn about endpoints and SDKs</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      ),
      action: {
        text: "Start Building",
        variant: "default" as const,
        onClick: onClose
      }
    }
  ];

  const currentStepData = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAction = () => {
    if (currentStepData.action.onClick) {
      currentStepData.action.onClick();
    } else if (currentStepData.action.href) {
      window.location.href = currentStepData.action.href;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle>{currentStepData.title}</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 w-8 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {currentStep + 1}/{tourSteps.length}
            </span>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>{currentStepData.content}</div>
          
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstStep}
              className="gap-2"
            >
              Previous
            </Button>
            
            <div className="flex gap-2">
              {currentStepData.action.href ? (
                <Button
                  variant={currentStepData.action.variant}
                  onClick={handleAction}
                  className="gap-2"
                >
                  {currentStepData.action.text}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant={currentStepData.action.variant}
                  onClick={handleNext}
                  className="gap-2"
                >
                  {currentStepData.action.text}
                  {!isLastStep && <ArrowRight className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}