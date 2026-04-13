CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  locale TEXT DEFAULT 'en' CHECK (locale IN ('en', 'zh')),
  life_stage TEXT CHECK (life_stage IN (
    'secondary_school', 'university', 'early_career', 'career_change', 'retired'
  )),
  bio TEXT,
  social_links JSONB DEFAULT '{}',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  stripe_customer_id TEXT,
  billing_plan TEXT DEFAULT 'free' CHECK (billing_plan IN ('free', 'starter', 'pro')),
  billing_cycle_end TIMESTAMPTZ,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_life_stage ON users(life_stage);
CREATE INDEX IF NOT EXISTS idx_users_stripe ON users(stripe_customer_id);
