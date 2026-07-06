"use client";

import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import { useSocialStore } from "@/lib/social-store";
import type { NotificationType } from "@/types/social";

function getNotifIcon(type: NotificationType) {
  switch (type) {
    case "post_like":
      return <Heart className="w-4 h-4 text-red-500" />;
    case "post_comment":
    case "comment_reply":
      return <MessageCircle className="w-4 h-4 text-blue-500" />;
    case "post_share":
      return <Share2 className="w-4 h-4 text-green-500" />;
    case "friend_request":
      return <UserPlus className="w-4 h-4 text-purple-500" />;
    case "friend_accepted":
      return <UserCheck className="w-4 h-4 text-green-500" />;
    case "follow":
      return <Eye className="w-4 h-4 text-blue-500" />;
    case "mention":
      return <AtSign className="w-4 h-4 text-orange-500" />;
    default:
      return <Bell className="w-4 h-4 text-gray-500" />;
  }
}

function getNotifMessage(type: NotificationType, actorName: string): string {
  switch (type) {
    case "post_like":
      return `${actorName} reacted to your post`;
    case "post_comment":
      return `${actorName} commented on your post`;
    case "comment_reply":
      return `${actorName} replied to your comment`;
    case "post_share":
      return `${actorName} shared your post`;
    case "friend_request":
      return `${actorName} sent you a friend request`;
    case "friend_accepted":
      return `${actorName} accepted your friend request`;
    case "follow":
      return `${actorName} started following you`;
    case "mention":
      return `${actorName} mentioned you in a post`;
    default:
      return `${actorName} interacted with you`;
  }
}

function timeAgo(date: string): string {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString();
}

export default function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useSocialStore();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-[360px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllNotificationsRead()}
                  className="text-xs text-green-600 hover:underline font-medium"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => { router.push("/notifications"); setOpen(false); }}
                className="text-xs text-gray-500 hover:underline"
              >
                See all
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.slice(0, 8).map((notif) => (
              <button
                key={notif.id}
                onClick={() => {
                  markNotificationRead(notif.id);
                  setOpen(false);
                }}
                className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left ${
                  !notif.read ? "bg-green-50/50 dark:bg-green-900/10" : ""
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={notif.actor?.avatar_url || ""}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-0.5">
                    {getNotifIcon(notif.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    <span className="font-semibold">{notif.actor?.full_name}</span>{" "}
                    {getNotifMessage(notif.type, "").replace(" ", "")}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{timeAgo(notif.created_at)}</p>
                </div>
                {!notif.read && (
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full flex-shrink-0 mt-2" />
                )}
              </button>
            ))}
          </div>

          {/* Footer */}
          <button
            onClick={() => { router.push("/notifications"); setOpen(false); }}
            className="w-full py-3 text-center text-sm font-medium text-green-600 hover:bg-gray-50 dark:hover:bg-gray-700 border-t border-gray-100 dark:border-gray-700"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
}
