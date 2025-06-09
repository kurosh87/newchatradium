'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Copy, 
  ExternalLink, 
  Play, 
  Settings, 
  Star, 
  CheckCircle, 
  Info,
  Brain,
  Sparkles,
  Zap,
  Code,
  Globe,
  Activity,
  Server,
  Cpu,
  Database,
  Eye,
  Shield,
  FileText,
  Download
} from 'lucide-react';
import Link from 'next/link';

// Mock model data - matches the data from models page
const modelData = {
  'deepseek-r1': {
    id: 'deepseek-r1',
    name: 'DeepSeek-R1-0528',
    provider: 'DeepSeek AI',
    category: 'text-generation',
    description: 'A strong Mixture-of-Experts (MoE) language model with 671B total parameters with 37B activated for each token from Deepseek.',
    longDescription: 'The DeepSeek R1 model has undergone a minor version upgrade, with the current version being DeepSeek-R1-0528. This is a powerful language model designed for complex reasoning tasks and code generation.',
    features: ['Text Generation', 'Code Generation', 'Reasoning'],
    pricing: { input: '$3.00', output: '$24.00', unit: 'per 1M tokens' },
    context: '64K tokens',
    logo: '🧠',
    popular: true,
    featured: true,
    capabilities: ['LLM', 'Dedicated GPU', 'Fine-tunable'],
    performance: { latency: '~250ms', throughput: '78 tokens/s' },
    popularity: 4.8,
    deployments: '1.5K',
    gpuType: 'H100',
    vram: '80GB',
    state: 'Ready',
    kind: 'Base model',
    huggingFace: 'Visit Link',
    specification: {
      calibrated: 'No',
      mixtureOfExperts: 'No',
      parameters: '685B'
    },
    supportedFunctionality: {
      fineTuning: 'Supported',
      serverless: 'Supported',
      serverlessLoRA: 'Not supported',
      contextLength: '128k tokens',
      functionCalling: 'Supported'
    }
  },
  'qwen3-235b': {
    id: 'qwen3-235b',
    name: 'Qwen3-235B-A22B',
    provider: 'Alibaba',
    category: 'text-generation',
    description: 'Qwen3 is the latest generation of large language models in Qwen series, offering a comprehensive suite of dense language models.',
    longDescription: 'Qwen3-235B is a large-scale language model with exceptional performance across various tasks including text generation, reasoning, and multilingual understanding.',
    features: ['Text Generation', 'Multilingual', 'Long Context'],
    pricing: { input: '$1.50', output: '$1.50', unit: 'per 1M tokens' },
    context: '128K tokens',
    logo: '🔮',
    popular: true,
    featured: true,
    capabilities: ['LLM', 'Multi-GPU'],
    performance: { latency: '~350ms', throughput: '65 tokens/s' },
    popularity: 4.9,
    deployments: '1.8K',
    gpuType: 'H100',
    vram: '8x80GB',
    state: 'Ready',
    kind: 'Base model',
    huggingFace: 'Visit Link',
    specification: {
      calibrated: 'No',
      mixtureOfExperts: 'No',
      parameters: '235B'
    },
    supportedFunctionality: {
      fineTuning: 'Supported',
      serverless: 'Supported',
      serverlessLoRA: 'Not supported',
      contextLength: '128k tokens',
      functionCalling: 'Supported'
    }
  }
};

export default function ModelDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const modelId = params.id as string;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col h-full bg-background">
        <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2 border-b">
          <SidebarToggle />
          <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const model = modelData[modelId as keyof typeof modelData];

  if (!model) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-muted/20 font-sans">
        <header className="flex sticky top-0 bg-background/95 backdrop-blur-sm py-1.5 items-center px-2 md:px-2 gap-2 border-b border-border/40">
          <SidebarToggle />
          <h1 className="text-lg font-semibold tracking-tight">Model Not Found</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Model Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested model could not be found.</p>
            <Button onClick={() => router.push('/deploy/models')}>
              Back to Models
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-muted/20 font-sans">
      <header className="flex sticky top-0 bg-background/95 backdrop-blur-sm py-1.5 items-center px-2 md:px-2 gap-2 border-b border-border/40">
        <SidebarToggle />
        <div className="flex items-center gap-2">
          <Link href="/deploy/models" className="text-lg font-semibold tracking-tight hover:text-muted-foreground transition-colors">
            Model Library
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-lg font-semibold tracking-tight">{model.provider}</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-lg font-semibold tracking-tight">{model.name}</span>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4 md:p-6 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_50%_50%,_theme(colors.purple.500),transparent_50%)] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative">
          {/* Model Header */}
          <div className="mb-8">
            <Card className="border border-border/60 shadow-sm bg-gradient-to-br from-violet-50/50 via-purple-50/30 to-blue-50/30 dark:from-violet-950/30 dark:via-purple-950/20 dark:to-blue-950/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-border/30">
                      <span className="text-2xl">{model.logo}</span>
                    </div>
                    <div>
                      <h1 className="text-2xl font-semibold tracking-tight mb-1">{model.name}</h1>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="font-medium">{model.provider}</Badge>
                        <Badge variant="secondary" className="font-medium">LLM</Badge>
                        <Badge variant="secondary" className="font-medium">Serverless</Badge>
                        <Badge variant="secondary" className="font-medium">Tunable</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="font-medium">{model.state}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span className="font-medium">{model.kind}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ExternalLink className="h-4 w-4" />
                          <span className="font-medium">{model.huggingFace}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="font-medium">
                      <Play className="h-4 w-4 mr-2" />
                      Try
                    </Button>
                    <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 font-medium">
                      Deploy on Demand
                    </Button>
                    <Button 
                      variant="outline" 
                      className="font-medium"
                      onClick={() => router.push(`/deploy/fine-tuning/create?model=${model.id}`)}
                    >
                      Fine-tune
                    </Button>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed max-w-4xl">
                  {model.longDescription}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Features */}
              <Card className="border border-border/60 shadow-sm bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold tracking-tight flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <Globe className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Serverless API</h3>
                        <p className="text-sm text-muted-foreground">
                          {model.name} is available via Fireworks' serverless API, where you pay per token. There are several ways to call the Fireworks API, including Fireworks' Python client, the REST API, or OpenAI's Python client.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                        <Settings className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Fine-tuning</h3>
                        <p className="text-sm text-muted-foreground">
                          {model.name} can be fine-tuned on your data to create a model with better response quality. Fireworks uses low-rank adaptation (LoRA) to train a model that can be served efficiently at inference time.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                        <Server className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">On-demand Deployments</h3>
                        <p className="text-sm text-muted-foreground">
                          On-demand deployments allow you to use {model.name} on dedicated GPUs with Fireworks' high-performance serving stack with high reliability and no rate limits.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Available Serverless */}
              <Card className="border border-border/60 shadow-sm bg-card/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold tracking-tight">Available Serverless</CardTitle>
                    <CardDescription>Run queries immediately, pay only for usage</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">${model.pricing.output}</div>
                    <div className="text-sm text-muted-foreground">Per 1M Tokens</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="python" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="python">Python</TabsTrigger>
                      <TabsTrigger value="typescript">Typescript</TabsTrigger>
                      <TabsTrigger value="java">Java</TabsTrigger>
                      <TabsTrigger value="go">Go</TabsTrigger>
                      <TabsTrigger value="shell">Shell</TabsTrigger>
                      <TabsTrigger value="chat">Chat</TabsTrigger>
                      <TabsTrigger value="completion">Completion</TabsTrigger>
                    </TabsList>
                    <TabsContent value="python" className="mt-4">
                      <div className="relative">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="absolute top-2 right-2 h-8 w-8 p-0"
                          onClick={() => {
                            const code = `import requests
import json

url = "https://api.fireworks.ai/inference/v1/chat/completions"

payload = {
    "model": "accounts/fireworks/models/${model.id}",
    "max_tokens": 16384,
    "top_p": 1,
    "top_k": 40,
    "presence_penalty": 0,
    "frequency_penalty": 0,
    "temperature": 0.6,
    "messages": [
        {
            "role": "user",
            "content": "Hello, how are you?"
        }
    ]
}
headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": "Bearer <API_KEY>"
}

requests.request("POST", url, headers=headers, data=json.dumps(payload))`;
                            navigator.clipboard.writeText(code);
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <pre className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg text-sm overflow-x-auto">
                          <code>{`import requests
import json

url = "https://api.fireworks.ai/inference/v1/chat/completions"

payload = {
    "model": "accounts/fireworks/models/${model.id}",
    "max_tokens": 16384,
    "top_p": 1,
    "top_k": 40,
    "presence_penalty": 0,
    "frequency_penalty": 0,
    "temperature": 0.6,
    "messages": [
        {
            "role": "user",
            "content": "Hello, how are you?"
        }
    ]
}
headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": "Bearer <API_KEY>"
}

requests.request("POST", url, headers=headers, data=json.dumps(payload))`}</code>
                        </pre>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Metadata Card */}
              <Card className="border border-border/60 shadow-sm bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold tracking-tight">Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">State</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-sm font-medium">{model.state}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Created on</span>
                      <span className="text-sm font-medium">12/30/2024</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Kind</span>
                      <span className="text-sm font-medium">{model.kind}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Provider</span>
                      <span className="text-sm font-medium">{model.provider}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Hugging Face</span>
                      <Button variant="link" className="p-0 h-auto text-sm font-medium">
                        {model.huggingFace}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Specification Card */}
              <Card className="border border-border/60 shadow-sm bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold tracking-tight">Specification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Calibrated</span>
                      <span className="text-sm font-medium">{model.specification.calibrated}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Mixture-of-Experts</span>
                      <span className="text-sm font-medium">{model.specification.mixtureOfExperts}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Parameters</span>
                      <span className="text-sm font-medium">{model.specification.parameters}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Supported Functionality Card */}
              <Card className="border border-border/60 shadow-sm bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold tracking-tight">Supported Functionality</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Fine-tuning</span>
                      <span className="text-sm font-medium text-green-600">{model.supportedFunctionality.fineTuning}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Serverless</span>
                      <span className="text-sm font-medium text-green-600">{model.supportedFunctionality.serverless}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Serverless LoRA</span>
                      <span className="text-sm font-medium text-gray-500">{model.supportedFunctionality.serverlessLoRA}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Context Length</span>
                      <span className="text-sm font-medium">{model.supportedFunctionality.contextLength}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Function Calling</span>
                      <span className="text-sm font-medium text-green-600">{model.supportedFunctionality.functionCalling}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}