"use client";

import { useState } from "react";
import type { ReactionType, PostReaction } from "@/types/database";

const reactionEmojis: Record<ReactionType, string> = {
  like: "👍",
  love: "❤️",
  haha: "😂",
  wow: "😮",
  sad: "😢",
  angry: "😡",
};

const reactionLabels: Record<ReactionType, string> = {
  like: "profile.like",
  love: "profile.love",
  haha: "profile.haha",
  wow: "profile.wow",
  sad: "profile.sad",
  angry: "profile.angry",
};

interface ReactionPickerProps {
  reactions: PostReaction[];
  currentUserId: string;
  tr: (key: string) => string;
}

function groupReactions(reactions: PostReaction[]): Record<ReactionType, number> {
  const counts: Record<string, number> = {};
  for (const r of reactions) {
    counts[r.type] = (counts[r.type] ?? 0) + 1;
  }
  return counts as Record<ReactionType, number>;
}

export default function ReactionPicker({ reactions, currentUserId, tr }: ReactionPickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [localReactions, setLocalReactions] = useState<PostReaction[]>(reactions);

  const grouped = groupReactions(localReactions);
  const myReaction = localReactions.find((r) => r.user_id === currentUserId);
  const totalReactions = localReactions.length;

  const handleReact = (type: ReactionType) => {
    if (myReaction?.type === type) {
      setLocalReactions((prev) => prev.filter((r) => r.user_id !== currentUserId));
    } else {
      setLocalReactions((prev) => [
        ...prev.filter((r) => r.user_id !== currentUserId),
        { user_id: currentUserId, user_name: "You", type },
      ]);
    }
    setShowPicker(false);
  };

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setShowPicker(true)}
        onMouseLeave={() => setShowPicker(false)}
        onClick={() => handleReact(myReaction?.type ?? "like")}
        className={`flex items-center gap-1.5 text-sm transition ${
          myReaction ? "text-blue-500 font-medium" : "text-muted hover:text-blue-500"
        }`}
      >
        <span className="text-base">{myReaction ? reactionEmojis[myReaction.type] : "👍"}</span>
        <span className="flex items-center gap-1">
          {totalReactions > 0 && (
            <span className="flex -space-x-0.5">
              {Object.entries(grouped)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([type]) => (
                  <span key={type} className="text-xs">{reactionEmojis[type as ReactionType]}</span>
                ))}
            </span>
          )}
          {totalReactions > 0 && <span>{totalReactions}</span>}
          {!myReaction && totalReactions === 0 && tr("profile.like")}
        </span>
      </button>

      {showPicker && (
        <div
          onMouseEnter={() => setShowPicker(true)}
          onMouseLeave={() => setShowPicker(false)}
          className="absolute bottom-full left-0 mb-2 flex gap-1 bg-card-bg border border-card-border rounded-full shadow-lg px-2 py-1.5 z-50"
        >
          {(Object.keys(reactionEmojis) as ReactionType[]).map((type) => (
            <button
              key={type}
              onClick={() => handleReact(type)}
              className={`text-xl hover:scale-125 transition-transform p-1 rounded-full ${
                myReaction?.type === type ? "bg-blue-100 dark:bg-blue-900/30" : ""
              }`}
              title={tr(reactionLabels[type])}
            >
              {reactionEmojis[type]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
