'use client';

import { useState } from 'react';
import { ArrowLeft, Database, Download, Edit, Search, RefreshCw } from 'lucide-react';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

// Mock dataset detail data
const datasetDetail = {
  id: '1',
  name: 'sample-finetune-data',
  description: 'View and manage your dataset details',
  size: '2.4 MB',
  examples: 5,
  created: '2024-01-15',
  status: 'ready',
  format: 'JSONL',
};

const exampleData = [
  {
    row: 1,
    prompt: 'What is the capital of France?',
    completion: 'The capital of France is Paris.',
  },
  {
    row: 2,
    prompt: 'Translate \'hello\' to Spanish.',
    completion: '\'Hello\' in Spanish is \'Hola\'.',
  },
  {
    row: 3,
    prompt: 'Who wrote Hamlet?',
    completion: 'Hamlet was written by William Shakespeare.',
  },
  {
    row: 4,
    prompt: 'What is 2 + 2?',
    completion: '2 + 2 equals 4.',
  },
  {
    row: 5,
    prompt: 'Describe the color blue.',
    completion: 'Blue is a primary color often associated with the sky, sea, calmness, and stability.',
  },
];

export default function DatasetDetailPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [columnFilter, setColumnFilter] = useState('prompt');
  const [selectedExample, setSelectedExample] = useState<typeof exampleData[0] | null>(null);

  const filteredData = exampleData.filter(item => 
    String(item[columnFilter as keyof typeof item]).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-muted/20 font-sans">
      <header className="flex sticky top-0 bg-background/95 backdrop-blur-sm py-1.5 items-center px-2 md:px-2 gap-2 border-b border-border/40">
        <SidebarToggle />
        <h1 className="text-lg font-semibold tracking-tight">{datasetDetail.name}</h1>
        <Link href="/deploy/datasets" className="hidden md:block order-4 md:ml-auto">
          <Button variant="outline" className="flex items-center gap-2 text-sm py-1.5 h-8 px-4 rounded-lg border-border/40 hover:border-border transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Datasets
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
              <h1 className="text-2xl font-semibold tracking-tight mb-2">{datasetDetail.name}</h1>
              <p className="text-muted-foreground">{datasetDetail.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>

          {/* Dataset Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6">
            <Card className="border border-border/60 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Examples</span>
                </div>
                <div className="text-2xl font-bold">{datasetDetail.examples}</div>
              </CardContent>
            </Card>
            <Card className="border border-border/60 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">Size</span>
                </div>
                <div className="text-2xl font-bold">{datasetDetail.size}</div>
              </CardContent>
            </Card>
            <Card className="border border-border/60 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">Format</span>
                </div>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  {datasetDetail.format}
                </Badge>
              </CardContent>
            </Card>
            <Card className="border border-border/60 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">Status</span>
                </div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  {datasetDetail.status}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <Card className="border border-border/60 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Preview</CardTitle>
                  <CardDescription>Total examples: {datasetDetail.examples}</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
              
              {/* Search and Filter */}
              <div className="flex items-center gap-4 mt-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search examples..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={columnFilter} onValueChange={setColumnFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prompt">prompt</SelectItem>
                    <SelectItem value="completion">completion</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-b border-border/60">
                    <TableHead className="font-semibold text-foreground/80 py-4 w-16">Row</TableHead>
                    <TableHead className="font-semibold text-foreground/80 py-4">prompt</TableHead>
                    <TableHead className="font-semibold text-foreground/80 py-4">completion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow 
                      key={item.row} 
                      className="group hover:bg-muted/50 transition-all duration-200 hover:shadow-sm border-b border-border/40 cursor-pointer"
                      onClick={() => setSelectedExample(item)}
                    >
                      <TableCell className="py-4 border-b border-border/40 text-sm font-medium">
                        {item.row}
                      </TableCell>
                      <TableCell className="py-4 border-b border-border/40 max-w-md">
                        <div className="truncate text-sm">{item.prompt}</div>
                      </TableCell>
                      <TableCell className="py-4 border-b border-border/40 max-w-md">
                        <div className="truncate text-sm">{item.completion}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              <div className="p-4 border-t border-border/40">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing 1 to 5 of 5 results
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Badge variant="default" className="bg-purple-500 text-white">
                      1
                    </Badge>
                    <Button variant="outline" size="sm" disabled>
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Example Detail Modal/Panel */}
          {selectedExample && (
            <Card className="mt-6 border border-border/60 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Example #{selectedExample.row}</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-4 right-4"
                  onClick={() => setSelectedExample(null)}
                >
                  ✕
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-orange-600">prompt:</Label>
                    <div className="mt-1 p-3 bg-muted/50 rounded-md">
                      <code className="text-sm">&quot;{selectedExample.prompt}&quot;</code>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-orange-600">completion:</Label>
                    <div className="mt-1 p-3 bg-muted/50 rounded-md">
                      <code className="text-sm">&quot;{selectedExample.completion}&quot;</code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}