'use client';

import { useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown, Plus, Zap, Activity, CheckCircle, AlertCircle, Clock, Eye, Edit, Trash2, Copy, Settings, Server, Search, ArrowLeft, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '../../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { Input } from '../../../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { Badge } from '../../../components/ui/badge';
import { SidebarToggle } from '../../../components/sidebar-toggle';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Card } from '../../../components/ui/card';
import { DeploymentsGetStarted } from '../../../components/get-started/deployments-content';
import Link from 'next/link';

// Mock data for deployments
type Deployment = {
  id: string;
  name: string;
  model: string;
  status: 'active' | 'inactive' | 'deploying' | 'failed';
  endpoint: string;
  created: string;
  lastActive: string;
  requests: number;
  cost: string;
};

// Mock deployments data - empty initially to show get-started experience
const mockDeployments: Deployment[] = [
  // Uncomment to show table view:
  // {
  //   id: '1',
  //   name: 'radium/DeepSeek-R1-0528',
  //   model: 'DeepSeek-R1-0528',
  //   status: 'active',
  //   endpoint: 'https://api.radium.ai/v1/models/deepseek-r1',
  //   created: '2024-01-15',
  //   lastActive: '2 hours ago',
  //   requests: 15420,
  //   cost: '$125.50',
  // },
  // {
  //   id: '2',
  //   name: 'radium/Qwen3-30B-A3B',
  //   model: 'Qwen3-30B-A3B',
  //   status: 'active',
  //   endpoint: 'https://api.radium.ai/v1/models/qwen3-30b',
  //   created: '2024-01-10',
  //   lastActive: '5 minutes ago',
  //   requests: 28350,
  //   cost: '$240.00',
  // },
  // {
  //   id: '3',
  //   name: 'radium/DeepSeek-Prover-V2',
  //   model: 'DeepSeek-Prover-V2-671B',
  //   status: 'deploying',
  //   endpoint: 'https://api.radium.ai/v1/models/prover-v2',
  //   created: '2024-01-20',
  //   lastActive: 'Deploying...',
  //   requests: 0,
  //   cost: '$0.00',
  // },
];

export default function DeploymentsPage() {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [deployments, setDeployments] = useState<Deployment[]>(mockDeployments);

  const columns: ColumnDef<Deployment>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Deployments
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
            <Server className="h-4 w-4 text-purple-500" />
          </div>
          <div>
            <div className="font-medium text-foreground">{row.getValue('name')}</div>
            <div className="text-xs text-muted-foreground mt-0.5">ID: {row.original.id}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const getStatusConfig = (status: string) => {
          switch (status) {
            case 'active':
              return { color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300', icon: CheckCircle };
            case 'deploying':
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
    },
    {
      accessorKey: 'model',
      header: 'Model',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue('model')}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Base model</div>
        </div>
      ),
    },
    {
      accessorKey: 'lastActive',
      header: 'Last Active',
      cell: ({ row }) => <span className="text-sm">{row.getValue('lastActive')}</span>,
    },
    {
      accessorKey: 'created',
      header: 'Created on',
      cell: ({ row }) => (
        <div>
          <div className="text-sm">{row.getValue('created')}</div>
          <div className="text-xs text-muted-foreground">1:44 AM</div>
        </div>
      ),
    },
    {
      accessorKey: 'requests',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Requests
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const requests = row.getValue('requests') as number;
        return <div className="text-right">{requests.toLocaleString()}</div>;
      },
    },
    {
      accessorKey: 'cost',
      header: () => <div className="text-right">Cost</div>,
      cell: ({ row }) => {
        const cost = row.getValue('cost') as string;
        return <div className="text-right font-medium">{cost}</div>;
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const deployment = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0 hover:bg-muted/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="cursor-pointer">
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => navigator.clipboard.writeText(deployment.endpoint)}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Endpoint
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                View Logs
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Deployment
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: deployments,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-muted/20 font-sans">
      <header className="flex sticky top-0 z-[100] bg-gradient-to-r from-background/80 via-muted/40 to-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-gradient-to-r supports-[backdrop-filter]:from-background/60 supports-[backdrop-filter]:via-muted/20 supports-[backdrop-filter]:to-background/60 py-1.5 items-center px-2 md:px-2 gap-2 border-b border-border/60">
        <SidebarToggle />
        <h1 className="text-lg font-semibold tracking-tight">Deployments</h1>
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
          {/* Conditional rendering: Get-Started vs Table View */}
          {deployments.length === 0 ? (
            /* Get-Started Experience */
            <div>
              <DeploymentsGetStarted />
            </div>
          ) : (
            /* Table View */
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight mb-2">Deployments</h1>
                  <p className="text-muted-foreground">Manage your model deployments on dedicated infrastructure.</p>
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
                    onClick={() => router.push('/deploy/new')}
                  >
                    New Deployment
                  </Button>
                </div>
              </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                onChange={(event) =>
                  table.getColumn('name')?.setFilterValue(event.target.value)
                }
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="font-medium">
                Active
              </Button>
              <Button variant="outline" size="sm" className="font-medium">
                Inactive
              </Button>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Status: All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="deploying">Deploying</SelectItem>
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
                      data-state={row.getIsSelected() && 'selected'}
                      className="group hover:bg-muted/50 transition-all duration-200 hover:shadow-sm border-b border-border/40"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-6 border-b border-border/40">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No deployments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}