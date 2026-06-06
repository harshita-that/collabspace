'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, FileText, CheckSquare, Users, FolderOpen, Hash } from 'lucide-react';
import { ISSUES, DOCS, MEMBERS, PROJECTS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RECENT = [
  { label: 'CS-01 Authentication flow breaks on mobile Safari', type: 'issue', href: '/issues/i-1' },
  { label: 'Platform Architecture Overview', type: 'doc', href: '/docs/d-1' },
  { label: 'Analytics Engine', type: 'project', href: '/projects/p-4' },
];

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(true);
      }
      if (e.key === 'Escape') onOpenChange(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onOpenChange]);

  const filteredIssues = query
    ? ISSUES.filter(i => i.title.toLowerCase().includes(query.toLowerCase())).slice(0, 4)
    : [];
  const filteredDocs = query
    ? DOCS.filter(d => d.title.toLowerCase().includes(query.toLowerCase())).slice(0, 3)
    : [];
  const filteredProjects = query
    ? PROJECTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3)
    : [];
  const filteredMembers = query
    ? MEMBERS.filter(m => m.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3)
    : [];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div className="relative w-full max-w-lg bg-popover border border-border rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search size={16} className="text-muted-foreground flex-shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search issues, docs, members, projects..."
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveIdx(0); }}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded border border-border text-muted-foreground">ESC</kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!query && (
            <div>
              <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground/60">Recent</p>
              {RECENT.map((item, i) => (
                <button
                  key={i}
                  onClick={() => { router.push(item.href); onOpenChange(false); setQuery(''); }}
                  className={cn('flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors text-left', activeIdx === i && 'bg-muted')}
                >
                  {item.type === 'issue' && <Hash size={14} className="text-primary flex-shrink-0" />}
                  {item.type === 'doc' && <FileText size={14} className="text-green-500 flex-shrink-0" />}
                  {item.type === 'project' && <FolderOpen size={14} className="text-yellow-500 flex-shrink-0" />}
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          )}

          {query && (
            <>
              {filteredIssues.length > 0 && (
                <div>
                  <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground/60">Issues</p>
                  {filteredIssues.map(issue => (
                    <button
                      key={issue.id}
                      onClick={() => { router.push(`/issues/${issue.id}`); onOpenChange(false); setQuery(''); }}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors text-left"
                    >
                      <Hash size={14} className="text-primary flex-shrink-0" />
                      <span className="text-muted-foreground font-mono text-xs">{issue.identifier}</span>
                      <span className="truncate flex-1">{issue.title}</span>
                    </button>
                  ))}
                </div>
              )}
              {filteredDocs.length > 0 && (
                <div>
                  <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground/60">Docs</p>
                  {filteredDocs.map(doc => (
                    <button
                      key={doc.id}
                      onClick={() => { router.push(`/docs/${doc.id}`); onOpenChange(false); setQuery(''); }}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors text-left"
                    >
                      <FileText size={14} className="text-green-500 flex-shrink-0" />
                      <span className="truncate">{doc.title}</span>
                    </button>
                  ))}
                </div>
              )}
              {filteredProjects.length > 0 && (
                <div>
                  <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground/60">Projects</p>
                  {filteredProjects.map(proj => (
                    <button
                      key={proj.id}
                      onClick={() => { router.push(`/projects/${proj.id}`); onOpenChange(false); setQuery(''); }}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors text-left"
                    >
                      <FolderOpen size={14} className="text-yellow-500 flex-shrink-0" />
                      <span className="truncate">{proj.name}</span>
                    </button>
                  ))}
                </div>
              )}
              {filteredMembers.length > 0 && (
                <div>
                  <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground/60">Members</p>
                  {filteredMembers.map(m => (
                    <button
                      key={m.id}
                      onClick={() => { router.push('/members'); onOpenChange(false); setQuery(''); }}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors text-left"
                    >
                      <img src={m.avatar} alt={m.name} className="w-5 h-5 rounded-full flex-shrink-0" />
                      <span>{m.name}</span>
                      <span className="text-muted-foreground text-xs">{m.email}</span>
                    </button>
                  ))}
                </div>
              )}
              {filteredIssues.length === 0 && filteredDocs.length === 0 && filteredProjects.length === 0 && filteredMembers.length === 0 && (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  No results for &ldquo;{query}&rdquo;
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
