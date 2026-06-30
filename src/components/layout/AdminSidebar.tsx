"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebarStore, useSettingsStore, useAuthStore } from "@/lib/store";
import { t } from "@/lib/translations";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Package,
  DollarSign,
  BarChart3,
  MessageCircle,
  ShieldCheck,
  Settings,
  Bell,
  FileText,
  Activity,
  Database,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Crown,
  Leaf,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggle } = useSidebarStore();
  const { locale } = useSettingsStore();
  const { user, logout } = useAuthStore();

  const tr = (key: string) => t(key, locale);

  const navItems = [
    {
      href: "/admin/dashboard",
      label: tr("nav.adminDashboard"),
      icon: LayoutDashboard,
    },
    {
      href: "/admin/users",
      label: tr("nav.userManagement"),
      icon: Users,
    },
    {
      href: "/admin/marketplace",
      label: tr("nav.marketplaceManagement"),
      icon: ShoppingBag,
    },
    {
      href: "/admin/products",
      label: tr("nav.productManagement"),
      icon: Package,
    },
    {
      href: "/admin/orders",
      label: tr("nav.orderManagement"),
      icon: DollarSign,
    },
    {
      href: "/admin/reports",
      label: tr("nav.reports"),
      icon: BarChart3,
    },
    {
      href: "/admin/messenger",
      label: tr("nav.messengerManagement"),
      icon: MessageCircle,
    },
    {
      href: "/admin/notifications",
      label: tr("nav.notificationManagement"),
      icon: Bell,
    },
    {
      href: "/admin/settings",
      label: tr("nav.systemSettings"),
      icon: Settings,
      children: [
        { href: "/admin/settings/general", label: tr("nav.generalSettings") },
        { href: "/admin/settings/security", label: tr("nav.securitySettings") },
        { href: "/admin/settings/payments", label: tr("nav.paymentSettings") },
        { href: "/admin/settings/shipping", label: tr("nav.shippingSettings") },
        { href: "/admin/settings/taxes", label: tr("nav.taxSettings") },
      ],
    },
    {
      href: "/admin/system",
      label: tr("nav.systemManagement"),
      icon: ShieldCheck,
      children: [
        { href: "/admin/system/backups", label: tr("nav.backups") },
        { href: "/admin/system/logs", label: tr("nav.systemLogs") },
        { href: "/admin/system/health", label: tr("nav.systemHealth") },
        { href: "/admin/system/updates", label: tr("nav.updates") },
      ],
    },
    {
      href: "/admin/database",
      label: tr("nav.database"),
      icon: Database,
    },
    {
      href: "/admin/activity",
      label: tr("nav.activityLog"),
      icon: Activity,
    },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar-bg text-sidebar-text transition-all duration-300 flex flex-col",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
          <Crown className="w-5 h-5 text-white" />
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-white leading-tight">{tr("app.name")}</h1>
            <p className="text-[10px] text-slate-400 truncate">{tr("adminDashboard.adminPanel")}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = hasChildren && pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <div key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group",
                  isActive
                    ? "bg-accent/20 text-accent font-medium"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span>{item.label}</span>
                    {hasChildren && (
                      <ChevronRight
                        className={cn(
                          "w-4 h-4 ml-auto transition-transform",
                          isExpanded && "rotate-90"
                        )}
                      />
                    )}
                  </>
                )}
              </Link>

              {/* Children */}
              {hasChildren && !isCollapsed && isExpanded && (
                <div className="pl-8 py-1 space-y-1">
                  {item.children?.map((child) => {
                    const isChildActive = pathname === child.href || pathname.startsWith(child.href + "/");
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                          isChildActive
                            ? "bg-accent/10 text-accent font-medium"
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <span className="w-5" />
                        <span>{child.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-white/10 p-3">
        {!isCollapsed && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
              <Crown className="w-4 h-4 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.full_name || 'Admin'}</p>
              <p className="text-xs text-slate-400">{user?.role || 'admin'}</p>
            </div>
          </div>
        )}
        
        {/* Logout Button */}
        <button
          onClick={logout}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all w-full",
            "text-slate-400 hover:bg-red-500/10 hover:text-red-400"
          )}
          title={isCollapsed ? tr("auth.logout") : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>{tr("auth.logout")}</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={toggle}
        className="flex items-center justify-center py-3 border-t border-white/10 text-slate-400 hover:text-white transition"
      >
        {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>
    </aside>
  );
}
