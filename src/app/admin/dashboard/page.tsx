"use client";

import Link from "next/link";
import { useAuthStore, useSettingsStore } from "@/lib/store";
import { StatCard, Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/utils";
import { t } from "@/lib/translations";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  DollarSign,
  Package,
  MessageCircle,
  BarChart3,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Plus,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const { locale } = useSettingsStore();
  const tr = (key: string) => t(key, locale);

  // Mock data for admin dashboard
  const stats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalSales: 245890.50,
    totalOrders: 1567,
    pendingOrders: 42,
    totalProducts: 342,
    lowStockItems: 18,
    totalMessages: 234,
    unresolvedTickets: 12,
    systemHealth: 98.5,
  };

  const recentUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'member', status: 'active', joined: new Date().toISOString() },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'staff', status: 'active', joined: new Date(Date.now() - 86400000).toISOString() },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'member', status: 'pending', joined: new Date(Date.now() - 172800000).toISOString() },
  ];

  const systemAlerts = [
    { id: '1', type: 'warning', title: 'Low stock alert', message: '18 items below minimum stock level', time: '5 min ago' },
    { id: '2', type: 'error', title: 'Payment failed', message: 'Order #12345 payment processing failed', time: '1 hour ago' },
    { id: '3', type: 'info', title: 'New user registered', message: 'john@example.com joined the platform', time: '2 hours ago' },
  ];

  const quickActions = [
    { href: "/admin/users/new", label: tr("adminDashboard.addUser"), icon: Users, color: "bg-blue-500" },
    { href: "/admin/products/new", label: tr("adminDashboard.addProduct"), icon: Package, color: "bg-green-500" },
    { href: "/admin/orders", label: tr("adminDashboard.viewOrders"), icon: ShoppingBag, color: "bg-purple-500" },
    { href: "/admin/settings", label: tr("adminDashboard.systemSettings"), icon: ShieldCheck, color: "bg-orange-500" },
  ];

  const salesTrend = [
    { month: 'Jan', sales: 45000, orders: 320 },
    { month: 'Feb', sales: 52000, orders: 380 },
    { month: 'Mar', sales: 48000, orders: 350 },
    { month: 'Apr', sales: 61000, orders: 420 },
    { month: 'May', sales: 58000, orders: 400 },
    { month: 'Jun', sales: 72000, orders: 480 },
  ];

  const maxSales = Math.max(...salesTrend.map(s => s.sales));

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{tr("adminDashboard.welcome")}, Admin!</h1>
          <p className="text-muted text-sm mt-1">{tr("adminDashboard.welcomeSubtitle")}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/reports">{tr("adminDashboard.viewReports")}</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/admin/settings">
              {tr("adminDashboard.systemSettings")}
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <StatCard
          label={tr("adminDashboard.totalUsers")}
          value={formatNumber(stats.totalUsers)}
          icon={<Users className="w-5 h-5" />}
          change={`+${formatNumber(47)} ${tr("adminDashboard.thisMonth")}`}
          changeType="up"
          color="bg-blue-500"
        />
        <StatCard
          label={tr("adminDashboard.totalSales")}
          value={formatCurrency(stats.totalSales)}
          icon={<DollarSign className="w-5 h-5" />}
          change="+12.5%"
          changeType="up"
          color="bg-green-500"
        />
        <StatCard
          label={tr("adminDashboard.totalOrders")}
          value={formatNumber(stats.totalOrders)}
          icon={<ShoppingBag className="w-5 h-5" />}
          change={`+${formatNumber(89)} ${tr("adminDashboard.orders")}`}
          changeType="up"
          color="bg-purple-500"
        />
        <StatCard
          label={tr("adminDashboard.pendingOrders")}
          value={formatNumber(stats.pendingOrders)}
          icon={<Clock className="w-5 h-5" />}
          change={tr("adminDashboard.needsAction")}
          changeType="down"
          color="bg-orange-500"
        />
        <StatCard
          label={tr("adminDashboard.systemHealth")}
          value={`${stats.systemHealth}%`}
          icon={<Activity className="w-5 h-5" />}
          change={tr("adminDashboard.operational")}
          changeType="up"
          color="bg-teal-500"
        />
      </div>

      {/* Quick Actions */}
      <Card title={tr("adminDashboard.quickActions")} subtitle={tr("adminDashboard.quickActionsSubtitle")}>
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <Card title={tr("adminDashboard.salesTrend")} subtitle={tr("adminDashboard.last6Months")}>
          <div className="h-64 flex items-end gap-2">
            {salesTrend.map((data) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                  style={{ height: `${(data.sales / maxSales) * 100}%` }}
                />
                <span className="text-xs text-muted">{data.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-500">+15.2% {tr("adminDashboard.growth")}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-500">+23% {tr("adminDashboard.orders")}</span>
            </div>
          </div>
        </Card>

        {/* System Status */}
        <Card title={tr("adminDashboard.systemStatus")} subtitle={tr("adminDashboard.realtimeMonitoring")}>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{tr("adminDashboard.cpuUsage")}</span>
                <span className="text-sm font-medium">78.5%</span>
              </div>
              <Progress value={78.5} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{tr("adminDashboard.memoryUsage")}</span>
                <span className="text-sm font-medium">64.2%</span>
              </div>
              <Progress value={64.2} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{tr("adminDashboard.storageUsage")}</span>
                <span className="text-sm font-medium">45.8%</span>
              </div>
              <Progress value={45.8} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{tr("adminDashboard.databaseHealth")}</span>
                <span className="text-sm font-medium">99.1%</span>
              </div>
              <Progress value={99.1} className="h-2" />
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Alerts */}
        <Card title={tr("adminDashboard.systemAlerts")} subtitle={tr("adminDashboard.recentNotifications")}>
          <div className="space-y-3">
            {systemAlerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg",
                  alert.type === 'error' && "bg-red-500/10 border border-red-500/20",
                  alert.type === 'warning' && "bg-orange-500/10 border border-orange-500/20",
                  alert.type === 'info' && "bg-blue-500/10 border border-blue-500/20"
                )}
              >
                <div className="flex-shrink-0">
                  {alert.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                  {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-orange-500" />}
                  {alert.type === 'info' && <Activity className="w-5 h-5 text-blue-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{alert.title}</p>
                  <p className="text-xs text-muted">{alert.message}</p>
                  <p className="text-xs text-muted mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Users */}
        <Card title={tr("adminDashboard.recentUsers")} subtitle={tr("adminDashboard.newlyRegistered")}>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between py-2 border-b border-card-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-muted/20 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={user.status} size="sm" />
                  <p className="text-xs text-muted mt-1">{formatDateTime(user.joined)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/admin/users">{tr("adminDashboard.viewAllUsers")}</Link>
            </Button>
          </div>
        </Card>
      </div>

      {/* Admin Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title={tr("adminDashboard.marketplaceOverview")} subtitle={tr("adminDashboard.platformStats")}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">{tr("adminDashboard.totalProducts")}</span>
              <span className="font-semibold">{formatNumber(stats.totalProducts)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{tr("adminDashboard.lowStockItems")}</span>
              <span className="font-semibold text-orange-500">{formatNumber(stats.lowStockItems)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{tr("adminDashboard.totalMessages")}</span>
              <span className="font-semibold">{formatNumber(stats.totalMessages)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{tr("adminDashboard.unresolvedTickets")}</span>
              <span className="font-semibold text-red-500">{formatNumber(stats.unresolvedTickets)}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/admin/marketplace">{tr("adminDashboard.manageMarketplace")}</Link>
            </Button>
          </div>
        </Card>

        <Card title={tr("adminDashboard.financialOverview")} subtitle={tr("adminDashboard.revenueStats")}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">{tr("adminDashboard.totalRevenue")}</span>
              <span className="font-semibold text-green-500">{formatCurrency(stats.totalSales)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{tr("adminDashboard.avgOrderValue")}</span>
              <span className="font-semibold">{formatCurrency(stats.totalSales / stats.totalOrders)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{tr("adminDashboard.conversionRate")}</span>
              <span className="font-semibold text-blue-500">2.45%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{tr("adminDashboard.refundRate")}</span>
              <span className="font-semibold text-orange-500">1.2%</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/admin/reports/financial">{tr("adminDashboard.viewFinancialReports")}</Link>
            </Button>
          </div>
        </Card>

        <Card title={tr("adminDashboard.securityOverview")} subtitle={tr("adminDashboard.platformSecurity")}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">{tr("adminDashboard.activeAdmins")}</span>
              <span className="font-semibold">3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{tr("adminDashboard.pendingVerifications")}</span>
              <span className="font-semibold text-orange-500">7</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{tr("adminDashboard.blockedUsers")}</span>
              <span className="font-semibold text-red-500">2</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{tr("adminDashboard.systemLogs")}</span>
              <span className="font-semibold">{formatNumber(1247)}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/admin/settings/security">{tr("adminDashboard.securitySettings")}</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
