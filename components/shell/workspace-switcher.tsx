'use client';

import { useState } from 'react';
import { ChevronDown, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Workspace } from '@/lib/types';

interface WorkspaceSwitcherProps {
  workspaces: Workspace[];
  currentWorkspaceId: string;
}

export function WorkspaceSwitcher({ workspaces, currentWorkspaceId }: WorkspaceSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [currentId, setCurrentId] = useState(currentWorkspaceId);
  const current = workspaces.find(w => w.id === currentId) ?? workspaces[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md hover:bg-muted transition-colors group"
      >
        <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ background: 'hsl(var(--primary))' }}>
          {current.name[0]}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-semibold truncate">{current.name}</p>
        </div>
        <ChevronDown size={14} className={cn('text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 py-1">
          {workspaces.map(ws => (
            <button
              key={ws.id}
              onClick={() => { setCurrentId(ws.id); setOpen(false); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors"
            >
              <div className="w-5 h-5 rounded flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: ws.id === 'ws-1' ? '#5b5ef4' : ws.id === 'ws-2' ? '#30a46c' : '#e5484d' }}>
                {ws.name[0]}
              </div>
              <span className="flex-1 text-left truncate">{ws.name}</span>
              {ws.id === currentId && <Check size={14} className="text-primary" />}
            </button>
          ))}
          <div className="border-t border-border mt-1 pt-1">
            <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Plus size={14} />
              Create workspace
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
