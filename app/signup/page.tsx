'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Zap, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp } = useAuth();
  const { theme, setTheme } = useTheme();

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabels = ['', 'Weak', 'Good', 'Strong'];
  const strengthColors = ['', 'bg-red-400', 'bg-yellow-400', 'bg-green-500'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await signUp(email, password, name);
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
            Start shipping<br />faster today
          </h2>
          <p className="text-white/70 text-base leading-relaxed mb-8">
            Everything your team needs. Free forever for teams under 10.
          </p>
          <div className="space-y-4">
            {[
              { title: 'Setup in 2 minutes', desc: 'Import your existing issues or start fresh.' },
              { title: 'Free forever', desc: 'No credit card. No trial period. Just build.' },
              { title: 'Invite your team', desc: 'Bring everyone in — it\'s free up to 10 members.' },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 size={13} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                  <p className="text-white/60 text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/50 text-xs relative">
          SOC2 Type II &middot; GDPR Compliant &middot; Data encrypted at rest
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
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
            <h1 className="text-2xl font-bold mb-2">Create your account</h1>
            <p className="text-muted-foreground text-sm">Get started with CollabSpace — it&apos;s free</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Full name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Alex Chen"
                required
                autoFocus
                autoComplete="name"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Work email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                autoComplete="email"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  autoComplete="new-password"
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
              {password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3].map(level => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-all ${
                          passwordStrength >= level ? strengthColors[passwordStrength] : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{strengthLabels[passwordStrength]}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !name.trim() || !email.trim() || !password.trim()}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create account
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>

          <p className="mt-8 text-center text-xs text-muted-foreground/60">
            By creating an account, you agree to our{' '}
            <a href="#" className="hover:underline">Terms</a> and{' '}
            <a href="#" className="hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
