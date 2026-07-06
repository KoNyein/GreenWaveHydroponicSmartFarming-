"use client";

import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { mockHashtags } from "@/lib/phase3-mock-data";
import { socialPosts } from "@/lib/social-mock-data";
import PostCard from "@/components/social/PostCard";
import { Hash, TrendingUp, ArrowLeft } from "lucide-react";

export default function HashtagPage() {
  const params = useParams();
  const router = useRouter();
  const tag = (params.tag as string).toLowerCase();

  const hashtag = mockHashtags.find((h) => h.name.toLowerCase() === tag);

  // Filter posts that contain this hashtag (search in content)
  const taggedPosts = socialPosts.filter(
    (p) => p.content.toLowerCase().includes(`#${tag}`) || p.content.toLowerCase().includes(tag)
  );

  // Related hashtags
  const relatedTags = mockHashtags
    .filter((h) => h.name.toLowerCase() !== tag)
    .slice(0, 5);

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-hover-bg transition"
          >
            <ArrowLeft className="w-5 h-5 text-muted" />
          </button>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <Hash className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">#{tag}</h1>
            <p className="text-sm text-muted">
              {hashtag ? `${hashtag.post_count} posts` : `${taggedPosts.length} posts`}
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Posts */}
          <div className="flex-1">
            {taggedPosts.length > 0 ? (
              <div className="space-y-4">
                {taggedPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onProfileClick={(userId) => {
                      router.push(`/u/${userId}`);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-card-bg border border-card-border rounded-xl p-8 text-center">
                <Hash className="w-12 h-12 mx-auto mb-3 text-muted opacity-30" />
                <p className="text-muted">No posts with #{tag} yet</p>
                <p className="text-xs text-muted mt-1">Be the first to post with this hashtag!</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-card-bg border border-card-border rounded-xl p-4 sticky top-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-primary" />
                Related Tags
              </h3>
              <div className="space-y-2">
                {relatedTags.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => router.push(`/hashtag/${t.name}`)}
                    className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-hover-bg transition"
                  >
                    <span className="text-sm text-foreground">#{t.name}</span>
                    <span className="text-xs text-muted">{t.post_count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
