import { NextRequest, NextResponse } from 'next/server';
import { generateMockApiKeys, formatRelativeTime, generateUsageMetrics } from '@/lib/mock-data';

// GET /api/deploy/api-keys/[id] - Get specific API key details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = 'mock-user-id';

    // Find the API key
    const apiKeys = generateMockApiKeys(userId, 10);
    const apiKey = apiKeys.find(key => key.id === id);

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }

    // Generate usage metrics for this key
    const metrics = generateUsageMetrics(['mock-deployment-1'], [apiKey.id], 168); // 7 days

    // Calculate usage statistics
    const last24h = metrics.filter(m => 
      new Date(m.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000
    );
    const last7d = metrics.filter(m => 
      new Date(m.timestamp).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    );

    const response = {
      ...apiKey,
      keyMasked: `${apiKey.keyPrefix}...${apiKey.keyHash.slice(-8)}`,
      lastUsedFormatted: apiKey.lastUsedAt 
        ? formatRelativeTime(apiKey.lastUsedAt)
        : 'Never',
      createdFormatted: formatRelativeTime(apiKey.createdAt),
      usageFormatted: (apiKey.totalUsage || 0).toLocaleString(),
      analytics: {
        last24h: {
          requests: last24h.filter(m => m.status === 'success').length,
          errors: last24h.filter(m => m.status === 'error').length,
          tokens: last24h.reduce((sum, m) => sum + (m.tokenCount || 0), 0),
          cost: last24h.reduce((sum, m) => sum + parseFloat(m.cost || '0'), 0).toFixed(4),
        },
        last7d: {
          requests: last7d.filter(m => m.status === 'success').length,
          errors: last7d.filter(m => m.status === 'error').length,
          tokens: last7d.reduce((sum, m) => sum + (m.tokenCount || 0), 0),
          cost: last7d.reduce((sum, m) => sum + parseFloat(m.cost || '0'), 0).toFixed(4),
        },
        hourlyUsage: generateHourlyUsage(metrics),
      },
    };

    return NextResponse.json({ data: response });
  } catch (error) {
    console.error('Error fetching API key details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/deploy/api-keys/[id] - Update API key (rename)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const { name } = body;
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // In a real app, we'd update the database
    return NextResponse.json({
      data: {
        id,
        name,
        updatedAt: new Date().toISOString(),
      },
      message: 'API key updated successfully',
    });
  } catch (error) {
    console.error('Error updating API key:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/deploy/api-keys/[id] - Revoke API key
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // In a real app, we'd mark the key as revoked in the database
    // Simulate revocation delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      message: 'API key revoked successfully',
    });
  } catch (error) {
    console.error('Error revoking API key:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateHourlyUsage(metrics: any[]) {
  const hourlyData = [];
  
  for (let i = 23; i >= 0; i--) {
    const hourStart = new Date(Date.now() - i * 60 * 60 * 1000);
    const hourEnd = new Date(Date.now() - (i - 1) * 60 * 60 * 1000);
    
    const hourMetrics = metrics.filter(m => {
      const timestamp = new Date(m.timestamp);
      return timestamp >= hourStart && timestamp < hourEnd;
    });
    
    hourlyData.push({
      hour: hourStart.getHours(),
      requests: hourMetrics.filter(m => m.status === 'success').length,
      errors: hourMetrics.filter(m => m.status === 'error').length,
      tokens: hourMetrics.reduce((sum, m) => sum + (m.tokenCount || 0), 0),
      cost: hourMetrics.reduce((sum, m) => sum + parseFloat(m.cost || '0'), 0),
    });
  }
  
  return hourlyData;
}