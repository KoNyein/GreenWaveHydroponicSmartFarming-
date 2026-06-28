export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id">>;
      };
      farm_zones: {
        Row: FarmZone;
        Insert: Omit<FarmZone, "id" | "created_at">;
        Update: Partial<Omit<FarmZone, "id">>;
      };
      sensor_readings: {
        Row: SensorReading;
        Insert: Omit<SensorReading, "id" | "created_at">;
        Update: Partial<Omit<SensorReading, "id">>;
      };
      cameras: {
        Row: Camera;
        Insert: Omit<Camera, "id" | "created_at">;
        Update: Partial<Omit<Camera, "id">>;
      };
      inventory_items: {
        Row: InventoryItem;
        Insert: Omit<InventoryItem, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<InventoryItem, "id">>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Product, "id">>;
      };
      sales: {
        Row: Sale;
        Insert: Omit<Sale, "id" | "created_at">;
        Update: Partial<Omit<Sale, "id">>;
      };
      sale_items: {
        Row: SaleItem;
        Insert: Omit<SaleItem, "id">;
        Update: Partial<Omit<SaleItem, "id">>;
      };
      dry_room_batches: {
        Row: DryRoomBatch;
        Insert: Omit<DryRoomBatch, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<DryRoomBatch, "id">>;
      };
      store_room_items: {
        Row: StoreRoomItem;
        Insert: Omit<StoreRoomItem, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<StoreRoomItem, "id">>;
      };
      affiliate_links: {
        Row: AffiliateLink;
        Insert: Omit<AffiliateLink, "id" | "created_at">;
        Update: Partial<Omit<AffiliateLink, "id">>;
      };
      affiliate_commissions: {
        Row: AffiliateCommission;
        Insert: Omit<AffiliateCommission, "id" | "created_at">;
        Update: Partial<Omit<AffiliateCommission, "id">>;
      };
      dropship_orders: {
        Row: DropshipOrder;
        Insert: Omit<DropshipOrder, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<DropshipOrder, "id">>;
      };
      farm_schedules: {
        Row: FarmSchedule;
        Insert: Omit<FarmSchedule, "id" | "created_at">;
        Update: Partial<Omit<FarmSchedule, "id">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "manager" | "staff" | "member";
  avatar_url: string | null;
  phone: string | null;
  is_active: boolean;
  affiliate_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface FarmZone {
  id: string;
  name: string;
  zone_type: "vegetative" | "flowering" | "seedling" | "clone" | "mother";
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface SensorReading {
  id: string;
  zone_id: string;
  temperature: number;
  humidity: number;
  ph_level: number;
  ec_level: number;
  water_level: number;
  light_intensity: number;
  nutrient_ppm: number;
  created_at: string;
}

export interface Camera {
  id: string;
  name: string;
  zone_id: string | null;
  stream_url: string;
  location: string;
  is_online: boolean;
  camera_type: "indoor" | "outdoor" | "dryroom" | "storeroom";
  created_at: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: "nutrients" | "equipment" | "seeds" | "packaging" | "chemicals" | "other";
  quantity: number;
  unit: string;
  min_stock_level: number;
  cost_per_unit: number;
  supplier: string | null;
  location: "farm" | "dry_room" | "store_room" | "warehouse";
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  cost: number;
  stock_quantity: number;
  sku: string;
  image_url: string | null;
  is_active: boolean;
  is_dropship: boolean;
  supplier_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Sale {
  id: string;
  customer_name: string | null;
  customer_email: string | null;
  total_amount: number;
  discount_amount: number;
  tax_amount: number;
  payment_method: "cash" | "card" | "transfer" | "crypto";
  status: "completed" | "pending" | "refunded" | "cancelled";
  cashier_id: string;
  affiliate_id: string | null;
  notes: string | null;
  created_at: string;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface DryRoomBatch {
  id: string;
  batch_name: string;
  strain: string;
  zone_origin: string | null;
  wet_weight_g: number;
  dry_weight_g: number | null;
  temperature: number;
  humidity: number;
  status: "drying" | "curing" | "completed" | "spoiled";
  start_date: string;
  end_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface StoreRoomItem {
  id: string;
  product_name: string;
  batch_id: string | null;
  quantity: number;
  unit: string;
  quality_grade: "A" | "B" | "C" | "rejected";
  shelf_location: string;
  expiry_date: string | null;
  status: "available" | "reserved" | "shipped" | "expired";
  created_at: string;
  updated_at: string;
}

export interface AffiliateLink {
  id: string;
  user_id: string;
  code: string;
  clicks: number;
  conversions: number;
  total_earned: number;
  is_active: boolean;
  created_at: string;
}

export interface AffiliateCommission {
  id: string;
  affiliate_id: string;
  sale_id: string;
  commission_rate: number;
  commission_amount: number;
  status: "pending" | "paid" | "cancelled";
  created_at: string;
}

export interface DropshipOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  product_id: string;
  quantity: number;
  total_amount: number;
  supplier_cost: number;
  profit: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  tracking_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface FarmSchedule {
  id: string;
  zone_id: string;
  action_type: "water" | "nutrient" | "light_on" | "light_off" | "ph_adjust" | "harvest";
  scheduled_time: string;
  is_recurring: boolean;
  recurrence_interval: string | null;
  is_active: boolean;
  last_executed: string | null;
  created_at: string;
}

export type ReactionType = "like" | "love" | "haha" | "wow" | "sad" | "angry";

export interface PostReaction {
  user_id: string;
  user_name: string;
  type: ReactionType;
}

export interface PostLocation {
  lat: number;
  lng: number;
  name: string;
}

export type PostVisibility = "public" | "friends";

export interface WallPost {
  id: string;
  author_id: string;
  author_name: string;
  author_avatar: string | null;
  author_role: Profile["role"];
  wall_owner_id: string;
  content: string;
  image_url: string | null;
  photos: string[];
  location: PostLocation | null;
  visibility: PostVisibility;
  reactions: PostReaction[];
  comments_count: number;
  created_at: string;
}

export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
}

export interface MemberSubscription {
  id: string;
  user_id: string;
  plan: "free_trial" | "basic" | "pro" | "enterprise";
  status: "active" | "expired" | "cancelled";
  trial_start: string;
  trial_end: string;
  features: string[];
  created_at: string;
}
