'use client';

import { useState } from 'react';

const NOTIFICATION_SETTINGS = [
  { category: 'Issues', events: ['Issue assigned to you', 'Issue status changed', 'Comment on your issue', 'Issue due date approaching'] },
  { category: 'Docs', events: ['Doc shared with you', 'Comment on your doc', 'Doc edited by collaborator'] },
  { category: 'Projects', events: ['Added to a project', 'Project milestone reached', 'Sprint started or ended'] },
  { category: 'Team', events: ['New member joined', 'Member role changed', 'Workspace settings changed'] },
];

export default function NotificationsPage() {
  const [settings, setSettings] = useState<Record<string, { email: boolean; inApp: boolean }>>({});

  const get = (event: string) => settings[event] ?? { email: true, inApp: true };
  const toggle = (event: string, type: 'email' | 'inApp') => {
    const current = get(event);
    setSettings(prev => ({ ...prev, [event]: { ...current, [type]: !current[type] } }));
  };

  return (
    <div className="p-8 max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-muted-foreground text-sm mt-1">Configure when and how you receive notifications</p>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="flex items-center px-5 py-3 border-b border-border bg-muted/30">
          <span className="flex-1 text-xs font-semibold text-muted-foreground">Event</span>
          <span className="w-16 text-center text-xs font-semibold text-muted-foreground">Email</span>
          <span className="w-16 text-center text-xs font-semibold text-muted-foreground">In-App</span>
        </div>

        {NOTIFICATION_SETTINGS.map(section => (
          <div key={section.category}>
            <div className="px-5 py-2.5 bg-muted/20 border-b border-border/50">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{section.category}</span>
            </div>
            {section.events.map(event => {
              const cfg = get(event);
              return (
                <div key={event} className="flex items-center px-5 py-3 border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                  <span className="flex-1 text-sm">{event}</span>
                  <div className="w-16 flex justify-center">
                    <button
                      onClick={() => toggle(event, 'email')}
                      className={`w-9 h-5 rounded-full transition-colors relative ${cfg.email ? 'bg-primary' : 'bg-muted'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${cfg.email ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                  <div className="w-16 flex justify-center">
                    <button
                      onClick={() => toggle(event, 'inApp')}
                      className={`w-9 h-5 rounded-full transition-colors relative ${cfg.inApp ? 'bg-primary' : 'bg-muted'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${cfg.inApp ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <button className="px-5 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium">
        Save Preferences
      </button>
    </div>
  );
}
