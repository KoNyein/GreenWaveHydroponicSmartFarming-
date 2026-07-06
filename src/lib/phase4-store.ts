// Phase 4: Admin Dashboard, Analytics & Notifications Pro Store

import { create } from "zustand";
import type { Report, NotificationSettings, ModerationEntry, ReportStatus, ModerationAction, ReportTargetType } from "@/types/phase4";
import { mockReports, mockNotificationSettings, mockModerationActions } from "./phase4-mock-data";

interface Phase4State {
  reports: Report[];
  notificationSettings: NotificationSettings;
  moderationActions: ModerationEntry[];

  // Report actions
  resolveReport: (reportId: string, status: ReportStatus, note?: string) => void;
  submitReport: (target_type: ReportTargetType, target_id: string, reason: string, description?: string) => void;

  // Notification settings actions
  updateNotificationSetting: (key: keyof NotificationSettings, value: boolean | string) => void;

  // Moderation actions
  moderateContent: (target_type: ReportTargetType, target_id: string, action: ModerationAction, reason?: string, reportId?: string) => void;
}

export const usePhase4Store = create<Phase4State>((set) => ({
  reports: mockReports,
  notificationSettings: mockNotificationSettings,
  moderationActions: mockModerationActions,

  resolveReport: (reportId, status, note) =>
    set((state) => ({
      reports: state.reports.map((r) =>
        r.id === reportId
          ? { ...r, status, resolved_by: "user-001", resolved_at: new Date().toISOString(), resolution_note: note }
          : r
      ),
    })),

  submitReport: (target_type, target_id, reason, description) =>
    set((state) => ({
      reports: [
        {
          id: `report-${Date.now()}`,
          reporter_id: "user-001",
          target_type,
          target_id,
          reason: reason as Report["reason"],
          description,
          status: "pending",
          created_at: new Date().toISOString(),
        },
        ...state.reports,
      ],
    })),

  updateNotificationSetting: (key, value) =>
    set((state) => ({
      notificationSettings: {
        ...state.notificationSettings,
        [key]: value,
        updated_at: new Date().toISOString(),
      },
    })),

  moderateContent: (target_type, target_id, action, reason, reportId) =>
    set((state) => ({
      moderationActions: [
        {
          id: `mod-${Date.now()}`,
          moderator_id: "user-001",
          target_type,
          target_id,
          action,
          reason,
          report_id: reportId,
          created_at: new Date().toISOString(),
        },
        ...state.moderationActions,
      ],
    })),
}));
