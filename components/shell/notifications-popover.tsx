'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, X } from 'lucide-react';
import { NOTIFICATIONS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface NotificationsPopoverProps {
  unreadCount: number;
}

export function NotificationsPopover({ unreadCount }: NotificationsPopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[10px] font-bold bg-primary text-white rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="font-semibold text-sm">Notifications</h3>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={14} />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {NOTIFICATIONS.slice(0, 5).map(n => (
                <div key={n.id} className={cn('flex gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0', !n.read && 'bg-primary/5')}>
                  {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />}
                  {n.read && <div className="w-1.5 h-1.5 rounded-full bg-transparent mt-2 flex-shrink-0" />}
                  <img src={n.actor.avatar} alt={n.actor.name} className="w-7 h-7 rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground leading-relaxed">
                      <span className="font-medium">{n.actor.name}</span>{' '}
                      {n.message.replace(n.actor.name + ' ', '')}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-2.5 border-t border-border">
              <Link href="/inbox" onClick={() => setOpen(false)} className="text-xs text-primary hover:underline">
                View all notifications
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
