"use client";

import Link from "next/link";
import { useSettingsStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { t } from "@/lib/translations";
import {
  MessageCircle,
  Users,
  ShieldCheck,
  AlertTriangle,
  BarChart3,
  Plus,
} from "lucide-react";

export default function AdminMessengerPage() {
  const { locale } = useSettingsStore();
  const tr = (key: string) => t(key, locale);

  const stats = [
    { label: tr("adminMessenger.totalChannels"), value: "24", icon: MessageCircle, color: "bg-blue-500" },
    { label: tr("adminMessenger.totalUsers"), value: "1247", icon: Users, color: "bg-green-500" },
    { label: tr("adminMessenger.reportedMessages"), value: "12", icon: AlertTriangle, color: "bg-orange-500" },
    { label: tr("adminMessenger.activeModerators"), value: "3", icon: ShieldCheck, color: "bg-purple-500" },
  ];

  const quickActions = [
    { href: "/admin/messenger/channels", label: tr("adminMessenger.manageChannels"), icon: MessageCircle },
    { href: "/admin/messenger/users", label: tr("adminMessenger.manageUsers"), icon: Users },
    { href: "/admin/messenger/reports", label: tr("adminMessenger.viewReports"), icon: AlertTriangle },
    { href: "/admin/messenger/settings", label: tr("adminMessenger.settings"), icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{tr("adminMessenger.title")}</h1>
          <p className="text-muted text-sm mt-1">{tr("adminMessenger.subtitle")}</p>
        </div>
        <Button asChild size="sm" className="gap-2">
          <Link href="/admin/messenger/channels/new">
            <Plus className="w-4 h-4" />
            {tr("adminMessenger.createChannel")}
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
      <Card title={tr("adminMessenger.quickActions")}>
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
      <Card title={tr("adminMessenger.recentActivity")}>
        <div className="text-center py-8">
          <MessageCircle className="w-12 h-12 text-muted mx-auto mb-4" />
          <p className="text-muted mb-4">{tr("adminMessenger.comingSoon")}</p>
          <Button asChild>
            <Link href="/messenger">{tr("adminMessenger.viewMessenger")}</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Import Settings for quick actions
import { Settings } from "lucide-react";
