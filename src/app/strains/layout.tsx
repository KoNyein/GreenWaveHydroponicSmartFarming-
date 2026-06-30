"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useSidebarStore, useSettingsStore } from "@/lib/store";
import { t } from "@/lib/translations";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function StrainsLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const { isCollapsed } = useSidebarStore();
  const { locale } = useSettingsStore();
  const router = useRouter();
  const tr = (key: string) => t(key, locale);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted">{tr("app.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      <main
        className="pt-16 transition-all duration-300 min-h-screen"
        style={{ marginLeft: isCollapsed ? "4rem" : "16rem" }}
      >
        <div className="p-6 animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
