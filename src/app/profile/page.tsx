"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatDateTime } from "@/lib/utils";
import { useAuthStore, useSettingsStore } from "@/lib/store";
import { t } from "@/lib/translations";
import { mockWallPosts, mockSubscriptions, mockMemberProfiles } from "@/lib/mock-data";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Link2,
  Heart,
  MessageCircle,
  Share2,
  Send,
  Edit,
  Crown,
  Clock,
} from "lucide-react";

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  manager: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  staff: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  member: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
};

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { locale } = useSettingsStore();
  const tr = (key: string) => t(key, locale);
  const [activeTab, setActiveTab] = useState<"wall" | "about">("wall");
  const [newPost, setNewPost] = useState("");

  const profile = user ?? mockMemberProfiles[0];
  const wallPosts = mockWallPosts.filter(
    (p) => p.wall_owner_id === profile.id || p.author_id === profile.id
  );
  const subscription = mockSubscriptions.find((s) => s.user_id === profile.id);

  const trialDaysRemaining = subscription
    ? Math.max(0, Math.ceil((new Date(subscription.trial_end).getTime() - Date.now()) / 86400000))
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white/30">
              {profile.full_name.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{profile.full_name}</h1>
              <p className="text-green-100 text-sm mt-1">{profile.email}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${roleColors[profile.role]}`}>
                  {profile.role}
                </span>
                <StatusBadge status={profile.is_active ? "active" : "inactive"} />
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition text-sm font-medium">
              <Edit className="w-4 h-4" /> {tr("profile.editProfile")}
            </button>
          </div>

          <div className="relative flex gap-8 mt-6 pt-4 border-t border-white/20">
            <div className="text-center">
              <p className="text-2xl font-bold">{wallPosts.length}</p>
              <p className="text-xs text-green-100">{tr("profile.posts")}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">128</p>
              <p className="text-xs text-green-100">{tr("profile.followers")}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">64</p>
              <p className="text-xs text-green-100">{tr("profile.following")}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: About + Subscription */}
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

            {/* Subscription Card */}
            {subscription && (
              <Card>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-yellow-500" />
                  {tr("profile.subscription")}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">{tr("profile.plan")}</span>
                    <span className="text-sm font-medium capitalize">
                      {subscription.plan === "free_trial" ? tr("trial.freeTrial") : subscription.plan}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">{tr("profile.status")}</span>
                    <StatusBadge status={subscription.status} />
                  </div>
                  {subscription.plan === "free_trial" && subscription.status === "active" && (
                    <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      <span className="text-sm text-yellow-700 dark:text-yellow-400">
                        {trialDaysRemaining} {tr("trial.daysRemaining")}
                      </span>
                    </div>
                  )}
                  <Link
                    href="/subscription"
                    className="block w-full text-center py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition mt-2"
                  >
                    {subscription.plan === "free_trial" ? tr("trial.upgradePlan") : tr("trial.currentPlan")}
                  </Link>
                </div>
              </Card>
            )}

            {/* Browse Members */}
            <Card>
              <h3 className="font-semibold mb-4">{tr("profile.allMembers")}</h3>
              <div className="space-y-2">
                {mockMemberProfiles.filter((m) => m.id !== profile.id).slice(0, 5).map((member) => (
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

          {/* Right: Wall/Feed */}
          <div className="lg:col-span-2 space-y-4">
            {/* Tabs */}
            <div className="flex gap-1 bg-card-bg border border-card-border rounded-lg p-1">
              {(["wall", "about"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition ${
                    activeTab === tab
                      ? "bg-primary text-white"
                      : "text-muted hover:bg-hover-bg"
                  }`}
                >
                  {tr(`profile.${tab}`)}
                </button>
              ))}
            </div>

            {activeTab === "wall" && (
              <>
                {/* New Post Input */}
                <Card>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold flex-shrink-0">
                      {profile.full_name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder={tr("profile.writePost")}
                        className="w-full p-3 border border-input-border bg-input-bg rounded-lg text-sm resize-none outline-none focus:ring-2 focus:ring-primary"
                        rows={3}
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
              </>
            )}

            {activeTab === "about" && (
              <Card>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">{tr("profile.about")}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <p className="text-xs text-muted mb-1">{tr("profile.email")}</p>
                        <p className="text-sm font-medium">{profile.email}</p>
                      </div>
                      {profile.phone && (
                        <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                          <p className="text-xs text-muted mb-1">{tr("profile.phone")}</p>
                          <p className="text-sm font-medium">{profile.phone}</p>
                        </div>
                      )}
                      <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <p className="text-xs text-muted mb-1">{tr("profile.role")}</p>
                        <p className="text-sm font-medium capitalize">{profile.role}</p>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <p className="text-xs text-muted mb-1">{tr("profile.memberSince")}</p>
                        <p className="text-sm font-medium">{formatDate(profile.created_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
