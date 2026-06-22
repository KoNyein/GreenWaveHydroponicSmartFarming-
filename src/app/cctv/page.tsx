"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { mockCameras } from "@/lib/mock-data";
import type { Camera } from "@/types/database";
import { Camera as CameraIcon, Maximize2, Grid3X3, LayoutGrid, Radio } from "lucide-react";

function CameraFeed({
  camera,
  large = false,
  onSelect,
}: {
  camera: Camera;
  large?: boolean;
  onSelect: (camera: Camera) => void;
}) {
  return (
    <div
      className={`relative bg-gray-900 rounded-lg overflow-hidden cursor-pointer group ${
        large ? "h-96" : "h-48"
      }`}
      onClick={() => onSelect(camera)}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {camera.is_online ? (
          <div className="text-center">
            <CameraIcon className="w-12 h-12 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Live Feed - {camera.name}</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              <Radio className="w-3 h-3 text-red-500 animate-pulse" />
              <span className="text-red-400 text-xs font-medium">LIVE</span>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <CameraIcon className="w-12 h-12 text-gray-700 mx-auto mb-2" />
            <p className="text-gray-600 text-sm">Camera Offline</p>
          </div>
        )}
      </div>

      <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${camera.is_online ? "bg-green-500 pulse-glow" : "bg-red-500"}`} />
            <span className="text-white text-xs font-medium">{camera.name}</span>
          </div>
          <span className="text-white/70 text-[10px]">{camera.camera_type.toUpperCase()}</span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
        <p className="text-white/70 text-xs">{camera.location}</p>
      </div>

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
        <Maximize2 className="w-8 h-8 text-white" />
      </div>
    </div>
  );
}

export default function CCTVPage() {
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [layout, setLayout] = useState<"grid" | "single">("grid");

  const handleSelect = (camera: Camera) => {
    setSelectedCamera(camera);
    setLayout("single");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">CCTV Monitoring</h1>
            <p className="text-gray-500 text-sm mt-1">
              {mockCameras.filter((c) => c.is_online).length} of {mockCameras.length} cameras online
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setLayout("grid"); setSelectedCamera(null); }}
              className={`p-2 rounded-lg transition ${layout === "grid" ? "bg-primary text-white" : "bg-white border border-gray-200"}`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setLayout("single")}
              className={`p-2 rounded-lg transition ${layout === "single" ? "bg-primary text-white" : "bg-white border border-gray-200"}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
        </div>

        {layout === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {mockCameras.map((camera) => (
              <CameraFeed key={camera.id} camera={camera} onSelect={handleSelect} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3">
              <CameraFeed camera={selectedCamera ?? mockCameras[0]} large onSelect={handleSelect} />
            </div>
            <div className="space-y-3">
              <Card title="Camera List">
                <div className="space-y-2">
                  {mockCameras.map((camera) => (
                    <button
                      key={camera.id}
                      onClick={() => setSelectedCamera(camera)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition ${
                        selectedCamera?.id === camera.id
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${camera.is_online ? "bg-green-500" : "bg-red-500"}`} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{camera.name}</p>
                        <p className="text-xs text-gray-500">{camera.location}</p>
                      </div>
                      <StatusBadge status={camera.is_online ? "online" : "offline"} />
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
