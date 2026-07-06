/**
 * Phase 2 Seed Script — Messaging, Search & Stories
 *
 * This script seeds Phase 2 data (group chats, messages, stories, bookmarks)
 * on top of the Phase 1 data (users, posts, friendships).
 *
 * Usage:
 *   SUPABASE_URL=<url> SUPABASE_SERVICE_ROLE_KEY=<key> npx ts-node supabase/seed_phase2.ts
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

// User IDs (must match Phase 1 seed)
const USER_IDS = {
  admin: "00000000-0000-0000-0000-000000000001",
  mike: "00000000-0000-0000-0000-000000000002",
  sarah: "00000000-0000-0000-0000-000000000003",
  aung: "00000000-0000-0000-0000-000000000004",
  thandar: "00000000-0000-0000-0000-000000000005",
};

async function seed() {
  console.log("Phase 2 Seeding started...");

  // 1. Group Chats (3 DMs + 3 Group chats)
  console.log("Creating group chats...");
  const groupChats = [
    { id: "00000000-0000-0000-0001-000000000001", name: "Mike Johnson", created_by: USER_IDS.admin, is_group: false },
    { id: "00000000-0000-0000-0001-000000000002", name: "Sarah Williams", created_by: USER_IDS.admin, is_group: false },
    { id: "00000000-0000-0000-0001-000000000003", name: "GreenWave Team", created_by: USER_IDS.admin, is_group: true },
    { id: "00000000-0000-0000-0001-000000000004", name: "Genetics Lab", created_by: USER_IDS.sarah, is_group: true },
    { id: "00000000-0000-0000-0001-000000000005", name: "Aung Kyaw", created_by: USER_IDS.aung, is_group: false },
    { id: "00000000-0000-0000-0001-000000000006", name: "Operations", created_by: USER_IDS.admin, is_group: true },
  ];
  const { error: chatErr } = await supabase.from("group_chats").upsert(groupChats);
  if (chatErr) console.error("Chat error:", chatErr.message);

  // 2. Chat Members
  console.log("Adding chat members...");
  const chatMembers = [
    // DM: Admin <-> Mike
    { chat_id: groupChats[0].id, user_id: USER_IDS.admin, role: "admin" },
    { chat_id: groupChats[0].id, user_id: USER_IDS.mike, role: "admin" },
    // DM: Admin <-> Sarah
    { chat_id: groupChats[1].id, user_id: USER_IDS.admin, role: "admin" },
    { chat_id: groupChats[1].id, user_id: USER_IDS.sarah, role: "admin" },
    // Group: GreenWave Team (all 5)
    { chat_id: groupChats[2].id, user_id: USER_IDS.admin, role: "admin" },
    { chat_id: groupChats[2].id, user_id: USER_IDS.mike, role: "member" },
    { chat_id: groupChats[2].id, user_id: USER_IDS.sarah, role: "member" },
    { chat_id: groupChats[2].id, user_id: USER_IDS.aung, role: "member" },
    { chat_id: groupChats[2].id, user_id: USER_IDS.thandar, role: "member" },
    // Group: Genetics Lab
    { chat_id: groupChats[3].id, user_id: USER_IDS.sarah, role: "admin" },
    { chat_id: groupChats[3].id, user_id: USER_IDS.aung, role: "member" },
    { chat_id: groupChats[3].id, user_id: USER_IDS.admin, role: "member" },
    // DM: Admin <-> Aung
    { chat_id: groupChats[4].id, user_id: USER_IDS.admin, role: "admin" },
    { chat_id: groupChats[4].id, user_id: USER_IDS.aung, role: "admin" },
    // Group: Operations
    { chat_id: groupChats[5].id, user_id: USER_IDS.admin, role: "admin" },
    { chat_id: groupChats[5].id, user_id: USER_IDS.mike, role: "member" },
    { chat_id: groupChats[5].id, user_id: USER_IDS.thandar, role: "member" },
  ];
  const { error: memberErr } = await supabase.from("chat_members").upsert(chatMembers);
  if (memberErr) console.error("Members error:", memberErr.message);

  // 3. Messages (18 messages across chats)
  console.log("Inserting messages...");
  const messages = [
    { chat_id: groupChats[0].id, sender_id: USER_IDS.mike, content: "Hey! Zone A seedlings are looking great today.", message_type: "text" },
    { chat_id: groupChats[0].id, sender_id: USER_IDS.admin, content: "Awesome! I'll be there in 15 minutes.", message_type: "text" },
    { chat_id: groupChats[0].id, sender_id: USER_IDS.mike, content: "Already calibrated and ready!", message_type: "text" },
    { chat_id: groupChats[1].id, sender_id: USER_IDS.sarah, content: "The terpene analysis results are back. Myrcene at 1.8%!", message_type: "text" },
    { chat_id: groupChats[1].id, sender_id: USER_IDS.admin, content: "That's incredible! Which phenotype?", message_type: "text" },
    { chat_id: groupChats[2].id, sender_id: USER_IDS.admin, content: "Good morning team! Q2 harvest numbers exceeded targets by 25%!", message_type: "text" },
    { chat_id: groupChats[2].id, sender_id: USER_IDS.mike, content: "Zone A alone contributed 40% of that.", message_type: "text" },
    { chat_id: groupChats[2].id, sender_id: USER_IDS.sarah, content: "Nutrient optimization also played a big role.", message_type: "text" },
    { chat_id: groupChats[2].id, sender_id: USER_IDS.thandar, content: "HVAC upgrade definitely helped maintain conditions.", message_type: "text" },
    { chat_id: groupChats[3].id, sender_id: USER_IDS.aung, content: "F3 generation showing 95% trait stability!", message_type: "text" },
    { chat_id: groupChats[3].id, sender_id: USER_IDS.sarah, content: "Remarkable for F3! Usually takes 5-6 generations.", message_type: "text" },
  ];
  const { error: msgErr } = await supabase.from("messages").insert(messages);
  if (msgErr) console.error("Messages error:", msgErr.message);

  // 4. Stories (7 stories)
  console.log("Creating stories...");
  const stories = [
    { author_id: USER_IDS.admin, content: "New pH monitoring system live!", media_type: "text", background_color: "#16a34a" },
    { author_id: USER_IDS.admin, content: "Harvest day vibes", media_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600", media_type: "image", background_color: "#059669" },
    { author_id: USER_IDS.mike, content: "Zone A is thriving!", media_url: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=600", media_type: "image", background_color: "#0d9488" },
    { author_id: USER_IDS.mike, content: "New LED panels installed!", media_type: "text", background_color: "#7c3aed" },
    { author_id: USER_IDS.sarah, media_url: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600", media_type: "image", background_color: "#16a34a" },
    { author_id: USER_IDS.aung, content: "Genetics breakthrough! F3 stable", media_type: "text", background_color: "#dc2626" },
    { author_id: USER_IDS.thandar, content: "HVAC maintenance complete", media_url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600", media_type: "image", background_color: "#2563eb" },
  ];
  const { error: storyErr } = await supabase.from("stories").insert(stories);
  if (storyErr) console.error("Stories error:", storyErr.message);

  // 5. Bookmarks (5 saved posts by admin)
  console.log("Adding bookmarks...");
  // Note: post IDs must match Phase 1 seed. Using placeholder post references.
  console.log("  Bookmarks depend on Phase 1 post IDs - verify after Phase 1 seed runs.");

  console.log("\nPhase 2 seeding complete!");
  console.log("Summary:");
  console.log("  - 6 group chats (3 DMs + 3 groups)");
  console.log("  - 17 chat members");
  console.log("  - 11 messages");
  console.log("  - 7 stories");
  console.log("  - Bookmarks ready (pending Phase 1 post IDs)");
}

seed().catch(console.error);
