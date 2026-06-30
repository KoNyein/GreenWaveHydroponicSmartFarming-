"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebarStore, useSettingsStore, useAuthStore } from "@/lib/store";
import { t } from "@/lib/translations";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import {
  Menu,
  Bell,
  Search,
  ShoppingCart,
  ChevronDown,
  UserCircle,
  Crown,
} from "lucide-react";
import { useState } from "react";

export default function AdminHeader() {
  const pathname = usePathname();
  const { isCollapsed, toggle } = useSidebarStore();
  const { locale, setLocale } = useSettingsStore();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const tr = (key: string) => t(key, locale);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement admin search logic
      console.log("Admin searching for:", searchQuery);
    }
  };

  const notifications = [
    { id: 1, title: "New user registered", time: "5 min ago", unread: true, type: 'user' },
    { id: 2, title: "System alert", time: "1 hour ago", unread: true, type: 'system' },
    { id: 3, title: "Payment dispute", time: "2 hours ago", unread: false, type: 'order' },
    { id: 4, title: "Backup completed", time: "1 day ago", unread: false, type: 'system' },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-header-bg/80 backdrop-blur-lg border-b border-border h-16">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggle}
            className="lg:hidden p-2 rounded-lg hover:bg-hover-bg transition"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm font-medium">{tr("app.name")}</span>
            <span className="text-muted">/</span>
            <span className="text-sm font-medium text-accent">Admin</span>
            <span className="text-muted">/</span>
            <span className="text-sm text-muted truncate max-w-[200px]">
              {pathname.split('/').filter(Boolean).slice(1).join(' / ')}
            </span>
          </div>
        </div>

        {/* Center - Search */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <Input
                type="text"
                placeholder={tr("adminDashboard.searchAdmin")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 bg-hover-bg border-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                >
                  ×
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg py-2 animate-fade-in">
                <div className="px-4 py-2 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold">{tr("common.notifications")}</h3>
                  <Button asChild variant="ghost" size="xs">
                    <Link href="/admin/notifications">{tr("common.viewAll")}</Link>
                  </Button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      className={cn(
                        "w-full px-4 py-3 text-left hover:bg-hover-bg transition",
                        notification.unread && "bg-muted/50"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {notification.unread && (
                          <span className="w-2 h-2 bg-accent rounded-full mt-1.5 flex-shrink-0" />
                        )}
                        <div className={cn(!notification.unread && "ml-5")}>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted">
                              {notification.type}
                            </span>
                          </div>
                          <p className="text-xs text-muted">{notification.time}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Access */}
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/dashboard">
              <Crown className="w-5 h-5" />
            </Link>
          </Button>

          {/* Profile Dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.avatar_url || undefined} />
                <AvatarFallback>
                  <Crown className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium">{user?.full_name || 'Admin'}</span>
                <span className="text-xs text-muted">{user?.role || 'admin'}</span>
              </div>
              <ChevronDown className="w-4 h-4 hidden md:block" />
            </Button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg py-2 animate-fade-in">
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-sm font-medium">{user?.full_name}</p>
                  <p className="text-xs text-muted">{user?.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/admin/profile"
                    className="px-4 py-2 text-sm hover:bg-hover-bg flex items-center gap-2"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <UserCircle className="w-4 h-4" />
                    {tr("nav.myProfile")}
                  </Link>
                  <Link
                    href="/admin/settings"
                    className="px-4 py-2 text-sm hover:bg-hover-bg flex items-center gap-2"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    {tr("nav.settings")}
                  </Link>
                </div>
                <div className="border-t border-border pt-1">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      // Logout logic
                    }}
                    className="w-full px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    {tr("auth.logout")}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <div className="hidden lg:flex items-center gap-1">
            <Button
              variant={locale === 'en' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setLocale('en')}
              className="h-8 px-2"
            >
              EN
            </Button>
            <Button
              variant={locale === 'mm' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setLocale('mm')}
              className="h-8 px-2"
            >
              MM
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

// Import LogOut for the logout button
import { LogOut, Settings } from "lucide-react";
