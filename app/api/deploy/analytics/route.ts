import { NextRequest, NextResponse } from 'next/server';
import { generateUsageMetrics, generateMockDeployments, generateMockApiKeys } from '@/lib/mock-data';

// GET /api/deploy/analytics - Get usage analytics
export async function GET(request: NextRequest) {
  try {
    const userId = 'mock-user-id';
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '24h';
    const metric = searchParams.get('metric') || 'requests';

    // Generate mock data
    const deployments = generateMockDeployments(userId, 5);
    const apiKeys = generateMockApiKeys(userId, 3);
    
    // Calculate hours based on timeframe
    const hours = timeframe === '1h' ? 1 : 
                  timeframe === '24h' ? 24 : 
                  timeframe === '7d' ? 168 : 
                  timeframe === '30d' ? 720 : 24;

    const deploymentIds = deployments.map(d => d.id);
    const apiKeyIds = apiKeys.map(k => k.id);
    
    // Generate usage metrics
    const metrics = generateUsageMetrics(deploymentIds, apiKeyIds, hours);

    // Process metrics based on timeframe
    const chartData = processMetricsForChart(metrics, timeframe);
    const summary = calculateSummary(metrics);
    const topModels = calculateTopModels(metrics, deployments);
    const errorAnalysis = calculateErrorAnalysis(metrics);

    return NextResponse.json({
      data: {
        summary,
        chartData,
        topModels,
        errorAnalysis,
        timeframe,
        metric,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function processMetricsForChart(metrics: any[], timeframe: string) {
  const now = new Date();
  let bucketSize: number;
  let buckets: number;
  
  switch (timeframe) {
    case '1h':
      bucketSize = 5 * 60 * 1000; // 5 minutes
      buckets = 12;
      break;
    case '24h':
      bucketSize = 60 * 60 * 1000; // 1 hour
      buckets = 24;
      break;
    case '7d':
      bucketSize = 24 * 60 * 60 * 1000; // 1 day
      buckets = 7;
      break;
    case '30d':
      bucketSize = 24 * 60 * 60 * 1000; // 1 day
      buckets = 30;
      break;
    default:
      bucketSize = 60 * 60 * 1000;
      buckets = 24;
  }

  const chartData = [];
  
  for (let i = buckets - 1; i >= 0; i--) {
    const bucketStart = new Date(now.getTime() - i * bucketSize);
    const bucketEnd = new Date(now.getTime() - (i - 1) * bucketSize);
    
    const bucketMetrics = metrics.filter(m => {
      const timestamp = new Date(m.timestamp);
      return timestamp >= bucketStart && timestamp < bucketEnd;
    });
    
    const successMetrics = bucketMetrics.filter(m => m.status === 'success');
    const errorMetrics = bucketMetrics.filter(m => m.status === 'error');
    
    chartData.push({
      time: formatTimeLabel(bucketStart, timeframe),
      timestamp: bucketStart.toISOString(),
      requests: successMetrics.length,
      errors: errorMetrics.length,
      tokens: bucketMetrics.reduce((sum, m) => sum + m.tokenCount, 0),
      inputTokens: bucketMetrics.reduce((sum, m) => sum + m.inputTokens, 0),
      outputTokens: bucketMetrics.reduce((sum, m) => sum + m.outputTokens, 0),
      cost: bucketMetrics.reduce((sum, m) => sum + parseFloat(m.cost), 0),
      avgLatency: bucketMetrics.length > 0 
        ? Math.round(bucketMetrics.reduce((sum, m) => sum + (m.latencyMs || 0), 0) / bucketMetrics.length)
        : 0,
      p95Latency: calculatePercentile(bucketMetrics.map(m => m.latencyMs || 0), 95),
      ttft: Math.round(Math.random() * 500 + 100), // Mock TTFT
    });
  }
  
  return chartData;
}

function formatTimeLabel(date: Date, timeframe: string): string {
  switch (timeframe) {
    case '1h':
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    case '24h':
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    case '7d':
    case '30d':
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    default:
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
}

function calculateSummary(metrics: any[]) {
  const successMetrics = metrics.filter(m => m.status === 'success');
  const errorMetrics = metrics.filter(m => m.status === 'error');
  const totalRequests = metrics.length;
  const totalTokens = metrics.reduce((sum, m) => sum + m.tokenCount, 0);
  const totalCost = metrics.reduce((sum, m) => sum + parseFloat(m.cost), 0);
  const avgLatency = metrics.length > 0 
    ? Math.round(metrics.reduce((sum, m) => sum + (m.latencyMs || 0), 0) / metrics.length)
    : 0;

  return {
    totalRequests: totalRequests.toLocaleString(),
    successRequests: successMetrics.length.toLocaleString(),
    errorRequests: errorMetrics.length.toLocaleString(),
    errorRate: totalRequests > 0 ? ((errorMetrics.length / totalRequests) * 100).toFixed(2) + '%' : '0%',
    totalTokens: totalTokens.toLocaleString(),
    inputTokens: metrics.reduce((sum, m) => sum + m.inputTokens, 0).toLocaleString(),
    outputTokens: metrics.reduce((sum, m) => sum + m.outputTokens, 0).toLocaleString(),
    totalCost: `$${totalCost.toFixed(4)}`,
    avgLatency: `${avgLatency}ms`,
    p95Latency: `${calculatePercentile(metrics.map(m => m.latencyMs || 0), 95)}ms`,
  };
}

function calculateTopModels(metrics: any[], deployments: any[]) {
  const modelUsage = new Map();
  
  metrics.forEach(metric => {
    const deployment = deployments.find(d => d.id === metric.deploymentId);
    if (deployment) {
      const modelId = deployment.modelId;
      if (!modelUsage.has(modelId)) {
        modelUsage.set(modelId, {
          modelId,
          modelName: deployment.name,
          requests: 0,
          tokens: 0,
          cost: 0,
        });
      }
      
      const usage = modelUsage.get(modelId);
      usage.requests++;
      usage.tokens += metric.tokenCount;
      usage.cost += parseFloat(metric.cost);
    }
  });
  
  return Array.from(modelUsage.values())
    .sort((a, b) => b.requests - a.requests)
    .slice(0, 5)
    .map(usage => ({
      ...usage,
      requests: usage.requests.toLocaleString(),
      tokens: usage.tokens.toLocaleString(),
      cost: `$${usage.cost.toFixed(4)}`,
    }));
}

function calculateErrorAnalysis(metrics: any[]) {
  const errorMetrics = metrics.filter(m => m.status === 'error');
  const totalErrors = errorMetrics.length;
  
  // Mock error categories
  const errorTypes = [
    { type: 'Rate Limit', count: Math.floor(totalErrors * 0.4) },
    { type: 'Model Overload', count: Math.floor(totalErrors * 0.3) },
    { type: 'Invalid Request', count: Math.floor(totalErrors * 0.2) },
    { type: 'Service Unavailable', count: Math.floor(totalErrors * 0.1) },
  ];
  
  return {
    totalErrors,
    errorTypes: errorTypes.map(error => ({
      ...error,
      percentage: totalErrors > 0 ? ((error.count / totalErrors) * 100).toFixed(1) + '%' : '0%',
    })),
    recentErrors: errorMetrics.slice(0, 10).map(metric => ({
      timestamp: new Date(metric.timestamp).toLocaleString(),
      deploymentId: metric.deploymentId,
      error: 'Rate limit exceeded', // Mock error message
    })),
  };
}

function calculatePercentile(values: number[], percentile: number): number {
  if (values.length === 0) return 0;
  
  const sorted = values.sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[index] || 0;
}