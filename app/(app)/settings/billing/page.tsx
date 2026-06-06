'use client';

import { ArrowRight, Zap } from 'lucide-react';

const PLAN = {
  name: 'Pro',
  seats: 8,
  usedSeats: 6,
  storageGb: 50,
  usedStorageGb: 22,
  docsLimit: 500,
  usedDocs: 134,
  price: 96,
  renewsAt: 'July 1, 2026',
};

function UsageBar({ used, total, label, unit }: { used: number; total: number; label: string; unit: string }) {
  const pct = (used / total) * 100;
  const color = pct > 80 ? 'bg-red-500' : pct > 60 ? 'bg-yellow-500' : 'bg-primary';
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-muted-foreground metric-value">{used} / {total} {unit}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <div className="p-8 max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your subscription and usage</p>
      </div>

      {/* Current Plan */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-primary/10 text-primary">Pro Plan</span>
            </div>
            <h2 className="text-2xl font-bold mt-2">${PLAN.price}<span className="text-base font-normal text-muted-foreground">/mo</span></h2>
            <p className="text-sm text-muted-foreground mt-0.5">{PLAN.seats} seats &middot; Renews {PLAN.renewsAt}</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium">
            <Zap size={14} />
            Upgrade to Enterprise
          </button>
        </div>
      </div>

      {/* Usage */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-5">
        <h2 className="font-semibold">Usage</h2>
        <UsageBar used={PLAN.usedSeats} total={PLAN.seats} label="Seats" unit="seats" />
        <UsageBar used={PLAN.usedStorageGb} total={PLAN.storageGb} label="Storage" unit="GB" />
        <UsageBar used={PLAN.usedDocs} total={PLAN.docsLimit} label="Documents" unit="docs" />
      </div>

      {/* Payment Method */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-semibold mb-4">Payment Method</h2>
        <div className="flex items-center justify-between p-3 rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-7 rounded bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">VISA</div>
            <div>
              <p className="text-sm font-medium">•••• •••• •••• 4242</p>
              <p className="text-xs text-muted-foreground">Expires 12/27</p>
            </div>
          </div>
          <button className="text-xs text-primary hover:underline">Update</button>
        </div>
      </div>

      {/* Invoice History */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-semibold mb-4">Invoice History</h2>
        <div className="space-y-2">
          {[
            { date: 'Jun 1, 2026', amount: '$96.00', status: 'Paid' },
            { date: 'May 1, 2026', amount: '$96.00', status: 'Paid' },
            { date: 'Apr 1, 2026', amount: '$96.00', status: 'Paid' },
          ].map(inv => (
            <div key={inv.date} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <span className="text-sm">{inv.date}</span>
              <span className="text-sm font-medium">{inv.amount}</span>
              <span className="text-xs text-green-500 font-medium">{inv.status}</span>
              <button className="text-xs text-primary hover:underline">Download</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
