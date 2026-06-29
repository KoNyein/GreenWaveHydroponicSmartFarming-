"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useSettingsStore } from "@/lib/store";
import { t } from "@/lib/translations";
import { mockMarketplaceListings } from "@/lib/mock-data";
import type { MarketplaceListing } from "@/types/database";
import {
  Search,
  Plus,
  MapPin,
  Tag,
  Clock,
  ShoppingBag,
  MessageCircle,
  Filter,
  X,
  ChevronDown,
  Image,
} from "lucide-react";

const CATEGORIES = ["all", "seeds", "nutrients", "equipment", "harvest", "supplies", "other"] as const;

export default function MarketplacePage() {
  const { locale } = useSettingsStore();
  const tr = (key: string) => t(key, locale);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showNewListing, setShowNewListing] = useState(false);
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);

  const [newListing, setNewListing] = useState({
    title: "",
    description: "",
    price: "",
    category: "seeds" as MarketplaceListing["category"],
    condition: "new" as MarketplaceListing["condition"],
    location: "",
  });

  const filteredListings = mockMarketplaceListings.filter((listing) => {
    const matchesSearch =
      !searchQuery ||
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || listing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (cat: string) => {
    const map: Record<string, string> = {
      all: tr("marketplace.allCategories"),
      seeds: tr("marketplace.seeds"),
      nutrients: tr("marketplace.nutrients"),
      equipment: tr("marketplace.equipment"),
      harvest: tr("marketplace.harvest"),
      supplies: tr("marketplace.supplies"),
      other: tr("marketplace.other"),
    };
    return map[cat] ?? cat;
  };

  const getConditionLabel = (cond: string) => {
    const map: Record<string, string> = {
      new: tr("marketplace.new"),
      used: tr("marketplace.used"),
      like_new: tr("marketplace.likeNew"),
    };
    return map[cond] ?? cond;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "sold":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "reserved":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale === "my" ? "my-MM" : "en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{tr("marketplace.title")}</h1>
            <p className="text-muted text-sm">{tr("marketplace.subtitle")}</p>
          </div>
          <button
            onClick={() => setShowNewListing(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            {tr("marketplace.newListing")}
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder={tr("marketplace.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-card-bg border border-card-border text-sm text-foreground"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  selectedCategory === cat
                    ? "bg-primary text-white"
                    : "bg-card-bg border border-card-border text-foreground hover:bg-hover-bg"
                }`}
              >
                {getCategoryLabel(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="text-center py-16 bg-card-bg border border-card-border rounded-xl">
            <ShoppingBag className="w-12 h-12 text-muted mx-auto mb-3" />
            <p className="text-muted">{tr("marketplace.noListings")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredListings.map((listing) => (
              <div
                key={listing.id}
                onClick={() => setSelectedListing(listing)}
                className="bg-card-bg border border-card-border rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer group"
              >
                {/* Image */}
                <div className="relative h-48 bg-hover-bg overflow-hidden">
                  {listing.images.length > 0 ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="w-12 h-12 text-muted" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}>
                      {listing.status === "active"
                        ? tr("marketplace.active")
                        : listing.status === "sold"
                        ? tr("marketplace.sold")
                        : tr("marketplace.reserved")}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-black/50 text-white backdrop-blur-sm">
                      {getConditionLabel(listing.condition)}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4">
                  <h3 className="font-semibold text-foreground text-sm line-clamp-1">{listing.title}</h3>
                  <p className="text-muted text-xs mt-1 line-clamp-2">{listing.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-primary font-bold text-lg">
                      ${listing.price}
                    </span>
                    <span className="text-xs text-muted flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {getCategoryLabel(listing.category)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-card-border">
                    <div className="flex items-center gap-1.5 text-xs text-muted">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">
                        {listing.seller_name.charAt(0)}
                      </div>
                      <span>{listing.seller_name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {listing.location.split(",")[0]}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(listing.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Listing Detail Modal */}
        {selectedListing && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-card-bg rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                {selectedListing.images.length > 0 && (
                  <img
                    src={selectedListing.images[0]}
                    alt={selectedListing.title}
                    className="w-full h-64 object-cover"
                  />
                )}
                <button
                  onClick={() => setSelectedListing(null)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-bold text-foreground">{selectedListing.title}</h2>
                  <span className="text-primary font-bold text-2xl whitespace-nowrap">
                    ${selectedListing.price}
                  </span>
                </div>
                <p className="text-muted text-sm mt-3">{selectedListing.description}</p>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-hover-bg rounded-lg p-3">
                    <span className="text-xs text-muted">{tr("marketplace.category")}</span>
                    <p className="text-sm font-medium text-foreground mt-0.5">
                      {getCategoryLabel(selectedListing.category)}
                    </p>
                  </div>
                  <div className="bg-hover-bg rounded-lg p-3">
                    <span className="text-xs text-muted">{tr("marketplace.condition")}</span>
                    <p className="text-sm font-medium text-foreground mt-0.5">
                      {getConditionLabel(selectedListing.condition)}
                    </p>
                  </div>
                  <div className="bg-hover-bg rounded-lg p-3">
                    <span className="text-xs text-muted">{tr("marketplace.seller")}</span>
                    <p className="text-sm font-medium text-foreground mt-0.5">{selectedListing.seller_name}</p>
                  </div>
                  <div className="bg-hover-bg rounded-lg p-3">
                    <span className="text-xs text-muted">{tr("marketplace.location")}</span>
                    <p className="text-sm font-medium text-foreground mt-0.5">{selectedListing.location}</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  {selectedListing.status === "active" && (
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium text-sm">
                      <ShoppingBag className="w-4 h-4" />
                      {tr("marketplace.buyNow")}
                    </button>
                  )}
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-hover-bg border border-card-border text-foreground rounded-lg hover:bg-card-border transition font-medium text-sm">
                    <MessageCircle className="w-4 h-4" />
                    {tr("marketplace.messageOwner")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* New Listing Modal */}
        {showNewListing && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-card-bg rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-card-border">
                <h2 className="text-lg font-bold text-foreground">{tr("marketplace.listItem")}</h2>
                <button
                  onClick={() => setShowNewListing(false)}
                  className="p-2 rounded-lg hover:bg-hover-bg text-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {tr("marketplace.itemTitle")}
                  </label>
                  <input
                    type="text"
                    value={newListing.title}
                    onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-input-bg border border-input-border text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {tr("marketplace.description")}
                  </label>
                  <textarea
                    rows={3}
                    value={newListing.description}
                    onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-input-bg border border-input-border text-sm text-foreground resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {tr("marketplace.price")} (USD)
                    </label>
                    <input
                      type="number"
                      value={newListing.price}
                      onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg bg-input-bg border border-input-border text-sm text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {tr("marketplace.category")}
                    </label>
                    <select
                      value={newListing.category}
                      onChange={(e) =>
                        setNewListing({ ...newListing, category: e.target.value as MarketplaceListing["category"] })
                      }
                      className="w-full px-3 py-2.5 rounded-lg bg-input-bg border border-input-border text-sm text-foreground"
                    >
                      {CATEGORIES.filter((c) => c !== "all").map((cat) => (
                        <option key={cat} value={cat}>
                          {getCategoryLabel(cat)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {tr("marketplace.condition")}
                    </label>
                    <select
                      value={newListing.condition}
                      onChange={(e) =>
                        setNewListing({ ...newListing, condition: e.target.value as MarketplaceListing["condition"] })
                      }
                      className="w-full px-3 py-2.5 rounded-lg bg-input-bg border border-input-border text-sm text-foreground"
                    >
                      <option value="new">{tr("marketplace.new")}</option>
                      <option value="like_new">{tr("marketplace.likeNew")}</option>
                      <option value="used">{tr("marketplace.used")}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {tr("marketplace.location")}
                    </label>
                    <input
                      type="text"
                      value={newListing.location}
                      onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg bg-input-bg border border-input-border text-sm text-foreground"
                      placeholder="Yangon, Myanmar"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {tr("marketplace.photos")}
                  </label>
                  <div className="border-2 border-dashed border-card-border rounded-lg p-8 text-center hover:border-primary/50 transition cursor-pointer">
                    <Image className="w-8 h-8 text-muted mx-auto mb-2" />
                    <p className="text-sm text-muted">{tr("messenger.attachPhoto")}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNewListing(false)}
                  className="w-full py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium text-sm"
                >
                  {tr("marketplace.listItem")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
