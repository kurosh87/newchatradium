// Mock data generators for the deployment platform
import { nanoid } from 'nanoid';
import type { 
  Model, 
  Deployment, 
  ApiKey, 
  UsageMetric, 
  Dataset, 
  FineTuningJob,
  BillingAccount,
  Quota
} from './db/schema';

// Mock Models Catalog
export const mockModels: (Omit<Model, 'createdAt'> & { createdAt: string })[] = [
  {
    id: 'deepseek-r1-0528',
    name: 'DeepSeek-R1-0528',
    provider: 'DeepSeek AI',
    category: 'text-generation',
    description: 'The DeepSeek R1 model has undergone a minor version upgrade, with the current version being DeepSeek-R1-0528.',
    inputPrice: '3.000',
    outputPrice: '24.000',
    contextLength: '64K tokens',
    capabilities: ['LLM', 'Dedicated GPU', 'Fine-tunable'],
    performance: { latency: '~250ms', throughput: '78 tokens/s' },
    gpuRequirements: { type: 'H100', vram: '80GB', count: 1 },
    featured: true,
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'qwen3-235b',
    name: 'Qwen3-235B-A22B',
    provider: 'Alibaba',
    category: 'text-generation',
    description: 'Qwen3 is the latest generation of large language models in Qwen series, offering a comprehensive suite of dense language models.',
    inputPrice: '0.220',
    outputPrice: '0.860',
    contextLength: '128K tokens',
    capabilities: ['LLM', 'Multi-GPU'],
    performance: { latency: '~350ms', throughput: '65 tokens/s' },
    gpuRequirements: { type: 'H100', vram: '8x80GB', count: 8 },
    featured: true,
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'qwen3-30b',
    name: 'Qwen3-30B-A3B',
    provider: 'Alibaba',
    category: 'text-generation',
    description: 'Qwen3 is the latest generation of large language models in Qwen series, offering a comprehensive suite of dense language models.',
    inputPrice: '0.150',
    outputPrice: '0.860',
    contextLength: '32K tokens',
    capabilities: ['LLM', 'Dedicated GPU'],
    performance: { latency: '~200ms', throughput: '85 tokens/s' },
    gpuRequirements: { type: 'H100', vram: '80GB', count: 1 },
    featured: true,
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'llama-4-maverick',
    name: 'Llama 4 Maverick Instruct (Basic)',
    provider: 'Meta',
    category: 'text-generation',
    description: 'Latest Llama 4 model with improved reasoning and instruction following capabilities.',
    inputPrice: '0.220',
    outputPrice: '0.860',
    contextLength: '1M tokens',
    capabilities: ['LLM', 'Vision', 'Dedicated GPU'],
    performance: { latency: '~180ms', throughput: '92 tokens/s' },
    gpuRequirements: { type: 'A100', vram: '80GB', count: 1 },
    featured: true,
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'llama-4-scout',
    name: 'Llama 4 Scout Instruct (Basic)',
    provider: 'Meta',
    category: 'text-generation',
    description: 'Optimized version of Llama 4 for faster inference and lower cost.',
    inputPrice: '0.150',
    outputPrice: '0.860',
    contextLength: '1M tokens',
    capabilities: ['LLM', 'Vision', 'Dedicated GPU'],
    performance: { latency: '~160ms', throughput: '98 tokens/s' },
    gpuRequirements: { type: 'A100', vram: '80GB', count: 1 },
    featured: false,
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'llama-3.1-405b',
    name: 'Llama 3.1 405B Instruct',
    provider: 'Meta',
    category: 'text-generation',
    description: 'Massive 405B parameter model for complex reasoning tasks.',
    inputPrice: '3.000',
    outputPrice: '15.000',
    contextLength: '128K tokens',
    capabilities: ['LLM', 'Multi-GPU Cluster'],
    performance: { latency: '~800ms', throughput: '45 tokens/s' },
    gpuRequirements: { type: 'H100', vram: '8x80GB', count: 8 },
    featured: true,
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
  }
];

// Generate mock deployments
export function generateMockDeployments(userId: string, count: number = 5): (Omit<Deployment, 'createdAt' | 'updatedAt' | 'lastActiveAt'> & { 
  createdAt: string; 
  updatedAt: string; 
  lastActiveAt: string | null; 
})[] {
  const statuses: Deployment['status'][] = ['active', 'deploying', 'failed', 'stopped'];
  const deployments = [];

  for (let i = 0; i < count; i++) {
    const model = mockModels[Math.floor(Math.random() * mockModels.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const id = nanoid();
    
    deployments.push({
      id,
      userId,
      name: `radium/${model.name.toLowerCase().replace(/\s+/g, '-')}`,
      modelId: model.id,
      status,
      endpointUrl: status === 'active' ? `https://api.radium.ai/v1/models/${model.id}` : null,
      configuration: {
        acceleratorType: (model.gpuRequirements as any)?.type || 'A100',
        acceleratorCount: (model.gpuRequirements as any)?.count || 1,
        autoScaling: true,
        minReplicas: 1,
        maxReplicas: 3,
      },
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      lastActiveAt: status === 'active' ? new Date(Date.now() - Math.random() * 2 * 60 * 60 * 1000).toISOString() : null,
      totalRequests: status === 'active' ? Math.floor(Math.random() * 50000) : 0,
      totalCost: status === 'active' ? (Math.random() * 500).toFixed(2) : '0.00',
    });
  }

  return deployments;
}

// Generate mock API keys
export function generateMockApiKeys(userId: string, count: number = 3): (Omit<ApiKey, 'createdAt' | 'lastUsedAt'> & { 
  createdAt: string; 
  lastUsedAt: string | null; 
})[] {
  const keys = [];
  const keyNames = ['Production API Key', 'Development API Key', 'Testing API Key', 'Staging API Key'];

  for (let i = 0; i < count; i++) {
    const id = nanoid();
    const keyPrefix = `sk-${Math.random() > 0.5 ? 'prod' : 'dev'}-${nanoid(8)}`;
    
    keys.push({
      id,
      userId,
      name: keyNames[i] || `API Key ${i + 1}`,
      keyHash: nanoid(32),
      keyPrefix,
      lastUsedAt: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : null,
      totalUsage: Math.floor(Math.random() * 100000),
      status: Math.random() > 0.2 ? ('active' as const) : ('revoked' as const),
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return keys;
}

// Generate mock datasets
export function generateMockDatasets(userId: string, count: number = 3): (Omit<Dataset, 'createdAt'> & { createdAt: string })[] {
  const datasets = [];
  const datasetNames = [
    'sample-finetune-data',
    'demo-gsm8k-math-dataset-1000',
    'custom-instruction-dataset',
    'code-generation-examples',
    'conversation-training-data',
  ];
  
  const descriptions = [
    'Sample dataset for fine-tuning experiments',
    'Mathematical reasoning dataset with grade school problems',
    'Custom instruction-following dataset for specific use cases',
    'Code generation examples for programming tasks',
    'Conversational AI training data',
  ];

  for (let i = 0; i < count; i++) {
    datasets.push({
      id: nanoid(),
      userId,
      name: datasetNames[i] || `dataset-${i + 1}`,
      description: descriptions[i] || 'Custom training dataset',
      filePath: `/datasets/${nanoid()}.jsonl`,
      format: Math.random() > 0.8 ? ('CSV' as const) : ('JSONL' as const),
      sizeBytes: Math.floor(Math.random() * 10000000) + 100000, // 100KB to 10MB
      exampleCount: Math.floor(Math.random() * 5000) + 100,
      status: Math.random() > 0.2 ? ('ready' as const) : ('processing' as const),
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return datasets;
}

// Generate mock fine-tuning jobs
export function generateMockFineTuningJobs(userId: string, datasetIds: string[], count: number = 4): (Omit<FineTuningJob, 'createdAt' | 'completedAt' | 'estimatedCompletion'> & { 
  createdAt: string; 
  completedAt: string | null;
  estimatedCompletion: string | null;
})[] {
  const jobs = [];
  const statuses: FineTuningJob['status'][] = ['pending', 'running', 'completed', 'failed'];
  const baseModels = ['llama-v3p1-8b-instruct', 'qwen3-30b-instruct', 'deepseek-r1-0528'];

  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const datasetId = datasetIds[Math.floor(Math.random() * datasetIds.length)];
    const progress = status === 'completed' ? 100 : status === 'running' ? Math.floor(Math.random() * 80) + 10 : 0;
    
    jobs.push({
      id: nanoid(),
      userId,
      name: `ft-${nanoid(8)}-${nanoid(5)}`,
      baseModel: baseModels[Math.floor(Math.random() * baseModels.length)],
      datasetId,
      status,
      progress,
      estimatedCompletion: status === 'running' ? new Date(Date.now() + Math.random() * 2 * 60 * 60 * 1000).toISOString() : null,
      cost: status === 'completed' ? (Math.random() * 50 + 5).toFixed(2) : status === 'running' ? (Math.random() * 20).toFixed(2) : '0.00',
      configuration: {
        learningRate: 0.0001,
        batchSize: 16,
        epochs: 3,
      },
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      completedAt: status === 'completed' ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : null,
    });
  }

  return jobs;
}

// Generate usage metrics for analytics
export function generateUsageMetrics(deploymentIds: string[], apiKeyIds: string[], hours: number = 24): (Omit<UsageMetric, 'timestamp'> & { timestamp: string })[] {
  const metrics = [];
  const statusOptions: UsageMetric['status'][] = ['success', 'error'];

  for (let hour = 0; hour < hours; hour++) {
    const timestamp = new Date(Date.now() - hour * 60 * 60 * 1000).toISOString();
    
    // Generate multiple metrics per hour
    for (let i = 0; i < Math.floor(Math.random() * 10); i++) {
      const deploymentId = deploymentIds[Math.floor(Math.random() * deploymentIds.length)];
      const apiKeyId = apiKeyIds[Math.floor(Math.random() * apiKeyIds.length)];
      const status = Math.random() > 0.05 ? ('success' as const) : ('error' as const); // 5% error rate
      const inputTokens = Math.floor(Math.random() * 1000) + 10;
      const outputTokens = Math.floor(Math.random() * 2000) + 50;
      
      metrics.push({
        id: nanoid(),
        deploymentId,
        apiKeyId,
        timestamp,
        requestCount: 1,
        tokenCount: inputTokens + outputTokens,
        inputTokens,
        outputTokens,
        cost: ((inputTokens * 0.0015 + outputTokens * 0.002) / 1000).toFixed(4),
        latencyMs: Math.floor(Math.random() * 500) + 100,
        status,
      });
    }
  }

  return metrics;
}

// Generate billing account
export function generateMockBillingAccount(userId: string): Omit<BillingAccount, 'createdAt'> & { createdAt: string } {
  return {
    id: nanoid(),
    userId,
    paymentMethodId: null, // No payment method set initially
    spendingLimit: '50.00',
    currentSpend: (Math.random() * 25).toFixed(2), // Some usage but under limit
    billingTier: 'tier1',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

// Generate quotas
export function generateMockQuotas(userId: string): (Omit<Quota, 'updatedAt'> & { updatedAt: string })[] {
  const regions = ['ap-tokyo-1', 'us-west-2', 'eu-west-1'];
  const gpuTypes = ['H100', 'A100', 'V100'];
  const quotas: any[] = [];

  regions.forEach((region) => {
    gpuTypes.forEach((gpuType) => {
      quotas.push({
        id: nanoid(),
        userId,
        name: `${region.toUpperCase()} - ${gpuType} Count`,
        quotaId: `${region}--${gpuType.toLowerCase()}-count`,
        value: Math.floor(Math.random() * 5), // Current usage
        maxValue: Math.floor(Math.random() * 20) + 10, // Max available
        region,
        resourceType: gpuType,
        updatedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      });
    });
  });

  return quotas;
}

// Utility function to format file sizes
export function formatFileSize(bytes: number): string {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

// Utility function to format relative time
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSeconds < 60) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
}