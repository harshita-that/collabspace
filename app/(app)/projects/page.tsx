'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Plus, FileText, CheckSquare, Users, ArrowRight } from 'lucide-react';
import { PROJECTS, MEMBERS, ISSUES, DOCS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function ProjectsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{PROJECTS.length} projects in Acme Corp</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium">
          <Plus size={16} />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">
        {PROJECTS.map(project => {
          const projectMembers = MEMBERS.filter(m => project.memberIds.includes(m.id));
          const projectIssues = ISSUES.filter(i => i.projectId === project.id);
          const projectDocs = DOCS.filter(d => d.projectId === project.id);

          return (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <div className="bg-card rounded-xl border border-border p-5 hover:border-primary/30 hover:shadow-md card-hover cursor-pointer h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: project.color + '20' }}>
                    <div className="w-4 h-4 rounded-sm" style={{ background: project.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base">{project.name}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{project.description}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-muted-foreground">Progress</span>
                    <span className="text-xs font-semibold">{project.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${project.progress}%`, background: project.color }} />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { icon: CheckSquare, label: 'Issues', value: project.openIssues },
                    { icon: FileText, label: 'Docs', value: project.docCount },
                    { icon: Users, label: 'Members', value: projectMembers.length },
                  ].map(stat => (
                    <div key={stat.label} className="bg-muted/50 rounded-lg p-2.5 text-center">
                      <stat.icon size={14} className="text-muted-foreground mx-auto mb-1" />
                      <p className="metric-value font-semibold text-sm">{stat.value}</p>
                      <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex-1" />

                {/* Footer */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                  <div className="flex -space-x-2">
                    {projectMembers.slice(0, 4).map(m => (
                      <img key={m.id} src={m.avatar} alt={m.name} className="w-6 h-6 rounded-full ring-2 ring-card" title={m.name} />
                    ))}
                    {projectMembers.length > 4 && (
                      <div className="w-6 h-6 rounded-full ring-2 ring-card bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
                        +{projectMembers.length - 4}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Active {formatDistanceToNow(new Date(project.lastActivity), { addSuffix: true })}
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
