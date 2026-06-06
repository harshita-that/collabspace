'use client';

import { useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import {
  UserPlus,
  MoreHorizontal,
  Check,
  X,
  Mail,
  Shield,
  ChevronDown,
} from 'lucide-react';
import { MEMBERS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import type { WorkspaceRole } from '@/lib/types';

const ROLE_BADGES: Record<WorkspaceRole, { label: string; color: string }> = {
  admin: { label: 'Admin', color: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' },
  member: { label: 'Member', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
  viewer: { label: 'Viewer', color: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400' },
};

const PERMISSIONS = [
  { action: 'View issues and docs', admin: true, member: true, viewer: true },
  { action: 'Create and edit issues', admin: true, member: true, viewer: false },
  { action: 'Create and edit docs', admin: true, member: true, viewer: false },
  { action: 'Delete issues and docs', admin: true, member: false, viewer: false },
  { action: 'Manage members', admin: true, member: false, viewer: false },
  { action: 'Billing and plan management', admin: true, member: false, viewer: false },
  { action: 'Workspace settings', admin: true, member: false, viewer: false },
  { action: 'API key management', admin: true, member: false, viewer: false },
];

const PENDING_INVITES = [
  { email: 'david.kim@acme.com', role: 'member' as WorkspaceRole, sentAt: '2026-06-05T10:00:00Z' },
  { email: 'anna.schmidt@acme.com', role: 'viewer' as WorkspaceRole, sentAt: '2026-06-06T09:00:00Z' },
];

function InviteModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<WorkspaceRole>('member');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-popover border border-border rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold">Invite Team Member</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Email Address</label>
            <input
              type="email"
              placeholder="colleague@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-primary transition-colors"
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Role</label>
            <select value={role} onChange={e => setRole(e.target.value as WorkspaceRole)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-primary">
              <option value="admin">Admin — Full access</option>
              <option value="member">Member — Can create and edit</option>
              <option value="viewer">Viewer — Read only</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors">Cancel</button>
          <button onClick={onClose} disabled={!email.trim()} className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium disabled:opacity-50">
            Send Invite
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MembersPage() {
  const [showInvite, setShowInvite] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Members</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Acme Corp &middot; {MEMBERS.length} members</p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          <UserPlus size={16} />
          Invite Member
        </button>
      </div>

      {/* Members Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Member</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Role</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Joined</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Last Active</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Issues</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {MEMBERS.map(member => {
              const roleCfg = ROLE_BADGES[member.role];
              return (
                <tr key={member.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full flex-shrink-0" />
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cn('status-badge', roleCfg.color)}>
                      {roleCfg.label}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-muted-foreground">
                    {format(new Date(member.joinedAt), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(member.lastActive), { addSuffix: true })}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="metric-value font-medium">{member.issuesAssigned}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === member.id ? null : member.id)}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <MoreHorizontal size={15} />
                      </button>
                      {openMenuId === member.id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                          <div className="absolute right-0 top-full mt-1 w-44 bg-popover border border-border rounded-xl shadow-lg z-50 py-1">
                            <button className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors text-left" onClick={() => setOpenMenuId(null)}>
                              <Shield size={13} className="text-muted-foreground" />
                              Change role
                            </button>
                            <button className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors text-left" onClick={() => setOpenMenuId(null)}>
                              <Mail size={13} className="text-muted-foreground" />
                              Send message
                            </button>
                            <div className="border-t border-border my-1" />
                            <button className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors text-left text-red-500" onClick={() => setOpenMenuId(null)}>
                              <X size={13} />
                              Remove from workspace
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pending Invites */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold">Pending Invites</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{PENDING_INVITES.length} invitations awaiting acceptance</p>
        </div>
        <div className="divide-y divide-border">
          {PENDING_INVITES.map(invite => (
            <div key={invite.email} className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <Mail size={14} />
                </div>
                <div>
                  <p className="font-medium text-sm">{invite.email}</p>
                  <p className="text-xs text-muted-foreground">Sent {formatDistanceToNow(new Date(invite.sentAt), { addSuffix: true })}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn('status-badge', ROLE_BADGES[invite.role].color)}>
                  {ROLE_BADGES[invite.role].label}
                </span>
                <button className="text-xs text-muted-foreground hover:text-red-500 transition-colors">Revoke</button>
                <button className="text-xs text-muted-foreground hover:text-primary transition-colors">Resend</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roles & Permissions */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold">Roles &amp; Permissions</h2>
          <p className="text-xs text-muted-foreground mt-0.5">What each role can do in this workspace</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Permission</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-red-600">Admin</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-blue-600">Member</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-zinc-500">Viewer</th>
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map(perm => (
                <tr key={perm.action} className="border-b border-border/50">
                  <td className="px-5 py-2.5 text-sm">{perm.action}</td>
                  {[perm.admin, perm.member, perm.viewer].map((allowed, i) => (
                    <td key={i} className="px-4 py-2.5 text-center">
                      {allowed
                        ? <Check size={15} className="inline text-green-500" />
                        : <X size={15} className="inline text-muted-foreground/40" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
    </div>
  );
}
