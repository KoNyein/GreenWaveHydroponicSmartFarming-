"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatDateTime } from "@/lib/utils";
import { useAuthStore, useSettingsStore } from "@/lib/store";
import { t } from "@/lib/translations";
import { mockWallPosts, mockMemberProfiles, mockFriendships, areFriends, getVisiblePosts } from "@/lib/mock-data";
import PostComposer from "@/components/social/PostComposer";
import WallPostCard from "@/components/social/WallPostCard";
import Link from "next/link";
import {
  Mail,
  Phone,
  Calendar,
  Shield,
  Link2,
  UserPlus,
  UserMinus,
  Clock3,
  AlertCircle,
} from "lucide-react";

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  manager: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  staff: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  member: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
};

export default function MemberProfilePage() {
  const params = useParams();
  const { user } = useAuthStore();
  const { locale } = useSettingsStore();
  const tr = (key: string) => t(key, locale);

  const memberId = params.id as string;
  const currentUser = user ?? mockMemberProfiles[0];
  const profile = mockMemberProfiles.find((m) => m.id === memberId);

  const isFriend = areFriends(currentUser.id, memberId);
  const pendingRequest = mockFriendships.find(
    (f) =>
      f.status === "pending" &&
      ((f.user_id === currentUser.id && f.friend_id === memberId) ||
        (f.user_id === memberId && f.friend_id === currentUser.id))
  );
  const isOwnProfile = currentUser.id === memberId;

  const allWallPosts = mockWallPosts.filter((p) => p.wall_owner_id === memberId);
  const wallPosts = getVisiblePosts(allWallPosts, currentUser.id, memberId);

  const [friendStatus, setFriendStatus] = useState<"none" | "pending" | "friends">(
    isFriend ? "friends" : pendingRequest ? "pending" : "none"
  );

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted">{tr("common.noData")}</p>
        </div>
      </DashboardLayout>
    );
  }

  const handleFriendAction = () => {
    if (friendStatus === "none") setFriendStatus("pending");
    else if (friendStatus === "friends") setFriendStatus("none");
    else if (friendStatus === "pending") setFriendStatus("none");
  };

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
                {friendStatus === "friends" && (
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-200 text-xs rounded-full">
                    {tr("profile.friends")}
                  </span>
                )}
              </div>
            </div>
            {!isOwnProfile && (
              <button
                onClick={handleFriendAction}
                className={`flex items-center gap-2 px-4 py-2 backdrop-blur rounded-lg transition text-sm font-medium ${
                  friendStatus === "friends"
                    ? "bg-red-500/20 hover:bg-red-500/30 text-red-100"
                    : friendStatus === "pending"
                    ? "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-100"
                    : "bg-white/20 hover:bg-white/30"
                }`}
              >
                {friendStatus === "friends" && <><UserMinus className="w-4 h-4" /> {tr("profile.removeFriend")}</>}
                {friendStatus === "pending" && <><Clock3 className="w-4 h-4" /> {tr("profile.pendingFriend")}</>}
                {friendStatus === "none" && <><UserPlus className="w-4 h-4" /> {tr("profile.addFriend")}</>}
              </button>
            )}
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
            {/* Not friends notice */}
            {!isFriend && !isOwnProfile && (
              <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  {tr("profile.notFriendsNotice")}
                </p>
              </div>
            )}

            {/* Post composer */}
            <PostComposer />

            {/* Posts */}
            {wallPosts.length === 0 ? (
              <Card>
                <p className="text-center text-muted py-8">{tr("profile.noPostsYet")}</p>
              </Card>
            ) : (
              wallPosts.map((post) => (
                <WallPostCard
                  key={post.id}
                  post={post}
                  currentUserId={currentUser.id}
                  tr={tr}
                  formatDateTime={formatDateTime}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
