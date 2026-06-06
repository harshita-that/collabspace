'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Plus, Search } from 'lucide-react';
import { DOCS, PROJECTS, MEMBERS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function DocsPage() {
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');

  const filtered = DOCS.filter(d => {
    const matchSearch = !search || d.title.toLowerCase().includes(search.toLowerCase());
    const matchProject = projectFilter === 'all' || d.projectId === projectFilter;
    return matchSearch && matchProject;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Docs</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{DOCS.length} documents across all projects</p>
        </div>
        <Link href="/docs/d-1">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium">
            <Plus size={16} />
            New Doc
          </button>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search docs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-sm rounded-lg border border-border bg-background hover:border-primary/50 focus:outline-none focus:border-primary transition-colors w-48"
          />
        </div>
        <select
          value={projectFilter}
          onChange={e => setProjectFilter(e.target.value)}
          className="px-3 py-1.5 text-sm rounded-lg border border-border bg-background hover:border-primary/50 focus:outline-none focus:border-primary transition-colors"
        >
          <option value="all">All Projects</option>
          {PROJECTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(doc => {
          const project = PROJECTS.find(p => p.id === doc.projectId);
          const author = MEMBERS.find(m => m.id === doc.authorId);
          return (
            <Link key={doc.id} href={`/docs/${doc.id}`}>
              <div className="bg-card rounded-xl border border-border p-5 hover:border-primary/30 hover:shadow-md card-hover cursor-pointer h-full flex flex-col">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: project?.color + '20' }}>
                    <FileText size={16} style={{ color: project?.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm leading-snug">{doc.title}</h3>
                    <span className="text-xs font-medium" style={{ color: project?.color }}>{project?.name}</span>
                  </div>
                </div>

                <div className="flex-1" />

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                  <div className="flex items-center gap-1.5">
                    <div className="flex -space-x-1.5">
                      {doc.collaborators.slice(0, 3).map(c => (
                        <img key={c.id} src={c.avatar} alt={c.name} className="w-5 h-5 rounded-full ring-2 ring-card" title={c.name} />
                      ))}
                    </div>
                  </div>
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
  );
}
