"use client";

import { useState } from "react";
import type { WallPost } from "@/types/database";
import { Card } from "@/components/ui/Card";
import ReactionPicker from "./ReactionPicker";
import Link from "next/link";
import { MessageCircle, Share2, MapPin, Globe, Lock, X } from "lucide-react";

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  manager: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  staff: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  member: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
};

interface WallPostCardProps {
  post: WallPost;
  currentUserId: string;
  tr: (key: string) => string;
  formatDateTime: (date: string) => string;
}

export default function WallPostCard({ post, currentUserId, tr, formatDateTime }: WallPostCardProps) {
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);

  const photoCount = post.photos.length;

  return (
    <>
      <Card>
        <div className="flex gap-3">
          <Link href={`/profile/${post.author_id}`}>
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold flex-shrink-0">
              {post.author_name.charAt(0)}
            </div>
          </Link>
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 flex-wrap">
              <Link href={`/profile/${post.author_id}`} className="font-medium text-sm hover:underline">
                {post.author_name}
              </Link>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${roleColors[post.author_role]}`}>
                {post.author_role}
              </span>
              {post.visibility === "friends" ? (
                <span className="flex items-center gap-0.5 text-[10px] text-orange-600 dark:text-orange-400">
                  <Lock className="w-3 h-3" /> {tr("profile.friendsOnlyPost")}
                </span>
              ) : (
                <span className="flex items-center gap-0.5 text-[10px] text-blue-500">
                  <Globe className="w-3 h-3" /> {tr("profile.publicPost")}
                </span>
              )}
              <span className="text-xs text-muted">{formatDateTime(post.created_at)}</span>
            </div>

            {/* Location */}
            {post.location && (
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-red-500" />
                <a
                  href={`https://www.google.com/maps?q=${post.location.lat},${post.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline"
                >
                  {tr("profile.locationOn")} {post.location.name}
                </a>
              </div>
            )}

            {/* Content */}
            <p className="text-sm mt-2 leading-relaxed">{post.content}</p>

            {/* Photos */}
            {photoCount > 0 && (
              <div className={`mt-3 gap-1.5 rounded-xl overflow-hidden ${
                photoCount === 1 ? "grid grid-cols-1" :
                photoCount === 2 ? "grid grid-cols-2" :
                photoCount === 3 ? "grid grid-cols-2" :
                "grid grid-cols-2"
              }`}>
                {post.photos.slice(0, 4).map((photo, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxPhoto(photo)}
                    className={`relative overflow-hidden rounded-lg ${
                      photoCount === 1 ? "aspect-video" :
                      photoCount === 3 && i === 0 ? "row-span-2 aspect-square" :
                      "aspect-square"
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`Post photo ${i + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {i === 3 && photoCount > 4 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-2xl font-bold">
                        +{photoCount - 4}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-6 mt-4 pt-3 border-t border-card-border">
              <ReactionPicker
                reactions={post.reactions}
                currentUserId={currentUserId}
                tr={tr}
              />
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

      {/* Photo Lightbox */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxPhoto(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition"
            onClick={() => setLightboxPhoto(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxPhoto}
            alt={tr("profile.photoPreview")}
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
