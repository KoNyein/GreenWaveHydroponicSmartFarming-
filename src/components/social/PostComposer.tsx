"use client";

import { useState, useRef } from "react";
import {
  Image as ImageIcon,
  Video,
  MapPin,
  Globe,
  Users,
  Lock,
  X,
  Smile,
} from "lucide-react";
import type { PostVisibility } from "@/types/social";
import { useSocialStore } from "@/lib/social-store";
import { getUserById } from "@/lib/social-mock-data";

const VISIBILITY_OPTIONS: { value: PostVisibility; label: string; icon: React.ReactNode }[] = [
  { value: "public", label: "Public", icon: <Globe className="w-4 h-4" /> },
  { value: "friends", label: "Friends", icon: <Users className="w-4 h-4" /> },
  { value: "only_me", label: "Only Me", icon: <Lock className="w-4 h-4" /> },
];

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800",
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
  "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=800",
  "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800",
  "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800",
];

interface PostComposerProps {
  currentUserId?: string;
}

export default function PostComposer({ currentUserId = "user-001" }: PostComposerProps) {
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<PostVisibility>("public");
  const [showVisibility, setShowVisibility] = useState(false);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { addPost } = useSocialStore();
  const currentUser = getUserById(currentUserId);

  const handlePost = () => {
    if (!content.trim() && mediaUrls.length === 0) return;
    addPost(content.trim(), visibility, mediaUrls);
    setContent("");
    setMediaUrls([]);
    setIsExpanded(false);
  };

  const handleAddImage = () => {
    if (mediaUrls.length >= 10) return;
    // Simulate file upload with sample images
    const randomImg = SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)];
    setMediaUrls((prev) => [...prev, randomImg]);
  };

  const removeMedia = (index: number) => {
    setMediaUrls((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      {/* Header */}
      <div className="flex gap-3">
        <img
          src={currentUser?.avatar_url || ""}
          alt=""
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1">
          {!isExpanded ? (
            <button
              onClick={() => { setIsExpanded(true); setTimeout(() => textareaRef.current?.focus(), 100); }}
              className="w-full text-left bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              What&apos;s on your mind, {currentUser?.full_name?.split(" ")[0]}?
            </button>
          ) : (
            <div className="space-y-3">
              {/* Visibility Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowVisibility(!showVisibility)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {VISIBILITY_OPTIONS.find((v) => v.value === visibility)?.icon}
                  {VISIBILITY_OPTIONS.find((v) => v.value === visibility)?.label}
                </button>
                {showVisibility && (
                  <div className="absolute top-full mt-1 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 py-1 w-40">
                    {VISIBILITY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setVisibility(opt.value); setShowVisibility(false); }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          visibility === opt.value ? "text-green-600 font-medium" : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {opt.icon} {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`What's on your mind, ${currentUser?.full_name?.split(" ")[0]}?`}
                className="w-full min-h-[120px] resize-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 outline-none text-lg"
                autoFocus
              />

              {/* Media Preview */}
              {mediaUrls.length > 0 && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                  <div className={`grid gap-1 ${
                    mediaUrls.length === 1 ? "grid-cols-1" :
                    mediaUrls.length === 2 ? "grid-cols-2" :
                    "grid-cols-3"
                  }`}>
                    {mediaUrls.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeMedia(idx)}
                          className="absolute top-1 right-1 p-1 bg-gray-900/70 rounded-full text-white hover:bg-gray-900"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{mediaUrls.length}/10 images</p>
                </div>
              )}

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                <div className="flex gap-1">
                  <button
                    onClick={handleAddImage}
                    disabled={mediaUrls.length >= 10}
                    className="p-2 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 disabled:text-gray-400 disabled:hover:bg-transparent"
                    title="Add photo"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600"
                    title="Add video"
                  >
                    <Video className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
                    title="Check in"
                  >
                    <MapPin className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2 rounded-full hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-yellow-600"
                    title="Emoji"
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setIsExpanded(false); setContent(""); setMediaUrls([]); }}
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePost}
                    disabled={!content.trim() && mediaUrls.length === 0}
                    className="px-5 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 rounded-lg transition-colors"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions (collapsed state) */}
      {!isExpanded && (
        <div className="flex mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={() => { setIsExpanded(true); handleAddImage(); }}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium text-green-600"
          >
            <ImageIcon className="w-5 h-5" /> Photo
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium text-blue-600"
          >
            <Video className="w-5 h-5" /> Video
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium text-red-500"
          >
            <MapPin className="w-5 h-5" /> Check in
          </button>
        </div>
      )}
    </div>
  );
}
