import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { generateMockDeployments, mockModels, formatRelativeTime } from '@/lib/mock-data';

// GET /api/deploy/deployments - List all deployments
export async function GET(request: NextRequest) {
  try {
    // Mock user ID - in real app this would come from auth
    const userId = 'mock-user-id';
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Generate mock deployments
    let deployments = generateMockDeployments(userId, 8);

    // Filter by status if provided
    if (status && status !== 'all') {
      deployments = deployments.filter(d => d.status === status);
    }

    // Apply pagination
    const paginatedDeployments = deployments.slice(offset, offset + limit);

    // Format response with additional computed fields
    const response = paginatedDeployments.map(deployment => {
      const model = mockModels.find(m => m.id === deployment.modelId);
      return {
        ...deployment,
        model: model ? {
          name: model.name,
          provider: model.provider,
          category: model.category,
        } : null,
        lastActiveFormatted: deployment.lastActiveAt 
          ? formatRelativeTime(deployment.lastActiveAt)
          : 'Never',
        createdFormatted: formatRelativeTime(deployment.createdAt),
        statusIcon: deployment.status === 'active' ? 'CheckCircle' : 
                   deployment.status === 'deploying' ? 'Activity' : 
                   deployment.status === 'failed' ? 'AlertCircle' : 'Clock',
      };
    });

    return NextResponse.json({
      data: response,
      pagination: {
        total: deployments.length,
        limit,
        offset,
        hasMore: offset + limit < deployments.length,
      },
    });
  } catch (error) {
    console.error('Error fetching deployments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/deploy/deployments - Create new deployment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = 'mock-user-id'; // Mock user ID
    
    // Validate required fields
    const { modelId, name, configuration } = body;
    if (!modelId || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: modelId, name' },
        { status: 400 }
      );
    }

    // Check if model exists
    const model = mockModels.find(m => m.id === modelId);
    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }

    // Create new deployment
    const deployment = {
      id: nanoid(),
      userId,
      name,
      modelId,
      status: 'pending' as const,
      endpointUrl: null,
      configuration: configuration || {
        acceleratorType: (model.gpuRequirements as any)?.type || 'A100',
        acceleratorCount: (model.gpuRequirements as any)?.count || 1,
        autoScaling: true,
        minReplicas: 1,
        maxReplicas: 3,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastActiveAt: null,
      totalRequests: 0,
      totalCost: '0.00',
    };

    // Simulate deployment process - start as pending, then move to deploying
    setTimeout(() => {
      // This would normally trigger a background process
      // For demo purposes, we'll just log the status change
      console.log(`Deployment ${deployment.id} status changed to: deploying`);
    }, 1000);

    return NextResponse.json({
      data: {
        ...deployment,
        model: {
          name: model.name,
          provider: model.provider,
          category: model.category,
        },
        statusIcon: 'Clock',
        createdFormatted: 'Just now',
        lastActiveFormatted: 'Never',
      },
      message: 'Deployment created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating deployment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}