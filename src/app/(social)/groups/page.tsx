"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { usePhase3Store } from "@/lib/phase3-store";
import { isGroupMember } from "@/lib/phase3-mock-data";
import { Users, Plus, Lock, Globe, Search, Shield } from "lucide-react";

const CURRENT_USER_ID = "user-001";
const CATEGORIES = ["all", "education", "equipment", "science", "marketplace", "regional", "nutrients"];

export default function GroupsPage() {
  const router = useRouter();
  const { groups, joinGroup, leaveGroup } = usePhase3Store();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [newGroup, setNewGroup] = useState<{ name: string; description: string; privacy: "public" | "private"; category: string }>({ name: "", description: "", privacy: "public", category: "general" });

  const filteredGroups = groups.filter((g) => {
    const matchSearch = !search || g.name.toLowerCase().includes(search.toLowerCase()) || g.description?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || g.category === category;
    return matchSearch && matchCategory;
  });

  const myGroups = groups.filter((g) => isGroupMember(g.id, CURRENT_USER_ID));

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Groups</h1>
              <p className="text-sm text-muted">{groups.length} communities</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Create Group
          </button>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search groups..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card-bg border border-card-border rounded-lg text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  category === cat ? "bg-primary text-white" : "bg-card-bg border border-card-border text-muted hover:text-foreground"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* My Groups */}
        {myGroups.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-muted uppercase mb-3">Your Groups ({myGroups.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myGroups.map((group) => (
                <div
                  key={group.id}
                  className="bg-card-bg border border-card-border rounded-xl overflow-hidden cursor-pointer hover:border-primary/30 transition"
                  onClick={() => router.push(`/groups/${group.slug}`)}
                >
                  {group.cover_url && (
                    <img src={group.cover_url} alt="" className="w-full h-24 object-cover" />
                  )}
                  {!group.cover_url && (
                    <div className="w-full h-24 bg-gradient-to-br from-primary/20 to-primary/5" />
                  )}
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground text-sm truncate">{group.name}</h3>
                      {group.privacy === "private" && <Lock className="w-3 h-3 text-muted" />}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted">
                      <span>{group.member_count} members</span>
                      <span>{group.post_count} posts</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All / Discover Groups */}
        <h2 className="text-sm font-semibold text-muted uppercase mb-3">Discover Groups</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGroups.map((group) => {
            const isMember = isGroupMember(group.id, CURRENT_USER_ID);
            return (
              <div
                key={group.id}
                className="bg-card-bg border border-card-border rounded-xl overflow-hidden hover:border-primary/30 transition"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => router.push(`/groups/${group.slug}`)}
                >
                  {group.cover_url ? (
                    <img src={group.cover_url} alt="" className="w-full h-28 object-cover" />
                  ) : (
                    <div className="w-full h-28 bg-gradient-to-br from-primary/20 to-primary/5" />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    {group.avatar_url ? (
                      <img src={group.avatar_url} alt="" className="w-8 h-8 rounded-lg object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Users className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm truncate">{group.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-muted">
                        {group.privacy === "public" ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                        <span>{group.privacy}</span>
                        <span className="mx-1">-</span>
                        <span>{group.member_count} members</span>
                      </div>
                    </div>
                  </div>
                  {group.description && (
                    <p className="text-xs text-muted mt-2 line-clamp-2">{group.description}</p>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isMember) leaveGroup(group.id, CURRENT_USER_ID);
                      else joinGroup(group.id, CURRENT_USER_ID);
                    }}
                    className={`w-full mt-3 py-2 rounded-lg text-sm font-medium transition ${
                      isMember
                        ? "bg-gray-100 dark:bg-gray-700 text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                        : "bg-primary text-white hover:bg-primary/90"
                    }`}
                  >
                    {isMember ? "Leave Group" : "Join Group"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-12 text-muted">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No groups found</p>
          </div>
        )}

        {/* Create Group Modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-card-bg border border-card-border rounded-xl w-full max-w-md p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Create New Group</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Group Name</label>
                  <input
                    type="text"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-hover-bg border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="e.g., Hydroponic Enthusiasts"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <textarea
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-hover-bg border border-card-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    rows={3}
                    placeholder="What is this group about?"
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-foreground">Privacy</label>
                    <select
                      value={newGroup.privacy}
                      onChange={(e) => setNewGroup({ ...newGroup, privacy: e.target.value as "public" | "private" })}
                      className="w-full mt-1 px-3 py-2 bg-hover-bg border border-card-border rounded-lg text-sm text-foreground"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-foreground">Category</label>
                    <select
                      value={newGroup.category}
                      onChange={(e) => setNewGroup({ ...newGroup, category: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-hover-bg border border-card-border rounded-lg text-sm text-foreground"
                    >
                      {CATEGORIES.filter((c) => c !== "all").map((c) => (
                        <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 py-2 border border-card-border rounded-lg text-sm font-medium text-muted hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!newGroup.name.trim()) return;
                    setShowCreate(false);
                    setNewGroup({ name: "", description: "", privacy: "public", category: "general" });
                  }}
                  className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
