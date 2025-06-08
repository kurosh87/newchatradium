'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { ArrowLeft, ArrowRight, Brain, Database, Target, Settings, CheckCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function FineTuningGetStartedPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col h-full bg-background">
        <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2 border-b">
          <SidebarToggle />
          <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-muted/20 font-sans">
      <header className="flex sticky top-0 bg-background/95 backdrop-blur-sm py-1.5 items-center px-2 md:px-2 gap-2 border-b border-border/40">
        <SidebarToggle />
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight">Fine-Tuning</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-lg font-semibold tracking-tight">Getting Started</span>
        </div>
        <Link href="/deploy/fine-tuning" className="hidden md:block order-4 md:ml-auto">
          <Button variant="outline" className="flex items-center gap-2 text-sm py-1.5 h-8 px-4 rounded-lg border-border/40 hover:border-border transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Fine-Tuning
          </Button>
        </Link>
      </header>

      <div className="flex-1 overflow-auto p-4 md:p-6 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_25%_25%,_theme(colors.purple.500),transparent_50%)] pointer-events-none" />
        <div className="max-w-6xl mx-auto space-y-8 relative">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Getting Started with Fine-Tuning</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Fine-tune models to improve performance on your specific use case using Low-Rank Adaptation (LoRA).
            </p>
          </div>

          {/* How it works */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">How Fine-Tuning Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border border-border/60 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 w-fit">
                    <Brain className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-lg">1. Select Model</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">
                    Choose a base model that best suits your use case and requirements.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-border/60 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 w-fit">
                    <Database className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-lg">2. Upload Dataset</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">
                    Provide training data in JSONL format to customize the model's behavior.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-border/60 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 rounded-lg bg-green-100 dark:bg-green-900/30 w-fit">
                    <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-lg">3. Configure</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">
                    Set evaluation options and adjust training parameters as needed.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-border/60 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30 w-fit">
                    <CheckCircle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <CardTitle className="text-lg">4. Train & Deploy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">
                    Monitor training progress and deploy your fine-tuned model when ready.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Key Benefits */}
          <Card className="border border-border/60 shadow-sm bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Key Benefits of Fine-Tuning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold">📈 Improved Performance</h4>
                  <p className="text-sm text-muted-foreground">
                    Achieve better results on your specific tasks compared to general-purpose models.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">⚡ Efficient Training</h4>
                  <p className="text-sm text-muted-foreground">
                    LoRA adapters require less computational resources and training time.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">🎯 Task Specialization</h4>
                  <p className="text-sm text-muted-foreground">
                    Customize models for specific domains, formats, or writing styles.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">💰 Cost Effective</h4>
                  <p className="text-sm text-muted-foreground">
                    More affordable than training models from scratch or using larger models.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Requirements */}
          <Card className="border border-border/60 shadow-sm bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Dataset Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Format Requirements</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• File must be in JSONL format</li>
                    <li>• Each line should be a valid JSON object</li>
                    <li>• Must include user and assistant messages</li>
                    <li>• Follow the specified conversation format</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Quality Guidelines</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Recommended size: 100-100,000 examples</li>
                    <li>• Data should be clean and high-quality</li>
                    <li>• Examples should be diverse and representative</li>
                    <li>• Remove any sensitive or personal information</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center space-y-6 py-8">
            <h2 className="text-2xl font-semibold">Ready to Get Started?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Create your first fine-tuning job and see how customized models can improve your AI applications.
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                size="lg"
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                onClick={() => router.push('/deploy/fine-tuning/create')}
              >
                Create Fine-Tuning Job
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                <ExternalLink className="h-4 w-4 mr-2" />
                Read Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}