// Phase 2: Messaging, Stories & Bookmarks Mock Data

import type { GroupChat, ChatMember, ChatMessage, Story, Bookmark } from "@/types/messaging";
import { socialUsers } from "./social-mock-data";

// ============================================================
// GROUP CHATS (mix of DMs and group chats)
// ============================================================
export const mockGroupChats: GroupChat[] = [
  {
    id: "chat-001",
    name: "Mike Johnson",
    avatar_url: socialUsers[1].avatar_url,
    created_by: "user-001",
    is_group: false,
    last_message_at: "2025-06-22T10:30:00Z",
    created_at: "2025-01-15T10:00:00Z",
  },
  {
    id: "chat-002",
    name: "Sarah Williams",
    avatar_url: socialUsers[2].avatar_url,
    created_by: "user-001",
    is_group: false,
    last_message_at: "2025-06-22T09:15:00Z",
    created_at: "2025-01-20T10:00:00Z",
  },
  {
    id: "chat-003",
    name: "GreenWave Team",
    avatar_url: null,
    created_by: "user-001",
    is_group: true,
    last_message_at: "2025-06-22T08:45:00Z",
    created_at: "2025-02-01T10:00:00Z",
  },
  {
    id: "chat-004",
    name: "Genetics Lab",
    avatar_url: null,
    created_by: "user-003",
    is_group: true,
    last_message_at: "2025-06-21T18:00:00Z",
    created_at: "2025-03-01T10:00:00Z",
  },
  {
    id: "chat-005",
    name: "Aung Kyaw",
    avatar_url: socialUsers[3].avatar_url,
    created_by: "user-004",
    is_group: false,
    last_message_at: "2025-06-21T14:30:00Z",
    created_at: "2025-02-10T10:00:00Z",
  },
  {
    id: "chat-006",
    name: "Operations",
    avatar_url: null,
    created_by: "user-001",
    is_group: true,
    last_message_at: "2025-06-20T16:00:00Z",
    created_at: "2025-04-01T10:00:00Z",
  },
];

// ============================================================
// CHAT MEMBERS
// ============================================================
export const mockChatMembers: ChatMember[] = [
  // DM: chat-001 (Admin <-> Mike)
  { id: "cm-001", chat_id: "chat-001", user_id: "user-001", role: "admin", is_online: true, is_typing: false, last_read_at: "2025-06-22T10:30:00Z", joined_at: "2025-01-15T10:00:00Z" },
  { id: "cm-002", chat_id: "chat-001", user_id: "user-002", role: "admin", is_online: true, is_typing: false, last_read_at: "2025-06-22T10:25:00Z", joined_at: "2025-01-15T10:00:00Z" },
  // DM: chat-002 (Admin <-> Sarah)
  { id: "cm-003", chat_id: "chat-002", user_id: "user-001", role: "admin", is_online: true, is_typing: false, last_read_at: "2025-06-22T09:15:00Z", joined_at: "2025-01-20T10:00:00Z" },
  { id: "cm-004", chat_id: "chat-002", user_id: "user-003", role: "admin", is_online: false, is_typing: false, last_read_at: "2025-06-22T09:10:00Z", joined_at: "2025-01-20T10:00:00Z" },
  // Group: chat-003 (GreenWave Team - all 5)
  { id: "cm-005", chat_id: "chat-003", user_id: "user-001", role: "admin", is_online: true, is_typing: false, last_read_at: "2025-06-22T08:45:00Z", joined_at: "2025-02-01T10:00:00Z" },
  { id: "cm-006", chat_id: "chat-003", user_id: "user-002", role: "member", is_online: true, is_typing: false, last_read_at: "2025-06-22T08:40:00Z", joined_at: "2025-02-01T10:00:00Z" },
  { id: "cm-007", chat_id: "chat-003", user_id: "user-003", role: "member", is_online: false, is_typing: false, last_read_at: "2025-06-22T08:30:00Z", joined_at: "2025-02-01T10:00:00Z" },
  { id: "cm-008", chat_id: "chat-003", user_id: "user-004", role: "member", is_online: true, is_typing: true, last_read_at: "2025-06-22T08:20:00Z", joined_at: "2025-02-01T10:00:00Z" },
  { id: "cm-009", chat_id: "chat-003", user_id: "user-005", role: "member", is_online: false, is_typing: false, last_read_at: "2025-06-22T07:00:00Z", joined_at: "2025-02-01T10:00:00Z" },
  // Group: chat-004 (Genetics Lab - Sarah, Aung, Admin)
  { id: "cm-010", chat_id: "chat-004", user_id: "user-003", role: "admin", is_online: false, is_typing: false, last_read_at: "2025-06-21T18:00:00Z", joined_at: "2025-03-01T10:00:00Z" },
  { id: "cm-011", chat_id: "chat-004", user_id: "user-004", role: "member", is_online: true, is_typing: false, last_read_at: "2025-06-21T17:50:00Z", joined_at: "2025-03-01T10:00:00Z" },
  { id: "cm-012", chat_id: "chat-004", user_id: "user-001", role: "member", is_online: true, is_typing: false, last_read_at: "2025-06-21T17:45:00Z", joined_at: "2025-03-01T10:00:00Z" },
  // DM: chat-005 (Admin <-> Aung)
  { id: "cm-013", chat_id: "chat-005", user_id: "user-001", role: "admin", is_online: true, is_typing: false, last_read_at: "2025-06-21T14:30:00Z", joined_at: "2025-02-10T10:00:00Z" },
  { id: "cm-014", chat_id: "chat-005", user_id: "user-004", role: "admin", is_online: true, is_typing: false, last_read_at: "2025-06-21T14:25:00Z", joined_at: "2025-02-10T10:00:00Z" },
  // Group: chat-006 (Operations - Admin, Mike, Thandar)
  { id: "cm-015", chat_id: "chat-006", user_id: "user-001", role: "admin", is_online: true, is_typing: false, last_read_at: "2025-06-20T16:00:00Z", joined_at: "2025-04-01T10:00:00Z" },
  { id: "cm-016", chat_id: "chat-006", user_id: "user-002", role: "member", is_online: true, is_typing: false, last_read_at: "2025-06-20T15:50:00Z", joined_at: "2025-04-01T10:00:00Z" },
  { id: "cm-017", chat_id: "chat-006", user_id: "user-005", role: "member", is_online: false, is_typing: false, last_read_at: "2025-06-20T15:45:00Z", joined_at: "2025-04-01T10:00:00Z" },
];

// ============================================================
// MESSAGES
// ============================================================
export const mockMessages: ChatMessage[] = [
  // Chat-001 (Admin <-> Mike)
  { id: "msg-001", chat_id: "chat-001", sender_id: "user-002", content: "Hey! Zone A seedlings are looking great today. Want to come check them out?", message_type: "text", media_url: null, location_lat: null, location_lng: null, location_name: null, reply_to_id: null, is_edited: false, is_deleted: false, read_by: ["user-001", "user-002"], created_at: "2025-06-22T10:00:00Z", updated_at: "2025-06-22T10:00:00Z" },
  { id: "msg-002", chat_id: "chat-001", sender_id: "user-001", content: "Awesome! I'll be there in 15 minutes. Can you prep the pH meter?", message_type: "text", media_url: null, location_lat: null, location_lng: null, location_name: null, reply_to_id: null, is_edited: false, is_deleted: false, read_by: ["user-001", "user-002"], created_at: "2025-06-22T10:05:00Z", updated_at: "2025-06-22T10:05:00Z" },
  { id: "msg-003", chat_id: "chat-001", sender_id: "user-002", content: "Already calibrated and ready! 👍", message_type: "text", media_url: null, location_lat: null, location_lng: null, location_name: null, reply_to_id: "msg-002", is_edited: false, is_deleted: false, read_by: ["user-001", "user-002"], created_at: "2025-06-22T10:07:00Z", updated_at: "2025-06-22T10:07:00Z" },
  { id: "msg-004", chat_id: "chat-001", sender_id: "user-002", content: "", message_type: "image", media_url: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600", location_lat: null, location_lng: null, location_name: null, reply_to_id: null, is_edited: false, is_deleted: false, read_by: ["user-001", "user-002"], created_at: "2025-06-22T10:15:00Z", updated_at: "2025-06-22T10:15:00Z" },
  { id: "msg-005", chat_id: "chat-001", sender_id: "user-001", content: "Beautiful! The root structure looks amazing 🌱", message_type: "text", media_url: null, location_lat: null, location_lng: null, location_name: null, reply_to_id: null, is_edited: false, is_deleted: false, read_by: ["user-001", "user-002"], created_at: "2025-06-22T10:20:00Z", updated_at: "2025-06-22T10:20:00Z" },
  { id: "msg-006", chat_id: "chat-001", sender_id: "user-002", content: "", message_type: "location", media_url: null, location_lat: 16.8661, location_lng: 96.1951, location_name: "GreenWave Farm - Zone A", reply_to_id: null, is_edited: false, is_deleted: false, read_by: ["user-001", "user-002"], created_at: "2025-06-22T10:25:00Z", updated_at: "2025-06-22T10:25:00Z" },
  { id: "msg-007", chat_id: "chat-001", sender_id: "user-001", content: "On my way! 🏃", message_type: "text", media_url: null, location_lat: null, location_lng: null, location_name: null, reply_to_id: null, is_edited: false, is_deleted: false, read_by: ["user-001"], created_at: "2025-06-22T10:30:00Z", updated_at: "2025-06-22T10:30:00Z" },

  // Chat-002 (Admin <-> Sarah)
  { id: "msg-008", chat_id: "chat-002", sender_id: "user-003", content: "Hi! The terpene analysis results are back. Myrcene levels are at 1.8% - highest we've seen!", message_type: "text", media_url: null, location_lat: null, location_lng: null, location_name: null, reply_to_id: null, is_edited: false, is_deleted: false, read_by: ["user-001", "user-003"], created_at: "2025-06-22T09:00:00Z", updated_at: "2025-06-22T09:00:00Z" },
  { id: "msg-009", chat_id: "chat-002", sender_id: "user-001", content: "That's incredible! Which phenotype?", message_type: "text", media_url: null, location_lat: null, location_lng: null, location_name: null, reply_to_id: null, is_edited: false, is_deleted: false, read_by: ["user-001", "user-003"], created_at: "2025-06-22T09:05:00Z", updated_at: "2025-06-22T09:05:00Z" },
  { id: "msg-010", chat_id: "chat-002", sender_id: "user-003", content: "Phenotype #3 from the OG Kush batch. I'm sending you the full lab report.", message_type: "text", media_url: null, location_lat: null, location_lng: null, location_name: null, reply_to_id: null, is_edited: false, is_deleted: false, read_by: ["user-001", "user-003"], created_at: "2025-06-22T09:10:00Z", updated_at: "2025-06-22T09:10:00Z" },
  { id: "msg-011", chat_id: "chat-002", sender_id: "user-003", content: "Lab Report - Terpene Analysis Q2 2025", message_type: "file", media_url: "/files/terpene-report.pdf", location_lat: null, location_lng: null, location_name: null, reply_to_id: null, is_edited: false, is_deleted: false, read_by: ["user-001", "user-003"], created_at: "2025-06-22T09:15:00Z", updated_at: "2025-06-22T09:15:00Z" },

  // Chat-003 (GreenWave Team)
  { id: "msg-012", chat_id: "chat-003", sender_id: "user-001", content: "Good morning team! Quick update: Q2 harvest numbers are in and we exceeded targets by 25%! 🎉", message_type: "text", media_url: null, location_lat: null, location_lng: null, location_name: null, reply_to_id: null, is_edited: false, is_deleted: false, read_by: ["user-001", "user-002", "user-003", "user-004"], created_at: "2025-06-22T08:00:00Z", updated_at: "2025-06-22T08:00:00Z" },
  { id: "msg-013", chat_id: "chat-003", sender_id: "user-002", content: "Amazing! Zone A alone contributed 40% of that. The new LED setup is paying off.", message_type: "text", media_url: null, location_lat: null, location_lng: null, location_name: null, reply_to_id: null, is_edited: false, is_deleted: false, read_by: ["user-001", "user-002", "user-003", "user-004"], created_at: "2025-06-22T08:15:00Z", updated_at: "2025-06-22T08:15:00Z" },
  { id: "msg-014", chat_id: "chat-003", sender_id: "user-003", content: "Nutrient optimization also played a big role. The new CalMag formula is working wonders!", message_type: "text", media_url: null, location_lat: null, location_lng: null, location_name: null, reply_to_id: null, is_edited: false, is_deleted: false, read_by: ["user-001", "user-002", "user-003"], created_at: "2025-06-22T08:30:00Z", updated_at: "2025-06-22T08:30:00Z" },
  { id: "msg-015", chat_id: "chat-003", sender_id: "user-005", content: "HVAC upgrade definitely helped maintain consistent conditions 24/7", message_type: "text", media_url: null, location_lat: null, location_lng: null, location_name: null, reply_to_id: null, is_edited: false, is_deleted: false, read_by: ["user-001", "user-002"], created_at: "2025-06-22T08:45:00Z", updated_at: "2025-06-22T08:45:00Z" },

  // Chat-004 (Genetics Lab)
  { id: "msg-016", chat_id: "chat-004", sender_id: "user-004", content: "The F3 generation from our tropical sativa cross is showing 95% trait stability!", message_type: "text", media_url: null, location_lat: null, location_lng: null, location_name: null, reply_to_id: null, is_edited: false, is_deleted: false, read_by: ["user-001", "user-003", "user-004"], created_at: "2025-06-21T17:00:00Z", updated_at: "2025-06-21T17:00:00Z" },
  { id: "msg-017", chat_id: "chat-004", sender_id: "user-003", content: "That's remarkable for F3! Usually takes 5-6 generations. Your selection pressure must be strong.", message_type: "text", media_url: null, location_lat: null, location_lng: null, location_name: null, reply_to_id: null, is_edited: false, is_deleted: false, read_by: ["user-001", "user-003", "user-004"], created_at: "2025-06-21T17:30:00Z", updated_at: "2025-06-21T17:30:00Z" },
  { id: "msg-018", chat_id: "chat-004", sender_id: "user-001", content: "Great work both of you! Let's schedule a review meeting next week to discuss commercial viability.", message_type: "text", media_url: null, location_lat: null, location_lng: null, location_name: null, reply_to_id: null, is_edited: false, is_deleted: false, read_by: ["user-001", "user-003", "user-004"], created_at: "2025-06-21T18:00:00Z", updated_at: "2025-06-21T18:00:00Z" },
];

// ============================================================
// STORIES
// ============================================================
export const mockStories: Story[] = [
  { id: "story-001", author_id: "user-001", content: "New pH monitoring system live! 🌱", media_url: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600", media_type: "image", background_color: "#16a34a", font_style: "normal", viewers: ["user-002", "user-003"], expires_at: "2025-06-23T09:00:00Z", created_at: "2025-06-22T09:00:00Z" },
  { id: "story-002", author_id: "user-001", content: "Harvest day vibes 🌿✨", media_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600", media_type: "image", background_color: "#059669", font_style: "normal", viewers: ["user-002"], expires_at: "2025-06-23T10:00:00Z", created_at: "2025-06-22T10:00:00Z" },
  { id: "story-003", author_id: "user-002", content: "Zone A is thriving! 💪🌱", media_url: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=600", media_type: "image", background_color: "#0d9488", font_style: "normal", viewers: ["user-001"], expires_at: "2025-06-23T07:00:00Z", created_at: "2025-06-22T07:00:00Z" },
  { id: "story-004", author_id: "user-002", content: "New LED panels installed!", media_url: null, media_type: "text", background_color: "#7c3aed", font_style: "bold", viewers: [], expires_at: "2025-06-23T08:00:00Z", created_at: "2025-06-22T08:00:00Z" },
  { id: "story-005", author_id: "user-003", content: "", media_url: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600", media_type: "image", background_color: "#16a34a", font_style: "normal", viewers: ["user-001", "user-002", "user-004"], expires_at: "2025-06-23T06:00:00Z", created_at: "2025-06-22T06:00:00Z" },
  { id: "story-006", author_id: "user-004", content: "Genetics breakthrough! F3 stable 🧬", media_url: null, media_type: "text", background_color: "#dc2626", font_style: "bold", viewers: ["user-001"], expires_at: "2025-06-22T17:00:00Z", created_at: "2025-06-21T17:00:00Z" },
  { id: "story-007", author_id: "user-005", content: "HVAC maintenance complete ✅", media_url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600", media_type: "image", background_color: "#2563eb", font_style: "normal", viewers: ["user-001", "user-002"], expires_at: "2025-06-23T04:00:00Z", created_at: "2025-06-22T04:00:00Z" },
];

// ============================================================
// BOOKMARKS
// ============================================================
export const mockBookmarks: Bookmark[] = [
  { id: "bk-001", user_id: "user-001", post_id: "post-011", created_at: "2025-06-20T16:00:00Z" },
  { id: "bk-002", user_id: "user-001", post_id: "post-018", created_at: "2025-06-20T10:30:00Z" },
  { id: "bk-003", user_id: "user-001", post_id: "post-015", created_at: "2025-06-16T11:00:00Z" },
  { id: "bk-004", user_id: "user-001", post_id: "post-024", created_at: "2025-06-20T12:30:00Z" },
  { id: "bk-005", user_id: "user-001", post_id: "post-021", created_at: "2025-06-17T14:30:00Z" },
];

// ============================================================
// HELPERS
// ============================================================
export function getChatMessages(chatId: string): ChatMessage[] {
  return mockMessages
    .filter((m) => m.chat_id === chatId)
    .map((m) => ({
      ...m,
      sender: socialUsers.find((u) => u.id === m.sender_id),
      reply_to: m.reply_to_id ? mockMessages.find((r) => r.id === m.reply_to_id) : undefined,
    }));
}

export function getChatMembers(chatId: string): ChatMember[] {
  return mockChatMembers
    .filter((cm) => cm.chat_id === chatId)
    .map((cm) => ({
      ...cm,
      user: socialUsers.find((u) => u.id === cm.user_id),
    }));
}

export function getUserChats(userId: string): GroupChat[] {
  const userChatIds = mockChatMembers
    .filter((cm) => cm.user_id === userId)
    .map((cm) => cm.chat_id);

  return mockGroupChats
    .filter((c) => userChatIds.includes(c.id))
    .map((chat) => {
      const lastMsg = mockMessages
        .filter((m) => m.chat_id === chat.id)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
      const unread = mockMessages.filter(
        (m) => m.chat_id === chat.id && !m.read_by.includes(userId)
      ).length;
      return { ...chat, last_message: lastMsg, unread_count: unread };
    })
    .sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime());
}

export function getUserStories(userId: string): Story[] {
  return mockStories.filter((s) => s.author_id === userId);
}

export function getStoryGroups(viewerId: string): { user: typeof socialUsers[0]; stories: Story[]; has_unseen: boolean }[] {
  const grouped: Record<string, Story[]> = {};
  mockStories.forEach((s) => {
    if (!grouped[s.author_id]) grouped[s.author_id] = [];
    grouped[s.author_id].push(s);
  });

  return Object.entries(grouped)
    .map(([authorId, stories]) => ({
      user: socialUsers.find((u) => u.id === authorId)!,
      stories,
      has_unseen: stories.some((s) => !s.viewers.includes(viewerId)),
    }))
    .filter((g) => g.user)
    .sort((a, b) => (a.user.id === viewerId ? -1 : b.user.id === viewerId ? 1 : 0));
}
