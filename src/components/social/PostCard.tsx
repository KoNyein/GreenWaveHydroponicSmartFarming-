"use client";

import { useState } from "react";
import {
  ThumbsUp,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Globe,
  Users,
  Lock,
  Send,
  Trash2,
  MapPin,
  ChevronDown,
  ChevronUp,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import type { Post, Comment, ReactionType } from "@/types/social";
import { getUserById, getPostComments } from "@/lib/social-mock-data";
import { useSocialStore } from "@/lib/social-store";
import { useMessagingStore } from "@/lib/messaging-store";

const REACTIONS: { type: ReactionType; emoji: string; label: string }[] = [
  { type: "like", emoji: "👍", label: "Like" },
  { type: "love", emoji: "❤️", label: "Love" },
  { type: "haha", emoji: "😂", label: "Haha" },
  { type: "wow", emoji: "😮", label: "Wow" },
  { type: "sad", emoji: "😢", label: "Sad" },
  { type: "angry", emoji: "😡", label: "Angry" },
];

function getReactionEmoji(type: ReactionType): string {
  return REACTIONS.find((r) => r.type === type)?.emoji || "👍";
}

function timeAgo(date: string): string {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return d.toLocaleDateString();
}

function VisibilityIcon({ visibility }: { visibility: string }) {
  switch (visibility) {
    case "public":
      return <Globe className="w-3 h-3" />;
    case "friends":
      return <Users className="w-3 h-3" />;
    case "only_me":
      return <Lock className="w-3 h-3" />;
    default:
      return <Globe className="w-3 h-3" />;
  }
}

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  onProfileClick?: (userId: string) => void;
}

export default function PostCard({ post, currentUserId = "user-001", onProfileClick }: PostCardProps) {
  const [showReactions, setShowReactions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [comments] = useState<Comment[]>(() => getPostComments(post.id));
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  const { toggleReaction, addComment, deletePost, sharePost } = useSocialStore();
  const { toggleBookmark, isBookmarked } = useMessagingStore();
  const author = post.author || getUserById(post.author_id);
  const bookmarked = isBookmarked(currentUserId, post.id);

  const handleReaction = (type: ReactionType) => {
    toggleReaction("post", post.id, type);
    setShowReactions(false);
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    addComment(post.id, commentText.trim(), replyTo || undefined);
    setCommentText("");
    setReplyTo(null);
  };

  const handleShare = () => {
    sharePost(post.id, "");
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) next.delete(commentId);
      else next.add(commentId);
      return next;
    });
  };

  const topReactions = Object.entries(post.reactions_summary || {})
    .filter(([key, val]) => key !== "total" && (val as number) > 0)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 3);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Author Header */}
      <div className="p-4 flex items-start gap-3">
        <button
          onClick={() => onProfileClick?.(post.author_id)}
          className="flex-shrink-0"
        >
          <img
            src={author?.avatar_url || "/placeholder-avatar.png"}
            alt={author?.full_name || "User"}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-green-100 dark:ring-green-900"
          />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onProfileClick?.(post.author_id)}
              className="font-semibold text-gray-900 dark:text-white hover:underline truncate"
            >
              {author?.full_name}
            </button>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <span>{timeAgo(post.created_at)}</span>
            <span>·</span>
            <VisibilityIcon visibility={post.visibility} />
          </div>
        </div>
        {/* Menu */}
        {post.author_id === currentUserId && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-500" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 py-1 w-40">
                <button
                  onClick={() => { deletePost(post.id); setShowMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" /> Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap text-[15px] leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Media Grid */}
      {post.media && post.media.length > 0 && (
        <div className={`grid gap-0.5 ${
          post.media.length === 1 ? "grid-cols-1" :
          post.media.length === 2 ? "grid-cols-2" :
          post.media.length === 3 ? "grid-cols-2" :
          "grid-cols-2"
        }`}>
          {post.media.slice(0, 4).map((media, idx) => (
            <div
              key={media.id}
              className={`relative overflow-hidden ${
                post.media!.length === 3 && idx === 0 ? "col-span-2" : ""
              } ${post.media!.length === 1 ? "max-h-[500px]" : "aspect-square"}`}
            >
              <img
                src={media.url}
                alt=""
                className="w-full h-full object-cover"
              />
              {idx === 3 && post.media!.length > 4 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">+{post.media!.length - 4}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reaction & Comment Counts */}
      {(post.likes_count > 0 || post.comments_count > 0 || post.shares_count > 0) && (
        <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-1">
            {topReactions.length > 0 && (
              <span className="flex -space-x-0.5">
                {topReactions.map(([type]) => (
                  <span key={type} className="text-sm">{getReactionEmoji(type as ReactionType)}</span>
                ))}
              </span>
            )}
            {post.likes_count > 0 && <span>{post.likes_count}</span>}
          </div>
          <div className="flex gap-3">
            {post.comments_count > 0 && (
              <button onClick={() => setShowComments(!showComments)} className="hover:underline">
                {post.comments_count} comments
              </button>
            )}
            {post.shares_count > 0 && <span>{post.shares_count} shares</span>}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-2 py-1 flex border-b border-gray-100 dark:border-gray-700">
        <div
          className="relative flex-1"
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
        >
          <button
            onClick={() => handleReaction("like")}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium ${
              post.user_reaction
                ? "text-green-600 dark:text-green-400"
                : "text-gray-600 dark:text-gray-300"
            }`}
          >
            {post.user_reaction ? (
              <span className="text-lg">{getReactionEmoji(post.user_reaction)}</span>
            ) : (
              <ThumbsUp className="w-5 h-5" />
            )}
            <span>{post.user_reaction ? REACTIONS.find((r) => r.type === post.user_reaction)?.label : "Like"}</span>
          </button>
          {/* Reaction Picker */}
          {showReactions && (
            <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg px-2 py-1 flex gap-1 z-20">
              {REACTIONS.map((r) => (
                <button
                  key={r.type}
                  onClick={() => handleReaction(r.type)}
                  className="text-2xl hover:scale-125 transition-transform p-1"
                  title={r.label}
                >
                  {r.emoji}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Comment</span>
        </button>
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300"
        >
          <Share2 className="w-5 h-5" />
          <span>Share</span>
        </button>
        <button
          onClick={() => toggleBookmark(currentUserId, post.id)}
          className={`flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition ${bookmarked ? "text-primary" : "text-gray-600 dark:text-gray-300"}`}
          title={bookmarked ? "Remove from saved" : "Save post"}
        >
          {bookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 py-3 space-y-3">
          {/* Comment Input */}
          <div className="flex gap-2">
            <img
              src={getUserById(currentUserId)?.avatar_url || ""}
              alt=""
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleComment()}
                placeholder={replyTo ? "Write a reply..." : "Write a comment..."}
                className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
              />
              <button
                onClick={handleComment}
                disabled={!commentText.trim()}
                className="p-2 text-green-600 disabled:text-gray-400"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          {replyTo && (
            <button onClick={() => setReplyTo(null)} className="text-xs text-gray-500 ml-10 hover:text-red-500">
              Cancel reply
            </button>
          )}

          {/* Comments List */}
          {comments.map((comment) => (
            <div key={comment.id} className="ml-2">
              <div className="flex gap-2">
                <img
                  src={comment.author?.avatar_url || ""}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-3 py-2">
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">
                      {comment.author?.full_name}
                    </span>
                    <p className="text-sm text-gray-800 dark:text-gray-200">{comment.content}</p>
                  </div>
                  <div className="flex gap-3 mt-1 ml-3 text-xs text-gray-500">
                    <span>{timeAgo(comment.created_at)}</span>
                    <button className="font-semibold hover:underline">Like</button>
                    <button
                      onClick={() => setReplyTo(comment.id)}
                      className="font-semibold hover:underline"
                    >
                      Reply
                    </button>
                    {comment.likes_count > 0 && (
                      <span className="flex items-center gap-0.5">
                        <Heart className="w-3 h-3 fill-red-500 text-red-500" /> {comment.likes_count}
                      </span>
                    )}
                  </div>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-2">
                      {!expandedReplies.has(comment.id) ? (
                        <button
                          onClick={() => toggleReplies(comment.id)}
                          className="flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:underline ml-3"
                        >
                          <ChevronDown className="w-3 h-3" />
                          {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => toggleReplies(comment.id)}
                            className="flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:underline ml-3 mb-2"
                          >
                            <ChevronUp className="w-3 h-3" /> Hide replies
                          </button>
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex gap-2 ml-3 mb-2">
                              <img
                                src={reply.author?.avatar_url || ""}
                                alt=""
                                className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                              />
                              <div>
                                <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-3 py-1.5">
                                  <span className="font-semibold text-xs text-gray-900 dark:text-white">
                                    {reply.author?.full_name}
                                  </span>
                                  <p className="text-xs text-gray-800 dark:text-gray-200">{reply.content}</p>
                                </div>
                                <div className="flex gap-3 mt-0.5 ml-3 text-xs text-gray-500">
                                  <span>{timeAgo(reply.created_at)}</span>
                                  <button className="font-semibold hover:underline">Like</button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
