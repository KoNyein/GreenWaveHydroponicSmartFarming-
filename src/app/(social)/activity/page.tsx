"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { mockActivityLogs } from "@/lib/phase4-mock-data";
import { socialUsers } from "@/lib/social-mock-data";
import {
  Activity, LogIn, LogOut, FileText, Heart, MessageCircle,
  UserPlus, UserCheck, Users, Calendar, ShoppingBag, DollarSign,
  Settings, Flag, Trash2
} from "lucide-react";
import type { ActivityAction } from "@/types/phase4";

const ACTION_CONFIG: Record<ActivityAction, { icon: typeof Activity; color: string; label: string }> = {
  login: { icon: LogIn, color: "text-green-500", label: "Logged in" },
  logout: { icon: LogOut, color: "text-gray-500", label: "Logged out" },
  post_create: { icon: FileText, color: "text-blue-500", label: "Created a post" },
  post_delete: { icon: Trash2, color: "text-red-500", label: "Deleted a post" },
  comment_create: { icon: MessageCircle, color: "text-purple-500", label: "Commented" },
  reaction_add: { icon: Heart, color: "text-pink-500", label: "Reacted" },
  friend_request: { icon: UserPlus, color: "text-blue-500", label: "Sent friend request" },
  friend_accept: { icon: UserCheck, color: "text-green-500", label: "Accepted friend request" },
  group_join: { icon: Users, color: "text-indigo-500", label: "Joined a group" },
  group_leave: { icon: Users, color: "text-orange-500", label: "Left a group" },
  event_rsvp: { icon: Calendar, color: "text-amber-500", label: "RSVP'd to event" },
  listing_create: { icon: ShoppingBag, color: "text-teal-500", label: "Created listing" },
  purchase: { icon: DollarSign, color: "text-green-600", label: "Made a purchase" },
  offer_create: { icon: DollarSign, color: "text-cyan-500", label: "Made an offer" },
  profile_update: { icon: Settings, color: "text-gray-500", label: "Updated profile" },
  settings_change: { icon: Settings, color: "text-gray-500", label: "Changed settings" },
  report_submit: { icon: Flag, color: "text-red-500", label: "Submitted report" },
};

export default function ActivityPage() {
  const activities = mockActivityLogs;

  // Group by date
  const grouped: Record<string, typeof activities> = {};
  activities.forEach((act) => {
    const dateKey = new Date(act.created_at).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(act);
  });

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Activity Log</h1>
            <p className="text-sm text-muted">Your recent activity</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-6">
          {Object.entries(grouped).map(([dateLabel, logs]) => (
            <div key={dateLabel}>
              <h3 className="text-xs font-semibold text-muted uppercase mb-3">{dateLabel}</h3>
              <div className="space-y-1">
                {logs.map((log) => {
                  const config = ACTION_CONFIG[log.action];
                  const Icon = config.icon;
                  const user = socialUsers.find((u) => u.id === log.user_id);
                  const time = new Date(log.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

                  return (
                    <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-hover-bg transition">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-card-bg border border-card-border`}>
                        <Icon className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-foreground">{user?.full_name || "You"}</span>
                          <span className="text-sm text-muted">{config.label}</span>
                        </div>
                        {log.metadata && Object.keys(log.metadata).length > 0 && (
                          <p className="text-xs text-muted mt-0.5">
                            {Object.entries(log.metadata).map(([k, v]) => `${k}: ${v}`).join(", ")}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-muted whitespace-nowrap">{time}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
