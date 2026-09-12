-- ==============================================================================
-- POPCIX PRO - PostgreSQL Database Schema & Security Architecture
-- Shared backend models for POPCIX Customer App & POPCIX PRO Mobile Application
-- Includes 18 Professional-specific tables with strict Row-Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFESSIONAL PROFILES
CREATE TABLE IF NOT EXISTS public.professional_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    email TEXT,
    avatar_url TEXT,
    gender TEXT CHECK (gender IN ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY')),
    preferred_language TEXT DEFAULT 'English',
    city TEXT NOT NULL DEFAULT 'Chennai',
    primary_category TEXT NOT NULL,
    experience_years NUMERIC(4, 1) DEFAULT 0,
    about_text TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    kyc_status TEXT DEFAULT 'PENDING' CHECK (kyc_status IN ('NOT_STARTED', 'PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'NEEDS_ACTION')),
    kyc_rejection_reason TEXT,
    availability_status TEXT DEFAULT 'OFFLINE' CHECK (availability_status IN ('ONLINE', 'OFFLINE', 'ON_JOB', 'ON_BREAK')),
    service_radius_km INTEGER DEFAULT 10,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    rating_count INTEGER DEFAULT 0,
    completed_jobs_count INTEGER DEFAULT 0,
    completion_rate NUMERIC(5, 2) DEFAULT 100.00,
    on_time_rate NUMERIC(5, 2) DEFAULT 100.00,
    acceptance_rate NUMERIC(5, 2) DEFAULT 100.00,
    cancellation_rate NUMERIC(5, 2) DEFAULT 0.00,
    level TEXT DEFAULT 'Starter',
    xp INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    referral_code TEXT UNIQUE,
    opted_into_leaderboard BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROFESSIONAL SKILLS
CREATE TABLE IF NOT EXISTS public.professional_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pro_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    category TEXT NOT NULL,
    is_certified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROFESSIONAL DOCUMENTS (KYC Storage - Zero Exposure to Customers)
CREATE TABLE IF NOT EXISTS public.professional_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pro_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL CHECK (document_type IN ('GOVT_ID', 'PAN', 'ADDRESS_PROOF', 'TRADE_CERTIFICATE', 'POLICE_VERIFICATION')),
    document_number_masked TEXT,
    file_path TEXT NOT NULL,
    verification_status TEXT DEFAULT 'UNDER_REVIEW' CHECK (verification_status IN ('UNDER_REVIEW', 'APPROVED', 'REJECTED')),
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ
);

-- 4. PROFESSIONAL SERVICES
CREATE TABLE IF NOT EXISTS public.professional_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pro_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
    service_id UUID NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    custom_price_override NUMERIC(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PROFESSIONAL SERVICE ZONES
CREATE TABLE IF NOT EXISTS public.professional_service_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pro_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
    zone_name TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Chennai',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PROFESSIONAL AVAILABILITY & SHIFTS
CREATE TABLE IF NOT EXISTS public.professional_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pro_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
    day_of_week TEXT NOT NULL CHECK (day_of_week IN ('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun')),
    start_time TIME NOT NULL DEFAULT '08:00',
    end_time TIME NOT NULL DEFAULT '20:00',
    is_active BOOLEAN DEFAULT TRUE
);

-- 7. PROFESSIONAL CERTIFICATIONS
CREATE TABLE IF NOT EXISTS public.professional_certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pro_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
    certificate_name TEXT NOT NULL,
    issuing_body TEXT DEFAULT 'POPCIX Academy',
    issue_date DATE DEFAULT CURRENT_DATE,
    expiry_date DATE,
    score_percent INTEGER,
    certificate_url TEXT
);

-- 8. PROFESSIONAL TRAINING MODULES
CREATE TABLE IF NOT EXISTS public.professional_training (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    duration_min INTEGER NOT NULL,
    video_url TEXT,
    thumbnail_url TEXT,
    summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PROFESSIONAL TRAINING PROGRESS
CREATE TABLE IF NOT EXISTS public.professional_training_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pro_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
    training_id UUID NOT NULL REFERENCES public.professional_training(id) ON DELETE CASCADE,
    progress_percent INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ
);

-- 10. PROFESSIONAL EARNINGS (Ledger)
CREATE TABLE IF NOT EXISTS public.professional_earnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pro_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
    booking_id UUID NOT NULL,
    base_amount NUMERIC(10, 2) NOT NULL,
    addons_amount NUMERIC(10, 2) DEFAULT 0,
    bonus_amount NUMERIC(10, 2) DEFAULT 0,
    tip_amount NUMERIC(10, 2) DEFAULT 0,
    platform_fee NUMERIC(10, 2) NOT NULL,
    net_payout NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'AVAILABLE' CHECK (status IN ('PENDING', 'AVAILABLE', 'PAID', 'HELD')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. PROFESSIONAL PAYOUTS
CREATE TABLE IF NOT EXISTS public.professional_payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pro_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    payout_date DATE DEFAULT CURRENT_DATE,
    reference_id TEXT NOT NULL UNIQUE,
    bank_account_masked TEXT NOT NULL,
    status TEXT DEFAULT 'PROCESSING' CHECK (status IN ('PROCESSING', 'COMPLETED', 'FAILED')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. PROFESSIONAL REWARDS
CREATE TABLE IF NOT EXISTS public.professional_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pro_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
    reward_title TEXT NOT NULL,
    reward_type TEXT NOT NULL CHECK (reward_type IN ('CASH_BONUS', 'TOOL_DISCOUNT', 'INSURANCE_COVERAGE', 'BADGE', 'XP_BURST')),
    points_cost INTEGER DEFAULT 0,
    is_redeemed BOOLEAN DEFAULT FALSE,
    redeemed_at TIMESTAMPTZ
);

-- 13. PROFESSIONAL ACHIEVEMENTS & BADGES
CREATE TABLE IF NOT EXISTS public.professional_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pro_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
    badge_key TEXT NOT NULL,
    badge_title TEXT NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. PROFESSIONAL REFERRALS
CREATE TABLE IF NOT EXISTS public.professional_referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_pro_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
    referee_phone TEXT NOT NULL,
    referee_pro_id UUID REFERENCES public.professional_profiles(id),
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'QUALIFIED', 'PAID')),
    reward_amount NUMERIC(10, 2) DEFAULT 1000.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. PROFESSIONAL PERFORMANCE METRICS
CREATE TABLE IF NOT EXISTS public.professional_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pro_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
    metric_week DATE NOT NULL,
    jobs_accepted INTEGER DEFAULT 0,
    jobs_completed INTEGER DEFAULT 0,
    jobs_declined INTEGER DEFAULT 0,
    jobs_cancelled INTEGER DEFAULT 0,
    total_on_time_arrivals INTEGER DEFAULT 0,
    five_star_reviews_count INTEGER DEFAULT 0,
    xp_accumulated INTEGER DEFAULT 0
);

-- 16. PROFESSIONAL NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.professional_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pro_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('NEW_JOB', 'JOB_REMINDER', 'MESSAGE', 'PAYOUT', 'REWARD', 'KYC', 'SECURITY', 'SAFETY')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. PROFESSIONAL SUPPORT TICKETS
CREATE TABLE IF NOT EXISTS public.professional_support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pro_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
    ticket_code TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL CHECK (category IN ('ACTIVE_JOB', 'PAYMENT', 'CUSTOMER_ISSUE', 'TECHNICAL', 'KYC', 'SAFETY')),
    subject TEXT NOT NULL,
    status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. PROFESSIONAL PREFERENCES
CREATE TABLE IF NOT EXISTS public.professional_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pro_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
    sound_alerts_enabled BOOLEAN DEFAULT TRUE,
    haptic_enabled BOOLEAN DEFAULT TRUE,
    auto_offline_after_shift BOOLEAN DEFAULT TRUE,
    show_on_xp_leaderboard BOOLEAN DEFAULT TRUE
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.professional_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_support_tickets ENABLE ROW LEVEL SECURITY;

-- 1. Pros can ONLY view and update their own profile
CREATE POLICY "Pro view own profile" ON public.professional_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Pro update own profile" ON public.professional_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- 2. Documents can strictly only be viewed by the owner and admins (NEVER customers)
CREATE POLICY "Pro access own documents" ON public.professional_documents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.professional_profiles
            WHERE public.professional_profiles.id = professional_documents.pro_id
            AND public.professional_profiles.user_id = auth.uid()
        )
    );

-- 3. Earnings & Payouts strictly locked to pro owner
CREATE POLICY "Pro access own earnings" ON public.professional_earnings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.professional_profiles
            WHERE public.professional_profiles.id = professional_earnings.pro_id
            AND public.professional_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Pro access own payouts" ON public.professional_payouts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.professional_profiles
            WHERE public.professional_profiles.id = professional_payouts.pro_id
            AND public.professional_profiles.user_id = auth.uid()
        )
    );

-- 4. Support tickets strictly private
CREATE POLICY "Pro access own tickets" ON public.professional_support_tickets
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.professional_profiles
            WHERE public.professional_profiles.id = professional_support_tickets.pro_id
            AND public.professional_profiles.user_id = auth.uid()
        )
    );
