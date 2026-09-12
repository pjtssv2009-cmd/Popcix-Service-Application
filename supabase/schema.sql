-- ==============================================================================
-- POPCIX DATABASE SCHEMA (PostgreSQL / Supabase)
-- 22 Production-Ready Tables with Foreign Keys, Constraints, and Indexes
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. USER PROFILES
-- Stores only non-sensitive application metadata linked to Supabase Auth.
-- NEVER stores passwords, hashes, tokens, or credentials.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(32),
    profile_photo_url TEXT,
    preferred_language VARCHAR(10) DEFAULT 'en',
    current_plan VARCHAR(32) DEFAULT 'FREE', -- FREE, BASIC, PLUS, PREMIUM
    plan_expires_at TIMESTAMPTZ,
    reward_points INT NOT NULL DEFAULT 100 CHECK (reward_points >= 0),
    xp_points INT NOT NULL DEFAULT 150 CHECK (xp_points >= 0),
    level INT NOT NULL DEFAULT 1 CHECK (level >= 1),
    streak INT NOT NULL DEFAULT 1 CHECK (streak >= 0),
    last_streak_date DATE DEFAULT CURRENT_DATE,
    completed_bookings_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_auth_user_id ON public.profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_level_streak ON public.profiles(level, streak);

-- ==============================================================================
-- 3. ADDRESSES
-- Customer service addresses with type, coordinates, and instructions.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    label VARCHAR(64) NOT NULL DEFAULT 'Home', -- Home, Work, Other
    street_address TEXT NOT NULL,
    apartment_suite VARCHAR(128),
    landmark TEXT,
    city VARCHAR(128) NOT NULL,
    state VARCHAR(128),
    postal_code VARCHAR(32) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    instructions_for_pro TEXT,
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);

-- ==============================================================================
-- 4. SERVICE CATEGORIES
-- Core marketplace categories with icons, color codes, and display ordering.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    icon_name VARCHAR(64) NOT NULL,
    accent_color VARCHAR(16) NOT NULL DEFAULT '#000000',
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 5. SERVICES
-- Individual service offerings within categories.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    slug VARCHAR(128) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    short_description TEXT NOT NULL,
    full_overview TEXT,
    starting_price DECIMAL(10, 2) NOT NULL CHECK (starting_price >= 0),
    original_price DECIMAL(10, 2),
    estimated_duration_mins INT NOT NULL DEFAULT 60,
    rating DECIMAL(2, 1) NOT NULL DEFAULT 4.8,
    reviews_count INT NOT NULL DEFAULT 0,
    bookings_count INT NOT NULL DEFAULT 0,
    image_url TEXT,
    whats_included JSONB NOT NULL DEFAULT '[]'::jsonb,
    whats_not_included JSONB NOT NULL DEFAULT '[]'::jsonb,
    safety_protocols JSONB NOT NULL DEFAULT '[]'::jsonb,
    faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_trending BOOLEAN NOT NULL DEFAULT false,
    is_popular BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_category_id ON public.services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);

-- ==============================================================================
-- 6. SERVICE VARIANTS & ADD-ONS
-- Options and stackable add-ons for services.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.service_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    duration_mins INT NOT NULL DEFAULT 30,
    is_addon BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_variants_service_id ON public.service_variants(service_id);

-- ==============================================================================
-- 7. PROFESSIONALS (POPCIX PROS)
-- Verified service providers.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.professionals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    profile_photo_url TEXT,
    rating DECIMAL(2, 1) NOT NULL DEFAULT 4.9,
    reviews_count INT NOT NULL DEFAULT 0,
    completed_jobs INT NOT NULL DEFAULT 0,
    years_experience INT NOT NULL DEFAULT 3,
    bio TEXT,
    skills TEXT[] NOT NULL DEFAULT '{}',
    languages TEXT[] NOT NULL DEFAULT '{"English"}',
    service_area VARCHAR(128) NOT NULL DEFAULT 'Citywide',
    response_rate VARCHAR(16) NOT NULL DEFAULT '99%',
    is_verified BOOLEAN NOT NULL DEFAULT true,
    is_available BOOLEAN NOT NULL DEFAULT true,
    safety_checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 8. PROFESSIONAL SERVICES MAPPING
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.professional_services (
    professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    PRIMARY KEY (professional_id, service_id)
);

-- ==============================================================================
-- 9. BOOKINGS
-- Primary customer booking table with 8-step status timeline.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code VARCHAR(32) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    professional_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
    address_id UUID NOT NULL REFERENCES public.addresses(id) ON DELETE RESTRICT,
    booking_type VARCHAR(32) NOT NULL DEFAULT 'SCHEDULED', -- INSTANT, SCHEDULED, RECURRING
    status VARCHAR(32) NOT NULL DEFAULT 'CONFIRMED', 
    -- Statuses: CONFIRMED, PRO_ASSIGNED, ON_THE_WAY, ARRIVED, SERVICE_STARTED, COMPLETED, CANCELLED, RESCHEDULED
    scheduled_date DATE NOT NULL,
    scheduled_time_slot VARCHAR(64) NOT NULL,
    estimated_arrival_time TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
    bundle_discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (bundle_discount_amount >= 0),
    tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    tip_amount DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (tip_amount >= 0),
    payment_status VARCHAR(32) NOT NULL DEFAULT 'PENDING', -- PENDING, PROCESSING, SUCCESSFUL, FAILED, REFUNDED
    payment_method VARCHAR(64) NOT NULL DEFAULT 'UPI', -- UPI, CARD, NETBANKING, WALLET, RAZORPAY
    points_earned INT NOT NULL DEFAULT 0,
    xp_earned INT NOT NULL DEFAULT 0,
    special_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_date ON public.bookings(scheduled_date);

-- ==============================================================================
-- 10. BOOKING ITEMS (Supports Service Stacking / Bundles)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.booking_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
    service_variant_id UUID REFERENCES public.service_variants(id) ON DELETE SET NULL,
    service_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
    is_bundle_addon BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booking_items_booking_id ON public.booking_items(booking_id);

-- ==============================================================================
-- 11. RECURRING BOOKINGS
-- Automated recurring schedules (Weekly, Every 2 weeks, Monthly, Custom).
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.recurring_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
    address_id UUID NOT NULL REFERENCES public.addresses(id) ON DELETE RESTRICT,
    frequency VARCHAR(32) NOT NULL, -- WEEKLY, BIWEEKLY, MONTHLY, CUSTOM
    preferred_day_of_week INT, -- 0=Sun, 6=Sat
    preferred_time_slot VARCHAR(64) NOT NULL,
    preferred_pro_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
    start_date DATE NOT NULL,
    next_booking_date DATE NOT NULL,
    last_booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    discount_rate DECIMAL(4, 2) NOT NULL DEFAULT 0.15, -- 15% discount for recurring
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recurring_user_id ON public.recurring_bookings(user_id);

-- ==============================================================================
-- 12. SUBSCRIPTIONS (POPCIX HomeCare)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_tier VARCHAR(32) NOT NULL, -- BASIC, PLUS, PREMIUM
    plan_name VARCHAR(128) NOT NULL,
    monthly_price DECIMAL(10, 2) NOT NULL,
    billing_period VARCHAR(32) NOT NULL DEFAULT 'MONTHLY',
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, PAUSED, CANCELLED, EXPIRED
    included_services_remaining INT NOT NULL DEFAULT 2,
    discount_percentage INT NOT NULL DEFAULT 10,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_period_end TIMESTAMPTZ NOT NULL,
    auto_renew BOOLEAN NOT NULL DEFAULT true,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);

-- ==============================================================================
-- 13. PAYMENTS & TRANSACTIONS
-- Architecture ready for Razorpay, UPI, Cards, Net Banking, Wallet.
-- NEVER stores raw credit card numbers or CVV.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    currency VARCHAR(8) NOT NULL DEFAULT 'INR',
    gateway VARCHAR(32) NOT NULL DEFAULT 'RAZORPAY',
    gateway_payment_id VARCHAR(128),
    gateway_order_id VARCHAR(128),
    payment_method VARCHAR(32) NOT NULL, -- UPI, CARD, NETBANKING, WALLET
    status VARCHAR(32) NOT NULL DEFAULT 'SUCCESSFUL', -- PENDING, PROCESSING, SUCCESSFUL, FAILED, REFUNDED
    invoice_number VARCHAR(64) UNIQUE NOT NULL,
    invoice_url TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);

-- ==============================================================================
-- 14. REFUNDS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.refunds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    reason TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'COMPLETED', -- REQUESTED, PROCESSING, COMPLETED, REJECTED
    gateway_refund_id VARCHAR(128),
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 15. REVIEWS & RATINGS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID UNIQUE NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    professional_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    service_quality_rating INT CHECK (service_quality_rating BETWEEN 1 AND 5),
    behavior_rating INT CHECK (behavior_rating BETWEEN 1 AND 5),
    timeliness_rating INT CHECK (timeliness_rating BETWEEN 1 AND 5),
    cleanliness_rating INT CHECK (cleanliness_rating BETWEEN 1 AND 5),
    review_text TEXT,
    photo_urls TEXT[] DEFAULT '{}',
    helpful_votes INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_service_id ON public.reviews(service_id);
CREATE INDEX IF NOT EXISTS idx_reviews_professional_id ON public.reviews(professional_id);

-- ==============================================================================
-- 16. FAVORITES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.favorites (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, service_id)
);

-- ==============================================================================
-- 17. PREFERRED PROFESSIONALS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.preferred_professionals (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, professional_id)
);

-- ==============================================================================
-- 18. NOTIFICATIONS (9 Notification Types)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type VARCHAR(32) NOT NULL, 
    -- Types: BOOKING, PROFESSIONAL, PAYMENT, REWARDS, SUBSCRIPTION, OFFERS, REMINDER, MAINTENANCE, SECURITY
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- ==============================================================================
-- 19. COUPONS & DISCOUNTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(32) UNIQUE NOT NULL,
    title VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    discount_type VARCHAR(16) NOT NULL DEFAULT 'PERCENTAGE', -- PERCENTAGE, FIXED
    discount_value DECIMAL(10, 2) NOT NULL CHECK (discount_value > 0),
    max_discount DECIMAL(10, 2),
    min_order_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    valid_until TIMESTAMPTZ NOT NULL,
    usage_limit INT,
    times_used INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 20. GAMIFICATION: ACHIEVEMENTS & BADGES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(64) UNIQUE NOT NULL,
    title VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    badge_icon VARCHAR(64) NOT NULL,
    xp_reward INT NOT NULL DEFAULT 100,
    points_reward INT NOT NULL DEFAULT 50,
    category VARCHAR(32) NOT NULL DEFAULT 'GENERAL', -- GENERAL, STREAK, BOOKING, LOYALTY, REVIEW
    target_count INT NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 21. USER ACHIEVEMENTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    progress_count INT NOT NULL DEFAULT 0,
    is_unlocked BOOLEAN NOT NULL DEFAULT false,
    unlocked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON public.user_achievements(user_id);

-- ==============================================================================
-- 22. REWARDS & REDEMPTION STORE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    points_cost INT NOT NULL CHECK (points_cost > 0),
    reward_type VARCHAR(32) NOT NULL, -- SERVICE_VOUCHER, DISCOUNT_PERCENT, FREE_ADDON, MERCH
    reward_value DECIMAL(10, 2) NOT NULL,
    expiry_days INT NOT NULL DEFAULT 30,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reward_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reward_id UUID REFERENCES public.rewards(id) ON DELETE SET NULL,
    transaction_type VARCHAR(32) NOT NULL, -- EARNED_BOOKING, EARNED_STREAK, EARNED_ACHIEVEMENT, REDEEMED, BONUS
    points_delta INT NOT NULL, -- positive for earn, negative for redeem
    xp_delta INT NOT NULL DEFAULT 0,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reward_tx_user_id ON public.reward_transactions(user_id);

-- ==============================================================================
-- 23. SUPPORT TICKETS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'OPEN', -- OPEN, IN_PROGRESS, RESOLVED, CLOSED
    priority VARCHAR(16) NOT NULL DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, URGENT
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON public.support_tickets(user_id);
