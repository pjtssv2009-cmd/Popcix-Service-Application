# POPCIX PRO — Professional Mobile Application

> **"Work. Earn. Grow."** — The gamified, professional-side mobile application for verified technicians and home-service specialists on the POPCIX Marketplace.

---

## 📱 Executive Overview

**POPCIX PRO** is the official service-provider mobile application for the POPCIX marketplace platform. Built with a high-contrast, energetic, light-mode design language and gamified progression engine (XP, 6-day streak 🔥, AC HERO levels, badges, milestones, and redeemable perks), it empowers service professionals to manage their schedule, accept nearby jobs, navigate to customers, execute step-by-step verified service checklists, propose customer-approved add-ons, and track real-time earnings with transparent payouts.

---

## 🌟 Key Capabilities & Features

### 1. Verification & 10-Step KYC Wizard
- **Mobile Number OTP**: Verified via Supabase Auth
- **Basic Profile**: Name, Photo, Gender, Language
- **Operating Hub & City**: Targeted zones (OMR, Sholinganallur, Perungudi, Velachery, Medavakkam)
- **Trade Categories**: AC Technician, Electrician, Plumber, Carpenter, Cleaner, Pest Control, Appliance Specialist, Painter, Beauty Pro
- **Skills & Experience**: Multi-select trade credentials and years in field
- **Official KYC Documents**: Aadhaar/Voter ID, PAN Card, HVAC trade certificate
- **Bank & UPI Settlement**: Masked account validation for automated Friday payouts
- **Safety Training & Status Review**: KYC Pending, Under Review, Approved, or Action Required

### 2. Job Radar & 14-Step Service Journey
1. **Radar Dispatch Alert**: Real-time incoming job notification with countdown timer and instant Accept / Decline
2. **Detailed Booking Specifications**: Customer first name, rating (⭐ 4.9), approximate distance, and service duration
3. **Status: CONFIRMED**: Reveals full customer address, special instructions, and directions
4. **GPS Navigation**: Live route simulation, turn-by-turn distance, and ETA
5. **Doorstep Arrival**: Validates location pin
6. **Customer Start OTP Verification**: 4-digit security code (Demo: `4829` or `0000`)
7. **Service In-Progress & Checklist**: Check off required steps (e.g. AC Deep Cleaning: Power off, Inspect filters, Foam jet wash, Clean outdoor condenser, Flush drain, Test cooling temperature)
8. **Chargeable Add-on Request**: Professional proposes add-on with price & reason; customer receives digital approval request (cannot silently alter bill)
9. **Before & After Photos**: Image capture linked to booking
10. **In-App Masked Communication**: Quick responses (*"I'm arriving in 10 mins"*, *"I'm at the entrance"*) and masked dialer
11. **Customer Completion OTP**: 4-digit sign-off code (Demo: `7193` or `0000`)
12. **Instant Settlement & Celebration**: Net earnings credited to available balance + XP celebration

### 3. Transparent Earnings & Payout Ledger
- **Overview**: Today (₹2,450), This Week (₹13,800), This Month (₹52,400), Lifetime (₹8,42,600)
- **Itemized Breakdown**: Base earnings, Add-ons, Bonuses, Customer Tips (100% to Pro), Platform fee, Net payout
- **Settlement**: Automated Friday bank transfer with IMPS reference ID tracking and downloadable PDF statement

### 4. Gamification & Growth Hub
- **Tier Levels**: Starter → Rising Pro → Skilled Pro → Expert Pro → Elite Pro → **AC HERO (Level 8)**
- **Streak Tracker**: 6-day active flame streak (+50 XP/day bonus)
- **Badges & Milestones**: First Job, 100 Five-Star Reviews, 7-Day Streak, 50 Fast Completions, 1,000 Jobs Legend, 100 Repeat Customers
- **Weekly Target**: 23/30 jobs completed towards +₹1,000 bonus
- **Privacy-First Leaderboard**: XP ranking with one-tap opt-in / opt-out

### 5. Sparky Pro AI Assistant & Safety Center
- **Sparky Pro AI**: Generates customer quote explanations in plain English, appliance troubleshooting steps, and authorized earnings summaries
- **Safety Center**: 1-Tap Emergency SOS dispatch with live GPS broadcast, direct 24/7 hotlines, and safety incident reporting

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19 + TypeScript + Vite + TailwindCSS (Strict Light Mode)
- **Native Platform**: Capacitor 8 (Status Bar, Splash Screen, Haptics, Geolocation, Camera, Local Notifications, Hardware Back Button, Network)
- **Authentication**: Supabase Auth (OTP / Password / OAuth / Persistent Sessions)
- **Database**: PostgreSQL with 18 dedicated professional tables and strict Row Level Security (RLS) policies
- **Rate Limiting**: Reusable rate-limiter middleware protecting Auth, OTP, Referrals, and Job Actions

---

## 🚀 Building & Running Locally

### Development Server
```bash
npm install
npm run dev
```

### Run Automated Tests
```bash
npm test
```

### Build Web Bundle & Sync Native Android
```bash
npm run build
npx cap sync android
```

### Compile Release APK
```bash
cd android
JAVA_HOME="/Users/tarun/.jdk21/Contents/Home" ANDROID_HOME="/Users/tarun/android-sdk" ./gradlew assembleRelease
```
Output APK is located at:
`android/app/build/outputs/apk/release/app-release.apk`
and copied to `release-apk/popcix-release.apk`.
