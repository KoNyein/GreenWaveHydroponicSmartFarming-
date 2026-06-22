"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/lib/store";
import {
  LayoutDashboard,
  Leaf,
  Camera,
  ShoppingCart,
  Package,
  Wind,
  Warehouse,
  BarChart3,
  Store,
  Users,
  Link2,
  Truck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/farm", label: "Farm Monitor", icon: Leaf },
  { href: "/cctv", label: "CCTV", icon: Camera },
  { href: "/pos", label: "POS System", icon: ShoppingCart },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/dry-room", label: "Dry Room", icon: Wind },
  { href: "/store-room", label: "Store Room", icon: Warehouse },
  { href: "/sales", label: "Sales Records", icon: BarChart3 },
  { href: "/shop", label: "Shop", icon: Store },
  { href: "/affiliate", label: "Affiliate", icon: Link2 },
  { href: "/shop/dropship", label: "Dropship", icon: Truck },
  { href: "/members", label: "Members", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggle } = useSidebarStore();

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
            <h1 className="text-sm font-bold text-white leading-tight">GreenWave</h1>
            <p className="text-[10px] text-slate-400">Hydroponic Smart Farm</p>
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

      {/* Collapse Button */}
      <button
        onClick={toggle}
        className="flex items-center justify-center py-3 border-t border-white/10 text-slate-400 hover:text-white transition"
      >
        {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>
    </aside>
  );
}
