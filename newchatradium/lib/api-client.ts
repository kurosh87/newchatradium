// API client for the deployment platform
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/deploy') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data: T; message?: string; error?: string }> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Deployments API
  async getDeployments(params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());

    const query = searchParams.toString();
    return this.request(`/deployments${query ? `?${query}` : ''}`);
  }

  async getDeployment(id: string) {
    return this.request(`/deployments/${id}`);
  }

  async createDeployment(data: {
    modelId: string;
    name: string;
    configuration?: any;
  }) {
    return this.request('/deployments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDeployment(id: string, data: any) {
    return this.request(`/deployments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDeployment(id: string) {
    return this.request(`/deployments/${id}`, {
      method: 'DELETE',
    });
  }

  // Models API
  async getModels(params?: {
    category?: string;
    provider?: string;
    featured?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.provider) searchParams.append('provider', params.provider);
    if (params?.featured) searchParams.append('featured', params.featured.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());

    const query = searchParams.toString();
    return this.request(`/models${query ? `?${query}` : ''}`);
  }

  async getModel(id: string) {
    return this.request(`/models/${id}`);
  }

  // API Keys API
  async getApiKeys(params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());

    const query = searchParams.toString();
    return this.request(`/api-keys${query ? `?${query}` : ''}`);
  }

  async createApiKey(data: { name: string }) {
    return this.request('/api-keys', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateApiKey(id: string, data: { name: string }) {
    return this.request(`/api-keys/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteApiKey(id: string) {
    return this.request(`/api-keys/${id}`, {
      method: 'DELETE',
    });
  }

  // Fine-tuning API
  async getFineTuningJobs(params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());

    const query = searchParams.toString();
    return this.request(`/fine-tuning${query ? `?${query}` : ''}`);
  }

  async createFineTuningJob(data: {
    name: string;
    baseModel: string;
    datasetId: string;
    configuration?: any;
  }) {
    return this.request('/fine-tuning', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Datasets API
  async getDatasets(params?: {
    status?: string;
    format?: string;
    limit?: number;
    offset?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.format) searchParams.append('format', params.format);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());

    const query = searchParams.toString();
    return this.request(`/datasets${query ? `?${query}` : ''}`);
  }

  async createDataset(data: {
    name: string;
    description?: string;
    format: string;
    file?: any;
  }) {
    return this.request('/datasets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Analytics API
  async getAnalytics(params?: {
    timeframe?: string;
    metric?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.timeframe) searchParams.append('timeframe', params.timeframe);
    if (params?.metric) searchParams.append('metric', params.metric);

    const query = searchParams.toString();
    return this.request(`/analytics${query ? `?${query}` : ''}`);
  }

  // Billing API
  async getBilling() {
    return this.request('/billing');
  }

  async updateBilling(data: {
    action: string;
    [key: string]: any;
  }) {
    return this.request('/billing', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Quotas API
  async getQuotas(params?: {
    region?: string;
    resourceType?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.region) searchParams.append('region', params.region);
    if (params?.resourceType) searchParams.append('resourceType', params.resourceType);

    const query = searchParams.toString();
    return this.request(`/quotas${query ? `?${query}` : ''}`);
  }

  async requestQuotaIncrease(data: {
    quotaId: string;
    requestedValue: number;
    justification: string;
  }) {
    return this.request('/quotas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Hook for React components
export function useApiClient() {
  return apiClient;
}