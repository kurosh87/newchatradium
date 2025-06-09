'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { ArrowLeft, Plus, MoreHorizontal, Trash2, Edit, Search, Users } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User';
  since: string;
}

export default function UsersPage() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'Admin' | 'User'>('User');

  const [searchQuery, setSearchQuery] = useState('');
  const [members] = useState<Member[]>([
    {
      id: '1',
      name: 'kampfer87-4883ac',
      email: 'kampfer87@protonmail.com',
      role: 'Admin',
      since: 'Apr 16, 2025',
    },
  ]);

  const handleAddUser = () => {
    if (newUserName && newUserEmail) {
      console.log('Adding user:', { name: newUserName, email: newUserEmail, role: newUserRole });
      setNewUserName('');
      setNewUserEmail('');
      setNewUserRole('User');
      setIsAddUserOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-muted/20 font-sans">
      <header className="flex sticky top-0 z-[100] bg-gradient-to-r from-background/80 via-muted/40 to-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-gradient-to-r supports-[backdrop-filter]:from-background/60 supports-[backdrop-filter]:via-muted/20 supports-[backdrop-filter]:to-background/60 py-1.5 items-center px-2 md:px-2 gap-2 border-b border-border/60">
        <SidebarToggle />
        <h1 className="text-lg font-semibold tracking-tight">Users</h1>
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
              <h1 className="text-2xl font-semibold tracking-tight mb-2">Members</h1>
              <p className="text-muted-foreground">Members can have one of two roles: <strong>Admin</strong> or <strong>User</strong></p>
            </div>
            <div className="flex gap-3">
              <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 font-medium">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add user</DialogTitle>
                    <DialogDescription>
                      Add a new user to your account.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Admin users are able to add and remove users from the account. Users 
                      will have access to resources like models, deployments, and billing 
                      within the account.
                    </p>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name*</Label>
                        <Input
                          id="name"
                          placeholder="Enter a name"
                          value={newUserName}
                          onChange={(e) => setNewUserName(e.target.value)}
                          className="border-orange-200 focus:border-orange-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email*</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter an e-mail"
                          value={newUserEmail}
                          onChange={(e) => setNewUserEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role*</Label>
                        <Select value={newUserRole} onValueChange={(value: 'Admin' | 'User') => setNewUserRole(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="User">User</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button 
                        onClick={handleAddUser}
                        disabled={!newUserName || !newUserEmail}
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        Add user
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                className="pl-10"
              />
            </div>
          </div>

          {/* Table */}
          <Card className="border border-border/60 shadow-sm hover:shadow-md transition-shadow duration-200 bg-card/50 backdrop-blur-sm">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="border-b border-border/60">
                  <TableHead className="font-semibold text-foreground/80 py-4">Name</TableHead>
                  <TableHead className="font-semibold text-foreground/80 py-4">Role</TableHead>
                  <TableHead className="font-semibold text-foreground/80 py-4">Since</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow 
                    key={member.id} 
                    className="group hover:bg-muted/50 transition-all duration-200 hover:shadow-sm border-b border-border/40"
                  >
                    <TableCell className="py-6 border-b border-border/40">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                          <Users className="h-4 w-4 text-purple-500" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{member.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{member.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-6 border-b border-border/40">
                      <Select value={member.role} disabled={member.role === 'Admin'}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="User">User</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="py-6 border-b border-border/40">
                      <div>
                        <div className="text-sm">{member.since}</div>
                        <div className="text-xs text-muted-foreground">11:35 PM</div>
                      </div>
                    </TableCell>
                    <TableCell className="py-6 border-b border-border/40">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}