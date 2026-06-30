"use client";

import { useState } from "react";
import { useSettingsStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { t } from "@/lib/translations";
import {
  Bell,
  ShoppingBag,
  MessageCircle,
  DollarSign,
  Package,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

export default function UserNotificationsPage() {
  const { locale } = useSettingsStore();
  const tr = (key: string) => t(key, locale);
  
  const [activeTab, setActiveTab] = useState('all');

  // Mock notifications
  const notifications = [
    { id: '1', type: 'order', title: 'Order #12345 has been shipped', message: 'Your order is on its way', time: '5 min ago', read: false },
    { id: '2', type: 'message', title: 'New message from Farm Team', message: 'You have a new message in the Farm Team channel', time: '1 hour ago', read: false },
    { id: '3', type: 'promotion', title: 'Special discount available', message: '20% off on all nutrients this week', time: '2 hours ago', read: true },
    { id: '4', type: 'order', title: 'Order #12344 delivered', message: 'Your order has been delivered', time: '1 day ago', read: true },
    { id: '5', type: 'stock', title: 'Back in stock', message: 'The hydroponic system you wanted is back in stock', time: '2 days ago', read: true },
    { id: '6', type: 'system', title: 'System update', message: 'New features have been added to the platform', time: '1 week ago', read: true },
  ];

  const tabs = [
    { id: 'all', label: tr("notifications.all"), count: notifications.length },
    { id: 'unread', label: tr("notifications.unread"), count: notifications.filter(n => !n.read).length },
    { id: 'order', label: tr("notifications.orders"), count: notifications.filter(n => n.type === 'order').length },
    { id: 'message', label: tr("notifications.messages"), count: notifications.filter(n => n.type === 'message').length },
    { id: 'promotion', label: tr("notifications.promotions"), count: notifications.filter(n => n.type === 'promotion').length },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return ShoppingBag;
      case 'message':
        return MessageCircle;
      case 'promotion':
        return DollarSign;
      case 'stock':
        return Package;
      case 'system':
        return Bell;
      default:
        return Bell;
    }
  };

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : activeTab === 'unread' 
      ? notifications.filter(n => !n.read) 
      : notifications.filter(n => n.type === activeTab);

  const markAllAsRead = () => {
    // Mark all as read logic
    console.log('Mark all as read');
  };

  const markAsRead = (id: string) => {
    // Mark as read logic
    console.log('Mark as read:', id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{tr("notifications.title")}</h1>
        <p className="text-muted text-sm mt-1">{tr("notifications.subtitle")}</p>
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
        
        <div className="flex justify-end mb-4">
          <Button variant="outline" size="sm" onClick={markAllAsRead} className="gap-2">
            <CheckCircle className="w-4 h-4" />
            {tr("notifications.markAllAsRead")}
          </Button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            return (
              <button
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={cn(
                  "w-full p-4 rounded-lg text-left hover:bg-hover-bg transition",
                  !notification.read && "bg-muted/50"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm">{notification.title}</h3>
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
    </div>
  );
}

// Import cn for class merging
import { cn } from "@/lib/utils";
