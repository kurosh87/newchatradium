import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useApi<T>(
  apiCall: () => Promise<{ data: T; message?: string; error?: string }>,
  dependencies: any[] = []
): ApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
  };
}

// Specific hooks for common API calls
export function useDeployments(params?: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  return useApi(
    () => apiClient.getDeployments(params),
    [params?.status, params?.limit, params?.offset]
  );
}

export function useDeployment(id: string) {
  return useApi(
    () => apiClient.getDeployment(id),
    [id]
  );
}

export function useModels(params?: {
  category?: string;
  provider?: string;
  featured?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  return useApi(
    () => apiClient.getModels(params),
    [params?.category, params?.provider, params?.featured, params?.search, params?.limit, params?.offset]
  );
}

export function useModel(id: string) {
  return useApi(
    () => apiClient.getModel(id),
    [id]
  );
}

export function useApiKeys(params?: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  return useApi(
    () => apiClient.getApiKeys(params),
    [params?.status, params?.limit, params?.offset]
  );
}

export function useFineTuningJobs(params?: {
  status?: string;
  limit?: number;
  offset?: number;
}) {
  return useApi(
    () => apiClient.getFineTuningJobs(params),
    [params?.status, params?.limit, params?.offset]
  );
}

export function useDatasets(params?: {
  status?: string;
  format?: string;
  limit?: number;
  offset?: number;
}) {
  return useApi(
    () => apiClient.getDatasets(params),
    [params?.status, params?.format, params?.limit, params?.offset]
  );
}

export function useAnalytics(params?: {
  timeframe?: string;
  metric?: string;
}) {
  return useApi(
    () => apiClient.getAnalytics(params),
    [params?.timeframe, params?.metric]
  );
}

export function useBilling() {
  return useApi(
    () => apiClient.getBilling(),
    []
  );
}

export function useQuotas(params?: {
  region?: string;
  resourceType?: string;
}) {
  return useApi(
    () => apiClient.getQuotas(params),
    [params?.region, params?.resourceType]
  );
}

// Hook for mutations (POST, PUT, DELETE)
export function useApiMutation<T, P>(
  mutationFn: (params: P) => Promise<{ data: T; message?: string; error?: string }>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (params: P) => {
    try {
      setLoading(true);
      setError(null);
      const response = await mutationFn(params);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mutationFn]);

  return {
    mutate,
    loading,
    error,
  };
}