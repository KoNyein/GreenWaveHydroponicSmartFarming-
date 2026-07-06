// Phase 4: Admin Dashboard, Analytics & Notifications Pro Mock Data

import type {
  Report, ActivityLog, NotificationSettings,
  AnalyticsDaily, ModerationEntry, AdminStats, ReportStatus
} from "@/types/phase4";

// ============================================================
// REPORTS
// ============================================================
export const mockReports: Report[] = [
  {
    id: "report-001", reporter_id: "user-002", target_type: "post", target_id: "post-spam-001",
    reason: "spam", description: "This post is promoting fake products", status: "pending", created_at: "2025-07-10T08:30:00Z"
  },
  {
    id: "report-002", reporter_id: "user-003", target_type: "user", target_id: "user-bad-001",
    reason: "harassment", description: "Sending threatening DMs to multiple users", status: "reviewing", created_at: "2025-07-09T14:20:00Z"
  },
  {
    id: "report-003", reporter_id: "user-004", target_type: "comment", target_id: "comment-hate-001",
    reason: "hate_speech", status: "resolved", resolved_by: "user-001", resolved_at: "2025-07-08T16:00:00Z",
    resolution_note: "Comment removed and user warned", created_at: "2025-07-08T10:15:00Z"
  },
  {
    id: "report-004", reporter_id: "user-005", target_type: "listing", target_id: "listing-scam-001",
    reason: "scam", description: "Seller never ships items, multiple victims", status: "pending", created_at: "2025-07-10T12:45:00Z"
  },
  {
    id: "report-005", reporter_id: "user-002", target_type: "post", target_id: "post-misinfo-001",
    reason: "misinformation", description: "Dangerous growing advice that could harm plants", status: "dismissed",
    resolved_by: "user-001", resolved_at: "2025-07-07T09:00:00Z", resolution_note: "Content is opinion, not harmful",
    created_at: "2025-07-06T22:30:00Z"
  },
  {
    id: "report-006", reporter_id: "user-003", target_type: "group", target_id: "group-spam-001",
    reason: "spam", description: "Group is only posting referral links", status: "pending", created_at: "2025-07-11T06:00:00Z"
  },
  {
    id: "report-007", reporter_id: "user-004", target_type: "post", target_id: "post-violence-001",
    reason: "violence", status: "reviewing", created_at: "2025-07-10T20:10:00Z"
  },
  {
    id: "report-008", reporter_id: "user-005", target_type: "user", target_id: "user-bot-001",
    reason: "spam", description: "Automated bot sending mass friend requests", status: "pending", created_at: "2025-07-11T09:30:00Z"
  },
];

// ============================================================
// ACTIVITY LOGS
// ============================================================
export const mockActivityLogs: ActivityLog[] = [
  { id: "act-001", user_id: "user-001", action: "login", ip_address: "192.168.1.100", user_agent: "Chrome/125", created_at: "2025-07-11T08:00:00Z" },
  { id: "act-002", user_id: "user-001", action: "post_create", target_type: "post", target_id: "post-new-001", created_at: "2025-07-11T08:15:00Z" },
  { id: "act-003", user_id: "user-002", action: "login", ip_address: "10.0.0.55", user_agent: "Firefox/130", created_at: "2025-07-11T08:20:00Z" },
  { id: "act-004", user_id: "user-001", action: "reaction_add", target_type: "post", target_id: "post-005", metadata: { type: "love" }, created_at: "2025-07-11T08:25:00Z" },
  { id: "act-005", user_id: "user-003", action: "friend_request", target_type: "user", target_id: "user-005", created_at: "2025-07-11T08:30:00Z" },
  { id: "act-006", user_id: "user-001", action: "group_join", target_type: "group", target_id: "group-001", created_at: "2025-07-11T09:00:00Z" },
  { id: "act-007", user_id: "user-004", action: "listing_create", target_type: "listing", target_id: "listing-new-001", created_at: "2025-07-11T09:15:00Z" },
  { id: "act-008", user_id: "user-001", action: "event_rsvp", target_type: "event", target_id: "event-001", metadata: { status: "going" }, created_at: "2025-07-11T09:30:00Z" },
  { id: "act-009", user_id: "user-005", action: "comment_create", target_type: "comment", target_id: "comment-new-001", created_at: "2025-07-11T09:45:00Z" },
  { id: "act-010", user_id: "user-002", action: "offer_create", target_type: "offer", target_id: "offer-new-001", metadata: { amount: 45.00 }, created_at: "2025-07-11T10:00:00Z" },
  { id: "act-011", user_id: "user-001", action: "profile_update", metadata: { field: "bio" }, created_at: "2025-07-11T10:30:00Z" },
  { id: "act-012", user_id: "user-003", action: "report_submit", target_type: "post", target_id: "post-spam-002", created_at: "2025-07-11T11:00:00Z" },
  { id: "act-013", user_id: "user-001", action: "settings_change", metadata: { setting: "theme", value: "dark" }, created_at: "2025-07-11T11:30:00Z" },
  { id: "act-014", user_id: "user-004", action: "purchase", target_type: "listing", target_id: "listing-003", metadata: { amount: 150.00 }, created_at: "2025-07-11T12:00:00Z" },
  { id: "act-015", user_id: "user-001", action: "logout", created_at: "2025-07-11T18:00:00Z" },
];

// ============================================================
// NOTIFICATION SETTINGS (for current user)
// ============================================================
export const mockNotificationSettings: NotificationSettings = {
  id: "ns-001",
  user_id: "user-001",
  push_enabled: true,
  push_messages: true,
  push_reactions: true,
  push_comments: true,
  push_friend_requests: true,
  push_group_activity: false,
  push_events: true,
  push_marketplace: true,
  email_enabled: true,
  email_digest: "daily",
  email_marketing: false,
  email_security: true,
  sound_enabled: true,
  vibration_enabled: true,
  quiet_hours_enabled: true,
  quiet_hours_start: "22:00",
  quiet_hours_end: "07:00",
  updated_at: "2025-07-10T14:00:00Z",
};

// ============================================================
// ANALYTICS DAILY (last 14 days)
// ============================================================
export const mockAnalyticsDaily: AnalyticsDaily[] = Array.from({ length: 14 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (13 - i));
  const dayStr = date.toISOString().split("T")[0];
  const baseUsers = 1200 + i * 15;
  const growth = Math.floor(Math.random() * 10) + 5;
  return {
    id: `analytics-${i}`,
    date: dayStr,
    total_users: baseUsers,
    new_users: growth,
    active_users: Math.floor(baseUsers * (0.3 + Math.random() * 0.2)),
    total_posts: 3500 + i * 30,
    new_posts: Math.floor(Math.random() * 40) + 20,
    total_comments: 8900 + i * 50,
    total_reactions: 15000 + i * 100,
    avg_session_duration: Math.floor(Math.random() * 300) + 180,
    page_views: Math.floor(Math.random() * 5000) + 8000,
    listings_created: Math.floor(Math.random() * 8) + 2,
    transactions: Math.floor(Math.random() * 15) + 5,
    revenue: parseFloat((Math.random() * 500 + 200).toFixed(2)),
    groups_created: Math.floor(Math.random() * 3),
    events_created: Math.floor(Math.random() * 2),
    created_at: `${dayStr}T23:59:00Z`,
  };
});

// ============================================================
// MODERATION ACTIONS
// ============================================================
export const mockModerationActions: ModerationEntry[] = [
  { id: "mod-001", moderator_id: "user-001", target_type: "post", target_id: "post-spam-001", action: "hide", reason: "Spam content confirmed", report_id: "report-001", created_at: "2025-07-09T10:00:00Z" },
  { id: "mod-002", moderator_id: "user-001", target_type: "user", target_id: "user-bad-001", action: "warn", reason: "First offense - harassment", report_id: "report-002", created_at: "2025-07-09T15:00:00Z" },
  { id: "mod-003", moderator_id: "user-001", target_type: "comment", target_id: "comment-hate-001", action: "delete", reason: "Hate speech removed", report_id: "report-003", created_at: "2025-07-08T16:00:00Z" },
  { id: "mod-004", moderator_id: "user-001", target_type: "user", target_id: "user-bot-001", action: "suspend", reason: "Bot behavior", duration_hours: 168, created_at: "2025-07-10T09:00:00Z" },
  { id: "mod-005", moderator_id: "user-001", target_type: "listing", target_id: "listing-scam-001", action: "delete", reason: "Confirmed scam listing", report_id: "report-004", created_at: "2025-07-10T14:00:00Z" },
];

// ============================================================
// ADMIN STATS
// ============================================================
export const mockAdminStats: AdminStats = {
  totalUsers: 1410,
  activeToday: 523,
  totalPosts: 3890,
  pendingReports: 4,
  totalRevenue: 12580.50,
  newUsersThisWeek: 67,
};

// ============================================================
// HELPERS
// ============================================================
export function getReportsByStatus(status: ReportStatus): Report[] {
  return mockReports.filter((r) => r.status === status);
}

export function getUserActivityLogs(userId: string): ActivityLog[] {
  return mockActivityLogs.filter((a) => a.user_id === userId);
}

export function getPendingReportsCount(): number {
  return mockReports.filter((r) => r.status === "pending").length;
}
