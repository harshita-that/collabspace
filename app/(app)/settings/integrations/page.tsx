'use client';

import { useState } from 'react';
import { Github, Slack, Figma, ExternalLink, Check } from 'lucide-react';

const INTEGRATIONS = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Sync issues with GitHub pull requests and link commits to issues.',
    icon: Github,
    color: '#24292f',
    connected: true,
    connectedAs: 'acmecorp-org',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Send notifications to Slack channels when issues or docs are updated.',
    icon: Slack,
    color: '#4A154B',
    connected: false,
  },
  {
    id: 'figma',
    name: 'Figma',
    description: 'Embed Figma designs directly in docs and link frames to issues.',
    icon: Figma,
    color: '#F24E1E',
    connected: false,
  },
  {
    id: 'jira',
    name: 'Jira',
    description: 'Two-way sync with Jira projects and import existing issues.',
    icon: ExternalLink,
    color: '#0052CC',
    connected: false,
  },
];

export default function IntegrationsPage() {
  const [connections, setConnections] = useState<Record<string, boolean>>(
    Object.fromEntries(INTEGRATIONS.map(i => [i.id, i.connected]))
  );

  return (
    <div className="p-8 max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Integrations</h1>
        <p className="text-muted-foreground text-sm mt-1">Connect your tools and automate workflows</p>
      </div>

      <div className="space-y-4">
        {INTEGRATIONS.map(integration => {
          const Icon = integration.icon;
          const isConnected = connections[integration.id];
          return (
            <div key={integration.id} className="bg-card rounded-xl border border-border p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: integration.color + '15' }}>
                <Icon size={22} style={{ color: integration.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{integration.name}</h3>
                  {isConnected && (
                    <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
                      <Check size={11} />
                      Connected
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{integration.description}</p>
                {isConnected && integration.connectedAs && (
                  <p className="text-xs text-muted-foreground mt-1">Connected as <strong>{integration.connectedAs}</strong></p>
                )}
              </div>
              <button
                onClick={() => setConnections(prev => ({ ...prev, [integration.id]: !prev[integration.id] }))}
                className={`flex-shrink-0 px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                  isConnected
                    ? 'border border-border hover:bg-muted text-muted-foreground'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {isConnected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
