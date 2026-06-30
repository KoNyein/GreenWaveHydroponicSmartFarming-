"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebarStore, useSettingsStore, useAuthStore } from "@/lib/store";
import { t } from "@/lib/translations";
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Package,
  Heart,
  Bell,
  MessageCircle,
  UserCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Leaf,
} from "lucide-react";

export default function UserSidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggle } = useSidebarStore();
  const { locale } = useSettingsStore();
  const { user, logout } = useAuthStore();

  const tr = (key: string) => t(key, locale);

  const navItems = [
    { href: "/user/dashboard", label: tr("nav.userDashboard"), icon: LayoutDashboard },
    { href: "/marketplace", label: tr("nav.marketplace"), icon: ShoppingBag },
    { href: "/user/orders", label: tr("nav.myOrders"), icon: ShoppingCart },
    { href: "/user/wishlist", label: tr("nav.myWishlist"), icon: Heart },
    { href: "/messenger", label: tr("nav.messages"), icon: MessageCircle },
    { href: "/user/notifications", label: tr("nav.notifications"), icon: Bell },
    { href: "/user/profile", label: tr("nav.myProfile"), icon: UserCircle },
    { href: "/user/settings", label: tr("nav.settings"), icon: Settings },
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
          <Leaf className="w-5 h-5 text-white" />
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-white leading-tight">{tr("app.name")}</h1>
            <p className="text-[10px] text-slate-400 truncate">{user?.email || tr("app.subtitle")}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                isActive
                  ? "bg-accent/20 text-accent font-medium"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-white/10 p-3">
        {!isCollapsed && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
              <UserCircle className="w-4 h-4 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.full_name || 'User'}</p>
              <p className="text-xs text-slate-400">{user?.role || 'member'}</p>
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
