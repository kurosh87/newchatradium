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

// Mock fine-tuning job type
interface FineTuningJob {
  id: string;
  name: string;
  baseModel: string;
  dataset: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdBy: string;
  createdOn: string;
  progress?: number;
  estimatedTime?: string;
  cost?: string;
}

// Mock data for when jobs exist - showing enhanced table features
const mockJobs: FineTuningJob[] = [
  {
    id: 'ft-mbntroqr-1snaq',
    name: 'ft-mbntroqr-1snaq',
    baseModel: 'llama-v3p1-8b-instruct',
    dataset: 'demo-gsm8k-math-dataset-1000',
    status: 'running',
    createdBy: 'kampfer87@protonmail.com',
    createdOn: 'Jun 8, 2025',
    progress: 45,
    estimatedTime: '~30 min remaining',
    cost: '$8.75',
  },
  {
    id: 'ft-xyz123-abc',
    name: 'ft-xyz123-abc',
    baseModel: 'qwen3-30b-instruct',
    dataset: 'custom-training-data',
    status: 'completed',
    createdBy: 'kampfer87@protonmail.com',
    createdOn: 'Jun 7, 2025',
    cost: '$12.50',
  },
];

// Mock service for fine-tuning operations
class FineTuningService {
  private static jobs: FineTuningJob[] = [...mockJobs];

  static getJobs(): FineTuningJob[] {
    return this.jobs;
  }

  static createJob(job: Omit<FineTuningJob, 'id' | 'createdOn'>): FineTuningJob {
    const newJob: FineTuningJob = {
      ...job,
      id: `ft-${Math.random().toString(36).substr(2, 9)}`,
      createdOn: new Date().toLocaleDateString('en-US', { 
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
    };
    this.jobs.unshift(newJob);
    return newJob;
  }

  static deleteJob(id: string): void {
    this.jobs = this.jobs.filter(job => job.id !== id);
  }
}

const columnHelper = createColumnHelper<FineTuningJob>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Fine Tune Jobs',
    cell: info => (
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
          <Settings className="h-4 w-4 text-primary" />
        </div>
        <div>
          <span className="font-medium text-foreground">{info.getValue()}</span>
          <div className="text-xs text-muted-foreground mt-0.5">ID: {info.getValue()}</div>
        </div>
      </div>
    ),
  }),
  columnHelper.accessor('baseModel', {
    header: 'Base Model',
    cell: info => (
      <div>
        <div className="font-medium">{info.getValue()}</div>
        <div className="text-xs text-muted-foreground">ID: {info.row.original.baseModel.toLowerCase()}</div>
      </div>
    ),
  }),
  columnHelper.accessor('dataset', {
    header: 'Dataset',
    cell: info => (
      <div>
        <div className="font-medium">{info.getValue()}</div>
        <div className="text-xs text-muted-foreground">ID: {info.getValue().toLowerCase()}</div>
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
        <div className="text-xs text-muted-foreground">1:44 AM</div>
      </div>
    ),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => {
      const status = info.getValue();
      const row = info.row.original;
      const getStatusConfig = (status: string) => {
        switch (status) {
          case 'running':
            return { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', icon: Activity };
          case 'completed':
            return { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', icon: CheckCircle };
          case 'failed':
            return { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', icon: AlertCircle };
          default:
            return { color: 'bg-muted text-muted-foreground', icon: Clock };
        }
      };
      
      const config = getStatusConfig(status);
      const Icon = config.icon;
      
      return (
        <div className="space-y-1">
          <Badge className={`${config.color} font-medium`}>
            <Icon className="h-3 w-3 mr-1" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
          {status === 'running' && row.progress && (
            <div className="space-y-1">
              <div className="w-24 bg-muted rounded-full h-1.5">
                <div 
                  className="bg-primary h-1.5 rounded-full transition-all duration-300" 
                  style={{width: `${row.progress}%`}}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground">{row.progress}% • {row.estimatedTime}</div>
            </div>
          )}
        </div>
      );
    },
  }),
  columnHelper.display({
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const job = row.original;
      
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
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Metrics
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Copy className="mr-2 h-4 w-4" />
              Duplicate Job
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" />
              Edit Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Job
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];

export default function FineTuningPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<FineTuningJob[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setJobs(FineTuningService.getJobs());
  }, []);

  const table = useReactTable({
    data: jobs,
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

  const handleCreateJob = () => {
    router.push('/deploy/fine-tuning/create');
  };

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

  // Show getting started page when no jobs exist
  if (jobs.length === 0) {
    router.push('/deploy/fine-tuning/get-started');
    return null;
  }

  // Table view when jobs exist
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-muted/20 font-sans">
      <header className="flex sticky top-0 z-[100] bg-gradient-to-r from-background/80 via-muted/40 to-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-gradient-to-r supports-[backdrop-filter]:from-background/60 supports-[backdrop-filter]:via-muted/20 supports-[backdrop-filter]:to-background/60 py-1.5 items-center px-2 md:px-2 gap-2 border-b border-border/60">
        <SidebarToggle />
        <h1 className="text-lg font-semibold tracking-tight">Fine-Tuning</h1>
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
              <h1 className="text-2xl font-semibold tracking-tight mb-2">Fine-Tuning Jobs</h1>
              <p className="text-muted-foreground">View your past fine-tuning jobs and create new ones.</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                className="font-medium"
                onClick={() => router.push('/deploy/fine-tuning/get-started')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Getting Started
              </Button>
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                onClick={handleCreateJob}
              >
                Fine-Tune a Model
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="font-medium">
                Supervised
              </Button>
              <Button variant="outline" size="sm" className="font-medium">
                Reinforcement
              </Button>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">State: All</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
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
                      onClick={() => router.push(`/deploy/fine-tuning/${row.original.id}`)}
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
                      No results.
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