"use client";

import { useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { mockAnalyticsDaily } from "@/lib/phase4-mock-data";
import { useRouter } from "next/navigation";
import { BarChart2, TrendingUp, Users, FileText, DollarSign, ArrowLeft, Eye } from "lucide-react";

export default function AnalyticsPage() {
  const router = useRouter();
  const data = mockAnalyticsDaily;

  const totals = useMemo(() => {
    const latest = data[data.length - 1];
    const prev = data[data.length - 2];
    return {
      users: latest.total_users,
      usersGrowth: latest.total_users - prev.total_users,
      activeToday: latest.active_users,
      posts: latest.new_posts,
      pageViews: latest.page_views,
      revenue: latest.revenue,
      newUsers14d: data.reduce((s, d) => s + d.new_users, 0),
      totalRevenue14d: data.reduce((s, d) => s + d.revenue, 0),
    };
  }, [data]);

  const maxPageViews = Math.max(...data.map((d) => d.page_views));

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.push("/admin")} className="p-2 rounded-lg hover:bg-hover-bg">
            <ArrowLeft className="w-5 h-5 text-muted" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Analytics</h1>
            <p className="text-sm text-muted">Last 14 days</p>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card-bg border border-card-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-muted">Total Users</span>
            </div>
            <p className="text-xl font-bold text-foreground">{totals.users.toLocaleString()}</p>
            <p className="text-xs text-green-500 mt-1">+{totals.usersGrowth} today</p>
          </div>
          <div className="bg-card-bg border border-card-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-xs text-muted">New Users (14d)</span>
            </div>
            <p className="text-xl font-bold text-foreground">{totals.newUsers14d}</p>
            <p className="text-xs text-muted mt-1">~{Math.round(totals.newUsers14d / 14)}/day avg</p>
          </div>
          <div className="bg-card-bg border border-card-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-muted">Page Views Today</span>
            </div>
            <p className="text-xl font-bold text-foreground">{totals.pageViews.toLocaleString()}</p>
            <p className="text-xs text-muted mt-1">{totals.activeToday} active users</p>
          </div>
          <div className="bg-card-bg border border-card-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-amber-500" />
              <span className="text-xs text-muted">Revenue (14d)</span>
            </div>
            <p className="text-xl font-bold text-foreground">${totals.totalRevenue14d.toFixed(0)}</p>
            <p className="text-xs text-muted mt-1">${totals.revenue.toFixed(0)} today</p>
          </div>
        </div>

        {/* Page Views Chart (ASCII bar chart) */}
        <div className="bg-card-bg border border-card-border rounded-xl p-4 mb-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">Page Views (14 days)</h2>
          <div className="space-y-2">
            {data.map((day) => {
              const pct = (day.page_views / maxPageViews) * 100;
              const date = new Date(day.date);
              const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              return (
                <div key={day.id} className="flex items-center gap-3">
                  <span className="text-xs text-muted w-12 text-right">{label}</span>
                  <div className="flex-1 h-6 bg-hover-bg rounded-md overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-md transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted w-14 text-right">{day.page_views.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Breakdown Table */}
        <div className="bg-card-bg border border-card-border rounded-xl p-4 overflow-x-auto">
          <h2 className="text-sm font-semibold text-foreground mb-4">Daily Breakdown</h2>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-muted border-b border-card-border">
                <th className="pb-2 pr-4">Date</th>
                <th className="pb-2 pr-4">New Users</th>
                <th className="pb-2 pr-4">Active</th>
                <th className="pb-2 pr-4">Posts</th>
                <th className="pb-2 pr-4">Views</th>
                <th className="pb-2 pr-4">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {[...data].reverse().map((day) => (
                <tr key={day.id} className="border-b border-card-border/50">
                  <td className="py-2 pr-4 text-foreground">{new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                  <td className="py-2 pr-4 text-green-600">+{day.new_users}</td>
                  <td className="py-2 pr-4 text-foreground">{day.active_users}</td>
                  <td className="py-2 pr-4 text-foreground">{day.new_posts}</td>
                  <td className="py-2 pr-4 text-foreground">{day.page_views.toLocaleString()}</td>
                  <td className="py-2 pr-4 text-amber-600">${day.revenue.toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
