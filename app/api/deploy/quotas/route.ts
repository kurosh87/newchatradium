import { NextRequest, NextResponse } from 'next/server';
import { generateMockQuotas, formatRelativeTime } from '@/lib/mock-data';

// GET /api/deploy/quotas - Get quota information
export async function GET(request: NextRequest) {
  try {
    const userId = 'mock-user-id';
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const resourceType = searchParams.get('resourceType');

    // Generate mock quotas
    let quotas = generateMockQuotas(userId);

    // Filter by region if provided
    if (region && region !== 'all') {
      quotas = quotas.filter(quota => quota.region === region);
    }

    // Filter by resource type if provided
    if (resourceType && resourceType !== 'all') {
      quotas = quotas.filter(quota => quota.resourceType === resourceType);
    }

    // Format response with additional computed fields
    const response = quotas.map(quota => ({
      ...quota,
      usagePercentage: Math.round(((quota.value || 0) / (quota.maxValue || 1)) * 100),
      available: (quota.maxValue || 0) - (quota.value || 0),
      status: (quota.value || 0) >= (quota.maxValue || 1) ? 'exhausted' : 
              (quota.value || 0) / (quota.maxValue || 1) > 0.8 ? 'warning' : 'healthy',
      updatedFormatted: formatRelativeTime(quota.updatedAt),
    }));

    // Get unique regions and resource types for filtering
    const regions = [...new Set(quotas.map(q => q.region).filter(Boolean))];
    const resourceTypes = [...new Set(quotas.map(q => q.resourceType).filter(Boolean))];

    return NextResponse.json({
      data: response,
      filters: {
        regions,
        resourceTypes,
      },
      summary: {
        totalQuotas: quotas.length,
        exhaustedQuotas: response.filter(q => q.status === 'exhausted').length,
        warningQuotas: response.filter(q => q.status === 'warning').length,
        healthyQuotas: response.filter(q => q.status === 'healthy').length,
      },
    });
  } catch (error) {
    console.error('Error fetching quotas:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/deploy/quotas - Request quota increase
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = 'mock-user-id';
    
    const { quotaId, requestedValue, justification } = body;
    if (!quotaId || !requestedValue || !justification) {
      return NextResponse.json(
        { error: 'Missing required fields: quotaId, requestedValue, justification' },
        { status: 400 }
      );
    }

    // Validate requested value
    if (requestedValue <= 0) {
      return NextResponse.json(
        { error: 'Requested value must be positive' },
        { status: 400 }
      );
    }

    // Find the quota
    const quotas = generateMockQuotas(userId);
    const quota = quotas.find(q => q.quotaId === quotaId);
    
    if (!quota) {
      return NextResponse.json(
        { error: 'Quota not found' },
        { status: 404 }
      );
    }

    // Create quota increase request
    const request_id = `qir_${Math.random().toString(36).substr(2, 9)}`;
    
    // Simulate automatic approval for small increases
    const isAutoApproved = requestedValue <= quota.maxValue * 2;
    
    const quotaRequest = {
      id: request_id,
      quotaId,
      currentValue: quota.maxValue,
      requestedValue,
      justification,
      status: isAutoApproved ? 'approved' : 'pending',
      submittedAt: new Date().toISOString(),
      processedAt: isAutoApproved ? new Date().toISOString() : null,
      estimatedProcessingTime: isAutoApproved ? null : '1-2 business days',
    };

    return NextResponse.json({
      data: quotaRequest,
      message: isAutoApproved 
        ? 'Quota increase approved automatically'
        : 'Quota increase request submitted for review',
    }, { status: 201 });
  } catch (error) {
    console.error('Error requesting quota increase:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}