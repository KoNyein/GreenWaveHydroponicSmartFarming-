"use client";

import { useAuthStore, useSidebarStore } from "@/lib/store";
import { Bell, LogOut, Menu, User } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const { user, logout } = useAuthStore();
  const { isCollapsed } = useSidebarStore();

  return (
    <header
      className="fixed top-0 right-0 z-30 h-16 bg-white border-b border-card-border flex items-center justify-between px-6 transition-all duration-300"
      style={{ left: isCollapsed ? "4rem" : "16rem" }}
    >
      <div className="flex items-center gap-4">
        <button className="lg:hidden">
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold text-foreground">
          GreenWave Hydroponic Smart Farming
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium">{user?.full_name ?? "Guest"}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role ?? "member"}</p>
          </div>
          <Link
            href="/auth/login"
            onClick={() => logout()}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
            title="Logout"
          >
            <LogOut className="w-4 h-4 text-gray-500" />
          </Link>
        </div>
      </div>
    </header>
  );
}
