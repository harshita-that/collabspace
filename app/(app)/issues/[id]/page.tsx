'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format, formatDistanceToNow } from 'date-fns';
import {
  ArrowLeft,
  Circle,
  CircleDot,
  Clock,
  ArrowUpCircle,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Tag,
  User,
  Paperclip,
  MessageSquare,
  Send,
  Edit3,
  GitMerge,
  UserCheck,
} from 'lucide-react';
import { ISSUES, MEMBERS, PROJECTS } from '@/lib/mock-data';
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

const MOCK_TIMELINE = [
  { id: 't1', type: 'create', actor: MEMBERS[0], description: 'created this issue', time: '2026-06-01T10:00:00Z' },
  { id: 't2', type: 'assignment', actor: MEMBERS[0], description: `assigned to ${MEMBERS[2].name}`, time: '2026-06-01T10:05:00Z' },
  { id: 't3', type: 'comment', actor: MEMBERS[2], description: '', comment: 'I can reproduce this on iOS 17.4 Safari. The redirect loop happens after the callback URL is processed.', time: '2026-06-02T09:30:00Z' },
  { id: 't4', type: 'status_change', actor: MEMBERS[2], description: 'changed status from Todo to In Progress', time: '2026-06-03T14:00:00Z' },
  { id: 't5', type: 'comment', actor: MEMBERS[0], description: '', comment: 'Have you checked the cookie SameSite settings? That might be the culprit for Safari.', time: '2026-06-04T11:00:00Z' },
  { id: 't6', type: 'comment', actor: MEMBERS[2], description: '', comment: 'Good catch. Setting SameSite=None; Secure fixed the redirect issue. Testing now.', time: '2026-06-05T16:00:00Z' },
];

const TIMELINE_ICONS: Record<string, React.ElementType> = {
  create: Edit3,
  assignment: UserCheck,
  status_change: GitMerge,
  comment: MessageSquare,
};

export default function IssueDetailPage({ params }: { params: { id: string } }) {
  const issue = ISSUES.find(i => i.id === params.id);
  if (!issue) return notFound();

  const project = PROJECTS.find(p => p.id === issue.projectId);
  const statusCfg = STATUS_CONFIG[issue.status];
  const StatusIcon = statusCfg.icon;

  const [comment, setComment] = useState('');
  const [currentStatus, setCurrentStatus] = useState(issue.status);
  const [currentPriority, setCurrentPriority] = useState(issue.priority);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/projects" className="hover:text-foreground transition-colors">{project?.name ?? 'Projects'}</Link>
        <span>/</span>
        <Link href="/issues" className="hover:text-foreground transition-colors">Issues</Link>
        <span>/</span>
        <span className="font-mono text-foreground">{issue.identifier}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={cn('status-badge', statusCfg.bg, statusCfg.color)}>
                <StatusIcon size={12} />
                {statusCfg.label}
              </span>
              <span className={cn('text-xs font-medium flex items-center gap-1', PRIORITY_CONFIG[issue.priority].color)}>
                <AlertCircle size={12} />
                {PRIORITY_CONFIG[issue.priority].label}
              </span>
            </div>
            <h1 className="text-2xl font-bold leading-tight">{issue.title}</h1>
            <p className="text-xs text-muted-foreground mt-2">
              Created {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })} &middot; Updated {formatDistanceToNow(new Date(issue.updatedAt), { addSuffix: true })}
            </p>
          </div>

          {/* Description */}
          <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
            <p className="text-sm text-muted-foreground">{issue.description}</p>
            {!issue.description && (
              <p className="text-sm text-muted-foreground/50 italic">No description provided.</p>
            )}
          </div>

          {/* Labels */}
          {issue.labels.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {issue.labels.map(label => (
                <span key={label} className={cn('text-xs px-2.5 py-1 rounded-full font-medium', LABEL_COLORS[label] ?? 'bg-muted text-muted-foreground')}>
                  {label}
                </span>
              ))}
            </div>
          )}

          {/* Activity Timeline */}
          <div>
            <h3 className="font-semibold mb-4">Activity</h3>
            <div className="space-y-4">
              {MOCK_TIMELINE.map(item => {
                const Icon = TIMELINE_ICONS[item.type] ?? Edit3;
                return (
                  <div key={item.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <img src={item.actor.avatar} alt={item.actor.name} className="w-7 h-7 rounded-full flex-shrink-0" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{item.actor.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(item.time), { addSuffix: true })}
                        </span>
                      </div>
                      {item.type === 'comment' ? (
                        <div className="bg-card border border-border rounded-xl p-3.5">
                          <p className="text-sm">{item.comment}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Comment Composer */}
            <div className="mt-6 flex gap-3">
              <img src={MEMBERS[0].avatar} alt="You" className="w-7 h-7 rounded-full flex-shrink-0" />
              <div className="flex-1 border border-border rounded-xl overflow-hidden focus-within:border-primary transition-colors">
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Leave a comment..."
                  rows={3}
                  className="w-full p-3 text-sm bg-transparent outline-none resize-none placeholder:text-muted-foreground/60"
                />
                <div className="flex justify-end px-3 py-2 border-t border-border">
                  <button
                    disabled={!comment.trim()}
                    onClick={() => setComment('')}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    <Send size={12} />
                    Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metadata Panel */}
        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-4 space-y-4">
            <h3 className="font-semibold text-sm">Details</h3>

            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Status</label>
              <select
                value={currentStatus}
                onChange={e => setCurrentStatus(e.target.value as IssueStatus)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-primary"
              >
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Priority</label>
              <select
                value={currentPriority}
                onChange={e => setCurrentPriority(e.target.value as IssuePriority)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-primary"
              >
                {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Assignee</label>
              {issue.assignee ? (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border">
                  <img src={issue.assignee.avatar} alt={issue.assignee.name} className="w-5 h-5 rounded-full" />
                  <span className="text-sm">{issue.assignee.name}</span>
                </div>
              ) : (
                <div className="px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground">Unassigned</div>
              )}
            </div>

            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Project</label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border">
                <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: project?.color }} />
                <span className="text-sm">{project?.name}</span>
              </div>
            </div>

            {issue.dueDate && (
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">Due Date</label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm">
                  <Calendar size={13} className="text-muted-foreground" />
                  {format(new Date(issue.dueDate), 'MMM d, yyyy')}
                </div>
              </div>
            )}

            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Labels</label>
              <div className="flex flex-wrap gap-1.5">
                {issue.labels.map(label => (
                  <span key={label} className={cn('text-[11px] px-2 py-0.5 rounded-full font-medium', LABEL_COLORS[label] ?? 'bg-muted text-muted-foreground')}>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Related Issues */}
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="font-semibold text-sm mb-3">Related Issues</h3>
            <div className="space-y-2">
              {ISSUES.filter(i => i.id !== issue.id && i.projectId === issue.projectId).slice(0, 3).map(rel => (
                <Link key={rel.id} href={`/issues/${rel.id}`} className="flex items-center gap-2 hover:bg-muted/50 rounded-lg px-2 py-1.5 transition-colors">
                  <span className="text-[10px] font-mono text-muted-foreground">{rel.identifier}</span>
                  <span className="text-xs truncate">{rel.title}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="font-semibold text-sm mb-3">Attachments</h3>
            {[
              { name: 'safari-debug-log.txt', size: '14 KB' },
              { name: 'screen-recording.mp4', size: '2.3 MB' },
            ].map(file => (
              <div key={file.name} className="flex items-center gap-2 py-1.5 hover:bg-muted/50 rounded-lg px-2 transition-colors cursor-pointer">
                <Paperclip size={13} className="text-muted-foreground flex-shrink-0" />
                <span className="text-xs flex-1 truncate">{file.name}</span>
                <span className="text-[11px] text-muted-foreground">{file.size}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
