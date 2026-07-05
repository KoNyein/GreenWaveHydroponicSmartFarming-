"use client";

import { useRouter } from "next/navigation";
import {
  Bell,
  Heart,
  MessageCircle,
  Share2,
  UserPlus,
  UserCheck,
  AtSign,
  Eye,
  CheckCheck,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useSocialStore } from "@/lib/social-store";
import type { NotificationType } from "@/types/social";
import { socialUsers } from "@/lib/social-mock-data";

function getNotifIcon(type: NotificationType) {
  switch (type) {
    case "post_like":
      return <Heart className="w-5 h-5 text-red-500" />;
    case "post_comment":
    case "comment_reply":
      return <MessageCircle className="w-5 h-5 text-blue-500" />;
    case "post_share":
      return <Share2 className="w-5 h-5 text-green-500" />;
    case "friend_request":
      return <UserPlus className="w-5 h-5 text-purple-500" />;
    case "friend_accepted":
      return <UserCheck className="w-5 h-5 text-green-500" />;
    case "follow":
      return <Eye className="w-5 h-5 text-blue-500" />;
    case "mention":
      return <AtSign className="w-5 h-5 text-orange-500" />;
    default:
      return <Bell className="w-5 h-5 text-gray-500" />;
  }
}

function getNotifText(type: NotificationType): string {
  switch (type) {
    case "post_like": return "reacted to your post";
    case "post_comment": return "commented on your post";
    case "comment_reply": return "replied to your comment";
    case "post_share": return "shared your post";
    case "friend_request": return "sent you a friend request";
    case "friend_accepted": return "accepted your friend request";
    case "follow": return "started following you";
    case "mention": return "mentioned you in a post";
    default: return "interacted with you";
  }
}

function timeAgo(date: string): string {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  return d.toLocaleDateString();
}

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useSocialStore();

  const today = notifications.filter((n) => {
    const d = new Date(n.created_at);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });
  const earlier = notifications.filter((n) => {
    const d = new Date(n.created_at);
    const now = new Date();
    return d.toDateString() !== now.toDateString();
  });

  return (
    <DashboardLayout>
      <div className="max-w-[680px] mx-auto py-4 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-green-600" /> Notifications
          </h1>
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
            >
              <CheckCheck className="w-4 h-4" /> Mark all as read
            </button>
          )}
        </div>

        {/* Today */}
        {today.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-1">
              Today
            </h2>
            <div className="space-y-1">
              {today.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => {
                    markNotificationRead(notif.id);
                    if (notif.target_type === "user") {
                      const u = socialUsers.find((x) => x.id === notif.actor_id);
                      if (u) router.push(`/u/${u.username}`);
                    } else {
                      router.push("/feed");
                    }
                  }}
                  className={`w-full flex items-start gap-3 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left ${
                    !notif.read ? "bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800" : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={notif.actor?.avatar_url || ""}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-0.5 shadow-sm">
                      {getNotifIcon(notif.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      <span className="font-semibold">{notif.actor?.full_name}</span>{" "}
                      {getNotifText(notif.type)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{timeAgo(notif.created_at)}</p>
                  </div>
                  {!notif.read && (
                    <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0 mt-2" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Earlier */}
        {earlier.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-1">
              Earlier
            </h2>
            <div className="space-y-1">
              {earlier.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => {
                    markNotificationRead(notif.id);
                    if (notif.target_type === "user") {
                      const u = socialUsers.find((x) => x.id === notif.actor_id);
                      if (u) router.push(`/u/${u.username}`);
                    } else {
                      router.push("/feed");
                    }
                  }}
                  className={`w-full flex items-start gap-3 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left ${
                    !notif.read ? "bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800" : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={notif.actor?.avatar_url || ""}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-0.5 shadow-sm">
                      {getNotifIcon(notif.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      <span className="font-semibold">{notif.actor?.full_name}</span>{" "}
                      {getNotifText(notif.type)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{timeAgo(notif.created_at)}</p>
                  </div>
                  {!notif.read && (
                    <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0 mt-2" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-lg font-medium text-gray-900 dark:text-white">No notifications yet</p>
            <p className="text-sm text-gray-500 mt-1">When someone interacts with your posts, you&apos;ll see it here.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
