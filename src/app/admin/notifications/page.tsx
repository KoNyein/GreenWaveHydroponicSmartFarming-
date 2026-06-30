"use client";

import Link from "next/link";
import { useState } from "react";
import { useSettingsStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { t } from "@/lib/translations";
import {
  Bell,
  MessageCircle,
  ShoppingBag,
  Users,
  AlertTriangle,
  ShieldCheck,
  CheckCircle,
  Clock,
  Plus,
} from "lucide-react";

export default function AdminNotificationsPage() {
  const { locale } = useSettingsStore();
  const tr = (key: string) => t(key, locale);
  
  const [activeTab, setActiveTab] = useState('all');

  // Mock notifications
  const notifications = [
    { id: '1', type: 'system', title: 'System alert: High CPU usage', message: 'CPU usage is above 90% threshold', time: '5 min ago', read: false, priority: 'high' },
    { id: '2', type: 'user', title: 'New user registered', message: 'john@example.com has registered', time: '1 hour ago', read: false, priority: 'medium' },
    { id: '3', type: 'order', title: 'Payment failed', message: 'Order #12345 payment processing failed', time: '2 hours ago', read: true, priority: 'high' },
    { id: '4', type: 'report', title: 'Content reported', message: 'User reported inappropriate content in marketplace', time: '1 day ago', read: true, priority: 'medium' },
    { id: '5', type: 'security', title: 'Suspicious login attempt', message: 'Multiple failed login attempts detected', time: '2 days ago', read: true, priority: 'high' },
  ];

  const tabs = [
    { id: 'all', label: tr("notifications.all"), count: notifications.length },
    { id: 'unread', label: tr("notifications.unread"), count: notifications.filter(n => !n.read).length },
    { id: 'high', label: tr("notifications.highPriority"), count: notifications.filter(n => n.priority === 'high').length },
    { id: 'system', label: tr("notifications.system"), count: notifications.filter(n => n.type === 'system').length },
    { id: 'user', label: tr("notifications.users"), count: notifications.filter(n => n.type === 'user').length },
    { id: 'order', label: tr("notifications.orders"), count: notifications.filter(n => n.type === 'order').length },
    { id: 'report', label: tr("notifications.reports"), count: notifications.filter(n => n.type === 'report').length },
    { id: 'security', label: tr("notifications.security"), count: notifications.filter(n => n.type === 'security').length },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'system':
        return Bell;
      case 'user':
        return Users;
      case 'order':
        return ShoppingBag;
      case 'report':
        return AlertTriangle;
      case 'security':
        return ShieldCheck;
      default:
        return Bell;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-500 border border-red-500/20';
      case 'medium':
        return 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
      case 'low':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      default:
        return 'bg-muted/10 text-muted border border-muted/20';
    }
  };

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : activeTab === 'unread' 
      ? notifications.filter(n => !n.read) 
      : activeTab === 'high' 
        ? notifications.filter(n => n.priority === 'high')
        : notifications.filter(n => n.type === activeTab);

  const markAllAsRead = () => {
    // Mark all as read logic
    console.log('Mark all as read');
  };

  const createNotification = () => {
    // Create notification logic
    console.log('Create notification');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{tr("adminNotifications.title")}</h1>
          <p className="text-muted text-sm mt-1">{tr("adminNotifications.subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead} className="gap-2">
            <CheckCircle className="w-4 h-4" />
            {tr("notifications.markAllAsRead")}
          </Button>
          <Button size="sm" onClick={createNotification} className="gap-2">
            <Plus className="w-4 h-4" />
            {tr("adminNotifications.create")}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Card>
        <div className="flex flex-wrap gap-2 border-b border-border pb-4 mb-4">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="gap-2"
            >
              {tab.label}
              {tab.count > 0 && (
                <Badge variant={activeTab === tab.id ? 'default' : 'secondary'} className="px-1.5 py-0.5 text-xs">
                  {tab.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            return (
              <button
                key={notification.id}
                className={cn(
                  "w-full p-4 rounded-lg text-left hover:bg-hover-bg transition",
                  !notification.read && "bg-muted/50"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm">{notification.title}</h3>
                      <Badge variant={notification.priority} className={getPriorityColor(notification.priority)}>
                        {tr(`priority.${notification.priority}`)}
                      </Badge>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted">{notification.message}</p>
                    <p className="text-xs text-muted mt-1">{notification.time}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted">{tr("notifications.noNotifications")}</p>
          </div>
        )}
      </Card>

      {/* Notification Settings */}
      <Card title={tr("adminNotifications.settings")}>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div>
              <h3 className="font-medium">{tr("adminNotifications.emailNotifications")}</h3>
              <p className="text-sm text-muted">{tr("adminNotifications.emailNotificationsDesc")}</p>
            </div>
            <Button variant="outline" size="sm">
              {tr("common.manage")}
            </Button>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div>
              <h3 className="font-medium">{tr("adminNotifications.pushNotifications")}</h3>
              <p className="text-sm text-muted">{tr("adminNotifications.pushNotificationsDesc")}</p>
            </div>
            <Button variant="outline" size="sm">
              {tr("common.manage")}
            </Button>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <h3 className="font-medium">{tr("adminNotifications.notificationTemplates")}</h3>
              <p className="text-sm text-muted">{tr("adminNotifications.notificationTemplatesDesc")}</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/notifications/templates">{tr("common.manage")}</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Import cn for class merging
import { cn } from "@/lib/utils";

// Import priority types for Badge
import { BadgeProps } from "@/components/ui/Badge";

declare module "@/components/ui/Badge" {
  interface BadgeProps {
    variant?: "default" | "secondary" | "destructive" | "outline" | "high" | "medium" | "low";
  }
}
