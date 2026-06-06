'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Building2, CreditCard, Bell, Puzzle, Key } from 'lucide-react';
import { cn } from '@/lib/utils';

const SETTINGS_NAV = [
  { href: '/settings/profile', label: 'Profile', icon: User },
  { href: '/settings/workspace', label: 'Workspace', icon: Building2 },
  { href: '/settings/billing', label: 'Billing', icon: CreditCard },
  { href: '/settings/notifications', label: 'Notifications', icon: Bell },
  { href: '/settings/integrations', label: 'Integrations', icon: Puzzle },
  { href: '/settings/api-keys', label: 'API Keys', icon: Key },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full min-h-screen">
      {/* Settings Sidebar */}
      <div className="w-52 flex-shrink-0 border-r border-border p-4" style={{ background: 'hsl(var(--sidebar-bg))' }}>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 px-2 mb-3">Settings</h2>
        <nav className="space-y-0.5">
          {SETTINGS_NAV.map(item => (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                'sidebar-item',
                pathname === item.href && 'active'
              )}>
                <item.icon size={15} />
                {item.label}
              </div>
            </Link>
          ))}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-auto scrollbar-thin">
        {children}
      </div>
    </div>
  );
}
