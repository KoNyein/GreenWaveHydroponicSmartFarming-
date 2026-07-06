"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { usePhase4Store } from "@/lib/phase4-store";
import { Bell, Mail, Volume2, Vibrate, Moon, Smartphone } from "lucide-react";
import type { NotificationSettings } from "@/types/phase4";

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5 rounded-full transition-colors ${value ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? "translate-x-5.5 left-0.5" : "left-0.5"}`}
        style={{ transform: value ? "translateX(20px)" : "translateX(0)" }}
      />
    </button>
  );
}

export default function NotificationSettingsPage() {
  const { notificationSettings, updateNotificationSetting } = usePhase4Store();
  const settings = notificationSettings;

  const pushSettings: { key: keyof NotificationSettings; label: string }[] = [
    { key: "push_messages", label: "Messages" },
    { key: "push_reactions", label: "Reactions" },
    { key: "push_comments", label: "Comments" },
    { key: "push_friend_requests", label: "Friend Requests" },
    { key: "push_group_activity", label: "Group Activity" },
    { key: "push_events", label: "Events" },
    { key: "push_marketplace", label: "Marketplace" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Notification Settings</h1>
            <p className="text-sm text-muted">Manage how you receive notifications</p>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="bg-card-bg border border-card-border rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Push Notifications</h2>
            </div>
            <Toggle
              value={settings.push_enabled}
              onChange={(v) => updateNotificationSetting("push_enabled", v)}
            />
          </div>
          {settings.push_enabled && (
            <div className="space-y-3 ml-6">
              {pushSettings.map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-muted">{label}</span>
                  <Toggle
                    value={settings[key] as boolean}
                    onChange={(v) => updateNotificationSetting(key, v)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Email Notifications */}
        <div className="bg-card-bg border border-card-border rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Email Notifications</h2>
            </div>
            <Toggle
              value={settings.email_enabled}
              onChange={(v) => updateNotificationSetting("email_enabled", v)}
            />
          </div>
          {settings.email_enabled && (
            <div className="space-y-3 ml-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Digest Frequency</span>
                <select
                  value={settings.email_digest}
                  onChange={(e) => updateNotificationSetting("email_digest", e.target.value)}
                  className="px-3 py-1.5 bg-hover-bg border border-card-border rounded-lg text-sm text-foreground"
                >
                  <option value="realtime">Real-time</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="never">Never</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Marketing Emails</span>
                <Toggle
                  value={settings.email_marketing}
                  onChange={(v) => updateNotificationSetting("email_marketing", v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Security Alerts</span>
                <Toggle
                  value={settings.email_security}
                  onChange={(v) => updateNotificationSetting("email_security", v)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Sound & Haptics */}
        <div className="bg-card-bg border border-card-border rounded-xl p-4 mb-4">
          <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-primary" />
            Sound & Haptics
          </h2>
          <div className="space-y-3 ml-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Notification Sound</span>
              <Toggle
                value={settings.sound_enabled}
                onChange={(v) => updateNotificationSetting("sound_enabled", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Vibration</span>
              <Toggle
                value={settings.vibration_enabled}
                onChange={(v) => updateNotificationSetting("vibration_enabled", v)}
              />
            </div>
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="bg-card-bg border border-card-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Quiet Hours</h2>
            </div>
            <Toggle
              value={settings.quiet_hours_enabled}
              onChange={(v) => updateNotificationSetting("quiet_hours_enabled", v)}
            />
          </div>
          {settings.quiet_hours_enabled && (
            <div className="flex items-center gap-4 ml-6">
              <div>
                <label className="text-xs text-muted">From</label>
                <input
                  type="time"
                  value={settings.quiet_hours_start}
                  onChange={(e) => updateNotificationSetting("quiet_hours_start", e.target.value)}
                  className="block mt-1 px-3 py-1.5 bg-hover-bg border border-card-border rounded-lg text-sm text-foreground"
                />
              </div>
              <div>
                <label className="text-xs text-muted">To</label>
                <input
                  type="time"
                  value={settings.quiet_hours_end}
                  onChange={(e) => updateNotificationSetting("quiet_hours_end", e.target.value)}
                  className="block mt-1 px-3 py-1.5 bg-hover-bg border border-card-border rounded-lg text-sm text-foreground"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
