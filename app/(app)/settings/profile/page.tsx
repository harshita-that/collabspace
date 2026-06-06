'use client';

import { useState } from 'react';
import { Camera } from 'lucide-react';
import { CURRENT_USER } from '@/lib/mock-data';

export default function ProfilePage() {
  const [name, setName] = useState(CURRENT_USER.name);
  const [email, setEmail] = useState(CURRENT_USER.email);
  const [timezone, setTimezone] = useState('America/New_York');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your personal account settings</p>
      </div>

      {/* Avatar */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-semibold mb-4">Profile Photo</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <img src={CURRENT_USER.avatar} alt={CURRENT_USER.name} className="w-20 h-20 rounded-full ring-4 ring-border" />
            <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors shadow-md">
              <Camera size={14} />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium">{CURRENT_USER.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG or GIF — max 5 MB</p>
            <button className="text-xs text-primary hover:underline mt-2 block">Upload new photo</button>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <h2 className="font-semibold">Personal Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Timezone</label>
            <select
              value={timezone}
              onChange={e => setTimezone(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-primary"
            >
              <option value="America/New_York">Eastern Time (UTC-5)</option>
              <option value="America/Los_Angeles">Pacific Time (UTC-8)</option>
              <option value="Europe/London">London (UTC+0)</option>
              <option value="Europe/Berlin">Berlin (UTC+1)</option>
              <option value="Asia/Tokyo">Tokyo (UTC+9)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Role</label>
            <input
              type="text"
              value="Admin"
              disabled
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-muted text-muted-foreground cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            className="px-5 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
          >
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Password */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <h2 className="font-semibold">Change Password</h2>
        <div className="space-y-3">
          {['Current Password', 'New Password', 'Confirm New Password'].map(label => (
            <div key={label}>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">{label}</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          ))}
        </div>
        <button className="px-5 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors font-medium">
          Update Password
        </button>
      </div>
    </div>
  );
}
