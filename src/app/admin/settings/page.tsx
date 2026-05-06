"use client";

import { PasswordSettings } from "../components/PasswordSettings";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] font-bold text-brand-primary">Settings</h1>
        <p className="text-gray-500">Manage your account settings and security.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <PasswordSettings />
        
        {/* Placeholder for other settings */}
        <div className="p-8 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 bg-white/50">
          <p className="font-medium">Account Profile Settings</p>
          <p className="text-sm">Additional profile management features can be added here.</p>
        </div>
      </div>
    </div>
  );
}
