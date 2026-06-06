'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  Plus,
  LayoutGrid,
  List,
  Calendar,
  Filter,
  ChevronDown,
  ArrowUpCircle,
  CircleDot,
  Circle,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
} from 'lucide-react';
import { ISSUES, MEMBERS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import type { Issue, IssueStatus, IssuePriority } from '@/lib/types';
import { NewIssueModal } from './new-issue-modal';

const STATUS_CONFIG: Record<IssueStatus, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  backlog: { label: 'Backlog', icon: Circle, color: 'text-zinc-500', bg: 'bg-zinc-100 dark:bg-zinc-800' },
  todo: { label: 'Todo', icon: CircleDot, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950' },
  in_progress: { label: 'In Progress', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-950' },
  in_review: { label: 'In Review', icon: ArrowUpCircle, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950' },
  done: { label: 'Done', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950' },
};

const PRIORITY_CONFIG: Record<IssuePriority, { label: string; color: string }> = {
  urgent: { label: 'Urgent', color: 'text-red-500' },
  high: { label: 'High', color: 'text-orange-500' },
  medium: { label: 'Medium', color: 'text-yellow-500' },
  low: { label: 'Low', color: 'text-blue-400' },
  none: { label: 'None', color: 'text-zinc-400' },
};

const LABEL_COLORS: Record<string, string> = {
  bug: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  feature: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  auth: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  api: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
  ui: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300',
  mobile: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  design: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
  analytics: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300',
  performance: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  refactor: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  devops: 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300',
  a11y: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  backend: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  integration: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  cleanup: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  ux: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300',
};

function PriorityIcon({ priority }: { priority: IssuePriority }) {
  const cfg = PRIORITY_CONFIG[priority];
  return (
    <div className={cn('flex items-center gap-1 text-xs font-medium', cfg.color)} title={cfg.label}>
      <AlertCircle size={13} />
    </div>
  );
}

function StatusBadge({ status }: { status: IssueStatus }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span className={cn('status-badge', cfg.bg, cfg.color)}>
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

function IssueCardKanban({ issue }: { issue: Issue }) {
  return (
    <Link href={`/issues/${issue.id}`}>
      <div className="bg-card rounded-lg border border-border p-3 hover:border-primary/30 hover:shadow-sm card-hover cursor-pointer space-y-2">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[10px] font-mono text-muted-foreground">{issue.identifier}</span>
          <PriorityIcon priority={issue.priority} />
        </div>
        <p className="text-sm leading-snug line-clamp-2">{issue.title}</p>
        <div className="flex items-center justify-between">
          <div className="flex gap-1 flex-wrap">
            {issue.labels.slice(0, 2).map(label => (
              <span key={label} className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', LABEL_COLORS[label] ?? 'bg-muted text-muted-foreground')}>
                {label}
              </span>
            ))}
          </div>
          {issue.assignee && (
            <img src={issue.assignee.avatar} alt={issue.assignee.name} className="w-5 h-5 rounded-full" title={issue.assignee.name} />
          )}
        </div>
        {issue.dueDate && (
          <p className="text-[10px] text-muted-foreground">Due {format(new Date(issue.dueDate), 'MMM d')}</p>
        )}
      </div>
    </Link>
  );
}

function BoardView({ issues }: { issues: Issue[] }) {
  const columns: IssueStatus[] = ['backlog', 'todo', 'in_progress', 'in_review', 'done'];
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
      {columns.map(status => {
        const cfg = STATUS_CONFIG[status];
        const Icon = cfg.icon;
        const columnIssues = issues.filter(i => i.status === status);
        return (
          <div key={status} className="flex-shrink-0 w-72">
            <div className="flex items-center gap-2 mb-3">
              <Icon size={14} className={cfg.color} />
              <span className="text-sm font-medium">{cfg.label}</span>
              <span className="text-xs text-muted-foreground bg-muted rounded-full px-1.5 py-0.5 leading-none ml-auto">{columnIssues.length}</span>
            </div>
            <div className="space-y-2 min-h-[200px]">
              {columnIssues.map(issue => (
                <IssueCardKanban key={issue.id} issue={issue} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ListView({ issues }: { issues: Issue[] }) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground w-8">
              <input type="checkbox" className="rounded" />
            </th>
            <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground w-20">ID</th>
            <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground">Title</th>
            <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground w-32">Status</th>
            <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground w-24">Priority</th>
            <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground w-32">Assignee</th>
            <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground w-36">Labels</th>
            <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground w-24">Due Date</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue, i) => (
            <tr key={issue.id} className={cn('border-b border-border/50 hover:bg-muted/30 transition-colors', i % 2 === 0 && 'bg-muted/10')}>
              <td className="px-4 py-3">
                <input type="checkbox" className="rounded" />
              </td>
              <td className="px-3 py-3">
                <span className="text-xs font-mono text-muted-foreground">{issue.identifier}</span>
              </td>
              <td className="px-3 py-3">
                <Link href={`/issues/${issue.id}`} className="hover:text-primary transition-colors font-medium line-clamp-1">
                  {issue.title}
                </Link>
              </td>
              <td className="px-3 py-3">
                <StatusBadge status={issue.status} />
              </td>
              <td className="px-3 py-3">
                <span className={cn('text-xs font-medium flex items-center gap-1', PRIORITY_CONFIG[issue.priority].color)}>
                  <AlertCircle size={12} />
                  {PRIORITY_CONFIG[issue.priority].label}
                </span>
              </td>
              <td className="px-3 py-3">
                {issue.assignee && (
                  <div className="flex items-center gap-2">
                    <img src={issue.assignee.avatar} alt={issue.assignee.name} className="w-5 h-5 rounded-full" />
                    <span className="text-xs truncate max-w-[80px]">{issue.assignee.name.split(' ')[0]}</span>
                  </div>
                )}
              </td>
              <td className="px-3 py-3">
                <div className="flex gap-1 flex-wrap">
                  {issue.labels.slice(0, 2).map(label => (
                    <span key={label} className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', LABEL_COLORS[label] ?? 'bg-muted text-muted-foreground')}>
                      {label}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-3 py-3 text-xs text-muted-foreground">
                {issue.dueDate ? format(new Date(issue.dueDate), 'MMM d') : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TimelineView({ issues }: { issues: Issue[] }) {
  const startDate = new Date('2026-06-01');
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <div className="min-w-[900px]">
          <div className="flex border-b border-border bg-muted/30">
            <div className="w-48 flex-shrink-0 px-4 py-2.5 text-xs font-semibold text-muted-foreground">Issue</div>
            <div className="flex flex-1">
              {days.map((d, i) => (
                <div key={i} className="flex-1 text-center text-[10px] text-muted-foreground py-2.5 border-l border-border/30">
                  {i % 5 === 0 ? format(d, 'MMM d') : ''}
                </div>
              ))}
            </div>
          </div>
          {issues.filter(i => i.dueDate).slice(0, 10).map(issue => {
            const dueDate = new Date(issue.dueDate!);
            const createdDate = new Date(issue.createdAt);
            const totalDays = days.length;
            const start = Math.max(0, Math.floor((createdDate.getTime() - startDate.getTime()) / 86400000));
            const end = Math.min(totalDays - 1, Math.floor((dueDate.getTime() - startDate.getTime()) / 86400000));
            const leftPct = (start / totalDays) * 100;
            const widthPct = Math.max(3, ((end - start + 1) / totalDays) * 100);
            const cfg = STATUS_CONFIG[issue.status];

            return (
              <div key={issue.id} className="flex border-b border-border/50 hover:bg-muted/20 transition-colors">
                <div className="w-48 flex-shrink-0 px-4 py-2.5 flex items-center gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground">{issue.identifier}</span>
                  <span className="text-xs truncate">{issue.title.slice(0, 22)}...</span>
                </div>
                <div className="flex-1 relative py-2.5 min-h-[40px]">
                  <div
                    className={cn('absolute h-5 rounded-full top-1/2 -translate-y-1/2 flex items-center px-2', cfg.bg)}
                    style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                  >
                    <span className={cn('text-[10px] font-medium truncate', cfg.color)}>{issue.identifier}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function IssuesPage() {
  const [view, setView] = useState<'board' | 'list' | 'timeline'>('board');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<IssuePriority | 'all'>('all');
  const [showNewIssue, setShowNewIssue] = useState(false);

  const filtered = ISSUES.filter(i => {
    const matchSearch = !search || i.title.toLowerCase().includes(search.toLowerCase()) || i.identifier.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || i.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || i.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Issues</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{ISSUES.length} total issues across all projects</p>
        </div>
        <button
          onClick={() => setShowNewIssue(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          New Issue
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search issues..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-sm rounded-lg border border-border bg-background hover:border-primary/50 focus:outline-none focus:border-primary transition-colors w-48"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as IssueStatus | 'all')}
          className="px-3 py-1.5 text-sm rounded-lg border border-border bg-background hover:border-primary/50 focus:outline-none focus:border-primary transition-colors"
        >
          <option value="all">All Statuses</option>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>

        <select
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value as IssuePriority | 'all')}
          className="px-3 py-1.5 text-sm rounded-lg border border-border bg-background hover:border-primary/50 focus:outline-none focus:border-primary transition-colors"
        >
          <option value="all">All Priorities</option>
          {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-1 bg-muted rounded-lg p-1">
          {([['board', LayoutGrid], ['list', List], ['timeline', Calendar]] as const).map(([v, Icon]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn('p-1.5 rounded-md transition-colors', view === v ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground')}
            >
              <Icon size={15} />
            </button>
          ))}
        </div>
      </div>

      {view === 'board' && <BoardView issues={filtered} />}
      {view === 'list' && <ListView issues={filtered} />}
      {view === 'timeline' && <TimelineView issues={filtered} />}

      {showNewIssue && <NewIssueModal onClose={() => setShowNewIssue(false)} />}
    </div>
  );
}
