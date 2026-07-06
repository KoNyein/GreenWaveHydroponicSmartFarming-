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

---

# Phase 2 — Messaging, Search & Stories: Report

## Overview

Phase 2 enhances GreenWave with a full-featured messaging system (group chats, reactions, read receipts, typing indicators), ephemeral Stories, global search, bookmarks/saved posts, and trending content discovery.

## Completed Features

### 1. Database Schema (`supabase/migrations/003_phase2_messaging_search_stories.sql`)

| Table | Fields | Purpose |
|-------|--------|---------|
| group_chats | id, name, avatar_url, created_by, is_group, last_message_at | DM and group conversations |
| chat_members | chat_id, user_id, role, is_online, is_typing, last_read_at | Membership + presence |
| messages | chat_id, sender_id, content, message_type, media_url, location, reply_to_id, read_by | Chat messages (text, image, audio, video, location, file) |
| message_reactions | message_id, user_id, emoji | Emoji reactions on messages |
| stories | author_id, content, media_url, media_type, background_color, viewers, expires_at | 24-hour ephemeral content |
| bookmarks | user_id, post_id | Saved/bookmarked posts |

### 2. RLS Policies

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| group_chats | Members only | Creator | - | - |
| chat_members | Chat participants | Admins or self | Own status only | - |
| messages | Chat members | Sender + member | Sender only | - |
| message_reactions | Chat members | Own only | - | Own only |
| stories | Friends + own | Own only | Own only | Own only |
| bookmarks | Own only | Own only | - | Own only |

### 3. Enhanced Messenger (`/messenger`)

- **Group chats**: Create and manage multi-user conversations
- **Message types**: Text, image, audio, video, location, file, system
- **Reactions**: Emoji reactions on individual messages (6 quick-access emojis)
- **Read receipts**: Double-check icon (blue) for read, single check for delivered
- **Typing indicator**: Animated dots with user name
- **Online status**: Green dot on avatar, status text in header
- **Reply-to**: Quote and reply to specific messages
- **Message deletion**: Soft delete with "This message was deleted" placeholder

### 4. Stories (`StoriesBar` component in Feed)

- **Create story**: Text or image with customizable background colors (8 options)
- **Story viewer**: Full-screen modal with progress bars, navigation (prev/next)
- **Story groups**: Grouped by author, unseen indicator (green ring)
- **24-hour expiry**: Stories auto-expire (tracked via `expires_at`)
- **View counter**: Author can see viewer count
- **Navigation**: Auto-advance between story groups

### 5. Global Search (`/search`)

- **Multi-tab results**: All, People, Posts
- **Live filtering**: Real-time search as you type
- **Recent searches**: Persistent search history with clear option
- **Trending topics**: Quick-access hashtag buttons
- **People suggestions**: "People You May Know" grid
- **Rich results**: User cards with bio/location, post cards with full interaction

### 6. Bookmarks / Saved Posts (`/bookmarks`)

- **Save/unsave toggle**: Bookmark icon on every PostCard
- **Bookmarks page**: Full list with search, remove individual bookmarks
- **Zustand persistence**: Optimistic state management
- **Integration**: Bookmark button appears on every post in feed, search, trending

### 7. Trending Posts (`/trending`)

- **Engagement scoring**: reactions * 1 + comments * 3 + shares * 5
- **Recency multiplier**: 2x for <24h, 1.5x for <72h, 1x otherwise
- **Sort modes**: Trending (score-based), Newest, Top (raw engagement)
- **Rank badges**: Gold/silver/bronze for top 3 posts
- **Sidebar**: Trending topics with growth %, top contributors leaderboard

## File Structure

```
supabase/
  migrations/003_phase2_messaging_search_stories.sql
  seed_phase2.ts
src/
  types/messaging.ts
  lib/
    messaging-mock-data.ts
    messaging-store.ts
  components/social/
    StoriesBar.tsx
  app/
    messenger/page.tsx (rewritten)
    (social)/
      search/page.tsx
      bookmarks/page.tsx
      trending/page.tsx
```

## Mock Data Summary

| Entity | Count | Notes |
|--------|-------|-------|
| Group chats | 6 | 3 DMs + 3 groups |
| Chat members | 17 | Across all chats |
| Messages | 18 | Mixed types (text, image, location, file) |
| Stories | 7 | From all 5 users |
| Bookmarks | 5 | Admin's saved posts |

## Tech Stack Alignment

- **Next.js App Router**: New routes under `(social)` grouped layout
- **Tailwind CSS 4**: Dark mode support via custom variant
- **Zustand**: `useMessagingStore` for messages, stories, bookmarks
- **Lucide React**: Consistent icon library
- **TypeScript**: Strict types in `types/messaging.ts`
- **Mock data pattern**: Consistent with Phase 0/1 approach

## Navigation Updates

Sidebar updated with 3 new items:
- Search (`/search`)
- Trending (`/trending`)
- Saved (`/bookmarks`)

## Next Steps (Phase 3 candidates)

1. Video/voice calling (WebRTC)
2. Group chat admin panel (add/remove members, change roles)
3. Story highlights (pin past stories to profile)
4. Advanced search filters (date range, user, media type)
5. Push notifications (service worker + FCM)
6. Real-time messaging via Supabase Realtime subscriptions
7. Message forwarding and pinned messages

---

# Phase 3 — Groups, Events & Marketplace Pro: Report

## Overview

Phase 3 adds community features (Groups, Events), marketplace enhancements (Reviews, Offers), interactive Polls, and Hashtag navigation to create a comprehensive social platform for hydroponic farming.

## Completed Features

### 1. Database Schema (`supabase/migrations/004_phase3_groups_events_marketplace.sql`)

| Table | Fields | Purpose |
|-------|--------|---------|
| groups | id, name, slug, description, avatar_url, cover_url, privacy, category, created_by, member_count, post_count | Community groups |
| group_members | group_id, user_id, role, status, joined_at | Group membership |
| events | id, title, description, cover_url, location, start_date, end_date, event_type, max_attendees, price, created_by, attendee_count | Community events |
| event_rsvps | event_id, user_id, status | RSVP tracking |
| reviews | reviewer_id, seller_id, listing_id, rating, content | Marketplace reviews |
| offers | listing_id, buyer_id, seller_id, amount, message, status, counter_amount | Marketplace negotiation |
| polls | post_id, question, allows_multiple, ends_at, total_votes | Post polls |
| poll_options | poll_id, text, vote_count, sort_order | Poll answer options |
| poll_votes | poll_id, option_id, user_id | Vote tracking |
| hashtags | name, post_count | Hashtag registry |
| post_hashtags | post_id, hashtag_id | Post-hashtag junction |

### 2. RLS Policies

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| groups | Public: all; Private/Secret: members | Authenticated | Admins | - |
| group_members | Group participants or public groups | Self or admin/mod | Self or admin | - |
| events | All | Authenticated | Creator | Creator |
| event_rsvps | All | Own | Own | - |
| reviews | All | Reviewer | - | - |
| offers | Buyer + Seller | Buyer | Buyer + Seller | - |
| polls | All | Post author | - | - |
| poll_votes | All | Own | - | Own |
| hashtags | All | System | - | - |

### 3. Groups/Communities (`/groups`, `/groups/[slug]`)

- **Group listing**: Grid view with search + category filter
- **Create group modal**: Name, description, privacy, category
- **Group detail**: Cover photo, member list with roles (Crown/Shield icons), post area
- **Join/Leave**: Toggle membership with optimistic count updates
- **6 categories**: Education, Equipment, Science, Marketplace, Regional, Nutrients
- **Privacy levels**: Public (visible to all), Private (members only), Secret (invite only)

### 4. Events (`/events`)

- **Event listing**: Cards with cover images, type badges, location, time
- **Create event modal**: Title, description, dates, location, type, max attendees
- **RSVP system**: Going/Interested buttons with state persistence
- **Event types**: Meetup, Workshop, Farm Tour, Harvest, Online, Other
- **Filter tabs**: Upcoming, Going, All
- **Pricing**: Free/paid events with price display

### 5. Marketplace Pro (Components)

- **SellerReviews**: Star ratings (1-5), reviewer avatar + text, average rating calc
- **OfferCard**: Offer amount, status badges, counter-offer display, accept/decline/counter buttons
- **Offer statuses**: Pending, Accepted, Declined, Countered, Expired

### 6. Polls (`PollCard` component)

- **Embedded in posts**: Any post can have an attached poll
- **Vote interaction**: Click to vote, toggle selection
- **Progress bars**: Visual percentage after voting
- **Multi-select**: Optional multiple choice support
- **Expiration**: End date with expired state handling
- **Results display**: Vote counts and percentages

### 7. Hashtag Pages (`/hashtag/[tag]`)

- **Topic feed**: Posts containing the hashtag
- **Related tags sidebar**: Discover similar topics
- **Post count**: Number of posts per hashtag
- **10 seeded hashtags**: hydroponics, LED_grow, organic, harvest2025, nutrients, pH_balance, DWC, seedlings, genetics, terpenes

## File Structure

```
supabase/
  migrations/004_phase3_groups_events_marketplace.sql
  seed_phase3.ts
src/
  types/phase3.ts
  lib/
    phase3-mock-data.ts
    phase3-store.ts
  components/
    social/PollCard.tsx
    marketplace/SellerReviews.tsx
    marketplace/OfferCard.tsx
  app/(social)/
    groups/page.tsx
    groups/[slug]/page.tsx
    events/page.tsx
    hashtag/[tag]/page.tsx
```

## Mock Data Summary

| Entity | Count | Notes |
|--------|-------|-------|
| Groups | 6 | 4 public, 1 private, across 6 categories |
| Group members | 19 | Mixed admin/mod/member roles |
| Events | 5 | Tour, workshop, harvest, meetup, online |
| Event RSVPs | 10 | Going + interested |
| Reviews | 5 | 3-5 star ratings with text |
| Offers | 3 | Pending, accepted, countered |
| Polls | 3 | Single + multiple choice, with/without expiry |
| Hashtags | 10 | Top farming topics |

## Navigation Updates

Sidebar updated with 2 new items:
- Groups (`/groups`)
- Events (`/events`)

## Next Steps (Phase 4 candidates)

1. Video/voice calling (WebRTC)
2. Group post feed (posts scoped to group)
3. Event reminders and calendar integration
4. Marketplace checkout flow (Stripe/payment)
5. Advanced hashtag analytics
6. Poll creation UI in post composer
7. Group moderation tools (ban, mute, report)
8. Push notifications (service worker + FCM)
