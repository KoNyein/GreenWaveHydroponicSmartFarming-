"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useSettingsStore } from "@/lib/store";
import { t } from "@/lib/translations";
import { socialPosts, socialUsers } from "@/lib/social-mock-data";
import { useMessagingStore } from "@/lib/messaging-store";
import PostCard from "@/components/social/PostCard";
import { useRouter } from "next/navigation";
import { Bookmark, Search, Trash2 } from "lucide-react";

const CURRENT_USER_ID = "user-001";

export default function BookmarksPage() {
  const { locale } = useSettingsStore();
  const tr = (key: string) => t(key, locale);
  const router = useRouter();

  const { bookmarks, toggleBookmark } = useMessagingStore();
  const [searchQuery, setSearchQuery] = useState("");

  const userBookmarks = bookmarks.filter((b) => b.user_id === CURRENT_USER_ID);

  const bookmarkedPosts = userBookmarks
    .map((bk) => {
      const post = socialPosts.find((p) => p.id === bk.post_id);
      if (!post) return null;
      const author = socialUsers.find((u) => u.id === post.author_id);
      return { ...post, author, bookmarkedAt: bk.created_at };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b!.bookmarkedAt).getTime() - new Date(a!.bookmarkedAt).getTime());

  const filteredPosts = searchQuery.trim()
    ? bookmarkedPosts.filter(
        (p) =>
          p &&
          (p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.author?.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : bookmarkedPosts;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Saved Posts</h1>
              <p className="text-sm text-muted">{userBookmarks.length} saved items</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search saved posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card-bg border border-card-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Bookmarked Posts */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <Bookmark className="w-12 h-12 text-muted mx-auto mb-3" />
            <h3 className="text-lg font-medium text-foreground">
              {searchQuery ? "No matching saved posts" : "No saved posts yet"}
            </h3>
            <p className="text-sm text-muted mt-1">
              {searchQuery
                ? "Try different keywords"
                : "Save posts from your feed to read them later"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => {
              if (!post) return null;
              return (
                <div key={post.id} className="relative">
                  <PostCard
                    post={post}
                    onProfileClick={(username) => router.push(`/u/${username}`)}
                  />
                  {/* Remove bookmark button */}
                  <button
                    onClick={() => toggleBookmark(CURRENT_USER_ID, post.id)}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-card-bg/80 border border-card-border text-muted hover:text-red-500 hover:border-red-300 transition"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
