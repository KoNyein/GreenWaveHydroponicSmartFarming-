import { create } from "zustand";
import type { Post, Comment, Notification, ReactionType, PostVisibility } from "@/types/social";
import {
  socialPosts,
  socialComments,
  socialNotifications,
  socialPostMedia,
  socialReactions,
  socialFriendships,
  socialUsers,
  getUserById,
} from "@/lib/social-mock-data";

interface SocialState {
  posts: Post[];
  notifications: Notification[];
  unreadCount: number;
  // Actions
  addPost: (content: string, visibility: PostVisibility, mediaUrls: string[]) => void;
  deletePost: (postId: string) => void;
  addComment: (postId: string, content: string, parentId?: string) => void;
  toggleReaction: (targetType: "post" | "comment", targetId: string, reactionType: ReactionType) => void;
  sharePost: (postId: string, comment: string) => void;
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
  getPostWithDetails: (postId: string) => Post & { media: typeof socialPostMedia; comments: Comment[] };
}

export const useSocialStore = create<SocialState>((set, get) => ({
  posts: socialPosts.map((p) => ({
    ...p,
    author: getUserById(p.author_id),
    media: socialPostMedia.filter((m) => m.post_id === p.id),
    reactions_summary: (() => {
      const rxns = socialReactions.filter((r) => r.target_type === "post" && r.target_id === p.id);
      const summary = { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0, total: 0 };
      rxns.forEach((r) => { summary[r.reaction_type]++; summary.total++; });
      return summary;
    })(),
  })),
  notifications: socialNotifications.map((n) => ({ ...n, actor: getUserById(n.actor_id) })),
  unreadCount: socialNotifications.filter((n) => !n.read).length,

  addPost: (content, visibility, mediaUrls) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      author_id: "user-001",
      content,
      visibility,
      likes_count: 0,
      comments_count: 0,
      shares_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: socialUsers[0],
      media: mediaUrls.map((url, i) => ({
        id: `media-${Date.now()}-${i}`,
        post_id: `post-${Date.now()}`,
        media_type: "image" as const,
        url,
        thumbnail_url: null,
        width: 800,
        height: 600,
        file_size: null,
        sort_order: i,
        created_at: new Date().toISOString(),
      })),
      reactions_summary: { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0, total: 0 },
    };
    set((state) => ({ posts: [newPost, ...state.posts] }));
  },

  deletePost: (postId) => {
    set((state) => ({ posts: state.posts.filter((p) => p.id !== postId) }));
  },

  addComment: (postId, content, parentId) => {
    const newComment: Comment = {
      id: `cmt-${Date.now()}`,
      post_id: postId,
      author_id: "user-001",
      parent_id: parentId || null,
      content,
      likes_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: socialUsers[0],
    };
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p
      ),
    }));
    // In real app, this would update the comments list via API
    void newComment;
  },

  toggleReaction: (targetType, targetId, reactionType) => {
    if (targetType === "post") {
      set((state) => ({
        posts: state.posts.map((p) => {
          if (p.id !== targetId) return p;
          const wasReacted = p.user_reaction === reactionType;
          const summary = { ...(p.reactions_summary || { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0, total: 0 }) };
          if (wasReacted) {
            summary[reactionType] = Math.max(0, (summary[reactionType] || 0) - 1);
            summary.total = Math.max(0, summary.total - 1);
          } else {
            if (p.user_reaction) {
              summary[p.user_reaction] = Math.max(0, (summary[p.user_reaction] || 0) - 1);
            } else {
              summary.total++;
            }
            summary[reactionType] = (summary[reactionType] || 0) + 1;
          }
          return {
            ...p,
            user_reaction: wasReacted ? null : reactionType,
            likes_count: summary.total,
            reactions_summary: summary,
          };
        }),
      }));
    }
  },

  sharePost: (postId, _comment) => {
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, shares_count: p.shares_count + 1 } : p
      ),
    }));
  },

  markNotificationRead: (notifId) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notifId ? { ...n, read: true } : n
      ),
      unreadCount: state.notifications.filter((n) => !n.read && n.id !== notifId).length,
    }));
  },

  markAllNotificationsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  getPostWithDetails: (postId) => {
    const post = get().posts.find((p) => p.id === postId)!;
    const media = socialPostMedia.filter((m) => m.post_id === postId);
    const comments = socialComments
      .filter((c) => c.post_id === postId && !c.parent_id)
      .map((c) => ({
        ...c,
        author: getUserById(c.author_id),
        replies: socialComments
          .filter((r) => r.parent_id === c.id)
          .map((r) => ({ ...r, author: getUserById(r.author_id) })),
      }));
    return { ...post, media, comments };
  },
}));
