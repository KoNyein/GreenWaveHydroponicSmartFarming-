// Phase 3: Groups, Events & Marketplace Pro Types

import type { SocialUser } from "./social";
import type { Post } from "./social";

export type GroupPrivacy = "public" | "private" | "secret";
export type GroupMemberRole = "admin" | "moderator" | "member";
export type GroupMemberStatus = "active" | "pending" | "banned";
export type EventType = "meetup" | "workshop" | "tour" | "harvest" | "online" | "other";
export type RSVPStatus = "going" | "interested" | "not_going";
export type OfferStatus = "pending" | "accepted" | "declined" | "countered" | "expired";

export interface Group {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  privacy: GroupPrivacy;
  category: string;
  created_by: string;
  member_count: number;
  post_count: number;
  created_at: string;
  // Joined
  creator?: SocialUser;
  members?: GroupMember[];
  is_member?: boolean;
  user_role?: GroupMemberRole;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: GroupMemberRole;
  status: GroupMemberStatus;
  joined_at: string;
  user?: SocialUser;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  location: string | null;
  location_lat: number | null;
  location_lng: number | null;
  start_date: string;
  end_date: string | null;
  event_type: EventType;
  max_attendees: number | null;
  is_free: boolean;
  price: number | null;
  created_by: string;
  group_id: string | null;
  attendee_count: number;
  created_at: string;
  // Joined
  creator?: SocialUser;
  user_rsvp?: RSVPStatus;
  group?: Group;
}

export interface EventRSVP {
  id: string;
  event_id: string;
  user_id: string;
  status: RSVPStatus;
  created_at: string;
  user?: SocialUser;
}

export interface Review {
  id: string;
  reviewer_id: string;
  seller_id: string;
  listing_id: string;
  rating: number;
  content: string | null;
  created_at: string;
  reviewer?: SocialUser;
}

export interface Offer {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  message: string | null;
  status: OfferStatus;
  counter_amount: number | null;
  created_at: string;
  updated_at: string;
  buyer?: SocialUser;
  seller?: SocialUser;
}

export interface Poll {
  id: string;
  post_id: string;
  question: string;
  allows_multiple: boolean;
  ends_at: string | null;
  total_votes: number;
  created_at: string;
  options: PollOption[];
  user_votes?: string[];
}

export interface PollOption {
  id: string;
  poll_id: string;
  text: string;
  vote_count: number;
  sort_order: number;
}

export interface Hashtag {
  id: string;
  name: string;
  post_count: number;
  created_at: string;
}
