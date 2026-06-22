"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, StatCard } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency } from "@/lib/utils";
import { mockAffiliateLinks } from "@/lib/mock-data";
import type { AffiliateLink } from "@/types/database";
import { Link2, DollarSign, MousePointerClick, TrendingUp, Copy, ExternalLink } from "lucide-react";

export default function AffiliatePage() {
  const totalClicks = mockAffiliateLinks.reduce((s, l) => s + l.clicks, 0);
  const totalConversions = mockAffiliateLinks.reduce((s, l) => s + l.conversions, 0);
  const totalEarned = mockAffiliateLinks.reduce((s, l) => s + l.total_earned, 0);
  const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) : "0";

  const columns = [
    { key: "code", label: "Affiliate Code", render: (l: AffiliateLink) => (
      <div className="flex items-center gap-2">
        <span className="font-mono font-medium text-primary">{l.code}</span>
        <button className="p-1 hover:bg-gray-100 rounded" title="Copy link">
          <Copy className="w-3 h-3 text-gray-400" />
        </button>
      </div>
    )},
    { key: "clicks", label: "Clicks", render: (l: AffiliateLink) => l.clicks.toLocaleString() },
    { key: "conversions", label: "Conversions", render: (l: AffiliateLink) => l.conversions.toLocaleString() },
    {
      key: "rate",
      label: "Conv. Rate",
      render: (l: AffiliateLink) =>
        l.clicks > 0 ? `${((l.conversions / l.clicks) * 100).toFixed(1)}%` : "0%",
    },
    { key: "total_earned", label: "Earned", render: (l: AffiliateLink) => <span className="font-semibold text-green-600">{formatCurrency(l.total_earned)}</span> },
    { key: "is_active", label: "Status", render: (l: AffiliateLink) => <StatusBadge status={l.is_active ? "active" : "inactive"} /> },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Affiliate Program</h1>
          <p className="text-gray-500 text-sm mt-1">Track your affiliate links and commissions</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatCard label="Total Clicks" value={totalClicks.toLocaleString()} icon={<MousePointerClick className="w-5 h-5" />} />
          <StatCard label="Conversions" value={totalConversions} icon={<TrendingUp className="w-5 h-5" />} color="bg-blue-500" />
          <StatCard label="Conv. Rate" value={`${conversionRate}%`} icon={<Link2 className="w-5 h-5" />} color="bg-purple-500" />
          <StatCard label="Total Earned" value={formatCurrency(totalEarned)} icon={<DollarSign className="w-5 h-5" />} color="bg-green-600" />
        </div>

        {/* Affiliate Link Generator */}
        <Card title="Your Affiliate Link">
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 font-mono text-sm text-gray-700">
              https://greenwave.farm/shop?ref={mockAffiliateLinks[0]?.code ?? "YOUR_CODE"}
            </div>
            <button className="flex items-center gap-2 px-4 py-3 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition">
              <Copy className="w-4 h-4" /> Copy
            </button>
            <button className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
              <ExternalLink className="w-4 h-4" /> Open
            </button>
          </div>
        </Card>

        <Card title="Affiliate Links">
          <DataTable columns={columns} data={mockAffiliateLinks} keyExtractor={(l) => l.id} />
        </Card>

        {/* How it works */}
        <Card title="How Affiliate Works">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Share Your Link", desc: "Copy your unique affiliate link and share it with your network via social media, email, or your website." },
              { step: "2", title: "Earn Commissions", desc: "When someone makes a purchase through your link, you earn a commission on every sale." },
              { step: "3", title: "Get Paid", desc: "Track your earnings in real-time and receive payouts monthly to your preferred payment method." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                  {item.step}
                </div>
                <h4 className="font-semibold mb-1">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
