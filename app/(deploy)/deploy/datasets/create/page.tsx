'use client';

import { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, Upload, FileText, AlertCircle, CheckCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Step types for the wizard
type WizardStep = 'name' | 'upload';

interface WizardState {
  datasetName: string;
  datasetDescription: string;
  uploadedFile: File | null;
  validationErrors: string[];
  isValidating: boolean;
}

export default function CreateDatasetPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<WizardStep>('name');
  const [mounted, setMounted] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [wizardState, setWizardState] = useState<WizardState>({
    datasetName: '',
    datasetDescription: '',
    uploadedFile: null,
    validationErrors: [],
    isValidating: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const steps = [
    { id: 'name', title: 'Name Dataset', number: 1 },
    { id: 'upload', title: 'Upload Dataset', number: 2 },
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
      case 'name':
        return wizardState.datasetName.trim() !== '';
      case 'upload':
        return wizardState.uploadedFile !== null && wizardState.validationErrors.length === 0;
      default:
        return false;
    }
  };

  const handleContinue = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id as WizardStep);
    } else {
      // Create the dataset and redirect
      toast({
        title: 'Dataset created successfully',
        description: `Dataset "${wizardState.datasetName}" has been created and is being processed.`,
      });
      router.push('/deploy/datasets');
    }
  };

  const handleBack = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id as WizardStep);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.jsonl')) {
        setWizardState(prev => ({ ...prev, uploadedFile: file }));
        validateFile(file);
      } else {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a .jsonl file',
          variant: 'destructive',
        });
      }
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.endsWith('.jsonl')) {
        setWizardState(prev => ({ ...prev, uploadedFile: file }));
        validateFile(file);
      } else {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a .jsonl file',
          variant: 'destructive',
        });
      }
    }
  };

  const validateFile = async (file: File) => {
    setWizardState(prev => ({ ...prev, isValidating: true, validationErrors: [] }));

    try {
      const text = await file.text();
      const lines = text.trim().split('\n');
      const errors: string[] = [];

      if (file.size > 1024 * 1024 * 1024) { // 1GB
        errors.push('File size exceeds 1GB limit');
      }

      lines.forEach((line, index) => {
        if (line.trim()) {
          try {
            const obj = JSON.parse(line);
            if (!obj.prompt || !obj.completion) {
              errors.push(`Line ${index + 1}: Missing 'prompt' or 'completion' field`);
            }
          } catch {
            errors.push(`Line ${index + 1}: Invalid JSON format`);
          }
        }
      });

      setWizardState(prev => ({ ...prev, validationErrors: errors }));
    } catch (error) {
      setWizardState(prev => ({ ...prev, validationErrors: ['Failed to read file'] }));
    }

    setWizardState(prev => ({ ...prev, isValidating: false }));
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
          <span className="text-lg font-semibold tracking-tight">Datasets</span>
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
              <h1 className="text-2xl font-semibold tracking-tight mb-2">Create Dataset</h1>
              <p className="text-muted-foreground">Upload a JSONL file to create a new dataset for fine-tuning.</p>
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
              {currentStep !== 'name' && (
                <Button variant="outline" onClick={handleBack} className="font-medium">
                  Back
                </Button>
              )}
              <Button 
                onClick={handleContinue}
                disabled={!canContinue()}
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 font-medium"
              >
                {currentStep === 'upload' ? 'Create Dataset' : 'Continue'}
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
      case 'name':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Enter a display name and description for your{' '}
                <span className="underline decoration-dotted underline-offset-2">dataset</span>.
              </p>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Dataset Name *</label>
                <Input
                  placeholder="Enter dataset name"
                  value={wizardState.datasetName}
                  onChange={(e) => setWizardState(prev => ({ ...prev, datasetName: e.target.value }))}
                  className={`h-11 transition-all duration-200 ${
                    !wizardState.datasetName 
                      ? 'border-red-200 dark:border-red-800 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-green-200 dark:border-green-800 focus:border-green-500 focus:ring-green-500/20'
                  }`}
                />
                <p className="text-sm text-muted-foreground">
                  This name will be displayed in the UI. Dataset ID will be automatically generated.
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description (Optional)</label>
              <Textarea
                placeholder="Enter a description for your dataset..."
                value={wizardState.datasetDescription}
                onChange={(e) => setWizardState(prev => ({ ...prev, datasetDescription: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>

            {wizardState.datasetName && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">Dataset Name</div>
                <div className="text-sm text-green-700 dark:text-green-300 font-mono">
                  {wizardState.datasetName}
                </div>
              </div>
            )}
            {!wizardState.datasetName && (
              <div className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Please enter a dataset name to continue
              </div>
            )}
          </div>
        );

      case 'upload':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Upload a JSONL file containing your training data for{' '}
                <span className="underline decoration-dotted underline-offset-2">fine-tuning</span>.
              </p>
              
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/50' 
                    : 'border-border hover:border-purple-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {wizardState.uploadedFile ? wizardState.uploadedFile.name : 'Drop your JSONL file here'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {wizardState.uploadedFile 
                    ? `File size: ${(wizardState.uploadedFile.size / 1024 / 1024).toFixed(2)} MB`
                    : 'or click to browse files'
                  }
                </p>
                <input
                  type="file"
                  accept=".jsonl"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" asChild>
                    <span>Choose File</span>
                  </Button>
                </label>
              </div>
            </div>

            {/* Validation Results */}
            {wizardState.uploadedFile && (
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-3">Validation Results</h4>
                {wizardState.isValidating ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                    Validating file...
                  </div>
                ) : (
                  <div className="space-y-2">
                    {wizardState.validationErrors.length === 0 ? (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        File validation passed
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-red-600">
                          <AlertCircle className="w-4 h-4" />
                          {wizardState.validationErrors.length} validation error(s) found
                        </div>
                        <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-md p-3">
                          <ul className="text-sm space-y-1">
                            {wizardState.validationErrors.slice(0, 5).map((error, index) => (
                              <li key={index} className="text-red-700 dark:text-red-300">• {error}</li>
                            ))}
                            {wizardState.validationErrors.length > 5 && (
                              <li className="text-red-700 dark:text-red-300">• ... and {wizardState.validationErrors.length - 5} more errors</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {wizardState.uploadedFile && wizardState.validationErrors.length === 0 && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">Ready to Create</div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  File validation passed. Dataset ready for creation.
                </div>
              </div>
            )}
            {(!wizardState.uploadedFile || wizardState.validationErrors.length > 0) && (
              <div className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Please upload a valid JSONL file to continue
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  }

  function renderSidebar() {
    switch (currentStep) {
      case 'name':
        return (
          <Card className="border border-border/60 shadow-sm bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Dataset Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Create a dataset for fine-tuning your models with custom training data.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">File Format</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• JSONL format (one JSON object per line)</li>
                    <li>• Each line must contain valid JSON</li>
                    <li>• Maximum file size: 1GB</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Required Fields</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• "prompt": The input text</li>
                    <li>• "completion": The expected output</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Tip:</strong> High-quality datasets with diverse examples typically produce better fine-tuned models.
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

      case 'upload':
        return (
          <Card className="border border-border/60 shadow-sm bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Example Format</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Each line in your JSONL file should be a valid JSON object with prompt and completion fields.
              </p>
              
              <div className="bg-muted/50 rounded-md p-3 text-sm font-mono">
                <div className="text-orange-600">{`{"prompt": "What is AI?", "completion": "AI is..."}`}</div>
                <div className="text-orange-600">{`{"prompt": "How to code?", "completion": "Start with..."}`}</div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Best Practices</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Use consistent formatting</li>
                    <li>• Include diverse examples</li>
                    <li>• Keep prompts and completions relevant</li>
                    <li>• Test with a smaller dataset first</li>
                  </ul>
                </div>
              </div>
              
              <div className="pt-2">
                <Button variant="link" className="p-0 h-auto text-sm">
                  View examples →
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