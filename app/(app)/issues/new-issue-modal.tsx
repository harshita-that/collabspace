'use client';

import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { MEMBERS, PROJECTS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface NewIssueModalProps {
  onClose: () => void;
}

export function NewIssueModal({ onClose }: NewIssueModalProps) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [assigneeId, setAssigneeId] = useState('');
  const [projectId, setProjectId] = useState('p-1');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [labels, setLabels] = useState<string[]>([]);

  const LABEL_OPTIONS = ['bug', 'feature', 'ui', 'api', 'mobile', 'design', 'performance', 'refactor'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-popover border border-border rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold">Create New Issue</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <input
              type="text"
              placeholder="Issue title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full text-lg font-medium bg-transparent border-none outline-none placeholder:text-muted-foreground/60"
              autoFocus
            />
          </div>

          <textarea
            placeholder="Add a description..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            className="w-full text-sm bg-muted/30 rounded-lg p-3 border border-border/50 outline-none placeholder:text-muted-foreground/60 resize-none focus:border-primary transition-colors"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-primary">
                <option value="backlog">Backlog</option>
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-primary">
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Assignee</label>
              <select value={assigneeId} onChange={e => setAssigneeId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-primary">
                <option value="">Unassigned</option>
                {MEMBERS.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Project</label>
              <select value={projectId} onChange={e => setProjectId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-primary">
                {PROJECTS.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Labels</label>
              <div className="flex flex-wrap gap-1.5">
                {LABEL_OPTIONS.map(l => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLabels(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l])}
                    className={cn(
                      'text-xs px-2 py-0.5 rounded-full border transition-colors',
                      labels.includes(l)
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/50'
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors">
            Cancel
          </button>
          <button
            onClick={onClose}
            disabled={!title.trim()}
            className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
          >
            Create Issue
          </button>
        </div>
      </div>
    </div>
  );
}
