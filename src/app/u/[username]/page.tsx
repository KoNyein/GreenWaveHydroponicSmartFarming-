"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Calendar,
  UserPlus,
  UserCheck,
  UserX,
  Users,
  Heart,
  MessageCircle,
  Image as ImageIcon,
  Grid3X3,
  Clock,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PostCard from "@/components/social/PostCard";
import PostComposer from "@/components/social/PostComposer";
import {
  getUserByUsername,
  getUserPosts,
  socialUsers,
  socialFriendships,
  socialFollows,
  getFriendshipStatus,
  isFriend,
} from "@/lib/social-mock-data";
import { useSocialStore } from "@/lib/social-store";

type Tab = "timeline" | "about" | "friends" | "photos";

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const router = useRouter();
  const { posts } = useSocialStore();
  const [activeTab, setActiveTab] = useState<Tab>("timeline");
  const [friendAction, setFriendAction] = useState<string | null>(null);

  const user = getUserByUsername(username);
  const currentUserId = "user-001";
  const isOwnProfile = user?.id === currentUserId;

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">User Not Found</h1>
            <p className="text-gray-500 dark:text-gray-400">The profile you&apos;re looking for doesn&apos;t exist.</p>
            <button
              onClick={() => router.push("/feed")}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Back to Feed
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const friendship = getFriendshipStatus(currentUserId, user.id);
  const areFriends = isFriend(currentUserId, user.id);
  const userPosts = posts.filter((p) => {
    if (p.author_id !== user.id) return false;
    if (isOwnProfile) return true;
    if (p.visibility === "public") return true;
    if (p.visibility === "friends" && areFriends) return true;
    return false;
  });

  const friends = socialFriendships
    .filter(
      (f) =>
        f.status === "accepted" &&
        (f.requester_id === user.id || f.addressee_id === user.id)
    )
    .map((f) => {
      const friendId = f.requester_id === user.id ? f.addressee_id : f.requester_id;
      return socialUsers.find((u) => u.id === friendId);
    })
    .filter(Boolean);

  const followers = socialFollows.filter((f) => f.following_id === user.id).length;
  const following = socialFollows.filter((f) => f.follower_id === user.id).length;

  const handleFriendAction = () => {
    if (areFriends) setFriendAction("unfriended");
    else if (friendship.status === "pending" && friendship.direction === "sent") setFriendAction("cancelled");
    else if (friendship.status === "pending" && friendship.direction === "received") setFriendAction("accepted");
    else setFriendAction("requested");
  };

  const renderFriendButton = () => {
    if (isOwnProfile) return null;
    if (friendAction === "requested" || (friendship.status === "pending" && friendship.direction === "sent" && !friendAction)) {
      return (
        <button
          onClick={handleFriendAction}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm"
        >
          <Clock className="w-4 h-4" /> Request Sent
        </button>
      );
    }
    if (friendAction === "accepted" || areFriends) {
      return (
        <button
          onClick={handleFriendAction}
          className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg font-medium text-sm"
        >
          <UserCheck className="w-4 h-4" /> Friends
        </button>
      );
    }
    if (friendship.status === "pending" && friendship.direction === "received") {
      return (
        <button
          onClick={handleFriendAction}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700"
        >
          <UserPlus className="w-4 h-4" /> Accept Request
        </button>
      );
    }
    return (
      <button
        onClick={handleFriendAction}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700"
      >
        <UserPlus className="w-4 h-4" /> Add Friend
      </button>
    );
  };

  const handleProfileClick = (userId: string) => {
    const u = socialUsers.find((x) => x.id === userId);
    if (u) router.push(`/u/${u.username}`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-[900px] mx-auto">
        {/* Cover Photo */}
        <div className="relative h-[200px] sm:h-[300px] rounded-b-xl overflow-hidden">
          <img
            src={user.cover_url || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=400&fit=crop"}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Profile Info Section */}
        <div className="px-4 sm:px-8 pb-4 -mt-16 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            {/* Avatar */}
            <div className="relative">
              <img
                src={user.avatar_url || ""}
                alt={user.full_name}
                className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-900 object-cover shadow-lg"
              />
            </div>

            {/* Name & Stats */}
            <div className="flex-1 sm:pb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.full_name}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">@{user.username}</p>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" /> {friends.length} friends
                </span>
                <span>{followers} followers</span>
                <span>{following} following</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {renderFriendButton()}
              {!isOwnProfile && (
                <button
                  onClick={() => router.push("/messenger")}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <MessageCircle className="w-4 h-4" /> Message
                </button>
              )}
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="mt-3 text-gray-700 dark:text-gray-300 text-sm max-w-xl">
              {user.bio}
            </p>
          )}
          {user.location && (
            <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="w-4 h-4" /> {user.location}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-4 sm:px-8 mt-2">
          <nav className="flex gap-1 -mb-px">
            {([
              { id: "timeline", label: "Timeline", icon: <Calendar className="w-4 h-4" /> },
              { id: "about", label: "About", icon: <Heart className="w-4 h-4" /> },
              { id: "friends", label: "Friends", icon: <Users className="w-4 h-4" /> },
              { id: "photos", label: "Photos", icon: <ImageIcon className="w-4 h-4" /> },
            ] as { id: Tab; label: string; icon: React.ReactNode }[]).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-green-600 text-green-600 dark:text-green-400"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="px-4 sm:px-8 py-4">
          {activeTab === "timeline" && (
            <div className="max-w-[580px] mx-auto space-y-4">
              {isOwnProfile && <PostComposer />}
              {userPosts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">No posts yet</p>
                </div>
              ) : (
                userPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onProfileClick={handleProfileClick}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === "about" && (
            <div className="max-w-[580px] mx-auto space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">About</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Heart className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{user.bio || "No bio yet"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{user.location || "Location not set"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">Joined January 2025</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{friends.length} friends · {followers} followers · {following} following</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "friends" && (
            <div className="max-w-[580px] mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
                  Friends · {friends.length}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {friends.map((friend) => friend && (
                    <button
                      key={friend.id}
                      onClick={() => router.push(`/u/${friend.username}`)}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <img
                        src={friend.avatar_url || ""}
                        alt={friend.full_name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white text-center">
                        {friend.full_name}
                      </span>
                      <span className="text-xs text-gray-500">@{friend.username}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "photos" && (
            <div className="max-w-[580px] mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Photos</h2>
                <div className="grid grid-cols-3 gap-2">
                  {userPosts
                    .filter((p) => p.media && p.media.length > 0)
                    .flatMap((p) => p.media || [])
                    .map((media) => (
                      <div key={media.id} className="aspect-square rounded-lg overflow-hidden">
                        <img src={media.url} alt="" className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer" />
                      </div>
                    ))}
                  {userPosts.filter((p) => p.media && p.media.length > 0).length === 0 && (
                    <div className="col-span-3 text-center py-8 text-gray-500">
                      <Grid3X3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No photos yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
