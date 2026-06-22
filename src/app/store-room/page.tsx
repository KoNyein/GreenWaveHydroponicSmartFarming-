"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, StatCard } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/utils";
import { useSettingsStore } from "@/lib/store";
import { t } from "@/lib/translations";
import { mockStoreRoomItems } from "@/lib/mock-data";
import type { StoreRoomItem } from "@/types/database";
import { Warehouse, Package, Plus, MapPin } from "lucide-react";

export default function StoreRoomPage() {
  const { locale } = useSettingsStore();
  const tr = (key: string) => t(key, locale);
  const available = mockStoreRoomItems.filter((i) => i.status === "available");
  const reserved = mockStoreRoomItems.filter((i) => i.status === "reserved");
  const totalQuantity = mockStoreRoomItems.reduce((s, i) => s + i.quantity, 0);

  const columns = [
    { key: "product_name", label: tr("storeroom.product"), render: (i: StoreRoomItem) => <span className="font-medium">{i.product_name}</span> },
    { key: "quantity", label: tr("inventory.quantity"), render: (i: StoreRoomItem) => `${i.quantity.toLocaleString()} ${i.unit}` },
    { key: "quality_grade", label: tr("storeroom.grade"), render: (i: StoreRoomItem) => (
      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
        i.quality_grade === "A" ? "bg-green-100 text-green-800" :
        i.quality_grade === "B" ? "bg-yellow-100 text-yellow-800" :
        i.quality_grade === "C" ? "bg-orange-100 text-orange-800" :
        "bg-red-100 text-red-800"
      }`}>{i.quality_grade}</span>
    )},
    { key: "shelf_location", label: "Shelf", render: (i: StoreRoomItem) => (
      <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-gray-400" />{i.shelf_location}</span>
    )},
    { key: "status", label: tr("dryroom.status"), render: (i: StoreRoomItem) => <StatusBadge status={i.status} /> },
    { key: "expiry_date", label: tr("storeroom.expiry"), render: (i: StoreRoomItem) => i.expiry_date ? formatDate(i.expiry_date) : "-" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{tr("storeroom.title")}</h1>
            <p className="text-muted text-sm mt-1">{tr("storeroom.subtitle")}</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition">
            <Plus className="w-4 h-4" /> {tr("storeroom.addItem")}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatCard label={tr("storeroom.totalItems")} value={mockStoreRoomItems.length} icon={<Warehouse className="w-5 h-5" />} />
          <StatCard label={tr("storeroom.available")} value={available.length} icon={<Package className="w-5 h-5" />} color="bg-green-600" />
          <StatCard label={tr("storeroom.reserved")} value={reserved.length} icon={<Package className="w-5 h-5" />} color="bg-blue-500" />
          <StatCard label={tr("storeroom.totalStock")} value={`${(totalQuantity / 1000).toFixed(1)} kg`} icon={<Package className="w-5 h-5" />} color="bg-purple-500" />
        </div>

        <Card title={tr("storeroom.inventory")}>
          <DataTable columns={columns} data={mockStoreRoomItems} keyExtractor={(i) => i.id} />
        </Card>
      </div>
    </DashboardLayout>
  );
}
