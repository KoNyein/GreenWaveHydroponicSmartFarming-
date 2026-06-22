"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, StatCard } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency } from "@/lib/utils";
import { mockInventory } from "@/lib/mock-data";
import type { InventoryItem } from "@/types/database";
import { Package, AlertTriangle, Search, Plus, Filter } from "lucide-react";

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");

  const categories = Array.from(new Set(mockInventory.map((i) => i.category)));
  const locations = Array.from(new Set(mockInventory.map((i) => i.location)));

  const filtered = mockInventory.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.supplier ?? "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchLocation = locationFilter === "all" || item.location === locationFilter;
    return matchSearch && matchCategory && matchLocation;
  });

  const lowStock = mockInventory.filter((i) => i.quantity <= i.min_stock_level);
  const totalValue = mockInventory.reduce((s, i) => s + i.quantity * i.cost_per_unit, 0);

  const columns = [
    { key: "name", label: "Item Name", render: (item: InventoryItem) => <span className="font-medium">{item.name}</span> },
    { key: "category", label: "Category", render: (item: InventoryItem) => <StatusBadge status={item.category} /> },
    {
      key: "quantity",
      label: "Quantity",
      render: (item: InventoryItem) => (
        <span className={item.quantity <= item.min_stock_level ? "text-red-600 font-bold" : ""}>
          {item.quantity} {item.unit}
        </span>
      ),
    },
    { key: "min_stock_level", label: "Min Stock", render: (item: InventoryItem) => `${item.min_stock_level} ${item.unit}` },
    { key: "cost_per_unit", label: "Cost/Unit", render: (item: InventoryItem) => formatCurrency(item.cost_per_unit) },
    { key: "location", label: "Location", render: (item: InventoryItem) => <span className="capitalize">{item.location.replace("_", " ")}</span> },
    { key: "supplier", label: "Supplier", render: (item: InventoryItem) => item.supplier ?? "-" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Inventory</h1>
            <p className="text-gray-500 text-sm mt-1">Manage farm supplies and materials</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition">
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Items" value={mockInventory.length} icon={<Package className="w-5 h-5" />} />
          <StatCard label="Low Stock Alerts" value={lowStock.length} icon={<AlertTriangle className="w-5 h-5" />} color="bg-red-500" change={lowStock.length > 0 ? "Needs reorder" : "All stocked"} changeType={lowStock.length > 0 ? "down" : "up"} />
          <StatCard label="Total Value" value={formatCurrency(totalValue)} icon={<Package className="w-5 h-5" />} color="bg-blue-500" />
        </div>

        <Card>
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search inventory..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
              </select>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Locations</option>
                {locations.map((l) => <option key={l} value={l} className="capitalize">{l.replace("_", " ")}</option>)}
              </select>
            </div>
          </div>

          <DataTable columns={columns} data={filtered} keyExtractor={(item) => item.id} />
        </Card>
      </div>
    </DashboardLayout>
  );
}
