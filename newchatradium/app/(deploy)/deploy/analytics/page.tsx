'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, ArrowLeft, Activity, Clock, DollarSign, Zap } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, LineChart, Line } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

// Chart data matching the Together AI dashboard
const requestsChartData = [
  { time: '7:11 PM', successes: 0, errors: 0 },
  { time: '8:3 AM', successes: 0, errors: 0 },
  { time: '8:7 AM', successes: 0, errors: 0 },
  { time: '8:11 AM', successes: 0, errors: 0 },
  { time: '8:3 PM', successes: 0, errors: 0 },
  { time: '8:7 PM', successes: 0, errors: 0 },
  { time: '8:11 PM', successes: 0, errors: 0 },
];

const tokensChartData = [
  { time: '7:11 PM', tokens: 0 },
  { time: '8:3 AM', tokens: 0 },
  { time: '8:7 AM', tokens: 0 },
  { time: '8:11 AM', tokens: 0 },
  { time: '8:3 PM', tokens: 0 },
  { time: '8:7 PM', tokens: 0 },
  { time: '8:11 PM', tokens: 0 },
];

const latencyChartData = [
  { time: '7:11 PM', latency: 0 },
  { time: '8:3 AM', latency: 0 },
  { time: '8:7 AM', latency: 0 },
  { time: '8:11 AM', latency: 0 },
  { time: '8:3 PM', latency: 0 },
  { time: '8:7 PM', latency: 0 },
  { time: '8:11 PM', latency: 0 },
];

const ttftChartData = [
  { time: '7:11 PM', ttft: 0 },
  { time: '8:3 AM', ttft: 0 },
  { time: '8:7 AM', ttft: 0 },
  { time: '8:11 AM', ttft: 0 },
  { time: '8:3 PM', ttft: 0 },
  { time: '8:7 PM', ttft: 0 },
  { time: '8:11 PM', ttft: 0 },
];

const requestsChartConfig = {
  successes: {
    label: 'Successes',
    color: 'hsl(var(--chart-1))',
  },
  errors: {
    label: 'Errors',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const tokensChartConfig = {
  tokens: {
    label: 'Tokens',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

const latencyChartConfig = {
  latency: {
    label: 'Latency',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

const ttftChartConfig = {
  ttft: {
    label: 'TTFT',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

export default function AnalyticsPage() {
  const [timeInterval, setTimeInterval] = useState('24');
  const [timeUnit, setTimeUnit] = useState('Hours');
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-muted/20 font-sans">
      <header className="flex sticky top-0 z-[100] bg-gradient-to-r from-background/80 via-muted/40 to-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-gradient-to-r supports-[backdrop-filter]:from-background/60 supports-[backdrop-filter]:via-muted/20 supports-[backdrop-filter]:to-background/60 py-1.5 items-center px-2 md:px-2 gap-2 border-b border-border/60">
        <SidebarToggle />
        <h1 className="text-lg font-semibold tracking-tight">Analytics Dashboard</h1>
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
              <h1 className="text-2xl font-semibold tracking-tight mb-2">Analytics Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Time Interval</span>
                <Select value={timeInterval} onValueChange={setTimeInterval}>
                  <SelectTrigger className="w-16">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24">24</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={timeUnit} onValueChange={setTimeUnit}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hours">Hours</SelectItem>
                    <SelectItem value="Days">Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="analytics" className="bg-blue-500 text-white data-[state=active]:bg-blue-600">
                Analytics
              </TabsTrigger>
              <TabsTrigger value="monthly" className="text-muted-foreground">
                Monthly Reserved Endpoints
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analytics" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Requests Chart */}
              <Card className="border border-border/60 shadow-sm bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-medium text-muted-foreground">REQUESTS</CardTitle>
                      <div className="text-sm text-muted-foreground mt-1">Total requests & errors</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span>0</span>
                          <span className="text-muted-foreground">Successes</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>0</span>
                          <span className="text-muted-foreground">Errors</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>-%</span>
                          <span className="text-muted-foreground">Success rate</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={requestsChartConfig}>
                    <AreaChart
                      accessibilityLayer
                      data={requestsChartData}
                      margin={{
                        left: 12,
                        right: 12,
                        top: 12,
                        bottom: 12,
                      }}
                      height={200}
                    >
                      <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="time"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12 }}
                        domain={[0, 4]}
                        ticks={[1, 2, 3, 4]}
                      />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                      <defs>
                        <linearGradient id="fillSuccesses" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="var(--color-successes)"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-successes)"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                        <linearGradient id="fillErrors" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="var(--color-errors)"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-errors)"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <Area
                        dataKey="errors"
                        type="natural"
                        fill="url(#fillErrors)"
                        fillOpacity={0.4}
                        stroke="var(--color-errors)"
                        stackId="a"
                      />
                      <Area
                        dataKey="successes"
                        type="natural"
                        fill="url(#fillSuccesses)"
                        fillOpacity={0.4}
                        stroke="var(--color-successes)"
                        stackId="a"
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* TPM Chart */}
              <Card className="border border-border/60 shadow-sm bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-medium text-muted-foreground">TPM</CardTitle>
                      <div className="text-sm text-muted-foreground mt-1">Tokens per minute</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span>0</span>
                          <span className="text-muted-foreground">Average</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>0</span>
                          <span className="text-muted-foreground">P95</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>0</span>
                          <span className="text-muted-foreground">P99</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={tokensChartConfig}>
                    <AreaChart
                      accessibilityLayer
                      data={tokensChartData}
                      margin={{
                        left: 12,
                        right: 12,
                        top: 12,
                        bottom: 12,
                      }}
                      height={200}
                    >
                      <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="time"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12 }}
                        domain={[0, 4]}
                        ticks={[1, 2, 3, 4]}
                      />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                      <defs>
                        <linearGradient id="fillTokens" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="var(--color-tokens)"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-tokens)"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <Area
                        dataKey="tokens"
                        type="natural"
                        fill="url(#fillTokens)"
                        fillOpacity={0.4}
                        stroke="var(--color-tokens)"
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Latency Chart */}
              <Card className="border border-border/60 shadow-sm bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-medium text-muted-foreground">LATENCY (SERVER-SIDE)</CardTitle>
                      <div className="text-sm text-muted-foreground mt-1">Avg latency in seconds</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span>0S</span>
                          <span className="text-muted-foreground">Average</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>0S</span>
                          <span className="text-muted-foreground">P95</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>0S</span>
                          <span className="text-muted-foreground">P99</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={latencyChartConfig}>
                    <AreaChart
                      accessibilityLayer
                      data={latencyChartData}
                      margin={{
                        left: 12,
                        right: 12,
                        top: 12,
                        bottom: 12,
                      }}
                      height={200}
                    >
                      <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="time"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12 }}
                        domain={[0, 4]}
                        ticks={[1, 2, 3, 4]}
                      />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                      <defs>
                        <linearGradient id="fillLatency" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="var(--color-latency)"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-latency)"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <Area
                        dataKey="latency"
                        type="natural"
                        fill="url(#fillLatency)"
                        fillOpacity={0.4}
                        stroke="var(--color-latency)"
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* TTFT Chart */}
              <Card className="border border-border/60 shadow-sm bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-medium text-muted-foreground">TTFT (SERVER-SIDE)</CardTitle>
                      <div className="text-sm text-muted-foreground mt-1">Avg time to first token</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span>0S</span>
                          <span className="text-muted-foreground">p50</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>0S</span>
                          <span className="text-muted-foreground">P95</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>0S</span>
                          <span className="text-muted-foreground">P99</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={ttftChartConfig}>
                    <AreaChart
                      accessibilityLayer
                      data={ttftChartData}
                      margin={{
                        left: 12,
                        right: 12,
                        top: 12,
                        bottom: 12,
                      }}
                      height={200}
                    >
                      <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="time"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12 }}
                        domain={[0, 4]}
                        ticks={[1, 2, 3, 4]}
                      />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                      <defs>
                        <linearGradient id="fillTtft" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="var(--color-ttft)"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-ttft)"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <Area
                        dataKey="ttft"
                        type="natural"
                        fill="url(#fillTtft)"
                        fillOpacity={0.4}
                        stroke="var(--color-ttft)"
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Models Card */}
              <Card className="border border-border/60 shadow-sm bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-medium text-muted-foreground">MODELS</CardTitle>
                      <div className="text-sm text-muted-foreground mt-1">Successful requests per model</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm">
                        <span>0</span>
                        <span className="text-muted-foreground">Total</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-32 flex items-center justify-center text-muted-foreground">
                    No model data available
                  </div>
                </CardContent>
              </Card>

              {/* Errors Card */}
              <Card className="border border-border/60 shadow-sm bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-medium text-muted-foreground">ERRORS</CardTitle>
                      <div className="text-sm text-muted-foreground mt-1">Total errors by error code</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-32 flex items-center justify-center text-muted-foreground">
                    No error data available
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

            <TabsContent value="monthly">
              <Card className="border border-border/60 shadow-sm bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Monthly Reserved Endpoints data would go here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}