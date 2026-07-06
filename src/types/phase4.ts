// Phase 4: Admin Dashboard, Analytics & Notifications Pro Types

export type ReportTargetType = "post" | "comment" | "user" | "group" | "listing";
export type ReportReason = "spam" | "harassment" | "hate_speech" | "violence" | "nudity" | "misinformation" | "scam" | "other";
export type ReportStatus = "pending" | "reviewing" | "resolved" | "dismissed";

export interface Report {
  id: string;
  reporter_id: string;
  target_type: ReportTargetType;
  target_id: string;
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  resolved_by?: string;
  resolved_at?: string;
  resolution_note?: string;
  created_at: string;
}

export type ActivityAction =
  | "login" | "logout" | "post_create" | "post_delete" | "comment_create"
  | "reaction_add" | "friend_request" | "friend_accept" | "group_join"
  | "group_leave" | "event_rsvp" | "listing_create" | "purchase" | "offer_create"
  | "profile_update" | "settings_change" | "report_submit";

export interface ActivityLog {
  id: string;
  user_id: string;
  action: ActivityAction;
  target_type?: string;
  target_id?: string;
  metadata?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export type EmailDigest = "realtime" | "daily" | "weekly" | "never";

export interface NotificationSettings {
  id: string;
  user_id: string;
  push_enabled: boolean;
  push_messages: boolean;
  push_reactions: boolean;
  push_comments: boolean;
  push_friend_requests: boolean;
  push_group_activity: boolean;
  push_events: boolean;
  push_marketplace: boolean;
  email_enabled: boolean;
  email_digest: EmailDigest;
  email_marketing: boolean;
  email_security: boolean;
  sound_enabled: boolean;
  vibration_enabled: boolean;
  quiet_hours_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  updated_at: string;
}

export interface AnalyticsDaily {
  id: string;
  date: string;
  total_users: number;
  new_users: number;
  active_users: number;
  total_posts: number;
  new_posts: number;
  total_comments: number;
  total_reactions: number;
  avg_session_duration: number;
  page_views: number;
  listings_created: number;
  transactions: number;
  revenue: number;
  groups_created: number;
  events_created: number;
  created_at: string;
}

export type ModerationAction = "warn" | "hide" | "delete" | "ban" | "unban" | "suspend" | "restore";

export interface ModerationEntry {
  id: string;
  moderator_id: string;
  target_type: ReportTargetType;
  target_id: string;
  action: ModerationAction;
  reason?: string;
  duration_hours?: number;
  report_id?: string;
  created_at: string;
}

export interface AdminStats {
  totalUsers: number;
  activeToday: number;
  totalPosts: number;
  pendingReports: number;
  totalRevenue: number;
  newUsersThisWeek: number;
}
