import { NextRequest, NextResponse } from 'next/server';
import { generateMockDeployments, mockModels, formatRelativeTime, generateUsageMetrics } from '@/lib/mock-data';

// GET /api/deploy/deployments/[id] - Get specific deployment
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = 'mock-user-id';

    // Generate mock deployments to find the one we want
    const deployments = generateMockDeployments(userId, 10);
    const deployment = deployments.find(d => d.id === id);

    if (!deployment) {
      return NextResponse.json(
        { error: 'Deployment not found' },
        { status: 404 }
      );
    }

    const model = mockModels.find(m => m.id === deployment.modelId);

    // Generate some mock logs
    const logs = [
      {
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        level: 'info',
        message: 'Deployment health check passed',
      },
      {
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        level: 'info',
        message: 'Model loaded successfully',
      },
      {
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        level: 'info',
        message: 'GPU resources allocated',
      },
    ];

    // Generate usage metrics for the last 24 hours
    const metrics = generateUsageMetrics([deployment.id], ['mock-api-key'], 24);

    const response = {
      ...deployment,
      model: model ? {
        name: model.name,
        provider: model.provider,
        category: model.category,
        description: model.description,
        capabilities: model.capabilities,
        performance: model.performance,
        gpuRequirements: model.gpuRequirements,
      } : null,
      lastActiveFormatted: deployment.lastActiveAt 
        ? formatRelativeTime(deployment.lastActiveAt)
        : 'Never',
      createdFormatted: formatRelativeTime(deployment.createdAt),
      logs,
      metrics: {
        last24Hours: {
          requests: metrics.filter(m => m.status === 'success').length,
          errors: metrics.filter(m => m.status === 'error').length,
          avgLatency: Math.round(metrics.reduce((sum, m) => sum + (m.latencyMs || 0), 0) / metrics.length),
          totalCost: metrics.reduce((sum, m) => sum + parseFloat(m.cost || '0'), 0).toFixed(4),
        },
      },
    };

    return NextResponse.json({ data: response });
  } catch (error) {
    console.error('Error fetching deployment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/deploy/deployments/[id] - Update deployment
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const userId = 'mock-user-id';

    // In a real app, we'd update the database
    // For now, just return success with the updated data
    const { configuration, status } = body;

    // Simulate update delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      data: {
        id,
        userId,
        configuration,
        status,
        updatedAt: new Date().toISOString(),
      },
      message: 'Deployment updated successfully',
    });
  } catch (error) {
    console.error('Error updating deployment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/deploy/deployments/[id] - Delete deployment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Simulate deletion delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      message: 'Deployment deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting deployment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}