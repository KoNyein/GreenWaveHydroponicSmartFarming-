"use client";

import Link from "next/link";
import { useAuthStore, useSettingsStore } from "@/lib/store";
import { StatCard, Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { t } from "@/lib/translations";
import {
  LayoutDashboard,
  ShoppingBag,
  DollarSign,
  Package,
  MessageCircle,
  Bell,
  Calendar,
  TrendingUp,
  Clock,
} from "lucide-react";

const DEMO_NOW = new Date("2026-07-01T05:00:00.000Z").getTime();

export default function UserDashboardPage() {
  const { user } = useAuthStore();
  const { locale } = useSettingsStore();
  const tr = (key: string) => t(key, locale);

  // Mock data for demo
  const recentActivity = [
    { id: '1', type: 'order', title: 'Order #12345', status: 'delivered', date: new Date(DEMO_NOW).toISOString(), amount: 150.00 },
    { id: '2', type: 'message', title: 'New message from Farm Team', status: 'unread', date: new Date(DEMO_NOW - 3600000).toISOString() },
    { id: '3', type: 'purchase', title: 'Nutrients purchased', status: 'completed', date: new Date(DEMO_NOW - 86400000).toISOString(), amount: 75.50 },
  ];

  const quickActions = [
    { href: "/marketplace", label: tr("userDashboard.browseProducts"), icon: ShoppingBag, color: "bg-blue-500" },
    { href: "/user/orders", label: tr("userDashboard.myOrders"), icon: Package, color: "bg-green-500" },
    { href: "/messenger", label: tr("userDashboard.messages"), icon: MessageCircle, color: "bg-purple-500" },
    { href: "/user/profile", label: tr("userDashboard.myProfile"), icon: Clock, color: "bg-orange-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{tr("userDashboard.welcome")}, {user?.full_name || 'User'}!</h1>
          <p className="text-muted text-sm mt-1">{tr("userDashboard.welcomeSubtitle")}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/user/profile">{tr("userDashboard.editProfile")}</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/marketplace">{tr("userDashboard.goToMarketplace")}</Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={tr("userDashboard.totalOrders")}
          value="12"
          icon={<ShoppingBag className="w-5 h-5" />}
          change="+2 this month"
          changeType="up"
          color="bg-blue-500"
        />
        <StatCard
          label={tr("userDashboard.totalSpent")}
          value={formatCurrency(1250.00)}
          icon={<DollarSign className="w-5 h-5" />}
          change="+15%"
          changeType="up"
          color="bg-green-500"
        />
        <StatCard
          label={tr("userDashboard.pendingMessages")}
          value="3"
          icon={<MessageCircle className="w-5 h-5" />}
          change={tr("userDashboard.newMessages")}
          changeType="neutral"
          color="bg-purple-500"
        />
        <StatCard
          label={tr("userDashboard.wishlistItems")}
          value="8"
          icon={<Package className="w-5 h-5" />}
          change={tr("userDashboard.savedItems")}
          changeType="neutral"
          color="bg-orange-500"
        />
      </div>

      {/* Quick Actions */}
      <Card title={tr("userDashboard.quickActions")} subtitle={tr("userDashboard.quickActionsSubtitle")}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Button
              key={action.href}
              asChild
              variant="outline"
              className="flex flex-col items-center gap-2 py-6 h-full"
            >
              <Link href={action.href} className="w-full">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title={tr("userDashboard.recentActivity")} subtitle={tr("userDashboard.recentActivitySubtitle")}>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 bg-hover-bg rounded-lg">
                <div className="w-10 h-10 rounded-full bg-muted/20 flex items-center justify-center flex-shrink-0">
                  {activity.type === 'order' && <ShoppingBag className="w-5 h-5" />}
                  {activity.type === 'message' && <MessageCircle className="w-5 h-5" />}
                  {activity.type === 'purchase' && <DollarSign className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{activity.title}</p>
                  <p className="text-xs text-muted">{formatDateTime(activity.date)}</p>
                </div>
                <div className="text-right">
                  {activity.amount && <p className="font-semibold text-sm">{formatCurrency(activity.amount)}</p>}
                  <StatusBadge status={activity.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Notifications */}
        <Card title={tr("userDashboard.notifications")} subtitle={tr("userDashboard.notificationsSubtitle")}>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-hover-bg rounded-lg">
              <Bell className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{tr("userDashboard.newProductAlert")}</p>
                <p className="text-xs text-muted mt-1">{tr("userDashboard.newProductAlertDesc")}</p>
                <Button size="xs" variant="ghost" className="mt-2 h-6">
                  {tr("userDashboard.view")}
                </Button>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-hover-bg rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{tr("userDashboard.priceDropAlert")}</p>
                <p className="text-xs text-muted mt-1">{tr("userDashboard.priceDropAlertDesc")}</p>
                <Button size="xs" variant="ghost" className="mt-2 h-6">
                  {tr("userDashboard.view")}
                </Button>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-hover-bg rounded-lg">
              <Calendar className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{tr("userDashboard.orderUpdate")}</p>
                <p className="text-xs text-muted mt-1">{tr("userDashboard.orderUpdateDesc")}</p>
                <Button size="xs" variant="ghost" className="mt-2 h-6">
                  {tr("userDashboard.view")}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Marketplace Highlights */}
      <Card title={tr("userDashboard.marketplaceHighlights")} subtitle={tr("userDashboard.marketplaceHighlightsSubtitle")}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="font-semibold mb-1">{tr("userDashboard.featuredProducts")}</h3>
            <p className="text-sm text-muted mb-3">{tr("userDashboard.featuredProductsDesc")}</p>
            <Button asChild variant="outline" size="sm">
              <Link href="/marketplace">{tr("userDashboard.browseNow")}</Link>
            </Button>
          </div>
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="font-semibold mb-1">{tr("userDashboard.specialDeals")}</h3>
            <p className="text-sm text-muted mb-3">{tr("userDashboard.specialDealsDesc")}</p>
            <Button asChild variant="outline" size="sm">
              <Link href="/marketplace?filter=discount">{tr("userDashboard.viewDeals")}</Link>
            </Button>
          </div>
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="font-semibold mb-1">{tr("userDashboard.popularItems")}</h3>
            <p className="text-sm text-muted mb-3">{tr("userDashboard.popularItemsDesc")}</p>
            <Button asChild variant="outline" size="sm">
              <Link href="/marketplace?sort=popular">{tr("userDashboard.explore")}</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
