'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  CreditCard,
  ExternalLink,
  BookOpen,
  Zap,
  Rocket,
  Brain,
  Eye,
  MessageSquare,
  Sparkles,
  Code,
  Settings,
  BarChart3,
  DollarSign,
  Users,
  FileText,
  TrendingUp,
  Activity,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Cpu,
  Database,
  Shield,
  Globe,
  Copy,
  Play,
  Pause,
  MoreHorizontal,
  Server,
  Gauge,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RainbowButton } from '@/components/magicui/rainbow-button';

// Mock user data with more realistic information
const userData = {
  name: 'kampfer87-4883ac',
  accountId: 'kampf87-4883ac',
  accountType: 'Developer',
  dedicatedRateLimit: '1000 req/min',
  currentSpend: 0,
  spendLimit: 50000,
  joinDate: 'January 2024',
  totalDeployments: 0,
  apiCalls: 0,
};

// Enhanced model data with dedicated infrastructure terminology
const modelLibrary = [
  {
    id: 'qwen3-30b',
    name: 'Qwen3 30B-A3B',
    provider: 'Alibaba',
    logo: '🔮',
    inputPrice: '$0.15',
    outputPrice: '$0.86',
    contextLength: '32K',
    capabilities: ['LLM', 'Dedicated GPU'],
    performance: { latency: '~200ms', throughput: '85 tokens/s' },
    popularity: 4.8,
    deployments: '2.1K',
    featured: true,
    gpuType: 'H100',
    vram: '80GB',
  },
  {
    id: 'qwen3-235b',
    name: 'Qwen3 235B-A22B',
    provider: 'Alibaba',
    logo: '🔮',
    inputPrice: '$0.22',
    outputPrice: '$0.86',
    contextLength: '128K',
    capabilities: ['LLM', 'Multi-GPU'],
    performance: { latency: '~350ms', throughput: '65 tokens/s' },
    popularity: 4.9,
    deployments: '1.8K',
    featured: true,
    gpuType: 'H100',
    vram: '8x80GB',
  },
  {
    id: 'llama-4-maverick',
    name: 'Llama 4 Maverick Instruct (Basic)',
    provider: 'Meta',
    logo: '🦙',
    inputPrice: '$0.22',
    outputPrice: '$0.86',
    contextLength: '1M',
    capabilities: ['LLM', 'Vision', 'Dedicated GPU'],
    performance: { latency: '~180ms', throughput: '92 tokens/s' },
    popularity: 4.7,
    deployments: '3.2K',
    featured: true,
    gpuType: 'A100',
    vram: '80GB',
  },
  {
    id: 'llama-4-scout',
    name: 'Llama 4 Scout Instruct (Basic)',
    provider: 'Meta',
    logo: '🦙',
    inputPrice: '$0.15',
    outputPrice: '$0.86',
    contextLength: '1M',
    capabilities: ['LLM', 'Vision', 'Dedicated GPU'],
    performance: { latency: '~160ms', throughput: '98 tokens/s' },
    popularity: 4.6,
    deployments: '2.7K',
    featured: false,
    gpuType: 'A100',
    vram: '80GB',
  },
  {
    id: 'llama-3.1-405b',
    name: 'Llama 3.1 405B Instruct',
    provider: 'Meta',
    logo: '🦙',
    inputPrice: '$3.00',
    outputPrice: '$15.00',
    contextLength: '128K',
    capabilities: ['LLM', 'Multi-GPU Cluster'],
    performance: { latency: '~800ms', throughput: '45 tokens/s' },
    popularity: 4.9,
    deployments: '950',
    featured: true,
    gpuType: 'H100',
    vram: '8x80GB',
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1 (Fast)',
    provider: 'DeepSeek',
    logo: '🧠',
    inputPrice: '$3.00',
    outputPrice: '$8.00',
    contextLength: '160K',
    capabilities: ['LLM', 'Dedicated GPU', 'Fine-tunable'],
    performance: { latency: '~250ms', throughput: '78 tokens/s' },
    popularity: 4.8,
    deployments: '1.5K',
    featured: true,
    gpuType: 'H100',
    vram: '80GB',
  },
];

// Mock fine-tuning jobs with more details
const recentJobs = [
  {
    id: 'ft-mJxzxyui-ot0sx',
    name: 'customer-support-v1',
    model: 'llama-v3p1-8b-instruct',
    dataset: 'customer-conversations-2024',
    email: 'kampfer87@protonmail.com',
    date: '2 hours ago',
    status: 'running' as const,
    progress: 75,
    estimatedTime: '~15 min remaining',
    cost: '$12.50',
  },
  {
    id: 'ft-abc123-def456',
    name: 'code-assistant-v2',
    model: 'qwen3-30b-instruct',
    dataset: 'programming-examples',
    email: 'kampfer87@protonmail.com',
    date: '1 day ago',
    status: 'completed' as const,
    progress: 100,
    estimatedTime: 'Completed',
    cost: '$18.75',
  },
  {
    id: 'ft-xyz789-uvw012',
    name: 'qydylfr9',
    model: 'llama-v3p1-8b-instruct',
    dataset: 'sample-finetune-data',
    email: 'kampfer87@protonmail.com',
    date: '1 month ago',
    status: 'failed' as const,
    progress: 0,
    estimatedTime: 'Failed after 45 min',
    cost: '$0.00',
  },
];

const learningResources = [
  {
    icon: Server,
    title: 'Dedicated Inference',
    description: 'Deploy models on dedicated GPUs for maximum performance and reliability. Get consistent latency and throughput for production workloads.',
    action: 'Read Docs',
    gradient: 'from-blue-500 to-indigo-600',
    estimated: '5 min read',
    difficulty: 'Beginner',
  },
  {
    icon: Cpu,
    title: 'Multi-GPU Deployments',
    description: 'Scale large models across multiple GPUs for handling massive workloads. Perfect for high-throughput applications and enterprise use cases.',
    action: 'Read Docs',
    gradient: 'from-purple-500 to-violet-600',
    estimated: '8 min read',
    difficulty: 'Intermediate',
  },
  {
    icon: Settings,
    title: 'Fine-tuning',
    description: 'Improve model quality on your use case by fine-tuning on your own data. Deploy custom models on dedicated infrastructure for optimal performance.',
    action: 'Read Docs',
    gradient: 'from-emerald-500 to-teal-600',
    estimated: '12 min read',
    difficulty: 'Advanced',
  },
];

const quickActions = [
  {
    title: 'Deploy a Model',
    description: 'Get started with dedicated GPU inference',
    icon: Rocket,
    href: '/deploy/new',
    gradient: 'from-blue-500 to-purple-600',
  },
  {
    title: 'View API Keys',
    description: 'Manage your authentication',
    icon: Shield,
    href: '/deploy/api-keys',
    gradient: 'from-green-500 to-emerald-600',
  },
  {
    title: 'Test in Playground',
    description: 'Try models before deploying',
    icon: Play,
    href: '/deploy/playground',
    gradient: 'from-orange-500 to-red-600',
  },
];

export default function DeployDashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col h-full bg-background">
        <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2 border-b">
          <SidebarToggle />
          <div className="h-6 w-16 bg-muted rounded animate-pulse" />
          <div className="hidden md:block order-4 md:ml-auto">
            <div className="h-8 w-32 bg-muted rounded-lg animate-pulse" />
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-muted/20 font-sans">
      <header className="flex sticky top-0 z-[100] bg-gradient-to-r from-background/80 via-muted/40 to-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-gradient-to-r supports-[backdrop-filter]:from-background/60 supports-[backdrop-filter]:via-muted/20 supports-[backdrop-filter]:to-background/60 py-1.5 items-center px-2 md:px-2 gap-2 border-b border-border/60">
        <SidebarToggle />
        <h1 className="text-lg font-semibold tracking-tight">Home</h1>
        <Link href="/" className="hidden md:block order-4 md:ml-auto">
          <Button variant="outline" className="flex items-center gap-2 text-sm py-1.5 h-8 px-4 rounded-lg border-border/40 hover:border-border transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Chat
          </Button>
        </Link>
      </header>

      <div className="flex-1 overflow-auto p-4 md:p-6 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_25%_25%,_theme(colors.purple.500),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-8 relative">
          {/* Welcome Banner - Fireworks style */}
          <Card className="relative overflow-hidden border border-border/60 bg-gradient-to-br from-violet-50/50 via-purple-50/30 to-blue-50/30 dark:from-violet-950/30 dark:via-purple-950/20 dark:to-blue-950/20 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <div>
                    <h2 className="text-2xl font-semibold mb-1 tracking-tight">
                      Welcome back, {userData.name}
                    </h2>
                    <p className="text-muted-foreground max-w-lg leading-relaxed font-medium">
                      The fastest dedicated GPU inference platform for building production-ready AI systems
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      Member since {userData.joinDate}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Server className="h-4 w-4" />
                      {userData.totalDeployments} deployments
                    </div>
                  </div>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-sm font-medium hover:underline"
                  >
                    Learn more →
                  </Button>
                </div>
                <div className="flex gap-2">
                  <RainbowButton 
                    className="px-6 h-9 font-semibold"
                    onClick={() => router.push('/deploy/new')}
                  >
                    Start building
                  </RainbowButton>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions - cleaner style */}
          <div className="grid gap-3 md:grid-cols-3">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className="cursor-pointer hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] border border-border/60 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm group"
                onClick={() => router.push(action.href)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${action.gradient}`}>
                      <action.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-0.5 tracking-tight text-sm">{action.title}</h3>
                      <p className="text-xs text-muted-foreground font-medium">{action.description}</p>
                    </div>
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              {/* Payment Setup Card - Fireworks style */}
              <Card className="border border-green-200 bg-gradient-to-br from-green-50/80 to-emerald-50/60 dark:border-green-800 dark:from-green-950/40 dark:to-emerald-950/30 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1 tracking-tight">Set Payment Method</h3>
                        <p className="text-green-700 dark:text-green-300 text-sm leading-relaxed font-medium">
                          Add payment information to start deploying models
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 font-medium">
                        <CheckCircle className="h-3 w-3" />
                        $5 in free credits included
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                          onClick={() => router.push('/deploy/billing')}
                        >
                          Set payment
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-green-300 text-green-700 hover:bg-green-100 dark:border-green-700 dark:text-green-300 font-medium"
                        >
                          Pricing
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Usage Metrics Card - simplified */}
              <Card className="border border-border/60 shadow-sm bg-card/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <div>
                    <CardTitle className="text-base font-semibold tracking-tight">Usage Metrics (24h)</CardTitle>
                    <CardDescription className="text-sm font-medium">No usage data yet</CardDescription>
                  </div>
                  <Button variant="link" size="sm" className="text-muted-foreground hover:text-foreground font-medium text-sm p-0 h-auto">
                    Usage Details
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <BarChart3 className="h-12 w-12 text-muted-foreground/40 mx-auto" />
                    </div>
                    <p className="text-muted-foreground mb-4 max-w-md mx-auto text-sm font-medium">
                      Your usage metrics will appear here after your first API call. 
                      See our API keys.
                    </p>
                    <Button variant="link" className="p-0 h-auto font-medium text-sm">
                      API keys
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Account Details Sidebar - Fireworks style */}
            <div className="space-y-4">
              <Card className="border border-border/60 shadow-sm bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold tracking-tight">Account Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Account ID</span>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded font-mono">{userData.accountId}</code>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Account Type</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-medium">
                        {userData.accountType}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Rate Limit</span>
                      <span className="text-sm font-medium">{userData.dedicatedRateLimit}</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Current Spend</span>
                      <Button variant="link" className="p-0 h-auto text-sm font-medium">
                        Billing details
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">${userData.currentSpend.toFixed(2)}</span>
                        <span className="text-muted-foreground font-medium">${userData.spendLimit.toLocaleString()} limit</span>
                      </div>
                      <Progress 
                        value={(userData.currentSpend / userData.spendLimit) * 100} 
                        className="h-2 bg-muted"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0% used</span>
                        <span>Resets monthly</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Fine-Tuning Jobs - Fireworks style */}
          <Card className="border border-border/60 shadow-sm bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold tracking-tight">Recent Fine-Tuning Jobs</CardTitle>
              </div>
              <Button variant="link" onClick={() => router.push('/deploy/fine-tuning')} className="font-medium text-sm p-0 h-auto">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {recentJobs.length > 0 ? (
                <div className="space-y-3">
                  {recentJobs.map((job) => (
                    <div key={job.id} className="p-3 border border-border/40 rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm">{job.name}</h4>
                            <Badge 
                              variant="secondary"
                              className={
                                job.status === 'running' 
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs font-medium' 
                                  : job.status === 'completed'
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs font-medium'
                                  : 'text-xs font-medium'
                              }
                            >
                              {job.status === 'running' && <Activity className="h-3 w-3 mr-1" />}
                              {job.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                              {job.status === 'failed' && <AlertCircle className="h-3 w-3 mr-1" />}
                              {job.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{job.date}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {job.model} • {job.estimatedTime} • {job.cost}
                          </div>
                          {job.status === 'running' && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Progress</span>
                                <span>{job.progress}%</span>
                              </div>
                              <Progress value={job.progress} className="h-1.5" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mb-2">
                    <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono">ft-m9xzxyui-ot05x</span>
                  </div>
                  <p className="text-muted-foreground mb-3 text-sm font-medium">No fine-tuning jobs yet</p>
                  <Button variant="link" onClick={() => router.push('/deploy/fine-tuning')} className="font-medium text-sm p-0 h-auto">
                    Start fine-tuning
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Explore Models */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Explore Models</h2>
                <p className="text-muted-foreground font-medium text-lg">Deploy state-of-the-art AI models on dedicated GPU infrastructure</p>
              </div>
              <Button variant="outline" onClick={() => router.push('/deploy/models')} className="gap-2 font-semibold">
                <Brain className="h-4 w-4" />
                Model Library
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {modelLibrary.map((model) => (
                <Card 
                  key={model.id} 
                  className="cursor-pointer hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] border border-border/60 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm group overflow-hidden hover:border-primary/30"
                  onClick={() => router.push(`/deploy/new?model=${model.id}`)}
                >
                  <CardContent className="p-0">
                    {/* Clean Model Header - matches Fireworks style */}
                    <div className="p-4 bg-white dark:bg-gray-950 border-b border-border/20">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-border/30">
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
                        <div className="text-center p-2 bg-slate-50 dark:bg-slate-900 rounded border border-border/20">
                          <div className="font-semibold">{model.inputPrice}</div>
                          <div className="text-muted-foreground font-medium">Input</div>
                        </div>
                        <div className="text-center p-2 bg-slate-50 dark:bg-slate-900 rounded border border-border/20">
                          <div className="font-semibold">{model.outputPrice}</div>
                          <div className="text-muted-foreground font-medium">Output</div>
                        </div>
                      </div>
                      
                      {/* GPU & Context Info */}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="font-medium">{model.contextLength} Context</span>
                        <span>•</span>
                        <span className="font-medium">{model.gpuType}</span>
                      </div>
                    </div>

                    {/* Model Capabilities - matches Fireworks layout */}
                    <div className="p-4 space-y-3">
                      {/* Capabilities tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {model.capabilities.map((capability) => (
                          <Badge 
                            key={capability} 
                            variant="secondary" 
                            className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border-0"
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
                          <Zap className="h-3 w-3 text-blue-500" />
                          <span className="text-muted-foreground font-medium">{model.performance.latency}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Activity className="h-3 w-3 text-green-500" />
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
                        <RainbowButton size="sm" className="h-7 text-xs font-semibold">
                          Deploy
                        </RainbowButton>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Learn Section - Fireworks style */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Learn</h2>
              </div>
              <Button variant="link" className="gap-2 font-medium text-sm p-0 h-auto">
                Go to Docs
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {learningResources.map((resource, index) => (
                <Card key={index} className="border border-border/60 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${resource.gradient}`}>
                          <resource.icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-sm tracking-tight">{resource.title}</h3>
                            <Badge variant="outline" className="text-xs font-medium">
                              {resource.difficulty}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed mb-3 font-medium">
                            {resource.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <Button variant="link" className="p-0 h-auto text-xs font-medium">
                              Read Docs
                            </Button>
                            <span className="text-xs text-muted-foreground">{resource.estimated}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}