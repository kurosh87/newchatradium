'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Settings,
  Copy,
  ExternalLink,
  Rocket,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

interface JobDetails {
  id: string;
  name: string;
  baseModel: string;
  outputModel: string;
  type: string;
  state: string;
  code: string;
  dataset: string;
  evaluationDataset: string;
  epochs: number;
  loraRank: number;
  learningRate: number;
  maxContextLength: number;
  earlyStop: boolean;
  turboMode: boolean;
  createdOn: string;
}

const mockJobDetails: JobDetails = {
  id: 'ft-mbntroqr-1snaq',
  name: 'accounts/kampfer87-4883ac/supervisedFineTuningJobs/yzeavrv7',
  baseModel: 'llama-v3p1-8b-instruct',
  outputModel: 'ft-mbntroqr-1snaq',
  type: 'Conversation',
  state: 'Validating',
  code: 'OK',
  dataset: 'demo-gsm8k-math-dataset-1000',
  evaluationDataset: 'N/A',
  epochs: 5,
  loraRank: 8,
  learningRate: 0.0001,
  maxContextLength: 8192,
  earlyStop: false,
  turboMode: false,
  createdOn: 'Sunday, June 8, 2025',
};

export default function FineTuningJobDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [mounted, setMounted] = useState(false);
  const [jobDetails] = useState<JobDetails>(mockJobDetails);

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
    <div className="flex flex-col h-full bg-background font-sans">
      <header className="flex sticky top-0 bg-background/95 backdrop-blur-sm py-1.5 items-center px-2 md:px-2 gap-2 border-b border-border/40">
        <SidebarToggle />
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight">Fine-Tuning</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-lg font-semibold tracking-tight">Supervised Fine-Tuning</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-lg font-semibold tracking-tight">{jobDetails.id}</span>
        </div>
        <div className="ml-auto">
          <Button 
            variant="outline" 
            size="sm"
            className="text-muted-foreground hover:text-foreground font-medium"
          >
            Deploy this LoRA
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-semibold tracking-tight">{jobDetails.id}</h1>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-muted-foreground text-sm">Created {jobDetails.createdOn}</p>
                <Button variant="link" className="p-0 h-auto text-sm font-medium mt-1">
                  View LoRA
                </Button>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="font-medium"
                >
                  <Rocket className="h-4 w-4 mr-2" />
                  Deploy this LoRA
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="font-medium"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Finetune this model
                </Button>
              </div>
            </div>

            {/* Model Loss Chart */}
            <Card className="border border-border/60">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Model Loss</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No data
                </div>
              </CardContent>
            </Card>

            {/* Deployments */}
            <Card className="border border-border/60">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Deployments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  No current deployments.
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Status */}
            <Card className="border border-border/60">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Status</CardTitle>
                  <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 font-medium">
                    {jobDetails.state}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Code</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium">{jobDetails.code}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Configuration */}
            <Card className="border border-border/60">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Name</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-right max-w-48 truncate">{jobDetails.name}</span>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Output Model</span>
                    <span className="font-medium">{jobDetails.outputModel}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Base Model</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-orange-600">{jobDetails.baseModel}</span>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Type</span>
                    <span className="font-medium">{jobDetails.type}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Dataset</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-orange-600">{jobDetails.dataset}</span>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Evaluation Dataset</span>
                    <span className="font-medium">{jobDetails.evaluationDataset}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Epochs</span>
                    <span className="font-medium">{jobDetails.epochs}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">LoRA Rank</span>
                    <span className="font-medium">{jobDetails.loraRank}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Learning Rate</span>
                    <span className="font-medium">{jobDetails.learningRate}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Max Context Length</span>
                    <span className="font-medium">{jobDetails.maxContextLength}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Early Stop</span>
                    <span className="font-medium">{jobDetails.earlyStop ? 'On' : 'Off'}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Turbo Mode</span>
                    <span className="font-medium">{jobDetails.turboMode ? 'On' : 'Off'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}