---
name: testing-greenwave
description: Test the GreenWave Hydroponic Smart Farming app end-to-end. Use when verifying i18n, theme, navigation, or page rendering changes.
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

## Key URLs
- Login: http://localhost:3000/auth/login
- Dashboard: http://localhost:3000/dashboard
- All pages: /farm, /cctv, /pos, /inventory, /dry-room, /store-room, /sales, /shop, /shop/dropship, /affiliate, /members

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
- Translation source: `src/lib/translations.ts` (~300 keys per locale)

## Testing Theme Toggle (Dark/Light)
- **Moon/Sun icon** button next to Globe toggles theme
- Light mode: background #f8faf8, card bg white
- Dark mode: background #0f172a, card bg #1e293b
- Theme is applied via `.dark` class on `<html>` element
- ThemeProvider component: `src/components/layout/ThemeProvider.tsx`
- CSS variables: `src/app/globals.css` (`:root` and `.dark` sections)

## State Persistence
- Theme and locale are stored in Zustand (`useSettingsStore` in `src/lib/store.ts`)
- Settings persist across client-side navigation (SPA) but NOT across full page reloads (no localStorage persistence)
- Both auth pages and dashboard pages have independent toggle controls

## Common Pitfalls
- **tsconfig.json must have `@/` path alias**: The app uses `@/lib/*` and `@/components/*` imports. If `baseUrl` and `paths` are missing from tsconfig.json, the dev server will return 500 errors on every page. The fix is:
  ```json
  "baseUrl": ".",
  "paths": { "@/*": ["./src/*"] }
  ```
- **CSS styling may appear minimal**: Tailwind CSS 4 with custom properties is used. Some gradient/shadow styling might not render fully depending on Tailwind config. This is cosmetic, not functional.
- **Recharts charts**: Sales and Farm pages use Recharts for data visualization. Charts render with mock data but may need a wider viewport to display properly.

## Test Strategy
1. Start with login page — verify language and theme toggles work before logging in
2. Log in with any credentials — verify settings persist to dashboard
3. Navigate to 2-3 different pages via sidebar — verify i18n on each
4. Toggle theme and language back — verify independent toggling

## Devin Secrets Needed
None — the app runs fully with mock data and no external services required for testing.
