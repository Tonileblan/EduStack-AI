-- ==============================================================================
-- SCHEMA: mia_academy (EduStack-AI / Skillplate Clone)
-- Description: Multi-product creator platform schema with strict RLS isolation
-- ==============================================================================

CREATE SCHEMA IF NOT EXISTS mia_academy;

-- 1. Creators Table
CREATE TABLE IF NOT EXISTS mia_academy.creators (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    subdomain TEXT UNIQUE NOT NULL,
    brand_name TEXT NOT NULL,
    logo_url TEXT,
    primary_color TEXT DEFAULT '#8B5CF6',
    bio TEXT,
    stripe_account_id TEXT,
    payout_enabled BOOLEAN DEFAULT FALSE,
    custom_domain TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products Table (6 types: course, community, coaching, bundle, membership, download)
CREATE TABLE IF NOT EXISTS mia_academy.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES mia_academy.creators(id) ON DELETE CASCADE,
    product_type TEXT NOT NULL CHECK (product_type IN ('course', 'community', 'coaching', 'bundle', 'membership', 'download')),
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    thumbnail_url TEXT,
    price_cents INTEGER NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'EUR',
    is_subscription BOOLEAN DEFAULT FALSE,
    billing_period TEXT CHECK (billing_period IN ('monthly', 'yearly', 'quarterly', NULL)),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'presale')),
    ai_generated BOOLEAN DEFAULT FALSE,
    meta_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(creator_id, slug)
);

-- 3. Course Modules Table
CREATE TABLE IF NOT EXISTS mia_academy.modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES mia_academy.products(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_drip_locked BOOLEAN DEFAULT FALSE,
    drip_days INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Lessons Table
CREATE TABLE IF NOT EXISTS mia_academy.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES mia_academy.modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content_type TEXT NOT NULL DEFAULT 'video' CHECK (content_type IN ('video', 'text', 'quiz', 'audio', 'download', 'interactive')),
    video_url TEXT,
    video_duration_seconds INTEGER DEFAULT 0,
    hls_playback_url TEXT,
    body_markdown TEXT,
    is_free_preview BOOLEAN DEFAULT FALSE,
    order_index INTEGER NOT NULL DEFAULT 0,
    ai_generated BOOLEAN DEFAULT FALSE,
    attachments_json JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Quizzes and Assessment
CREATE TABLE IF NOT EXISTS mia_academy.quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES mia_academy.lessons(id) ON DELETE CASCADE,
    passing_score INTEGER NOT NULL DEFAULT 70,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mia_academy.quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES mia_academy.quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false', 'open_text')),
    options_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    correct_option_index INTEGER,
    explanation TEXT,
    order_index INTEGER NOT NULL DEFAULT 0
);

-- 6. Student Enrollments / Purchases
CREATE TABLE IF NOT EXISTS mia_academy.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES mia_academy.products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'refunded', 'cancelled')),
    granted_by TEXT NOT NULL DEFAULT 'purchase' CHECK (granted_by IN ('purchase', 'manual', 'bundle', 'subscription')),
    expires_at TIMESTAMPTZ,
    certificate_issued_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, user_id)
);

-- 7. Lesson Progress Tracking
CREATE TABLE IF NOT EXISTS mia_academy.lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID NOT NULL REFERENCES mia_academy.enrollments(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES mia_academy.lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    video_timestamp_seconds INTEGER DEFAULT 0,
    quiz_score INTEGER,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(enrollment_id, lesson_id)
);

-- 8. Coupons & Discounts
CREATE TABLE IF NOT EXISTS mia_academy.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES mia_academy.creators(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_cents')),
    discount_value INTEGER NOT NULL,
    applies_to_product_id UUID REFERENCES mia_academy.products(id) ON DELETE CASCADE,
    max_redemptions INTEGER,
    redeemed_count INTEGER DEFAULT 0,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(creator_id, code)
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE mia_academy.creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE mia_academy.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE mia_academy.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE mia_academy.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE mia_academy.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mia_academy.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mia_academy.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE mia_academy.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE mia_academy.coupons ENABLE ROW LEVEL SECURITY;

-- Creators Policies
CREATE POLICY "Public can view creator public info" ON mia_academy.creators
    FOR SELECT USING (true);

CREATE POLICY "Creator can manage own profile" ON mia_academy.creators
    FOR ALL USING (auth.uid() = id);

-- Products Policies
CREATE POLICY "Public can view published products" ON mia_academy.products
    FOR SELECT USING (status = 'published' OR creator_id = auth.uid());

CREATE POLICY "Creators can manage their products" ON mia_academy.products
    FOR ALL USING (creator_id = auth.uid());

-- Modules & Lessons Policies
CREATE POLICY "Modules visible to creators and enrolled students" ON mia_academy.modules
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM mia_academy.products p WHERE p.id = product_id AND (p.creator_id = auth.uid() OR p.status = 'published'))
    );

CREATE POLICY "Creator can manage modules" ON mia_academy.modules
    FOR ALL USING (
        EXISTS (SELECT 1 FROM mia_academy.products p WHERE p.id = product_id AND p.creator_id = auth.uid())
    );

CREATE POLICY "Lessons visible to creators or enrolled students or preview" ON mia_academy.lessons
    FOR SELECT USING (
        is_free_preview = true OR
        EXISTS (
            SELECT 1 FROM mia_academy.modules m
            JOIN mia_academy.products p ON p.id = m.product_id
            WHERE m.id = module_id AND (
                p.creator_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM mia_academy.enrollments e 
                    WHERE e.product_id = p.id AND e.user_id = auth.uid() AND e.status = 'active'
                )
            )
        )
    );

CREATE POLICY "Creator can manage lessons" ON mia_academy.lessons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM mia_academy.modules m
            JOIN mia_academy.products p ON p.id = m.product_id
            WHERE m.id = module_id AND p.creator_id = auth.uid()
        )
    );

-- Enrollments Policies
CREATE POLICY "User can view own enrollments" ON mia_academy.enrollments
    FOR SELECT USING (user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM mia_academy.products p WHERE p.id = product_id AND p.creator_id = auth.uid()
    ));

-- Lesson Progress Policies
CREATE POLICY "User can manage own progress" ON mia_academy.lesson_progress
    FOR ALL USING (
        EXISTS (SELECT 1 FROM mia_academy.enrollments e WHERE e.id = enrollment_id AND e.user_id = auth.uid())
    );
