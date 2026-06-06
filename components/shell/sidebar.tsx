'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Inbox,
  CheckSquare,
  FileText,
  BarChart2,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  Star,
  Eye,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Zap,
  Palette,
  Smartphone,
  BarChart,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { WORKSPACES, PROJECTS, NOTIFICATIONS, CURRENT_USER } from '@/lib/mock-data';
import { WorkspaceSwitcher } from './workspace-switcher';
import { ThemeToggle } from './theme-toggle';
import { useAuth } from '@/providers/auth-provider';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

const PROJECT_ICONS: Record<string, React.ElementType> = {
  Zap,
  Palette,
  Smartphone,
  BarChart2: BarChart,
};

const NAV_ITEMS = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/inbox', icon: Inbox, label: 'Inbox', badge: 3 },
  { href: '/issues', icon: CheckSquare, label: 'My Work' },
];

export function Sidebar({ open, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set(['p-1']));
  const { signOut } = useAuth();

  const toggleProject = (id: string) => {
    setExpandedProjects(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

  if (!open) {
    return (
      <div className="flex flex-col items-center w-14 flex-shrink-0 border-r border-border py-3 gap-1"
        style={{ background: 'hsl(var(--sidebar-bg))' }}>
        <button
          onClick={onToggle}
          className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <PanelLeftOpen size={18} />
        </button>
        {NAV_ITEMS.map(item => (
          <Link key={item.href} href={item.href}>
            <div className={cn(
              'p-2 rounded-md transition-colors relative',
              pathname === item.href
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}>
              <item.icon size={18} />
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold bg-primary text-white rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
          </Link>
        ))}
        <div className="w-8 h-px bg-border my-1" />
        {PROJECTS.map(project => {
          const Icon = PROJECT_ICONS[project.icon] || Zap;
          return (
            <Link key={project.id} href={`/projects/${project.id}`} title={project.name}>
              <div className="p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <div className="w-4 h-4 rounded-sm flex items-center justify-center" style={{ background: project.color }}>
                  <Icon size={10} className="text-white" />
                </div>
              </div>
            </Link>
          );
        })}
        <div className="mt-auto">
          <button
            onClick={() => signOut()}
            className="p-2 rounded-md text-muted-foreground hover:text-red-500 hover:bg-muted transition-colors"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
          <Link href="/settings/profile">
            <img src={CURRENT_USER.avatar} alt={CURRENT_USER.name} className="w-7 h-7 rounded-full ring-2 ring-border mt-2" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col w-60 flex-shrink-0 border-r border-border overflow-hidden transition-all duration-300"
      style={{ background: 'hsl(var(--sidebar-bg))' }}
    >
      {/* Workspace Switcher */}
      <div className="px-3 py-3 border-b border-border">
        <WorkspaceSwitcher workspaces={WORKSPACES} currentWorkspaceId="ws-1" />
      </div>

      {/* Collapse button */}
      <button
        onClick={onToggle}
        className="absolute left-[228px] top-[56px] z-10 w-6 h-6 rounded-full border border-border bg-background flex items-center justify-center shadow-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <PanelLeftClose size={12} />
      </button>

      <div className="flex-1 overflow-y-auto scrollbar-thin py-2">
        {/* Main Nav */}
        <div className="px-2 mb-2">
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                'sidebar-item',
                pathname === item.href && 'active'
              )}>
                <item.icon size={16} />
                <span>{item.label}</span>
                {item.label === 'Inbox' && unreadCount > 0 && (
                  <span className="ml-auto text-[11px] font-semibold bg-primary text-white rounded-full px-1.5 py-0.5 leading-none">
                    {unreadCount}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="px-4 py-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">Projects</span>
        </div>

        {/* Projects */}
        <div className="px-2">
          {PROJECTS.map(project => {
            const Icon = PROJECT_ICONS[project.icon] || Zap;
            const isExpanded = expandedProjects.has(project.id);
            const isProjectActive = pathname.startsWith(`/projects/${project.id}`);
            return (
              <div key={project.id}>
                <div className={cn('flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer text-sm transition-colors group', isProjectActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
                  <button
                    onClick={() => toggleProject(project.id)}
                    className="flex-shrink-0 w-4 h-4 flex items-center justify-center"
                  >
                    {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  </button>
                  <div className="w-4 h-4 rounded-sm flex items-center justify-center flex-shrink-0" style={{ background: project.color }}>
                    <Icon size={9} className="text-white" />
                  </div>
                  <Link href={`/projects/${project.id}`} className="flex-1 truncate text-sm font-medium">
                    {project.name}
                  </Link>
                </div>
                {isExpanded && (
                  <div className="ml-7 mt-0.5 space-y-0.5">
                    {[
                      { href: `/projects/${project.id}`, label: 'Issues', icon: CheckSquare },
                      { href: `/docs?project=${project.id}`, label: 'Docs', icon: FileText },
                      { href: `/members?project=${project.id}`, label: 'Members', icon: Users },
                    ].map(sub => (
                      <Link key={sub.href} href={sub.href}>
                        <div className={cn('flex items-center gap-2 px-2 py-1 rounded-md text-xs transition-colors', pathname === sub.href ? 'text-foreground bg-muted' : 'text-muted-foreground hover:text-foreground hover:bg-muted')}>
                          <sub.icon size={12} />
                          {sub.label}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="px-4 py-1.5 mt-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">Views</span>
        </div>
        <div className="px-2">
          <Link href="/analytics">
            <div className={cn('sidebar-item', pathname === '/analytics' && 'active')}>
              <BarChart2 size={16} />
              <span>Analytics</span>
            </div>
          </Link>
          <Link href="/members">
            <div className={cn('sidebar-item', pathname === '/members' && 'active')}>
              <Users size={16} />
              <span>Members</span>
            </div>
          </Link>
        </div>

        <div className="px-4 py-1.5 mt-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">Favorites</span>
        </div>
        <div className="px-2">
          <Link href="/issues">
            <div className={cn('sidebar-item', pathname === '/issues' && 'active')}>
              <Star size={16} />
              <span>My Issues</span>
            </div>
          </Link>
          <Link href="/docs">
            <div className={cn('sidebar-item', pathname === '/docs' && 'active')}>
              <Eye size={16} />
              <span>All Docs</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border px-3 py-3">
        <div className="flex items-center gap-2">
          <img src={CURRENT_USER.avatar} alt={CURRENT_USER.name} className="w-7 h-7 rounded-full ring-2 ring-border flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{CURRENT_USER.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{CURRENT_USER.role}</p>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Link href="/settings/profile">
              <div className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <Settings size={14} />
              </div>
            </Link>
            <button
              onClick={() => signOut()}
              className="p-1.5 rounded-md text-muted-foreground hover:text-red-500 hover:bg-muted transition-colors"
              title="Sign out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
