// Phase 3: Groups, Events & Marketplace Pro Mock Data

import type { Group, GroupMember, Event, EventRSVP, Review, Offer, Poll, PollOption, Hashtag, RSVPStatus } from "@/types/phase3";
import { socialUsers } from "./social-mock-data";

// ============================================================
// GROUPS
// ============================================================
export const mockGroups: Group[] = [
  {
    id: "group-001", name: "Hydroponics Beginners", slug: "hydroponics-beginners",
    description: "A welcoming space for newcomers to hydroponic farming. Share questions, tips, and your first grows!",
    avatar_url: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=200",
    cover_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
    privacy: "public", category: "education", created_by: "user-001",
    member_count: 156, post_count: 89, created_at: "2025-01-10T10:00:00Z",
  },
  {
    id: "group-002", name: "LED Grow Lights", slug: "led-grow-lights",
    description: "Everything about LED grow lighting: spectrum science, PAR values, brand comparisons, DIY builds.",
    avatar_url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200",
    cover_url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800",
    privacy: "public", category: "equipment", created_by: "user-002",
    member_count: 98, post_count: 45, created_at: "2025-02-15T10:00:00Z",
  },
  {
    id: "group-003", name: "Cannabis Genetics Lab", slug: "genetics-lab",
    description: "Advanced breeding discussions, phenotype hunting, tissue culture, and genetic mapping.",
    avatar_url: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=200",
    cover_url: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800",
    privacy: "private", category: "science", created_by: "user-003",
    member_count: 34, post_count: 67, created_at: "2025-03-01T10:00:00Z",
  },
  {
    id: "group-004", name: "GreenWave Marketplace", slug: "marketplace",
    description: "Buy, sell, and trade equipment, seeds, and supplies. Trusted community members only.",
    avatar_url: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=200",
    cover_url: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800",
    privacy: "public", category: "marketplace", created_by: "user-001",
    member_count: 210, post_count: 134, created_at: "2025-01-05T10:00:00Z",
  },
  {
    id: "group-005", name: "Myanmar Growers", slug: "myanmar-growers",
    description: "Local community for Myanmar-based hydroponic farmers. Language: Myanmar/English.",
    avatar_url: null, cover_url: null,
    privacy: "public", category: "regional", created_by: "user-004",
    member_count: 78, post_count: 23, created_at: "2025-04-01T10:00:00Z",
  },
  {
    id: "group-006", name: "Organic Nutrients", slug: "organic-nutrients",
    description: "Natural and organic nutrient solutions, compost teas, and sustainable growing practices.",
    avatar_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200",
    cover_url: null,
    privacy: "public", category: "nutrients", created_by: "user-005",
    member_count: 62, post_count: 31, created_at: "2025-03-15T10:00:00Z",
  },
];

// ============================================================
// GROUP MEMBERS
// ============================================================
export const mockGroupMembers: GroupMember[] = [
  // Hydroponics Beginners
  { id: "gm-001", group_id: "group-001", user_id: "user-001", role: "admin", status: "active", joined_at: "2025-01-10T10:00:00Z" },
  { id: "gm-002", group_id: "group-001", user_id: "user-002", role: "moderator", status: "active", joined_at: "2025-01-12T10:00:00Z" },
  { id: "gm-003", group_id: "group-001", user_id: "user-003", role: "member", status: "active", joined_at: "2025-01-15T10:00:00Z" },
  { id: "gm-004", group_id: "group-001", user_id: "user-004", role: "member", status: "active", joined_at: "2025-01-20T10:00:00Z" },
  { id: "gm-005", group_id: "group-001", user_id: "user-005", role: "member", status: "active", joined_at: "2025-02-01T10:00:00Z" },
  // LED Grow Lights
  { id: "gm-006", group_id: "group-002", user_id: "user-002", role: "admin", status: "active", joined_at: "2025-02-15T10:00:00Z" },
  { id: "gm-007", group_id: "group-002", user_id: "user-001", role: "member", status: "active", joined_at: "2025-02-20T10:00:00Z" },
  { id: "gm-008", group_id: "group-002", user_id: "user-005", role: "member", status: "active", joined_at: "2025-03-01T10:00:00Z" },
  // Genetics Lab
  { id: "gm-009", group_id: "group-003", user_id: "user-003", role: "admin", status: "active", joined_at: "2025-03-01T10:00:00Z" },
  { id: "gm-010", group_id: "group-003", user_id: "user-004", role: "member", status: "active", joined_at: "2025-03-05T10:00:00Z" },
  { id: "gm-011", group_id: "group-003", user_id: "user-001", role: "member", status: "active", joined_at: "2025-03-10T10:00:00Z" },
  // Marketplace
  { id: "gm-012", group_id: "group-004", user_id: "user-001", role: "admin", status: "active", joined_at: "2025-01-05T10:00:00Z" },
  { id: "gm-013", group_id: "group-004", user_id: "user-002", role: "member", status: "active", joined_at: "2025-01-10T10:00:00Z" },
  { id: "gm-014", group_id: "group-004", user_id: "user-003", role: "member", status: "active", joined_at: "2025-01-15T10:00:00Z" },
  { id: "gm-015", group_id: "group-004", user_id: "user-004", role: "member", status: "active", joined_at: "2025-01-20T10:00:00Z" },
  { id: "gm-016", group_id: "group-004", user_id: "user-005", role: "member", status: "active", joined_at: "2025-02-01T10:00:00Z" },
  // Myanmar Growers
  { id: "gm-017", group_id: "group-005", user_id: "user-004", role: "admin", status: "active", joined_at: "2025-04-01T10:00:00Z" },
  { id: "gm-018", group_id: "group-005", user_id: "user-005", role: "member", status: "active", joined_at: "2025-04-05T10:00:00Z" },
  { id: "gm-019", group_id: "group-005", user_id: "user-001", role: "member", status: "active", joined_at: "2025-04-10T10:00:00Z" },
];

// ============================================================
// EVENTS
// ============================================================
export const mockEvents: Event[] = [
  {
    id: "event-001", title: "GreenWave Farm Tour - Q3 2025",
    description: "Visit our state-of-the-art hydroponic facility. See automated nutrient dosing, LED spectrum optimization, and our genetics library in action.",
    cover_url: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800",
    location: "GreenWave Farm, Yangon", location_lat: 16.8661, location_lng: 96.1951,
    start_date: "2025-07-15T09:00:00Z", end_date: "2025-07-15T17:00:00Z",
    event_type: "tour", max_attendees: 30, is_free: false, price: 25.00,
    created_by: "user-001", group_id: null, attendee_count: 22, created_at: "2025-06-01T10:00:00Z",
  },
  {
    id: "event-002", title: "LED Spectrum Workshop",
    description: "Hands-on workshop covering PAR, PPFD, DLI calculations. Build your own custom spectrum profile for flowering stage.",
    cover_url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800",
    location: "Online (Zoom)", location_lat: null, location_lng: null,
    start_date: "2025-07-20T14:00:00Z", end_date: "2025-07-20T16:00:00Z",
    event_type: "workshop", max_attendees: 100, is_free: true, price: null,
    created_by: "user-002", group_id: "group-002", attendee_count: 67, created_at: "2025-06-10T10:00:00Z",
  },
  {
    id: "event-003", title: "Harvest Festival 2025",
    description: "Annual community harvest celebration. Bring your best buds for the friendly competition! Categories: Best Flower, Best Terpene Profile, Most Unique Phenotype.",
    cover_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
    location: "Community Garden, Mandalay", location_lat: 21.9588, location_lng: 96.0891,
    start_date: "2025-08-10T08:00:00Z", end_date: "2025-08-10T20:00:00Z",
    event_type: "harvest", max_attendees: 200, is_free: true, price: null,
    created_by: "user-001", group_id: null, attendee_count: 134, created_at: "2025-06-15T10:00:00Z",
  },
  {
    id: "event-004", title: "Genetics Meetup: Phenotype Selection",
    description: "Monthly genetics discussion group. This month: efficient phenotype selection strategies for small-scale breeders.",
    cover_url: null,
    location: "GreenWave Lab, Yangon", location_lat: 16.8661, location_lng: 96.1951,
    start_date: "2025-07-05T18:00:00Z", end_date: "2025-07-05T20:00:00Z",
    event_type: "meetup", max_attendees: 15, is_free: true, price: null,
    created_by: "user-003", group_id: "group-003", attendee_count: 12, created_at: "2025-06-20T10:00:00Z",
  },
  {
    id: "event-005", title: "Nutrient Mixing Masterclass",
    description: "Learn to mix your own nutrient solutions from raw salts. Save 80% on commercial nutrients while getting better results.",
    cover_url: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800",
    location: "Online (Zoom)", location_lat: null, location_lng: null,
    start_date: "2025-07-25T10:00:00Z", end_date: "2025-07-25T12:00:00Z",
    event_type: "online", max_attendees: 50, is_free: false, price: 15.00,
    created_by: "user-005", group_id: "group-006", attendee_count: 38, created_at: "2025-06-18T10:00:00Z",
  },
];

// ============================================================
// EVENT RSVPS
// ============================================================
export const mockEventRSVPs: EventRSVP[] = [
  { id: "rsvp-001", event_id: "event-001", user_id: "user-001", status: "going", created_at: "2025-06-01T10:00:00Z" },
  { id: "rsvp-002", event_id: "event-001", user_id: "user-002", status: "going", created_at: "2025-06-02T10:00:00Z" },
  { id: "rsvp-003", event_id: "event-001", user_id: "user-003", status: "interested", created_at: "2025-06-03T10:00:00Z" },
  { id: "rsvp-004", event_id: "event-002", user_id: "user-001", status: "going", created_at: "2025-06-11T10:00:00Z" },
  { id: "rsvp-005", event_id: "event-002", user_id: "user-004", status: "going", created_at: "2025-06-12T10:00:00Z" },
  { id: "rsvp-006", event_id: "event-003", user_id: "user-001", status: "going", created_at: "2025-06-16T10:00:00Z" },
  { id: "rsvp-007", event_id: "event-003", user_id: "user-002", status: "going", created_at: "2025-06-17T10:00:00Z" },
  { id: "rsvp-008", event_id: "event-003", user_id: "user-003", status: "going", created_at: "2025-06-17T10:00:00Z" },
  { id: "rsvp-009", event_id: "event-003", user_id: "user-004", status: "interested", created_at: "2025-06-18T10:00:00Z" },
  { id: "rsvp-010", event_id: "event-004", user_id: "user-001", status: "going", created_at: "2025-06-21T10:00:00Z" },
];

// ============================================================
// REVIEWS
// ============================================================
export const mockReviews: Review[] = [
  { id: "rev-001", reviewer_id: "user-002", seller_id: "user-001", listing_id: "listing-001", rating: 5, content: "Excellent pH meter! Accurate readings and fast shipping. Highly recommend this seller.", created_at: "2025-06-10T10:00:00Z" },
  { id: "rev-002", reviewer_id: "user-003", seller_id: "user-001", listing_id: "listing-002", rating: 4, content: "Good quality nutrients. Slightly late delivery but product is great.", created_at: "2025-06-12T10:00:00Z" },
  { id: "rev-003", reviewer_id: "user-004", seller_id: "user-002", listing_id: "listing-003", rating: 5, content: "The LED panel exceeded my expectations. Zone coverage is perfect for a 4x4 tent.", created_at: "2025-06-15T10:00:00Z" },
  { id: "rev-004", reviewer_id: "user-001", seller_id: "user-003", listing_id: "listing-004", rating: 5, content: "Premium genetics! Every seed germinated and the phenotype expression is consistent.", created_at: "2025-06-18T10:00:00Z" },
  { id: "rev-005", reviewer_id: "user-005", seller_id: "user-004", listing_id: "listing-005", rating: 3, content: "Product was okay but packaging could be better. Some perlite was crushed during shipping.", created_at: "2025-06-20T10:00:00Z" },
];

// ============================================================
// OFFERS
// ============================================================
export const mockOffers: Offer[] = [
  { id: "offer-001", listing_id: "listing-001", buyer_id: "user-003", seller_id: "user-001", amount: 45.00, message: "Would you accept $45 for the pH meter?", status: "accepted", counter_amount: null, created_at: "2025-06-19T10:00:00Z", updated_at: "2025-06-19T12:00:00Z" },
  { id: "offer-002", listing_id: "listing-003", buyer_id: "user-005", seller_id: "user-002", amount: 180.00, message: "Can you do $180 for the LED panel?", status: "countered", counter_amount: 200.00, created_at: "2025-06-20T10:00:00Z", updated_at: "2025-06-20T14:00:00Z" },
  { id: "offer-003", listing_id: "listing-004", buyer_id: "user-002", seller_id: "user-003", amount: 30.00, message: "Interested in the seed pack. $30 work?", status: "pending", counter_amount: null, created_at: "2025-06-22T08:00:00Z", updated_at: "2025-06-22T08:00:00Z" },
];

// ============================================================
// POLLS
// ============================================================
export const mockPolls: Poll[] = [
  {
    id: "poll-001", post_id: "post-001", question: "What's your preferred growing medium?",
    allows_multiple: false, ends_at: "2025-07-01T00:00:00Z", total_votes: 42,
    created_at: "2025-06-20T10:00:00Z",
    options: [
      { id: "po-001", poll_id: "poll-001", text: "Deep Water Culture (DWC)", vote_count: 18, sort_order: 0 },
      { id: "po-002", poll_id: "poll-001", text: "Coco Coir", vote_count: 12, sort_order: 1 },
      { id: "po-003", poll_id: "poll-001", text: "Rockwool", vote_count: 8, sort_order: 2 },
      { id: "po-004", poll_id: "poll-001", text: "Clay Pebbles", vote_count: 4, sort_order: 3 },
    ],
    user_votes: ["po-001"],
  },
  {
    id: "poll-002", post_id: "post-005", question: "Best LED brand for flowering?",
    allows_multiple: true, ends_at: null, total_votes: 28,
    created_at: "2025-06-18T10:00:00Z",
    options: [
      { id: "po-005", poll_id: "poll-002", text: "HLG", vote_count: 14, sort_order: 0 },
      { id: "po-006", poll_id: "poll-002", text: "Spider Farmer", vote_count: 9, sort_order: 1 },
      { id: "po-007", poll_id: "poll-002", text: "Mars Hydro", vote_count: 7, sort_order: 2 },
      { id: "po-008", poll_id: "poll-002", text: "Gavita", vote_count: 5, sort_order: 3 },
    ],
    user_votes: ["po-005", "po-008"],
  },
  {
    id: "poll-003", post_id: "post-010", question: "When do you harvest (trichome color)?",
    allows_multiple: false, ends_at: "2025-06-30T00:00:00Z", total_votes: 35,
    created_at: "2025-06-15T10:00:00Z",
    options: [
      { id: "po-009", poll_id: "poll-003", text: "Mostly cloudy", vote_count: 20, sort_order: 0 },
      { id: "po-010", poll_id: "poll-003", text: "50/50 cloudy/amber", vote_count: 10, sort_order: 1 },
      { id: "po-011", poll_id: "poll-003", text: "Mostly amber", vote_count: 5, sort_order: 2 },
    ],
    user_votes: [],
  },
];

// ============================================================
// HASHTAGS
// ============================================================
export const mockHashtags: Hashtag[] = [
  { id: "tag-001", name: "hydroponics", post_count: 45, created_at: "2025-01-01T10:00:00Z" },
  { id: "tag-002", name: "LED_grow", post_count: 32, created_at: "2025-01-05T10:00:00Z" },
  { id: "tag-003", name: "organic", post_count: 28, created_at: "2025-01-10T10:00:00Z" },
  { id: "tag-004", name: "harvest2025", post_count: 22, created_at: "2025-03-01T10:00:00Z" },
  { id: "tag-005", name: "nutrients", post_count: 19, created_at: "2025-01-15T10:00:00Z" },
  { id: "tag-006", name: "pH_balance", post_count: 16, created_at: "2025-02-01T10:00:00Z" },
  { id: "tag-007", name: "DWC", post_count: 14, created_at: "2025-02-10T10:00:00Z" },
  { id: "tag-008", name: "seedlings", post_count: 12, created_at: "2025-03-01T10:00:00Z" },
  { id: "tag-009", name: "genetics", post_count: 11, created_at: "2025-03-15T10:00:00Z" },
  { id: "tag-010", name: "terpenes", post_count: 9, created_at: "2025-04-01T10:00:00Z" },
];

// ============================================================
// HELPERS
// ============================================================
export function getGroupById(groupId: string): Group | undefined {
  return mockGroups.find((g) => g.id === groupId);
}

export function getGroupBySlug(slug: string): Group | undefined {
  return mockGroups.find((g) => g.slug === slug);
}

export function getGroupMembers(groupId: string): GroupMember[] {
  return mockGroupMembers
    .filter((gm) => gm.group_id === groupId)
    .map((gm) => ({ ...gm, user: socialUsers.find((u) => u.id === gm.user_id) }));
}

export function getUserGroups(userId: string): Group[] {
  const memberGroupIds = mockGroupMembers
    .filter((gm) => gm.user_id === userId && gm.status === "active")
    .map((gm) => gm.group_id);
  return mockGroups.filter((g) => memberGroupIds.includes(g.id));
}

export function isGroupMember(groupId: string, userId: string): boolean {
  return mockGroupMembers.some((gm) => gm.group_id === groupId && gm.user_id === userId && gm.status === "active");
}

export function getUserRSVP(eventId: string, userId: string): RSVPStatus | undefined {
  return mockEventRSVPs.find((r) => r.event_id === eventId && r.user_id === userId)?.status;
}

export function getEventAttendees(eventId: string): EventRSVP[] {
  return mockEventRSVPs
    .filter((r) => r.event_id === eventId)
    .map((r) => ({ ...r, user: socialUsers.find((u) => u.id === r.user_id) }));
}

export function getSellerReviews(sellerId: string): Review[] {
  return mockReviews
    .filter((r) => r.seller_id === sellerId)
    .map((r) => ({ ...r, reviewer: socialUsers.find((u) => u.id === r.reviewer_id) }));
}

export function getSellerRating(sellerId: string): { avg: number; count: number } {
  const reviews = mockReviews.filter((r) => r.seller_id === sellerId);
  if (reviews.length === 0) return { avg: 0, count: 0 };
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  return { avg: Math.round(avg * 10) / 10, count: reviews.length };
}

export function getPollByPostId(postId: string): Poll | undefined {
  return mockPolls.find((p) => p.post_id === postId);
}

export function getHashtagByName(name: string): Hashtag | undefined {
  return mockHashtags.find((h) => h.name.toLowerCase() === name.toLowerCase());
}
