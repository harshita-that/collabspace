'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {
  Share2,
  ChevronRight,
  MessageSquare,
  Clock,
  Bold,
  Italic,
  Underline,
  Code,
  Link as LinkIcon,
  Hash,
  List,
  ListOrdered,
  Quote,
  Minus,
  AlertTriangle,
  Info,
  CheckCircle2,
  X,
} from 'lucide-react';
import { DOCS, MEMBERS, PROJECTS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { notFound } from 'next/navigation';

const MOCK_COMMENTS = [
  {
    id: 'c1',
    author: MEMBERS[1],
    content: 'The architecture diagram in section 2 needs to be updated to reflect the new microservices split.',
    time: '2026-06-05T10:00:00Z',
    replies: [
      { id: 'r1', author: MEMBERS[0], content: "Good catch, I'll update it this week.", time: '2026-06-05T11:30:00Z' },
    ],
  },
  {
    id: 'c2',
    author: MEMBERS[2],
    content: 'Should we document the fallback behavior for the real-time sync here as well?',
    time: '2026-06-06T08:00:00Z',
    replies: [],
  },
];

const MOCK_HISTORY = [
  { version: 'v5', editor: MEMBERS[0], time: '2026-06-06T07:00:00Z', note: 'Updated security section' },
  { version: 'v4', editor: MEMBERS[1], time: '2026-06-04T15:00:00Z', note: 'Added API endpoints table' },
  { version: 'v3', editor: MEMBERS[0], time: '2026-06-02T11:00:00Z', note: 'Initial draft complete' },
  { version: 'v2', editor: MEMBERS[0], time: '2026-05-28T09:00:00Z', note: 'Outline and structure' },
  { version: 'v1', editor: MEMBERS[0], time: '2026-05-20T10:00:00Z', note: 'Document created' },
];

const SLASH_COMMANDS = [
  { icon: Hash, label: 'Heading 1', shortcut: '/h1' },
  { icon: Hash, label: 'Heading 2', shortcut: '/h2' },
  { icon: List, label: 'Bullet List', shortcut: '/ul' },
  { icon: ListOrdered, label: 'Numbered List', shortcut: '/ol' },
  { icon: Code, label: 'Code Block', shortcut: '/code' },
  { icon: Quote, label: 'Quote', shortcut: '/quote' },
  { icon: Info, label: 'Callout', shortcut: '/callout' },
  { icon: Minus, label: 'Divider', shortcut: '/divider' },
];

function DocContent() {
  return (
    <div className="prose prose-zinc dark:prose-invert max-w-none">
      <h2 className="text-xl font-bold mt-8 mb-3">Overview</h2>
      <p className="text-[15px] leading-relaxed text-foreground/80">
        This document describes the overall architecture of the CollabSpace platform, including
        service boundaries, data flow, and integration patterns between core components.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">System Components</h2>
      <p className="text-[15px] leading-relaxed text-foreground/80">
        The platform consists of four primary services that communicate via event-driven architecture:
      </p>
      <ul className="space-y-2 my-4 ml-4">
        {['API Gateway — handles auth, rate limiting, and request routing', 'Core Service — manages workspaces, projects, issues, and documents', 'Real-time Service — WebSocket server for live collaboration', 'Analytics Service — event pipeline and reporting engine'].map(item => (
          <li key={item} className="text-[15px] text-foreground/80 flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>

      {/* Callout */}
      <div className="my-6 flex gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl">
        <Info size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-700 dark:text-blue-300 text-sm">Note</p>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-0.5">
            All inter-service communication is authenticated using internal JWTs signed with a shared secret stored in the secrets manager.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3">Data Flow</h2>
      <p className="text-[15px] leading-relaxed text-foreground/80">
        User requests flow through the API Gateway, which validates the session token and forwards requests to the appropriate service. State mutations are published as domain events to a message bus, consumed by downstream services.
      </p>

      {/* Code Block */}
      <div className="my-6 rounded-xl overflow-hidden border border-border">
        <div className="flex items-center justify-between px-4 py-2 bg-muted/80 border-b border-border">
          <span className="text-xs font-mono text-muted-foreground">Event Schema</span>
          <span className="text-xs text-muted-foreground">TypeScript</span>
        </div>
        <pre className="p-4 text-sm font-mono bg-muted/30 overflow-x-auto scrollbar-thin">
          <code className="text-foreground">{`interface DomainEvent {
  id: string;
  type: string;
  aggregateId: string;
  aggregateType: string;
  payload: Record<string, unknown>;
  occurredAt: string;
  version: number;
}`}</code>
        </pre>
      </div>

      {/* Warning Callout */}
      <div className="my-6 flex gap-3 p-4 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900 rounded-xl">
        <AlertTriangle size={18} className="text-yellow-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-yellow-700 dark:text-yellow-300 text-sm">Warning</p>
          <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-0.5">
            Do not directly query the Core Service database from Analytics Service. Always use the published events to maintain loose coupling.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3">Deployment</h2>
      <p className="text-[15px] leading-relaxed text-foreground/80">
        Each service is deployed as a containerized workload on Kubernetes. Services are isolated in separate namespaces with network policies enforcing inter-service communication rules.
      </p>

      <ol className="space-y-2 my-4 ml-4">
        {['Build container images via CI on each merge to main', 'Images are tagged with commit SHA and semantic version', 'ArgoCD syncs Kubernetes manifests from the infra repository', 'Canary deployments are used for Core and Real-time services'].map((item, i) => (
          <li key={item} className="text-[15px] text-foreground/80 flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
            {item}
          </li>
        ))}
      </ol>

      <hr className="my-8 border-border" />

      <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl">
        <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
        <p className="text-sm text-green-700 dark:text-green-300">
          This document is reviewed and approved by the platform team.
        </p>
      </div>
    </div>
  );
}

export default function DocPage({ params }: { params: { id: string } }) {
  const doc = DOCS.find(d => d.id === params.id);
  if (!doc) return notFound();

  const project = PROJECTS.find(p => p.id === doc.projectId);
  const author = MEMBERS.find(m => m.id === doc.authorId);

  const [rightPanel, setRightPanel] = useState<'toc' | 'comments' | 'history'>('toc');
  const [showSlash, setShowSlash] = useState(false);

  const headings = [
    { level: 2, text: 'Overview' },
    { level: 2, text: 'System Components' },
    { level: 2, text: 'Data Flow' },
    { level: 2, text: 'Deployment' },
  ];

  return (
    <div className="flex h-full">
      {/* Main Canvas */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-3xl mx-auto px-8 py-8">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {doc.collaborators.slice(0, 3).map(c => (
                  <img key={c.id} src={c.avatar} alt={c.name} className="w-7 h-7 rounded-full ring-2 ring-background" title={c.name} />
                ))}
                {doc.collaborators.length > 3 && (
                  <div className="w-7 h-7 rounded-full ring-2 ring-background bg-muted flex items-center justify-center text-xs text-muted-foreground">
                    +{doc.collaborators.length - 3}
                  </div>
                )}
              </div>
              <span className="text-xs text-muted-foreground ml-1">
                Edited {formatDistanceToNow(new Date(doc.updatedAt), { addSuffix: true })}
              </span>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors text-sm">
              <Share2 size={14} />
              Share
            </button>
          </div>

          {/* Title */}
          <div className="mb-8">
            <div className="mb-2">
              <span className="text-sm font-medium" style={{ color: project?.color }}>{project?.name}</span>
            </div>
            <h1 className="font-serif text-4xl font-bold leading-tight text-foreground">{doc.title}</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              By {author?.name} &middot; {doc.collaborators.length} collaborators
            </p>
          </div>

          {/* Floating Toolbar (Static display for now) */}
          <div className="flex items-center gap-1 p-1.5 bg-popover border border-border rounded-xl shadow-lg w-fit mb-6">
            {[Bold, Italic, Underline, Code, LinkIcon, MessageSquare].map((Icon, i) => (
              <button key={i} className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                <Icon size={14} />
              </button>
            ))}
          </div>

          <DocContent />
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-64 flex-shrink-0 border-l border-border flex flex-col" style={{ background: 'hsl(var(--sidebar-bg))' }}>
        {/* Panel Tabs */}
        <div className="flex border-b border-border">
          {([['toc', 'Contents'], ['comments', 'Comments'], ['history', 'History']] as const).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setRightPanel(tab)}
              className={cn(
                'flex-1 py-2.5 text-xs font-medium transition-colors',
                rightPanel === tab
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          {rightPanel === 'toc' && (
            <div className="space-y-1">
              {headings.map(h => (
                <div
                  key={h.text}
                  className={cn('text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors py-1 px-2 rounded-md hover:bg-muted', h.level === 3 && 'pl-4 text-xs')}
                >
                  {h.text}
                </div>
              ))}
            </div>
          )}

          {rightPanel === 'comments' && (
            <div className="space-y-4">
              {MOCK_COMMENTS.map(comment => (
                <div key={comment.id} className="space-y-2">
                  <div className="bg-card rounded-xl border border-border p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <img src={comment.author.avatar} alt={comment.author.name} className="w-5 h-5 rounded-full" />
                      <span className="text-xs font-medium">{comment.author.name.split(' ')[0]}</span>
                      <span className="text-[11px] text-muted-foreground ml-auto">
                        {formatDistanceToNow(new Date(comment.time), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-xs text-foreground/80">{comment.content}</p>
                  </div>
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="ml-4 bg-muted/50 rounded-xl border border-border/50 p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <img src={reply.author.avatar} alt={reply.author.name} className="w-4 h-4 rounded-full" />
                        <span className="text-xs font-medium">{reply.author.name.split(' ')[0]}</span>
                      </div>
                      <p className="text-xs text-foreground/80">{reply.content}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {rightPanel === 'history' && (
            <div className="space-y-3">
              {MOCK_HISTORY.map(v => (
                <div key={v.version} className="flex gap-3 hover:bg-muted/50 rounded-lg p-2 cursor-pointer transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-mono font-bold text-muted-foreground flex-shrink-0">
                    {v.version}
                  </div>
                  <div>
                    <p className="text-xs font-medium">{v.note}</p>
                    <p className="text-[11px] text-muted-foreground">{v.editor.name.split(' ')[0]} &middot; {formatDistanceToNow(new Date(v.time), { addSuffix: true })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
