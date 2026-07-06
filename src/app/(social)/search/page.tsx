"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useSettingsStore } from "@/lib/store";
import { t } from "@/lib/translations";
import { socialUsers, socialPosts, getFeedPosts } from "@/lib/social-mock-data";
import PostCard from "@/components/social/PostCard";
import { useRouter } from "next/navigation";
import {
  Search,
  Users,
  FileText,
  TrendingUp,
  X,
  MapPin,
  UserPlus,
} from "lucide-react";

type SearchTab = "all" | "people" | "posts";

export default function SearchPage() {
  const { locale } = useSettingsStore();
  const tr = (key: string) => t(key, locale);
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<SearchTab>("all");
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "hydroponics",
    "pH levels",
    "LED lighting",
    "nutrient solution",
  ]);

  const allPosts = getFeedPosts("user-001");

  const filteredUsers = query.trim()
    ? socialUsers.filter(
        (u) =>
          u.full_name.toLowerCase().includes(query.toLowerCase()) ||
          u.username.toLowerCase().includes(query.toLowerCase()) ||
          (u.bio && u.bio.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const filteredPosts = query.trim()
    ? allPosts.filter((p) =>
        p.content.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    if (searchTerm && !recentSearches.includes(searchTerm)) {
      setRecentSearches((prev) => [searchTerm, ...prev.slice(0, 4)]);
    }
  };

  const clearRecentSearch = (term: string) => {
    setRecentSearches((prev) => prev.filter((s) => s !== term));
  };

  const tabs = [
    { id: "all" as SearchTab, label: "All", icon: Search },
    { id: "people" as SearchTab, label: "People", icon: Users },
    { id: "posts" as SearchTab, label: "Posts", icon: FileText },
  ];

  const showResults = query.trim().length > 0;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Search Header */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              placeholder="Search people, posts, topics..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-card-bg border border-card-border text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        {showResults && (
          <div className="flex gap-1 mb-6 border-b border-card-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.id === "people" && filteredUsers.length > 0 && (
                  <span className="text-xs bg-primary/10 text-primary px-1.5 rounded-full">{filteredUsers.length}</span>
                )}
                {tab.id === "posts" && filteredPosts.length > 0 && (
                  <span className="text-xs bg-primary/10 text-primary px-1.5 rounded-full">{filteredPosts.length}</span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* No query: Recent searches + Trending */}
        {!showResults && (
          <div className="space-y-6">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">Recent Searches</h3>
                <div className="space-y-1">
                  {recentSearches.map((term) => (
                    <div key={term} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-hover-bg group">
                      <button
                        onClick={() => handleSearch(term)}
                        className="flex items-center gap-3 text-sm text-foreground"
                      >
                        <Search className="w-4 h-4 text-muted" />
                        {term}
                      </button>
                      <button
                        onClick={() => clearRecentSearch(term)}
                        className="text-muted hover:text-foreground opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Topics */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Trending Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {["#hydroponics", "#LED_grow", "#organic", "#harvest2025", "#nutrients", "#pH_balance", "#DWC", "#seedlings"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleSearch(tag.replace("#", ""))}
                    className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm hover:bg-primary/20 transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Suggested People */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">People You May Know</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {socialUsers.slice(1, 5).map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-card-bg border border-card-border hover:border-primary/30 transition cursor-pointer"
                    onClick={() => router.push(`/u/${user.username}`)}
                  >
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {user.full_name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{user.full_name}</p>
                      <p className="text-xs text-muted truncate">@{user.username}</p>
                    </div>
                    <button className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20">
                      <UserPlus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {showResults && (
          <div className="space-y-6">
            {/* People Results */}
            {(activeTab === "all" || activeTab === "people") && filteredUsers.length > 0 && (
              <div>
                {activeTab === "all" && (
                  <h3 className="text-sm font-medium text-foreground mb-3">People</h3>
                )}
                <div className="space-y-2">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-card-bg border border-card-border hover:border-primary/30 transition cursor-pointer"
                      onClick={() => router.push(`/u/${user.username}`)}
                    >
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                          {user.full_name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">{user.full_name}</p>
                        <p className="text-sm text-muted">@{user.username}</p>
                        {user.bio && <p className="text-xs text-muted mt-0.5 truncate">{user.bio}</p>}
                      </div>
                      {user.location && (
                        <div className="hidden sm:flex items-center gap-1 text-xs text-muted">
                          <MapPin className="w-3 h-3" />
                          {user.location}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Posts Results */}
            {(activeTab === "all" || activeTab === "posts") && filteredPosts.length > 0 && (
              <div>
                {activeTab === "all" && (
                  <h3 className="text-sm font-medium text-foreground mb-3">Posts</h3>
                )}
                <div className="space-y-4">
                  {filteredPosts.slice(0, 10).map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onProfileClick={(username) => router.push(`/u/${username}`)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {filteredUsers.length === 0 && filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-muted mx-auto mb-3" />
                <h3 className="text-lg font-medium text-foreground">No results found</h3>
                <p className="text-sm text-muted mt-1">Try different keywords or check the spelling</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
