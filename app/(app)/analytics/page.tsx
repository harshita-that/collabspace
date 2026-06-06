'use client';

import { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, TrendingDown, Users, FileText, CheckSquare, Clock } from 'lucide-react';
import { VELOCITY_DATA, WEEKLY_BREAKDOWN, BURNDOWN_DATA, MEMBER_WORKLOAD, ISSUES, MEMBERS, DOCS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

function StatCard({ label, value, unit, trend, trendLabel, icon: Icon, color }: {
  label: string;
  value: string | number;
  unit?: string;
  trend: number;
  trendLabel: string;
  icon: React.ElementType;
  color: string;
}) {
  const isPositive = trend >= 0;
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', color)}>
          <Icon size={20} className="text-white" />
        </div>
        <div className={cn('flex items-center gap-1 text-xs font-medium', isPositive ? 'text-green-500' : 'text-red-500')}>
          {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {Math.abs(trend)}%
        </div>
      </div>
      <div className="metric-value text-3xl font-bold">{value}{unit && <span className="text-lg text-muted-foreground ml-1">{unit}</span>}</div>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
      <p className="text-xs text-muted-foreground/60 mt-0.5">{trendLabel}</p>
    </div>
  );
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('last-3-months');
  const [projectFilter, setProjectFilter] = useState('all');

  const openIssues = ISSUES.filter(i => i.status !== 'done').length;
  const doneIssues = ISSUES.filter(i => i.status === 'done').length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Team performance and project health metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="px-3 py-1.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-primary"
          >
            <option value="last-month">Last Month</option>
            <option value="last-3-months">Last 3 Months</option>
            <option value="last-6-months">Last 6 Months</option>
            <option value="this-year">This Year</option>
          </select>
          <select
            value={projectFilter}
            onChange={e => setProjectFilter(e.target.value)}
            className="px-3 py-1.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-primary"
          >
            <option value="all">All Projects</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Open Issues"
          value={openIssues}
          trend={-12}
          trendLabel="vs. last sprint"
          icon={CheckSquare}
          color="bg-primary"
        />
        <StatCard
          label="Avg Resolution Time"
          value="4.2"
          unit="days"
          trend={-8}
          trendLabel="vs. last sprint"
          icon={Clock}
          color="bg-yellow-500"
        />
        <StatCard
          label="Docs Created"
          value={3}
          trendLabel="this week"
          trend={50}
          icon={FileText}
          color="bg-green-500"
        />
        <StatCard
          label="Active Members"
          value={MEMBERS.filter(m => m.role !== 'viewer').length}
          trend={0}
          trendLabel="no change"
          icon={Users}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Velocity Chart */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold mb-1">Sprint Velocity</h2>
          <p className="text-xs text-muted-foreground mb-4">Issues opened vs. closed per sprint</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={VELOCITY_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="sprint" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip
                contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="closed" stroke="#30a46c" strokeWidth={2.5} dot={{ r: 3 }} name="Closed" />
              <Line type="monotone" dataKey="opened" stroke="#5b5ef4" strokeWidth={2.5} dot={{ r: 3 }} name="Opened" strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Issue Breakdown */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold mb-1">Issue Breakdown by Priority</h2>
          <p className="text-xs text-muted-foreground mb-4">Stacked by priority level, per week</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={WEEKLY_BREAKDOWN} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip
                contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="urgent" stackId="a" fill="#e5484d" name="Urgent" />
              <Bar dataKey="high" stackId="a" fill="#f97316" name="High" />
              <Bar dataKey="medium" stackId="a" fill="#eab308" name="Medium" />
              <Bar dataKey="low" stackId="a" fill="#60a5fa" name="Low" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sprint Burndown */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h2 className="font-semibold mb-1">Sprint Burndown</h2>
        <p className="text-xs text-muted-foreground mb-4">Remaining vs. ideal burndown for current sprint</p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={BURNDOWN_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="remaining" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5b5ef4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#5b5ef4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip
              contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="remaining" stroke="#5b5ef4" strokeWidth={2.5} fill="url(#remaining)" name="Remaining" />
            <Line type="monotone" dataKey="ideal" stroke="#30a46c" strokeWidth={1.5} strokeDasharray="4 2" dot={false} name="Ideal" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Member Workload Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold">Member Workload</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Issue distribution across team members</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Member</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Open</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">In Progress</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Done This Week</th>
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground">Workload</th>
            </tr>
          </thead>
          <tbody>
            {MEMBER_WORKLOAD.map(row => {
              const total = row.openIssues + row.inProgress;
              const completedPct = Math.min(100, (row.completedThisWeek / Math.max(total + row.completedThisWeek, 1)) * 100);
              return (
                <tr key={row.member.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={row.member.avatar} alt={row.member.name} className="w-7 h-7 rounded-full" />
                      <div>
                        <p className="font-medium text-sm">{row.member.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{row.member.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="metric-value font-medium">{row.openIssues}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="metric-value font-medium text-yellow-500">{row.inProgress}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="metric-value font-medium text-green-500">{row.completedThisWeek}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${Math.min(100, (total / 15) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8">{total}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
