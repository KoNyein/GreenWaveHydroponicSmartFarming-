/**
 * Phase 1: Social Core Seed Script
 * Creates 5 demo users, 30 posts, sample friendships, reactions, comments, notifications
 *
 * Usage: npx ts-node supabase/seed.ts
 * Requires: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "http://localhost:54321";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// 5 Demo Users
const DEMO_USERS = [
  { email: "admin@greenwave.farm", password: "demo123456", full_name: "Admin User", username: "admin" },
  { email: "mike@greenwave.farm", password: "demo123456", full_name: "Mike Johnson", username: "mike_j" },
  { email: "sarah@greenwave.farm", password: "demo123456", full_name: "Sarah Williams", username: "sarah_w" },
  { email: "aung@greenwave.farm", password: "demo123456", full_name: "Aung Kyaw", username: "aung_k" },
  { email: "thandar@greenwave.farm", password: "demo123456", full_name: "Thandar Win", username: "thandar_w" },
];

async function seed() {
  console.log("🌱 Seeding Phase 1: Social Core...\n");

  // Create users
  const userIds: string[] = [];
  for (const user of DEMO_USERS) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: { full_name: user.full_name, username: user.username },
    });
    if (error) {
      console.error(`  ❌ Failed to create ${user.email}: ${error.message}`);
      continue;
    }
    userIds.push(data.user.id);
    console.log(`  ✅ Created user: ${user.full_name} (${data.user.id})`);
  }

  if (userIds.length < 5) {
    console.error("\n❌ Not all users created. Aborting seed.");
    return;
  }

  // Friendships
  const friendships = [
    { requester_id: userIds[0], addressee_id: userIds[1], status: "accepted" },
    { requester_id: userIds[0], addressee_id: userIds[2], status: "accepted" },
    { requester_id: userIds[1], addressee_id: userIds[2], status: "accepted" },
    { requester_id: userIds[3], addressee_id: userIds[0], status: "accepted" },
    { requester_id: userIds[4], addressee_id: userIds[0], status: "accepted" },
    { requester_id: userIds[2], addressee_id: userIds[3], status: "accepted" },
    { requester_id: userIds[4], addressee_id: userIds[1], status: "pending" },
    { requester_id: userIds[3], addressee_id: userIds[4], status: "pending" },
  ];

  const { error: frErr } = await supabase.from("friendships").insert(friendships);
  if (frErr) console.error("  ❌ Friendships:", frErr.message);
  else console.log(`  ✅ Created ${friendships.length} friendships`);

  // Follows
  const follows = [
    { follower_id: userIds[1], following_id: userIds[0] },
    { follower_id: userIds[2], following_id: userIds[0] },
    { follower_id: userIds[3], following_id: userIds[0] },
    { follower_id: userIds[4], following_id: userIds[0] },
    { follower_id: userIds[0], following_id: userIds[2] },
    { follower_id: userIds[0], following_id: userIds[1] },
    { follower_id: userIds[2], following_id: userIds[3] },
  ];

  const { error: folErr } = await supabase.from("follows").insert(follows);
  if (folErr) console.error("  ❌ Follows:", folErr.message);
  else console.log(`  ✅ Created ${follows.length} follows`);

  // 30 Posts
  const postContents = [
    { author: 0, content: "Just finished setting up the new automated pH monitoring system in Zone A. EC levels are now auto-adjusted every 30 minutes. 🌱💧", visibility: "public" },
    { author: 0, content: "Welcome to the GreenWave community! We're building the most advanced hydroponic cannabis farming platform. 🚀", visibility: "public" },
    { author: 0, content: "Harvest day! OG Kush from Zone C is looking absolutely beautiful.", visibility: "friends" },
    { author: 0, content: "Reminder: Team meeting tomorrow at 9 AM.", visibility: "friends" },
    { author: 0, content: "Personal note: Grateful for this incredible team.", visibility: "only_me" },
    { author: 0, content: "New nutrient formulation testing results are in! Our custom CalMag blend shows 15% better absorption.", visibility: "public" },
    { author: 0, content: "Just added 3 new CCTV cameras covering the drying room. 📹", visibility: "public" },
    { author: 0, content: "Quick tip: Keep reservoir temperature between 18-22°C for optimal nutrient uptake.", visibility: "public" },
    { author: 1, content: "Zone A update: Seedlings from the new OG Kush batch are showing incredible vigor!", visibility: "public" },
    { author: 1, content: "Experimenting with LED light spectrum adjustments during vegetative phase.", visibility: "public" },
    { author: 1, content: "Pro tip: Always calibrate your pH meter before each use.", visibility: "public" },
    { author: 1, content: "Comparing DWC vs NFT systems for our next expansion. Thoughts?", visibility: "friends" },
    { author: 1, content: "Just received the new Samsung LM301H diodes!", visibility: "public" },
    { author: 1, content: "EC meter reading training session done with new staff. 💪", visibility: "friends" },
    { author: 1, content: "Weekend project: DIY automated nutrient dosing system using peristaltic pumps. $120 total!", visibility: "public" },
    { author: 2, content: "Research update: Our organic CalMag supplement trial shows 23% improvement in bud density. 📊", visibility: "public" },
    { author: 2, content: "New batch of beneficial microbes arrived! Starting trials in Zone B next week.", visibility: "public" },
    { author: 2, content: "The key to perfect nutrients: pH 5.8-6.2 in hydro, EC 1.2-1.8 for veg, EC 1.8-2.4 for flower.", visibility: "public" },
    { author: 2, content: "Lab day! Running terpene profiles on 5 different OG Kush phenotypes.", visibility: "friends" },
    { author: 2, content: "Foliar feeding tip: Apply in the first 2 hours after lights on.", visibility: "public" },
    { author: 2, content: "Exciting news! Just got approved for a grant to study terpene-entourage effects. 🎉", visibility: "public" },
    { author: 3, content: "Genetics update: Our F2 cross of Thai Sativa × Afghan Kush shows 30% faster growth!", visibility: "public" },
    { author: 3, content: "Seed selection day! Going through 200 seeds from our breeding program.", visibility: "friends" },
    { author: 3, content: "Tropical genetics are the future. Our Mandalay Haze is now stable after 6 generations. 🌿", visibility: "public" },
    { author: 3, content: "Breeding tip: Always keep detailed records of every cross.", visibility: "public" },
    { author: 3, content: "Just cloned the top 3 performers from batch #42.", visibility: "friends" },
    { author: 4, content: "Climate control system upgrade complete! New HVAC handles 50% more airflow. ♻️", visibility: "public" },
    { author: 4, content: "Automated irrigation update: New drip system installed in all 5 zones.", visibility: "public" },
    { author: 4, content: "Power backup system test: All zones maintained perfect conditions during 4-hour outage simulation.", visibility: "friends" },
    { author: 4, content: "Dehumidifier maintenance day! Cleaned all 12 units.", visibility: "public" },
  ];

  const postIds: string[] = [];
  for (const p of postContents) {
    const { data, error } = await supabase
      .from("posts")
      .insert({ author_id: userIds[p.author], content: p.content, visibility: p.visibility })
      .select("id")
      .single();
    if (error) { console.error(`  ❌ Post: ${error.message}`); continue; }
    postIds.push(data.id);
  }
  console.log(`  ✅ Created ${postIds.length} posts`);

  // Reactions
  const reactions = [
    { user_id: userIds[1], target_type: "post", target_id: postIds[0], reaction_type: "love" },
    { user_id: userIds[2], target_type: "post", target_id: postIds[0], reaction_type: "like" },
    { user_id: userIds[3], target_type: "post", target_id: postIds[0], reaction_type: "wow" },
    { user_id: userIds[4], target_type: "post", target_id: postIds[0], reaction_type: "like" },
    { user_id: userIds[0], target_type: "post", target_id: postIds[8], reaction_type: "love" },
    { user_id: userIds[2], target_type: "post", target_id: postIds[8], reaction_type: "like" },
    { user_id: userIds[0], target_type: "post", target_id: postIds[15], reaction_type: "love" },
    { user_id: userIds[1], target_type: "post", target_id: postIds[15], reaction_type: "wow" },
    { user_id: userIds[0], target_type: "post", target_id: postIds[14], reaction_type: "love" },
    { user_id: userIds[0], target_type: "post", target_id: postIds[21], reaction_type: "like" },
  ];

  const { error: rxnErr } = await supabase.from("reactions").insert(reactions);
  if (rxnErr) console.error("  ❌ Reactions:", rxnErr.message);
  else console.log(`  ✅ Created ${reactions.length} reactions`);

  // Comments
  const comments = [
    { post_id: postIds[0], author_id: userIds[1], content: "Amazing work! The automation is next level." },
    { post_id: postIds[0], author_id: userIds[2], content: "This is going to save so much time on daily monitoring. 👏" },
    { post_id: postIds[0], author_id: userIds[3], content: "Can you share the sensor model?" },
    { post_id: postIds[10], author_id: userIds[0], content: "Can't stress this enough! Lost a batch once due to uncalibrated readings." },
    { post_id: postIds[10], author_id: userIds[2], content: "Also: store your pH probe in storage solution, never in water!" },
    { post_id: postIds[14], author_id: userIds[0], content: "Brilliant! Can you share the Arduino code?" },
    { post_id: postIds[14], author_id: userIds[2], content: "$120 for automated dosing?! Amazing DIY!" },
    { post_id: postIds[17], author_id: userIds[1], content: "This is the best nutrient guide I've seen. 📌" },
    { post_id: postIds[17], author_id: userIds[3], content: "For heavy-feeding strains, I'd push EC to 2.6 during late flower." },
  ];

  const { error: cmtErr } = await supabase.from("comments").insert(comments);
  if (cmtErr) console.error("  ❌ Comments:", cmtErr.message);
  else console.log(`  ✅ Created ${comments.length} comments`);

  // Notifications
  const notifications = [
    { user_id: userIds[0], type: "post_like", actor_id: userIds[1], target_type: "post", target_id: postIds[0] },
    { user_id: userIds[0], type: "post_comment", actor_id: userIds[1], target_type: "post", target_id: postIds[0] },
    { user_id: userIds[0], type: "post_like", actor_id: userIds[2], target_type: "post", target_id: postIds[0] },
    { user_id: userIds[0], type: "friend_request", actor_id: userIds[4], target_type: "user", target_id: userIds[0] },
    { user_id: userIds[0], type: "follow", actor_id: userIds[2], target_type: "user", target_id: userIds[0] },
  ];

  const { error: notifErr } = await supabase.from("notifications").insert(notifications);
  if (notifErr) console.error("  ❌ Notifications:", notifErr.message);
  else console.log(`  ✅ Created ${notifications.length} notifications`);

  console.log("\n✅ Phase 1 seed complete!");
  console.log("\nDemo accounts (password for all: demo123456):");
  DEMO_USERS.forEach((u) => console.log(`  • ${u.email} (${u.full_name})`));
}

seed().catch(console.error);
