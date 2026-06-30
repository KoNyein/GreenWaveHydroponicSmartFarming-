"use client";

import Link from "next/link";
import { useSettingsStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { t } from "@/lib/translations";
import {
  ShoppingBag,
  Package,
  Users,
  DollarSign,
  BarChart3,
  Plus,
  Settings,
} from "lucide-react";

export default function AdminMarketplacePage() {
  const { locale } = useSettingsStore();
  const tr = (key: string) => t(key, locale);

  const stats = [
    { label: tr("adminMarketplace.totalProducts"), value: "245", icon: Package, color: "bg-blue-500" },
    { label: tr("adminMarketplace.totalSellers"), value: "42", icon: Users, color: "bg-green-500" },
    { label: tr("adminMarketplace.totalSales"), value: "$12,450", icon: DollarSign, color: "bg-purple-500" },
    { label: tr("adminMarketplace.commissionEarned"), value: "$622.50", icon: BarChart3, color: "bg-orange-500" },
  ];

  const quickActions = [
    { href: "/admin/marketplace/products", label: tr("adminMarketplace.manageProducts"), icon: Package },
    { href: "/admin/marketplace/sellers", label: tr("adminMarketplace.manageSellers"), icon: Users },
    { href: "/admin/marketplace/orders", label: tr("adminMarketplace.viewOrders"), icon: ShoppingBag },
    { href: "/admin/marketplace/settings", label: tr("adminMarketplace.settings"), icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{tr("adminMarketplace.title")}</h1>
          <p className="text-muted text-sm mt-1">{tr("adminMarketplace.subtitle")}</p>
        </div>
        <Button asChild size="sm" className="gap-2">
          <Link href="/admin/marketplace/products/new">
            <Plus className="w-4 h-4" />
            {tr("adminMarketplace.addProduct")}
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}/10`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card title={tr("adminMarketplace.quickActions")}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Button
              key={action.href}
              asChild
              variant="outline"
              className="flex flex-col items-center gap-2 py-6 h-full"
            >
              <Link href={action.href} className="w-full">
                <div className="w-10 h-10 bg-muted/20 rounded-lg flex items-center justify-center">
                  <action.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </Card>

      {/* Content Placeholder */}
      <Card title={tr("adminMarketplace.recentActivity")}>
        <div className="text-center py-8">
          <ShoppingBag className="w-12 h-12 text-muted mx-auto mb-4" />
          <p className="text-muted mb-4">{tr("adminMarketplace.comingSoon")}</p>
          <Button asChild>
            <Link href="/admin/marketplace/products">{tr("adminMarketplace.viewProducts")}</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
