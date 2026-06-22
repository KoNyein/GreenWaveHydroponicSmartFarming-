"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, StatCard } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/utils";
import { useSettingsStore } from "@/lib/store";
import { t } from "@/lib/translations";
import { mockDryRoomBatches } from "@/lib/mock-data";
import type { DryRoomBatch } from "@/types/database";
import { Wind, Thermometer, Droplets, Plus, Scale } from "lucide-react";

export default function DryRoomPage() {
  const { locale } = useSettingsStore();
  const tr = (key: string) => t(key, locale);
  const activeBatches = mockDryRoomBatches.filter((b) => b.status === "drying" || b.status === "curing");
  const completedBatches = mockDryRoomBatches.filter((b) => b.status === "completed");
  const totalWet = mockDryRoomBatches.reduce((s, b) => s + b.wet_weight_g, 0);
  const totalDry = mockDryRoomBatches.reduce((s, b) => s + (b.dry_weight_g ?? 0), 0);

  const columns = [
    { key: "batch_name", label: tr("dryroom.batch"), render: (b: DryRoomBatch) => <span className="font-medium">{b.batch_name}</span> },
    { key: "strain", label: tr("dryroom.strain") },
    { key: "wet_weight_g", label: tr("dryroom.wetWeight"), render: (b: DryRoomBatch) => `${b.wet_weight_g.toLocaleString()}g` },
    { key: "dry_weight_g", label: tr("dryroom.dryWeight"), render: (b: DryRoomBatch) => b.dry_weight_g ? `${b.dry_weight_g.toLocaleString()}g` : tr("dryroom.inProgress") },
    {
      key: "yield",
      label: tr("dryroom.yield"),
      render: (b: DryRoomBatch) =>
        b.dry_weight_g ? `${((b.dry_weight_g / b.wet_weight_g) * 100).toFixed(1)}%` : "-",
    },
    {
      key: "conditions",
      label: tr("dryroom.conditions"),
      render: (b: DryRoomBatch) => (
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1"><Thermometer className="w-3 h-3 text-red-500" />{b.temperature}°C</span>
          <span className="flex items-center gap-1"><Droplets className="w-3 h-3 text-blue-500" />{b.humidity}%</span>
        </div>
      ),
    },
    { key: "status", label: tr("dryroom.status"), render: (b: DryRoomBatch) => <StatusBadge status={b.status} /> },
    { key: "start_date", label: tr("dryroom.started"), render: (b: DryRoomBatch) => formatDate(b.start_date) },
    { key: "end_date", label: "Completed", render: (b: DryRoomBatch) => b.end_date ? formatDate(b.end_date) : "-" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{tr("dryroom.title")}</h1>
            <p className="text-muted text-sm mt-1">{tr("dryroom.subtitle")}</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition">
            <Plus className="w-4 h-4" /> New Batch
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatCard label="Active Batches" value={activeBatches.length} icon={<Wind className="w-5 h-5" />} />
          <StatCard label="Completed" value={completedBatches.length} icon={<Wind className="w-5 h-5" />} color="bg-green-600" />
          <StatCard label="Total Wet Weight" value={`${(totalWet / 1000).toFixed(1)} kg`} icon={<Scale className="w-5 h-5" />} color="bg-blue-500" />
          <StatCard label="Total Dry Weight" value={`${(totalDry / 1000).toFixed(1)} kg`} icon={<Scale className="w-5 h-5" />} color="bg-purple-500" />
        </div>

        {/* Active Batches Cards */}
        {activeBatches.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeBatches.map((batch) => (
              <Card key={batch.id} title={batch.batch_name} subtitle={batch.strain}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <StatusBadge status={batch.status} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Wet Weight</p>
                    <p className="text-sm font-medium">{batch.wet_weight_g.toLocaleString()}g</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Temperature</p>
                    <p className="text-sm font-medium flex items-center gap-1">
                      <Thermometer className="w-3.5 h-3.5 text-red-500" /> {batch.temperature}°C
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Humidity</p>
                    <p className="text-sm font-medium flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5 text-blue-500" /> {batch.humidity}%
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Started</p>
                    <p className="text-sm">{formatDate(batch.start_date)}</p>
                  </div>
                  {batch.notes && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">Notes</p>
                      <p className="text-sm">{batch.notes}</p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        <Card title="All Batches">
          <DataTable columns={columns} data={mockDryRoomBatches} keyExtractor={(b) => b.id} />
        </Card>
      </div>
    </DashboardLayout>
  );
}
