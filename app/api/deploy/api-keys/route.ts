import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { generateMockApiKeys, formatRelativeTime } from '@/lib/mock-data';
import { createHash } from 'crypto';

// GET /api/deploy/api-keys - List API keys
export async function GET(request: NextRequest) {
  try {
    const userId = 'mock-user-id';
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Generate mock API keys
    let apiKeys = generateMockApiKeys(userId, 5);

    // Filter by status if provided
    if (status && status !== 'all') {
      apiKeys = apiKeys.filter(key => key.status === status);
    }

    // Apply pagination
    const paginatedKeys = apiKeys.slice(offset, offset + limit);

    // Format response with masked keys and computed fields
    const response = paginatedKeys.map(key => ({
      ...key,
      keyMasked: `${key.keyPrefix}...${key.keyHash.slice(-8)}`,
      lastUsedFormatted: key.lastUsedAt 
        ? formatRelativeTime(key.lastUsedAt)
        : 'Never',
      createdFormatted: formatRelativeTime(key.createdAt),
      usageFormatted: (key.totalUsage || 0).toLocaleString(),
    }));

    return NextResponse.json({
      data: response,
      pagination: {
        total: apiKeys.length,
        limit,
        offset,
        hasMore: offset + limit < apiKeys.length,
      },
    });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/deploy/api-keys - Create new API key
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = 'mock-user-id';
    
    const { name } = body;
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Generate actual API key
    const keyId = nanoid();
    const keySecret = nanoid(32);
    const keyPrefix = `sk-${keyId.slice(0, 8)}`;
    const fullKey = `${keyPrefix}.${keySecret}`;
    const keyHash = createHash('sha256').update(fullKey).digest('hex');

    // Create API key record
    const apiKey = {
      id: keyId,
      userId,
      name,
      keyHash,
      keyPrefix,
      lastUsedAt: null,
      totalUsage: 0,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
    };

    // In a real app, we'd save this to the database
    // For demo, we'll just return the key with full visibility once
    return NextResponse.json({
      data: {
        ...apiKey,
        keyFull: fullKey, // Only shown once during creation
        keyMasked: `${keyPrefix}...${keyHash.slice(-8)}`,
        lastUsedFormatted: 'Never',
        createdFormatted: 'Just now',
        usageFormatted: '0',
      },
      message: 'API key created successfully',
      warning: 'This is the only time the full key will be shown. Please save it securely.',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating API key:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}