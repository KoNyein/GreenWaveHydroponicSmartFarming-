"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { mockAdminStats, mockReports, mockAnalyticsDaily, mockModerationActions } from "@/lib/phase4-mock-data";
import { useRouter } from "next/navigation";
import {
  Users, FileText, AlertTriangle, DollarSign, TrendingUp,
  UserPlus, Shield, BarChart2, Flag, Activity
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const stats = mockAdminStats;
  const pendingReports = mockReports.filter((r) => r.status === "pending");
  const recentAnalytics = mockAnalyticsDaily[mockAnalyticsDaily.length - 1];

  const statCards = [
    { label: "Total Users", value: stats.totalUsers.toLocaleString(), icon: Users, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { label: "Active Today", value: stats.activeToday.toLocaleString(), icon: Activity, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
    { label: "Total Posts", value: stats.totalPosts.toLocaleString(), icon: FileText, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
    { label: "Pending Reports", value: stats.pendingReports.toString(), icon: AlertTriangle, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30" },
    { label: "Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30" },
    { label: "New This Week", value: stats.newUsersThisWeek.toString(), icon: UserPlus, color: "text-cyan-500", bg: "bg-cyan-100 dark:bg-cyan-900/30" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted">System overview and management</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statCards.map((card) => (
            <div key={card.label} className="bg-card-bg border border-card-border rounded-xl p-4">
              <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center mb-2`}>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <p className="text-lg font-bold text-foreground">{card.value}</p>
              <p className="text-xs text-muted">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => router.push("/admin/reports")}
            className="flex items-center gap-3 p-4 bg-card-bg border border-card-border rounded-xl hover:border-primary/30 transition text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <Flag className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Moderation Queue</p>
              <p className="text-xs text-muted">{pendingReports.length} pending reports</p>
            </div>
          </button>
          <button
            onClick={() => router.push("/admin/analytics")}
            className="flex items-center gap-3 p-4 bg-card-bg border border-card-border rounded-xl hover:border-primary/30 transition text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Analytics</p>
              <p className="text-xs text-muted">{recentAnalytics?.page_views.toLocaleString()} views today</p>
            </div>
          </button>
          <button
            onClick={() => router.push("/activity")}
            className="flex items-center gap-3 p-4 bg-card-bg border border-card-border rounded-xl hover:border-primary/30 transition text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Activity className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Activity Log</p>
              <p className="text-xs text-muted">Recent system activity</p>
            </div>
          </button>
        </div>

        {/* Recent Reports */}
        <div className="bg-card-bg border border-card-border rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Recent Reports</h2>
            <button onClick={() => router.push("/admin/reports")} className="text-xs text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {pendingReports.slice(0, 4).map((report) => (
              <div key={report.id} className="flex items-center gap-3 p-3 bg-hover-bg rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  report.reason === "spam" ? "bg-yellow-100 dark:bg-yellow-900/30" :
                  report.reason === "harassment" ? "bg-red-100 dark:bg-red-900/30" :
                  "bg-orange-100 dark:bg-orange-900/30"
                }`}>
                  <AlertTriangle className={`w-4 h-4 ${
                    report.reason === "spam" ? "text-yellow-600" :
                    report.reason === "harassment" ? "text-red-600" :
                    "text-orange-600"
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground capitalize">{report.reason.replace("_", " ")}</p>
                  <p className="text-xs text-muted truncate">{report.description || `${report.target_type} reported`}</p>
                </div>
                <span className="text-xs text-muted">{new Date(report.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Moderation Actions */}
        <div className="bg-card-bg border border-card-border rounded-xl p-4">
          <h2 className="text-sm font-semibold text-foreground mb-4">Recent Moderation Actions</h2>
          <div className="space-y-2">
            {mockModerationActions.slice(0, 5).map((mod) => (
              <div key={mod.id} className="flex items-center gap-3 p-2 text-sm">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  mod.action === "delete" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                  mod.action === "ban" || mod.action === "suspend" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                  mod.action === "warn" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                }`}>
                  {mod.action}
                </span>
                <span className="text-muted capitalize">{mod.target_type}</span>
                <span className="text-xs text-muted ml-auto">{new Date(mod.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
