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
      </div>
    </div>
  );
}
