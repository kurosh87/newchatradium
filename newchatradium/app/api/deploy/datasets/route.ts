import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { generateMockDatasets, formatRelativeTime, formatFileSize } from '@/lib/mock-data';

// GET /api/deploy/datasets - List datasets
export async function GET(request: NextRequest) {
  try {
    const userId = 'mock-user-id';
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const format = searchParams.get('format');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Generate mock datasets
    let datasets = generateMockDatasets(userId, 10);

    // Filter by status if provided
    if (status && status !== 'all') {
      datasets = datasets.filter(dataset => dataset.status === status);
    }

    // Filter by format if provided
    if (format && format !== 'all') {
      datasets = datasets.filter(dataset => dataset.format === format);
    }

    // Apply pagination
    const paginatedDatasets = datasets.slice(offset, offset + limit);

    // Format response with additional computed fields
    const response = paginatedDatasets.map(dataset => ({
      ...dataset,
      sizeFormatted: formatFileSize(dataset.sizeBytes || 0),
      exampleCountFormatted: (dataset.exampleCount || 0).toLocaleString(),
      createdFormatted: formatRelativeTime(dataset.createdAt),
      statusIcon: dataset.status === 'ready' ? 'CheckCircle' :
                 dataset.status === 'processing' ? 'Activity' : 'AlertCircle',
    }));

    return NextResponse.json({
      data: response,
      pagination: {
        total: datasets.length,
        limit,
        offset,
        hasMore: offset + limit < datasets.length,
      },
    });
  } catch (error) {
    console.error('Error fetching datasets:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/deploy/datasets - Create new dataset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = 'mock-user-id';
    
    const { name, description, format, file } = body;
    if (!name || !format) {
      return NextResponse.json(
        { error: 'Missing required fields: name, format' },
        { status: 400 }
      );
    }

    // Validate format
    if (!['JSONL', 'CSV', 'TSV'].includes(format)) {
      return NextResponse.json(
        { error: 'Invalid format. Must be JSONL, CSV, or TSV' },
        { status: 400 }
      );
    }

    // Create new dataset
    const dataset = {
      id: nanoid(),
      userId,
      name,
      description: description || '',
      filePath: file ? `/datasets/${nanoid()}.${format.toLowerCase()}` : null,
      format: format as 'JSONL' | 'CSV' | 'TSV',
      sizeBytes: file ? Math.floor(Math.random() * 5000000) + 100000 : 0, // Mock file size
      exampleCount: file ? Math.floor(Math.random() * 2000) + 100 : 0, // Mock example count
      status: 'processing' as const,
      createdAt: new Date().toISOString(),
    };

    // Simulate processing - move to ready after a delay
    setTimeout(() => {
      console.log(`Dataset ${dataset.id} processing completed`);
    }, 3000);

    return NextResponse.json({
      data: {
        ...dataset,
        sizeFormatted: formatFileSize(dataset.sizeBytes || 0),
        exampleCountFormatted: (dataset.exampleCount || 0).toLocaleString(),
        createdFormatted: 'Just now',
        statusIcon: 'Activity',
      },
      message: 'Dataset created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating dataset:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}