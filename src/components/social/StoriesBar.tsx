"use client";

import { useState } from "react";
import { socialUsers } from "@/lib/social-mock-data";
import { getStoryGroups } from "@/lib/messaging-mock-data";
import { useMessagingStore } from "@/lib/messaging-store";
import { Plus, X, ChevronLeft, ChevronRight, Eye } from "lucide-react";

const CURRENT_USER_ID = "user-001";

export function StoriesBar() {
  const { stories, viewStory, addStory } = useMessagingStore();
  const [viewingStory, setViewingStory] = useState<{ userId: string; index: number } | null>(null);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [storyText, setStoryText] = useState("");
  const [storyBgColor, setStoryBgColor] = useState("#16a34a");

  const storyGroups = getStoryGroups(CURRENT_USER_ID);
  const currentUser = socialUsers.find((u) => u.id === CURRENT_USER_ID);

  const currentViewingGroup = viewingStory
    ? storyGroups.find((g) => g.user.id === viewingStory.userId)
    : null;
  const currentStory = currentViewingGroup?.stories[viewingStory?.index || 0];

  const handleCreateStory = () => {
    if (!storyText.trim()) return;
    addStory({
      author_id: CURRENT_USER_ID,
      content: storyText,
      media_url: null,
      media_type: "text",
      background_color: storyBgColor,
      font_style: "bold",
    });
    setStoryText("");
    setShowCreateStory(false);
  };

  const handleViewStory = (userId: string) => {
    const group = storyGroups.find((g) => g.user.id === userId);
    if (!group) return;
    setViewingStory({ userId, index: 0 });
    group.stories.forEach((s) => viewStory(s.id, CURRENT_USER_ID));
  };

  const nextStory = () => {
    if (!viewingStory || !currentViewingGroup) return;
    if (viewingStory.index < currentViewingGroup.stories.length - 1) {
      setViewingStory({ ...viewingStory, index: viewingStory.index + 1 });
    } else {
      const currentGroupIdx = storyGroups.findIndex((g) => g.user.id === viewingStory.userId);
      if (currentGroupIdx < storyGroups.length - 1) {
        const nextGroup = storyGroups[currentGroupIdx + 1];
        setViewingStory({ userId: nextGroup.user.id, index: 0 });
        nextGroup.stories.forEach((s) => viewStory(s.id, CURRENT_USER_ID));
      } else {
        setViewingStory(null);
      }
    }
  };

  const prevStory = () => {
    if (!viewingStory) return;
    if (viewingStory.index > 0) {
      setViewingStory({ ...viewingStory, index: viewingStory.index - 1 });
    }
  };

  const bgColors = ["#16a34a", "#7c3aed", "#dc2626", "#2563eb", "#d97706", "#0d9488", "#ec4899", "#1e293b"];

  return (
    <>
      {/* Stories Bar */}
      <div className="bg-card-bg border border-card-border rounded-xl p-4 mb-4">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {/* Create Story */}
          <button
            onClick={() => setShowCreateStory(true)}
            className="flex-shrink-0 flex flex-col items-center gap-1"
          >
            <div className="relative w-16 h-16 rounded-full bg-hover-bg border-2 border-dashed border-primary/50 flex items-center justify-center">
              {currentUser?.avatar_url ? (
                <>
                  <img src={currentUser.avatar_url} alt="" className="w-full h-full rounded-full object-cover opacity-60" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Plus className="w-5 h-5 text-primary" />
                  </div>
                </>
              ) : (
                <Plus className="w-5 h-5 text-primary" />
              )}
            </div>
            <span className="text-[10px] text-muted">Your Story</span>
          </button>

          {/* Story Groups */}
          {storyGroups
            .filter((g) => g.user.id !== CURRENT_USER_ID)
            .map((group) => (
              <button
                key={group.user.id}
                onClick={() => handleViewStory(group.user.id)}
                className="flex-shrink-0 flex flex-col items-center gap-1"
              >
                <div className={`w-16 h-16 rounded-full p-0.5 ${group.has_unseen ? "bg-gradient-to-br from-primary to-emerald-400" : "bg-muted/30"}`}>
                  <div className="w-full h-full rounded-full border-2 border-card-bg overflow-hidden">
                    {group.user.avatar_url ? (
                      <img src={group.user.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                        {group.user.full_name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-muted truncate max-w-[64px]">
                  {group.user.full_name.split(" ")[0]}
                </span>
              </button>
            ))}
        </div>
      </div>

      {/* Story Viewer Modal */}
      {viewingStory && currentStory && currentViewingGroup && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          {/* Close */}
          <button onClick={() => setViewingStory(null)} className="absolute top-4 right-4 text-white z-10">
            <X className="w-6 h-6" />
          </button>

          {/* Progress bars */}
          <div className="absolute top-2 left-4 right-4 flex gap-1 z-10">
            {currentViewingGroup.stories.map((_, idx) => (
              <div key={idx} className="flex-1 h-0.5 rounded-full bg-white/30 overflow-hidden">
                <div
                  className={`h-full bg-white rounded-full transition-all ${
                    idx < viewingStory.index ? "w-full" : idx === viewingStory.index ? "w-full animate-pulse" : "w-0"
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Author info */}
          <div className="absolute top-6 left-4 flex items-center gap-2 z-10">
            {currentViewingGroup.user.avatar_url ? (
              <img src={currentViewingGroup.user.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover border border-white/50" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                {currentViewingGroup.user.full_name.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-white text-sm font-medium">{currentViewingGroup.user.full_name}</p>
              <p className="text-white/60 text-xs">
                {new Date(currentStory.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>

          {/* Viewers */}
          {currentStory.author_id === CURRENT_USER_ID && (
            <div className="absolute bottom-4 left-4 flex items-center gap-1 text-white/70 z-10">
              <Eye className="w-4 h-4" />
              <span className="text-sm">{currentStory.viewers.length}</span>
            </div>
          )}

          {/* Story Content */}
          <div
            className="w-full max-w-sm h-[80vh] rounded-2xl overflow-hidden flex items-center justify-center relative"
            style={{ backgroundColor: currentStory.background_color }}
          >
            {currentStory.media_url ? (
              <img src={currentStory.media_url} alt="" className="w-full h-full object-cover" />
            ) : null}
            {currentStory.content && (
              <div className={`absolute inset-0 flex items-center justify-center p-8 ${currentStory.media_url ? "bg-black/30" : ""}`}>
                <p className={`text-white text-center text-xl ${currentStory.font_style === "bold" ? "font-bold" : ""}`}>
                  {currentStory.content}
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <button
            onClick={prevStory}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextStory}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Create Story Modal */}
      {showCreateStory && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-card-bg rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-card-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Create Story</h3>
              <button onClick={() => setShowCreateStory(false)} className="text-muted hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview */}
            <div className="p-4">
              <div
                className="w-full h-64 rounded-xl flex items-center justify-center p-6 transition-colors"
                style={{ backgroundColor: storyBgColor }}
              >
                {storyText ? (
                  <p className="text-white text-center text-lg font-bold">{storyText}</p>
                ) : (
                  <p className="text-white/50 text-center">Type your story...</p>
                )}
              </div>

              {/* Color picker */}
              <div className="flex gap-2 mt-4 justify-center">
                {bgColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setStoryBgColor(color)}
                    className={`w-7 h-7 rounded-full transition-transform ${storyBgColor === color ? "scale-125 ring-2 ring-offset-2 ring-primary" : ""}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Text input */}
              <textarea
                placeholder="What's your story today?"
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                className="w-full mt-4 p-3 rounded-xl bg-hover-bg border border-card-border text-foreground text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />

              <button
                onClick={handleCreateStory}
                disabled={!storyText.trim()}
                className="w-full mt-4 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Share Story
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
