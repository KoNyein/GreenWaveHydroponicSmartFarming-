"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, StatCard } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { useSettingsStore } from "@/lib/store";
import { t } from "@/lib/translations";
import { mockSales, mockSaleItems } from "@/lib/mock-data";
import type { Sale } from "@/types/database";
import { DollarSign, TrendingUp, ShoppingCart, CreditCard } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SalesPage() {
  const { locale } = useSettingsStore();
  const tr = (key: string) => t(key, locale);
  const totalRevenue = mockSales.reduce((s, sale) => s + sale.total_amount, 0);
  const completedSales = mockSales.filter((s) => s.status === "completed");
  const totalTax = mockSales.reduce((s, sale) => s + sale.tax_amount, 0);
  const avgSale = totalRevenue / (mockSales.length || 1);

  const chartData = mockSales.map((sale) => ({
    name: sale.customer_name ?? "Walk-in",
    amount: sale.total_amount,
    tax: sale.tax_amount,
  }));

  const columns = [
    { key: "customer_name", label: tr("sales.customer"), render: (s: Sale) => <span className="font-medium">{s.customer_name ?? "Walk-in"}</span> },
    { key: "total_amount", label: tr("sales.amount"), render: (s: Sale) => <span className="font-semibold">{formatCurrency(s.total_amount)}</span> },
    { key: "discount_amount", label: tr("sales.discount"), render: (s: Sale) => formatCurrency(s.discount_amount) },
    { key: "tax_amount", label: "Tax", render: (s: Sale) => formatCurrency(s.tax_amount) },
    { key: "payment_method", label: tr("pos.payment"), render: (s: Sale) => <span className="capitalize">{s.payment_method}</span> },
    { key: "status", label: tr("sales.status"), render: (s: Sale) => <StatusBadge status={s.status} /> },
    { key: "created_at", label: tr("pos.date"), render: (s: Sale) => formatDateTime(s.created_at) },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{tr("sales.title")}</h1>
          <p className="text-muted text-sm mt-1">{tr("sales.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatCard label={tr("sales.totalRevenue")} value={formatCurrency(totalRevenue)} icon={<DollarSign className="w-5 h-5" />} />
          <StatCard label={tr("sales.completedSales")} value={completedSales.length} icon={<ShoppingCart className="w-5 h-5" />} color="bg-green-600" />
          <StatCard label={tr("sales.averageSale")} value={formatCurrency(avgSale)} icon={<TrendingUp className="w-5 h-5" />} color="bg-blue-500" />
          <StatCard label={tr("sales.totalTax")} value={formatCurrency(totalTax)} icon={<CreditCard className="w-5 h-5" />} color="bg-purple-500" />
        </div>

        <Card title={tr("sales.revenueOverview")}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="amount" fill="#16a34a" radius={[4, 4, 0, 0]} name="Amount" />
                <Bar dataKey="tax" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Tax" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title={tr("sales.allTransactions")}>
          <DataTable columns={columns} data={mockSales} keyExtractor={(s) => s.id} />
        </Card>

        <Card title={tr("sales.recentItems")}>
          <div className="space-y-2">
            {mockSaleItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium">{item.product_name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity} x {formatCurrency(item.unit_price)}</p>
                </div>
                <span className="font-semibold text-sm">{formatCurrency(item.total_price)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
