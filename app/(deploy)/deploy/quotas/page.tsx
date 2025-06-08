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
import { MoreHorizontal, ArrowUpDown, Search, ArrowLeft, ExternalLink, Gauge } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

type Quota = {
  id: string;
  name: string;
  quotaId: string;
  value: number;
  maxValue: number;
};

const data: Quota[] = [
  {
    id: '1',
    name: 'AP Tokyo 1 - H100 Count',
    quotaId: 'ap-tokyo-1--h100-count',
    value: 0,
    maxValue: 0,
  },
  {
    id: '2',
    name: 'Deployed Model Count',
    quotaId: 'deployed-model-count',
    value: 100,
    maxValue: 100,
  },
  {
    id: '3',
    name: 'EU Frankfurt 1 - H100 Count',
    quotaId: 'eu-frankfurt-1--h100-count',
    value: 0,
    maxValue: 0,
  },
  {
    id: '4',
    name: 'GLOBAL - A100 Count',
    quotaId: 'global--a100-count',
    value: 8,
    maxValue: 8,
  },
];

export default function QuotasPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columns: ColumnDef<Quota>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
            <Gauge className="h-4 w-4 text-purple-500" />
          </div>
          <div>
            <div className="font-medium text-foreground">{row.getValue('name')}</div>
            <div className="text-xs text-muted-foreground mt-0.5 font-mono">ID: {row.original.quotaId}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'value',
      header: () => <div className="text-center">Value</div>,
      cell: ({ row }) => {
        const value = row.getValue('value') as number;
        const maxValue = row.original.maxValue;
        const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
        const getColor = () => {
          if (percentage >= 90) return 'text-red-600';
          if (percentage >= 70) return 'text-yellow-600';
          return 'text-green-600';
        };
        
        return (
          <div className="text-center">
            <span className={`font-medium ${getColor()}`}>{value}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'maxValue',
      header: () => <div className="text-center">Max Value</div>,
      cell: ({ row }) => {
        const maxValue = row.getValue('maxValue') as number;
        return <div className="text-center font-medium">{maxValue}</div>;
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
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
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Request Increase
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Usage History
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
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
      <header className="flex sticky top-0 bg-background/95 backdrop-blur-sm py-1.5 items-center px-2 md:px-2 gap-2 border-b border-border/40">
        <SidebarToggle />
        <h1 className="text-lg font-semibold tracking-tight">Quotas</h1>
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
              <h1 className="text-2xl font-semibold tracking-tight mb-2">Quotas</h1>
              <div className="flex items-start gap-2">
                <p className="text-muted-foreground">Quotas are service limits for your account.</p>
                <Link href="#" className="text-orange-600 hover:text-orange-700 hover:underline text-sm">
                  Learn more
                </Link>
              </div>
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
                      No quotas found.
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