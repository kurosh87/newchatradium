'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Circle, 
  Key, 
  Rocket, 
  Database, 
  Shield,
  ArrowRight,
  Zap
} from 'lucide-react';
import { useOnboardingProgress } from './progress-provider';
import Link from 'next/link';

interface ChecklistItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  completed: boolean;
  href: string;
  badge?: string;
}

function ChecklistItem({ icon, title, description, completed, href, badge }: ChecklistItemProps) {
  return (
    <Link href={href}>
      <div className="flex items-center gap-4 p-4 rounded-lg border border-border/40 hover:border-border hover:bg-muted/30 transition-all duration-200 cursor-pointer group">
        <div className="flex-shrink-0">
          {completed ? (
            <CheckCircle className="h-6 w-6 text-green-500" />
          ) : (
            <Circle className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
          )}
        </div>
        
        <div className="flex-shrink-0 p-2 rounded-lg bg-muted/50 group-hover:bg-muted transition-colors">
          {icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            {badge && (
              <Badge variant="secondary" className="text-xs">
                {badge}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {description}
          </p>
        </div>
        
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
      </div>
    </Link>
  );
}

export function SetupChecklist() {
  const { progress, loading } = useOnboardingProgress();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Setup Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const checklistItems: ChecklistItemProps[] = [
    {
      icon: <Key className="h-4 w-4 text-blue-500" />,
      title: 'Create API Key',
      description: 'Generate secure authentication for API access',
      completed: progress.hasApiKeys,
      href: '/deploy/api-keys',
      badge: 'Required'
    },
    {
      icon: <Rocket className="h-4 w-4 text-purple-500" />,
      title: 'Deploy Model',
      description: 'Launch your first AI model for inference',
      completed: progress.hasDeployments,
      href: '/deploy',
      badge: 'Required'
    },
    {
      icon: <Database className="h-4 w-4 text-green-500" />,
      title: 'Upload Dataset',
      description: 'Add training data for custom model fine-tuning',
      completed: progress.hasDatasets,
      href: '/deploy/datasets',
      badge: 'Optional'
    },
    {
      icon: <Shield className="h-4 w-4 text-orange-500" />,
      title: 'Configure Secrets',
      description: 'Set up environment variables and sensitive data',
      completed: false, // Secrets removed for now
      href: '/deploy/secrets',
      badge: 'Optional'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Setup Progress
          </CardTitle>
          <Badge 
            variant={progress.isComplete ? 'default' : 'secondary'}
            className={progress.isComplete ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
          >
            {progress.completedSteps}/{progress.totalSteps} Complete
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">{progress.completionPercentage}%</span>
          </div>
          <Progress value={progress.completionPercentage} className="h-2" />
          
          {progress.nextStep && !progress.isComplete && (
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Next step:</strong> {progress.nextStep}
              </p>
            </div>
          )}
          
          {progress.isComplete && (
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>🎉 Setup complete!</strong> You're ready to start building with AI models.
              </p>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {checklistItems.map((item, index) => (
            <ChecklistItem key={index} {...item} />
          ))}
        </div>
        
        {progress.isComplete && (
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-center gap-4">
              <Link href="/deploy/playground">
                <Button variant="outline" className="gap-2">
                  <Zap className="h-4 w-4" />
                  Try Playground
                </Button>
              </Link>
              <Link href="/api/docs">
                <Button variant="outline" className="gap-2">
                  <ArrowRight className="h-4 w-4" />
                  View API Docs
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}