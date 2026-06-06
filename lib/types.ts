export type WorkspaceRole = 'admin' | 'member' | 'viewer';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  plan: 'free' | 'pro' | 'enterprise';
  memberCount: number;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: WorkspaceRole;
  joinedAt: string;
  lastActive: string;
  issuesAssigned: number;
}

export type IssueStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done';
export type IssuePriority = 'urgent' | 'high' | 'medium' | 'low' | 'none';

export interface Issue {
  id: string;
  identifier: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  assignee?: Member;
  labels: string[];
  projectId: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  milestoneId?: string;
  cycleId?: string;
}

export interface Doc {
  id: string;
  title: string;
  content: string;
  projectId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  collaborators: Member[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  memberIds: string[];
  openIssues: number;
  docCount: number;
  progress: number;
  lastActivity: string;
  workspaceId: string;
}

export interface Notification {
  id: string;
  type: 'comment' | 'assignment' | 'status_change' | 'mention' | 'invite';
  actor: Member;
  target: string;
  targetType: 'issue' | 'doc' | 'project';
  targetId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  type: 'edit' | 'comment' | 'status_change' | 'assignment' | 'create';
  actor: Member;
  target: string;
  targetType: 'issue' | 'doc' | 'project';
  targetId: string;
  description: string;
  createdAt: string;
}

export interface SprintData {
  sprint: string;
  closed: number;
  opened: number;
}

export interface WeeklyBreakdown {
  week: string;
  urgent: number;
  high: number;
  medium: number;
  low: number;
}

export interface MemberWorkload {
  member: Member;
  openIssues: number;
  inProgress: number;
  completedThisWeek: number;
}

export interface HeatmapData {
  date: string;
  count: number;
}

export interface BurndownData {
  day: string;
  remaining: number;
  ideal: number;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
}
