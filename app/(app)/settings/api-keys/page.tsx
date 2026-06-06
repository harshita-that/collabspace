'use client';

import { useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { Plus, Copy, Trash2, Check } from 'lucide-react';
import { API_KEYS } from '@/lib/mock-data';
import type { ApiKey } from '@/lib/types';

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(API_KEYS);
  const [copied, setCopied] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');

  const handleCopy = (id: string, key: string) => {
    navigator.clipboard.writeText(key).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleRevoke = (id: string) => {
    setKeys(prev => prev.filter(k => k.id !== id));
  };

  const handleCreate = () => {
    if (!newKeyName.trim()) return;
    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name: newKeyName.trim(),
      key: `cs_live_••••••••••••••••${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setKeys(prev => [newKey, ...prev]);
    setNewKeyName('');
    setShowCreate(false);
  };

  return (
    <div className="p-8 max-w-2xl space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">API Keys</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage API keys for programmatic access</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          Generate Key
        </button>
      </div>

      {showCreate && (
        <div className="bg-card rounded-xl border border-primary/30 p-5 space-y-3">
          <h3 className="font-semibold">New API Key</h3>
          <input
            type="text"
            placeholder="Key name (e.g., Production, CI/CD)"
            value={newKeyName}
            onChange={e => setNewKeyName(e.target.value)}
            autoFocus
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-primary transition-colors"
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors">Cancel</button>
            <button onClick={handleCreate} disabled={!newKeyName.trim()} className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium disabled:opacity-50">
              Generate
            </button>
          </div>
        </div>
      )}

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="flex items-center px-5 py-3 border-b border-border bg-muted/30">
          <span className="flex-1 text-xs font-semibold text-muted-foreground">Key Name</span>
          <span className="flex-1 text-xs font-semibold text-muted-foreground">Key</span>
          <span className="w-36 text-xs font-semibold text-muted-foreground">Last Used</span>
          <span className="w-28 text-xs font-semibold text-muted-foreground">Created</span>
          <span className="w-20" />
        </div>

        {keys.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <p className="text-sm">No API keys yet. Generate your first key above.</p>
          </div>
        ) : keys.map(key => (
          <div key={key.id} className="flex items-center px-5 py-4 border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
            <div className="flex-1">
              <p className="text-sm font-medium">{key.name}</p>
            </div>
            <div className="flex-1">
              <span className="font-mono text-xs text-muted-foreground">{key.key}</span>
            </div>
            <div className="w-36 text-xs text-muted-foreground">
              {key.lastUsed ? formatDistanceToNow(new Date(key.lastUsed), { addSuffix: true }) : 'Never'}
            </div>
            <div className="w-28 text-xs text-muted-foreground">
              {format(new Date(key.createdAt), 'MMM d, yyyy')}
            </div>
            <div className="w-20 flex items-center justify-end gap-1">
              <button
                onClick={() => handleCopy(key.id, key.key)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Copy key"
              >
                {copied === key.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>
              <button
                onClick={() => handleRevoke(key.id)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-red-500 hover:bg-muted transition-colors"
                title="Revoke key"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900 rounded-xl p-4">
        <p className="text-xs text-yellow-700 dark:text-yellow-400">
          <strong>Security note:</strong> API keys provide full access to your workspace. Never share them publicly or commit them to version control.
        </p>
      </div>
    </div>
  );
}
