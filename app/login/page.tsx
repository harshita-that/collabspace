'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Zap, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError(null);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col w-[420px] flex-shrink-0 bg-primary p-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/20 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/20 translate-y-1/2 -translate-x-1/2" />
        </div>
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-white relative">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          CollabSpace
        </Link>
        <div className="flex-1 flex flex-col justify-center relative">
          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            Your team&apos;s<br />unified workspace
          </h2>
          <p className="text-white/70 text-base leading-relaxed mb-8">
            Docs, issues, and analytics in one place. Ship faster, collaborate better.
          </p>
          <div className="space-y-3">
            {[
              'Linear-style issue tracking',
              'Real-time collaborative docs',
              'PostHog-inspired analytics',
              'Team management & roles',
            ].map(item => (
              <div key={item} className="flex items-center gap-3 text-white/80 text-sm">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <ArrowRight size={11} className="text-white" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 relative">
          {['https://i.pravatar.cc/32?img=1','https://i.pravatar.cc/32?img=5','https://i.pravatar.cc/32?img=3'].map((src, i) => (
            <img key={i} src={src} className="w-8 h-8 rounded-full ring-2 ring-white/20" alt="" />
          ))}
          <p className="text-white/70 text-sm">Join 50K+ teams already using CollabSpace</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Theme toggle + nav */}
        <div className="absolute top-6 right-6 flex items-center gap-3">
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
        <Link href="/" className="absolute top-6 left-6 lg:hidden flex items-center gap-2 font-bold">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Zap size={13} className="text-white" />
          </div>
          CollabSpace
        </Link>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
            <p className="text-muted-foreground text-sm">Sign in to your CollabSpace workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                autoFocus
                autoComplete="email"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Password</label>
                <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim() || !password.trim()}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary font-semibold hover:underline">
              Create one free
            </Link>
          </p>

          <p className="mt-8 text-center text-xs text-muted-foreground/60">
            By continuing, you agree to our{' '}
            <a href="#" className="hover:underline">Terms</a> and{' '}
            <a href="#" className="hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
