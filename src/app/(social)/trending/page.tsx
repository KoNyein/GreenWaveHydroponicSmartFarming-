"use client";

import { useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useSettingsStore } from "@/lib/store";
import { t } from "@/lib/translations";
import { socialPosts, socialUsers, socialReactions, socialComments } from "@/lib/social-mock-data";
import PostCard from "@/components/social/PostCard";
import { useRouter } from "next/navigation";
import { TrendingUp, Flame, Clock, Star } from "lucide-react";

type SortMode = "trending" | "newest" | "top";

export default function TrendingPage() {
  const { locale } = useSettingsStore();
  const tr = (key: string) => t(key, locale);
  const router = useRouter();

  const [sortMode, setSortMode] = useState<SortMode>("trending");
  const [now] = useState(() => Date.now());

  // Calculate engagement score for each post
  const postsWithEngagement = useMemo(() => socialPosts
    .filter((p) => p.visibility === "public")
    .map((post) => {
      const author = socialUsers.find((u) => u.id === post.author_id);
      const reactionCount = socialReactions.filter((r) => r.target_id === post.id).length;
      const commentCount = socialComments.filter((c) => c.post_id === post.id).length;
      const shareCount = post.shares_count || 0;

      // Engagement score: reactions * 1 + comments * 3 + shares * 5
      const engagementScore = reactionCount * 1 + commentCount * 3 + shareCount * 5;

      // Recency bonus (within 24h gets 2x multiplier)
      const hoursSincePost = (now - new Date(post.created_at).getTime()) / (1000 * 60 * 60);
      const recencyMultiplier = hoursSincePost < 24 ? 2 : hoursSincePost < 72 ? 1.5 : 1;

      const trendingScore = engagementScore * recencyMultiplier;

      return {
        ...post,
        author,
        reactionCount,
        commentCount,
        shareCount,
        engagementScore,
        trendingScore,
      };
    }), [now]);

  const sortedPosts = [...postsWithEngagement].sort((a, b) => {
    if (sortMode === "trending") return b.trendingScore - a.trendingScore;
    if (sortMode === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    return b.engagementScore - a.engagementScore;
  });

  const sortOptions = [
    { id: "trending" as SortMode, label: "Trending", icon: Flame },
    { id: "newest" as SortMode, label: "Newest", icon: Clock },
    { id: "top" as SortMode, label: "Top", icon: Star },
  ];

  // Trending topics from post content
  const trendingTopics = [
    { tag: "hydroponics", count: 12, trend: "+24%" },
    { tag: "LED_grow", count: 8, trend: "+18%" },
    { tag: "organic", count: 7, trend: "+15%" },
    { tag: "harvest", count: 6, trend: "+12%" },
    { tag: "DWC_system", count: 5, trend: "+10%" },
    { tag: "pH_balance", count: 4, trend: "+8%" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Trending</h1>
            <p className="text-sm text-muted">Popular posts and topics in the community</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Tabs */}
            <div className="flex gap-2 mb-6">
              {sortOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSortMode(opt.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    sortMode === opt.id
                      ? "bg-primary text-white"
                      : "bg-card-bg border border-card-border text-muted hover:text-foreground hover:border-primary/30"
                  }`}
                >
                  <opt.icon className="w-4 h-4" />
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {sortedPosts.slice(0, 15).map((post, idx) => (
                <div key={post.id} className="relative">
                  {/* Rank badge */}
                  {sortMode === "trending" && idx < 3 && (
                    <div className={`absolute -left-2 -top-2 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold z-10 ${
                      idx === 0 ? "bg-yellow-500" : idx === 1 ? "bg-gray-400" : "bg-amber-700"
                    }`}>
                      #{idx + 1}
                    </div>
                  )}
                  <PostCard
                    post={post}
                    onProfileClick={(username) => router.push(`/u/${username}`)}
                  />
                  {/* Engagement stats */}
                  <div className="flex items-center gap-4 px-4 pb-2 -mt-2 text-xs text-muted">
                    <span>{post.reactionCount} reactions</span>
                    <span>{post.commentCount} comments</span>
                    <span>{post.shareCount} shares</span>
                    {sortMode === "trending" && (
                      <span className="text-primary font-medium">
                        Score: {Math.round(post.trendingScore)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar: Trending Topics */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-card-bg border border-card-border rounded-xl p-4 sticky top-4">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                Trending Topics
              </h3>
              <div className="space-y-3">
                {trendingTopics.map((topic, idx) => (
                  <div key={topic.tag} className="flex items-center gap-3">
                    <span className="text-xs text-muted w-4">{idx + 1}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">#{topic.tag}</p>
                      <p className="text-xs text-muted">{topic.count} posts</p>
                    </div>
                    <span className="text-xs text-green-500 font-medium">{topic.trend}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Contributors */}
            <div className="bg-card-bg border border-card-border rounded-xl p-4 mt-4">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                Top Contributors
              </h3>
              <div className="space-y-3">
                {socialUsers.slice(0, 5).map((user, idx) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 cursor-pointer hover:bg-hover-bg rounded-lg p-1.5 -mx-1.5 transition"
                    onClick={() => router.push(`/u/${user.username}`)}
                  >
                    <span className={`text-xs font-bold w-4 ${idx < 3 ? "text-primary" : "text-muted"}`}>
                      {idx + 1}
                    </span>
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                        {user.full_name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{user.full_name}</p>
                      <p className="text-xs text-muted">{user.posts_count} posts</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
