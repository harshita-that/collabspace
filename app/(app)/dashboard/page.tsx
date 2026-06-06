'use client';

import Link from 'next/link';
import { formatDistanceToNow, format } from 'date-fns';
import {
  FileText,
  CheckSquare,
  UserPlus,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Edit3,
  MessageSquare,
  GitMerge,
  UserCheck,
  Zap,
} from 'lucide-react';
import {
  CURRENT_USER,
  ACTIVITY_FEED,
  ISSUES,
  DOCS,
  HEATMAP_DATA,
  PROJECTS,
  MEMBERS,
} from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import type { IssueStatus } from '@/lib/types';

const ACTIVITY_ICONS: Record<string, React.ElementType> = {
  edit: Edit3,
  comment: MessageSquare,
  status_change: GitMerge,
  assignment: UserCheck,
  create: Zap,
};

function HeatmapCell({ count }: { count: number }) {
  const intensity =
    count === 0 ? 'bg-muted' :
    count <= 2 ? 'bg-primary/20' :
    count <= 4 ? 'bg-primary/40' :
    count <= 6 ? 'bg-primary/70' : 'bg-primary';
  return <div className={cn('w-3 h-3 rounded-sm', intensity)} title={`${count} activities`} />;
}

const myOpenIssues = ISSUES.filter(i => i.assignee?.id === CURRENT_USER.id && i.status !== 'done');
const todoIssues = myOpenIssues.filter(i => i.status === 'todo' || i.status === 'backlog');
const inProgressIssues = myOpenIssues.filter(i => i.status === 'in_progress' || i.status === 'in_review');
const doneIssues = ISSUES.filter(i => i.assignee?.id === CURRENT_USER.id && i.status === 'done');
const recentDocs = DOCS.slice(0, 4);

export default function DashboardPage() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const today = format(new Date(), 'EEEE, MMMM d');

  const weeks: { week: string; days: typeof HEATMAP_DATA }[] = [];
  for (let i = 0; i < HEATMAP_DATA.length; i += 7) {
    weeks.push({ week: HEATMAP_DATA[i]?.date ?? '', days: HEATMAP_DATA.slice(i, i + 7) });
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Hero */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{greeting}, {CURRENT_USER.name.split(' ')[0]}</h1>
          <p className="text-muted-foreground mt-1">{today} &middot; {myOpenIssues.length} open issues assigned to you</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/docs/d-1">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm">
              <FileText size={14} />
              New Doc
            </button>
          </Link>
          <Link href="/issues">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm">
              <CheckSquare size={14} />
              New Issue
            </button>
          </Link>
          <Link href="/members">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium">
              <UserPlus size={14} />
              Invite
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Issues Kanban Summary */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">My Open Issues</h2>
              <Link href="/issues" className="text-xs text-primary hover:underline flex items-center gap-1">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Todo', issues: todoIssues, color: 'text-blue-500' },
                { label: 'In Progress', issues: inProgressIssues, color: 'text-yellow-500' },
                { label: 'Done', issues: doneIssues.slice(0, 3), color: 'text-green-500' },
              ].map(col => (
                <div key={col.label}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn('text-xs font-semibold', col.color)}>{col.label}</span>
                    <span className="text-xs text-muted-foreground bg-muted rounded-full px-1.5 py-0.5 leading-none">{col.issues.length}</span>
                  </div>
                  <div className="space-y-2">
                    {col.issues.length === 0 ? (
                      <div className="text-xs text-muted-foreground/60 italic py-2">Nothing here</div>
                    ) : col.issues.map(issue => (
                      <Link key={issue.id} href={`/issues/${issue.id}`}>
                        <div className="p-2.5 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/50 transition-all cursor-pointer group">
                          <p className="text-[10px] font-mono text-muted-foreground">{issue.identifier}</p>
                          <p className="text-xs mt-0.5 leading-snug line-clamp-2 group-hover:text-primary transition-colors">{issue.title}</p>
                          {issue.dueDate && (
                            <p className="text-[10px] text-muted-foreground mt-1">
                              Due {format(new Date(issue.dueDate), 'MMM d')}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Docs */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Recently Visited Docs</h2>
              <Link href="/docs" className="text-xs text-primary hover:underline flex items-center gap-1">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {recentDocs.map(doc => {
                const project = PROJECTS.find(p => p.id === doc.projectId);
                return (
                  <Link key={doc.id} href={`/docs/${doc.id}`}>
                    <div className="p-3.5 rounded-lg border border-border hover:border-primary/30 hover:shadow-sm card-hover cursor-pointer">
                      <div className="flex items-start gap-2 mb-2">
                        <FileText size={14} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-medium leading-snug line-clamp-2">{doc.title}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium" style={{ color: project?.color }}>
                          {project?.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {formatDistanceToNow(new Date(doc.updatedAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Team Activity Heatmap */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-semibold mb-4">Team Activity — Last 12 Weeks</h2>
            <div className="flex gap-1 overflow-x-auto scrollbar-thin pb-1">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.days.map((day, di) => (
                    <HeatmapCell key={di} count={day.count} />
                  ))}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-muted-foreground">Less</span>
              <div className="flex gap-1">
                {['bg-muted', 'bg-primary/20', 'bg-primary/40', 'bg-primary/70', 'bg-primary'].map((c, i) => (
                  <div key={i} className={cn('w-3 h-3 rounded-sm', c)} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">More</span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Open Issues', value: ISSUES.filter(i => i.status !== 'done').length, trend: +3, color: 'text-primary' },
              { label: 'Completed', value: ISSUES.filter(i => i.status === 'done').length, trend: +5, color: 'text-green-500' },
              { label: 'In Review', value: ISSUES.filter(i => i.status === 'in_review').length, trend: -1, color: 'text-purple-500' },
              { label: 'Docs This Week', value: 3, trend: +2, color: 'text-yellow-500' },
            ].map(stat => (
              <div key={stat.label} className="bg-card rounded-xl border border-border p-4">
                <p className={cn('text-2xl font-bold metric-value', stat.color)}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{stat.label}</p>
                <div className={cn('flex items-center gap-0.5 mt-1.5 text-xs', stat.trend >= 0 ? 'text-green-500' : 'text-red-500')}>
                  {stat.trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {Math.abs(stat.trend)} this week
                </div>
              </div>
            ))}
          </div>

          {/* Activity Feed */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {ACTIVITY_FEED.map(item => {
                const Icon = ACTIVITY_ICONS[item.type] ?? Zap;
                return (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative">
                      <img src={item.actor.avatar} alt={item.actor.name} className="w-7 h-7 rounded-full flex-shrink-0" />
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-muted border border-border flex items-center justify-center">
                        <Icon size={9} className="text-muted-foreground" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs leading-relaxed">
                        <span className="font-medium">{item.actor.name.split(' ')[0]}</span>{' '}
                        <span className="text-muted-foreground">{item.description}</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
