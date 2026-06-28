"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAuthStore, useSettingsStore } from "@/lib/store";
import { t } from "@/lib/translations";
import { mockSubscriptions } from "@/lib/mock-data";
import {
  Crown,
  Check,
  Zap,
  ShoppingCart,
  Leaf,
  Camera,
  Package,
  Wind,
  Warehouse,
  BarChart3,
  Store,
  Truck,
  Link2,
  Clock,
} from "lucide-react";

const plans = [
  {
    key: "free_trial",
    price: 0,
    features: ["pos", "hydroponic"],
    color: "border-gray-300 dark:border-gray-600",
    badge: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  },
  {
    key: "basic",
    price: 29,
    features: ["pos", "hydroponic", "cctv", "inventory"],
    color: "border-blue-400 dark:border-blue-500",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    key: "pro",
    price: 79,
    features: ["pos", "hydroponic", "cctv", "inventory", "dry_room", "store_room", "sales"],
    popular: true,
    color: "border-green-500 dark:border-green-400",
    badge: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  {
    key: "enterprise",
    price: 149,
    features: ["pos", "hydroponic", "cctv", "inventory", "dry_room", "store_room", "sales", "shop", "dropship", "affiliate"],
    color: "border-purple-500 dark:border-purple-400",
    badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
];

const featureIcons: Record<string, React.ReactNode> = {
  pos: <ShoppingCart className="w-4 h-4" />,
  hydroponic: <Leaf className="w-4 h-4" />,
  cctv: <Camera className="w-4 h-4" />,
  inventory: <Package className="w-4 h-4" />,
  dry_room: <Wind className="w-4 h-4" />,
  store_room: <Warehouse className="w-4 h-4" />,
  sales: <BarChart3 className="w-4 h-4" />,
  shop: <Store className="w-4 h-4" />,
  dropship: <Truck className="w-4 h-4" />,
  affiliate: <Link2 className="w-4 h-4" />,
};

const featureLabels: Record<string, string> = {
  pos: "trial.pos",
  hydroponic: "trial.hydroponic",
  cctv: "nav.cctv",
  inventory: "nav.inventory",
  dry_room: "nav.dryroom",
  store_room: "nav.storeroom",
  sales: "nav.sales",
  shop: "nav.shop",
  dropship: "nav.dropship",
  affiliate: "nav.affiliate",
};

export default function SubscriptionPage() {
  const { user } = useAuthStore();
  const { locale } = useSettingsStore();
  const tr = (key: string) => t(key, locale);

  const userId = user?.id ?? "00000000-0000-0000-0000-000000000001";
  const currentSub = mockSubscriptions.find((s) => s.user_id === userId);

  const trialDaysRemaining = currentSub
    ? Math.max(0, Math.ceil((new Date(currentSub.trial_end).getTime() - Date.now()) / 86400000))
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{tr("trial.pricing")}</h1>
          <p className="text-muted text-sm mt-1">{tr("trial.pricingSubtitle")}</p>
        </div>

        {/* Current Plan Banner */}
        {currentSub && (
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">
                    {tr("trial.currentPlan")}: <span className="capitalize">{currentSub.plan === "free_trial" ? tr("trial.freeTrial") : currentSub.plan}</span>
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <StatusBadge status={currentSub.status} />
                    {currentSub.plan === "free_trial" && currentSub.status === "active" && (
                      <span className="flex items-center gap-1 text-sm text-yellow-600 dark:text-yellow-400">
                        <Clock className="w-4 h-4" />
                        {trialDaysRemaining} {tr("trial.daysRemaining")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {currentSub.features.map((f) => (
                  <span key={f} className="p-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded">
                    {featureIcons[f]}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const isCurrent = currentSub?.plan === plan.key;
            const planLabel = plan.key === "free_trial" ? tr("trial.freeTrial") : tr(`trial.${plan.key}`);

            return (
              <div
                key={plan.key}
                className={`bg-card-bg border-2 ${plan.popular ? plan.color : "border-card-border"} rounded-2xl overflow-hidden relative ${
                  isCurrent ? "ring-2 ring-primary" : ""
                }`}
              >
                {plan.popular && (
                  <div className="bg-green-500 text-white text-xs font-medium text-center py-1">
                    Most Popular
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${plan.badge}`}>
                      {planLabel}
                    </span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
                        {tr("trial.currentPlan")}
                      </span>
                    )}
                  </div>

                  <div className="mb-6">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    {plan.price > 0 && (
                      <span className="text-muted text-sm">{tr("trial.perMonth")}</span>
                    )}
                    {plan.price === 0 && (
                      <p className="text-xs text-muted mt-1">14 days</p>
                    )}
                  </div>

                  <div className="space-y-3 mb-6">
                    {plan.features.map((feat) => (
                      <div key={feat} className="flex items-center gap-2.5 text-sm">
                        <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="flex items-center gap-2">
                          {featureIcons[feat]}
                          {tr(featureLabels[feat])}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    disabled={isCurrent}
                    className={`w-full py-2.5 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${
                      isCurrent
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                        : plan.popular
                        ? "bg-primary text-white hover:bg-primary-dark"
                        : "bg-card-bg border border-card-border text-foreground hover:bg-hover-bg"
                    }`}
                  >
                    {isCurrent ? (
                      tr("trial.currentPlan")
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        {plan.price === 0 ? tr("trial.startTrial") : tr("trial.subscribe")}
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison */}
        <Card>
          <h3 className="font-semibold mb-4">{tr("trial.features")}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-card-border">
                  <th className="text-left py-3 px-4">Feature</th>
                  {plans.map((p) => (
                    <th key={p.key} className="text-center py-3 px-4 capitalize">
                      {p.key === "free_trial" ? "Trial" : p.key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.keys(featureLabels).map((feat) => (
                  <tr key={feat} className="border-b border-card-border">
                    <td className="py-3 px-4 flex items-center gap-2">
                      {featureIcons[feat]}
                      {tr(featureLabels[feat])}
                    </td>
                    {plans.map((p) => (
                      <td key={p.key} className="text-center py-3 px-4">
                        {p.features.includes(feat) ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-gray-300 dark:text-gray-600">-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
