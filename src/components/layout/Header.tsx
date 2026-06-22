"use client";

import { useAuthStore, useSidebarStore, useSettingsStore } from "@/lib/store";
import { t } from "@/lib/translations";
import { Bell, LogOut, Menu, User, Sun, Moon, Globe } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const { user, logout } = useAuthStore();
  const { isCollapsed } = useSidebarStore();
  const { theme, toggleTheme, locale, setLocale } = useSettingsStore();

  const tr = (key: string) => t(key, locale);

  return (
    <header
      className="fixed top-0 right-0 z-30 h-16 bg-card-bg border-b border-card-border flex items-center justify-between px-6 transition-all duration-300"
      style={{ left: isCollapsed ? "4rem" : "16rem" }}
    >
      <div className="flex items-center gap-4">
        <button className="lg:hidden">
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold text-foreground">
          {tr("app.fullname")}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        {/* Language Switcher */}
        <button
          onClick={() => setLocale(locale === "en" ? "my" : "en")}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-hover-bg transition text-sm"
          title={locale === "en" ? "Switch to Myanmar" : "Switch to English"}
        >
          <Globe className="w-4 h-4 text-muted" />
          <span className="text-xs font-medium text-muted uppercase">{locale}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-hover-bg transition"
          title={theme === "light" ? "Dark Mode" : "Light Mode"}
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5 text-muted" />
          ) : (
            <Sun className="w-5 h-5 text-yellow-400" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-hover-bg transition">
          <Bell className="w-5 h-5 text-muted" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User */}
        <div className="flex items-center gap-3 pl-3 border-l border-card-border">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium">{user?.full_name ?? tr("common.guest")}</p>
            <p className="text-xs text-muted capitalize">{user?.role ?? "member"}</p>
          </div>
          <Link
            href="/auth/login"
            onClick={() => logout()}
            className="p-2 rounded-lg hover:bg-hover-bg transition"
            title={tr("common.logout")}
          >
            <LogOut className="w-4 h-4 text-muted" />
          </Link>
        </div>
      </div>
    </header>
  );
}
