// Phase 1: Social Core Types

export type PostVisibility = "public" | "friends" | "only_me";
export type ReactionType = "like" | "love" | "haha" | "wow" | "sad" | "angry";
export type FriendshipStatus = "pending" | "accepted" | "blocked";
export type NotificationType =
  | "friend_request"
  | "friend_accepted"
  | "post_like"
  | "post_comment"
  | "comment_reply"
  | "post_share"
  | "follow"
  | "mention";

export interface PostMedia {
  id: string;
  post_id: string;
  media_type: "image" | "video";
  url: string;
  thumbnail_url: string | null;
  width: number | null;
  height: number | null;
  file_size: number | null;
  sort_order: number;
  created_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  content: string;
  visibility: PostVisibility;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  author?: SocialUser;
  media?: PostMedia[];
  user_reaction?: ReactionType | null;
  reactions_summary?: ReactionSummary;
}

export interface ReactionSummary {
  like: number;
  love: number;
  haha: number;
  wow: number;
  sad: number;
  angry: number;
  total: number;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  parent_id: string | null;
  content: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
  // Joined
  author?: SocialUser;
  replies?: Comment[];
  user_reaction?: ReactionType | null;
}

export interface Reaction {
  id: string;
  user_id: string;
  target_type: "post" | "comment";
  target_id: string;
  reaction_type: ReactionType;
  created_at: string;
}

export interface Share {
  id: string;
  post_id: string;
  user_id: string;
  comment: string;
  created_at: string;
  user?: SocialUser;
}

export interface Friendship {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: FriendshipStatus;
  created_at: string;
  updated_at: string;
  // Joined
  requester?: SocialUser;
  addressee?: SocialUser;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
  follower?: SocialUser;
  following?: SocialUser;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  actor_id: string;
  target_type: "post" | "comment" | "user";
  target_id: string;
  message: string | null;
  read: boolean;
  created_at: string;
  // Joined
  actor?: SocialUser;
}

export interface SocialUser {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  cover_url: string | null;
  bio: string;
  location: string;
  friends_count: number;
  followers_count: number;
  following_count: number;
  posts_count: number;
  is_friend?: boolean;
  is_following?: boolean;
  friendship_status?: FriendshipStatus | null;
}
