'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Bell, Search, PanelLeftOpen, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NOTIFICATIONS, CURRENT_USER } from '@/lib/mock-data';
import { NotificationsPopover } from './notifications-popover';
import { useAuth } from '@/providers/auth-provider';

const BREADCRUMB_MAP: Record<string, string> = {
  '': 'Home',
  dashboard: 'Dashboard',
  issues: 'Issues',
  docs: 'Docs',
  projects: 'Projects',
  analytics: 'Analytics',
  members: 'Members',
  settings: 'Settings',
  inbox: 'Inbox',
  profile: 'Profile',
  workspace: 'Workspace',
  billing: 'Billing',
  notifications: 'Notifications',
  integrations: 'Integrations',
  'api-keys': 'API Keys',
};

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
}

export function Header({ sidebarOpen, onToggleSidebar, onOpenSearch }: HeaderProps) {
  const pathname = usePathname();
  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

  const segments = pathname.split('/').filter(Boolean);
  const crumbs = [
    { label: 'Acme Corp', href: '/' },
    ...segments.map((seg, i) => ({
      label: BREADCRUMB_MAP[seg] ?? seg.replace(/-/g, ' '),
      href: '/' + segments.slice(0, i + 1).join('/'),
    })),
  ];

  return (
    <header className="flex items-center h-12 px-4 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-20 gap-3">
      {!sidebarOpen && (
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0"
        >
          <PanelLeftOpen size={16} />
        </button>
      )}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 flex-1 min-w-0">
        {crumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={13} className="text-muted-foreground/50 flex-shrink-0" />}
            <Link
              href={crumb.href}
              className={cn(
                'text-sm truncate max-w-[160px] transition-colors',
                i === crumbs.length - 1
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {crumb.label}
            </Link>
          </span>
        ))}
      </nav>

      {/* Search */}
      <button
        onClick={onOpenSearch}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-muted/50 text-muted-foreground text-sm hover:border-primary/50 hover:text-foreground transition-all w-48"
      >
        <Search size={13} />
        <span className="flex-1 text-left text-xs">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono rounded border border-border bg-background text-muted-foreground">
          ⌘K
        </kbd>
      </button>

      {/* Notifications */}
      <NotificationsPopover unreadCount={unreadCount} />

      {/* Avatar */}
      <Link href="/settings/profile">
        <img
          src={CURRENT_USER.avatar}
          alt={CURRENT_USER.name}
          className="w-7 h-7 rounded-full ring-2 ring-border hover:ring-primary/50 transition-all cursor-pointer"
        />
      </Link>
    </header>
  );
}
