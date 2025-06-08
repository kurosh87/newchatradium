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
import { ArrowLeft, Search, Shield, MoreHorizontal, Eye, EyeOff, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

type Secret = {
  id: string;
  name: string;
  environment: string;
  created: string;
  lastUsed: string;
  value: string;
};

const data: Secret[] = [
  {
    id: '1',
    name: 'DATABASE_URL',
    environment: 'Production',
    created: '2024-01-15',
    lastUsed: '2 hours ago',
    value: 'postgresql://user:password@localhost:5432/db',
  },
  {
    id: '2',
    name: 'API_SECRET_KEY',
    environment: 'Development',
    created: '2024-01-10',
    lastUsed: '1 day ago',
    value: 'sk-1234567890abcdef',
  },
];

export default function SecretsPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [visibleSecrets, setVisibleSecrets] = useState<Set<string>>(new Set());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newSecretName, setNewSecretName] = useState('');
  const [newSecretValue, setNewSecretValue] = useState('');

  const toggleSecretVisibility = (secretId: string) => {
    const newSet = new Set(visibleSecrets);
    if (newSet.has(secretId)) {
      newSet.delete(secretId);
    } else {
      newSet.add(secretId);
    }
    setVisibleSecrets(newSet);
  };

  const handleCreateSecret = () => {
    // Handle create secret logic here
    setIsCreateOpen(false);
    setNewSecretName('');
    setNewSecretValue('');
  };

  const columns: ColumnDef<Secret>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
            <Shield className="h-4 w-4 text-green-500" />
          </div>
          <div>
            <div className="font-medium text-foreground">{row.getValue('name')}</div>
            <div className="text-xs text-muted-foreground">{row.original.environment}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'value',
      header: 'Value',
      cell: ({ row }) => {
        const isVisible = visibleSecrets.has(row.original.id);
        return (
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm">
              {isVisible ? row.original.value : '••••••••••••'}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSecretVisibility(row.original.id)}
              className="h-6 w-6 p-0"
            >
              {isVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: 'created',
      header: 'Created',
      cell: ({ row }) => (
        <span className="text-sm">{row.getValue('created')}</span>
      ),
    },
    {
      accessorKey: 'lastUsed',
      header: 'Last Used',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.getValue('lastUsed')}</span>
      ),
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
        <h1 className="text-lg font-semibold tracking-tight">Secrets</h1>
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
              <h1 className="text-2xl font-semibold tracking-tight mb-2">Secrets</h1>
              <p className="text-muted-foreground">Securely store and manage environment variables and sensitive data</p>
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 font-medium">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Secret
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create Secret</DialogTitle>
                  <DialogDescription>
                    Add a new secret to securely store sensitive data.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="secret-name">Name*</Label>
                    <Input
                      id="secret-name"
                      placeholder="e.g., DATABASE_URL"
                      value={newSecretName}
                      onChange={(e) => setNewSecretName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secret-value">Value*</Label>
                    <Input
                      id="secret-value"
                      type="password"
                      placeholder="Enter secret value"
                      value={newSecretValue}
                      onChange={(e) => setNewSecretValue(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button 
                      onClick={handleCreateSecret}
                      disabled={!newSecretName || !newSecretValue}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Create Secret
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search secrets..."
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
                      No secrets found.
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