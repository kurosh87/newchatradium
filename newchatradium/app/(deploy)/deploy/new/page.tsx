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
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useModels, useApiMutation } from '@/hooks/use-api';
import { apiClient } from '@/lib/api-client';
import { toast } from '@/hooks/use-toast';

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
];

export default function NewDeploymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedModel = searchParams.get('model');
  
  const [currentStep, setCurrentStep] = useState<WizardStep>('model');
  const [mounted, setMounted] = useState(false);
  const [wizardState, setWizardState] = useState<WizardState>({
    selectedModel: preselectedModel || '',
    enableSpeculativeDecoding: false,
    acceleratorType: '',
    acceleratorCount: 'Auto',
    enableAutoScaling: true,
    minReplicas: '0',
    maxReplicas: '1',
    displayName: '',
    description: '',
  });

  // Fetch models from API
  const { data: modelsData, loading: modelsLoading, error: modelsError } = useModels();
  const models = Array.isArray(modelsData) ? modelsData : [];

  // Create deployment mutation
  const { mutate: createDeployment, loading: deploying } = useApiMutation(
    (data: any) => apiClient.createDeployment(data)
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (preselectedModel && models.length > 0) {
      const model = models.find(m => m.id === preselectedModel);
      if (model) {
        setWizardState(prev => ({
          ...prev,
          selectedModel: preselectedModel,
          displayName: prev.displayName || `${model.name.toLowerCase().replace(/\s+/g, '-')}-deployment`,
          acceleratorType: model.gpuRequirements?.type === 'H100' ? 'nvidia-h100-80gb' : 'nvidia-a100-80gb',
        }));
      }
    }
  }, [preselectedModel, models]);

  const selectedModelData = models.find(m => m.id === wizardState.selectedModel);

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
        return wizardState.displayName.trim() !== '';
      default:
        return false;
    }
  };

  const handleContinue = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id as WizardStep);
    } else {
      handleDeploy();
    }
  };

  const handleBack = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id as WizardStep);
    }
  };

  const handleDeploy = async () => {
    if (!selectedModelData) {
      toast({
        title: 'Error',
        description: 'Please select a model',
        variant: 'destructive',
      });
      return;
    }

    if (!wizardState.displayName.trim()) {
      toast({
        title: 'Error', 
        description: 'Please enter a deployment name',
        variant: 'destructive',
      });
      return;
    }

    try {
      const deploymentData = {
        modelId: wizardState.selectedModel,
        name: wizardState.displayName,
        configuration: {
          acceleratorType: wizardState.acceleratorType === 'nvidia-h100-80gb' ? 'H100' : 'A100',
          acceleratorCount: parseInt(wizardState.acceleratorCount),
          speculativeDecoding: wizardState.enableSpeculativeDecoding,
          autoScaling: wizardState.enableAutoScaling,
          minReplicas: parseInt(wizardState.minReplicas),
          maxReplicas: parseInt(wizardState.maxReplicas),
          description: wizardState.description,
        },
      };

      await createDeployment(deploymentData);
      
      toast({
        title: 'Success',
        description: 'Deployment created successfully! Redirecting to deployments page...',
      });

      // Redirect to deployments page after a short delay
      setTimeout(() => {
        router.push('/deploy');
      }, 1500);
      
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create deployment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const renderStepContent = (step: WizardStep) => {
    switch (step) {
      case 'model':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Select a base model and customize your deployment
              </p>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Select base model*</label>
                <Select
                  value={wizardState.selectedModel}
                  onValueChange={(value) => {
                    const model = models.find(m => m.id === value);
                    setWizardState(prev => ({ 
                      ...prev, 
                      selectedModel: value,
                      displayName: prev.displayName || (model ? `${model.name.toLowerCase().replace(/\s+/g, '-')}-deployment` : ''),
                      acceleratorType: model?.gpuRequirements?.type === 'H100' ? 'nvidia-h100-80gb' : 'nvidia-a100-80gb',
                    }));
                  }}
                >
                  <SelectTrigger className={`w-full h-11 transition-all duration-200 ${
                    !wizardState.selectedModel 
                      ? 'border-red-200 dark:border-red-800 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-green-200 dark:border-green-800 focus:border-green-500 focus:ring-green-500/20'
                  }`}>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
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
                onCheckedChange={(checked) => 
                  setWizardState(prev => ({ ...prev, enableSpeculativeDecoding: !!checked }))
                }
              />
              <Label htmlFor="speculative-decoding" className="text-sm">
                Enable Speculative Decoding
              </Label>
            </div>
            {wizardState.selectedModel && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">Base model</div>
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
              <p className="text-sm text-muted-foreground leading-relaxed">
                Select the GPU type for your deployment
              </p>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Accelerator Type</label>
                <Select
                  value={wizardState.acceleratorType}
                  onValueChange={(value) => setWizardState(prev => ({ ...prev, acceleratorType: value }))}
                >
                  <SelectTrigger className="w-full h-11">
                    <SelectValue placeholder="NVIDIA A100 80GB" />
                  </SelectTrigger>
                  <SelectContent>
                    {acceleratorTypes.map((accelerator) => (
                      <SelectItem key={accelerator.id} value={accelerator.id}>
                        <div className="flex flex-col">
                          <span>{accelerator.name}</span>
                          <span className="text-xs text-muted-foreground">{accelerator.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Accelerator Count</label>
                <p className="text-sm text-muted-foreground">Number of accelerators to use per replica</p>
                <Select
                  value={wizardState.acceleratorCount}
                  onValueChange={(value) => setWizardState(prev => ({ ...prev, acceleratorCount: value }))}
                >
                  <SelectTrigger className="w-full h-11">
                    <SelectValue placeholder="Auto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Auto">Auto</SelectItem>
                    {[1, 2, 4, 8].map((count) => (
                      <SelectItem key={count} value={count.toString()}>
                        {count}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-between h-auto p-4"
                disabled
              >
                <div className="text-left">
                  <div className="font-medium">Advanced Options</div>
                  <div className="text-sm text-muted-foreground">Configure precision, batch size, and more</div>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            {wizardState.acceleratorType && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                  Auto accelerator count is selected, which will use 1 accelerators for this model.
                </div>
              </div>
            )}
          </div>
        );

      case 'scaling':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="auto-scaling"
                  checked={wizardState.enableAutoScaling}
                  onCheckedChange={(checked) => 
                    setWizardState(prev => ({ ...prev, enableAutoScaling: !!checked }))
                  }
                />
                <Label htmlFor="auto-scaling" className="text-sm font-medium">
                  Enable Auto Scaling
                </Label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Min Replicas</label>
                <p className="text-sm text-muted-foreground">Minimum number of replicas. Set to 0 to enable scale-to-zero.</p>
                <Select
                  value={wizardState.minReplicas}
                  onValueChange={(value) => setWizardState(prev => ({ ...prev, minReplicas: value }))}
                >
                  <SelectTrigger className="w-full h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3].map((count) => (
                      <SelectItem key={count} value={count.toString()}>
                        {count}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Max Replicas</label>
                <p className="text-sm text-muted-foreground">Maximum number of replicas for auto-scaling. You can disable the deployment, after creation, by editing the deployment and setting this to 0.</p>
                <Select
                  value={wizardState.maxReplicas}
                  onValueChange={(value) => setWizardState(prev => ({ ...prev, maxReplicas: value }))}
                >
                  <SelectTrigger className="w-full h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 5, 10].map((count) => (
                      <SelectItem key={count} value={count.toString()}>
                        {count}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-between h-auto p-4"
                disabled
              >
                <div className="text-left">
                  <div className="font-medium">Advanced Scaling Options</div>
                  <div className="text-sm text-muted-foreground">Configure scaling triggers and thresholds</div>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            {wizardState.enableAutoScaling && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">Autoscaling Enabled</div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  Replicas: {wizardState.minReplicas}-{wizardState.maxReplicas}
                </div>
              </div>
            )}
          </div>
        );

      case 'metadata':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Display Name</label>
                <p className="text-sm text-muted-foreground">Human-readable name of the deployment. Must be fewer than 64 characters long.</p>
                <Input
                  value={wizardState.displayName}
                  onChange={(e) => setWizardState(prev => ({ ...prev, displayName: e.target.value }))}
                  placeholder=""
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <p className="text-sm text-muted-foreground">Description of the deployment</p>
                <Input
                  value={wizardState.description}
                  onChange={(e) => setWizardState(prev => ({ ...prev, description: e.target.value }))}
                  placeholder=""
                  className="w-full"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderSidebar = () => {
    switch (currentStep) {
      case 'model':
        return (
          <Card className="border border-border/60 shadow-sm bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Base Model</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Select a base model to deploy to dedicated, private GPUs</li>
                <li>• Don't see your model? <Link href="/deploy/my-models" className="text-orange-500 hover:text-orange-600 underline">Upload a custom model</Link></li>
              </ul>
              
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
                Smaller accelerators (A100s) are more affordably priced than larger accelerators (H100s and MI300x). However, larger accelerators have improved latency and total capacity. We generally find that larger accelerators are both more performant and cost-efficient than smaller accelerators if you have the volume to take advantage of the larger capacity.{' '}
                <Link href="#" className="text-orange-500 hover:text-orange-600 underline">
                  See FAQs for more info
                </Link>
              </p>
              
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
              <CardTitle className="text-lg font-semibold">Accelerator Count</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Increase accelerator count to improve generation speed, time-to-first-token and maximum QPS for your deployment. However, the scaling is sub-linear. The default value for most models is 1 but may be higher for larger models that require sharding.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Min/Max replicas</h4>
                  <p className="text-sm text-muted-foreground">
                    A replica is an individual serving instance. Increasing the number of replicas increases the maximum QPS the deployment can support. For example, if world_size=2, min replicas=1, and max replicas=3, this means you would always serve on at least 1 replica (of 2 GPUs) but could serve on up to 3 replicas (each of 2 GPUs) as traffic scales up or down.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Autoscale-to-zero</h4>
                  <p className="text-sm text-muted-foreground">
                    Setting min replicas to 0 allows the deployment to scale down to 0 (aka standby). There is no cost while in standby, but to scale back up there is a cold start delay.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Set max replicas to 0 to temporarily disable the deployment. Changing replica counts is faster than creating a new deployment and maintains the configuration.
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
              
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">
                  More detailed information about your deployment
                </p>
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
  };

  if (!mounted) {
    return (
      <div className="flex flex-col h-full bg-background">
        <header className="flex sticky top-0 z-[100] bg-gradient-to-r from-background/80 via-muted/40 to-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-gradient-to-r supports-[backdrop-filter]:from-background/60 supports-[backdrop-filter]:via-muted/20 supports-[backdrop-filter]:to-background/60 py-1.5 items-center px-2 md:px-2 gap-2 border-b border-border/60">
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

  if (modelsLoading) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-muted/20 font-sans">
        <header className="flex sticky top-0 z-[100] bg-gradient-to-r from-background/80 via-muted/40 to-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-gradient-to-r supports-[backdrop-filter]:from-background/60 supports-[backdrop-filter]:via-muted/20 supports-[backdrop-filter]:to-background/60 py-1.5 items-center px-2 md:px-2 gap-2 border-b border-border/60">
          <SidebarToggle />
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold tracking-tight">Deployments</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-lg font-semibold tracking-tight">Create</span>
          </div>
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
      <header className="flex sticky top-0 z-[100] bg-gradient-to-r from-background/80 via-muted/40 to-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-gradient-to-r supports-[backdrop-filter]:from-background/60 supports-[backdrop-filter]:via-muted/20 supports-[backdrop-filter]:to-background/60 py-1.5 items-center px-2 md:px-2 gap-2 border-b border-border/60">
        <SidebarToggle />
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight">Deployments</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-lg font-semibold tracking-tight">Create</span>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 max-w-7xl mx-auto relative">
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
            <div className="space-y-8 relative">
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
                disabled={!canContinue() || deploying}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium"
              >
                {deploying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
}