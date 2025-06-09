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
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Copy, Key, MoreHorizontal, Plus, Eye, EyeOff, ArrowLeft, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ApiKeysGetStarted } from '@/components/get-started/api-keys-content';

type ApiKey = {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  usage: number;
  status: 'active' | 'revoked';
};

const mockData: ApiKey[] = [
  {
    id: '1',
    name: 'Production API Key',
    key: 'sk-prod-1234567890abcdef',
    created: '2024-01-15',
    lastUsed: '2 hours ago',
    usage: 125420,
    status: 'active',
  },
  {
    id: '2',
    name: 'Development API Key',
    key: 'sk-dev-abcdef1234567890',
    created: '2024-01-10',
    lastUsed: '1 day ago',
    usage: 5420,
    status: 'active',
  },
  {
    id: '3',
    name: 'Testing API Key',
    key: 'sk-test-fedcba0987654321',
    created: '2024-01-05',
    lastUsed: 'Never',
    usage: 0,
    status: 'revoked',
  },
];

export default function ApiKeysPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: 'API key has been copied to your clipboard.',
    });
  };

  const createNewKey = () => {
    if (!newKeyName) return;
    
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `sk-${Math.random().toString(36).substring(2, 15)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      usage: 0,
      status: 'active',
    };
    
    setApiKeys(prev => [newKey, ...prev]);
    setNewKeyName('');
    setIsCreateDialogOpen(false);
    
    toast({
      title: 'API key created',
      description: 'Your new API key has been created successfully.',
    });
  };

  const handleCreateFirstApiKey = () => {
    setNewKeyName('My First API Key');
    setIsCreateDialogOpen(true);
  };

  const revokeKey = (keyId: string) => {
    setApiKeys(prev => prev.map(key => 
      key.id === keyId ? { ...key, status: 'revoked' as const } : key
    ));
    
    toast({
      title: 'API key revoked',
      description: 'The API key has been revoked and can no longer be used.',
    });
  };

  const columns: ColumnDef<ApiKey>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
            <Key className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="font-medium text-foreground">{row.getValue('name')}</div>
            <div className="text-xs text-muted-foreground">{row.original.created}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'key',
      header: 'Key',
      cell: ({ row }) => {
        const isVisible = showKeys[row.original.id];
        return (
          <div className="flex items-center gap-2">
            <code className="text-sm font-mono">
              {isVisible 
                ? row.original.key 
                : `${row.original.key.substring(0, 7)}${'•'.repeat(20)}`}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleKeyVisibility(row.original.id)}
              className="h-6 w-6 p-0"
            >
              {isVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(row.original.key)}
              className="h-6 w-6 p-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: 'lastUsed',
      header: 'Last Used',
      cell: ({ row }) => (
        <span className="text-sm">{row.getValue('lastUsed')}</span>
      ),
    },
    {
      accessorKey: 'usage',
      header: 'Usage',
      cell: ({ row }) => (
        <span className="text-sm font-medium">{(row.getValue('usage') as number).toLocaleString()}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge 
            variant={status === 'active' ? 'default' : 'secondary'}
            className={
              status === 'active' 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
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
            <DropdownMenuItem
              onClick={() => copyToClipboard(row.original.key)}
              className="cursor-pointer"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy key
            </DropdownMenuItem>
            {row.original.status === 'active' && (
              <DropdownMenuItem
                className="cursor-pointer text-destructive"
                onClick={() => revokeKey(row.original.id)}
              >
                Revoke key
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data: apiKeys,
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
        <h1 className="text-lg font-semibold tracking-tight">API Keys</h1>
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
          {apiKeys.length === 0 ? (
            <div>
              <ApiKeysGetStarted onCreateApiKey={handleCreateFirstApiKey} />
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight mb-2">API Keys</h1>
                  <p className="text-muted-foreground">Manage API keys for accessing your deployments programmatically</p>
                </div>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create API Key
                </Button>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search API keys..."
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
                          No API keys found.
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

              {/* Usage Instructions */}
              <Card className="border border-border/60 shadow-sm bg-card/50 backdrop-blur-sm mt-6">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Using API Keys</h3>
                  <p className="text-muted-foreground mb-4">
                    Include your API key in the Authorization header of your requests.
                  </p>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <pre className="text-sm overflow-x-auto">
                      <code className="text-muted-foreground">
{`curl https://api.radium.ai/v1/models/your-model-id \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "Hello, world!"}'`}
                      </code>
                    </pre>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
        
        {/* Create API Key Dialog - Available globally */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                Create a new API key for accessing your deployments.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Key Name*</Label>
                <Input
                  id="name"
                  placeholder="e.g., Production API Key"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={createNewKey}
                  disabled={!newKeyName}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Create Key
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}