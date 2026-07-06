/**
 * Phase 4 Seed Script — Admin Dashboard, Analytics & Notifications Pro
 *
 * Seeds Phase 4 data: reports, activity logs, notification settings, analytics, moderation actions.
 *
 * Usage:
 *   SUPABASE_URL=<url> SUPABASE_SERVICE_ROLE_KEY=<key> npx ts-node supabase/seed_phase4.ts
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const USER_IDS = {
  admin: "00000000-0000-0000-0000-000000000001",
  mike: "00000000-0000-0000-0000-000000000002",
  sarah: "00000000-0000-0000-0000-000000000003",
  aung: "00000000-0000-0000-0000-000000000004",
  thandar: "00000000-0000-0000-0000-000000000005",
};

async function seed() {
  console.log("Phase 4 Seeding started...");

  // 1. Reports
  console.log("Creating reports...");
  const reports = [
    { reporter_id: USER_IDS.mike, target_type: "post", target_id: "post-spam-001", reason: "spam", description: "Promoting fake products", status: "pending" },
    { reporter_id: USER_IDS.sarah, target_type: "user", target_id: "user-bad-001", reason: "harassment", description: "Threatening DMs", status: "reviewing" },
    { reporter_id: USER_IDS.aung, target_type: "comment", target_id: "comment-hate-001", reason: "hate_speech", status: "resolved", resolved_by: USER_IDS.admin },
    { reporter_id: USER_IDS.thandar, target_type: "listing", target_id: "listing-scam-001", reason: "scam", description: "Never ships items", status: "pending" },
  ];
  const { error: reportErr } = await supabase.from("reports").insert(reports);
  if (reportErr) console.error("Reports error:", reportErr.message);

  // 2. Notification settings for all users
  console.log("Creating notification settings...");
  const notifSettings = Object.values(USER_IDS).map((uid) => ({
    user_id: uid,
    push_enabled: true,
    push_messages: true,
    push_reactions: true,
    push_comments: true,
    push_friend_requests: true,
    push_group_activity: false,
    push_events: true,
    push_marketplace: true,
    email_enabled: true,
    email_digest: "daily",
    email_marketing: false,
    email_security: true,
    sound_enabled: true,
    vibration_enabled: true,
    quiet_hours_enabled: false,
  }));
  const { error: notifErr } = await supabase.from("notification_settings").upsert(notifSettings);
  if (notifErr) console.error("Notification settings error:", notifErr.message);

  // 3. Analytics (last 7 days)
  console.log("Creating analytics snapshots...");
  const analytics = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      date: d.toISOString().split("T")[0],
      total_users: 1200 + i * 15,
      new_users: Math.floor(Math.random() * 10) + 5,
      active_users: Math.floor(Math.random() * 200) + 300,
      total_posts: 3500 + i * 30,
      new_posts: Math.floor(Math.random() * 40) + 20,
      total_comments: 8900 + i * 50,
      total_reactions: 15000 + i * 100,
      page_views: Math.floor(Math.random() * 5000) + 8000,
      listings_created: Math.floor(Math.random() * 8) + 2,
      transactions: Math.floor(Math.random() * 15) + 5,
      revenue: parseFloat((Math.random() * 500 + 200).toFixed(2)),
    };
  });
  const { error: analyticsErr } = await supabase.from("analytics_daily").upsert(analytics);
  if (analyticsErr) console.error("Analytics error:", analyticsErr.message);

  console.log("\nPhase 4 seeding complete!");
  console.log("Summary:");
  console.log("  - 4 reports");
  console.log("  - 5 notification settings");
  console.log("  - 7 analytics snapshots");
}

seed().catch(console.error);
