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
import { ArrowLeft, Search, Database, Plus, MoreHorizontal, Download, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { DatasetsGetStarted } from '@/components/get-started/datasets-content';

type Dataset = {
  id: string;
  name: string;
  description: string;
  size: string;
  examples: number;
  created: string;
  status: 'ready' | 'processing' | 'error';
  format: 'JSONL' | 'CSV' | 'TSV';
};

const mockData: Dataset[] = [
  {
    id: '1',
    name: 'sample-finetune-data',
    description: 'Sample dataset for fine-tuning experiments',
    size: '2.4 MB',
    examples: 1500,
    created: '2024-01-15',
    status: 'ready',
    format: 'JSONL',
  },
  {
    id: '2',
    name: 'demo-gsm8k-math-dataset-1000',
    description: 'Mathematical reasoning dataset with grade school problems',
    size: '856 KB',
    examples: 1000,
    created: '2024-01-10',
    status: 'ready',
    format: 'JSONL',
  },
  {
    id: '3',
    name: 'custom-instruction-dataset',
    description: 'Custom instruction-following dataset for specific use cases',
    size: '1.2 MB',
    examples: 750,
    created: '2024-01-08',
    status: 'processing',
    format: 'JSONL',
  },
];

export default function DatasetsPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [datasets, setDatasets] = useState<Dataset[]>([]);

  const handleCreateFirstDataset = () => {
    // Redirect to create page
    window.location.href = '/deploy/datasets/create';
  };

  const columns: ColumnDef<Dataset>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
            <Database className="h-4 w-4 text-green-500" />
          </div>
          <div>
            <div className="font-medium text-foreground">{row.getValue('name')}</div>
            <div className="text-xs text-muted-foreground">{row.original.description}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'format',
      header: 'Format',
      cell: ({ row }) => (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
          {row.getValue('format')}
        </Badge>
      ),
    },
    {
      accessorKey: 'examples',
      header: 'Examples',
      cell: ({ row }) => (
        <span className="text-sm font-medium">{(row.getValue('examples') as number).toLocaleString()}</span>
      ),
    },
    {
      accessorKey: 'size',
      header: 'Size',
      cell: ({ row }) => (
        <span className="text-sm">{row.getValue('size')}</span>
      ),
    },
    {
      accessorKey: 'created',
      header: 'Created',
      cell: ({ row }) => (
        <span className="text-sm">{row.getValue('created')}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge 
            variant={status === 'ready' ? 'default' : status === 'processing' ? 'secondary' : 'destructive'}
            className={
              status === 'ready' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                : status === 'processing' 
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={`/deploy/datasets/${row.original.id}`} className="cursor-pointer">
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Download className="mr-2 h-4 w-4" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data: datasets,
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
        <h1 className="text-lg font-semibold tracking-tight">Datasets</h1>
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
          {datasets.length === 0 ? (
            <div>
              <DatasetsGetStarted onUploadDataset={handleCreateFirstDataset} />
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight mb-2">Datasets</h1>
                  <p className="text-muted-foreground">Manage your training datasets for fine-tuning and model development</p>
                </div>
                <Button asChild className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 font-medium">
                  <Link href="/deploy/datasets/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Dataset
                  </Link>
                </Button>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search datasets..."
                    value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                    onChange={(event) =>
                      table.getColumn('name')?.setFilterValue(event.target.value)
                    }
                    className="pl-10"
                  />
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
                          className="group hover:bg-muted/50 transition-all duration-200 hover:shadow-sm border-b border-border/40"
                          data-state={row.getIsSelected() && 'selected'}
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
                          No datasets found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>

              <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                  {table.getFilteredSelectedRowModel().rows.length} of{' '}
                  {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}