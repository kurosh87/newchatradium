'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  AlertCircle,
  Brain,
  Server,
  Settings,
  FileText,
  Cpu,
  Zap,
  DollarSign,
  Info,
} from 'lucide-react';
import Link from 'next/link';

// Step types for the wizard
type WizardStep = 'model' | 'performance' | 'scaling' | 'metadata';

interface WizardState {
  selectedModel: string;
  enableSpeculativeDecoding: boolean;
  acceleratorType: string;
  acceleratorCount: string;
  enableAutoScaling: boolean;
  minReplicas: string;
  maxReplicas: string;
  displayName: string;
  description: string;
}

const availableModels = [
  {
    id: 'qwen3-30b-a3b',
    name: 'Qwen3 30B-A3B',
    provider: 'Alibaba',
    contextLength: '32,768 tokens',
    pricing: '$2.90/hr',
  },
  {
    id: 'qwen3-235b-a22b',
    name: 'Qwen3 235B-A22B',
    provider: 'Alibaba',
    contextLength: '128,000 tokens',
    pricing: '$8.50/hr',
  },
  {
    id: 'llama-v3p1-8b-instruct',
    name: 'Llama v3.1 8B Instruct',
    provider: 'Meta',
    contextLength: '131,072 tokens',
    pricing: '$1.20/hr',
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    contextLength: '160,000 tokens',
    pricing: '$5.40/hr',
  },
];

const acceleratorTypes = [
  {
    id: 'nvidia-a100-80gb',
    name: 'NVIDIA A100 80GB',
    description: 'High-performance training and inference',
    price: '$2.90/hr',
  },
  {
    id: 'nvidia-h100-80gb',
    name: 'NVIDIA H100 80GB',
    description: 'Latest generation, fastest inference',
    price: '$4.50/hr',
  },
  {
    id: 'nvidia-l40s-48gb',
    name: 'NVIDIA L40S 48GB',
    description: 'Cost-effective for smaller models',
    price: '$1.80/hr',
  },
];

export default function CreateDeploymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedModel = searchParams.get('model') || '';
  
  const [currentStep, setCurrentStep] = useState<WizardStep>('model');
  const [mounted, setMounted] = useState(false);
  const [wizardState, setWizardState] = useState<WizardState>({
    selectedModel: preselectedModel,
    enableSpeculativeDecoding: false,
    acceleratorType: '',
    acceleratorCount: 'auto',
    enableAutoScaling: true,
    minReplicas: '0',
    maxReplicas: '1',
    displayName: '',
    description: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const steps = [
    { id: 'model', title: 'Model', number: 1 },
    { id: 'performance', title: 'Performance', number: 2 },
    { id: 'scaling', title: 'Scaling', number: 3 },
    { id: 'metadata', title: 'Metadata', number: 4 },
  ];

  const getStepStatus = (stepId: WizardStep) => {
    const stepIndex = steps.findIndex(s => s.id === stepId);
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const canContinue = () => {
    switch (currentStep) {
      case 'model':
        return wizardState.selectedModel !== '';
      case 'performance':
        return wizardState.acceleratorType !== '';
      case 'scaling':
        return true;
      case 'metadata':
        return wizardState.displayName !== '';
      default:
        return false;
    }
  };

  const handleContinue = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id as WizardStep);
    } else {
      // Create the deployment and redirect
      router.push('/deploy');
    }
  };

  const handleBack = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id as WizardStep);
    }
  };

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
          <span className="text-lg font-semibold tracking-tight">Deployments</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-lg font-semibold tracking-tight">Create</span>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6 max-w-7xl mx-auto relative">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_50%_50%,_theme(colors.purple.500),transparent_50%)] pointer-events-none" />
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-semibold tracking-tight mb-2">Create Deployment</h1>
              <p className="text-muted-foreground">Select a base model and customize your deployment</p>
            </div>

            {/* Step Navigation */}
            <div className="space-y-6 relative">
              {/* Connecting Lines */}
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gradient-to-b from-purple-200 via-purple-300 to-purple-200 dark:from-purple-800 dark:via-purple-700 dark:to-purple-800" />
              
              {steps.map((step, index) => {
                const status = getStepStatus(step.id as WizardStep);
                const isActive = currentStep === step.id;
                const isCompleted = status === 'completed';
                const isUpcoming = status === 'upcoming';
                
                return (
                  <div key={step.id} className={`relative flex items-start gap-6 transition-all duration-300 ${!isActive ? 'opacity-70' : 'opacity-100'}`}>
                    {/* Step Circle with enhanced styling */}
                    <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 font-medium text-sm transition-all duration-300 z-10 ${
                      isCompleted 
                        ? 'border-green-500 bg-green-500 text-white shadow-lg shadow-green-500/25' 
                        : isActive 
                        ? 'border-purple-500 bg-purple-500 text-white shadow-lg shadow-purple-500/25 ring-4 ring-purple-500/20' 
                        : 'border-gray-300 bg-background text-gray-400 dark:border-gray-600 dark:text-gray-500'
                    }`}>
                      {isCompleted ? (
                        <Check className="h-4 w-4 animate-in fade-in duration-200" />
                      ) : (
                        <span className={isActive ? 'animate-pulse' : ''}>{step.number}</span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium text-base mb-2 transition-colors duration-200 ${
                        isActive ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {step.title}
                      </h3>
                      
                      {isActive && (
                        <div className="animate-in slide-in-from-top-2 duration-300">
                          <div className="bg-card border border-border/60 rounded-xl p-6 shadow-sm">
                            {renderStepContent(step.id as WizardStep)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-8">
              {currentStep !== 'model' && (
                <Button variant="outline" onClick={handleBack} className="font-medium">
                  Back
                </Button>
              )}
              <Button 
                onClick={handleContinue}
                disabled={!canContinue()}
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 font-medium"
              >
                {currentStep === 'metadata' ? 'Create Deployment' : 'Continue'}
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {renderSidebar()}
          </div>
        </div>
      </div>
    </div>
  );

  function renderStepContent(step: WizardStep) {
    switch (step) {
      case 'model':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Select a base model to deploy to{' '}
                <span className="underline decoration-dotted underline-offset-2">dedicated GPUs</span>.
              </p>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Base Model *</label>
                <Select
                  value={wizardState.selectedModel}
                  onValueChange={(value) => setWizardState(prev => ({ ...prev, selectedModel: value }))}
                >
                  <SelectTrigger className={`w-full h-11 transition-all duration-200 ${
                    !wizardState.selectedModel 
                      ? 'border-red-200 dark:border-red-800 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-green-200 dark:border-green-800 focus:border-green-500 focus:ring-green-500/20'
                  }`}>
                    <SelectValue placeholder="Select a base model" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        <div className="flex flex-col">
                          <span>{model.name}</span>
                          <span className="text-xs text-muted-foreground">{model.provider} • {model.contextLength}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="speculative-decoding"
                checked={wizardState.enableSpeculativeDecoding}
                onCheckedChange={(checked) => setWizardState(prev => ({ ...prev, enableSpeculativeDecoding: checked === true }))}
              />
              <Label htmlFor="speculative-decoding" className="font-medium">Enable Speculative Decoding</Label>
            </div>

            {wizardState.selectedModel && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">Selected Model</div>
                <div className="text-sm text-green-700 dark:text-green-300 font-mono">
                  accounts/fireworks/models/{wizardState.selectedModel}
                </div>
              </div>
            )}
            {!wizardState.selectedModel && (
              <div className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Please select a base model to continue
              </div>
            )}
          </div>
        );

      case 'performance':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Accelerator Type *</label>
              <p className="text-sm text-muted-foreground">Select the GPU type for your deployment</p>
              
              <div className="space-y-3">
                {acceleratorTypes.map((accelerator) => (
                  <div key={accelerator.id} className="relative">
                    <input
                      type="radio"
                      id={accelerator.id}
                      name="accelerator"
                      value={accelerator.id}
                      checked={wizardState.acceleratorType === accelerator.id}
                      onChange={(e) => setWizardState(prev => ({ ...prev, acceleratorType: e.target.value }))}
                      className="peer sr-only"
                    />
                    <label
                      htmlFor={accelerator.id}
                      className="flex items-center justify-between p-4 md:p-6 border rounded-lg cursor-pointer transition-all duration-200 peer-checked:border-purple-500 peer-checked:bg-purple-50 dark:peer-checked:bg-purple-950/30 hover:border-purple-300 dark:hover:border-purple-700"
                    >
                      <div>
                        <div className="font-medium">{accelerator.name}</div>
                        <div className="text-sm text-muted-foreground">{accelerator.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{accelerator.price}</div>
                        <div className="text-xs text-muted-foreground">per hour</div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Accelerator Count</label>
              <p className="text-sm text-muted-foreground">Number of accelerators to use per replica</p>
              <Select
                value={wizardState.acceleratorCount}
                onValueChange={(value) => setWizardState(prev => ({ ...prev, acceleratorCount: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {wizardState.acceleratorType && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="text-sm">
                  <div className="text-blue-800 dark:text-blue-200 font-medium mb-1">
                    {acceleratorTypes.find(a => a.id === wizardState.acceleratorType)?.name}
                  </div>
                  <div className="text-blue-700 dark:text-blue-300 text-xs">
                    Auto accelerator count is selected, which will use 1 accelerators for this model.
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'scaling':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="auto-scaling"
                checked={wizardState.enableAutoScaling}
                onCheckedChange={(checked) => setWizardState(prev => ({ ...prev, enableAutoScaling: checked === true }))}
              />
              <Label htmlFor="auto-scaling" className="font-medium">Enable Auto Scaling</Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min-replicas" className="font-medium">Min Replicas</Label>
                <p className="text-xs text-muted-foreground">Minimum number of replicas. Set to 0 to enable scale-to-zero.</p>
                <Input
                  id="min-replicas"
                  type="number"
                  min="0"
                  value={wizardState.minReplicas}
                  onChange={(e) => setWizardState(prev => ({ ...prev, minReplicas: e.target.value }))}
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max-replicas" className="font-medium">Max Replicas</Label>
                <p className="text-xs text-muted-foreground">Maximum number of replicas for auto-scaling. You can disable the deployment, after creation, by editing the deployment and setting this to 0.</p>
                <Input
                  id="max-replicas"
                  type="number"
                  min="1"
                  value={wizardState.maxReplicas}
                  onChange={(e) => setWizardState(prev => ({ ...prev, maxReplicas: e.target.value }))}
                  className="h-11"
                />
              </div>
            </div>

            <div className="p-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="text-sm">
                <div className="text-yellow-800 dark:text-yellow-200 font-medium mb-1">
                  Autoscaling Enabled
                </div>
                <div className="text-yellow-700 dark:text-yellow-300 text-xs">
                  Replicas: {wizardState.minReplicas}-{wizardState.maxReplicas}
                </div>
              </div>
            </div>
          </div>
        );

      case 'metadata':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="display-name" className="font-medium">Display Name *</Label>
              <p className="text-sm text-muted-foreground">Human-readable name of the deployment. Must be fewer than 64 characters long.</p>
              <Input
                id="display-name"
                value={wizardState.displayName}
                onChange={(e) => setWizardState(prev => ({ ...prev, displayName: e.target.value }))}
                className="h-11"
                placeholder="e.g., Production Chat API"
              />
              {!wizardState.displayName && (
                <div className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Display name is required
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="font-medium">Description</Label>
              <p className="text-sm text-muted-foreground">Description of the deployment</p>
              <textarea
                id="description"
                value={wizardState.description}
                onChange={(e) => setWizardState(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-3 border border-input rounded-lg resize-none h-24 text-sm"
                placeholder="Optional description for your deployment..."
              />
            </div>

            {/* Price Range */}
            <div className="p-4 md:p-6 bg-muted/50 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Price Range</h4>
                  <p className="text-sm text-muted-foreground">Projected hourly deployment cost</p>
                  <Button variant="link" className="p-0 h-auto text-sm font-medium">
                    Learn more
                  </Button>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">$0.00-$2.90/hr</div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  function renderSidebar() {
    switch (currentStep) {
      case 'model':
        return (
          <Card className="border border-border/60 shadow-sm bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Base Model</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Select a base model to deploy to dedicated, private GPUs.
              </p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">Don't see your model?</h4>
                  <Button variant="link" className="p-0 h-auto text-sm text-orange-600 hover:text-orange-700">
                    Upload a custom model →
                  </Button>
                </div>
              </div>
              
              <div className="pt-2">
                <Button variant="link" className="p-0 h-auto text-sm">
                  Read the docs →
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'performance':
        return (
          <Card className="border border-border/60 shadow-sm bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Which accelerator should I choose?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Smaller accelerators (A100s) are more affordably priced than larger accelerators (H100s and MI300x). However, larger accelerators have improved latency and total capacity. We generally find that larger accelerators are both more performant and cost-efficient than smaller accelerators if you have the volume to take advantage of the larger capacity.
              </p>
              
              <div className="space-y-2">
                <Button variant="link" className="p-0 h-auto text-sm text-orange-600 hover:text-orange-700">
                  See FAQs for more info
                </Button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">Accelerator Count</h4>
                  <p className="text-sm text-muted-foreground">
                    Increase accelerator count to improve generation speed, time-to-first-token and maximum QPS for your deployment. However, the scaling is sub-linear. The default value for most models is 1 but may be higher for larger models that require sharding.
                  </p>
                </div>
              </div>
              
              <div className="pt-2">
                <Button variant="link" className="p-0 h-auto text-sm">
                  Read the docs →
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'scaling':
        return (
          <Card className="border border-border/60 shadow-sm bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Min/Max replicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                A replica is an individual serving instance. Increasing the number of replicas increases the maximum QPS the deployment can support. For example, if world size=2, min replicas=1, and max replicas=3, this means you would always serve on at least 1 replica (of 2 GPUs) but could serve on up to 3 replicas (each of 2 GPUs) as traffic scales up or down.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Autoscale-to-zero</h4>
                  <p className="text-sm text-muted-foreground">
                    Setting min replicas to 0 allows the deployment to scale down to 0 (aka standby). There is no cost while in standby, but to scale back up there is a cold start delay.
                  </p>
                </div>
              </div>
              
              <div className="pt-2">
                <Button variant="link" className="p-0 h-auto text-sm">
                  Read the docs →
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'metadata':
        return (
          <Card className="border border-border/60 shadow-sm bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Display name</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Name to refer to your deployment
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    More detailed information about your deployment
                  </p>
                </div>
              </div>
              
              <div className="pt-2">
                <Button variant="link" className="p-0 h-auto text-sm">
                  Read the docs →
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  }
}