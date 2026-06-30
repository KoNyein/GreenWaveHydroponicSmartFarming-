"use client";

import Link from "next/link";
import { useSettingsStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { t } from "@/lib/translations";
import {
  BarChart3,
  Users,
  ShoppingBag,
  DollarSign,
  Package,
  FileText,
  Calendar,
  Download,
} from "lucide-react";

export default function AdminReportsPage() {
  const { locale } = useSettingsStore();
  const tr = (key: string) => t(key, locale);

  const reportTypes = [
    {
      title: tr("adminReports.salesReports"),
      description: tr("adminReports.salesReportsDesc"),
      icon: DollarSign,
      href: "/admin/reports/sales",
      color: "bg-green-500",
    },
    {
      title: tr("adminReports.userReports"),
      description: tr("adminReports.userReportsDesc"),
      icon: Users,
      href: "/admin/reports/users",
      color: "bg-blue-500",
    },
    {
      title: tr("adminReports.productReports"),
      description: tr("adminReports.productReportsDesc"),
      icon: Package,
      href: "/admin/reports/products",
      color: "bg-purple-500",
    },
    {
      title: tr("adminReports.orderReports"),
      description: tr("adminReports.orderReportsDesc"),
      icon: ShoppingBag,
      href: "/admin/reports/orders",
      color: "bg-orange-500",
    },
    {
      title: tr("adminReports.financialReports"),
      description: tr("adminReports.financialReportsDesc"),
      icon: BarChart3,
      href: "/admin/reports/financial",
      color: "bg-teal-500",
    },
    {
      title: tr("adminReports.activityReports"),
      description: tr("adminReports.activityReportsDesc"),
      icon: Calendar,
      href: "/admin/reports/activity",
      color: "bg-pink-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{tr("adminReports.title")}</h1>
          <p className="text-muted text-sm mt-1">{tr("adminReports.subtitle")}</p>
        </div>
        <Button asChild size="sm" className="gap-2">
          <Link href="/admin/reports/export">
            <Download className="w-4 h-4" />
            {tr("adminReports.exportAll")}
          </Link>
        </Button>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.title} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${report.color}/10`}>
                    <Icon className={`w-6 h-6 ${report.color}`} />
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={report.href}>{tr("common.view")}</Link>
                  </Button>
                </div>
                <h3 className="text-lg font-semibold mb-2">{report.title}</h3>
                <p className="text-sm text-muted">{report.description}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <Card title={tr("adminReports.quickStats")}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4">
            <p className="text-2xl font-bold">1247</p>
            <p className="text-sm text-muted">{tr("adminReports.totalUsers")}</p>
          </div>
          <div className="text-center p-4">
            <p className="text-2xl font-bold">$245,890</p>
            <p className="text-sm text-muted">{tr("adminReports.totalRevenue")}</p>
          </div>
          <div className="text-center p-4">
            <p className="text-2xl font-bold">1567</p>
            <p className="text-sm text-muted">{tr("adminReports.totalOrders")}</p>
          </div>
          <div className="text-center p-4">
            <p className="text-2xl font-bold">342</p>
            <p className="text-sm text-muted">{tr("adminReports.totalProducts")}</p>
          </div>
        </div>
      </Card>

      {/* Recent Reports */}
      <Card title={tr("adminReports.recentReports")}>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-hover-bg rounded-lg">
            <div className="flex items-center gap-4">
              <FileText className="w-6 h-6 text-muted" />
              <div>
                <p className="font-medium">{tr("adminReports.monthlySales")}</p>
                <p className="text-sm text-muted">June 2024</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">$45,890</p>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/reports/sales">{tr("common.view")}</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-hover-bg rounded-lg">
            <div className="flex items-center gap-4">
              <Users className="w-6 h-6 text-muted" />
              <div>
                <p className="font-medium">{tr("adminReports.userGrowth")}</p>
                <p className="text-sm text-muted">Q2 2024</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">+127</p>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/reports/users">{tr("common.view")}</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-hover-bg rounded-lg">
            <div className="flex items-center gap-4">
              <Package className="w-6 h-6 text-muted" />
              <div>
                <p className="font-medium">{tr("adminReports.topProducts")}</p>
                <p className="text-sm text-muted">June 2024</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">42</p>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/reports/products">{tr("common.view")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
