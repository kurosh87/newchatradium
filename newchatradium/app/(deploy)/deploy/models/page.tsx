'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ExternalLink, Sparkles, Zap, Brain, Code, ArrowLeft, Eye, Star, Globe, Activity, Server, Cpu, Database, Filter, Grid3X3, List, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

// Enhanced mock model data with more details
const models = [
  {
    id: 'deepseek-r1',
    name: 'DeepSeek-R1-0528',
    provider: 'DeepSeek AI',
    category: 'text-generation',
    description: 'The DeepSeek R1 model has undergone a minor version upgrade, with the current version being DeepSeek-R1-0528.',
    features: ['Text Generation', 'Code Generation', 'Reasoning'],
    pricing: { input: '$3.00', output: '$24.00' },
    context: '64K tokens',
    icon: Brain,
    logo: '🧠',
    popular: true,
    featured: true,
    capabilities: ['LLM', 'Dedicated GPU', 'Fine-tunable'],
    performance: { latency: '~250ms', throughput: '78 tokens/s' },
    popularity: 4.8,
    deployments: '1.5K',
    gpuType: 'H100',
    vram: '80GB',
  },
  {
    id: 'qwen3-235b',
    name: 'Qwen3-235B-A22B',
    provider: 'Alibaba',
    category: 'text-generation',
    description: 'Qwen3 is the latest generation of large language models in Qwen series, offering a comprehensive suite of dense language models.',
    features: ['Text Generation', 'Multilingual', 'Long Context'],
    pricing: { input: '$1.50', output: '$1.50' },
    context: '128K tokens',
    icon: Sparkles,
    logo: '🔮',
    popular: true,
    featured: true,
    capabilities: ['LLM', 'Multi-GPU'],
    performance: { latency: '~350ms', throughput: '65 tokens/s' },
    popularity: 4.9,
    deployments: '1.8K',
    gpuType: 'H100',
    vram: '8x80GB',
  },
  {
    id: 'qwen3-30b',
    name: 'Qwen3-30B-A3B',
    provider: 'Alibaba',
    category: 'text-generation',
    description: 'Qwen3 is the latest generation of large language models in Qwen series, offering a comprehensive suite of dense language models.',
    features: ['Text Generation', 'Fast Inference', 'Cost Effective'],
    pricing: { input: '$1.50', output: '$1.50' },
    context: '32K tokens',
    icon: Zap,
    logo: '🔮',
    popular: false,
    featured: false,
    capabilities: ['LLM', 'Dedicated GPU'],
    performance: { latency: '~200ms', throughput: '85 tokens/s' },
    popularity: 4.8,
    deployments: '2.1K',
    gpuType: 'H100',
    vram: '80GB',
  },
  {
    id: 'qwen3-14b',
    name: 'Qwen3-14B',
    provider: 'Alibaba',
    category: 'text-generation',
    description: 'Qwen3 is the latest generation of large language models in Qwen series, offering a comprehensive suite of dense language models.',
    features: ['Text Generation', 'Efficient', 'Versatile'],
    pricing: { input: '$1.50', output: '$1.50' },
    context: '32K tokens',
    icon: Code,
    logo: '🔮',
    popular: false,
    featured: false,
    capabilities: ['LLM', 'Dedicated GPU'],
    performance: { latency: '~180ms', throughput: '92 tokens/s' },
    popularity: 4.7,
    deployments: '1.2K',
    gpuType: 'A100',
    vram: '80GB',
  },
  {
    id: 'deepseek-prover-v2',
    name: 'DeepSeek-Prover-V2-671B',
    provider: 'DeepSeek AI',
    category: 'text-generation',
    description: 'DeepSeek-Prover-V2, an open-source large language model designed for formal theorem proving in Lean 4.',
    features: ['Theorem Proving', 'Mathematical Reasoning', 'Formal Verification'],
    pricing: { input: '$0.50', output: '$1.50' },
    context: '128K tokens',
    icon: Brain,
    logo: '🧠',
    popular: false,
    featured: false,
    capabilities: ['LLM', 'Multi-GPU Cluster'],
    performance: { latency: '~800ms', throughput: '45 tokens/s' },
    popularity: 4.6,
    deployments: '800',
    gpuType: 'H100',
    vram: '8x80GB',
  },
];

export default function ModelsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredModels = models.filter((model) => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
      (selectedCategory === 'featured' && model.featured) ||
      (selectedCategory !== 'featured' && model.category === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-muted/20 font-sans">
      <header className="flex sticky top-0 z-[100] bg-gradient-to-r from-background/80 via-muted/40 to-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-gradient-to-r supports-[backdrop-filter]:from-background/60 supports-[backdrop-filter]:via-muted/20 supports-[backdrop-filter]:to-background/60 py-1.5 items-center px-2 md:px-2 gap-2 border-b border-border/60">
        <SidebarToggle />
        <h1 className="text-lg font-semibold tracking-tight">Model Library</h1>
        <Link href="/deploy/dashboard" className="hidden md:block order-4 md:ml-auto">
          <Button variant="outline" className="flex items-center gap-2 text-sm py-1.5 h-8 px-4 rounded-lg border-border/40 hover:border-border transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </header>
      
      <div className="flex-1 overflow-auto p-4 md:p-6 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_50%_50%,_theme(colors.purple.500),transparent_50%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight mb-2">1000+ generative AI models</h1>
              <p className="text-muted-foreground">Deploy state-of-the-art AI models on dedicated GPU infrastructure</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                className="font-medium"
                onClick={() => router.push('/deploy/my-models')}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Getting Started
              </Button>
              <Button 
                variant="outline"
                className="font-medium"
                onClick={() => router.push('/deploy/playground')}
              >
                <Eye className="h-4 w-4 mr-2" />
                Playground
              </Button>
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                onClick={() => router.push('/deploy/new')}
              >
                Deploy Model
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search Models"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="font-medium">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Button>
              <Button variant="outline" size="sm" className="font-medium">
                All Models
              </Button>
              <Button variant="outline" size="sm" className="font-medium">
                LLM
              </Button>
              <Button variant="outline" size="sm" className="font-medium">
                Vision
              </Button>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Provider: All</SelectItem>
                  <SelectItem value="deepseek">DeepSeek AI</SelectItem>
                  <SelectItem value="alibaba">Alibaba</SelectItem>
                  <SelectItem value="meta">Meta</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none border-r"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Models Display */}
          {viewMode === 'grid' ? (
            /* Grid Layout */
            <div className="grid gap-4 md:gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredModels.map((model) => (
                <Card 
                  key={model.id} 
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border border-border/60 bg-card backdrop-blur-sm group overflow-hidden"
                  onClick={() => router.push(`/deploy/models/${model.id}`)}
                >
                  <CardContent className="p-0">
                    {/* Model Header - matches Fireworks style */}
                    <div className="p-4 md:p-6 bg-white dark:bg-gray-950 border-b border-border/20">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-muted border border-border/30">
                            <span className="text-lg">{model.logo}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm leading-tight tracking-tight">{model.name}</h3>
                            <p className="text-xs text-muted-foreground font-medium">{model.provider}</p>
                          </div>
                        </div>
                        {model.featured && (
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 font-medium text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      
                      {/* Pricing - simplified like Fireworks */}
                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div className="text-center p-2 bg-muted/50 rounded border border-border/20">
                          <div className="font-semibold">{model.pricing.input}</div>
                          <div className="text-muted-foreground font-medium">Input</div>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded border border-border/20">
                          <div className="font-semibold">{model.pricing.output}</div>
                          <div className="text-muted-foreground font-medium">Output</div>
                        </div>
                      </div>
                      
                      {/* GPU & Context Info */}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="font-medium">{model.context} Context</span>
                        <span>•</span>
                        <span className="font-medium">{model.gpuType}</span>
                      </div>
                    </div>

                    {/* Model Capabilities - matches Fireworks layout */}
                    <div className="p-4 md:p-6 space-y-3">
                      {/* Capabilities tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {model.capabilities.map((capability) => (
                          <Badge 
                            key={capability} 
                            variant="secondary" 
                            className="text-xs px-2 py-0.5 bg-muted text-muted-foreground font-medium border-0"
                          >
                            {capability === 'LLM' && <Brain className="h-3 w-3 mr-1" />}
                            {capability === 'Vision' && <Eye className="h-3 w-3 mr-1" />}
                            {capability === 'Dedicated GPU' && <Server className="h-3 w-3 mr-1" />}
                            {capability === 'Multi-GPU' && <Cpu className="h-3 w-3 mr-1" />}
                            {capability === 'Multi-GPU Cluster' && <Database className="h-3 w-3 mr-1" />}
                            {capability}
                          </Badge>
                        ))}
                      </div>

                      {/* Performance Metrics */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Zap className="h-3 w-3 text-primary" />
                          <span className="text-muted-foreground font-medium">{model.performance.latency}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Activity className="h-3 w-3 text-green-600" />
                          <span className="text-muted-foreground font-medium">{model.performance.throughput}</span>
                        </div>
                      </div>

                      {/* Stats Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-border/20">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{model.popularity}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            <span className="font-medium">{model.deployments}</span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="h-7 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/deploy/new?model=${model.id}`);
                          }}
                        >
                          Deploy
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* List Layout */
            <div className="space-y-3">
              {filteredModels.map((model) => (
                <Card 
                  key={model.id}
                  className="cursor-pointer hover:shadow-md transition-all duration-200 border border-border/60 bg-card backdrop-blur-sm group"
                  onClick={() => router.push(`/deploy/models/${model.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        {/* Model Icon and Basic Info */}
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-muted border border-border/30">
                            <span className="text-lg">{model.logo}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-base leading-tight tracking-tight">{model.name}</h3>
                              {model.featured && (
                                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 font-medium text-xs">
                                  <Star className="h-3 w-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">{model.provider}</p>
                          </div>
                        </div>

                        {/* Capabilities */}
                        <div className="flex flex-wrap gap-1.5">
                          {model.capabilities.slice(0, 3).map((capability) => (
                            <Badge 
                              key={capability} 
                              variant="secondary" 
                              className="text-xs px-2 py-0.5 bg-muted text-muted-foreground font-medium border-0"
                            >
                              {capability === 'LLM' && <Brain className="h-3 w-3 mr-1" />}
                              {capability === 'Vision' && <Eye className="h-3 w-3 mr-1" />}
                              {capability === 'Dedicated GPU' && <Server className="h-3 w-3 mr-1" />}
                              {capability === 'Multi-GPU' && <Cpu className="h-3 w-3 mr-1" />}
                              {capability === 'Multi-GPU Cluster' && <Database className="h-3 w-3 mr-1" />}
                              {capability}
                            </Badge>
                          ))}
                        </div>

                        {/* Performance and Stats */}
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3 text-primary" />
                            <span className="font-medium">{model.performance.latency}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Activity className="h-3 w-3 text-green-600" />
                            <span className="font-medium">{model.performance.throughput}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{model.popularity}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            <span className="font-medium">{model.deployments}</span>
                          </div>
                        </div>
                      </div>

                      {/* Pricing and Actions */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-semibold">{model.pricing.input} / {model.pricing.output}</div>
                          <div className="text-xs text-muted-foreground">Input / Output per 1M</div>
                        </div>
                        <Button 
                          size="sm" 
                          className="font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/deploy/new?model=${model.id}`);
                          }}
                        >
                          Deploy
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}