"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { usePhase4Store } from "@/lib/phase4-store";
import { socialUsers } from "@/lib/social-mock-data";
import { Flag, Check, X, Eye, ArrowLeft, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReportStatus } from "@/types/phase4";

const STATUS_FILTERS: ReportStatus[] = ["pending", "reviewing", "resolved", "dismissed"];

export default function ReportsPage() {
  const router = useRouter();
  const { reports, resolveReport } = usePhase4Store();
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">("pending");

  const filteredReports = statusFilter === "all"
    ? reports
    : reports.filter((r) => r.status === statusFilter);

  const statusColors: Record<ReportStatus, string> = {
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    reviewing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    resolved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    dismissed: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.push("/admin")} className="p-2 rounded-lg hover:bg-hover-bg">
            <ArrowLeft className="w-5 h-5 text-muted" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
            <Flag className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Moderation Queue</h1>
            <p className="text-sm text-muted">{reports.filter((r) => r.status === "pending").length} pending reports</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              statusFilter === "all" ? "bg-primary text-white" : "bg-card-bg border border-card-border text-muted"
            }`}
          >
            All ({reports.length})
          </button>
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap capitalize ${
                statusFilter === s ? "bg-primary text-white" : "bg-card-bg border border-card-border text-muted"
              }`}
            >
              {s} ({reports.filter((r) => r.status === s).length})
            </button>
          ))}
        </div>

        {/* Reports List */}
        <div className="space-y-3">
          {filteredReports.map((report) => {
            const reporter = socialUsers.find((u) => u.id === report.reporter_id);
            return (
              <div key={report.id} className="bg-card-bg border border-card-border rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {reporter?.avatar_url ? (
                      <img src={reporter.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                        {reporter?.full_name?.charAt(0) || "?"}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{reporter?.full_name || "Unknown"}</span>
                        <span className="text-xs text-muted">reported a</span>
                        <span className="text-xs font-medium text-foreground capitalize">{report.target_type}</span>
                      </div>
                      <p className="text-xs text-muted mt-0.5">
                        Reason: <span className="capitalize font-medium text-foreground">{report.reason.replace("_", " ")}</span>
                      </p>
                      {report.description && (
                        <p className="text-xs text-muted mt-1 bg-hover-bg p-2 rounded-lg">{report.description}</p>
                      )}
                      <p className="text-xs text-muted mt-1">{new Date(report.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${statusColors[report.status]}`}>
                    {report.status}
                  </span>
                </div>

                {/* Actions */}
                {report.status === "pending" && (
                  <div className="flex gap-2 mt-3 ml-12">
                    <button
                      onClick={() => resolveReport(report.id, "reviewing")}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600"
                    >
                      <Eye className="w-3.5 h-3.5" /> Review
                    </button>
                    <button
                      onClick={() => resolveReport(report.id, "resolved", "Action taken")}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600"
                    >
                      <Check className="w-3.5 h-3.5" /> Resolve
                    </button>
                    <button
                      onClick={() => resolveReport(report.id, "dismissed", "No violation found")}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white rounded-lg text-xs font-medium hover:bg-gray-600"
                    >
                      <X className="w-3.5 h-3.5" /> Dismiss
                    </button>
                  </div>
                )}

                {report.resolution_note && (
                  <div className="mt-2 ml-12 text-xs text-muted">
                    Resolution: <span className="text-foreground">{report.resolution_note}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12 text-muted">
            <Flag className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No reports found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
