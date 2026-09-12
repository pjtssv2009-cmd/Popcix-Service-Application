-- ==============================================================================
-- POPCIX SEED DATA
-- 14+ Service Categories, Top Verified Pros, Achievements, Rewards, and Coupons
-- ==============================================================================

-- 1. Insert Categories
INSERT INTO public.categories (id, slug, name, description, icon_name, accent_color, display_order)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'cleaning', 'Cleaning', 'Deep house, sofa, and kitchen sanitization', 'Sparkles', '#7C3AED', 1),
    ('c2222222-2222-2222-2222-222222222222', 'ac-services', 'AC Services', 'Repair, servicing, jet wash, and gas refill', 'Wind', '#0284C7', 2),
    ('c3333333-3333-3333-3333-333333333333', 'electrician', 'Electrician', 'Wiring, fan installation, and switchboard repair', 'Zap', '#FFAA00', 3),
    ('c4444444-4444-4444-4444-444444444444', 'plumber', 'Plumber', 'Leak fixes, pipe fittings, and tap replacements', 'Droplets', '#0284C7', 4),
    ('c5555555-5555-5555-5555-555555555555', 'carpenter', 'Carpenter', 'Furniture repair, hinges, lock changes, and assembly', 'Hammer', '#92400E', 5),
    ('c6666666-6666-6666-6666-666666666666', 'appliance-repair', 'Appliance Repair', 'Washing machine, microwave, and fridge repair', 'Tv', '#EC4899', 6),
    ('c7777777-7777-7777-7777-777777777777', 'pest-control', 'Pest Control', 'Eco-friendly cockroach, termite, and bed bug treatment', 'Bug', '#10B981', 7),
    ('c8888888-8888-8888-8888-888888888888', 'painting', 'Painting', 'Interior wall styling, waterproofing, and touchups', 'Paintbrush', '#F59E0B', 8),
    ('c9999999-9999-9999-9999-999999999999', 'beauty', 'Beauty & Spa', 'Salon at home, massages, and grooming', 'Smile', '#EC4899', 9),
    ('caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'car-cleaning', 'Car Cleaning', 'Doorstep waterless wash, interior detailing, and wax', 'Car', '#6366F1', 10),
    ('cbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'laundry', 'Laundry', 'Wash, steam iron, and dry cleaning pickup', 'Shirt', '#3B82F6', 11),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'moving', 'Moving', 'Packers, movers, and heavy lifting support', 'Truck', '#F97316', 12),
    ('cddddddd-dddd-dddd-dddd-dddddddddddd', 'home-maintenance', 'Home Maintenance', 'Full-house inspection and preventative checkup', 'Wrench', '#10B981', 13),
    ('ceeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'other-services', 'Other Services', 'Handyman on demand, lock repair, and custom jobs', 'PackagePlus', '#64748B', 14)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Core Services
INSERT INTO public.services (
    id, category_id, slug, name, short_description, full_overview, starting_price, original_price,
    estimated_duration_mins, rating, reviews_count, bookings_count, image_url,
    whats_included, whats_not_included, safety_protocols, is_trending, is_popular
)
VALUES
    (
        's1111111-1111-1111-1111-111111111111',
        'c2222222-2222-2222-2222-222222222222',
        'ac-deep-cleaning',
        'AC Deep Cleaning (Jet Wash)',
        'Intense power-jet cleaning of indoor and outdoor unit filters, coils, and drain pipes.',
        'Restore pure, arctic-cold cooling and eliminate 99.9% of mildew, dust mites, and odors with our high-pressure jet wash technology.',
        699.00,
        999.00,
        45,
        4.8,
        2340,
        5420,
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
        '["Indoor unit foam & high pressure jet wash", "Outdoor condenser coil blast", "Drain pipe flush & clog removal", "Cooling gas pressure diagnostic", "Post-service clean-up"]'::jsonb,
        '["Spare parts replacement if damaged", "Gas refill (charged separately if below threshold)"]'::jsonb,
        '["Verified background checked technicians", "Masks & boot covers worn", "Standard POPCIX 30-day service warranty"]'::jsonb,
        true,
        true
    ),
    (
        's2222222-2222-2222-2222-222222222222',
        'c1111111-1111-1111-1111-111111111111',
        'full-home-deep-cleaning',
        'Full House Deep Cleaning',
        'Complete top-to-bottom scrub, dusting, vacuuming, and sanitization of every room.',
        'Our elite multi-person crew handles intensive floor scrubbing, kitchen degreasing, bathroom descaling, and high-reach dusting.',
        2499.00,
        3499.00,
        180,
        4.9,
        3120,
        7890,
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80',
        '["Kitchen degreasing & chimney exterior cleaning", "Bathroom descaling & tile grout scrubbing", "Living room & bedroom dry vacuuming", "Window tracks & balcony washing", "Hard floor machine buffing"]'::jsonb,
        '["Interior cabinet cleaning if packed with items", "Wall paint scratch removal"]'::jsonb,
        '["Hospital-grade non-toxic chemicals", "Insured team with strict identity checks"]'::jsonb,
        true,
        true
    ),
    (
        's3333333-3333-3333-3333-333333333333',
        'c3333333-3333-3333-3333-333333333333',
        'emergency-electrical-repair',
        'Emergency Electrician Visit',
        'Fast 30-min arrival for short circuits, tripping MCBs, spark issues, or socket fixes.',
        'Licensed electricians equipped with multi-meters and commercial-grade safety tools to diagnose and resolve electrical faults immediately.',
        299.00,
        499.00,
        30,
        4.9,
        1850,
        4300,
        'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop&q=80',
        '["30-minute arrival guarantee for instant bookings", "Full fuse/MCB diagnostic", "Repair of up to 2 sockets or switches", "Safety load testing"]'::jsonb,
        '["Cost of heavy replacement MCBs or wires"]'::jsonb,
        '["Certified A-grade licensed electricians", "Insulated safety gear used"]'::jsonb,
        true,
        false
    ),
    (
        's4444444-4444-4444-4444-444444444444',
        'c4444444-4444-4444-4444-444444444444',
        'plumbing-leak-repair',
        'Plumbing Clog & Leak Fix',
        'Immediate resolution for leaking faucets, blocked drains, flush tanks, or low water pressure.',
        'Quick fix for all residential plumbing headaches with guaranteed leak-free seals and high-durability washers.',
        349.00,
        500.00,
        45,
        4.7,
        1420,
        3200,
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
        '["Diagnosis of water pressure/leak origin", "Fixing up to 2 tap valves or washers", "Sink siphon trap cleaning", "Sealant application"]'::jsonb,
        '["Cost of new faucets or major pipe replacement"]'::jsonb,
        '["Waterproof protective covers", "Post-repair cleanup"]'::jsonb,
        false,
        true
    ),
    (
        's5555555-5555-5555-5555-555555555555',
        'c7777777-7777-7777-7777-777777777777',
        'eco-pest-control',
        'Eco-Safe Pest Control',
        '100% odorless, child & pet friendly pest eradication for cockroaches and ants.',
        'Targeted herbal gel baiting and crack-and-crevice spray that eliminates colonies without requiring you to empty your kitchen.',
        899.00,
        1299.00,
        60,
        4.8,
        980,
        2100,
        'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&auto=format&fit=crop&q=80',
        '["Gel baiting in cabinets & hinges", "Drain spray treatment", "No need to vacate home", "90-day re-treatment guarantee"]'::jsonb,
        '["Termite drilling (available in specialized termite plan)"]'::jsonb,
        '["Government-approved Bayer odorless formulations", "Safe around babies & pets"]'::jsonb,
        false,
        true
    )
ON CONFLICT (slug) DO NOTHING;

-- 3. Insert Service Add-ons (For Service Stacking)
INSERT INTO public.service_variants (id, service_id, name, description, price, duration_mins, is_addon)
VALUES
    ('v1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'AC Anti-Bacterial Sanitization Spray', 'Eliminates 99.9% airborne bacteria', 199.00, 10, true),
    ('v2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'Outdoor Stand Anti-Rust Coating', 'Protective weather shield', 249.00, 15, true),
    ('v3333333-3333-3333-3333-333333333333', 's2222222-2222-2222-2222-222222222222', 'Balcony Deep Pressure Washing', 'Intense floor buffing for 2 balconies', 399.00, 30, true),
    ('v4444444-4444-4444-4444-444444444444', 's2222222-2222-2222-2222-222222222222', 'Fridge Interior Steam Clean', 'Hygienic hot steam disinfection', 299.00, 20, true)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Verified POPCIX Professionals
INSERT INTO public.professionals (id, name, profile_photo_url, rating, reviews_count, completed_jobs, years_experience, bio, skills, languages, service_area, response_rate, is_verified, is_available)
VALUES
    ('p1111111-1111-1111-1111-111111111111', 'Rajesh Sharma', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', 4.9, 342, 850, 6, 'Master HVAC technician certified with top brands. Known for speed and cleanliness.', '{"AC Jet Wash", "Gas Charging", "HVAC Diagnostics"}', '{"English", "Hindi"}', 'South & Central City', '99%', true, true),
    ('p2222222-2222-2222-2222-222222222222', 'Amit Patel', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', 4.8, 218, 620, 5, 'Certified Master Electrician. Quick fault locator and home automation specialist.', '{"MCB Repair", "Wiring", "Fixture Fitting"}', '{"English", "Gujarati", "Hindi"}', 'West District', '98%', true, true),
    ('p3333333-3333-3333-3333-333333333333', 'Sunita Devi', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80', 4.9, 512, 1200, 7, 'Lead deep cleaning specialist. Passionate about immaculate spotless homes.', '{"Deep Cleaning", "Kitchen Sanitization", "Eco Chemicals"}', '{"English", "Hindi"}', 'Citywide', '100%', true, true)
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Gamification Badges & Achievements
INSERT INTO public.achievements (id, slug, title, description, badge_icon, xp_reward, points_reward, category, target_count)
VALUES
    ('a1111111-1111-1111-1111-111111111111', 'first-spark', 'First Spark', 'Book your very first service on POPCIX', 'Zap', 150, 100, 'BOOKING', 1),
    ('a2222222-2222-2222-2222-222222222222', 'streak-master-7', 'Care Streak', 'Maintain a 7-day home care streak', 'Flame', 300, 200, 'STREAK', 7),
    ('a3333333-3333-3333-3333-333333333333', 'home-hero-10', 'Home Hero', 'Complete 10 total home services', 'Crown', 500, 400, 'LOYALTY', 10),
    ('a4444444-4444-4444-4444-444444444444', 'service-explorer-3', 'Service Explorer', 'Try services from 3 different categories', 'Compass', 250, 150, 'GENERAL', 3),
    ('a5555555-5555-5555-5555-555555555555', 'critic-star', 'Top Reviewer', 'Leave 5 helpful reviews with photos', 'Star', 200, 100, 'REVIEW', 5)
ON CONFLICT (slug) DO NOTHING;

-- 6. Insert Rewards Store Items
INSERT INTO public.rewards (id, title, description, points_cost, reward_type, reward_value, expiry_days)
VALUES
    ('r1111111-1111-1111-1111-111111111111', '₹200 Off Any Cleaning Service', 'Flat discount on full house or sofa cleaning', 500, 'SERVICE_VOUCHER', 200.00, 30),
    ('r2222222-2222-2222-2222-222222222222', 'Free AC Anti-Bacterial Treatment', 'Complimentary add-on on your next AC service', 350, 'FREE_ADDON', 199.00, 45),
    ('r3333333-3333-3333-3333-333333333333', '20% Off POPCIX HomeCare Plus', 'Save on your first month of HomeCare membership', 750, 'DISCOUNT_PERCENT', 20.00, 60),
    ('r4444444-4444-4444-4444-444444444444', '₹500 Mega Voucher', 'Valid on all services above ₹1499', 1200, 'SERVICE_VOUCHER', 500.00, 60)
ON CONFLICT (id) DO NOTHING;

-- 7. Insert Active Coupons
INSERT INTO public.coupons (id, code, title, description, discount_type, discount_value, max_discount, min_order_amount, valid_until)
VALUES
    ('cp111111-1111-1111-1111-111111111111', 'POPCIXFIRST', 'Welcome Offer', 'Flat ₹150 off on your first home booking', 'FIXED', 150.00, 150.00, 499.00, NOW() + INTERVAL '90 days'),
    ('cp222222-2222-2222-2222-222222222222', 'HOMECARE20', 'Home Care Fest', '20% off on all deep cleaning services', 'PERCENTAGE', 20.00, 300.00, 799.00, NOW() + INTERVAL '30 days'),
    ('cp333333-3333-3333-3333-333333333333', 'STACKSAVE', 'Bundle Bonus', 'Extra ₹250 off when you bundle 2 or more services', 'FIXED', 250.00, 250.00, 999.00, NOW() + INTERVAL '60 days')
ON CONFLICT (code) DO NOTHING;
