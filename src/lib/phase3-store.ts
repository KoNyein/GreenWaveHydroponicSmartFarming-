// Phase 3: Zustand Store for Groups, Events, Marketplace Pro

import { create } from "zustand";
import type { Group, GroupMember, Event, EventRSVP, Offer, Poll, RSVPStatus, OfferStatus } from "@/types/phase3";
import { mockGroups, mockGroupMembers, mockEvents, mockEventRSVPs, mockOffers, mockPolls } from "./phase3-mock-data";

interface Phase3State {
  groups: Group[];
  groupMembers: GroupMember[];
  events: Event[];
  rsvps: EventRSVP[];
  offers: Offer[];
  polls: Poll[];

  // Group actions
  createGroup: (group: Omit<Group, "id" | "created_at" | "member_count" | "post_count">) => void;
  joinGroup: (groupId: string, userId: string) => void;
  leaveGroup: (groupId: string, userId: string) => void;

  // Event actions
  createEvent: (event: Omit<Event, "id" | "created_at" | "attendee_count">) => void;
  rsvpEvent: (eventId: string, userId: string, status: RSVPStatus) => void;

  // Offer actions
  createOffer: (offer: Omit<Offer, "id" | "created_at" | "updated_at" | "status" | "counter_amount">) => void;
  respondToOffer: (offerId: string, status: OfferStatus, counterAmount?: number) => void;

  // Poll actions
  votePoll: (pollId: string, optionId: string, userId: string) => void;
  removePollVote: (pollId: string, optionId: string, userId: string) => void;
}

export const usePhase3Store = create<Phase3State>((set) => ({
  groups: mockGroups,
  groupMembers: mockGroupMembers,
  events: mockEvents,
  rsvps: mockEventRSVPs,
  offers: mockOffers,
  polls: mockPolls,

  createGroup: (group) =>
    set((state) => ({
      groups: [
        ...state.groups,
        {
          ...group,
          id: `group-${Date.now()}`,
          created_at: new Date().toISOString(),
          member_count: 1,
          post_count: 0,
        },
      ],
      groupMembers: [
        ...state.groupMembers,
        {
          id: `gm-${Date.now()}`,
          group_id: `group-${Date.now()}`,
          user_id: group.created_by,
          role: "admin",
          status: "active",
          joined_at: new Date().toISOString(),
        },
      ],
    })),

  joinGroup: (groupId, userId) =>
    set((state) => ({
      groupMembers: [
        ...state.groupMembers,
        {
          id: `gm-${Date.now()}`,
          group_id: groupId,
          user_id: userId,
          role: "member",
          status: "active",
          joined_at: new Date().toISOString(),
        },
      ],
      groups: state.groups.map((g) =>
        g.id === groupId ? { ...g, member_count: g.member_count + 1 } : g
      ),
    })),

  leaveGroup: (groupId, userId) =>
    set((state) => ({
      groupMembers: state.groupMembers.filter(
        (gm) => !(gm.group_id === groupId && gm.user_id === userId)
      ),
      groups: state.groups.map((g) =>
        g.id === groupId ? { ...g, member_count: Math.max(0, g.member_count - 1) } : g
      ),
    })),

  createEvent: (event) =>
    set((state) => ({
      events: [
        ...state.events,
        {
          ...event,
          id: `event-${Date.now()}`,
          created_at: new Date().toISOString(),
          attendee_count: 0,
        },
      ],
    })),

  rsvpEvent: (eventId, userId, status) =>
    set((state) => {
      const existing = state.rsvps.find((r) => r.event_id === eventId && r.user_id === userId);
      if (existing) {
        return {
          rsvps: state.rsvps.map((r) =>
            r.event_id === eventId && r.user_id === userId ? { ...r, status } : r
          ),
        };
      }
      return {
        rsvps: [
          ...state.rsvps,
          {
            id: `rsvp-${Date.now()}`,
            event_id: eventId,
            user_id: userId,
            status,
            created_at: new Date().toISOString(),
          },
        ],
        events: state.events.map((e) =>
          e.id === eventId && status === "going"
            ? { ...e, attendee_count: e.attendee_count + 1 }
            : e
        ),
      };
    }),

  createOffer: (offer) =>
    set((state) => ({
      offers: [
        ...state.offers,
        {
          ...offer,
          id: `offer-${Date.now()}`,
          status: "pending",
          counter_amount: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    })),

  respondToOffer: (offerId, status, counterAmount) =>
    set((state) => ({
      offers: state.offers.map((o) =>
        o.id === offerId
          ? {
              ...o,
              status,
              counter_amount: counterAmount ?? o.counter_amount,
              updated_at: new Date().toISOString(),
            }
          : o
      ),
    })),

  votePoll: (pollId, optionId, userId) =>
    set((state) => ({
      polls: state.polls.map((p) => {
        if (p.id !== pollId) return p;
        const alreadyVoted = p.user_votes?.includes(optionId);
        if (alreadyVoted) return p;
        return {
          ...p,
          total_votes: p.total_votes + 1,
          user_votes: [...(p.user_votes || []), optionId],
          options: p.options.map((o) =>
            o.id === optionId ? { ...o, vote_count: o.vote_count + 1 } : o
          ),
        };
      }),
    })),

  removePollVote: (pollId, optionId, userId) =>
    set((state) => ({
      polls: state.polls.map((p) => {
        if (p.id !== pollId) return p;
        return {
          ...p,
          total_votes: Math.max(0, p.total_votes - 1),
          user_votes: (p.user_votes || []).filter((v) => v !== optionId),
          options: p.options.map((o) =>
            o.id === optionId ? { ...o, vote_count: Math.max(0, o.vote_count - 1) } : o
          ),
        };
      }),
    })),
}));
