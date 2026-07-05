"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Leaf, TrendingUp, Users, Newspaper } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PostComposer from "@/components/social/PostComposer";
import PostCard from "@/components/social/PostCard";
import { useSocialStore } from "@/lib/social-store";
import { socialUsers } from "@/lib/social-mock-data";

const POSTS_PER_PAGE = 5;

export default function FeedPage() {
  const router = useRouter();
  const { posts } = useSocialStore();
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Feed posts: from friends + follows + own, sorted by date
  const feedPosts = posts.filter(
    (p) => p.visibility !== "only_me" || p.author_id === "user-001"
  );

  const visiblePosts = feedPosts.slice(0, visibleCount);
  const hasMore = visibleCount < feedPosts.length;

  // Infinite scroll
  const loadMore = () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + POSTS_PER_PAGE, feedPosts.length));
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  });

  const handleProfileClick = (userId: string) => {
    const user = socialUsers.find((u) => u.id === userId);
    if (user) router.push(`/u/${user.username}`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-[680px] mx-auto py-4 px-4">
        {/* Stories / Quick Links Bar */}
        <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
          <button className="flex flex-col items-center gap-1 min-w-[72px] p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 transition-colors">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
              <Newspaper className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Feed</span>
          </button>
          <button
            onClick={() => router.push("/u/admin")}
            className="flex flex-col items-center gap-1 min-w-[72px] p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Friends</span>
          </button>
          <button
            onClick={() => router.push("/farm")}
            className="flex flex-col items-center gap-1 min-w-[72px] p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Farm</span>
          </button>
          <button
            onClick={() => router.push("/marketplace")}
            className="flex flex-col items-center gap-1 min-w-[72px] p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Market</span>
          </button>
        </div>

        {/* Post Composer */}
        <div className="mb-4">
          <PostComposer />
        </div>

        {/* Feed Posts */}
        <div className="space-y-4">
          {visiblePosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onProfileClick={handleProfileClick}
            />
          ))}
        </div>

        {/* Infinite Scroll Loader */}
        {hasMore && (
          <div ref={loaderRef} className="py-8 flex justify-center">
            {loading ? (
              <div className="flex items-center gap-2 text-gray-500">
                <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Loading more posts...</span>
              </div>
            ) : (
              <button
                onClick={loadMore}
                className="px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
              >
                Load more
              </button>
            )}
          </div>
        )}

        {!hasMore && visiblePosts.length > 0 && (
          <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            You&apos;re all caught up! 🌿
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
