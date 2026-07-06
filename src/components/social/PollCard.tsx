"use client";

import { usePhase3Store } from "@/lib/phase3-store";
import { getPollByPostId } from "@/lib/phase3-mock-data";
import { BarChart2, Check, Clock } from "lucide-react";

const CURRENT_USER_ID = "user-001";

interface PollCardProps {
  postId: string;
}

export function PollCard({ postId }: PollCardProps) {
  const { polls, votePoll, removePollVote } = usePhase3Store();
  const poll = polls.find((p) => p.post_id === postId) || getPollByPostId(postId);

  if (!poll) return null;

  const hasVoted = (poll.user_votes || []).length > 0;
  const isExpired = poll.ends_at && new Date(poll.ends_at) < new Date();

  const handleVote = (optionId: string) => {
    if (isExpired) return;
    if (poll.user_votes?.includes(optionId)) {
      removePollVote(poll.id, optionId, CURRENT_USER_ID);
    } else {
      if (!poll.allows_multiple && hasVoted) return;
      votePoll(poll.id, optionId, CURRENT_USER_ID);
    }
  };

  return (
    <div className="mt-3 p-3 bg-hover-bg rounded-xl border border-card-border">
      <div className="flex items-center gap-2 mb-3">
        <BarChart2 className="w-4 h-4 text-primary" />
        <h4 className="text-sm font-semibold text-foreground">{poll.question}</h4>
      </div>

      <div className="space-y-2">
        {poll.options.map((option) => {
          const percentage = poll.total_votes > 0 ? Math.round((option.vote_count / poll.total_votes) * 100) : 0;
          const isSelected = poll.user_votes?.includes(option.id);

          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={isExpired || (!poll.allows_multiple && hasVoted && !isSelected)}
              className={`relative w-full text-left p-2.5 rounded-lg border transition overflow-hidden ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-card-border hover:border-primary/30 bg-card-bg"
              } ${isExpired || (!poll.allows_multiple && hasVoted && !isSelected) ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {/* Progress bar background */}
              {(hasVoted || isExpired) && (
                <div
                  className={`absolute inset-0 rounded-lg ${isSelected ? "bg-primary/10" : "bg-hover-bg"}`}
                  style={{ width: `${percentage}%` }}
                />
              )}
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                  <span className="text-sm text-foreground">{option.text}</span>
                </div>
                {(hasVoted || isExpired) && (
                  <span className="text-xs font-medium text-muted">{percentage}%</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 text-xs text-muted">
        <span>{poll.total_votes} votes</span>
        <div className="flex items-center gap-1">
          {poll.allows_multiple && <span>Multiple choice</span>}
          {poll.ends_at && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {isExpired ? "Ended" : `Ends ${new Date(poll.ends_at).toLocaleDateString()}`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
