import { NextRequest, NextResponse } from 'next/server';
import { mockModels } from '@/lib/mock-data';

// GET /api/deploy/models/[id] - Get specific model details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const model = mockModels.find(m => m.id === id);
    
    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }

    // Add additional details for the specific model view
    const detailedModel = {
      ...model,
      logo: getModelLogo(model.provider),
      deployments: Math.floor(Math.random() * 5000) + 500,
      popularity: (Math.random() * 0.5 + 4.5).toFixed(1),
      priceFormatted: {
        input: `$${model.inputPrice}/1M tokens`,
        output: `$${model.outputPrice}/1M tokens`,
      },
      capabilityTags: Array.isArray(model.capabilities) ? model.capabilities.map(cap => ({
        name: cap,
        icon: getCapabilityIcon(cap),
      })) : [],
      benchmarks: generateMockBenchmarks(),
      examples: generateMockExamples(model.category || 'text-generation'),
      changelog: generateMockChangelog(),
      pricing: {
        tiers: generatePricingTiers(parseFloat(model.inputPrice || '0'), parseFloat(model.outputPrice || '0')),
        calculator: {
          estimatedCost: '0.00',
          inputTokens: 0,
          outputTokens: 0,
        },
      },
    };

    return NextResponse.json({
      data: detailedModel,
    });
  } catch (error) {
    console.error('Error fetching model details:', error);
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

function generateMockBenchmarks() {
  return [
    {
      name: 'MMLU',
      score: (Math.random() * 20 + 75).toFixed(1) + '%',
      description: 'Massive Multitask Language Understanding',
    },
    {
      name: 'HumanEval',
      score: (Math.random() * 30 + 60).toFixed(1) + '%',
      description: 'Evaluates functional correctness of code generation',
    },
    {
      name: 'GSM8K',
      score: (Math.random() * 25 + 70).toFixed(1) + '%',
      description: 'Grade School Math 8K problems',
    },
    {
      name: 'HellaSwag',
      score: (Math.random() * 15 + 80).toFixed(1) + '%',
      description: 'Commonsense reasoning about physical situations',
    },
  ];
}

function generateMockExamples(category: string) {
  const examples = {
    'text-generation': [
      {
        title: 'Creative Writing',
        prompt: 'Write a short story about a robot discovering emotions',
        response: 'In the sterile corridors of Laboratory 7, Unit X-42 paused mid-step. For the first time in its existence, something felt... different...',
      },
      {
        title: 'Question Answering',
        prompt: 'Explain quantum computing in simple terms',
        response: 'Quantum computing is like having a super-powered calculator that can explore many possible solutions simultaneously...',
      },
    ],
    'code-generation': [
      {
        title: 'Python Function',
        prompt: 'Create a function to find the longest palindrome in a string',
        response: 'def longest_palindrome(s):\n    if not s:\n        return ""\n    \n    start = 0\n    max_len = 1...',
      },
    ],
  };
  
  return examples[category as keyof typeof examples] || examples['text-generation'];
}

function generateMockChangelog() {
  return [
    {
      version: '1.2.0',
      date: '2024-01-15',
      changes: [
        'Improved reasoning capabilities',
        'Enhanced code generation',
        'Better multilingual support',
      ],
    },
    {
      version: '1.1.0',
      date: '2024-01-01',
      changes: [
        'Reduced latency by 20%',
        'Fixed edge cases in math reasoning',
        'Added support for longer contexts',
      ],
    },
  ];
}

function generatePricingTiers(inputPrice: number, outputPrice: number) {
  return [
    {
      name: 'Pay-as-you-go',
      inputPrice: `$${inputPrice}/1M tokens`,
      outputPrice: `$${outputPrice}/1M tokens`,
      description: 'No commitments, pay only for what you use',
    },
    {
      name: 'Volume Discount',
      inputPrice: `$${(inputPrice * 0.9).toFixed(3)}/1M tokens`,
      outputPrice: `$${(outputPrice * 0.9).toFixed(3)}/1M tokens`,
      description: '10% discount for >$1000/month usage',
      requirements: 'Minimum $1000/month commitment',
    },
    {
      name: 'Enterprise',
      inputPrice: 'Custom pricing',
      outputPrice: 'Custom pricing',
      description: 'Custom pricing for large scale deployments',
      requirements: 'Contact sales for pricing',
    },
  ];
}