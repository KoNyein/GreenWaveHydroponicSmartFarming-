// Phase 1: Social Core Mock Data — 5 demo users, 30 posts, friendships, reactions, comments, notifications

import type {
  SocialUser,
  Post,
  PostMedia,
  Comment,
  Reaction,
  Friendship,
  Follow,
  Notification,
  ReactionType,
} from "@/types/social";

// ============================================================
// 5 DEMO USERS
// ============================================================
export const socialUsers: SocialUser[] = [
  {
    id: "user-001",
    username: "admin",
    full_name: "Admin User",
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    cover_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=400&fit=crop",
    bio: "GreenWave founder. Passionate about hydroponic cannabis cultivation and sustainable farming.",
    location: "Yangon, Myanmar",
    friends_count: 4,
    followers_count: 120,
    following_count: 45,
    posts_count: 8,
  },
  {
    id: "user-002",
    username: "mike_j",
    full_name: "Mike Johnson",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    cover_url: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200&h=400&fit=crop",
    bio: "Hydroponic specialist. 10+ years growing premium strains. Zone A manager at GreenWave.",
    location: "Yangon, Myanmar",
    friends_count: 3,
    followers_count: 85,
    following_count: 32,
    posts_count: 7,
  },
  {
    id: "user-003",
    username: "sarah_w",
    full_name: "Sarah Williams",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    cover_url: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1200&h=400&fit=crop",
    bio: "Botanist & nutritionist. Developing organic nutrient solutions for hydroponic systems.",
    location: "Mandalay, Myanmar",
    friends_count: 3,
    followers_count: 200,
    following_count: 67,
    posts_count: 6,
  },
  {
    id: "user-004",
    username: "aung_k",
    full_name: "Aung Kyaw",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    cover_url: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=1200&h=400&fit=crop",
    bio: "Cannabis genetics researcher. Breeding high-THC strains adapted to tropical climates.",
    location: "Mandalay, Myanmar",
    friends_count: 2,
    followers_count: 150,
    following_count: 40,
    posts_count: 5,
  },
  {
    id: "user-005",
    username: "thandar_w",
    full_name: "Thandar Win",
    avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    cover_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=400&fit=crop",
    bio: "Farm operations manager. Expertise in climate control systems and automated irrigation.",
    location: "Yangon, Myanmar",
    friends_count: 2,
    followers_count: 75,
    following_count: 55,
    posts_count: 4,
  },
];

// ============================================================
// FRIENDSHIPS (accepted & pending)
// ============================================================
export const socialFriendships: Friendship[] = [
  { id: "fr-001", requester_id: "user-001", addressee_id: "user-002", status: "accepted", created_at: "2025-01-15T10:00:00Z", updated_at: "2025-01-15T12:00:00Z" },
  { id: "fr-002", requester_id: "user-001", addressee_id: "user-003", status: "accepted", created_at: "2025-01-20T10:00:00Z", updated_at: "2025-01-20T14:00:00Z" },
  { id: "fr-003", requester_id: "user-002", addressee_id: "user-003", status: "accepted", created_at: "2025-02-01T10:00:00Z", updated_at: "2025-02-01T11:00:00Z" },
  { id: "fr-004", requester_id: "user-004", addressee_id: "user-001", status: "accepted", created_at: "2025-02-10T10:00:00Z", updated_at: "2025-02-10T15:00:00Z" },
  { id: "fr-005", requester_id: "user-005", addressee_id: "user-001", status: "accepted", created_at: "2025-02-15T10:00:00Z", updated_at: "2025-02-15T13:00:00Z" },
  { id: "fr-006", requester_id: "user-003", addressee_id: "user-004", status: "accepted", created_at: "2025-03-01T10:00:00Z", updated_at: "2025-03-01T12:00:00Z" },
  { id: "fr-007", requester_id: "user-005", addressee_id: "user-002", status: "pending", created_at: "2025-06-20T10:00:00Z", updated_at: "2025-06-20T10:00:00Z" },
  { id: "fr-008", requester_id: "user-004", addressee_id: "user-005", status: "pending", created_at: "2025-06-21T10:00:00Z", updated_at: "2025-06-21T10:00:00Z" },
];

// ============================================================
// FOLLOWS
// ============================================================
export const socialFollows: Follow[] = [
  { id: "fol-001", follower_id: "user-002", following_id: "user-001", created_at: "2025-01-15T10:00:00Z" },
  { id: "fol-002", follower_id: "user-003", following_id: "user-001", created_at: "2025-01-20T10:00:00Z" },
  { id: "fol-003", follower_id: "user-004", following_id: "user-001", created_at: "2025-02-10T10:00:00Z" },
  { id: "fol-004", follower_id: "user-005", following_id: "user-001", created_at: "2025-02-15T10:00:00Z" },
  { id: "fol-005", follower_id: "user-001", following_id: "user-003", created_at: "2025-01-22T10:00:00Z" },
  { id: "fol-006", follower_id: "user-001", following_id: "user-002", created_at: "2025-01-16T10:00:00Z" },
  { id: "fol-007", follower_id: "user-003", following_id: "user-004", created_at: "2025-03-01T10:00:00Z" },
];

// ============================================================
// 30 POSTS
// ============================================================

const postImages: Record<string, PostMedia[]> = {};

export const socialPosts: Post[] = [
  // User 1 posts (8)
  { id: "post-001", author_id: "user-001", content: "Just finished setting up the new automated pH monitoring system in Zone A. EC levels are now auto-adjusted every 30 minutes. The future of farming is here! 🌱💧", visibility: "public", likes_count: 24, comments_count: 5, shares_count: 3, created_at: "2025-06-22T09:00:00Z", updated_at: "2025-06-22T09:00:00Z" },
  { id: "post-002", author_id: "user-001", content: "Welcome to the GreenWave community! We're building the most advanced hydroponic cannabis farming platform. Join us in revolutionizing agriculture. 🚀", visibility: "public", likes_count: 45, comments_count: 12, shares_count: 8, created_at: "2025-06-21T14:00:00Z", updated_at: "2025-06-21T14:00:00Z" },
  { id: "post-003", author_id: "user-001", content: "Harvest day! OG Kush from Zone C is looking absolutely beautiful. Trichome development is peak. Lab results coming soon. 🔬", visibility: "friends", likes_count: 18, comments_count: 7, shares_count: 2, created_at: "2025-06-20T08:30:00Z", updated_at: "2025-06-20T08:30:00Z" },
  { id: "post-004", author_id: "user-001", content: "Reminder: Team meeting tomorrow at 9 AM. We'll discuss the Q3 expansion plan and new strain introductions.", visibility: "friends", likes_count: 6, comments_count: 3, shares_count: 0, created_at: "2025-06-19T16:00:00Z", updated_at: "2025-06-19T16:00:00Z" },
  { id: "post-005", author_id: "user-001", content: "Personal note: Grateful for this incredible team. 4 months in and we're already exceeding growth targets by 40%. 🙏", visibility: "only_me", likes_count: 0, comments_count: 0, shares_count: 0, created_at: "2025-06-18T22:00:00Z", updated_at: "2025-06-18T22:00:00Z" },
  { id: "post-006", author_id: "user-001", content: "New nutrient formulation testing results are in! Our custom CalMag blend shows 15% better absorption compared to commercial alternatives.", visibility: "public", likes_count: 32, comments_count: 9, shares_count: 5, created_at: "2025-06-17T11:00:00Z", updated_at: "2025-06-17T11:00:00Z" },
  { id: "post-007", author_id: "user-001", content: "Just added 3 new CCTV cameras covering the drying room. Full 24/7 monitoring is now complete across all zones. Security first! 📹", visibility: "public", likes_count: 15, comments_count: 4, shares_count: 1, created_at: "2025-06-16T13:30:00Z", updated_at: "2025-06-16T13:30:00Z" },
  { id: "post-008", author_id: "user-001", content: "Quick tip for growers: Keep your reservoir temperature between 18-22°C for optimal nutrient uptake. Too warm = root rot risk. Too cold = slow growth.", visibility: "public", likes_count: 28, comments_count: 6, shares_count: 7, created_at: "2025-06-15T10:00:00Z", updated_at: "2025-06-15T10:00:00Z" },

  // User 2 posts (7)
  { id: "post-009", author_id: "user-002", content: "Zone A update: Seedlings from the new OG Kush batch are showing incredible vigor. Root development is ahead of schedule by 3 days!", visibility: "public", likes_count: 19, comments_count: 4, shares_count: 2, created_at: "2025-06-22T07:00:00Z", updated_at: "2025-06-22T07:00:00Z" },
  { id: "post-010", author_id: "user-002", content: "Experimenting with LED light spectrum adjustments during vegetative phase. Blue-heavy spectrum for the first 2 weeks, then gradually shifting to full spectrum.", visibility: "public", likes_count: 22, comments_count: 8, shares_count: 4, created_at: "2025-06-21T09:00:00Z", updated_at: "2025-06-21T09:00:00Z" },
  { id: "post-011", author_id: "user-002", content: "Pro tip: Always calibrate your pH meter before each use. A 0.2 drift can mean the difference between nutrient lockout and perfect uptake.", visibility: "public", likes_count: 35, comments_count: 11, shares_count: 9, created_at: "2025-06-20T15:00:00Z", updated_at: "2025-06-20T15:00:00Z" },
  { id: "post-012", author_id: "user-002", content: "Comparing DWC vs NFT systems for our next expansion. DWC gives bigger yields but NFT is more water-efficient. What do you all think?", visibility: "friends", likes_count: 14, comments_count: 8, shares_count: 1, created_at: "2025-06-19T11:00:00Z", updated_at: "2025-06-19T11:00:00Z" },
  { id: "post-013", author_id: "user-002", content: "Just received the new Samsung LM301H diodes for our custom light panels. These should give us 20% more efficiency than the current setup.", visibility: "public", likes_count: 27, comments_count: 6, shares_count: 3, created_at: "2025-06-18T14:00:00Z", updated_at: "2025-06-18T14:00:00Z" },
  { id: "post-014", author_id: "user-002", content: "EC meter reading training session done with the new staff. Everyone's now certified to do daily reservoir checks. Team growing strong! 💪", visibility: "friends", likes_count: 8, comments_count: 2, shares_count: 0, created_at: "2025-06-17T16:30:00Z", updated_at: "2025-06-17T16:30:00Z" },
  { id: "post-015", author_id: "user-002", content: "Weekend project: Built a DIY automated nutrient dosing system using peristaltic pumps and Arduino. Total cost: $120. Works like a charm!", visibility: "public", likes_count: 42, comments_count: 15, shares_count: 12, created_at: "2025-06-16T10:00:00Z", updated_at: "2025-06-16T10:00:00Z" },

  // User 3 posts (6)
  { id: "post-016", author_id: "user-003", content: "Research update: Our organic CalMag supplement trial shows 23% improvement in bud density vs synthetic alternatives. Paper publishing next month! 📊", visibility: "public", likes_count: 38, comments_count: 13, shares_count: 6, created_at: "2025-06-22T06:00:00Z", updated_at: "2025-06-22T06:00:00Z" },
  { id: "post-017", author_id: "user-003", content: "New batch of beneficial microbes arrived! Trichoderma and Mycorrhizae inoculants for root zone health. Starting trials in Zone B next week.", visibility: "public", likes_count: 20, comments_count: 5, shares_count: 3, created_at: "2025-06-21T11:00:00Z", updated_at: "2025-06-21T11:00:00Z" },
  { id: "post-018", author_id: "user-003", content: "The key to perfect nutrients: pH 5.8-6.2 in hydro, EC 1.2-1.8 for veg, EC 1.8-2.4 for flower. Adjust based on strain genetics.", visibility: "public", likes_count: 55, comments_count: 18, shares_count: 14, created_at: "2025-06-20T09:30:00Z", updated_at: "2025-06-20T09:30:00Z" },
  { id: "post-019", author_id: "user-003", content: "Lab day! Running terpene profiles on 5 different OG Kush phenotypes. Hoping to find one with high myrcene + limonene combination.", visibility: "friends", likes_count: 12, comments_count: 4, shares_count: 1, created_at: "2025-06-19T08:00:00Z", updated_at: "2025-06-19T08:00:00Z" },
  { id: "post-020", author_id: "user-003", content: "Foliar feeding tip: Apply in the first 2 hours after lights on, when stomata are most active. Use 1/4 strength solution to avoid leaf burn.", visibility: "public", likes_count: 30, comments_count: 7, shares_count: 8, created_at: "2025-06-18T07:00:00Z", updated_at: "2025-06-18T07:00:00Z" },
  { id: "post-021", author_id: "user-003", content: "Exciting news! Just got approved for a grant to study cannabis terpene-entourage effects. This will help us develop targeted strain profiles. 🎉", visibility: "public", likes_count: 48, comments_count: 20, shares_count: 10, created_at: "2025-06-17T14:00:00Z", updated_at: "2025-06-17T14:00:00Z" },

  // User 4 posts (5)
  { id: "post-022", author_id: "user-004", content: "Genetics update: Our F2 cross of Thai Sativa × Afghan Kush is showing incredible hybrid vigor. 30% faster growth than either parent!", visibility: "public", likes_count: 33, comments_count: 9, shares_count: 5, created_at: "2025-06-22T05:00:00Z", updated_at: "2025-06-22T05:00:00Z" },
  { id: "post-023", author_id: "user-004", content: "Seed selection day! Going through 200 seeds from our breeding program. Looking for the perfect phenotype expression.", visibility: "friends", likes_count: 15, comments_count: 6, shares_count: 2, created_at: "2025-06-21T08:00:00Z", updated_at: "2025-06-21T08:00:00Z" },
  { id: "post-024", author_id: "user-004", content: "Tropical genetics are the future. Our Mandalay Haze is now stable after 6 generations. Ready for commercial production! 🌿", visibility: "public", likes_count: 40, comments_count: 14, shares_count: 7, created_at: "2025-06-20T12:00:00Z", updated_at: "2025-06-20T12:00:00Z" },
  { id: "post-025", author_id: "user-004", content: "Breeding tip: Always keep detailed records of every cross. Parent genetics, environmental conditions, and phenotype observations are gold data.", visibility: "public", likes_count: 25, comments_count: 8, shares_count: 6, created_at: "2025-06-19T14:00:00Z", updated_at: "2025-06-19T14:00:00Z" },
  { id: "post-026", author_id: "user-004", content: "Just cloned the top 3 performers from batch #42. These will become our new mother plants for Q4 production.", visibility: "friends", likes_count: 10, comments_count: 3, shares_count: 0, created_at: "2025-06-18T10:00:00Z", updated_at: "2025-06-18T10:00:00Z" },

  // User 5 posts (4)
  { id: "post-027", author_id: "user-005", content: "Climate control system upgrade complete! New HVAC handles 50% more airflow with 30% less energy consumption. Green tech for green plants! ♻️", visibility: "public", likes_count: 22, comments_count: 5, shares_count: 4, created_at: "2025-06-22T04:00:00Z", updated_at: "2025-06-22T04:00:00Z" },
  { id: "post-028", author_id: "user-005", content: "Automated irrigation update: New drip system installed in all 5 zones. Each plant gets precisely measured nutrient solution every 4 hours.", visibility: "public", likes_count: 18, comments_count: 7, shares_count: 3, created_at: "2025-06-21T06:00:00Z", updated_at: "2025-06-21T06:00:00Z" },
  { id: "post-029", author_id: "user-005", content: "Power backup system test: All zones maintained perfect conditions during 4-hour grid outage simulation. Generator kicks in within 3 seconds.", visibility: "friends", likes_count: 9, comments_count: 4, shares_count: 1, created_at: "2025-06-20T07:00:00Z", updated_at: "2025-06-20T07:00:00Z" },
  { id: "post-030", author_id: "user-005", content: "Dehumidifier maintenance day! Cleaned all 12 units and replaced filters. Humidity control is critical during flowering phase.", visibility: "public", likes_count: 14, comments_count: 3, shares_count: 2, created_at: "2025-06-19T09:00:00Z", updated_at: "2025-06-19T09:00:00Z" },
];

// Add media to some posts
export const socialPostMedia: PostMedia[] = [
  { id: "media-001", post_id: "post-001", media_type: "image", url: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800", thumbnail_url: null, width: 800, height: 600, file_size: 245000, sort_order: 0, created_at: "2025-06-22T09:00:00Z" },
  { id: "media-002", post_id: "post-003", media_type: "image", url: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=800", thumbnail_url: null, width: 800, height: 600, file_size: 180000, sort_order: 0, created_at: "2025-06-20T08:30:00Z" },
  { id: "media-003", post_id: "post-003", media_type: "image", url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800", thumbnail_url: null, width: 800, height: 533, file_size: 210000, sort_order: 1, created_at: "2025-06-20T08:30:00Z" },
  { id: "media-004", post_id: "post-009", media_type: "image", url: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800", thumbnail_url: null, width: 800, height: 600, file_size: 195000, sort_order: 0, created_at: "2025-06-22T07:00:00Z" },
  { id: "media-005", post_id: "post-015", media_type: "image", url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800", thumbnail_url: null, width: 800, height: 533, file_size: 225000, sort_order: 0, created_at: "2025-06-16T10:00:00Z" },
  { id: "media-006", post_id: "post-015", media_type: "image", url: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800", thumbnail_url: null, width: 800, height: 600, file_size: 245000, sort_order: 1, created_at: "2025-06-16T10:00:00Z" },
  { id: "media-007", post_id: "post-016", media_type: "image", url: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800", thumbnail_url: null, width: 800, height: 533, file_size: 190000, sort_order: 0, created_at: "2025-06-22T06:00:00Z" },
  { id: "media-008", post_id: "post-022", media_type: "image", url: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=800", thumbnail_url: null, width: 800, height: 600, file_size: 205000, sort_order: 0, created_at: "2025-06-22T05:00:00Z" },
  { id: "media-009", post_id: "post-024", media_type: "image", url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800", thumbnail_url: null, width: 800, height: 533, file_size: 215000, sort_order: 0, created_at: "2025-06-20T12:00:00Z" },
  { id: "media-010", post_id: "post-027", media_type: "image", url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800", thumbnail_url: null, width: 800, height: 600, file_size: 230000, sort_order: 0, created_at: "2025-06-22T04:00:00Z" },
];

// ============================================================
// COMMENTS (with nested replies)
// ============================================================
export const socialComments: Comment[] = [
  // Comments on post-001
  { id: "cmt-001", post_id: "post-001", author_id: "user-002", parent_id: null, content: "Amazing work! The automation is next level. How long did the setup take?", likes_count: 3, created_at: "2025-06-22T09:30:00Z", updated_at: "2025-06-22T09:30:00Z" },
  { id: "cmt-002", post_id: "post-001", author_id: "user-001", parent_id: "cmt-001", content: "About 2 days including calibration. Worth every minute!", likes_count: 1, created_at: "2025-06-22T09:45:00Z", updated_at: "2025-06-22T09:45:00Z" },
  { id: "cmt-003", post_id: "post-001", author_id: "user-003", parent_id: null, content: "This is going to save so much time on daily monitoring. Great investment! 👏", likes_count: 5, created_at: "2025-06-22T10:00:00Z", updated_at: "2025-06-22T10:00:00Z" },
  { id: "cmt-004", post_id: "post-001", author_id: "user-004", parent_id: null, content: "Can you share the sensor model? I want to set up something similar for my breeding room.", likes_count: 2, created_at: "2025-06-22T10:30:00Z", updated_at: "2025-06-22T10:30:00Z" },
  { id: "cmt-005", post_id: "post-001", author_id: "user-001", parent_id: "cmt-004", content: "Using the Bluelab Guardian Monitor. DM me for the full setup guide!", likes_count: 4, created_at: "2025-06-22T11:00:00Z", updated_at: "2025-06-22T11:00:00Z" },

  // Comments on post-011
  { id: "cmt-006", post_id: "post-011", author_id: "user-001", parent_id: null, content: "Can't stress this enough! I lost an entire batch once due to uncalibrated readings.", likes_count: 8, created_at: "2025-06-20T15:30:00Z", updated_at: "2025-06-20T15:30:00Z" },
  { id: "cmt-007", post_id: "post-011", author_id: "user-003", parent_id: null, content: "Also worth noting: store your pH probe in storage solution, never in water!", likes_count: 6, created_at: "2025-06-20T16:00:00Z", updated_at: "2025-06-20T16:00:00Z" },
  { id: "cmt-008", post_id: "post-011", author_id: "user-005", parent_id: "cmt-006", content: "Same happened to me early on. Lesson learned the hard way 😅", likes_count: 2, created_at: "2025-06-20T16:30:00Z", updated_at: "2025-06-20T16:30:00Z" },

  // Comments on post-018
  { id: "cmt-009", post_id: "post-018", author_id: "user-002", parent_id: null, content: "This is the best nutrient guide I've seen. Bookmarking this! 📌", likes_count: 12, created_at: "2025-06-20T10:00:00Z", updated_at: "2025-06-20T10:00:00Z" },
  { id: "cmt-010", post_id: "post-018", author_id: "user-004", parent_id: null, content: "For heavy-feeding strains, I'd push EC to 2.6 during late flower. Agree?", likes_count: 4, created_at: "2025-06-20T10:30:00Z", updated_at: "2025-06-20T10:30:00Z" },
  { id: "cmt-011", post_id: "post-018", author_id: "user-003", parent_id: "cmt-010", content: "Yes but watch for tip burn. I go up to 2.4 max and adjust based on leaf color.", likes_count: 7, created_at: "2025-06-20T11:00:00Z", updated_at: "2025-06-20T11:00:00Z" },

  // Comments on post-015
  { id: "cmt-012", post_id: "post-015", author_id: "user-001", parent_id: null, content: "This is brilliant! Can you share the Arduino code? I want to build one too.", likes_count: 9, created_at: "2025-06-16T10:30:00Z", updated_at: "2025-06-16T10:30:00Z" },
  { id: "cmt-013", post_id: "post-015", author_id: "user-003", parent_id: null, content: "$120 for automated dosing?! Commercial systems cost 10x that. Amazing DIY!", likes_count: 11, created_at: "2025-06-16T11:00:00Z", updated_at: "2025-06-16T11:00:00Z" },
  { id: "cmt-014", post_id: "post-015", author_id: "user-002", parent_id: "cmt-012", content: "I'll post a full tutorial next week with the code and wiring diagram! 🔧", likes_count: 15, created_at: "2025-06-16T11:30:00Z", updated_at: "2025-06-16T11:30:00Z" },
  { id: "cmt-015", post_id: "post-015", author_id: "user-005", parent_id: null, content: "Which peristaltic pumps did you use? Looking for food-safe options.", likes_count: 3, created_at: "2025-06-16T12:00:00Z", updated_at: "2025-06-16T12:00:00Z" },
];

// ============================================================
// REACTIONS (sample)
// ============================================================
export const socialReactions: Reaction[] = [
  { id: "rxn-001", user_id: "user-002", target_type: "post", target_id: "post-001", reaction_type: "love", created_at: "2025-06-22T09:15:00Z" },
  { id: "rxn-002", user_id: "user-003", target_type: "post", target_id: "post-001", reaction_type: "like", created_at: "2025-06-22T09:20:00Z" },
  { id: "rxn-003", user_id: "user-004", target_type: "post", target_id: "post-001", reaction_type: "wow", created_at: "2025-06-22T09:25:00Z" },
  { id: "rxn-004", user_id: "user-005", target_type: "post", target_id: "post-001", reaction_type: "like", created_at: "2025-06-22T09:28:00Z" },
  { id: "rxn-005", user_id: "user-001", target_type: "post", target_id: "post-009", reaction_type: "love", created_at: "2025-06-22T07:30:00Z" },
  { id: "rxn-006", user_id: "user-003", target_type: "post", target_id: "post-009", reaction_type: "like", created_at: "2025-06-22T07:45:00Z" },
  { id: "rxn-007", user_id: "user-001", target_type: "post", target_id: "post-016", reaction_type: "love", created_at: "2025-06-22T06:30:00Z" },
  { id: "rxn-008", user_id: "user-002", target_type: "post", target_id: "post-016", reaction_type: "wow", created_at: "2025-06-22T06:45:00Z" },
  { id: "rxn-009", user_id: "user-001", target_type: "post", target_id: "post-022", reaction_type: "like", created_at: "2025-06-22T05:30:00Z" },
  { id: "rxn-010", user_id: "user-001", target_type: "post", target_id: "post-015", reaction_type: "love", created_at: "2025-06-16T10:15:00Z" },
];

// ============================================================
// NOTIFICATIONS
// ============================================================
export const socialNotifications: Notification[] = [
  { id: "notif-001", user_id: "user-001", type: "post_like", actor_id: "user-002", target_type: "post", target_id: "post-001", message: null, read: false, created_at: "2025-06-22T09:15:00Z" },
  { id: "notif-002", user_id: "user-001", type: "post_comment", actor_id: "user-002", target_type: "post", target_id: "post-001", message: null, read: false, created_at: "2025-06-22T09:30:00Z" },
  { id: "notif-003", user_id: "user-001", type: "post_like", actor_id: "user-003", target_type: "post", target_id: "post-001", message: null, read: false, created_at: "2025-06-22T09:20:00Z" },
  { id: "notif-004", user_id: "user-001", type: "post_comment", actor_id: "user-003", target_type: "post", target_id: "post-001", message: null, read: true, created_at: "2025-06-22T10:00:00Z" },
  { id: "notif-005", user_id: "user-001", type: "friend_request", actor_id: "user-005", target_type: "user", target_id: "user-001", message: null, read: true, created_at: "2025-06-21T10:00:00Z" },
  { id: "notif-006", user_id: "user-001", type: "post_share", actor_id: "user-004", target_type: "post", target_id: "post-002", message: null, read: true, created_at: "2025-06-21T15:00:00Z" },
  { id: "notif-007", user_id: "user-001", type: "follow", actor_id: "user-003", target_type: "user", target_id: "user-001", message: null, read: true, created_at: "2025-06-20T10:00:00Z" },
  { id: "notif-008", user_id: "user-001", type: "post_like", actor_id: "user-004", target_type: "post", target_id: "post-006", message: null, read: true, created_at: "2025-06-17T11:30:00Z" },
  { id: "notif-009", user_id: "user-001", type: "comment_reply", actor_id: "user-002", target_type: "comment", target_id: "cmt-002", message: null, read: true, created_at: "2025-06-16T12:00:00Z" },
  { id: "notif-010", user_id: "user-001", type: "mention", actor_id: "user-003", target_type: "post", target_id: "post-021", message: null, read: true, created_at: "2025-06-17T14:30:00Z" },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================
export function getUserById(id: string): SocialUser | undefined {
  return socialUsers.find((u) => u.id === id);
}

export function getUserByUsername(username: string): SocialUser | undefined {
  return socialUsers.find((u) => u.username === username);
}

export function getPostMedia(postId: string): PostMedia[] {
  return socialPostMedia.filter((m) => m.post_id === postId);
}

export function getPostComments(postId: string): Comment[] {
  return socialComments
    .filter((c) => c.post_id === postId && !c.parent_id)
    .map((c) => ({
      ...c,
      author: getUserById(c.author_id),
      replies: socialComments
        .filter((r) => r.parent_id === c.id)
        .map((r) => ({ ...r, author: getUserById(r.author_id) })),
    }));
}

export function getPostReactions(postId: string): { type: ReactionType; count: number }[] {
  const reactions = socialReactions.filter((r) => r.target_type === "post" && r.target_id === postId);
  const counts: Record<string, number> = {};
  reactions.forEach((r) => {
    counts[r.reaction_type] = (counts[r.reaction_type] || 0) + 1;
  });
  return Object.entries(counts).map(([type, count]) => ({ type: type as ReactionType, count }));
}

export function getUserPosts(userId: string, viewerId: string): Post[] {
  return socialPosts
    .filter((p) => {
      if (p.author_id !== userId) return false;
      if (p.visibility === "public") return true;
      if (p.author_id === viewerId) return true;
      if (p.visibility === "friends") {
        return socialFriendships.some(
          (f) =>
            f.status === "accepted" &&
            ((f.requester_id === viewerId && f.addressee_id === userId) ||
              (f.addressee_id === viewerId && f.requester_id === userId))
        );
      }
      return false;
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getFeedPosts(userId: string): Post[] {
  const friendIds = socialFriendships
    .filter((f) => f.status === "accepted" && (f.requester_id === userId || f.addressee_id === userId))
    .map((f) => (f.requester_id === userId ? f.addressee_id : f.requester_id));

  const followingIds = socialFollows.filter((f) => f.follower_id === userId).map((f) => f.following_id);

  const visibleUserIds = new Set([userId, ...friendIds, ...followingIds]);

  return socialPosts
    .filter((p) => {
      if (p.author_id === userId) return p.visibility !== "only_me" || true;
      if (!visibleUserIds.has(p.author_id)) return p.visibility === "public";
      if (p.visibility === "public") return true;
      if (p.visibility === "friends" && friendIds.includes(p.author_id)) return true;
      return false;
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function isFriend(userId: string, otherId: string): boolean {
  return socialFriendships.some(
    (f) =>
      f.status === "accepted" &&
      ((f.requester_id === userId && f.addressee_id === otherId) ||
        (f.addressee_id === userId && f.requester_id === otherId))
  );
}

export function getFriendshipStatus(userId: string, otherId: string): { status: string | null; direction: string | null } {
  const friendship = socialFriendships.find(
    (f) =>
      (f.requester_id === userId && f.addressee_id === otherId) ||
      (f.addressee_id === userId && f.requester_id === otherId)
  );
  if (!friendship) return { status: null, direction: null };
  const direction = friendship.requester_id === userId ? "sent" : "received";
  return { status: friendship.status, direction };
}
