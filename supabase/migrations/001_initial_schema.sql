-- GreenWave Hydroponic Smart Farming - Database Schema

-- Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'manager', 'staff', 'member')),
  avatar_url TEXT,
  phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  affiliate_code TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Farm Zones
CREATE TABLE IF NOT EXISTS farm_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  zone_type TEXT NOT NULL CHECK (zone_type IN ('vegetative', 'flowering', 'seedling', 'clone', 'mother')),
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sensor Readings
CREATE TABLE IF NOT EXISTS sensor_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id UUID NOT NULL REFERENCES farm_zones(id) ON DELETE CASCADE,
  temperature NUMERIC NOT NULL,
  humidity NUMERIC NOT NULL,
  ph_level NUMERIC NOT NULL,
  ec_level NUMERIC NOT NULL,
  water_level NUMERIC NOT NULL,
  light_intensity NUMERIC NOT NULL,
  nutrient_ppm NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cameras
CREATE TABLE IF NOT EXISTS cameras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  zone_id UUID REFERENCES farm_zones(id) ON DELETE SET NULL,
  stream_url TEXT NOT NULL,
  location TEXT NOT NULL,
  is_online BOOLEAN NOT NULL DEFAULT true,
  camera_type TEXT NOT NULL CHECK (camera_type IN ('indoor', 'outdoor', 'dryroom', 'storeroom')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Inventory Items
CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('nutrients', 'equipment', 'seeds', 'packaging', 'chemicals', 'other')),
  quantity NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  min_stock_level NUMERIC NOT NULL DEFAULT 0,
  cost_per_unit NUMERIC NOT NULL DEFAULT 0,
  supplier TEXT,
  location TEXT NOT NULL CHECK (location IN ('farm', 'dry_room', 'store_room', 'warehouse')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  cost NUMERIC NOT NULL DEFAULT 0,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  sku TEXT NOT NULL UNIQUE,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_dropship BOOLEAN NOT NULL DEFAULT false,
  supplier_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sales
CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT,
  customer_email TEXT,
  total_amount NUMERIC NOT NULL,
  discount_amount NUMERIC NOT NULL DEFAULT 0,
  tax_amount NUMERIC NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'card', 'transfer', 'crypto')),
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'refunded', 'cancelled')),
  cashier_id UUID NOT NULL REFERENCES profiles(id),
  affiliate_id UUID REFERENCES profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sale Items
CREATE TABLE IF NOT EXISTS sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL
);

-- Dry Room Batches
CREATE TABLE IF NOT EXISTS dry_room_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_name TEXT NOT NULL,
  strain TEXT NOT NULL,
  zone_origin TEXT,
  wet_weight_g NUMERIC NOT NULL,
  dry_weight_g NUMERIC,
  temperature NUMERIC NOT NULL DEFAULT 20,
  humidity NUMERIC NOT NULL DEFAULT 55,
  status TEXT NOT NULL DEFAULT 'drying' CHECK (status IN ('drying', 'curing', 'completed', 'spoiled')),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Store Room Items
CREATE TABLE IF NOT EXISTS store_room_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name TEXT NOT NULL,
  batch_id UUID REFERENCES dry_room_batches(id),
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  quality_grade TEXT NOT NULL CHECK (quality_grade IN ('A', 'B', 'C', 'rejected')),
  shelf_location TEXT NOT NULL,
  expiry_date DATE,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'shipped', 'expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Affiliate Links
CREATE TABLE IF NOT EXISTS affiliate_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  clicks INTEGER NOT NULL DEFAULT 0,
  conversions INTEGER NOT NULL DEFAULT 0,
  total_earned NUMERIC NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Affiliate Commissions
CREATE TABLE IF NOT EXISTS affiliate_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES profiles(id),
  sale_id UUID NOT NULL REFERENCES sales(id),
  commission_rate NUMERIC NOT NULL,
  commission_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Dropship Orders
CREATE TABLE IF NOT EXISTS dropship_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  total_amount NUMERIC NOT NULL,
  supplier_cost NUMERIC NOT NULL,
  profit NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  tracking_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Farm Schedules
CREATE TABLE IF NOT EXISTS farm_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id UUID NOT NULL REFERENCES farm_zones(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('water', 'nutrient', 'light_on', 'light_off', 'ph_adjust', 'harvest')),
  scheduled_time TIME NOT NULL,
  is_recurring BOOLEAN NOT NULL DEFAULT true,
  recurrence_interval TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_executed TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sensor_readings_zone ON sensor_readings(zone_id, created_at DESC);
CREATE INDEX idx_sales_created ON sales(created_at DESC);
CREATE INDEX idx_sale_items_sale ON sale_items(sale_id);
CREATE INDEX idx_inventory_location ON inventory_items(location);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_dry_room_status ON dry_room_batches(status);
CREATE INDEX idx_store_room_status ON store_room_items(status);
CREATE INDEX idx_dropship_status ON dropship_orders(status);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cameras ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE dry_room_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_room_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dropship_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_schedules ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Authenticated users can read all data
CREATE POLICY "Authenticated users can read profiles" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "Admins can manage profiles" ON profiles FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Authenticated read farm_zones" ON farm_zones FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff+ manage farm_zones" ON farm_zones FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
);

CREATE POLICY "Authenticated read sensors" ON sensor_readings FOR SELECT TO authenticated USING (true);
CREATE POLICY "System insert sensors" ON sensor_readings FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated read cameras" ON cameras FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage cameras" ON cameras FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

CREATE POLICY "Authenticated read inventory" ON inventory_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff+ manage inventory" ON inventory_items FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
);

CREATE POLICY "Authenticated read products" ON products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff+ manage products" ON products FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
);

CREATE POLICY "Authenticated read sales" ON sales FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff+ manage sales" ON sales FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
);

CREATE POLICY "Authenticated read sale_items" ON sale_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff+ manage sale_items" ON sale_items FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
);

CREATE POLICY "Authenticated read dry_room" ON dry_room_batches FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff+ manage dry_room" ON dry_room_batches FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
);

CREATE POLICY "Authenticated read store_room" ON store_room_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff+ manage store_room" ON store_room_items FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
);

CREATE POLICY "Users read own affiliate" ON affiliate_links FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users manage own affiliate" ON affiliate_links FOR ALL TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins manage affiliates" ON affiliate_links FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users read own commissions" ON affiliate_commissions FOR SELECT TO authenticated USING (affiliate_id = auth.uid());
CREATE POLICY "Admins manage commissions" ON affiliate_commissions FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Authenticated read dropship" ON dropship_orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff+ manage dropship" ON dropship_orders FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
);

CREATE POLICY "Authenticated read schedules" ON farm_schedules FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff+ manage schedules" ON farm_schedules FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'member'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_inventory BEFORE UPDATE ON inventory_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_products BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_dry_room BEFORE UPDATE ON dry_room_batches FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_store_room BEFORE UPDATE ON store_room_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_dropship BEFORE UPDATE ON dropship_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
