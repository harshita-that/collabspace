'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function WorkspaceSettingsPage() {
  const [name, setName] = useState('Acme Corp');
  const [slug, setSlug] = useState('acme-corp');
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="p-8 max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Workspace Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your workspace configuration</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <h2 className="font-semibold">General</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Workspace Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Workspace Slug</label>
            <div className="flex items-center">
              <span className="px-3 py-2 text-sm bg-muted border border-r-0 border-border rounded-l-lg text-muted-foreground">collabspace.io/</span>
              <input type="text" value={slug} onChange={e => setSlug(e.target.value)}
                className="flex-1 px-3 py-2 text-sm rounded-r-lg border border-border bg-background focus:outline-none focus:border-primary transition-colors" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Workspace Logo</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center text-white text-2xl font-bold">A</div>
              <button className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors">
                Upload Logo
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <button
            onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
            className="px-5 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
          >
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-card rounded-xl border border-red-200 dark:border-red-900 p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={18} className="text-red-500" />
          <h2 className="font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Delete this workspace</p>
            <p className="text-xs text-muted-foreground mt-1">Permanently delete the Acme Corp workspace and all its data. This action cannot be undone.</p>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex-shrink-0 px-4 py-2 text-sm rounded-lg border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors font-medium"
          >
            Delete Workspace
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-popover border border-border rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center">
                <AlertTriangle size={18} className="text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold">Delete workspace</h3>
                <p className="text-xs text-muted-foreground">This cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Type <strong className="text-foreground">acme-corp</strong> to confirm deletion.
            </p>
            <input type="text" placeholder="acme-corp" className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-red-500 mb-4 transition-colors" />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors">Cancel</button>
              <button className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-medium">Delete Workspace</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
