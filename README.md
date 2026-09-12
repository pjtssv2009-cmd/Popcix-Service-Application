# POPCIX — Gamified Home-Services Customer Mobile Application

<p align="center">
  <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80" alt="POPCIX" width="600" style="border-radius: 24px;" />
</p>

> **"Your Home. Your Services. Your POPCIX."**  
> Everything your home needs — with the speed of an instant marketplace and the engaging, level-and-rewards-driven progression of modern consumer tech.

---

## 🌟 Key Highlights & Architecture

- **Visual Identity**: Premium Light mode only (`#F8F8F5` background, `#FFFFFF` surface, `#000000` primary buttons, `#111111` text, energetic vibrant accents, rounded soft UI, custom original vector mascots & badges).
- **Authentication**: Official **Supabase Auth SDK** integration (Email/Password, Google OAuth, Session persistence, Password resets). Zero custom password storage, zero custom JWTs, zero sensitive credential logging.
- **Gamification Engine**: Player XP, Level progression (`Home Hero Level 4`, etc.), 7-Day Care Streaks, Badges Showcase, Active Quests & Challenges, and Points Redemption Store.
- **Marketplace & 14+ Service Categories**: Cleaning, AC Services, Electrician, Plumber, Carpenter, Appliance Repair, Pest Control, Painting, Beauty, Car Cleaning, Laundry, Moving, Home Maintenance, and Other Services.
- **8-Step Minimal Booking Flow**: Service selection -> Add-ons & Service Stacking -> Saved Address -> Booking Type (Instant, Scheduled, Recurring) -> Time Slot -> Price & Coupon Review -> Secured Payment -> Confirmation Celebration.
- **Service Stacking**: Automatic bundle discounts when stacking complementary services (e.g. Full House Deep Clean + Balcony Wash).
- **Live Booking Tracking**: Visual map tracking with 6-stage step-by-step progress timeline and interactive live status simulator.
- **POPCIX HomeCare Subscriptions**: Basic, Plus, and Premium VIP tiers with included quarterly visits and discount perks.
- **AI Home Assistant ("POPCIX Sparky")**: Natural language diagnostic assistant for troubleshooting home issues ("AC not cooling", "Party preparation") and 1-tap service recommendations.
- **Database & Security**: 22 PostgreSQL/Supabase tables with strict Row Level Security (RLS) policies and server-side rate limiting middleware (10 req/IP/min with progressive backoff delay).

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- Node.js (v18.x, v20.x, or v22+)
- npm / yarn / pnpm

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Set the following variables in `.env`:
| Variable | Description | Example |
| :--- | :--- | :--- |
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xyzproject.supabase.co` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon/Public API Key | `eyJhbGciOi...` |
| `UPSTASH_REDIS_REST_URL` | Upstash/Redis REST URL (for server rate limiter) | `https://xxx.upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash/Redis token | `AXxxxx...` |

*(Note: If Supabase keys are not set, POPCIX automatically boots in Offline Demo Mode for testing).*

---

## 🗄️ Database Setup & Migrations (Supabase / PostgreSQL)

1. Open your **Supabase Dashboard** -> **SQL Editor**.
2. Run the SQL files in the following order:
   - [`supabase/schema.sql`](supabase/schema.sql) — Creates all 22 database tables with foreign keys and indexes.
   - [`supabase/rls.sql`](supabase/rls.sql) — Enables Row Level Security (RLS) ensuring strict customer data isolation.
   - [`supabase/seed.sql`](supabase/seed.sql) — Populates default service categories, pros, achievements, rewards, and coupons.

---

## 🔐 Google OAuth Configuration (Supabase Auth)

1. In the **Google Cloud Console**, create an OAuth 2.0 Client ID (Web Application).
2. Set Authorized Redirect URIs to: `https://<your-supabase-project-id>.supabase.co/auth/v1/callback`
3. In **Supabase Dashboard** -> **Authentication** -> **Providers** -> **Google**:
   - Enable Google
   - Paste Client ID and Client Secret
   - Save configuration

---

## 💻 Running the Development Server

### Run in Interactive Web Preview:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to explore the mobile application with device frame toggle (iPhone / Android / Full Width).

---

## 📱 Running on Native Android & iOS

### Run on Android (Device or Emulator):
```bash
npx expo run:android
```

### Run on iOS (Simulator or Device, macOS only):
```bash
npx expo run:ios
```

---

## 🧪 Testing & Security Audit

### Run All Unit & Integration Tests:
```bash
npm test
```

### Run Automated Security & Compliance Audit:
```bash
npm run audit:security
```

---

## 📦 Building Native Packages (EAS Build)

### Build Android APK (Preview/Testing):
```bash
npx eas-cli build -p android --profile preview
```

### Build Android Production AAB (Google Play Store):
```bash
npx eas-cli build -p android --profile production
```

### Build iOS Production IPA (Apple App Store):
```bash
npx eas-cli build -p ios --profile production
```

---

## 📁 Project Architecture

```
popcix-mobile-app/
├── __tests__/                  # Unit & Integration test suites
│   ├── auth.test.ts
│   ├── booking.test.ts
│   ├── gamification.test.ts
│   ├── rate-limiter.test.ts
│   └── ai-assistant.test.ts
├── scripts/
│   └── security-audit.js      # Automated security & log exposure scanner
├── src/
│   ├── components/common/     # POPCIX Design System UI tokens & components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── ConfettiCelebration.tsx
│   │   ├── Mascot.tsx         # Original POPCIX Mascot vector art
│   │   ├── ErrorState.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Header.tsx
│   │   └── DeviceFrame.tsx
│   ├── context/               # Global state contexts
│   │   ├── AuthContext.tsx    # Supabase Auth SDK integration
│   │   ├── GamificationContext.tsx
│   │   └── MarketplaceContext.tsx
│   ├── data/
│   │   └── mockMarketplaceData.ts
│   ├── navigation/            # Bottom tabs & Root app router
│   │   ├── AppNavigator.tsx
│   │   └── BottomTabs.tsx
│   ├── screens/               # App screens & modals
│   │   ├── onboarding/
│   │   ├── auth/
│   │   ├── home/
│   │   ├── explore/
│   │   ├── service/
│   │   ├── booking/
│   │   ├── tracking/
│   │   ├── rewards/
│   │   ├── subscriptions/
│   │   ├── bookings/
│   │   ├── profile/
│   │   └── ai/
│   ├── server/
│   │   └── rate-limiter.ts    # Rate limiting middleware
│   ├── services/
│   │   ├── supabase.ts        # Official Supabase client configuration
│   │   ├── safeLogger.ts      # Structured sanitized logger
│   │   ├── aiAssistant.ts     # Diagnostic AI engine
│   │   └── gamification/
│   ├── theme/                 # Colors, typography, spacing, and haptics
│   ├── types/                 # Domain TypeScript interfaces
│   ├── App.tsx
│   └── main.tsx
├── supabase/
│   ├── schema.sql             # 22 database tables schema
│   ├── rls.sql                # Row Level Security policies
│   └── seed.sql               # Seed data for marketplace
├── app.json                   # Native Expo/Android/iOS build configuration
├── eas.json                   # EAS build profiles
├── tailwind.config.js         # Design system tokens configuration
└── tsconfig.json
```

---

## 🛡️ Security & Compliance Verification

- **Supabase Auth**: Single source of truth for authentication.
- **Zero Custom Password Hashes**: No custom password databases, MD5, SHA-1, or plain-text credentials.
- **Safe Logging**: All logger inputs sanitized against credentials, tokens, passwords, and card information.
- **Row Level Security**: Database users can only view and mutate their own bookings, profiles, and addresses.
- **Rate Limiting**: Configured 10 req/IP/min with progressive delay backoff on sensitive endpoints.

---

## 📄 License
Private & Confidential — © 2026 POPCIX Technologies Inc. All rights reserved.
