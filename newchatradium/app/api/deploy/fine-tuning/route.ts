import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { generateMockFineTuningJobs, generateMockDatasets, formatRelativeTime } from '@/lib/mock-data';

// GET /api/deploy/fine-tuning - List fine-tuning jobs
export async function GET(request: NextRequest) {
  try {
    const userId = 'mock-user-id';
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Generate mock datasets and jobs
    const datasets = generateMockDatasets(userId, 5);
    const datasetIds = datasets.map(d => d.id);
    let jobs = generateMockFineTuningJobs(userId, datasetIds, 8);

    // Filter by status if provided
    if (status && status !== 'all') {
      jobs = jobs.filter(job => job.status === status);
    }

    // Apply pagination
    const paginatedJobs = jobs.slice(offset, offset + limit);

    // Format response with additional computed fields
    const response = paginatedJobs.map(job => {
      const dataset = datasets.find(d => d.id === job.datasetId);
      return {
        ...job,
        dataset: dataset ? {
          name: dataset.name,
          exampleCount: dataset.exampleCount,
          format: dataset.format,
        } : null,
        createdFormatted: formatRelativeTime(job.createdAt),
        completedFormatted: job.completedAt ? formatRelativeTime(job.completedAt) : null,
        estimatedTimeFormatted: job.estimatedCompletion 
          ? `~${Math.ceil((new Date(job.estimatedCompletion).getTime() - Date.now()) / (1000 * 60))} min remaining`
          : null,
        statusIcon: job.status === 'completed' ? 'CheckCircle' :
                   job.status === 'running' ? 'Activity' :
                   job.status === 'failed' ? 'AlertCircle' : 'Clock',
      };
    });

    return NextResponse.json({
      data: response,
      pagination: {
        total: jobs.length,
        limit,
        offset,
        hasMore: offset + limit < jobs.length,
      },
    });
  } catch (error) {
    console.error('Error fetching fine-tuning jobs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/deploy/fine-tuning - Create new fine-tuning job
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = 'mock-user-id';
    
    const { name, baseModel, datasetId, configuration } = body;
    if (!name || !baseModel || !datasetId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, baseModel, datasetId' },
        { status: 400 }
      );
    }

    // Validate dataset exists (mock)
    const datasets = generateMockDatasets(userId, 10);
    const dataset = datasets.find(d => d.id === datasetId);
    if (!dataset) {
      return NextResponse.json(
        { error: 'Dataset not found' },
        { status: 404 }
      );
    }

    // Create new fine-tuning job
    const job = {
      id: nanoid(),
      userId,
      name,
      baseModel,
      datasetId,
      status: 'pending' as const,
      progress: 0,
      estimatedCompletion: new Date(Date.now() + Math.random() * 2 * 60 * 60 * 1000).toISOString(), // 0-2 hours
      cost: '0.00',
      configuration: configuration || {
        learningRate: 0.0001,
        batchSize: 16,
        epochs: 3,
        warmupSteps: 100,
      },
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    // Simulate job processing - start as pending, then move to running
    setTimeout(() => {
      console.log(`Fine-tuning job ${job.id} status changed to: running`);
    }, 2000);

    return NextResponse.json({
      data: {
        ...job,
        dataset: {
          name: dataset.name,
          exampleCount: dataset.exampleCount,
          format: dataset.format,
        },
        createdFormatted: 'Just now',
        completedFormatted: null,
        estimatedTimeFormatted: '~90 min remaining',
        statusIcon: 'Clock',
      },
      message: 'Fine-tuning job created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating fine-tuning job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}