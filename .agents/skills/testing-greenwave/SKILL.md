---
name: testing-greenwave
description: Test the GreenWave Hydroponic Smart Farming app end-to-end. Use when verifying i18n, theme, navigation, messenger, marketplace, or page rendering changes.
---

# Testing GreenWave Hydroponic Smart Farming

## Prerequisites
- Node.js 22+ and npm installed
- Dependencies installed: `npm install` in repo root

## Local Dev Server
```bash
cd /home/ubuntu/repos/GreenWaveHydroponicSmartFarming-
npx next dev --port 3000
```
Wait for "Ready in XXms" before opening browser.

If port 3000 is already in use, kill the existing process first:
```bash
fuser -k 3000/tcp
```
Note: `lsof` may not be available on all environments; prefer `fuser` or `ss -tlnp | grep 3000`.

## Key URLs
- Login: http://localhost:3000/auth/login
- Dashboard: http://localhost:3000/dashboard
- Messenger: http://localhost:3000/messenger
- Marketplace: http://localhost:3000/marketplace
- Profile: http://localhost:3000/profile
- Subscription: http://localhost:3000/subscription
- All other pages: /farm, /cctv, /pos, /inventory, /dry-room, /store-room, /sales, /shop, /shop/dropship, /affiliate, /members

## No Credentials Needed
The app uses mock data via `useAuthStore` in `src/lib/store.ts`. Any email/password combination will log in successfully and redirect to `/dashboard`.

## Testing i18n (Bilingual EN/MY)
- **Globe button** in header top-right (or top-left on auth pages) toggles locale
- Shows "EN" or "MY" text next to Globe icon
- All page titles, labels, form placeholders, and buttons should switch language
- Key expected translations:
  - "Sign In" -> "ဝင်ရောက်ရန်"
  - "Dashboard" -> "ဒက်ရှ်ဘုတ်"
  - "Farm Monitor" -> "ခြံစောင့်ကြည့်ရန်"
  - "Members" -> "အဖွဲ့ဝင်များ"
  - "Messenger" -> "မက်ဆင်ဂျာ"
  - "Marketplace" -> "ဈေးကွက်"
- Translation source: `src/lib/translations.ts` (~400+ keys per locale)

## Testing Theme Toggle (Dark/Light)
- **Moon/Sun icon** button next to Globe toggles theme
- Light mode: green sidebar (#15803d), white background (#ffffff), white cards
- Dark mode: deep green sidebar (#052e16), dark green background (#022c22), green-tinted cards (#064e3b)
- Theme is applied via `.dark` class on `<html>` element
- ThemeProvider component: `src/components/layout/ThemeProvider.tsx`
- CSS variables: `src/app/globals.css` (`:root` and `.dark` sections)

## Testing Messenger (/messenger)
- Conversation list on the left with 4 mock conversations (Mike Johnson, John Doe, Aung Kyaw, Sarah Williams)
- Unread badge counts visible (Mike: 2, Aung: 1)
- Click a conversation to open chat in the right panel
- Chat header shows member name + "Online" status
- Existing mock messages include: text, photo (with image preview), audio (with waveform bars)
- **Send text**: Type in input box, press Enter or click Send button
- **Send photo**: Click the Image/camera button (leftmost in input bar) — sends a mock photo message with "Shared a photo"
- **Send audio**: Click Mic button to start recording (shows red "Recording..." indicator), click again to stop — sends "Voice message (0:05)"
- **Send location**: Click MapPin button — sends "Yangon, Myanmar" with "Open in Google Maps" link

## Testing Marketplace (/marketplace)
- Grid of 7 mock listings with images, prices, category/condition/status badges
- Category filter buttons: All Categories, Seeds, Nutrients, Equipment, Harvest, Supplies, Other
- Search input at the top filters by title/description
- Click a listing card to open detail modal (title, price, description, category, condition, seller, location, Buy Now + Message Seller buttons)
- "New Listing" button (top-right) opens a form modal with: Title, Description, Price, Category dropdown, Condition dropdown, Location, Photos upload area, List Item button

## Testing Social Features
- **Profile** (/profile): Social network-style profile page with wall posts, followers/following stats
- **Other profiles** (/profile/[id]): Visit other members' profiles
- **Post features**: Photo upload (up to 4), location check-in, 6 reaction types, public/friends-only privacy
- **Friends system**: Add Friend / Request Sent / Unfriend button
- **Subscription** (/subscription): 14-day free trial, 3 paid plans (Basic $29, Pro $79, Enterprise $149)
- **OAuth buttons**: Google and Facebook one-click login/register (mock auth, not real OAuth)

## State Persistence
- Theme and locale are stored in Zustand (`useSettingsStore` in `src/lib/store.ts`)
- Settings persist across client-side navigation (SPA) but NOT across full page reloads (no localStorage persistence)
- Both auth pages and dashboard pages have independent toggle controls

## Common Pitfalls
- **tsconfig.json must have `@/` path alias**: The app uses `@/lib/*` and `@/components/*` imports. If `baseUrl` and `paths` are missing from tsconfig.json, the dev server will return 500 errors on every page.
- **PostCSS config required**: Tailwind CSS 4 needs `postcss.config.mjs` with `@tailwindcss/postcss` plugin. Without it, no styles render.
- **Dark mode variant**: The `@custom-variant dark (&:where(.dark, .dark *))` directive must be in `globals.css` for class-based dark mode to work.
- **Port conflicts**: If dev server fails with EADDRINUSE, use `fuser -k 3000/tcp` (not `lsof` which may not be installed).
- **Recharts charts**: Sales and Farm pages use Recharts for data visualization. Charts render with mock data but may need a wider viewport to display properly.

## Test Strategy
1. Start with login page — verify language and theme toggles work before logging in
2. Log in with any credentials — verify settings persist to dashboard
3. Verify green/white theme (sidebar green, background white) and dark mode toggle
4. Navigate to Messenger — verify conversation list, click to open chat, send all 4 message types
5. Navigate to Marketplace — verify listing grid, category filter, detail modal, new listing form
6. Optionally check Profile, Subscription, and other pages for regressions

## Devin Secrets Needed
None — the app runs fully with mock data and no external services required for testing.
