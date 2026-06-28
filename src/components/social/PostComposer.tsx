"use client";

import { useState, useRef } from "react";
import type { PostVisibility } from "@/types/database";
import { Send, ImagePlus, MapPin, Globe, Lock, X } from "lucide-react";

interface PostComposerProps {
  authorInitial: string;
  tr: (key: string) => string;
  onPost?: (content: string, photos: string[], location: { lat: number; lng: number; name: string } | null, visibility: PostVisibility) => void;
}

export default function PostComposer({ authorInitial, tr, onPost }: PostComposerProps) {
  const [content, setContent] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [visibility, setVisibility] = useState<PostVisibility>("public");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mockLocations = [
    { lat: 16.8661, lng: 96.1951, name: "GreenWave Farm, Yangon" },
    { lat: 21.9162, lng: 95.9560, name: "Mandalay, Myanmar" },
    { lat: 19.7633, lng: 96.0785, name: "Nay Pyi Taw, Myanmar" },
    { lat: 37.7749, lng: -122.4194, name: "San Francisco, CA" },
    { lat: 1.3521, lng: 103.8198, name: "Singapore" },
    { lat: 13.7563, lng: 100.5018, name: "Bangkok, Thailand" },
  ];

  const filteredLocations = locationSearch
    ? mockLocations.filter((l) => l.name.toLowerCase().includes(locationSearch.toLowerCase()))
    : mockLocations;

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newPhotos: string[] = [];
    for (let i = 0; i < files.length && photos.length + newPhotos.length < 4; i++) {
      newPhotos.push(URL.createObjectURL(files[i]));
    }
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePost = () => {
    if (!content.trim() && photos.length === 0) return;
    onPost?.(content, photos, selectedLocation, visibility);
    setContent("");
    setPhotos([]);
    setSelectedLocation(null);
    setShowLocationPicker(false);
  };

  return (
    <div className="bg-card-bg border border-card-border rounded-xl p-4 shadow-sm">
      <div className="flex gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold flex-shrink-0">
          {authorInitial}
        </div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={tr("profile.writePost")}
            className="w-full p-3 border border-input-border bg-input-bg rounded-lg text-sm resize-none outline-none focus:ring-2 focus:ring-primary"
            rows={3}
          />

          {/* Photo Previews */}
          {photos.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {photos.map((photo, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-card-border">
                  <img src={photo} alt={`${tr("profile.photoPreview")} ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePhoto(i)}
                    className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Location Display */}
          {selectedLocation && (
            <div className="flex items-center gap-2 mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span className="text-blue-700 dark:text-blue-400 flex-1">{selectedLocation.name}</span>
              <button onClick={() => setSelectedLocation(null)} className="text-blue-400 hover:text-blue-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Location Picker */}
          {showLocationPicker && !selectedLocation && (
            <div className="mt-2 p-3 border border-card-border rounded-lg bg-card-bg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-muted" />
                <input
                  type="text"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  placeholder={tr("profile.searchLocation")}
                  className="flex-1 text-sm bg-input-bg border border-input-border rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {filteredLocations.map((loc, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setShowLocationPicker(false);
                      setLocationSearch("");
                    }}
                    className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-hover-bg transition"
                  >
                    📍 {loc.name}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-muted mt-2">Powered by Google Maps API</p>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handlePhotoSelect}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted hover:bg-hover-bg rounded-lg transition"
                title={tr("profile.addPhoto")}
              >
                <ImagePlus className="w-4 h-4 text-green-500" />
                <span className="hidden sm:inline">{tr("profile.addPhoto")}</span>
              </button>

              <button
                onClick={() => setShowLocationPicker(!showLocationPicker)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition ${
                  showLocationPicker || selectedLocation
                    ? "text-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "text-muted hover:bg-hover-bg"
                }`}
                title={tr("profile.addLocation")}
              >
                <MapPin className="w-4 h-4 text-red-500" />
                <span className="hidden sm:inline">{tr("profile.addLocation")}</span>
              </button>

              {/* Visibility Toggle */}
              <button
                onClick={() => setVisibility(visibility === "public" ? "friends" : "public")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition ${
                  visibility === "friends"
                    ? "text-orange-600 bg-orange-50 dark:bg-orange-900/20"
                    : "text-muted hover:bg-hover-bg"
                }`}
              >
                {visibility === "public" ? (
                  <Globe className="w-4 h-4 text-blue-500" />
                ) : (
                  <Lock className="w-4 h-4 text-orange-500" />
                )}
                <span className="hidden sm:inline">
                  {visibility === "public" ? tr("profile.public") : tr("profile.friendsOnly")}
                </span>
              </button>
            </div>

            <button
              onClick={handlePost}
              disabled={!content.trim() && photos.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" /> {tr("profile.post")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
