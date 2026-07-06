"use client";

import { usePhase3Store } from "@/lib/phase3-store";
import { socialUsers } from "@/lib/social-mock-data";
import { DollarSign, Check, X, ArrowLeftRight, Clock } from "lucide-react";
import type { Offer, OfferStatus } from "@/types/phase3";

const CURRENT_USER_ID = "user-001";

const STATUS_STYLES: Record<OfferStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30" },
  accepted: { label: "Accepted", color: "text-green-600 bg-green-100 dark:bg-green-900/30" },
  declined: { label: "Declined", color: "text-red-600 bg-red-100 dark:bg-red-900/30" },
  countered: { label: "Countered", color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
  expired: { label: "Expired", color: "text-gray-600 bg-gray-100 dark:bg-gray-900/30" },
};

interface OfferCardProps {
  offer: Offer;
}

export function OfferCard({ offer }: OfferCardProps) {
  const { respondToOffer } = usePhase3Store();
  const isSeller = offer.seller_id === CURRENT_USER_ID;
  const isBuyer = offer.buyer_id === CURRENT_USER_ID;
  const otherUser = socialUsers.find((u) => u.id === (isSeller ? offer.buyer_id : offer.seller_id));
  const statusInfo = STATUS_STYLES[offer.status];

  return (
    <div className="bg-card-bg border border-card-border rounded-xl p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {otherUser?.avatar_url ? (
            <img src={otherUser.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              {otherUser?.full_name?.charAt(0) || "?"}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-foreground">{otherUser?.full_name}</p>
            <p className="text-xs text-muted">{isSeller ? "Buyer" : "Seller"}</p>
          </div>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded ${statusInfo.color}`}>
          {statusInfo.label}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-4">
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-primary" />
          <span className="text-lg font-bold text-foreground">${offer.amount.toFixed(2)}</span>
        </div>
        {offer.counter_amount && (
          <div className="flex items-center gap-1 text-blue-500">
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span className="text-sm font-medium">${offer.counter_amount.toFixed(2)}</span>
          </div>
        )}
      </div>

      {offer.message && (
        <p className="mt-2 text-xs text-muted bg-hover-bg p-2 rounded-lg">&ldquo;{offer.message}&rdquo;</p>
      )}

      {/* Action buttons for seller on pending offers */}
      {isSeller && offer.status === "pending" && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => respondToOffer(offer.id, "accepted")}
            className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600"
          >
            <Check className="w-3.5 h-3.5" /> Accept
          </button>
          <button
            onClick={() => respondToOffer(offer.id, "declined")}
            className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600"
          >
            <X className="w-3.5 h-3.5" /> Decline
          </button>
          <button
            onClick={() => respondToOffer(offer.id, "countered", offer.amount * 1.1)}
            className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" /> Counter
          </button>
        </div>
      )}

      <div className="flex items-center gap-1 mt-2 text-xs text-muted">
        <Clock className="w-3 h-3" />
        <span>{new Date(offer.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
