-- Phase 1: Social Core Migration
-- Tables: posts, post_media, comments, reactions, shares, friendships, follows, notifications

-- ============================================================
-- POSTS
-- ============================================================
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL DEFAULT '',
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'friends', 'only_me')),
  likes_count INT NOT NULL DEFAULT 0,
  comments_count INT NOT NULL DEFAULT 0,
  shares_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_posts_visibility ON posts(visibility);

-- ============================================================
-- POST MEDIA
-- ============================================================
CREATE TABLE IF NOT EXISTS post_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  width INT,
  height INT,
  file_size BIGINT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_post_media_post ON post_media(post_id);

-- ============================================================
-- COMMENTS (nested via parent_id)
-- ============================================================
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);
CREATE INDEX idx_comments_author ON comments(author_id);

-- ============================================================
-- REACTIONS (6 types, unique per user per target)
-- ============================================================
CREATE TABLE IF NOT EXISTS reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment')),
  target_id UUID NOT NULL,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'love', 'haha', 'wow', 'sad', 'angry')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, target_type, target_id)
);

CREATE INDEX idx_reactions_target ON reactions(target_type, target_id);
CREATE INDEX idx_reactions_user ON reactions(user_id);

-- ============================================================
-- SHARES
-- ============================================================
CREATE TABLE IF NOT EXISTS shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_shares_post ON shares(post_id);
CREATE INDEX idx_shares_user ON shares(user_id);

-- ============================================================
-- FRIENDSHIPS (requester, addressee, status)
-- ============================================================
CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  addressee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (requester_id, addressee_id),
  CHECK (requester_id != addressee_id)
);

CREATE INDEX idx_friendships_requester ON friendships(requester_id);
CREATE INDEX idx_friendships_addressee ON friendships(addressee_id);
CREATE INDEX idx_friendships_status ON friendships(status);

-- ============================================================
-- FOLLOWS
-- ============================================================
CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (follower_id, following_id),
  CHECK (follower_id != following_id)
);

CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'friend_request', 'friend_accepted', 'post_like', 'post_comment',
    'comment_reply', 'post_share', 'follow', 'mention'
  )),
  actor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment', 'user')),
  target_id UUID NOT NULL,
  message TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, read, created_at DESC);
CREATE INDEX idx_notifications_actor ON notifications(actor_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Posts RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts: users can view public posts"
  ON posts FOR SELECT
  USING (
    visibility = 'public'
    OR author_id = auth.uid()
    OR (
      visibility = 'friends'
      AND EXISTS (
        SELECT 1 FROM friendships
        WHERE status = 'accepted'
        AND (
          (requester_id = auth.uid() AND addressee_id = posts.author_id)
          OR (addressee_id = auth.uid() AND requester_id = posts.author_id)
        )
      )
    )
  );

CREATE POLICY "Posts: users can create own posts"
  ON posts FOR INSERT
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Posts: users can update own posts"
  ON posts FOR UPDATE
  USING (author_id = auth.uid());

CREATE POLICY "Posts: users can delete own posts"
  ON posts FOR DELETE
  USING (author_id = auth.uid());

-- Post Media RLS
ALTER TABLE post_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Post media: visible where post is visible"
  ON post_media FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM posts WHERE posts.id = post_media.post_id)
  );

CREATE POLICY "Post media: authors can insert"
  ON post_media FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM posts WHERE posts.id = post_media.post_id AND posts.author_id = auth.uid())
  );

-- Comments RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments: visible where post is visible"
  ON comments FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM posts WHERE posts.id = comments.post_id)
  );

CREATE POLICY "Comments: authenticated users can create"
  ON comments FOR INSERT
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Comments: authors can update own"
  ON comments FOR UPDATE
  USING (author_id = auth.uid());

CREATE POLICY "Comments: authors can delete own"
  ON comments FOR DELETE
  USING (author_id = auth.uid());

-- Reactions RLS
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reactions: visible where target is visible"
  ON reactions FOR SELECT
  USING (true);

CREATE POLICY "Reactions: users manage own"
  ON reactions FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Reactions: users delete own"
  ON reactions FOR DELETE
  USING (user_id = auth.uid());

-- Shares RLS
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Shares: publicly visible"
  ON shares FOR SELECT USING (true);

CREATE POLICY "Shares: users create own"
  ON shares FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Friendships RLS
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Friendships: users see their own"
  ON friendships FOR SELECT
  USING (requester_id = auth.uid() OR addressee_id = auth.uid());

CREATE POLICY "Friendships: users create requests"
  ON friendships FOR INSERT
  WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Friendships: users update their own"
  ON friendships FOR UPDATE
  USING (requester_id = auth.uid() OR addressee_id = auth.uid());

-- Follows RLS
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Follows: publicly visible"
  ON follows FOR SELECT USING (true);

CREATE POLICY "Follows: users manage own"
  ON follows FOR INSERT
  WITH CHECK (follower_id = auth.uid());

CREATE POLICY "Follows: users remove own"
  ON follows FOR DELETE
  USING (follower_id = auth.uid());

-- Notifications RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Notifications: users see own"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Notifications: system creates"
  ON notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Notifications: users update own (mark read)"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- ============================================================
-- STORAGE BUCKET for post media
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('post-media', 'post-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Post media: authenticated upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'post-media' AND auth.role() = 'authenticated');

CREATE POLICY "Post media: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'post-media');
