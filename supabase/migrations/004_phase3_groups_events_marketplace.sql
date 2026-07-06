-- Phase 3: Groups, Events & Marketplace Pro Migration
-- Tables: groups, group_members, events, event_rsvps, reviews, offers, polls, poll_options, poll_votes, hashtags, post_hashtags

-- ============================================================
-- GROUPS / COMMUNITIES
-- ============================================================
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  avatar_url TEXT,
  cover_url TEXT,
  privacy TEXT NOT NULL DEFAULT 'public' CHECK (privacy IN ('public', 'private', 'secret')),
  category TEXT NOT NULL DEFAULT 'general',
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  member_count INTEGER NOT NULL DEFAULT 1,
  post_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_groups_slug ON groups(slug);
CREATE INDEX idx_groups_category ON groups(category);

-- ============================================================
-- GROUP MEMBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'banned')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (group_id, user_id)
);

CREATE INDEX idx_group_members_group ON group_members(group_id);
CREATE INDEX idx_group_members_user ON group_members(user_id);

-- ============================================================
-- EVENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  location TEXT,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  event_type TEXT NOT NULL DEFAULT 'meetup' CHECK (event_type IN ('meetup', 'workshop', 'tour', 'harvest', 'online', 'other')),
  max_attendees INTEGER,
  is_free BOOLEAN NOT NULL DEFAULT true,
  price DECIMAL(10, 2),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
  attendee_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_events_date ON events(start_date);
CREATE INDEX idx_events_creator ON events(created_by);
CREATE INDEX idx_events_group ON events(group_id);

-- ============================================================
-- EVENT RSVPS
-- ============================================================
CREATE TABLE IF NOT EXISTS event_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'going' CHECK (status IN ('going', 'interested', 'not_going')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);

CREATE INDEX idx_event_rsvps_event ON event_rsvps(event_id);

-- ============================================================
-- REVIEWS (Marketplace)
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reviews_seller ON reviews(seller_id);
CREATE INDEX idx_reviews_listing ON reviews(listing_id);

-- ============================================================
-- OFFERS (Marketplace negotiation)
-- ============================================================
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id TEXT NOT NULL,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'countered', 'expired')),
  counter_amount DECIMAL(10, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_offers_listing ON offers(listing_id);
CREATE INDEX idx_offers_buyer ON offers(buyer_id);
CREATE INDEX idx_offers_seller ON offers(seller_id);

-- ============================================================
-- POLLS
-- ============================================================
CREATE TABLE IF NOT EXISTS polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  allows_multiple BOOLEAN NOT NULL DEFAULT false,
  ends_at TIMESTAMPTZ,
  total_votes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_polls_post ON polls(post_id);

-- ============================================================
-- POLL OPTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  vote_count INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_poll_options_poll ON poll_options(poll_id);

-- ============================================================
-- POLL VOTES
-- ============================================================
CREATE TABLE IF NOT EXISTS poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (poll_id, user_id, option_id)
);

CREATE INDEX idx_poll_votes_poll ON poll_votes(poll_id);

-- ============================================================
-- HASHTAGS
-- ============================================================
CREATE TABLE IF NOT EXISTS hashtags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  post_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_hashtags_name ON hashtags(name);
CREATE INDEX idx_hashtags_count ON hashtags(post_count DESC);

-- ============================================================
-- POST HASHTAGS (junction)
-- ============================================================
CREATE TABLE IF NOT EXISTS post_hashtags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  hashtag_id UUID NOT NULL REFERENCES hashtags(id) ON DELETE CASCADE,
  UNIQUE (post_id, hashtag_id)
);

CREATE INDEX idx_post_hashtags_post ON post_hashtags(post_id);
CREATE INDEX idx_post_hashtags_tag ON post_hashtags(hashtag_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Groups RLS
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Groups: public visible to all, private/secret to members"
  ON groups FOR SELECT
  USING (
    privacy = 'public'
    OR EXISTS (SELECT 1 FROM group_members WHERE group_members.group_id = groups.id AND group_members.user_id = auth.uid() AND group_members.status = 'active')
  );

CREATE POLICY "Groups: authenticated can create"
  ON groups FOR INSERT
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Groups: admins can update"
  ON groups FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM group_members WHERE group_members.group_id = groups.id AND group_members.user_id = auth.uid() AND group_members.role = 'admin')
  );

-- Group Members RLS
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group members: visible to group participants"
  ON group_members FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM group_members gm WHERE gm.group_id = group_members.group_id AND gm.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM groups g WHERE g.id = group_members.group_id AND g.privacy = 'public')
  );

CREATE POLICY "Group members: join public groups or invite"
  ON group_members FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM group_members gm WHERE gm.group_id = group_members.group_id AND gm.user_id = auth.uid() AND gm.role IN ('admin', 'moderator'))
  );

CREATE POLICY "Group members: admins manage"
  ON group_members FOR UPDATE
  USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM group_members gm WHERE gm.group_id = group_members.group_id AND gm.user_id = auth.uid() AND gm.role = 'admin')
  );

-- Events RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events: visible to all"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Events: authenticated can create"
  ON events FOR INSERT
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Events: creator can update"
  ON events FOR UPDATE
  USING (created_by = auth.uid());

CREATE POLICY "Events: creator can delete"
  ON events FOR DELETE
  USING (created_by = auth.uid());

-- Event RSVPs RLS
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "RSVPs: visible to all"
  ON event_rsvps FOR SELECT
  USING (true);

CREATE POLICY "RSVPs: users manage own"
  ON event_rsvps FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "RSVPs: users update own"
  ON event_rsvps FOR UPDATE
  USING (user_id = auth.uid());

-- Reviews RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews: visible to all"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Reviews: buyers create"
  ON reviews FOR INSERT
  WITH CHECK (reviewer_id = auth.uid());

-- Offers RLS
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Offers: visible to buyer and seller"
  ON offers FOR SELECT
  USING (buyer_id = auth.uid() OR seller_id = auth.uid());

CREATE POLICY "Offers: buyers create"
  ON offers FOR INSERT
  WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Offers: participants update"
  ON offers FOR UPDATE
  USING (buyer_id = auth.uid() OR seller_id = auth.uid());

-- Polls RLS
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Polls: visible where post visible"
  ON polls FOR SELECT
  USING (true);

CREATE POLICY "Polls: post author creates"
  ON polls FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM posts WHERE posts.id = polls.post_id AND posts.author_id = auth.uid())
  );

-- Poll Options RLS
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Poll options: visible to all"
  ON poll_options FOR SELECT
  USING (true);

CREATE POLICY "Poll options: poll creator manages"
  ON poll_options FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM polls p JOIN posts po ON po.id = p.post_id
      WHERE p.id = poll_options.poll_id AND po.author_id = auth.uid()
    )
  );

-- Poll Votes RLS
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Poll votes: visible to all"
  ON poll_votes FOR SELECT
  USING (true);

CREATE POLICY "Poll votes: users vote"
  ON poll_votes FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Poll votes: users remove own"
  ON poll_votes FOR DELETE
  USING (user_id = auth.uid());

-- Hashtags RLS
ALTER TABLE hashtags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hashtags: visible to all"
  ON hashtags FOR SELECT
  USING (true);

CREATE POLICY "Hashtags: system creates"
  ON hashtags FOR INSERT
  WITH CHECK (true);

-- Post Hashtags RLS
ALTER TABLE post_hashtags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Post hashtags: visible to all"
  ON post_hashtags FOR SELECT
  USING (true);

CREATE POLICY "Post hashtags: post author manages"
  ON post_hashtags FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM posts WHERE posts.id = post_hashtags.post_id AND posts.author_id = auth.uid())
  );
