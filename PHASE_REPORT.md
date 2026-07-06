# Phase 1 — Social Core: Report

## Overview

Phase 1 implements the complete social networking layer for GreenWave Hydroponic Smart Farming. Members can create posts with media, react to content, comment with nested replies, manage friendships, follow other users, and receive real-time notifications.

## Completed Features

### 1. Database Schema (`supabase/migrations/002_social_core.sql`)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `posts` | User-generated content | author_id, content, visibility (public/friends/only_me), reaction counts |
| `post_media` | Attached images/videos | post_id, media_type, url, dimensions, sort_order |
| `comments` | Nested discussions | post_id, author_id, parent_id (for nesting), content |
| `reactions` | 6-type emoji reactions | user_id, target_type, target_id, reaction_type (unique per user per target) |
| `shares` | Content sharing | post_id, user_id, comment |
| `friendships` | Bidirectional connections | requester_id, addressee_id, status (pending/accepted/blocked) |
| `follows` | Unidirectional subscriptions | follower_id, following_id |
| `notifications` | Activity alerts | user_id, type, actor_id, target_type, target_id, read |

All tables have:
- UUID primary keys
- Appropriate indexes for query performance
- Row Level Security (RLS) policies enforcing access control

### 2. Post Composer (`/src/components/social/PostComposer.tsx`)
- Text input with expandable textarea
- Up to 10 images (with client-side preview grid)
- Video attachment support (UI ready)
- Visibility selector: Public / Friends / Only Me
- Location check-in button (UI ready)
- Emoji button (UI ready)

### 3. News Feed (`/(social)/feed`)
- Cursor-based infinite scroll via IntersectionObserver
- Shows posts from: own + friends + followed users
- Optimistic reaction/comment updates via Zustand store
- Quick links bar (Feed, Friends, Farm, Market)
- 5 posts per page load with loading indicator

### 4. Post Card (Facebook-style layout)
- **Author header**: avatar, name, timestamp, visibility icon
- **Content**: Whitespace-preserving text render
- **Media grid**: 1-4 images with overflow indicator (+N)
- **Reaction bar**: Top 3 reaction emojis with total count
- **Action buttons**: Like (with hover picker for 6 reactions), Comment, Share
- **Comment thread**: Expandable nested one-level replies
- **Delete**: Author can delete own posts via menu

### 5. Profile Page (`/u/[username]`)
- **Cover photo** with gradient overlay
- **Avatar** with ring border
- **Bio, location, join date**
- **Friend/Follow buttons** with status-aware UI (Add Friend / Request Sent / Friends / Accept)
- **Message button** linking to messenger
- **Tabbed timeline**:
  - Timeline: Posts with composer (own profile)
  - About: Bio, location, join date, stats
  - Friends: Grid of friends with avatars
  - Photos: Grid of all media from posts
- **Privacy-aware**: Non-friends only see public posts

### 6. Friend System (`/(social)/friends`)
- **All Friends tab**: Searchable grid with unfriend option
- **Requests tab**: Accept/Decline UI for pending requests
- **Suggestions tab**: Users not yet connected, with Add Friend button
- Request/accept/decline/unfriend state management

### 7. Notifications
- **Bell dropdown** (`NotificationBell.tsx`):
  - Unread count badge
  - 8 most recent notifications
  - Icon per type (heart, comment, share, user, etc.)
  - Mark all read
  - Link to full page
- **Notifications page** (`/(social)/notifications`):
  - Grouped by Today / Earlier
  - Click to navigate to source (profile or feed)
  - Mark individual as read
  - Mark all read button

### 8. State Management (`/src/lib/social-store.ts`)
- Zustand store with actions:
  - `addPost` — optimistic post creation
  - `deletePost` — optimistic removal
  - `addComment` — increment comment count
  - `toggleReaction` — add/remove/switch reactions with summary update
  - `sharePost` — increment share count
  - `markNotificationRead` / `markAllNotificationsRead`

## RLS Policy Summary

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| posts | Public OR own OR friends (visibility-aware) | Own only | Own only | Own only |
| post_media | Where post is visible | Post author only | — | — |
| comments | Where post is visible | Authenticated (own) | Own only | Own only |
| reactions | Public | Own only | — | Own only |
| shares | Public | Own only | — | — |
| friendships | Involved party | Requester only | Involved party | — |
| follows | Public | Own only | — | Own only |
| notifications | Own only | System (any) | Own only | — |

## Seed Data

The seed script (`supabase/seed.ts`) creates:
- **5 demo users**: admin, mike_j, sarah_w, aung_k, thandar_w (all password: `demo123456`)
- **8 friendships** (6 accepted, 2 pending)
- **7 follows**
- **30 posts** with varying visibility (public/friends/only_me)
- **10 reactions** across posts
- **9 comments** with parent-child threading
- **5 notifications** for the admin user

## File Structure

```
src/
├── types/social.ts                          # TypeScript types
├── lib/
│   ├── social-mock-data.ts                  # Mock data (5 users, 30 posts)
│   └── social-store.ts                      # Zustand store
├── components/social/
│   ├── PostCard.tsx                          # Facebook-style post card
│   ├── PostComposer.tsx                     # Create post UI
│   └── NotificationBell.tsx                 # Bell dropdown
├── app/
│   ├── (social)/
│   │   ├── feed/page.tsx                    # News feed with infinite scroll
│   │   ├── friends/page.tsx                 # Friend management
│   │   └── notifications/page.tsx           # Full notifications page
│   └── u/[username]/page.tsx                # Profile with tabbed timeline
supabase/
├── migrations/002_social_core.sql           # Schema + RLS
└── seed.ts                                  # Seed script
```

## Tech Stack Alignment

- **Next.js 16 App Router** with `use()` for params
- **Tailwind CSS 4** with dark mode support
- **Zustand** for optimistic state management
- **Lucide React** for consistent iconography
- **TypeScript** with strict typing throughout
- **Mock data pattern** consistent with Phase 0

## Next Steps (Phase 2 candidates)

1. Real-time updates via Supabase Realtime subscriptions
2. Client-side image compression before upload (browser-image-compression)
3. @mention autocomplete in post composer
4. Post editing support
5. Report/block functionality
6. Search across posts and users

---

# Phase 4 — Admin Dashboard, Analytics & Notifications Pro: Report

## Overview

Phase 4 adds platform management capabilities: an admin dashboard with system stats, content moderation queue, analytics with daily metrics, notification preference management, and activity logging for audit trails.

## Completed Features

### 1. Database Schema (`supabase/migrations/005_phase4_admin_analytics.sql`)

| Table | Fields | Purpose |
|-------|--------|---------|
| reports | reporter_id, target_type, target_id, reason, description, status, resolved_by | Content moderation |
| activity_logs | user_id, action, target_type, target_id, metadata, ip_address | Audit trail |
| notification_settings | user_id, push_*, email_*, sound, vibration, quiet_hours | User preferences |
| analytics_daily | date, users, posts, comments, reactions, page_views, revenue | Daily aggregates |
| moderation_actions | moderator_id, target_type, action, reason, duration_hours | Mod action log |

### 2. Admin Dashboard (`/admin`)

- **Stats grid**: Total users, active today, total posts, pending reports, revenue, new this week
- **Quick actions**: Links to moderation queue, analytics, activity log
- **Recent reports**: Top 4 pending reports with reason badges
- **Moderation actions**: Recent mod actions with action-type badges (warn/hide/delete/ban/suspend)

### 3. Moderation Queue (`/admin/reports`)

- **Status filters**: All/Pending/Reviewing/Resolved/Dismissed with counts
- **Report cards**: Reporter info, target type, reason, description, timestamps
- **Actions**: Review/Resolve/Dismiss buttons for pending reports
- **Resolution notes**: Display for already-resolved reports

### 4. Analytics (`/admin/analytics`)

- **Metric cards**: Total users, new users (14d), page views, revenue with growth indicators
- **Bar chart**: Page views over 14 days with proportional bars
- **Daily breakdown table**: Date, new users, active, posts, views, revenue

### 5. Notification Settings (`/notification-settings`)

- **Push notifications**: Master toggle + per-category (messages, reactions, comments, friends, groups, events, marketplace)
- **Email notifications**: Master toggle, digest frequency (realtime/daily/weekly/never), marketing, security
- **Sound & haptics**: Sound toggle, vibration toggle
- **Quiet hours**: Enable/disable with start/end time pickers

### 6. Activity Log (`/activity`)

- **Timeline grouped by date**: Visual timeline with action-specific icons and colors
- **17 action types**: login, logout, post_create, comment, reaction, friend request/accept, group join/leave, event RSVP, listing create, purchase, offer, profile update, settings change, report
- **Metadata display**: Additional context (e.g., amount, setting changed, reaction type)

## File Structure

```
supabase/
  migrations/005_phase4_admin_analytics.sql
  seed_phase4.ts
src/
  types/phase4.ts
  lib/
    phase4-mock-data.ts
    phase4-store.ts
  app/
    admin/page.tsx
    admin/reports/page.tsx
    admin/analytics/page.tsx
    (social)/activity/page.tsx
    (social)/notification-settings/page.tsx
```

## Mock Data Summary

| Entity | Count | Notes |
|--------|-------|-------|
| Reports | 8 | 4 pending, 1 reviewing, 1 resolved, 1 dismissed |
| Activity Logs | 15 | 17 action types demonstrated |
| Notification Settings | 1 | Full preference object for current user |
| Analytics Daily | 14 | Last 14 days with randomized metrics |
| Moderation Actions | 5 | warn, hide, delete, suspend actions |

## Next Steps (Phase 5 candidates)

1. Real-time push notifications (FCM / service worker)
2. Email notification delivery (SendGrid / Resend)
3. Advanced analytics charts (Chart.js / Recharts)
4. User ban/suspend from admin panel (actual state change)
5. Export analytics data (CSV/PDF)
6. Content auto-moderation (AI-based spam detection)
7. Two-factor authentication setup
