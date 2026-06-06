'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow, isToday, isYesterday, parseISO, startOfWeek, isAfter } from 'date-fns';
import { Bell, MessageSquare, UserCheck, GitMerge, AtSign, CheckCheck } from 'lucide-react';
import { NOTIFICATIONS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import type { Notification } from '@/lib/types';

const TYPE_ICONS: Record<string, React.ElementType> = {
  comment: MessageSquare,
  assignment: UserCheck,
  status_change: GitMerge,
  mention: AtSign,
  invite: Bell,
};

const TYPE_COLORS: Record<string, string> = {
  comment: 'text-blue-500 bg-blue-100 dark:bg-blue-950',
  assignment: 'text-green-500 bg-green-100 dark:bg-green-950',
  status_change: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-950',
  mention: 'text-purple-500 bg-purple-100 dark:bg-purple-950',
  invite: 'text-primary bg-primary/10',
};

type GroupKey = 'Today' | 'Yesterday' | 'This Week';

function groupNotifications(notifications: Notification[]): Record<GroupKey, Notification[]> {
  const weekStart = startOfWeek(new Date());
  const groups: Record<GroupKey, Notification[]> = { Today: [], Yesterday: [], 'This Week': [] };
  for (const n of notifications) {
    const date = parseISO(n.createdAt);
    if (isToday(date)) groups.Today.push(n);
    else if (isYesterday(date)) groups.Yesterday.push(n);
    else if (isAfter(date, weekStart)) groups['This Week'].push(n);
  }
  return groups;
}

export default function InboxPage() {
  const [filter, setFilter] = useState<'all' | 'mentions' | 'assignments' | 'comments'>('all');
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const filtered = notifications.filter(n => {
    if (filter === 'mentions') return n.type === 'mention';
    if (filter === 'assignments') return n.type === 'assignment';
    if (filter === 'comments') return n.type === 'comment';
    return true;
  });

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const groups = groupNotifications(filtered);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inbox</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm"
          >
            <CheckCheck size={14} />
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 border-b border-border">
        {([['all', 'All'], ['mentions', 'Mentions'], ['assignments', 'Assignments'], ['comments', 'Comments']] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
              filter === id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Notification Groups */}
      {Object.entries(groups).map(([groupName, items]) => {
        if (items.length === 0) return null;
        return (
          <div key={groupName}>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3">{groupName}</h2>
            <div className="space-y-1">
              {items.map(notification => {
                const Icon = TYPE_ICONS[notification.type] ?? Bell;
                const iconStyle = TYPE_COLORS[notification.type] ?? 'text-muted-foreground bg-muted';
                return (
                  <div
                    key={notification.id}
                    onClick={() => setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n))}
                    className={cn(
                      'flex gap-4 p-4 rounded-xl border transition-all cursor-pointer',
                      notification.read
                        ? 'border-border hover:bg-muted/30'
                        : 'border-primary/20 bg-primary/5 hover:bg-primary/10'
                    )}
                  >
                    <div className="relative flex-shrink-0">
                      <img src={notification.actor.avatar} alt={notification.actor.name} className="w-9 h-9 rounded-full" />
                      <div className={cn('absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center', iconStyle)}>
                        <Icon size={10} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-relaxed">
                        <span className="font-medium">{notification.actor.name}</span>{' '}
                        <span className="text-muted-foreground">{notification.message.replace(notification.actor.name + ' ', '')}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(parseISO(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Bell size={24} className="text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-1">All clear</h3>
          <p className="text-muted-foreground text-sm">No notifications in this category.</p>
        </div>
      )}
    </div>
  );
}
