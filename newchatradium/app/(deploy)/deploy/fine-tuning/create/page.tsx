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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Upload,
  Search,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

// Step types for the wizard
type WizardStep = 'model' | 'dataset' | 'evaluation' | 'settings';

interface WizardState {
  selectedModel: string;
  selectedDataset: string;
  evaluationOption: string;
  modelOutputName: string;
  enableWeightsBiases: boolean;
  epochs: string;
  batchSize: string;
  loraRank: string;
  learningRate: string;
  maxContextLength: string;
  earlyStop: boolean;
  turboMode: boolean;
  jobId: string;
}

const availableModels = [
  {
    id: 'llama-v3p1-8b-instruct',
    name: 'Llama v3.1 8B Instruct',
    provider: 'Meta',
    contextLength: '131,072 tokens',
  },
  {
    id: 'llama-v3p1-70b-instruct',
    name: 'Llama v3.1 70B Instruct',
    provider: 'Meta',
    contextLength: '131,072 tokens',
  },
  {
    id: 'qwen3-30b-instruct',
    name: 'Qwen3 30B Instruct',
    provider: 'Alibaba',
    contextLength: '32,768 tokens',
  },
];

const availableDatasets = [
  {
    id: 'none',
    name: 'None',
    description: '',
  },
  {
    id: 'demo-gsm8k-math-dataset-1000',
    name: 'demo-gsm8k-math-dataset-1000',
    description: 'Math problem solving dataset',
  },
  {
    id: 'sample-finetune-data',
    name: 'sample-finetune-data',
    description: 'Sample fine-tuning dataset',
  },
];

export default function FineTuningCreatePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<WizardStep>('model');
  const [mounted, setMounted] = useState(false);
  const [wizardState, setWizardState] = useState<WizardState>({
    selectedModel: '',
    selectedDataset: '',
    evaluationOption: 'no-validation',
    modelOutputName: 'Default: ft-<timestamp>-<random-string>',
    enableWeightsBiases: false,
    epochs: '5',
    batchSize: '32768',
    loraRank: '8',
    learningRate: '0.0001',
    maxContextLength: '8192',
    earlyStop: false,
    turboMode: false,
    jobId: 'Default: auto-generated',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const steps = [
    { id: 'model', title: 'Model Selection', number: 1 },
    { id: 'dataset', title: 'Dataset', number: 2 },
    { id: 'evaluation', title: 'Evaluation', number: 3 },
    { id: 'settings', title: 'Optional Settings', number: 4 },
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
      case 'dataset':
        return wizardState.selectedDataset !== '';
      case 'evaluation':
        return true;
      case 'settings':
        return true;
      default:
        return false;
    }
  };

  const handleContinue = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id as WizardStep);
    } else {
      // Create the fine-tuning job and redirect to job details
      const jobId = 'ft-mbntroqr-1snaq';
      router.push(`/deploy/fine-tuning/${jobId}`);
    }
  };

  const handleBack = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id as WizardStep);
    }
  };

  const renderStepContent = (step: WizardStep) => {
    switch (step) {
      case 'model':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Choose a base model or a LoRA adapter to start{' '}
                <span className="underline decoration-dotted underline-offset-2">fine-tuning</span>.
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
              <CardTitle className="text-lg font-semibold">Selecting a Model</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You can either choose a base model or a LoRA adapter as your starting point.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Base Models</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Choose a base model that best suits your use case</li>
                    <li>• Consider the model's capabilities and limitations</li>
                    <li>• Review model specifications (parameters, context window, etc.)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">LoRA Adapters</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Use a previously fine-tuned LoRA adapter as your starting point</li>
                    <li>• Build upon existing adaptations for your specific use case</li>
                    <li>• More efficient than starting from scratch with a base model</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Tip:</strong> LoRA (Low-Rank Adaptation) is a lightweight, efficient way to fine-tune large language models.
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
              <h1 className="text-2xl font-semibold tracking-tight mb-2">Create a Fine-Tuning Job</h1>
              <p className="text-muted-foreground">Fine-tune a new Low Rank Adaptation (LoRA) model.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
              <Button
                variant={currentStep === 'model' || currentStep === 'dataset' || currentStep === 'evaluation' || currentStep === 'settings' ? 'default' : 'ghost'}
                size="sm"
                className="font-medium"
              >
                Supervised
              </Button>
              <Button variant="ghost" size="sm" className="font-medium text-muted-foreground">
                Reinforcement
              </Button>
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
                disabled={!canContinue()}
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 font-medium"
              >
                {currentStep === 'settings' ? 'Create Fine-Tuning Job' : 'Continue'}
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
