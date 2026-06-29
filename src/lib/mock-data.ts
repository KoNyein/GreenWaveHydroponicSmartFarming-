import type {
  FarmZone,
  SensorReading,
  Camera,
  InventoryItem,
  Product,
  Sale,
  SaleItem,
  DryRoomBatch,
  StoreRoomItem,
  AffiliateLink,
  DropshipOrder,
  FarmSchedule,
  Profile,
  WallPost,
  MemberSubscription,
  Friendship,
  ChatMessage,
  Conversation,
  MarketplaceListing,
} from "@/types/database";

const uuid = (n: number) => `00000000-0000-0000-0000-${String(n).padStart(12, "0")}`;

export const mockProfile: Profile = {
  id: uuid(1),
  email: "admin@greenwave.farm",
  full_name: "Admin User",
  role: "admin",
  avatar_url: null,
  phone: "+1234567890",
  is_active: true,
  affiliate_code: "GW-ADMIN",
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-06-01T00:00:00Z",
};

export const mockZones: FarmZone[] = [
  { id: uuid(10), name: "Zone A - Seedling", zone_type: "seedling", description: "Seedling propagation area", is_active: true, created_at: "2025-01-01T00:00:00Z" },
  { id: uuid(11), name: "Zone B - Vegetative", zone_type: "vegetative", description: "Vegetative growth chamber", is_active: true, created_at: "2025-01-01T00:00:00Z" },
  { id: uuid(12), name: "Zone C - Flowering", zone_type: "flowering", description: "Flowering room with 12/12 light cycle", is_active: true, created_at: "2025-01-01T00:00:00Z" },
  { id: uuid(13), name: "Zone D - Mother Plants", zone_type: "mother", description: "Mother plant preservation", is_active: true, created_at: "2025-01-01T00:00:00Z" },
  { id: uuid(14), name: "Zone E - Clone", zone_type: "clone", description: "Cloning and rooting area", is_active: true, created_at: "2025-01-01T00:00:00Z" },
];

export const mockSensorReadings: SensorReading[] = mockZones.map((zone, i) => ({
  id: uuid(100 + i),
  zone_id: zone.id,
  temperature: 22 + Math.random() * 6,
  humidity: 45 + Math.random() * 25,
  ph_level: 5.5 + Math.random() * 1.5,
  ec_level: 1.0 + Math.random() * 1.5,
  water_level: 60 + Math.random() * 35,
  light_intensity: 400 + Math.random() * 600,
  nutrient_ppm: 800 + Math.random() * 600,
  created_at: new Date().toISOString(),
}));

export const mockCameras: Camera[] = [
  { id: uuid(20), name: "Seedling Cam 1", zone_id: uuid(10), stream_url: "/api/stream/cam1", location: "Zone A - Ceiling", is_online: true, camera_type: "indoor", created_at: "2025-01-01T00:00:00Z" },
  { id: uuid(21), name: "Veg Room Cam", zone_id: uuid(11), stream_url: "/api/stream/cam2", location: "Zone B - Corner", is_online: true, camera_type: "indoor", created_at: "2025-01-01T00:00:00Z" },
  { id: uuid(22), name: "Flower Room Cam", zone_id: uuid(12), stream_url: "/api/stream/cam3", location: "Zone C - Center", is_online: true, camera_type: "indoor", created_at: "2025-01-01T00:00:00Z" },
  { id: uuid(23), name: "Dry Room Cam", zone_id: null, stream_url: "/api/stream/cam4", location: "Dry Room", is_online: true, camera_type: "dryroom", created_at: "2025-01-01T00:00:00Z" },
  { id: uuid(24), name: "Store Room Cam", zone_id: null, stream_url: "/api/stream/cam5", location: "Store Room", is_online: false, camera_type: "storeroom", created_at: "2025-01-01T00:00:00Z" },
  { id: uuid(25), name: "Entrance Cam", zone_id: null, stream_url: "/api/stream/cam6", location: "Main Entrance", is_online: true, camera_type: "outdoor", created_at: "2025-01-01T00:00:00Z" },
];

export const mockInventory: InventoryItem[] = [
  { id: uuid(30), name: "General Hydroponics Flora Grow", category: "nutrients", quantity: 25, unit: "liters", min_stock_level: 10, cost_per_unit: 15.0, supplier: "GH Supply", location: "farm", created_at: "2025-01-01T00:00:00Z", updated_at: "2025-06-01T00:00:00Z" },
  { id: uuid(31), name: "pH Down Solution", category: "chemicals", quantity: 8, unit: "liters", min_stock_level: 5, cost_per_unit: 12.0, supplier: "GH Supply", location: "farm", created_at: "2025-01-01T00:00:00Z", updated_at: "2025-06-01T00:00:00Z" },
  { id: uuid(32), name: "Rockwool Cubes (1000pc)", category: "equipment", quantity: 3, unit: "boxes", min_stock_level: 2, cost_per_unit: 45.0, supplier: "Grodan", location: "farm", created_at: "2025-01-01T00:00:00Z", updated_at: "2025-06-01T00:00:00Z" },
  { id: uuid(33), name: "Mylar Bags (100pc)", category: "packaging", quantity: 15, unit: "packs", min_stock_level: 5, cost_per_unit: 25.0, supplier: "PackCo", location: "store_room", created_at: "2025-01-01T00:00:00Z", updated_at: "2025-06-01T00:00:00Z" },
  { id: uuid(34), name: "OG Kush Seeds", category: "seeds", quantity: 50, unit: "seeds", min_stock_level: 20, cost_per_unit: 8.0, supplier: "SeedBank", location: "farm", created_at: "2025-01-01T00:00:00Z", updated_at: "2025-06-01T00:00:00Z" },
  { id: uuid(35), name: "CalMag Supplement", category: "nutrients", quantity: 12, unit: "liters", min_stock_level: 5, cost_per_unit: 18.0, supplier: "GH Supply", location: "farm", created_at: "2025-01-01T00:00:00Z", updated_at: "2025-06-01T00:00:00Z" },
];

export const mockProducts: Product[] = [
  { id: uuid(40), name: "Premium OG Kush - 3.5g", description: "Top shelf OG Kush flower", category: "Flower", price: 45.0, cost: 15.0, stock_quantity: 120, sku: "FLW-OGK-35", image_url: null, is_active: true, is_dropship: false, supplier_id: null, created_at: "2025-01-01T00:00:00Z", updated_at: "2025-06-01T00:00:00Z" },
  { id: uuid(41), name: "Blue Dream Pre-Roll 5pk", description: "Pre-rolled Blue Dream joints", category: "Pre-Roll", price: 35.0, cost: 10.0, stock_quantity: 80, sku: "PRE-BD-5PK", image_url: null, is_active: true, is_dropship: false, supplier_id: null, created_at: "2025-01-01T00:00:00Z", updated_at: "2025-06-01T00:00:00Z" },
  { id: uuid(42), name: "CBD Tincture 1000mg", description: "Full spectrum CBD oil", category: "Tincture", price: 65.0, cost: 20.0, stock_quantity: 45, sku: "TNC-CBD-1K", image_url: null, is_active: true, is_dropship: true, supplier_id: null, created_at: "2025-01-01T00:00:00Z", updated_at: "2025-06-01T00:00:00Z" },
  { id: uuid(43), name: "THC Gummies 10pk", description: "Assorted THC gummies", category: "Edible", price: 30.0, cost: 8.0, stock_quantity: 200, sku: "EDI-GUM-10", image_url: null, is_active: true, is_dropship: true, supplier_id: null, created_at: "2025-01-01T00:00:00Z", updated_at: "2025-06-01T00:00:00Z" },
];

export const mockSaleItems: SaleItem[] = [
  { id: uuid(61), sale_id: uuid(50), product_id: uuid(40), product_name: "Premium OG Kush - 3.5g", quantity: 2, unit_price: 45.0, total_price: 90.0 },
  { id: uuid(62), sale_id: uuid(50), product_id: uuid(41), product_name: "Blue Dream Pre-Roll 5pk", quantity: 1, unit_price: 35.0, total_price: 35.0 },
  { id: uuid(63), sale_id: uuid(51), product_id: uuid(43), product_name: "THC Gummies 10pk", quantity: 3, unit_price: 30.0, total_price: 90.0 },
];

export const mockSales: Sale[] = [
  { id: uuid(50), customer_name: "John Doe", customer_email: "john@example.com", total_amount: 125.0, discount_amount: 0, tax_amount: 12.5, payment_method: "card", status: "completed", cashier_id: uuid(1), affiliate_id: null, notes: null, created_at: "2025-06-20T10:30:00Z" },
  { id: uuid(51), customer_name: "Jane Smith", customer_email: "jane@example.com", total_amount: 90.0, discount_amount: 5.0, tax_amount: 8.5, payment_method: "cash", status: "completed", cashier_id: uuid(1), affiliate_id: null, notes: "Returning customer", created_at: "2025-06-20T14:15:00Z" },
  { id: uuid(52), customer_name: "Bob Wilson", customer_email: null, total_amount: 65.0, discount_amount: 0, tax_amount: 6.5, payment_method: "transfer", status: "pending", cashier_id: uuid(1), affiliate_id: null, notes: null, created_at: "2025-06-21T09:00:00Z" },
];

export const mockDryRoomBatches: DryRoomBatch[] = [
  { id: uuid(70), batch_name: "Batch-2025-06-A", strain: "OG Kush", zone_origin: "Zone C - Flowering", wet_weight_g: 5000, dry_weight_g: 1200, temperature: 20, humidity: 55, status: "curing", start_date: "2025-06-10", end_date: null, notes: "Good trichome coverage", created_at: "2025-06-10T00:00:00Z", updated_at: "2025-06-18T00:00:00Z" },
  { id: uuid(71), batch_name: "Batch-2025-06-B", strain: "Blue Dream", zone_origin: "Zone C - Flowering", wet_weight_g: 4200, dry_weight_g: null, temperature: 21, humidity: 52, status: "drying", start_date: "2025-06-18", end_date: null, notes: null, created_at: "2025-06-18T00:00:00Z", updated_at: "2025-06-20T00:00:00Z" },
  { id: uuid(72), batch_name: "Batch-2025-05-C", strain: "Gorilla Glue", zone_origin: "Zone C - Flowering", wet_weight_g: 3800, dry_weight_g: 950, temperature: 20, humidity: 58, status: "completed", start_date: "2025-05-20", end_date: "2025-06-05", notes: "Excellent yield", created_at: "2025-05-20T00:00:00Z", updated_at: "2025-06-05T00:00:00Z" },
];

export const mockStoreRoomItems: StoreRoomItem[] = [
  { id: uuid(80), product_name: "OG Kush - Cured", batch_id: uuid(70), quantity: 800, unit: "grams", quality_grade: "A", shelf_location: "A1-01", expiry_date: "2026-06-01", status: "available", created_at: "2025-06-05T00:00:00Z", updated_at: "2025-06-15T00:00:00Z" },
  { id: uuid(81), product_name: "Gorilla Glue - Cured", batch_id: uuid(72), quantity: 500, unit: "grams", quality_grade: "A", shelf_location: "A1-02", expiry_date: "2026-05-01", status: "available", created_at: "2025-06-05T00:00:00Z", updated_at: "2025-06-15T00:00:00Z" },
  { id: uuid(82), product_name: "Blue Dream Trim", batch_id: null, quantity: 1200, unit: "grams", quality_grade: "B", shelf_location: "B2-01", expiry_date: "2026-03-01", status: "available", created_at: "2025-06-10T00:00:00Z", updated_at: "2025-06-15T00:00:00Z" },
  { id: uuid(83), product_name: "OG Kush - Reserved", batch_id: uuid(70), quantity: 200, unit: "grams", quality_grade: "A", shelf_location: "A1-03", expiry_date: "2026-06-01", status: "reserved", created_at: "2025-06-05T00:00:00Z", updated_at: "2025-06-18T00:00:00Z" },
];

export const mockAffiliateLinks: AffiliateLink[] = [
  { id: uuid(90), user_id: uuid(1), code: "GW-ADMIN", clicks: 245, conversions: 32, total_earned: 1520.0, is_active: true, created_at: "2025-01-15T00:00:00Z" },
  { id: uuid(91), user_id: uuid(2), code: "GW-MIKE", clicks: 180, conversions: 21, total_earned: 980.0, is_active: true, created_at: "2025-02-01T00:00:00Z" },
];

export const mockDropshipOrders: DropshipOrder[] = [
  { id: uuid(110), order_number: "DS-2025-0001", customer_name: "Alice Brown", customer_email: "alice@example.com", customer_address: "123 Main St, Portland, OR", product_id: uuid(42), quantity: 2, total_amount: 130.0, supplier_cost: 40.0, profit: 90.0, status: "delivered", tracking_number: "TRK123456", created_at: "2025-06-15T00:00:00Z", updated_at: "2025-06-19T00:00:00Z" },
  { id: uuid(111), order_number: "DS-2025-0002", customer_name: "Charlie Green", customer_email: "charlie@example.com", customer_address: "456 Oak Ave, Denver, CO", product_id: uuid(43), quantity: 5, total_amount: 150.0, supplier_cost: 40.0, profit: 110.0, status: "shipped", tracking_number: "TRK789012", created_at: "2025-06-19T00:00:00Z", updated_at: "2025-06-20T00:00:00Z" },
  { id: uuid(112), order_number: "DS-2025-0003", customer_name: "Diana White", customer_email: "diana@example.com", customer_address: "789 Pine Rd, Seattle, WA", product_id: uuid(42), quantity: 1, total_amount: 65.0, supplier_cost: 20.0, profit: 45.0, status: "pending", tracking_number: null, created_at: "2025-06-21T00:00:00Z", updated_at: "2025-06-21T00:00:00Z" },
];

export const mockSchedules: FarmSchedule[] = [
  { id: uuid(120), zone_id: uuid(10), action_type: "water", scheduled_time: "06:00:00", is_recurring: true, recurrence_interval: "daily", is_active: true, last_executed: "2025-06-21T06:00:00Z", created_at: "2025-01-01T00:00:00Z" },
  { id: uuid(121), zone_id: uuid(11), action_type: "nutrient", scheduled_time: "08:00:00", is_recurring: true, recurrence_interval: "every_2_days", is_active: true, last_executed: "2025-06-20T08:00:00Z", created_at: "2025-01-01T00:00:00Z" },
  { id: uuid(122), zone_id: uuid(12), action_type: "light_on", scheduled_time: "18:00:00", is_recurring: true, recurrence_interval: "daily", is_active: true, last_executed: "2025-06-21T18:00:00Z", created_at: "2025-01-01T00:00:00Z" },
  { id: uuid(123), zone_id: uuid(12), action_type: "light_off", scheduled_time: "06:00:00", is_recurring: true, recurrence_interval: "daily", is_active: true, last_executed: "2025-06-21T06:00:00Z", created_at: "2025-01-01T00:00:00Z" },
  { id: uuid(124), zone_id: uuid(11), action_type: "ph_adjust", scheduled_time: "12:00:00", is_recurring: true, recurrence_interval: "weekly", is_active: false, last_executed: null, created_at: "2025-01-01T00:00:00Z" },
];

export const mockMemberProfiles: Profile[] = [
  { id: uuid(1), email: "admin@greenwave.farm", full_name: "Admin User", role: "admin", avatar_url: null, phone: "+1234567890", is_active: true, affiliate_code: "GW-ADMIN", created_at: "2025-01-01T00:00:00Z", updated_at: "2025-06-01T00:00:00Z" },
  { id: uuid(2), email: "mike@greenwave.farm", full_name: "Mike Johnson", role: "manager", avatar_url: null, phone: "+1234567891", is_active: true, affiliate_code: "GW-MIKE", created_at: "2025-02-01T00:00:00Z", updated_at: "2025-06-01T00:00:00Z" },
  { id: uuid(3), email: "sarah@greenwave.farm", full_name: "Sarah Williams", role: "staff", avatar_url: null, phone: "+1234567892", is_active: true, affiliate_code: null, created_at: "2025-03-01T00:00:00Z", updated_at: "2025-06-01T00:00:00Z" },
  { id: uuid(4), email: "john@example.com", full_name: "John Doe", role: "member", avatar_url: null, phone: "+1234567893", is_active: true, affiliate_code: "GW-JOHN", created_at: "2025-04-01T00:00:00Z", updated_at: "2025-06-01T00:00:00Z" },
  { id: uuid(5), email: "jane@example.com", full_name: "Jane Smith", role: "member", avatar_url: null, phone: null, is_active: false, affiliate_code: null, created_at: "2025-05-01T00:00:00Z", updated_at: "2025-06-01T00:00:00Z" },
  { id: uuid(6), email: "aung@greenwave.farm", full_name: "Aung Kyaw", role: "member", avatar_url: null, phone: "+959123456", is_active: true, affiliate_code: "GW-AUNG", created_at: "2025-03-15T00:00:00Z", updated_at: "2025-06-10T00:00:00Z" },
  { id: uuid(7), email: "thandar@greenwave.farm", full_name: "Thandar Win", role: "member", avatar_url: null, phone: "+959789012", is_active: true, affiliate_code: null, created_at: "2025-04-10T00:00:00Z", updated_at: "2025-06-15T00:00:00Z" },
];

export const mockFriendships: Friendship[] = [
  { id: uuid(400), user_id: uuid(1), friend_id: uuid(2), status: "accepted", created_at: "2025-01-15T00:00:00Z" },
  { id: uuid(401), user_id: uuid(1), friend_id: uuid(3), status: "accepted", created_at: "2025-02-01T00:00:00Z" },
  { id: uuid(402), user_id: uuid(1), friend_id: uuid(4), status: "accepted", created_at: "2025-04-05T00:00:00Z" },
  { id: uuid(403), user_id: uuid(1), friend_id: uuid(6), status: "accepted", created_at: "2025-03-20T00:00:00Z" },
  { id: uuid(404), user_id: uuid(2), friend_id: uuid(3), status: "accepted", created_at: "2025-02-10T00:00:00Z" },
  { id: uuid(405), user_id: uuid(4), friend_id: uuid(6), status: "accepted", created_at: "2025-04-15T00:00:00Z" },
  { id: uuid(406), user_id: uuid(4), friend_id: uuid(7), status: "pending", created_at: "2025-06-01T00:00:00Z" },
  { id: uuid(407), user_id: uuid(6), friend_id: uuid(7), status: "accepted", created_at: "2025-05-01T00:00:00Z" },
];

export function areFriends(userId: string, otherId: string): boolean {
  return mockFriendships.some(
    (f) =>
      f.status === "accepted" &&
      ((f.user_id === userId && f.friend_id === otherId) ||
        (f.user_id === otherId && f.friend_id === userId))
  );
}

export function getVisiblePosts(posts: WallPost[], viewerId: string, wallOwnerId: string): WallPost[] {
  return posts.filter((post) => {
    if (post.visibility === "public") return true;
    if (post.author_id === viewerId) return true;
    if (post.wall_owner_id === viewerId) return true;
    return areFriends(viewerId, post.author_id);
  });
}

export const mockWallPosts: WallPost[] = [
  {
    id: uuid(200), author_id: uuid(1), author_name: "Admin User", author_avatar: null, author_role: "admin",
    wall_owner_id: uuid(1), content: "Just upgraded our hydroponic system to the latest nutrient delivery setup. Results looking amazing! 🌿",
    image_url: null, photos: ["https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600", "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600"],
    location: { lat: 16.8661, lng: 96.1951, name: "GreenWave Farm, Yangon" }, visibility: "public",
    reactions: [
      { user_id: uuid(2), user_name: "Mike Johnson", type: "love" },
      { user_id: uuid(3), user_name: "Sarah Williams", type: "like" },
      { user_id: uuid(4), user_name: "John Doe", type: "wow" },
      { user_id: uuid(6), user_name: "Aung Kyaw", type: "love" },
    ],
    comments_count: 3, created_at: "2025-06-20T10:30:00Z",
  },
  {
    id: uuid(201), author_id: uuid(2), author_name: "Mike Johnson", author_avatar: null, author_role: "manager",
    wall_owner_id: uuid(2), content: "Zone C flowering stage looking incredible this cycle. Best trichome coverage we've seen!",
    image_url: null, photos: ["https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=600"],
    location: { lat: 16.8700, lng: 96.2000, name: "Zone C, GreenWave Farm" }, visibility: "friends",
    reactions: [
      { user_id: uuid(1), user_name: "Admin User", type: "like" },
      { user_id: uuid(3), user_name: "Sarah Williams", type: "love" },
    ],
    comments_count: 5, created_at: "2025-06-19T14:20:00Z",
  },
  {
    id: uuid(202), author_id: uuid(4), author_name: "John Doe", author_avatar: null, author_role: "member",
    wall_owner_id: uuid(4), content: "Started my first hydroponic grow at home using GreenWave techniques. Any tips for seedling stage?",
    image_url: null, photos: [],
    location: { lat: 37.7749, lng: -122.4194, name: "San Francisco, CA" }, visibility: "public",
    reactions: [
      { user_id: uuid(1), user_name: "Admin User", type: "like" },
      { user_id: uuid(6), user_name: "Aung Kyaw", type: "like" },
      { user_id: uuid(7), user_name: "Thandar Win", type: "haha" },
    ],
    comments_count: 7, created_at: "2025-06-18T09:15:00Z",
  },
  {
    id: uuid(203), author_id: uuid(3), author_name: "Sarah Williams", author_avatar: null, author_role: "staff",
    wall_owner_id: uuid(3), content: "pH levels have been super stable this week across all zones. Great teamwork everyone! 💪",
    image_url: null, photos: [],
    location: null, visibility: "friends",
    reactions: [
      { user_id: uuid(1), user_name: "Admin User", type: "love" },
      { user_id: uuid(2), user_name: "Mike Johnson", type: "like" },
    ],
    comments_count: 2, created_at: "2025-06-17T16:45:00Z",
  },
  {
    id: uuid(204), author_id: uuid(6), author_name: "Aung Kyaw", author_avatar: null, author_role: "member",
    wall_owner_id: uuid(6), content: "Myanmar ရဲ့ ပထမဆုံး hydroponic farm ကို GreenWave system နဲ့ စတင်ခဲ့ပါတယ်။ အရမ်းကောင်းပါတယ်!",
    image_url: null, photos: ["https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600", "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=600", "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600"],
    location: { lat: 21.9162, lng: 95.9560, name: "Mandalay, Myanmar" }, visibility: "public",
    reactions: [
      { user_id: uuid(1), user_name: "Admin User", type: "love" },
      { user_id: uuid(4), user_name: "John Doe", type: "wow" },
      { user_id: uuid(7), user_name: "Thandar Win", type: "love" },
      { user_id: uuid(2), user_name: "Mike Johnson", type: "like" },
      { user_id: uuid(3), user_name: "Sarah Williams", type: "sad" },
    ],
    comments_count: 10, created_at: "2025-06-16T11:00:00Z",
  },
  {
    id: uuid(205), author_id: uuid(7), author_name: "Thandar Win", author_avatar: null, author_role: "member",
    wall_owner_id: uuid(7), content: "Just completed the 14-day trial and absolutely love the POS system. Upgrading to Pro plan now!",
    image_url: null, photos: [],
    location: null, visibility: "friends",
    reactions: [
      { user_id: uuid(6), user_name: "Aung Kyaw", type: "like" },
    ],
    comments_count: 1, created_at: "2025-06-15T08:30:00Z",
  },
  {
    id: uuid(206), author_id: uuid(1), author_name: "Admin User", author_avatar: null, author_role: "admin",
    wall_owner_id: uuid(4), content: "Welcome to GreenWave, John! For seedlings, keep pH between 5.5-6.0 and humidity around 70%. Good luck!",
    image_url: null, photos: [],
    location: null, visibility: "public",
    reactions: [
      { user_id: uuid(4), user_name: "John Doe", type: "love" },
    ],
    comments_count: 0, created_at: "2025-06-18T11:30:00Z",
  },
];

export const mockSubscriptions: MemberSubscription[] = [
  { id: uuid(300), user_id: uuid(1), plan: "enterprise", status: "active", trial_start: "2025-01-01", trial_end: "2025-01-14", features: ["pos", "hydroponic", "cctv", "inventory", "dry_room", "store_room", "sales", "shop", "dropship", "affiliate"], created_at: "2025-01-01T00:00:00Z" },
  { id: uuid(301), user_id: uuid(4), plan: "free_trial", status: "active", trial_start: "2025-06-10", trial_end: "2025-06-24", features: ["pos", "hydroponic"], created_at: "2025-06-10T00:00:00Z" },
  { id: uuid(302), user_id: uuid(5), plan: "free_trial", status: "expired", trial_start: "2025-05-01", trial_end: "2025-05-15", features: ["pos", "hydroponic"], created_at: "2025-05-01T00:00:00Z" },
  { id: uuid(303), user_id: uuid(6), plan: "pro", status: "active", trial_start: "2025-03-15", trial_end: "2025-03-29", features: ["pos", "hydroponic", "cctv", "inventory", "dry_room", "store_room"], created_at: "2025-03-15T00:00:00Z" },
  { id: uuid(304), user_id: uuid(7), plan: "basic", status: "active", trial_start: "2025-04-10", trial_end: "2025-04-24", features: ["pos", "hydroponic"], created_at: "2025-04-10T00:00:00Z" },
];

export const mockConversations: Conversation[] = [
  { id: uuid(500), participants: [uuid(1), uuid(2)], last_message: "The new nutrient mix is ready for Zone A", last_message_time: "2025-06-22T09:30:00Z", unread_count: 2 },
  { id: uuid(501), participants: [uuid(1), uuid(4)], last_message: "Thanks for the seedling tips!", last_message_time: "2025-06-21T15:45:00Z", unread_count: 0 },
  { id: uuid(502), participants: [uuid(1), uuid(6)], last_message: "📍 Mandalay, Myanmar", last_message_time: "2025-06-20T11:00:00Z", unread_count: 1 },
  { id: uuid(503), participants: [uuid(1), uuid(3)], last_message: "pH report is attached", last_message_time: "2025-06-19T16:30:00Z", unread_count: 0 },
];

export const mockMessages: ChatMessage[] = [
  { id: uuid(600), conversation_id: uuid(500), sender_id: uuid(2), sender_name: "Mike Johnson", type: "text", content: "Hey, how are the Zone A plants doing?", photo_url: null, audio_url: null, location: null, read: true, created_at: "2025-06-22T09:00:00Z" },
  { id: uuid(601), conversation_id: uuid(500), sender_id: uuid(1), sender_name: "Admin User", type: "text", content: "Looking great! EC levels are stable at 1.8", photo_url: null, audio_url: null, location: null, read: true, created_at: "2025-06-22T09:10:00Z" },
  { id: uuid(602), conversation_id: uuid(500), sender_id: uuid(2), sender_name: "Mike Johnson", type: "photo", content: "Check out the new growth!", photo_url: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400", audio_url: null, location: null, read: true, created_at: "2025-06-22T09:15:00Z" },
  { id: uuid(603), conversation_id: uuid(500), sender_id: uuid(1), sender_name: "Admin User", type: "text", content: "Impressive! The trichomes are developing nicely", photo_url: null, audio_url: null, location: null, read: true, created_at: "2025-06-22T09:20:00Z" },
  { id: uuid(604), conversation_id: uuid(500), sender_id: uuid(2), sender_name: "Mike Johnson", type: "text", content: "The new nutrient mix is ready for Zone A", photo_url: null, audio_url: null, location: null, read: false, created_at: "2025-06-22T09:30:00Z" },
  { id: uuid(605), conversation_id: uuid(500), sender_id: uuid(2), sender_name: "Mike Johnson", type: "audio", content: "Voice message (0:15)", photo_url: null, audio_url: "/audio/voice-note.mp3", location: null, read: false, created_at: "2025-06-22T09:31:00Z" },
  { id: uuid(610), conversation_id: uuid(501), sender_id: uuid(4), sender_name: "John Doe", type: "text", content: "Hi! I just started with hydroponics. Any tips for seedlings?", photo_url: null, audio_url: null, location: null, read: true, created_at: "2025-06-21T14:00:00Z" },
  { id: uuid(611), conversation_id: uuid(501), sender_id: uuid(1), sender_name: "Admin User", type: "text", content: "Keep pH between 5.5-6.0, humidity around 70%, and temperature at 22-25°C", photo_url: null, audio_url: null, location: null, read: true, created_at: "2025-06-21T15:00:00Z" },
  { id: uuid(612), conversation_id: uuid(501), sender_id: uuid(4), sender_name: "John Doe", type: "text", content: "Thanks for the seedling tips!", photo_url: null, audio_url: null, location: null, read: true, created_at: "2025-06-21T15:45:00Z" },
  { id: uuid(620), conversation_id: uuid(502), sender_id: uuid(6), sender_name: "Aung Kyaw", type: "text", content: "ကျွန်တော် Mandalay မှာ farm အသစ်ဖွင့်ပါတယ်", photo_url: null, audio_url: null, location: null, read: true, created_at: "2025-06-20T10:00:00Z" },
  { id: uuid(621), conversation_id: uuid(502), sender_id: uuid(6), sender_name: "Aung Kyaw", type: "location", content: "📍 Mandalay, Myanmar", photo_url: null, audio_url: null, location: { lat: 21.9162, lng: 95.9560, name: "Mandalay, Myanmar" }, read: false, created_at: "2025-06-20T11:00:00Z" },
  { id: uuid(630), conversation_id: uuid(503), sender_id: uuid(3), sender_name: "Sarah Williams", type: "text", content: "pH report is attached", photo_url: null, audio_url: null, location: null, read: true, created_at: "2025-06-19T16:30:00Z" },
  { id: uuid(631), conversation_id: uuid(503), sender_id: uuid(3), sender_name: "Sarah Williams", type: "photo", content: "pH Report", photo_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400", audio_url: null, location: null, read: true, created_at: "2025-06-19T16:31:00Z" },
];

export const mockMarketplaceListings: MarketplaceListing[] = [
  { id: uuid(700), seller_id: uuid(1), seller_name: "Admin User", title: "Premium Hydroponic Nutrient Kit", description: "Complete A+B nutrient solution for all growth stages. pH balanced, includes CalMag supplement.", price: 45, currency: "USD", category: "nutrients", images: ["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400"], condition: "new", location: "Yangon, Myanmar", status: "active", created_at: "2025-06-18T10:00:00Z" },
  { id: uuid(701), seller_id: uuid(2), seller_name: "Mike Johnson", title: "LED Grow Light 600W Full Spectrum", description: "Samsung LM301B diodes, dimmable, covers 4x4ft area. Used for one cycle only.", price: 120, currency: "USD", category: "equipment", images: ["https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400"], condition: "like_new", location: "Yangon, Myanmar", status: "active", created_at: "2025-06-17T14:00:00Z" },
  { id: uuid(702), seller_id: uuid(6), seller_name: "Aung Kyaw", title: "Organic Cannabis Seeds - OG Kush", description: "Feminized seeds, 5 pack. Indoor/outdoor suitable. High THC genetics.", price: 35, currency: "USD", category: "seeds", images: ["https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=400"], condition: "new", location: "Mandalay, Myanmar", status: "active", created_at: "2025-06-16T09:00:00Z" },
  { id: uuid(703), seller_id: uuid(4), seller_name: "John Doe", title: "pH/EC Digital Meter Combo", description: "Accurate pH and EC readings. Calibration solutions included. Perfect for hydro monitoring.", price: 55, currency: "USD", category: "equipment", images: ["https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400"], condition: "new", location: "San Francisco, CA", status: "active", created_at: "2025-06-15T11:00:00Z" },
  { id: uuid(704), seller_id: uuid(3), seller_name: "Sarah Williams", title: "Dried Premium Flower - 28g", description: "Properly cured, stored in glass jars. Lab tested. Smooth smoke.", price: 200, currency: "USD", category: "harvest", images: ["https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400"], condition: "new", location: "Yangon, Myanmar", status: "active", created_at: "2025-06-14T16:00:00Z" },
  { id: uuid(705), seller_id: uuid(7), seller_name: "Thandar Win", title: "Clay Pebbles 50L Bag", description: "Expanded clay aggregate for hydroponic growing media. Washed and pH neutral.", price: 18, currency: "USD", category: "supplies", images: ["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400"], condition: "new", location: "Yangon, Myanmar", status: "active", created_at: "2025-06-13T08:00:00Z" },
  { id: uuid(706), seller_id: uuid(2), seller_name: "Mike Johnson", title: "Air Pump + 4 Air Stones Kit", description: "Commercial grade air pump. Quiet operation. Ideal for DWC systems.", price: 30, currency: "USD", category: "equipment", images: ["https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400"], condition: "used", location: "Yangon, Myanmar", status: "sold", created_at: "2025-06-12T10:00:00Z" },
];

export function generateSensorHistory(zoneId: string, hours: number = 24): SensorReading[] {
  const readings: SensorReading[] = [];
  const now = Date.now();
  for (let i = 0; i < hours; i++) {
    readings.push({
      id: `hist-${zoneId}-${i}`,
      zone_id: zoneId,
      temperature: 22 + Math.sin(i / 4) * 3 + Math.random() * 1,
      humidity: 55 + Math.cos(i / 6) * 10 + Math.random() * 3,
      ph_level: 6.0 + Math.sin(i / 8) * 0.5 + Math.random() * 0.2,
      ec_level: 1.5 + Math.sin(i / 5) * 0.3 + Math.random() * 0.1,
      water_level: 75 + Math.cos(i / 3) * 15 + Math.random() * 2,
      light_intensity: i % 24 < 18 ? 600 + Math.random() * 200 : 0,
      nutrient_ppm: 1000 + Math.sin(i / 4) * 200 + Math.random() * 50,
      created_at: new Date(now - (hours - i) * 3600000).toISOString(),
    });
  }
  return readings;
}
