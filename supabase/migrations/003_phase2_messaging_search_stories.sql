-- Phase 2: Messaging, Search & Stories Migration
-- Tables: group_chats, chat_members, messages, message_reactions, stories, bookmarks

-- ============================================================
-- GROUP CHATS
-- ============================================================
CREATE TABLE IF NOT EXISTS group_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_group BOOLEAN NOT NULL DEFAULT true,
  last_message_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_group_chats_last_msg ON group_chats(last_message_at DESC);

-- ============================================================
-- CHAT MEMBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES group_chats(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  is_online BOOLEAN NOT NULL DEFAULT false,
  is_typing BOOLEAN NOT NULL DEFAULT false,
  last_read_at TIMESTAMPTZ DEFAULT now(),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (chat_id, user_id)
);

CREATE INDEX idx_chat_members_chat ON chat_members(chat_id);
CREATE INDEX idx_chat_members_user ON chat_members(user_id);

-- ============================================================
-- MESSAGES (enhanced)
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES group_chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL DEFAULT '',
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'audio', 'video', 'location', 'file', 'system')),
  media_url TEXT,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  location_name TEXT,
  reply_to_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  is_edited BOOLEAN NOT NULL DEFAULT false,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  read_by UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_chat ON messages(chat_id, created_at DESC);
CREATE INDEX idx_messages_sender ON messages(sender_id);

-- ============================================================
-- MESSAGE REACTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS message_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (message_id, user_id, emoji)
);

CREATE INDEX idx_message_reactions_msg ON message_reactions(message_id);

-- ============================================================
-- STORIES (24-hour ephemeral)
-- ============================================================
CREATE TABLE IF NOT EXISTS stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT DEFAULT '',
  media_url TEXT,
  media_type TEXT CHECK (media_type IN ('image', 'video', 'text')),
  background_color TEXT DEFAULT '#16a34a',
  font_style TEXT DEFAULT 'normal',
  viewers UUID[] DEFAULT '{}',
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '24 hours'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_stories_author ON stories(author_id);
CREATE INDEX idx_stories_expires ON stories(expires_at);

-- ============================================================
-- BOOKMARKS
-- ============================================================
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, post_id)
);

CREATE INDEX idx_bookmarks_user ON bookmarks(user_id, created_at DESC);
CREATE INDEX idx_bookmarks_post ON bookmarks(post_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Group Chats RLS
ALTER TABLE group_chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Chats: members can view"
  ON group_chats FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM chat_members WHERE chat_members.chat_id = group_chats.id AND chat_members.user_id = auth.uid())
  );

CREATE POLICY "Chats: authenticated users can create"
  ON group_chats FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- Chat Members RLS
ALTER TABLE chat_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Chat members: visible to chat participants"
  ON chat_members FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM chat_members cm WHERE cm.chat_id = chat_members.chat_id AND cm.user_id = auth.uid())
  );

CREATE POLICY "Chat members: chat admins can add"
  ON chat_members FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM chat_members cm WHERE cm.chat_id = chat_members.chat_id AND cm.user_id = auth.uid() AND cm.role = 'admin')
    OR chat_members.user_id = auth.uid()
  );

CREATE POLICY "Chat members: users update own status"
  ON chat_members FOR UPDATE
  USING (user_id = auth.uid());

-- Messages RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Messages: visible to chat members"
  ON messages FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM chat_members WHERE chat_members.chat_id = messages.chat_id AND chat_members.user_id = auth.uid())
  );

CREATE POLICY "Messages: members can send"
  ON messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (SELECT 1 FROM chat_members WHERE chat_members.chat_id = messages.chat_id AND chat_members.user_id = auth.uid())
  );

CREATE POLICY "Messages: sender can update own"
  ON messages FOR UPDATE
  USING (sender_id = auth.uid());

-- Message Reactions RLS
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Message reactions: visible to chat members"
  ON message_reactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM messages m
      JOIN chat_members cm ON cm.chat_id = m.chat_id
      WHERE m.id = message_reactions.message_id AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Message reactions: users manage own"
  ON message_reactions FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Message reactions: users remove own"
  ON message_reactions FOR DELETE
  USING (user_id = auth.uid());

-- Stories RLS
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stories: visible to friends and own"
  ON stories FOR SELECT
  USING (
    author_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM friendships
      WHERE status = 'accepted'
      AND (
        (requester_id = auth.uid() AND addressee_id = stories.author_id)
        OR (addressee_id = auth.uid() AND requester_id = stories.author_id)
      )
    )
  );

CREATE POLICY "Stories: users create own"
  ON stories FOR INSERT
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Stories: users update own"
  ON stories FOR UPDATE
  USING (author_id = auth.uid());

CREATE POLICY "Stories: users delete own"
  ON stories FOR DELETE
  USING (author_id = auth.uid());

-- Bookmarks RLS
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bookmarks: users see own"
  ON bookmarks FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Bookmarks: users create own"
  ON bookmarks FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Bookmarks: users delete own"
  ON bookmarks FOR DELETE
  USING (user_id = auth.uid());
