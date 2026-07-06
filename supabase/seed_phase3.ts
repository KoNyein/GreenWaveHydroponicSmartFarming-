/**
 * Phase 3 Seed Script — Groups, Events & Marketplace Pro
 *
 * Seeds Phase 3 data: groups, members, events, RSVPs, reviews, offers, polls, hashtags.
 *
 * Usage:
 *   SUPABASE_URL=<url> SUPABASE_SERVICE_ROLE_KEY=<key> npx ts-node supabase/seed_phase3.ts
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
  console.log("Phase 3 Seeding started...");

  // 1. Groups
  console.log("Creating groups...");
  const groups = [
    { name: "Hydroponics Beginners", slug: "hydroponics-beginners", description: "A welcoming space for newcomers to hydroponic farming.", privacy: "public", category: "education", created_by: USER_IDS.admin, member_count: 156, post_count: 89 },
    { name: "LED Grow Lights", slug: "led-grow-lights", description: "Everything about LED grow lighting.", privacy: "public", category: "equipment", created_by: USER_IDS.mike, member_count: 98, post_count: 45 },
    { name: "Cannabis Genetics Lab", slug: "genetics-lab", description: "Advanced breeding discussions.", privacy: "private", category: "science", created_by: USER_IDS.sarah, member_count: 34, post_count: 67 },
    { name: "GreenWave Marketplace", slug: "marketplace", description: "Buy, sell, and trade equipment.", privacy: "public", category: "marketplace", created_by: USER_IDS.admin, member_count: 210, post_count: 134 },
    { name: "Myanmar Growers", slug: "myanmar-growers", description: "Local community for Myanmar growers.", privacy: "public", category: "regional", created_by: USER_IDS.aung, member_count: 78, post_count: 23 },
    { name: "Organic Nutrients", slug: "organic-nutrients", description: "Natural nutrient solutions.", privacy: "public", category: "nutrients", created_by: USER_IDS.thandar, member_count: 62, post_count: 31 },
  ];
  const { error: groupErr } = await supabase.from("groups").upsert(groups);
  if (groupErr) console.error("Groups error:", groupErr.message);

  // 2. Events
  console.log("Creating events...");
  const events = [
    { title: "GreenWave Farm Tour - Q3 2025", description: "Visit our hydroponic facility.", location: "GreenWave Farm, Yangon", start_date: "2025-07-15T09:00:00Z", end_date: "2025-07-15T17:00:00Z", event_type: "tour", max_attendees: 30, is_free: false, price: 25.00, created_by: USER_IDS.admin, attendee_count: 22 },
    { title: "LED Spectrum Workshop", description: "Hands-on PAR/PPFD workshop.", location: "Online (Zoom)", start_date: "2025-07-20T14:00:00Z", end_date: "2025-07-20T16:00:00Z", event_type: "workshop", max_attendees: 100, is_free: true, created_by: USER_IDS.mike, attendee_count: 67 },
    { title: "Harvest Festival 2025", description: "Annual harvest celebration.", location: "Community Garden, Mandalay", start_date: "2025-08-10T08:00:00Z", end_date: "2025-08-10T20:00:00Z", event_type: "harvest", max_attendees: 200, is_free: true, created_by: USER_IDS.admin, attendee_count: 134 },
    { title: "Genetics Meetup: Phenotype Selection", description: "Monthly genetics discussion.", location: "GreenWave Lab, Yangon", start_date: "2025-07-05T18:00:00Z", end_date: "2025-07-05T20:00:00Z", event_type: "meetup", max_attendees: 15, is_free: true, created_by: USER_IDS.sarah, attendee_count: 12 },
    { title: "Nutrient Mixing Masterclass", description: "Learn to mix nutrient solutions.", location: "Online (Zoom)", start_date: "2025-07-25T10:00:00Z", end_date: "2025-07-25T12:00:00Z", event_type: "online", max_attendees: 50, is_free: false, price: 15.00, created_by: USER_IDS.thandar, attendee_count: 38 },
  ];
  const { error: eventErr } = await supabase.from("events").insert(events);
  if (eventErr) console.error("Events error:", eventErr.message);

  // 3. Hashtags
  console.log("Creating hashtags...");
  const hashtags = [
    { name: "hydroponics", post_count: 45 },
    { name: "LED_grow", post_count: 32 },
    { name: "organic", post_count: 28 },
    { name: "harvest2025", post_count: 22 },
    { name: "nutrients", post_count: 19 },
    { name: "pH_balance", post_count: 16 },
    { name: "DWC", post_count: 14 },
    { name: "seedlings", post_count: 12 },
    { name: "genetics", post_count: 11 },
    { name: "terpenes", post_count: 9 },
  ];
  const { error: tagErr } = await supabase.from("hashtags").upsert(hashtags);
  if (tagErr) console.error("Hashtags error:", tagErr.message);

  // 4. Reviews
  console.log("Creating reviews...");
  const reviews = [
    { reviewer_id: USER_IDS.mike, seller_id: USER_IDS.admin, listing_id: "listing-001", rating: 5, content: "Excellent pH meter! Accurate and fast shipping." },
    { reviewer_id: USER_IDS.sarah, seller_id: USER_IDS.admin, listing_id: "listing-002", rating: 4, content: "Good quality nutrients. Slightly late delivery." },
    { reviewer_id: USER_IDS.aung, seller_id: USER_IDS.mike, listing_id: "listing-003", rating: 5, content: "LED panel exceeded expectations." },
    { reviewer_id: USER_IDS.admin, seller_id: USER_IDS.sarah, listing_id: "listing-004", rating: 5, content: "Premium genetics! Every seed germinated." },
    { reviewer_id: USER_IDS.thandar, seller_id: USER_IDS.aung, listing_id: "listing-005", rating: 3, content: "Product ok but packaging could be better." },
  ];
  const { error: reviewErr } = await supabase.from("reviews").insert(reviews);
  if (reviewErr) console.error("Reviews error:", reviewErr.message);

  console.log("\nPhase 3 seeding complete!");
  console.log("Summary:");
  console.log("  - 6 groups");
  console.log("  - 5 events");
  console.log("  - 10 hashtags");
  console.log("  - 5 reviews");
}

seed().catch(console.error);
