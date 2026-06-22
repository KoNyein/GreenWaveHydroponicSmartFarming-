"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore, useSettingsStore } from "@/lib/store";
import { t } from "@/lib/translations";
import { Leaf, Mail, Lock, Eye, EyeOff, Globe, Sun, Moon } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const { locale, setLocale, theme, toggleTheme } = useSettingsStore();
  const router = useRouter();
  const tr = (key: string) => t(key, locale);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const success = await login(email, password);
      if (success) {
        router.push("/dashboard");
      } else {
        setError(tr("auth.invalidCredentials"));
      }
    } catch {
      setError(tr("auth.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-900 dark:to-slate-800 px-4">
      {/* Top-right controls */}
      <div className="fixed top-4 right-4 flex items-center gap-2 z-50">
        <button
          onClick={() => setLocale(locale === "en" ? "my" : "en")}
          className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-700 rounded-lg shadow text-sm hover:shadow-md transition"
        >
          <Globe className="w-4 h-4" />
          <span className="uppercase font-medium">{locale}</span>
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow hover:shadow-md transition"
        >
          {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-yellow-400" />}
        </button>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Leaf className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold">{tr("app.name")}</h1>
          <p className="text-sm text-muted mt-1">{tr("app.subtitle")}</p>
        </div>

        <div className="bg-card-bg border border-card-border rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-center mb-6">{tr("auth.signin")}</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{tr("auth.email")}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-input-border bg-input-bg rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                  placeholder={tr("auth.enterEmail")}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{tr("auth.password")}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-input-border bg-input-bg rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                  placeholder={tr("auth.enterPassword")}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition disabled:opacity-50"
            >
              {loading ? tr("auth.signingIn") : tr("auth.signin")}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            {tr("auth.noAccount")}{" "}
            <Link href="/auth/register" className="text-primary font-medium hover:underline">
              {tr("auth.register")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
