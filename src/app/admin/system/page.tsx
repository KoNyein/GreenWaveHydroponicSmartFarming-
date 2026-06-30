"use client";

import Link from "next/link";
import { useSettingsStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { t } from "@/lib/translations";
import {
  Settings,
  Database,
  Activity,
  ShieldCheck,
  AlertTriangle,
  Clock,
  RefreshCw,
  Download,
  Upload,
} from "lucide-react";

export default function AdminSystemPage() {
  const { locale } = useSettingsStore();
  const tr = (key: string) => t(key, locale);

  const systemStats = [
    { label: tr("adminSystem.uptime"), value: "99.98%", status: "good" },
    { label: tr("adminSystem.responseTime"), value: "124ms", status: "good" },
    { label: tr("adminSystem.cpuUsage"), value: "45.2%", status: "good" },
    { label: tr("adminSystem.memoryUsage"), value: "64.8%", status: "warning" },
    { label: tr("adminSystem.storageUsage"), value: "78.5%", status: "warning" },
    { label: tr("adminSystem.databaseSize"), value: "2.4 GB", status: "good" },
  ];

  const systemActions = [
    { href: "/admin/system/backups", label: tr("adminSystem.backups"), icon: Download, description: tr("adminSystem.backupsDesc") },
    { href: "/admin/system/logs", label: tr("adminSystem.systemLogs"), icon: FileText, description: tr("adminSystem.systemLogsDesc") },
    { href: "/admin/system/health", label: tr("adminSystem.healthMonitor"), icon: Activity, description: tr("adminSystem.healthMonitorDesc") },
    { href: "/admin/system/updates", label: tr("adminSystem.updates"), icon: RefreshCw, description: tr("adminSystem.updatesDesc") },
    { href: "/admin/system/security", label: tr("adminSystem.security"), icon: ShieldCheck, description: tr("adminSystem.securityDesc") },
    { href: "/admin/system/cache", label: tr("adminSystem.cache"), icon: Clock, description: tr("adminSystem.cacheDesc") },
  ];

  const alerts = [
    { type: 'warning', title: tr("adminSystem.storageWarning"), message: tr("adminSystem.storageWarningDesc"), time: '1 hour ago' },
    { type: 'info', title: tr("adminSystem.backupCompleted"), message: tr("adminSystem.backupCompletedDesc"), time: '2 hours ago' },
    { type: 'success', title: tr("adminSystem.updateAvailable"), message: tr("adminSystem.updateAvailableDesc"), time: '1 day ago' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-500/10 text-green-500';
      case 'warning':
        return 'bg-orange-500/10 text-orange-500';
      case 'critical':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-muted/10 text-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{tr("adminSystem.title")}</h1>
          <p className="text-muted text-sm mt-1">{tr("adminSystem.subtitle")}</p>
        </div>
        <Button size="sm" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          {tr("adminSystem.refresh")}
        </Button>
      </div>

      {/* System Status */}
      <Card title={tr("adminSystem.systemStatus")} subtitle={tr("adminSystem.realtimeMonitoring")}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {systemStats.map((stat) => (
            <div key={stat.label} className="text-center p-3">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted mt-1">{stat.label}</p>
              <div className="mt-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(stat.status)}`}>
                  {tr(`status.${stat.status}`)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title={tr("adminSystem.resourceUsage")}>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{tr("adminSystem.cpuUsage")}</span>
                <span className="text-sm font-medium">45.2%</span>
              </div>
              <Progress value={45.2} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{tr("adminSystem.memoryUsage")}</span>
                <span className="text-sm font-medium">64.8%</span>
              </div>
              <Progress value={64.8} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{tr("adminSystem.storageUsage")}</span>
                <span className="text-sm font-medium">78.5%</span>
              </div>
              <Progress value={78.5} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{tr("adminSystem.databaseUsage")}</span>
                <span className="text-sm font-medium">56.3%</span>
              </div>
              <Progress value={56.3} className="h-2" />
            </div>
          </div>
        </Card>

        <Card title={tr("adminSystem.systemAlerts")}>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.title}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg",
                  alert.type === 'warning' && "bg-orange-500/10 border border-orange-500/20",
                  alert.type === 'info' && "bg-blue-500/10 border border-blue-500/20",
                  alert.type === 'success' && "bg-green-500/10 border border-green-500/20"
                )}
              >
                <div className="flex-shrink-0">
                  {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-orange-500" />}
                  {alert.type === 'info' && <Activity className="w-5 h-5 text-blue-500" />}
                  {alert.type === 'success' && <ShieldCheck className="w-5 h-5 text-green-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{alert.title}</p>
                  <p className="text-sm text-muted">{alert.message}</p>
                  <p className="text-xs text-muted mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* System Actions */}
      <Card title={tr("adminSystem.systemActions")} subtitle={tr("adminSystem.manageSystem")}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systemActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.href}
                asChild
                variant="outline"
                className="flex flex-col items-start gap-3 py-6 h-full text-left"
              >
                <Link href={action.href} className="w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{action.label}</h3>
                      <p className="text-sm text-muted">{action.description}</p>
                    </div>
                  </div>
                </Link>
              </Button>
            );
          })}
        </div>
      </Card>

      {/* Database Info */}
      <Card title={tr("adminSystem.databaseInfo")}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4">
            <Database className="w-8 h-8 text-muted mx-auto mb-2" />
            <p className="text-2xl font-bold">PostgreSQL</p>
            <p className="text-sm text-muted">{tr("adminSystem.databaseType")}</p>
          </div>
          <div className="text-center p-4">
            <p className="text-2xl font-bold">14.7</p>
            <p className="text-sm text-muted">{tr("adminSystem.databaseVersion")}</p>
          </div>
          <div className="text-center p-4">
            <p className="text-2xl font-bold">2.4 GB</p>
            <p className="text-sm text-muted">{tr("adminSystem.databaseSize")}</p>
          </div>
          <div className="text-center p-4">
            <p className="text-2xl font-bold">42</p>
            <p className="text-sm text-muted">{tr("adminSystem.tables")}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href="/admin/database">
              <Database className="w-4 h-4" />
              {tr("adminSystem.manageDatabase")}
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Import cn for class merging
import { cn } from "@/lib/utils";

// Import FileText for system actions
import { FileText } from "lucide-react";
