"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { usePhase3Store } from "@/lib/phase3-store";
import { getUserRSVP } from "@/lib/phase3-mock-data";
import { socialUsers } from "@/lib/social-mock-data";
import { Calendar, MapPin, Users, Clock, Plus, Video, Leaf, Star, Check, Filter } from "lucide-react";
import type { RSVPStatus, EventType } from "@/types/phase3";

const CURRENT_USER_ID = "user-001";

const EVENT_TYPE_LABELS: Record<EventType, { label: string; color: string }> = {
  meetup: { label: "Meetup", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  workshop: { label: "Workshop", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  tour: { label: "Farm Tour", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  harvest: { label: "Harvest", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  online: { label: "Online", color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" },
  other: { label: "Other", color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400" },
};

export default function EventsPage() {
  const router = useRouter();
  const { events, rsvpEvent } = usePhase3Store();
  const [filter, setFilter] = useState<"all" | "going" | "upcoming">("upcoming");
  const [showCreate, setShowCreate] = useState(false);

  const [now] = useState(() => new Date());

  const filteredEvents = useMemo(() => {
    let result = [...events];
    if (filter === "upcoming") {
      result = result.filter((e) => new Date(e.start_date) > now);
    } else if (filter === "going") {
      result = result.filter((e) => getUserRSVP(e.id, CURRENT_USER_ID) === "going");
    }
    return result.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
  }, [events, filter, now]);

  const handleRSVP = (eventId: string, status: RSVPStatus) => {
    rsvpEvent(eventId, CURRENT_USER_ID, status);
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Events</h1>
              <p className="text-sm text-muted">{events.length} upcoming events</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Create Event
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {(["upcoming", "going", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === f
                  ? "bg-primary text-white"
                  : "bg-card-bg border border-card-border text-muted hover:text-foreground"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="space-y-4">
          {filteredEvents.map((event) => {
            const creator = socialUsers.find((u) => u.id === event.created_by);
            const userRsvp = getUserRSVP(event.id, CURRENT_USER_ID);
            const typeInfo = EVENT_TYPE_LABELS[event.event_type];

            return (
              <div key={event.id} className="bg-card-bg border border-card-border rounded-xl overflow-hidden hover:border-primary/30 transition">
                <div className="flex flex-col sm:flex-row">
                  {/* Cover */}
                  {event.cover_url ? (
                    <img src={event.cover_url} alt="" className="w-full sm:w-48 h-40 sm:h-auto object-cover" />
                  ) : (
                    <div className="w-full sm:w-48 h-32 sm:h-auto bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Calendar className="w-10 h-10 text-primary/40" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${typeInfo.color}`}>
                          {typeInfo.label}
                        </span>
                        <h3 className="text-base font-semibold text-foreground mt-1.5">{event.title}</h3>
                      </div>
                      {!event.is_free && (
                        <span className="text-sm font-bold text-primary">${event.price}</span>
                      )}
                    </div>

                    {event.description && (
                      <p className="text-xs text-muted mt-2 line-clamp-2">{event.description}</p>
                    )}

                    <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(event.start_date)} at {formatTime(event.start_date)}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {event.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {event.attendee_count}{event.max_attendees ? `/${event.max_attendees}` : ""} attendees
                      </span>
                    </div>

                    {/* RSVP Buttons */}
                    <div className="flex items-center gap-2 mt-4">
                      <button
                        onClick={() => handleRSVP(event.id, "going")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                          userRsvp === "going"
                            ? "bg-green-500 text-white"
                            : "bg-card-bg border border-card-border text-muted hover:text-green-600 hover:border-green-300"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        Going
                      </button>
                      <button
                        onClick={() => handleRSVP(event.id, "interested")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                          userRsvp === "interested"
                            ? "bg-yellow-500 text-white"
                            : "bg-card-bg border border-card-border text-muted hover:text-yellow-600 hover:border-yellow-300"
                        }`}
                      >
                        <Star className="w-3.5 h-3.5" />
                        Interested
                      </button>
                      {creator && (
                        <span className="ml-auto text-xs text-muted">
                          by {creator.full_name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12 text-muted">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No events found</p>
          </div>
        )}

        {/* Create Event Modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-card-bg border border-card-border rounded-xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto">
              <h2 className="text-lg font-bold text-foreground mb-4">Create New Event</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Title</label>
                  <input type="text" className="w-full mt-1 px-3 py-2 bg-hover-bg border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Event title" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <textarea className="w-full mt-1 px-3 py-2 bg-hover-bg border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" rows={3} placeholder="Tell people about the event" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-foreground">Start Date</label>
                    <input type="datetime-local" className="w-full mt-1 px-3 py-2 bg-hover-bg border border-card-border rounded-lg text-sm text-foreground" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">End Date</label>
                    <input type="datetime-local" className="w-full mt-1 px-3 py-2 bg-hover-bg border border-card-border rounded-lg text-sm text-foreground" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Location</label>
                  <input type="text" className="w-full mt-1 px-3 py-2 bg-hover-bg border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Online or physical location" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-foreground">Type</label>
                    <select className="w-full mt-1 px-3 py-2 bg-hover-bg border border-card-border rounded-lg text-sm text-foreground">
                      <option value="meetup">Meetup</option>
                      <option value="workshop">Workshop</option>
                      <option value="tour">Farm Tour</option>
                      <option value="harvest">Harvest</option>
                      <option value="online">Online</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Max Attendees</label>
                    <input type="number" className="w-full mt-1 px-3 py-2 bg-hover-bg border border-card-border rounded-lg text-sm text-foreground" placeholder="Unlimited" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowCreate(false)} className="flex-1 py-2 border border-card-border rounded-lg text-sm font-medium text-muted hover:text-foreground">Cancel</button>
                <button onClick={() => setShowCreate(false)} className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">Create Event</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
