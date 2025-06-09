'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useApiKeys, useDeployments, useDatasets } from '@/hooks/use-api';

interface OnboardingProgress {
  hasApiKeys: boolean;
  hasDeployments: boolean;
  hasDatasets: boolean;
  completedSteps: number;
  totalSteps: number;
  completionPercentage: number;
  nextStep: string | null;
  isComplete: boolean;
}

interface OnboardingContextType {
  progress: OnboardingProgress;
  loading: boolean;
  refresh: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<OnboardingProgress>({
    hasApiKeys: false,
    hasDeployments: false,
    hasDatasets: false,
    completedSteps: 0,
    totalSteps: 3,
    completionPercentage: 0,
    nextStep: null,
    isComplete: false,
  });

  // Fetch data from all APIs
  const { data: apiKeysData, loading: apiKeysLoading, refresh: refreshApiKeys } = useApiKeys();
  const { data: deploymentsData, loading: deploymentsLoading, refresh: refreshDeployments } = useDeployments();
  const { data: datasetsData, loading: datasetsLoading, refresh: refreshDatasets } = useDatasets();

  const loading = apiKeysLoading || deploymentsLoading || datasetsLoading;

  const refresh = () => {
    refreshApiKeys();
    refreshDeployments();
    refreshDatasets();
  };

  useEffect(() => {
    if (loading) return;

    const hasApiKeys = Array.isArray(apiKeysData) ? apiKeysData.length > 0 : false;
    const hasDeployments = Array.isArray(deploymentsData) ? deploymentsData.length > 0 : false;
    const hasDatasets = Array.isArray(datasetsData) ? datasetsData.length > 0 : false;

    const completedSteps = [hasApiKeys, hasDeployments, hasDatasets].filter(Boolean).length;
    const totalSteps = 3;
    const completionPercentage = Math.round((completedSteps / totalSteps) * 100);

    // Determine next step based on recommended order
    let nextStep: string | null = null;
    if (!hasApiKeys) {
      nextStep = 'Create your first API key to authenticate requests';
    } else if (!hasDeployments) {
      nextStep = 'Deploy your first AI model for inference';
    } else if (!hasDatasets) {
      nextStep = 'Upload a dataset for fine-tuning (optional)';
    }

    const isComplete = completedSteps >= 2; // Consider complete after API keys + deployments

    setProgress({
      hasApiKeys,
      hasDeployments,
      hasDatasets,
      completedSteps,
      totalSteps,
      completionPercentage,
      nextStep,
      isComplete,
    });
  }, [apiKeysData, deploymentsData, datasetsData, loading]);

  return (
    <OnboardingContext.Provider value={{ progress, loading, refresh }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboardingProgress() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboardingProgress must be used within an OnboardingProvider');
  }
  return context;
}