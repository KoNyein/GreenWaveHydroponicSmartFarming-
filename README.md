# GreenWave Hydroponic Smart Farming

A comprehensive hydroponic cannabis smart farming management system built with **Next.js**, **TypeScript**, and **Supabase**.

## Features

- **Dashboard** - Overview of farm operations, sensor data, sales, and alerts
- **Farm Monitor** - Real-time sensor data (temperature, humidity, pH, EC, water level, nutrients, light), zone management, automation schedules, and quick controls
- **CCTV Monitoring** - Live camera feeds with grid/single view, camera status tracking
- **POS System** - Point-of-sale with cart, product search, payment methods, and receipt generation
- **Inventory Management** - Track supplies with category/location filters, low stock alerts
- **Dry Room** - Manage drying/curing batches with temperature/humidity monitoring
- **Store Room** - Product storage with quality grading, shelf locations, expiry tracking
- **Sales Records** - Transaction history with revenue charts and detailed analytics
- **Shop** - Product catalog with category filters and dropship integration
- **Dropshipping** - Order management with profit tracking and shipping status
- **Affiliate Program** - Affiliate link management, click/conversion tracking, commission reports
- **Member Management** - User registration, role-based access control (admin/manager/staff/member)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts
- **Icons**: Lucide React
- **State**: Zustand

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/KoNyein/GreenWaveHydroponicSmartFarming-.git
   cd GreenWaveHydroponicSmartFarming-
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. Run the Supabase migration:
   - Go to your Supabase project SQL Editor
   - Run the SQL from `supabase/migrations/001_initial_schema.sql`

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
  app/                  # Next.js App Router pages
    auth/               # Login & Register pages
    dashboard/          # Main dashboard
    farm/               # Farm monitoring
    cctv/               # CCTV monitoring
    pos/                # Point of sale
    inventory/          # Inventory management
    dry-room/           # Dry room management
    store-room/         # Store room management
    sales/              # Sales records
    shop/               # Product shop & dropshipping
    affiliate/          # Affiliate program
    members/            # Member management
  components/
    layout/             # Sidebar, Header, DashboardLayout
    ui/                 # Reusable UI components (Card, DataTable, StatusBadge)
  lib/
    supabase.ts         # Supabase client
    supabase-server.ts  # Server-side Supabase client
    mock-data.ts        # Demo/mock data
    store.ts            # Zustand state management
    utils.ts            # Utility functions
  types/
    database.ts         # TypeScript types matching Supabase schema
supabase/
  migrations/           # Database migration SQL files
```
