-- Phase 4: Admin Dashboard, Analytics & Notifications Pro
-- Migration: 005_phase4_admin_analytics.sql

-- ============================================================
-- REPORTS / FLAGS
-- ============================================================
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES auth.users(id),
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment', 'user', 'group', 'listing')),
  target_id UUID NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('spam', 'harassment', 'hate_speech', 'violence', 'nudity', 'misinformation', 'scam', 'other')),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed')),
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  resolution_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_target ON reports(target_type, target_id);
CREATE INDEX idx_reports_reporter ON reports(reporter_id);

-- ============================================================
-- ACTIVITY LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL CHECK (action IN (
    'login', 'logout', 'post_create', 'post_delete', 'comment_create',
    'reaction_add', 'friend_request', 'friend_accept', 'group_join',
    'group_leave', 'event_rsvp', 'listing_create', 'purchase', 'offer_create',
    'profile_update', 'settings_change', 'report_submit'
  )),
  target_type TEXT,
  target_id UUID,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_user ON activity_logs(user_id, created_at DESC);
CREATE INDEX idx_activity_action ON activity_logs(action);

-- ============================================================
-- NOTIFICATION SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) UNIQUE,
  -- Push notifications
  push_enabled BOOLEAN NOT NULL DEFAULT true,
  push_messages BOOLEAN NOT NULL DEFAULT true,
  push_reactions BOOLEAN NOT NULL DEFAULT true,
  push_comments BOOLEAN NOT NULL DEFAULT true,
  push_friend_requests BOOLEAN NOT NULL DEFAULT true,
  push_group_activity BOOLEAN NOT NULL DEFAULT true,
  push_events BOOLEAN NOT NULL DEFAULT true,
  push_marketplace BOOLEAN NOT NULL DEFAULT true,
  -- Email notifications
  email_enabled BOOLEAN NOT NULL DEFAULT true,
  email_digest TEXT NOT NULL DEFAULT 'daily' CHECK (email_digest IN ('realtime', 'daily', 'weekly', 'never')),
  email_marketing BOOLEAN NOT NULL DEFAULT false,
  email_security BOOLEAN NOT NULL DEFAULT true,
  -- In-app
  sound_enabled BOOLEAN NOT NULL DEFAULT true,
  vibration_enabled BOOLEAN NOT NULL DEFAULT true,
  -- Quiet hours
  quiet_hours_enabled BOOLEAN NOT NULL DEFAULT false,
  quiet_hours_start TIME DEFAULT '22:00',
  quiet_hours_end TIME DEFAULT '07:00',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- ANALYTICS SNAPSHOTS (daily aggregates)
-- ============================================================
CREATE TABLE IF NOT EXISTS analytics_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  -- User metrics
  total_users INTEGER NOT NULL DEFAULT 0,
  new_users INTEGER NOT NULL DEFAULT 0,
  active_users INTEGER NOT NULL DEFAULT 0,
  -- Content metrics
  total_posts INTEGER NOT NULL DEFAULT 0,
  new_posts INTEGER NOT NULL DEFAULT 0,
  total_comments INTEGER NOT NULL DEFAULT 0,
  total_reactions INTEGER NOT NULL DEFAULT 0,
  -- Engagement
  avg_session_duration INTEGER DEFAULT 0, -- seconds
  page_views INTEGER NOT NULL DEFAULT 0,
  -- Commerce
  listings_created INTEGER NOT NULL DEFAULT 0,
  transactions INTEGER NOT NULL DEFAULT 0,
  revenue DECIMAL(12,2) DEFAULT 0,
  -- Groups & Events
  groups_created INTEGER NOT NULL DEFAULT 0,
  events_created INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_analytics_date ON analytics_daily(date DESC);

-- ============================================================
-- CONTENT MODERATION ACTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS moderation_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  moderator_id UUID NOT NULL REFERENCES auth.users(id),
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment', 'user', 'group', 'listing')),
  target_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('warn', 'hide', 'delete', 'ban', 'unban', 'suspend', 'restore')),
  reason TEXT,
  duration_hours INTEGER, -- for suspensions
  report_id UUID REFERENCES reports(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_moderation_target ON moderation_actions(target_type, target_id);
CREATE INDEX idx_moderation_moderator ON moderation_actions(moderator_id);

-- ============================================================
-- ROW-LEVEL SECURITY
-- ============================================================

-- Reports
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reports" ON reports
  FOR SELECT USING (reporter_id = auth.uid());

CREATE POLICY "Admins can view all reports" ON reports
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can create reports" ON reports
  FOR INSERT WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Admins can update reports" ON reports
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Activity Logs
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity" ON activity_logs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all activity" ON activity_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "System inserts activity" ON activity_logs
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Notification Settings
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own settings" ON notification_settings
  FOR ALL USING (user_id = auth.uid());

-- Analytics Daily
ALTER TABLE analytics_daily ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view analytics" ON analytics_daily
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Moderation Actions
ALTER TABLE moderation_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage moderation" ON moderation_actions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
  );
