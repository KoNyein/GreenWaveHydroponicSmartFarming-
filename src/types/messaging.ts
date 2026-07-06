// Phase 2: Messaging, Search & Stories Types

import type { SocialUser } from "./social";

export interface GroupChat {
  id: string;
  name: string;
  avatar_url: string | null;
  created_by: string;
  is_group: boolean;
  last_message_at: string;
  created_at: string;
  // Joined
  members?: ChatMember[];
  last_message?: ChatMessage;
  unread_count?: number;
}

export interface ChatMember {
  id: string;
  chat_id: string;
  user_id: string;
  role: "admin" | "member";
  is_online: boolean;
  is_typing: boolean;
  last_read_at: string;
  joined_at: string;
  // Joined
  user?: SocialUser;
}

export type MessageType = "text" | "image" | "audio" | "video" | "location" | "file" | "system";

export interface ChatMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  message_type: MessageType;
  media_url: string | null;
  location_lat: number | null;
  location_lng: number | null;
  location_name: string | null;
  reply_to_id: string | null;
  is_edited: boolean;
  is_deleted: boolean;
  read_by: string[];
  created_at: string;
  updated_at: string;
  // Joined
  sender?: SocialUser;
  reply_to?: ChatMessage;
  reactions?: MessageReaction[];
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
  user?: SocialUser;
}

export interface Story {
  id: string;
  author_id: string;
  content: string;
  media_url: string | null;
  media_type: "image" | "video" | "text";
  background_color: string;
  font_style: string;
  viewers: string[];
  expires_at: string;
  created_at: string;
  // Joined
  author?: SocialUser;
}

export interface StoryGroup {
  user: SocialUser;
  stories: Story[];
  has_unseen: boolean;
}

export interface Bookmark {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}
