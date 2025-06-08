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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Search,
  Settings,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  ExternalLink,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Copy,
  BarChart3,
  Upload,
  Brain,
  Zap,
  Target,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock custom models data type
interface CustomModel {
  id: string;
  name: string;
  baseModel: string;
  kind: string;
  contextLength: string;
  createdBy: string;
  createdOn: string;
  status: 'ready' | 'training' | 'failed';
}

// Mock data for when models exist
const mockModels: CustomModel[] = [
  {
    id: 'ft-mbntroqr-1snaq',
    name: 'ft-mbntroqr-1snaq',
    baseModel: 'llama-v3p1-8b-instruct',
    kind: 'LoRA addon',
    contextLength: 'Unknown',
    createdBy: 'kampfer87@protonmail.com',
    createdOn: 'Jun 8, 2025',
    status: 'ready',
  },
];

// Mock service for models operations
class MyModelsService {
  private static models: CustomModel[] = [...mockModels];

  static getModels(): CustomModel[] {
    return this.models;
  }

  static deleteModel(id: string): void {
    this.models = this.models.filter(model => model.id !== id);
  }
}

const columnHelper = createColumnHelper<CustomModel>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Model Name',
    cell: info => (
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
          <Settings className="h-4 w-4 text-purple-500" />
        </div>
        <div>
          <span className="font-medium text-foreground">{info.getValue()}</span>
          <div className="text-xs text-muted-foreground mt-0.5">ID: {info.getValue()}</div>
        </div>
      </div>
    ),
  }),
  columnHelper.accessor('kind', {
    header: 'Kind',
    cell: info => (
      <div>
        <div className="font-medium">{info.getValue()}</div>
      </div>
    ),
  }),
  columnHelper.accessor('contextLength', {
    header: 'Context Length',
    cell: info => (
      <div>
        <div className="font-medium">{info.getValue()}</div>
      </div>
    ),
  }),
  columnHelper.accessor('createdBy', {
    header: 'Created by',
    cell: info => <span className="text-sm">{info.getValue()}</span>,
  }),
  columnHelper.accessor('createdOn', {
    header: 'Created on',
    cell: info => (
      <div>
        <div className="text-sm">{info.getValue()}</div>
        <div className="text-xs text-muted-foreground">8:35 PM</div>
      </div>
    ),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => {
      const status = info.getValue();
      const getStatusConfig = (status: string) => {
        switch (status) {
          case 'ready':
            return { color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300', icon: CheckCircle };
          case 'training':
            return { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300', icon: Activity };
          case 'failed':
            return { color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300', icon: AlertCircle };
          default:
            return { color: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300', icon: Clock };
        }
      };
      
      const config = getStatusConfig(status);
      const Icon = config.icon;
      
      return (
        <Badge className={`${config.color} font-medium`}>
          <Icon className="h-3 w-3 mr-1" />
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  }),
  columnHelper.display({
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const model = row.original;
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="h-8 w-8 p-0 hover:bg-muted/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4" />
              Model details
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Deploy on-demand
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Copy className="mr-2 h-4 w-4" />
              Load LoRA
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Fine-tune model
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Model
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];

export default function MyModelsPage() {
  const router = useRouter();
  const [models, setModels] = useState<CustomModel[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setModels(MyModelsService.getModels());
  }, []);

  const table = useReactTable({
    data: models,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  if (!mounted) {
    return (
      <div className="flex flex-col h-full bg-background">
        <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2 border-b">
          <SidebarToggle />
          <div className="h-6 w-32 bg-muted rounded animate-pulse" />
          <div className="hidden md:block order-4 md:ml-auto">
            <div className="h-8 w-32 bg-muted rounded-lg animate-pulse" />
          </div>
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

  // Show getting started page when no models exist
  if (models.length === 0) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-muted/20 font-sans">
        <header className="flex sticky top-0 bg-background/95 backdrop-blur-sm py-1.5 items-center px-2 md:px-2 gap-2 border-b border-border/40">
          <SidebarToggle />
          <h1 className="text-lg font-semibold tracking-tight">My Models</h1>
          <Link href="/deploy/dashboard" className="hidden md:block order-4 md:ml-auto">
            <Button variant="outline" className="flex items-center gap-2 text-sm py-1.5 h-8 px-4 rounded-lg border-border/40 hover:border-border transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-6 relative">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_25%_25%,_theme(colors.purple.500),transparent_50%)] pointer-events-none" />
          <div className="max-w-6xl mx-auto space-y-8 relative">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tight">My Models</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                View custom models you fine-tuned or uploaded. Create your first model to get started.
              </p>
            </div>

            {/* How it works */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-center">How to Create Custom Models</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border border-border/60 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 w-fit">
                      <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle className="text-lg">Fine-tune a Model</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Customize existing models with your data using LoRA fine-tuning for better performance on specific tasks.
                    </p>
                    <Button 
                      className="w-full"
                      onClick={() => router.push('/deploy/fine-tuning/create')}
                    >
                      Start Fine-tuning
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border border-border/60 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 w-fit">
                      <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-lg">Upload a Model</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Upload your own pre-trained models or LoRA adapters to deploy on our infrastructure.
                    </p>
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push('/deploy/models/upload')}
                    >
                      Upload Model
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border border-border/60 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 rounded-lg bg-green-100 dark:bg-green-900/30 w-fit">
                      <Brain className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-lg">Browse Model Library</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Explore 1000+ pre-trained models available for deployment and fine-tuning.
                    </p>
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push('/deploy/models')}
                    >
                      Browse Models
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Key Benefits */}
            <Card className="border border-border/60 shadow-sm bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Benefits of Custom Models</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold">🎯 Task-Specific Performance</h4>
                    <p className="text-sm text-muted-foreground">
                      Fine-tuned models perform significantly better on your specific use cases and domain.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold">🔒 Data Privacy</h4>
                    <p className="text-sm text-muted-foreground">
                      Keep your training data and model weights secure with dedicated infrastructure.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold">⚡ Fast Deployment</h4>
                    <p className="text-sm text-muted-foreground">
                      Deploy custom models instantly with the same APIs and performance as base models.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold">💰 Cost Optimization</h4>
                    <p className="text-sm text-muted-foreground">
                      Use smaller fine-tuned models that outperform larger general-purpose models.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Section */}
            <div className="text-center space-y-6 py-8">
              <h2 className="text-2xl font-semibold">Ready to Create Your First Model?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Start with fine-tuning an existing model or upload your own to get the best performance for your specific use case.
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  size="lg"
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                  onClick={() => router.push('/deploy/fine-tuning/create')}
                >
                  Fine-tune a Model
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                  onClick={() => router.push('/deploy/models')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Browse Model Library
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Table view when models exist
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-muted/20 font-sans">
      <header className="flex sticky top-0 bg-background/95 backdrop-blur-sm py-1.5 items-center px-2 md:px-2 gap-2 border-b border-border/40">
        <SidebarToggle />
        <h1 className="text-lg font-semibold tracking-tight">My Models</h1>
        <Link href="/deploy/dashboard" className="hidden md:block order-4 md:ml-auto">
          <Button variant="outline" className="flex items-center gap-2 text-sm py-1.5 h-8 px-4 rounded-lg border-border/40 hover:border-border transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </header>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight mb-2">My Models</h1>
              <p className="text-muted-foreground">View custom models you fine-tuned or uploaded.</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                className="font-medium"
                onClick={() => router.push('/deploy/models')}
              >
                <Eye className="h-4 w-4 mr-2" />
                Model Library
              </Button>
              <Button 
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 font-medium"
                onClick={() => router.push('/deploy/fine-tuning/create')}
              >
                Import a model
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search models"
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="font-medium">
                All
              </Button>
              <Button variant="outline" size="sm" className="font-medium">
                Base Models
              </Button>
              <Button variant="outline" size="sm" className="font-medium">
                LoRA Models
              </Button>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Status: All</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <Card className="border border-border/60 shadow-sm hover:shadow-md transition-shadow duration-200 bg-card/50 backdrop-blur-sm">
            <Table>
              <TableHeader className="bg-muted/30">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-b border-border/60">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="font-semibold text-foreground/80 py-4">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="group hover:bg-muted/50 cursor-pointer transition-all duration-200 hover:shadow-sm border-b border-border/40"
                      onClick={() => router.push(`/deploy/my-models/${row.original.id}`)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-6 border-b border-border/40">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No models found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}