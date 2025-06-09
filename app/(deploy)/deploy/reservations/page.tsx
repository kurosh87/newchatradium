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
import { ArrowLeft, Search, Calendar, Clock, Cpu } from 'lucide-react';
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
import Link from 'next/link';

type Reservation = {
  id: string;
  instance: string;
  region: string;
  status: 'Active' | 'Pending' | 'Completed';
  startTime: string;
  duration: string;
  cost: string;
};

const data: Reservation[] = [
  {
    id: '1',
    instance: 'H100 - 8x GPU',
    region: 'US-West',
    status: 'Active',
    startTime: '2024-01-15 14:30',
    duration: '2 hours',
    cost: '$45.60',
  },
  {
    id: '2',
    instance: 'A100 - 4x GPU',
    region: 'US-East',
    status: 'Pending',
    startTime: '2024-01-16 09:00',
    duration: '1 hour',
    cost: '$28.50',
  },
];

const columns: ColumnDef<Reservation>[] = [
  {
    accessorKey: 'instance',
    header: 'Instance',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
          <Cpu className="h-4 w-4 text-blue-500" />
        </div>
        <div>
          <div className="font-medium text-foreground">{row.getValue('instance')}</div>
          <div className="text-xs text-muted-foreground">{row.original.region}</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge 
          variant={status === 'Active' ? 'default' : status === 'Pending' ? 'secondary' : 'outline'}
          className={
            status === 'Active' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
              : status === 'Pending' 
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'startTime',
    header: 'Start Time',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">{row.getValue('startTime')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'duration',
    header: 'Duration',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">{row.getValue('duration')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'cost',
    header: 'Cost',
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue('cost')}</span>
    ),
  },
];

export default function ReservationsPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

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
      <header className="flex sticky top-0 z-[100] bg-gradient-to-r from-background/80 via-muted/40 to-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-gradient-to-r supports-[backdrop-filter]:from-background/60 supports-[backdrop-filter]:via-muted/20 supports-[backdrop-filter]:to-background/60 py-1.5 items-center px-2 md:px-2 gap-2 border-b border-border/60">
        <SidebarToggle />
        <h1 className="text-lg font-semibold tracking-tight">Reservations</h1>
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
              <h1 className="text-2xl font-semibold tracking-tight mb-2">Reservations</h1>
              <p className="text-muted-foreground">Manage your compute reservations and scheduled instances</p>
            </div>
            <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 font-medium">
              New Reservation
            </Button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reservations..."
                value={(table.getColumn('instance')?.getFilterValue() as string) ?? ''}
                onChange={(event) =>
                  table.getColumn('instance')?.setFilterValue(event.target.value)
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
                      No reservations found.
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
        </div>
      </div>
    </div>
  );
}