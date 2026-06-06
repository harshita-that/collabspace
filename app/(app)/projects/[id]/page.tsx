'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format, formatDistanceToNow } from 'date-fns';
import {
  Settings,
  CheckSquare,
  FileText,
  Users,
  BarChart2,
  AlertCircle,
  Circle,
  CircleDot,
  Clock,
  ArrowUpCircle,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { PROJECTS, MEMBERS, ISSUES, DOCS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import type { IssueStatus, IssuePriority } from '@/lib/types';
import { notFound } from 'next/navigation';

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

function OverviewTab({ project }: { project: typeof PROJECTS[0] }) {
  const projectMembers = MEMBERS.filter(m => project.memberIds.includes(m.id));
  const projectDocs = DOCS.filter(d => d.projectId === project.id);
  const issuesByStatus = Object.entries(STATUS_CONFIG).map(([status, cfg]) => ({
    ...cfg,
    status,
    count: ISSUES.filter(i => i.projectId === project.id && i.status === status).length,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Progress */}
        <div className="md:col-span-2 bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-3">Progress</h3>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${project.progress}%`, background: project.color }} />
            </div>
            <span className="text-sm font-bold">{project.progress}%</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {issuesByStatus.map(s => (
              <div key={s.status} className="text-center">
                <p className="metric-value font-bold text-lg">{s.count}</p>
                <p className={cn('text-xs', s.color)}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Members */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-3">Members</h3>
          <div className="space-y-2.5">
            {projectMembers.map(m => (
              <div key={m.id} className="flex items-center gap-2">
                <img src={m.avatar} alt={m.name} className="w-6 h-6 rounded-full" />
                <span className="text-sm">{m.name}</span>
                <span className="text-xs text-muted-foreground capitalize ml-auto">{m.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Docs */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Recent Docs</h3>
          <Link href="/docs" className="text-xs text-primary hover:underline">View all</Link>
        </div>
        <div className="space-y-2">
          {projectDocs.map(doc => (
            <Link key={doc.id} href={`/docs/${doc.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <FileText size={14} className="text-muted-foreground" />
              <span className="text-sm flex-1">{doc.title}</span>
              <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(doc.updatedAt), { addSuffix: true })}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function IssuesTab({ project }: { project: typeof PROJECTS[0] }) {
  const projectIssues = ISSUES.filter(i => i.projectId === project.id);
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground w-20">ID</th>
            <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground">Title</th>
            <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground w-32">Status</th>
            <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground w-24">Priority</th>
            <th className="text-left px-3 py-3 text-xs font-semibold text-muted-foreground w-28">Assignee</th>
          </tr>
        </thead>
        <tbody>
          {projectIssues.map(issue => {
            const statusCfg = STATUS_CONFIG[issue.status];
            const StatusIcon = statusCfg.icon;
            return (
              <tr key={issue.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{issue.identifier}</td>
                <td className="px-3 py-3">
                  <Link href={`/issues/${issue.id}`} className="hover:text-primary transition-colors line-clamp-1">{issue.title}</Link>
                </td>
                <td className="px-3 py-3">
                  <span className={cn('status-badge', statusCfg.bg, statusCfg.color)}>
                    <StatusIcon size={11} />
                    {statusCfg.label}
                  </span>
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
                      <span className="text-xs">{issue.assignee.name.split(' ')[0]}</span>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function StubTab({ label }: { label: string }) {
  return (
    <div className="bg-card rounded-xl border border-border p-12 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Settings size={24} className="text-muted-foreground" />
      </div>
      <h3 className="font-semibold mb-1">{label}</h3>
      <p className="text-sm text-muted-foreground">This section is coming soon.</p>
    </div>
  );
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = PROJECTS.find(p => p.id === params.id);
  if (!project) return notFound();

  const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'docs' | 'members' | 'settings'>('overview');

  const tabs: { id: typeof activeTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'issues', label: 'Issues', icon: CheckSquare },
    { id: 'docs', label: 'Docs', icon: FileText },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: project.color + '20' }}>
          <div className="w-5 h-5 rounded" style={{ background: project.color }} />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{project.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm">
            <Plus size={14} />
            New Issue
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab project={project} />}
      {activeTab === 'issues' && <IssuesTab project={project} />}
      {activeTab === 'docs' && <StubTab label="Docs" />}
      {activeTab === 'members' && <StubTab label="Members" />}
      {activeTab === 'settings' && <StubTab label="Settings" />}
    </div>
  );
}
