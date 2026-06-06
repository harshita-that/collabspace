'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  BarChart2,
  FileText,
  Zap,
  Users,
  Shield,
  Globe,
  Moon,
  Sun,
  Menu,
  X,
  ChevronRight,
  Star,
  Play,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const FEATURES = [
  {
    icon: FileText,
    title: 'Collaborative Docs',
    description: 'Write together in real time. Block-based editing with comments, version history, and structured templates.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: CheckCircle2,
    title: 'Issue Tracking',
    description: 'Linear-inspired kanban, list, and timeline views. Full priority management, labels, and sprint cycles.',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    icon: BarChart2,
    title: 'Analytics & Insights',
    description: 'Velocity charts, burndowns, member workload — everything you need to ship faster and smarter.',
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
  },
  {
    icon: Users,
    title: 'Team Management',
    description: 'Role-based access, workspace switcher, invites, and audit-ready member activity logs.',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Zap,
    title: 'Real-Time Sync',
    description: 'See teammate cursors, live status changes, and instant notifications — no refresh needed.',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'SSO, fine-grained permissions, audit logs, and data residency options out of the box.',
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
];

const TESTIMONIALS = [
  {
    quote: "CollabSpace replaced four tools for us — Linear, Notion, Confluence, and Google Analytics. It's the missing link.",
    name: 'Sarah K.',
    role: 'CTO, Vercel clone',
    avatar: 'https://i.pravatar.cc/48?img=47',
    stars: 5,
  },
  {
    quote: "The issue tracker is the best I've used. Linear-fast, but with the docs and analytics baked right in.",
    name: 'James R.',
    role: 'Engineering Lead',
    avatar: 'https://i.pravatar.cc/48?img=32',
    stars: 5,
  },
  {
    quote: "Our sprint velocity improved 40% after switching. Having docs and issues in one place is a superpower.",
    name: 'Mia T.',
    role: 'Product Manager',
    avatar: 'https://i.pravatar.cc/48?img=21',
    stars: 5,
  },
];

const STATS = [
  { value: '50K+', label: 'Teams worldwide' },
  { value: '12M+', label: 'Issues tracked' },
  { value: '4.9★', label: 'Average rating' },
  { value: '99.9%', label: 'Uptime SLA' },
];

const COMPANIES = ['Stripe', 'Linear', 'Vercel', 'Figma', 'Notion', 'Loom'];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm' : 'bg-transparent'
    )}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span>CollabSpace</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          {['Features', 'Pricing', 'Docs', 'Blog', 'Changelog'].map(item => (
            <a key={item} href="#" className="hover:text-foreground transition-colors">{item}</a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link href="/login">
            <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign in
            </button>
          </Link>
          <Link href="/signup">
            <button className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              Get started free
            </button>
          </Link>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-muted-foreground hover:text-foreground">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border px-6 py-4 space-y-3">
          {['Features', 'Pricing', 'Docs', 'Blog'].map(item => (
            <a key={item} href="#" className="block text-sm font-medium text-muted-foreground hover:text-foreground">{item}</a>
          ))}
          <div className="pt-3 border-t border-border flex flex-col gap-2">
            <Link href="/login" className="text-sm font-medium text-center py-2 border border-border rounded-lg hover:bg-muted transition-colors">Sign in</Link>
            <Link href="/signup" className="text-sm font-semibold text-center py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">Get started free</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

function ProductScreenshot() {
  return (
    <div className="relative mx-auto max-w-5xl mt-16 px-4">
      <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl shadow-primary/10 ring-1 ring-border">
        {/* Fake browser bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-muted/60 border-b border-border">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 mx-4 h-6 bg-background/60 rounded-md flex items-center px-3">
            <span className="text-xs text-muted-foreground font-mono">app.collabspace.io/dashboard</span>
          </div>
        </div>
        {/* Mock app content */}
        <div className="bg-background flex h-[440px]">
          {/* Sidebar */}
          <div className="w-48 border-r border-border bg-muted/30 p-3 flex flex-col gap-1">
            <div className="h-7 w-36 bg-muted rounded-lg mb-2" />
            {['Home', 'Inbox', 'My Work', 'Issues', 'Docs', 'Analytics'].map((item, i) => (
              <div key={item} className={cn('h-7 rounded-md flex items-center px-2 gap-2', i === 0 ? 'bg-primary/10' : '')}>
                <div className={cn('w-3 h-3 rounded-sm flex-shrink-0', i === 0 ? 'bg-primary' : 'bg-muted')} />
                <div className={cn('h-2.5 rounded', i === 0 ? 'w-8 bg-primary/50' : 'w-16 bg-muted')} />
              </div>
            ))}
            <div className="mt-3 space-y-1">
              {['Platform Core', 'Design System', 'Mobile App'].map((p, i) => (
                <div key={p} className="h-6 rounded flex items-center px-2 gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: ['#8b2246','#30a46c','#e5484d'][i] }} />
                  <div className="h-2 rounded bg-muted flex-1" />
                </div>
              ))}
            </div>
          </div>
          {/* Main content */}
          <div className="flex-1 p-5 overflow-hidden">
            <div className="h-8 w-64 bg-muted rounded-lg mb-5" />
            <div className="grid grid-cols-4 gap-3 mb-5">
              {['#8b2246', '#30a46c', '#eab308', '#6b2238'].map((c, i) => (
                <div key={i} className={cn('rounded-xl border border-border p-3 bg-card')}>
                  <div className="h-6 w-12 rounded mb-1" style={{ background: c + '30' }} />
                  <div className="h-3 w-16 bg-muted rounded" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border p-3 bg-card">
                <div className="h-4 w-24 bg-muted rounded mb-3" />
                <div className="space-y-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex gap-2 items-center">
                      <div className="w-5 h-5 rounded-full bg-muted flex-shrink-0" />
                      <div className="h-3 bg-muted rounded flex-1" />
                      <div className="h-4 w-14 rounded-full" style={{ background: ['#5b5ef420','#30a46c20','#eab30820'][i-1] }} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-border p-3 bg-card">
                <div className="h-4 w-20 bg-muted rounded mb-3" />
                <div className="flex gap-1 h-24 items-end">
                  {[6,9,7,12,8,14,10,15].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t" style={{ height: `${h * 6}%`, background: '#8b2246' + (i % 2 === 0 ? '80' : '') }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute -inset-10 -z-10 bg-primary/5 rounded-3xl blur-3xl" />
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            New: Timeline view & sprint burndowns just shipped
            <ChevronRight size={14} />
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
            The workspace where
            <br />
            <span className="text-primary">great teams ship</span>
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
            CollabSpace combines collaborative docs, Linear-style issue tracking, and PostHog-inspired analytics into one fast, beautiful workspace — no more tab switching.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-4 flex-wrap mb-6">
            <Link href="/signup">
              <button className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-white font-semibold text-base hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5">
                Start for free
                <ArrowRight size={18} />
              </button>
            </Link>
            <a href="#demo" className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-border hover:bg-muted transition-all font-semibold text-base hover:-translate-y-0.5">
              <Play size={16} className="text-muted-foreground" />
              Watch demo
            </a>
          </div>
          <p className="text-sm text-muted-foreground">Free forever for teams under 10. No credit card required.</p>
        </div>

        <ProductScreenshot />
      </section>

      {/* Social proof logos */}
      <section className="py-16 border-y border-border bg-muted/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-8">Trusted by teams at</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {COMPANIES.map(company => (
              <div key={company} className="text-muted-foreground/50 font-bold text-lg tracking-tight hover:text-muted-foreground transition-colors">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map(stat => (
            <div key={stat.label}>
              <div className="text-4xl font-extrabold text-primary metric-value">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-muted/20 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything your team needs</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Stop switching between five tools. CollabSpace gives your team one unified workspace that actually works.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(feature => (
              <div key={feature.title} className="bg-card rounded-2xl border border-border p-6 hover:border-primary/30 hover:shadow-lg transition-all hover:-translate-y-1 group">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4', feature.bg)}>
                  <feature.icon size={22} className={feature.color} />
                </div>
                <h3 className="font-bold text-base mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by engineering teams</h2>
            <p className="text-muted-foreground">See what teams are saying after making the switch.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-card rounded-2xl border border-border p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed text-foreground/80 mb-5">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full" />
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing tease */}
      <section className="py-20 px-6 bg-muted/20 border-y border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-muted-foreground mb-10 text-lg">Start free. Upgrade when you need to. No surprise fees.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { plan: 'Free', price: '$0', period: 'forever', features: ['Up to 10 members', '5 projects', '1,000 issues', 'Community support'], cta: 'Get started', accent: false },
              { plan: 'Pro', price: '$12', period: 'per seat/mo', features: ['Unlimited members', 'Unlimited projects', 'Analytics & insights', 'Priority support', 'Custom integrations'], cta: 'Start Pro trial', accent: true },
              { plan: 'Enterprise', price: 'Custom', period: 'contact us', features: ['SSO & SAML', 'Data residency', 'Dedicated support', 'SLA guarantee', 'Custom contracts'], cta: 'Talk to sales', accent: false },
            ].map(tier => (
              <div key={tier.plan} className={cn(
                'rounded-2xl border p-6 flex flex-col',
                tier.accent
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                  : 'border-border bg-card'
              )}>
                {tier.accent && (
                  <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full self-start mb-3">Most Popular</span>
                )}
                <h3 className="font-bold text-lg">{tier.plan}</h3>
                <div className="mt-2 mb-4">
                  <span className="text-3xl font-extrabold metric-value">{tier.price}</span>
                  <span className="text-sm text-muted-foreground ml-1">{tier.period}</span>
                </div>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <button className={cn(
                    'w-full py-2.5 rounded-xl font-semibold text-sm transition-all',
                    tier.accent
                      ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20'
                      : 'border border-border hover:bg-muted'
                  )}>
                    {tier.cta}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your team deserves a better workspace.
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Join 50,000+ teams who use CollabSpace to ship faster, together.
          </p>
          <Link href="/signup">
            <button className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 hover:-translate-y-0.5">
              Get started free
              <ArrowRight size={20} />
            </button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">No credit card required &middot; Setup in 2 minutes</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-3">
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                  <Zap size={13} className="text-white" />
                </div>
                CollabSpace
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                The collaborative workspace for modern engineering teams.
              </p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
              { title: 'Resources', links: ['Docs', 'Blog', 'API', 'Status'] },
              { title: 'Company', links: ['About', 'Careers', 'Privacy', 'Terms'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="font-semibold text-sm mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border gap-4">
            <p className="text-sm text-muted-foreground">&copy; 2026 CollabSpace. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Globe size={14} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">English</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
