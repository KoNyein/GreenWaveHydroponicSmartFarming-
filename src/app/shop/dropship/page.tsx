"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, StatCard } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { mockDropshipOrders } from "@/lib/mock-data";
import type { DropshipOrder } from "@/types/database";
import { Truck, DollarSign, Package, Plus, TrendingUp } from "lucide-react";

export default function DropshipPage() {
  const totalRevenue = mockDropshipOrders.reduce((s, o) => s + o.total_amount, 0);
  const totalProfit = mockDropshipOrders.reduce((s, o) => s + o.profit, 0);
  const pendingOrders = mockDropshipOrders.filter((o) => o.status === "pending" || o.status === "processing");

  const columns = [
    { key: "order_number", label: "Order #", render: (o: DropshipOrder) => <span className="font-medium font-mono text-xs">{o.order_number}</span> },
    { key: "customer_name", label: "Customer", render: (o: DropshipOrder) => (
      <div>
        <p className="text-sm font-medium">{o.customer_name}</p>
        <p className="text-xs text-gray-500">{o.customer_email}</p>
      </div>
    )},
    { key: "total_amount", label: "Total", render: (o: DropshipOrder) => <span className="font-semibold">{formatCurrency(o.total_amount)}</span> },
    { key: "supplier_cost", label: "Cost", render: (o: DropshipOrder) => formatCurrency(o.supplier_cost) },
    { key: "profit", label: "Profit", render: (o: DropshipOrder) => <span className="text-green-600 font-medium">{formatCurrency(o.profit)}</span> },
    { key: "status", label: "Status", render: (o: DropshipOrder) => <StatusBadge status={o.status} /> },
    { key: "tracking_number", label: "Tracking", render: (o: DropshipOrder) => o.tracking_number ? <span className="font-mono text-xs">{o.tracking_number}</span> : "-" },
    { key: "created_at", label: "Date", render: (o: DropshipOrder) => formatDate(o.created_at) },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dropshipping</h1>
            <p className="text-gray-500 text-sm mt-1">Manage dropship orders and suppliers</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition">
            <Plus className="w-4 h-4" /> New Order
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatCard label="Total Orders" value={mockDropshipOrders.length} icon={<Truck className="w-5 h-5" />} />
          <StatCard label="Revenue" value={formatCurrency(totalRevenue)} icon={<DollarSign className="w-5 h-5" />} color="bg-blue-500" />
          <StatCard label="Total Profit" value={formatCurrency(totalProfit)} icon={<TrendingUp className="w-5 h-5" />} color="bg-green-600" />
          <StatCard label="Pending" value={pendingOrders.length} icon={<Package className="w-5 h-5" />} color="bg-orange-500" />
        </div>

        <Card title="All Dropship Orders">
          <DataTable columns={columns} data={mockDropshipOrders} keyExtractor={(o) => o.id} />
        </Card>
      </div>
    </DashboardLayout>
  );
}
