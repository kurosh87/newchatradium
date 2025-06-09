import { NextRequest, NextResponse } from 'next/server';
import { mockModels } from '@/lib/mock-data';

// GET /api/deploy/models - Get models catalog
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const provider = searchParams.get('provider');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let filteredModels = mockModels.filter(model => model.active);

    // Apply filters
    if (category && category !== 'all') {
      filteredModels = filteredModels.filter(model => model.category === category);
    }

    if (provider && provider !== 'all') {
      filteredModels = filteredModels.filter(model => model.provider === provider);
    }

    if (featured === 'true') {
      filteredModels = filteredModels.filter(model => model.featured);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredModels = filteredModels.filter(model =>
        model.name.toLowerCase().includes(searchLower) ||
        model.provider.toLowerCase().includes(searchLower) ||
        model.description?.toLowerCase().includes(searchLower)
      );
    }

    // Sort by featured first, then by name
    filteredModels.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.name.localeCompare(b.name);
    });

    // Apply pagination
    const paginatedModels = filteredModels.slice(offset, offset + limit);

    // Add computed fields for frontend
    const response = paginatedModels.map(model => ({
      ...model,
      logo: getModelLogo(model.provider),
      deployments: Math.floor(Math.random() * 5000) + 500, // Mock deployment count
      popularity: (Math.random() * 0.5 + 4.5).toFixed(1), // 4.5-5.0 rating
      priceFormatted: {
        input: `$${model.inputPrice}/1M tokens`,
        output: `$${model.outputPrice}/1M tokens`,
      },
      capabilityTags: Array.isArray(model.capabilities) ? model.capabilities.map(cap => ({
        name: cap,
        icon: getCapabilityIcon(cap),
      })) : [],
    }));

    // Get unique categories and providers for filtering
    const categories = [...new Set(mockModels.map(m => m.category).filter(Boolean))];
    const providers = [...new Set(mockModels.map(m => m.provider))];

    return NextResponse.json({
      data: response,
      filters: {
        categories,
        providers,
      },
      pagination: {
        total: filteredModels.length,
        limit,
        offset,
        hasMore: offset + limit < filteredModels.length,
      },
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getModelLogo(provider: string): string {
  const logos: Record<string, string> = {
    'DeepSeek AI': '🧠',
    'Alibaba': '🔮',
    'Meta': '🦙',
    'OpenAI': '🤖',
    'Anthropic': '🎭',
    'Google': '🏮',
  };
  return logos[provider] || '🔷';
}

function getCapabilityIcon(capability: string): string {
  const icons: Record<string, string> = {
    'LLM': 'Brain',
    'Vision': 'Eye',
    'Code': 'Code',
    'Dedicated GPU': 'Server',
    'Multi-GPU': 'Cpu',
    'Multi-GPU Cluster': 'Database',
    'Fine-tunable': 'Settings',
  };
  return icons[capability] || 'Star';
}