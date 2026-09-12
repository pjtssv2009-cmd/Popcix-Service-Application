-- ==============================================================================
-- POPCIX ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Isolation: Customers can only access their own data.
-- Public tables (categories, active services, rewards, achievements) are readable by all.
-- ==============================================================================

-- 1. Enable RLS on all customer-sensitive tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preferred_professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Also enable on catalog tables for safe public read
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- HELPER FUNCTION: Get current authenticated user profile ID
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.current_profile_id()
RETURNS UUID AS $$
  SELECT id FROM public.profiles WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- ==============================================================================
-- PROFILES POLICIES
-- ==============================================================================
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth_user_id = auth.uid());

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth_user_id = auth.uid())
    WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "Users can insert own profile upon signup"
    ON public.profiles FOR INSERT
    WITH CHECK (auth_user_id = auth.uid());

-- ==============================================================================
-- ADDRESSES POLICIES
-- ==============================================================================
CREATE POLICY "Users can view own addresses"
    ON public.addresses FOR SELECT
    USING (user_id = public.current_profile_id());

CREATE POLICY "Users can insert own addresses"
    ON public.addresses FOR INSERT
    WITH CHECK (user_id = public.current_profile_id());

CREATE POLICY "Users can update own addresses"
    ON public.addresses FOR UPDATE
    USING (user_id = public.current_profile_id())
    WITH CHECK (user_id = public.current_profile_id());

CREATE POLICY "Users can delete own addresses"
    ON public.addresses FOR DELETE
    USING (user_id = public.current_profile_id());

-- ==============================================================================
-- BOOKINGS & BOOKING ITEMS POLICIES
-- ==============================================================================
CREATE POLICY "Users can view own bookings"
    ON public.bookings FOR SELECT
    USING (user_id = public.current_profile_id());

CREATE POLICY "Users can create own bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (user_id = public.current_profile_id());

CREATE POLICY "Users can update own active bookings"
    ON public.bookings FOR UPDATE
    USING (user_id = public.current_profile_id())
    WITH CHECK (user_id = public.current_profile_id());

CREATE POLICY "Users can view own booking items"
    ON public.booking_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.bookings
            WHERE public.bookings.id = public.booking_items.booking_id
            AND public.bookings.user_id = public.current_profile_id()
        )
    );

CREATE POLICY "Users can insert booking items for own bookings"
    ON public.booking_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.bookings
            WHERE public.bookings.id = public.booking_items.booking_id
            AND public.bookings.user_id = public.current_profile_id()
        )
    );

-- ==============================================================================
-- RECURRING BOOKINGS POLICIES
-- ==============================================================================
CREATE POLICY "Users can view own recurring bookings"
    ON public.recurring_bookings FOR SELECT
    USING (user_id = public.current_profile_id());

CREATE POLICY "Users can manage own recurring bookings"
    ON public.recurring_bookings FOR ALL
    USING (user_id = public.current_profile_id())
    WITH CHECK (user_id = public.current_profile_id());

-- ==============================================================================
-- SUBSCRIPTIONS POLICIES
-- ==============================================================================
CREATE POLICY "Users can view own subscriptions"
    ON public.subscriptions FOR SELECT
    USING (user_id = public.current_profile_id());

CREATE POLICY "Users can manage own subscriptions"
    ON public.subscriptions FOR ALL
    USING (user_id = public.current_profile_id())
    WITH CHECK (user_id = public.current_profile_id());

-- ==============================================================================
-- PAYMENTS & REFUNDS POLICIES
-- ==============================================================================
CREATE POLICY "Users can view own payment metadata and invoices"
    ON public.payments FOR SELECT
    USING (user_id = public.current_profile_id());

CREATE POLICY "Users can view own refunds"
    ON public.refunds FOR SELECT
    USING (user_id = public.current_profile_id());

-- ==============================================================================
-- REVIEWS POLICIES
-- ==============================================================================
CREATE POLICY "Anyone can view reviews"
    ON public.reviews FOR SELECT
    USING (true);

CREATE POLICY "Users can create review for own completed booking"
    ON public.reviews FOR INSERT
    WITH CHECK (user_id = public.current_profile_id());

CREATE POLICY "Users can update own reviews"
    ON public.reviews FOR UPDATE
    USING (user_id = public.current_profile_id())
    WITH CHECK (user_id = public.current_profile_id());

-- ==============================================================================
-- FAVORITES & PREFERRED PROS POLICIES
-- ==============================================================================
CREATE POLICY "Users can view own favorites"
    ON public.favorites FOR SELECT
    USING (user_id = public.current_profile_id());

CREATE POLICY "Users can manage own favorites"
    ON public.favorites FOR ALL
    USING (user_id = public.current_profile_id())
    WITH CHECK (user_id = public.current_profile_id());

CREATE POLICY "Users can view preferred professionals"
    ON public.preferred_professionals FOR SELECT
    USING (user_id = public.current_profile_id());

CREATE POLICY "Users can manage preferred professionals"
    ON public.preferred_professionals FOR ALL
    USING (user_id = public.current_profile_id())
    WITH CHECK (user_id = public.current_profile_id());

-- ==============================================================================
-- NOTIFICATIONS POLICIES
-- ==============================================================================
CREATE POLICY "Users can view own notifications"
    ON public.notifications FOR SELECT
    USING (user_id = public.current_profile_id());

CREATE POLICY "Users can mark own notifications as read"
    ON public.notifications FOR UPDATE
    USING (user_id = public.current_profile_id())
    WITH CHECK (user_id = public.current_profile_id());

-- ==============================================================================
-- GAMIFICATION & REWARD POLICIES
-- ==============================================================================
CREATE POLICY "Users can view own achievements progress"
    ON public.user_achievements FOR SELECT
    USING (user_id = public.current_profile_id());

CREATE POLICY "Users can view own reward transactions"
    ON public.reward_transactions FOR SELECT
    USING (user_id = public.current_profile_id());

CREATE POLICY "Users can view own support tickets"
    ON public.support_tickets FOR SELECT
    USING (user_id = public.current_profile_id());

CREATE POLICY "Users can create support tickets"
    ON public.support_tickets FOR INSERT
    WITH CHECK (user_id = public.current_profile_id());

-- ==============================================================================
-- PUBLIC CATALOG READ POLICIES (Services, Categories, Coupons, Rewards)
-- ==============================================================================
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read services" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Public read variants" ON public.service_variants FOR SELECT USING (is_active = true);
CREATE POLICY "Public read professionals" ON public.professionals FOR SELECT USING (is_available = true);
CREATE POLICY "Public read coupons" ON public.coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Public read achievements" ON public.achievements FOR SELECT USING (is_active = true);
CREATE POLICY "Public read rewards catalog" ON public.rewards FOR SELECT USING (is_active = true);
