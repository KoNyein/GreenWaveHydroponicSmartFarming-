"use client";

import { getSellerReviews, getSellerRating } from "@/lib/phase3-mock-data";
import { socialUsers } from "@/lib/social-mock-data";
import { Star } from "lucide-react";

interface SellerReviewsProps {
  sellerId: string;
}

export function SellerReviews({ sellerId }: SellerReviewsProps) {
  const reviews = getSellerReviews(sellerId);
  const { avg, count } = getSellerRating(sellerId);

  if (count === 0) return null;

  return (
    <div className="mt-4 p-4 bg-card-bg border border-card-border rounded-xl">
      <div className="flex items-center gap-3 mb-3">
        <h3 className="text-sm font-semibold text-foreground">Seller Reviews</h3>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${i < Math.round(avg) ? "text-yellow-500 fill-yellow-500" : "text-gray-300 dark:text-gray-600"}`}
            />
          ))}
          <span className="text-xs text-muted ml-1">{avg} ({count})</span>
        </div>
      </div>

      <div className="space-y-3">
        {reviews.map((review) => {
          const reviewer = socialUsers.find((u) => u.id === review.reviewer_id);
          return (
            <div key={review.id} className="flex gap-3">
              {reviewer?.avatar_url ? (
                <img src={reviewer.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                  {reviewer?.full_name?.charAt(0) || "?"}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{reviewer?.full_name}</span>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300 dark:text-gray-600"}`}
                      />
                    ))}
                  </div>
                </div>
                {review.content && (
                  <p className="text-xs text-muted mt-0.5">{review.content}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
