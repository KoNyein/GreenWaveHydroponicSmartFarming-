// Phase 2: Messaging & Stories Zustand Store

import { create } from "zustand";
import type { ChatMessage, Story, Bookmark } from "@/types/messaging";
import { mockMessages, mockStories, mockBookmarks } from "./messaging-mock-data";

interface MessagingState {
  messages: ChatMessage[];
  stories: Story[];
  bookmarks: Bookmark[];
  activeChatId: string | null;
  // Message actions
  sendMessage: (chatId: string, senderId: string, content: string, type?: ChatMessage["message_type"], mediaUrl?: string, locationLat?: number, locationLng?: number, locationName?: string, replyToId?: string) => void;
  deleteMessage: (messageId: string) => void;
  editMessage: (messageId: string, content: string) => void;
  addReaction: (messageId: string, userId: string, emoji: string) => void;
  removeReaction: (messageId: string, userId: string, emoji: string) => void;
  markAsRead: (chatId: string, userId: string) => void;
  // Story actions
  addStory: (story: Omit<Story, "id" | "viewers" | "expires_at" | "created_at">) => void;
  viewStory: (storyId: string, viewerId: string) => void;
  deleteStory: (storyId: string) => void;
  // Bookmark actions
  toggleBookmark: (userId: string, postId: string) => void;
  isBookmarked: (userId: string, postId: string) => boolean;
  // Chat actions
  setActiveChat: (chatId: string | null) => void;
}

export const useMessagingStore = create<MessagingState>((set, get) => ({
  messages: [...mockMessages],
  stories: [...mockStories],
  bookmarks: [...mockBookmarks],
  activeChatId: null,

  sendMessage: (chatId, senderId, content, type = "text", mediaUrl, locationLat, locationLng, locationName, replyToId) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      chat_id: chatId,
      sender_id: senderId,
      content,
      message_type: type,
      media_url: mediaUrl || null,
      location_lat: locationLat || null,
      location_lng: locationLng || null,
      location_name: locationName || null,
      reply_to_id: replyToId || null,
      is_edited: false,
      is_deleted: false,
      read_by: [senderId],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    set((state) => ({ messages: [...state.messages, newMessage] }));
  },

  deleteMessage: (messageId) => {
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === messageId ? { ...m, is_deleted: true, content: "This message was deleted" } : m
      ),
    }));
  },

  editMessage: (messageId, content) => {
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === messageId ? { ...m, content, is_edited: true, updated_at: new Date().toISOString() } : m
      ),
    }));
  },

  addReaction: (messageId, userId, emoji) => {
    set((state) => ({
      messages: state.messages.map((m) => {
        if (m.id !== messageId) return m;
        const reactions = m.reactions || [];
        const existing = reactions.find((r) => r.user_id === userId && r.emoji === emoji);
        if (existing) return m;
        return {
          ...m,
          reactions: [...reactions, { id: `mr-${Date.now()}`, message_id: messageId, user_id: userId, emoji, created_at: new Date().toISOString() }],
        };
      }),
    }));
  },

  removeReaction: (messageId, userId, emoji) => {
    set((state) => ({
      messages: state.messages.map((m) => {
        if (m.id !== messageId) return m;
        return {
          ...m,
          reactions: (m.reactions || []).filter((r) => !(r.user_id === userId && r.emoji === emoji)),
        };
      }),
    }));
  },

  markAsRead: (chatId, userId) => {
    set((state) => ({
      messages: state.messages.map((m) =>
        m.chat_id === chatId && !m.read_by.includes(userId)
          ? { ...m, read_by: [...m.read_by, userId] }
          : m
      ),
    }));
  },

  addStory: (story) => {
    const newStory: Story = {
      ...story,
      id: `story-${Date.now()}`,
      viewers: [],
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
    };
    set((state) => ({ stories: [newStory, ...state.stories] }));
  },

  viewStory: (storyId, viewerId) => {
    set((state) => ({
      stories: state.stories.map((s) =>
        s.id === storyId && !s.viewers.includes(viewerId)
          ? { ...s, viewers: [...s.viewers, viewerId] }
          : s
      ),
    }));
  },

  deleteStory: (storyId) => {
    set((state) => ({ stories: state.stories.filter((s) => s.id !== storyId) }));
  },

  toggleBookmark: (userId, postId) => {
    set((state) => {
      const existing = state.bookmarks.find((b) => b.user_id === userId && b.post_id === postId);
      if (existing) {
        return { bookmarks: state.bookmarks.filter((b) => b.id !== existing.id) };
      }
      return {
        bookmarks: [
          ...state.bookmarks,
          { id: `bk-${Date.now()}`, user_id: userId, post_id: postId, created_at: new Date().toISOString() },
        ],
      };
    });
  },

  isBookmarked: (userId, postId) => {
    return get().bookmarks.some((b) => b.user_id === userId && b.post_id === postId);
  },

  setActiveChat: (chatId) => {
    set({ activeChatId: chatId });
  },
}));
