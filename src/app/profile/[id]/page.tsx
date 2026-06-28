"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatDateTime } from "@/lib/utils";
import { useSettingsStore } from "@/lib/store";
import { t } from "@/lib/translations";
import { mockWallPosts, mockMemberProfiles } from "@/lib/mock-data";
import Link from "next/link";
import {
  Mail,
  Phone,
  Calendar,
  Shield,
  Link2,
  Heart,
  MessageCircle,
  Share2,
  Send,
  UserPlus,
} from "lucide-react";

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  manager: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  staff: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  member: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
};

export default function MemberProfilePage() {
  const params = useParams();
  const { locale } = useSettingsStore();
  const tr = (key: string) => t(key, locale);
  const [newPost, setNewPost] = useState("");

  const memberId = params.id as string;
  const profile = mockMemberProfiles.find((m) => m.id === memberId);
  const wallPosts = mockWallPosts.filter((p) => p.wall_owner_id === memberId);

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted">{tr("common.noData")}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-500 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white/30">
              {profile.full_name.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{profile.full_name}</h1>
              <p className="text-blue-100 text-sm mt-1">{profile.email}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${roleColors[profile.role]}`}>
                  {profile.role}
                </span>
                <StatusBadge status={profile.is_active ? "active" : "inactive"} />
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition text-sm font-medium">
              <UserPlus className="w-4 h-4" /> {tr("profile.following")}
            </button>
          </div>

          <div className="relative flex gap-8 mt-6 pt-4 border-t border-white/20">
            <div className="text-center">
              <p className="text-2xl font-bold">{wallPosts.length}</p>
              <p className="text-xs text-blue-100">{tr("profile.posts")}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">96</p>
              <p className="text-xs text-blue-100">{tr("profile.followers")}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">45</p>
              <p className="text-xs text-blue-100">{tr("profile.following")}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: About */}
          <div className="space-y-6">
            <Card>
              <h3 className="font-semibold mb-4">{tr("profile.about")}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-muted" />
                  <span>{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-muted" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-4 h-4 text-muted" />
                  <span className="capitalize">{profile.role}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-muted" />
                  <span>{tr("profile.memberSince")} {formatDate(profile.created_at)}</span>
                </div>
                {profile.affiliate_code && (
                  <div className="flex items-center gap-3 text-sm">
                    <Link2 className="w-4 h-4 text-muted" />
                    <span>{tr("profile.affiliateCode")}: <code className="bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs">{profile.affiliate_code}</code></span>
                  </div>
                )}
              </div>
            </Card>

            {/* Other Members */}
            <Card>
              <h3 className="font-semibold mb-4">{tr("profile.allMembers")}</h3>
              <div className="space-y-2">
                {mockMemberProfiles.filter((m) => m.id !== memberId).slice(0, 5).map((member) => (
                  <Link
                    key={member.id}
                    href={`/profile/${member.id}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-bold">
                      {member.full_name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{member.full_name}</p>
                      <p className="text-xs text-muted capitalize">{member.role}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          </div>

          {/* Right: Wall */}
          <div className="lg:col-span-2 space-y-4">
            {/* Write on their wall */}
            <Card>
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold flex-shrink-0">
                  Y
                </div>
                <div className="flex-1">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder={`${tr("profile.writePost")}`}
                    className="w-full p-3 border border-input-border bg-input-bg rounded-lg text-sm resize-none outline-none focus:ring-2 focus:ring-primary"
                    rows={2}
                  />
                  <div className="flex justify-end mt-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition">
                      <Send className="w-4 h-4" /> {tr("profile.post")}
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Posts */}
            {wallPosts.length === 0 ? (
              <Card>
                <p className="text-center text-muted py-8">{tr("profile.noPostsYet")}</p>
              </Card>
            ) : (
              wallPosts.map((post) => (
                <Card key={post.id}>
                  <div className="flex gap-3">
                    <Link href={`/profile/${post.author_id}`}>
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold flex-shrink-0">
                        {post.author_name.charAt(0)}
                      </div>
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Link href={`/profile/${post.author_id}`} className="font-medium text-sm hover:underline">
                          {post.author_name}
                        </Link>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${roleColors[post.author_role]}`}>
                          {post.author_role}
                        </span>
                        <span className="text-xs text-muted">{formatDateTime(post.created_at)}</span>
                      </div>
                      <p className="text-sm mt-2 leading-relaxed">{post.content}</p>
                      <div className="flex items-center gap-6 mt-4 pt-3 border-t border-card-border">
                        <button className="flex items-center gap-1.5 text-sm text-muted hover:text-red-500 transition">
                          <Heart className="w-4 h-4" /> {post.likes} {tr("profile.like")}
                        </button>
                        <button className="flex items-center gap-1.5 text-sm text-muted hover:text-blue-500 transition">
                          <MessageCircle className="w-4 h-4" /> {post.comments_count} {tr("profile.comment")}
                        </button>
                        <button className="flex items-center gap-1.5 text-sm text-muted hover:text-green-500 transition">
                          <Share2 className="w-4 h-4" /> {tr("profile.share")}
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
