"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  UserCheck,
  UserX,
  Search,
  Users,
  Clock,
  X,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { socialUsers, socialFriendships } from "@/lib/social-mock-data";
import type { SocialUser } from "@/types/social";

type Tab = "all" | "requests" | "suggestions";

export default function FriendsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [actions, setActions] = useState<Record<string, string>>({});

  const currentUserId = "user-001";

  const friends = socialFriendships
    .filter(
      (f) =>
        f.status === "accepted" &&
        (f.requester_id === currentUserId || f.addressee_id === currentUserId)
    )
    .map((f) => {
      const friendId = f.requester_id === currentUserId ? f.addressee_id : f.requester_id;
      return socialUsers.find((u) => u.id === friendId);
    })
    .filter(Boolean) as SocialUser[];

  const pendingRequests = socialFriendships
    .filter(
      (f) => f.status === "pending" && f.addressee_id === currentUserId
    )
    .map((f) => socialUsers.find((u) => u.id === f.requester_id))
    .filter(Boolean) as SocialUser[];

  const suggestions = socialUsers.filter(
    (u) =>
      u.id !== currentUserId &&
      !friends.some((f) => f.id === u.id) &&
      !pendingRequests.some((r) => r.id === u.id)
  );

  const filteredFriends = friends.filter((f) =>
    f.full_name.toLowerCase().includes(search.toLowerCase()) ||
    f.username.toLowerCase().includes(search.toLowerCase())
  );

  const handleAction = (userId: string, action: string) => {
    setActions((prev) => ({ ...prev, [userId]: action }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-[800px] mx-auto py-4 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-green-600" /> Friends
          </h1>
          {pendingRequests.length > 0 && (
            <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm font-medium">
              {pendingRequests.length} new request{pendingRequests.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {([
            { id: "all", label: `All Friends (${friends.length})` },
            { id: "requests", label: `Requests (${pendingRequests.length})` },
            { id: "suggestions", label: "Suggestions" },
          ] as { id: Tab; label: string }[]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        {activeTab === "all" && (
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search friends..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
            />
          </div>
        )}

        {/* All Friends */}
        {activeTab === "all" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredFriends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <button onClick={() => router.push(`/u/${friend.username}`)}>
                  <img
                    src={friend.avatar_url || ""}
                    alt={friend.full_name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                </button>
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => router.push(`/u/${friend.username}`)}
                    className="font-semibold text-gray-900 dark:text-white hover:underline truncate block"
                  >
                    {friend.full_name}
                  </button>
                  <p className="text-xs text-gray-500">@{friend.username}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{friend.bio}</p>
                </div>
                {actions[friend.id] === "unfriended" ? (
                  <span className="text-xs text-gray-500">Removed</span>
                ) : (
                  <button
                    onClick={() => handleAction(friend.id, "unfriended")}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
                    title="Unfriend"
                  >
                    <UserX className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            {filteredFriends.length === 0 && (
              <div className="col-span-2 text-center py-8 text-gray-500">
                {search ? "No friends match your search" : "No friends yet"}
              </div>
            )}
          </div>
        )}

        {/* Friend Requests */}
        {activeTab === "requests" && (
          <div className="space-y-3">
            {pendingRequests.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <button onClick={() => router.push(`/u/${user.username}`)}>
                  <img
                    src={user.avatar_url || ""}
                    alt={user.full_name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                </button>
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => router.push(`/u/${user.username}`)}
                    className="font-semibold text-gray-900 dark:text-white hover:underline"
                  >
                    {user.full_name}
                  </button>
                  <p className="text-xs text-gray-500 mt-0.5">{user.bio}</p>
                </div>
                {actions[user.id] ? (
                  <span className="text-sm font-medium text-green-600">
                    {actions[user.id] === "accepted" ? "Accepted" : "Declined"}
                  </span>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(user.id, "accepted")}
                      className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                    >
                      <UserCheck className="w-4 h-4" /> Accept
                    </button>
                    <button
                      onClick={() => handleAction(user.id, "declined")}
                      className="flex items-center gap-1.5 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-300"
                    >
                      <X className="w-4 h-4" /> Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
            {pendingRequests.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No pending friend requests</p>
              </div>
            )}
          </div>
        )}

        {/* Suggestions */}
        {activeTab === "suggestions" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {suggestions.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <button onClick={() => router.push(`/u/${user.username}`)}>
                  <img
                    src={user.avatar_url || ""}
                    alt={user.full_name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                </button>
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => router.push(`/u/${user.username}`)}
                    className="font-semibold text-gray-900 dark:text-white hover:underline truncate block"
                  >
                    {user.full_name}
                  </button>
                  <p className="text-xs text-gray-500 truncate">{user.bio}</p>
                </div>
                {actions[user.id] === "requested" ? (
                  <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Sent
                  </span>
                ) : (
                  <button
                    onClick={() => handleAction(user.id, "requested")}
                    className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                  >
                    <UserPlus className="w-4 h-4" /> Add
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
