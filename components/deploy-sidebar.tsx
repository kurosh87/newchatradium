'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { type User } from 'next-auth';

import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { SidebarUserNav } from './sidebar-user-nav';
import { 
  LayoutDashboard, 
  BarChart, 
  Layers, 
  Key, 
  FileText, 
  User2, 
  CreditCard,
  ArrowLeft,
  PlusCircle,
  Brain,
  MessageSquare,
  Zap,
  MessageCircle,
  HelpCircle,
  Settings,
  Users,
  Shield,
  Gauge,
  Calendar,
  Receipt,
  Database
} from 'lucide-react';
import { RainbowButton } from '@/components/magicui/rainbow-button';

export function DeploySidebar({ user }: { user: User | undefined }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  const navItems = [
    {
      name: 'Dashboard',
      href: '/deploy/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Deployments',
      href: '/deploy',
      icon: Layers,
    },
    {
      name: 'Playground',
      href: '/deploy/playground',
      icon: MessageSquare,
    },
    {
      name: 'Models',
      href: '/deploy/models',
      icon: Brain,
    },
    {
      name: 'Datasets',
      href: '/deploy/datasets',
      icon: Database,
    },
    {
      name: 'Fine-Tuning',
      href: '/deploy/fine-tuning',
      icon: Zap,
    },
    {
      name: 'Analytics & Usage',
      href: '/deploy/analytics',
      icon: BarChart,
    },
  ];

  const bottomNavItems = [
    {
      name: 'Slack',
      href: '#',
      icon: MessageCircle,
    },
    {
      name: 'Docs',
      href: '/deploy/docs',
      icon: HelpCircle,
    },
  ];

  const accountItems = [
    {
      name: 'Settings',
      href: '/deploy/settings',
      icon: Settings,
    },
    {
      name: 'Users',
      href: '/deploy/users',
      icon: Users,
    },
    {
      name: 'API Keys',
      href: '/deploy/api-keys',
      icon: Key,
    },
    {
      name: 'Secrets',
      href: '/deploy/secrets',
      icon: Shield,
    },
    {
      name: 'Quotas',
      href: '/deploy/quotas',
      icon: Gauge,
    },
    {
      name: 'Reservations',
      href: '/deploy/reservations',
      icon: Calendar,
    },
    {
      name: 'Billing',
      href: '/deploy/billing',
      icon: Receipt,
    },
  ];

  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between py-2 px-2">
              <Link href="/deploy/dashboard" className="flex items-center gap-2">
                <span className="w-7 h-7 border-2 border-current flex items-end justify-center pb-0.5 text-xs font-bold">
                  Ra
                </span>
                <span className="font-semibold text-lg">Radium</span>
              </Link>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem className="pt-2">
            <RainbowButton
              variant="outline"
              size="default"
              className="w-full justify-center gap-2 rounded-lg h-10"
              onClick={() => router.push('/deploy/new')}
            >
              <PlusCircle className="w-4 h-4" />
              New Deployment
            </RainbowButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    onClick={() => setOpenMobile(false)}
                  >
                    <Link href={item.href}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <div className="mt-auto">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {bottomNavItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild onClick={() => setOpenMobile(false)}>
                      <Link href={item.href}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
      <SidebarFooter className="border-t">
        {user && <SidebarUserNav user={user} accountItems={accountItems} />}
      </SidebarFooter>
    </Sidebar>
  );
}