# OrleansLocal — Supabase Database Architecture & Schema Specification

This document details the complete relational database architecture, SQL migration script, Row-Level Security (RLS) policies, storage buckets, and TypeScript definitions for migrating **OrleansLocal** to [Supabase](https://supabase.com).

---

## 1. Architecture Overview & Entity Relationship Diagram (ERD)

```text
┌────────────────────────┐         ┌────────────────────────┐
│      auth.users        │         │      categories        │
│   (Supabase Auth)      │         │  (slug, name, icon)    │
└───────────┬────────────┘         └───────────┬────────────┘
            │ 1:1                              │ 1:N
┌───────────▼────────────┐         ┌───────────▼────────────┐
│        profiles        │         │       businesses       │
│  (id, role, full_name) │◄───┐    │ (id, name, category_id,│
└───────────┬────────────┘    │    │  rating, address, lat, │
            │                 │    │  lng, hours, photos)   │
    ┌───────┴───────┬─────────┤    └─────┬───────┬───────┬──┘
    │ 1:N           │ 1:N     │          │ 1:N   │ 1:N   │ 1:N
┌───▼──────┐  ┌─────▼─────┐   │    ┌─────▼────┐  │  ┌────▼─────┐
│  reviews │  │ bookmarks │   │    │  deals   │  │  │  claims  │
│(rating,  │  │(user_id,  │   │    │(code,    │  │  │ (status) │
│ comment) │  │  biz_id)  │   │    │ expires) │  │  └──────────┘
└───┬──────┘  └───────────┘   │    └──────────┘  │
    │ 1:1                     │                  │
    └─────────────────────────┼──────────────────┘
                              │
┌────────────────────────┐    │    ┌────────────────────────┐
│     neighbourhoods     │    │    │         events         │
│(slug, name, highlights)│    │    │(title, date, location, │
└───────────┬────────────┘    │    │ category, is_free)     │
            │ 1:N             │    └───────────┬────────────┘
            └─────────────────┤                │ 1:N
                              │    ┌───────────▼────────────┐
┌────────────────────────┐    │    │       event_rsvps      │
│    community_groups    │    │    │  (user_id, event_id)   │
│(name, category, meet)  │    │    └────────────────────────┘
└───────────┬────────────┘    │
            │ 1:N             │    ┌────────────────────────┐
┌───────────▼────────────┐    │    │     news_articles      │
│   group_memberships    │    │    │ (title, slug, content, │
│  (user_id, group_id)   │────┘    │  author_id, tag)       │
└────────────────────────┘         └────────────────────────┘
```

---

## 2. Complete SQL Migration Script (PostgreSQL / Supabase DDL)

Paste the following SQL into the **Supabase SQL Editor** (`Dashboard > SQL Editor > New query`) to create all tables, constraints, indexes, triggers, and enum types.

```sql
-- ============================================================================
-- 1. EXTENSIONS & CUSTOM ENUMS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy full-text search

CREATE TYPE user_role AS ENUM ('member', 'business_owner', 'editor', 'admin');
CREATE TYPE price_tier AS ENUM ('$', '$$', '$$$', '$$$$');
CREATE TYPE submission_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE news_tag AS ENUM ('LOCAL SPOTLIGHT', 'COMMUNITY', 'SUSTAINABILITY', 'NEW OPENING', 'FEATURE');

-- ============================================================================
-- 2. PROFILES (Extends Supabase auth.users)
-- ============================================================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role user_role DEFAULT 'member'::user_role NOT NULL,
    bio TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Auto-sync profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url',
        'member'::user_role
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 3. NEIGHBOURHOODS
-- ============================================================================
CREATE TABLE public.neighbourhoods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    hero_image TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    popular_categories TEXT[] DEFAULT '{}',
    highlights TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================================
-- 4. BUSINESS CATEGORIES
-- ============================================================================
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    image_url TEXT,
    description TEXT,
    subcategories TEXT[] DEFAULT '{}',
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================================
-- 5. BUSINESSES
-- ============================================================================
CREATE TABLE public.businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT NOT NULL,
    neighbourhood_id UUID REFERENCES public.neighbourhoods(id) ON DELETE SET NULL,
    
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT,
    subcategory TEXT NOT NULL,
    
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    
    phone TEXT,
    email TEXT,
    website TEXT,
    
    -- JSONB structured opening hours
    hours JSONB DEFAULT '{
        "monday": "9:00 AM - 6:00 PM",
        "tuesday": "9:00 AM - 6:00 PM",
        "wednesday": "9:00 AM - 6:00 PM",
        "thursday": "9:00 AM - 8:00 PM",
        "friday": "9:00 AM - 8:00 PM",
        "saturday": "10:00 AM - 5:00 PM",
        "sunday": "Closed"
    }'::jsonb NOT NULL,
    
    photos TEXT[] DEFAULT '{}',
    logo_url TEXT,
    
    rating NUMERIC(2, 1) DEFAULT 5.0 CHECK (rating >= 1.0 AND rating <= 5.0),
    review_count INT DEFAULT 0 CHECK (review_count >= 0),
    price_level price_tier DEFAULT '$$'::price_tier NOT NULL,
    
    services TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    
    verified BOOLEAN DEFAULT FALSE NOT NULL,
    claimed BOOLEAN DEFAULT FALSE NOT NULL,
    sponsored BOOLEAN DEFAULT FALSE NOT NULL,
    sponsored_promo TEXT,
    year_established INT,
    
    social_links JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================================
-- 6. LOCAL RESIDENT DEALS & PROMOTIONS
-- ============================================================================
CREATE TABLE public.deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    deal_text TEXT NOT NULL,
    code TEXT NOT NULL,
    badge TEXT DEFAULT 'Exclusive Deal',
    category TEXT NOT NULL,
    expires_at TIMESTAMPTZ,
    expires_label TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================================
-- 7. EVENTS
-- ============================================================================
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organizer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
    
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT NOT NULL,
    description TEXT,
    
    start_date DATE NOT NULL,
    end_date DATE,
    start_time TEXT,
    end_time TEXT,
    
    location_name TEXT NOT NULL,
    address TEXT,
    category TEXT NOT NULL,
    image_url TEXT,
    
    is_free BOOLEAN DEFAULT TRUE NOT NULL,
    ticket_price TEXT,
    ticket_url TEXT,
    
    badge_color TEXT DEFAULT 'bg-emerald-100 text-emerald-800 border-emerald-300',
    rsvp_count INT DEFAULT 0 CHECK (rsvp_count >= 0),
    featured BOOLEAN DEFAULT FALSE NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================================
-- 8. COMMUNITY GROUPS
-- ============================================================================
CREATE TABLE public.community_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    leader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    meeting_schedule TEXT NOT NULL,
    location TEXT NOT NULL,
    image_url TEXT,
    
    contact_email TEXT,
    website TEXT,
    member_count INT DEFAULT 1 CHECK (member_count >= 0),
    is_verified BOOLEAN DEFAULT TRUE NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================================
-- 9. EDITORIAL STORIES & GOOD NEWS
-- ============================================================================
CREATE TABLE public.news_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tag news_tag DEFAULT 'COMMUNITY'::news_tag NOT NULL,
    tag_color TEXT,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT NOT NULL,
    read_time TEXT DEFAULT '3 min read',
    published_at DATE DEFAULT CURRENT_DATE NOT NULL,
    
    related_business_ids UUID[] DEFAULT '{}',
    likes_count INT DEFAULT 0 CHECK (likes_count >= 0),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================================
-- 10. REVIEWS & RATINGS
-- ============================================================================
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    helpful_count INT DEFAULT 0 CHECK (helpful_count >= 0),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE (business_id, user_id)
);

-- ============================================================================
-- 11. USER INTERACTIONS (Bookmarks, Event RSVPs, Group Memberships)
-- ============================================================================
CREATE TABLE public.saved_places (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    saved_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE (user_id, business_id)
);

CREATE TABLE public.event_rsvps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE (user_id, event_id)
);

CREATE TABLE public.group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    group_id UUID REFERENCES public.community_groups(id) ON DELETE CASCADE NOT NULL,
    joined_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE (user_id, group_id)
);

-- ============================================================================
-- 12. BUSINESS SUBMISSIONS & CLAIMS
-- ============================================================================
CREATE TABLE public.business_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    business_name TEXT NOT NULL,
    category TEXT NOT NULL,
    neighbourhood TEXT,
    address TEXT NOT NULL,
    phone TEXT,
    email TEXT NOT NULL,
    website TEXT,
    description TEXT NOT NULL,
    services TEXT,
    features TEXT[] DEFAULT '{}',
    photos TEXT[] DEFAULT '{}',
    status submission_status DEFAULT 'pending'::submission_status NOT NULL,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE TABLE public.business_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    claimant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    claimant_name TEXT NOT NULL,
    claimant_role TEXT NOT NULL,
    claimant_email TEXT NOT NULL,
    claimant_phone TEXT NOT NULL,
    verification_document_url TEXT,
    status submission_status DEFAULT 'pending'::submission_status NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================================================
-- 13. INDEXES FOR HIGH-PERFORMANCE SEARCH & FILTERING
-- ============================================================================
CREATE INDEX idx_businesses_category ON public.businesses(category_id);
CREATE INDEX idx_businesses_neighbourhood ON public.businesses(neighbourhood_id);
CREATE INDEX idx_businesses_rating ON public.businesses(rating DESC);
CREATE INDEX idx_businesses_price ON public.businesses(price_level);
CREATE INDEX idx_businesses_verified ON public.businesses(verified);
CREATE INDEX idx_businesses_sponsored ON public.businesses(sponsored);
CREATE INDEX idx_businesses_name_trgm ON public.businesses USING gin (name gin_trgm_ops);
CREATE INDEX idx_businesses_description_trgm ON public.businesses USING gin (description gin_trgm_ops);

CREATE INDEX idx_events_start_date ON public.events(start_date ASC);
CREATE INDEX idx_events_category ON public.events(category);
CREATE INDEX idx_deals_active ON public.deals(is_active, expires_at);
CREATE INDEX idx_reviews_business ON public.reviews(business_id);
CREATE INDEX idx_saved_places_user ON public.saved_places(user_id);
```

---

## 3. Supabase Row Level Security (RLS) Policies

Enable Row Level Security on all tables to ensure public visitors can read verified content, while write operations require authentication and owner permissions.

```sql
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neighbourhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_claims ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES
CREATE POLICY "Public profiles are readable by everyone"
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. PUBLIC READ POLICIES (Directories, Categories, Events, News, Groups, Deals)
CREATE POLICY "Anyone can view categories"
    ON public.categories FOR SELECT USING (true);

CREATE POLICY "Anyone can view neighbourhoods"
    ON public.neighbourhoods FOR SELECT USING (true);

CREATE POLICY "Anyone can view businesses"
    ON public.businesses FOR SELECT USING (true);

CREATE POLICY "Anyone can view active deals"
    ON public.deals FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view events"
    ON public.events FOR SELECT USING (true);

CREATE POLICY "Anyone can view community groups"
    ON public.community_groups FOR SELECT USING (true);

CREATE POLICY "Anyone can view news articles"
    ON public.news_articles FOR SELECT USING (true);

CREATE POLICY "Anyone can view reviews"
    ON public.reviews FOR SELECT USING (true);

-- 3. USER WRITE POLICIES (Authenticated Members)
-- Reviews
CREATE POLICY "Authenticated users can submit reviews"
    ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
    ON public.reviews FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
    ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- Saved Places / Bookmarks
CREATE POLICY "Users can view their saved places"
    ON public.saved_places FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can bookmark places"
    ON public.saved_places FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unbookmark places"
    ON public.saved_places FOR DELETE USING (auth.uid() = user_id);

-- Event RSVPs
CREATE POLICY "Users can view their own RSVPs"
    ON public.event_rsvps FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can RSVP to events"
    ON public.event_rsvps FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel their RSVP"
    ON public.event_rsvps FOR DELETE USING (auth.uid() = user_id);

-- Group Memberships
CREATE POLICY "Users can join groups"
    ON public.group_members FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave groups"
    ON public.group_members FOR DELETE USING (auth.uid() = user_id);

-- Submissions & Claims
CREATE POLICY "Users can create business submissions"
    ON public.business_submissions FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view their own submissions"
    ON public.business_submissions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can submit business ownership claims"
    ON public.business_claims FOR INSERT WITH CHECK (auth.uid() = claimant_id);

-- 4. BUSINESS OWNER & ADMIN POLICIES
CREATE POLICY "Owners can update their businesses"
    ON public.businesses FOR UPDATE USING (
        auth.uid() = owner_id OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins have full access on submissions"
    ON public.business_submissions FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
```

---

## 4. Supabase Storage Buckets Configuration

Create the following storage buckets in **Supabase Dashboard > Storage**:

| Bucket Name | Public Access | File Size Limit | Allowed MIME Types | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `business-photos` | **Yes (Public)** | 5 MB | `image/jpeg, image/png, image/webp` | Store storefront photos, logos, and gallery images |
| `event-images` | **Yes (Public)** | 5 MB | `image/jpeg, image/png, image/webp` | Event posters, banners, and festival schedule graphics |
| `news-media` | **Yes (Public)** | 5 MB | `image/jpeg, image/png, image/webp` | Editorial good-news hero banners and story photos |
| `user-avatars` | **Yes (Public)** | 2 MB | `image/jpeg, image/png, image/webp` | Community member profile avatars |
| `claim-documents` | **No (Private)** | 10 MB | `application/pdf, image/jpeg, image/png` | Business ownership proof, utility bills, business licenses |

### Storage Security Policies (SQL)
```sql
-- Allow public image reading
CREATE POLICY "Public can view business photos" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'business-photos');

-- Allow authenticated users to upload business photos
CREATE POLICY "Authenticated users can upload photos" 
    ON storage.objects FOR INSERT 
    WITH CHECK (bucket_id = 'business-photos' AND auth.role() = 'authenticated');
```

---

## 5. Automated Rating Aggregate Trigger

Whenever a customer posts or modifies a review, automatically recompute the business's average `rating` and `review_count`:

```sql
CREATE OR REPLACE FUNCTION public.recompute_business_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.businesses
    SET 
        rating = COALESCE((
            SELECT ROUND(AVG(rating)::numeric, 1) 
            FROM public.reviews 
            WHERE business_id = COALESCE(NEW.business_id, OLD.business_id)
        ), 5.0),
        review_count = (
            SELECT COUNT(*) 
            FROM public.reviews 
            WHERE business_id = COALESCE(NEW.business_id, OLD.business_id)
        ),
        updated_at = TIMEZONE('utc', NOW())
    WHERE id = COALESCE(NEW.business_id, OLD.business_id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_review_changed
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.recompute_business_rating();
```

---

## 6. Seed Data (Initial Categories & Neighbourhoods)

```sql
-- Seed Initial Categories
INSERT INTO public.categories (slug, name, icon_name, description, subcategories, display_order) VALUES
('food-drink', 'Food & Drink', 'restaurant', 'Artisan bakeries, local bistros, craft coffee, and family dining across Orleans.', ARRAY['Cafes & Bakeries', 'Casual Dining', 'Fine Dining', 'Pubs & Breweries', 'Specialty Markets'], 1),
('shopping', 'Shopping & Boutiques', 'shopping_bag', 'Independent retailers, gifts, clothing, home goods, and specialty stores.', ARRAY['Boutiques', 'Home Decor', 'Bookstores', 'Sporting Goods', 'Gifts & Crafts'], 2),
('health-beauty', 'Health & Wellness', 'spa', 'Family health clinics, registered massage, physiotherapy, dental, and yoga studios.', ARRAY['Dental Clinics', 'Physiotherapy & Chiro', 'Hair Salons & Spas', 'Optometrists', 'Fitness Studios'], 3),
('home-trade', 'Home Services & Trades', 'home_repair_service', 'Licensed residential electricians, plumbers, roofers, HVAC, and landscape contractors.', ARRAY['Electrical & Lighting', 'Plumbing & Heating', 'Roofing & Siding', 'Landscaping', 'Interior Painting'], 4),
('auto', 'Auto & Transportation', 'directions_car', 'Certified mechanical repair shops, tire centers, detailing, and EV maintenance.', ARRAY['Brake & Tire Centers', 'Auto Body Repair', 'Car Wash & Detailing', 'Oil & Lube Service'], 5),
('community', 'Community & Non-Profit', 'volunteer_activism', 'Charities, cultural centres, arts societies, senior programs, and volunteer corps.', ARRAY['Youth Groups', 'Environmental Stewardship', 'Bilingual Cultural Guilds', 'Charities'], 6);

-- Seed Neighbourhoods
INSERT INTO public.neighbourhoods (slug, name, tagline, description, latitude, longitude, highlights) VALUES
('convent-glen', 'Convent Glen', 'Historic riverfront tranquility and scenic river trails', 'Bordering the Ottawa River with bike pathways, Convent Glen features established family homes and quiet community parks.', 45.4745, -75.5412, ARRAY['Terry Fox Park', 'Convent Glen Shopping Centre', 'Ottawa River Pathway']),
('fallingbrook', 'Fallingbrook', 'Waterfall trails, community schools and bustling shopping', 'Centred around Princess Louise Falls and Ray Friel Rec Complex, Fallingbrook is one of Orleans largest family hubs.', 45.4791, -75.4984, ARRAY['Princess Louise Falls', 'Ray Friel Recreation Complex', 'Fallingbrook Community Garden']),
('avalon', 'Avalon', 'Modern master-planned parks, lakes, and vibrant retail', 'A fast-growing neighborhood surrounding Avalon Lake with modern shopping plazas along Innes Road.', 45.4612, -75.4820, ARRAY['Avalon Lake', 'Portobello Park', 'Innes Road Retail Strip']),
('chapel-hill', 'Chapel Hill', 'Mature tree-lined avenues and heritage forest walking trails', 'Perched in western Orleans with rolling topography, forested ravines, and quick access to Blackburn Hamlet.', 45.4523, -75.5534, ARRAY['Chapel Hill Forest Trail', 'Heritage Park', 'Bilingual Elementary Centres']),
('cumberland', 'Cumberland Village', 'Historic village charm, pioneer heritage, and country markets', 'An idyllic heritage enclave dating back to the 1800s featuring museums, orchards, and river ferry access.', 45.5182, -75.4089, ARRAY['Cumberland Heritage Village Museum', 'Ferry Crossing', 'Community Lions Park']);
```

---

## 7. Supabase Client Integration Guide (TypeScript)

### 1. Install Supabase JS SDK
```bash
npm install @supabase/supabase-js
```

### 2. Configure Environment Variables (`.env`)
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Initialize Supabase Client (`src/lib/supabase.ts`)
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 4. Fetch Businesses with Relational Category & Deals
```typescript
import { supabase } from './lib/supabase';

export async function fetchBusinesses(categorySlug?: string, searchQuery?: string) {
  let query = supabase
    .from('businesses')
    .select(`
      *,
      category:categories(name, slug, icon_name),
      neighbourhood:neighbourhoods(name, slug),
      deals(*)
    `)
    .order('rating', { ascending: false });

  if (categorySlug && categorySlug !== 'all') {
    query = query.eq('category.slug', categorySlug);
  }

  if (searchQuery) {
    query = query.ilike('name', `%${searchQuery}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
```

---

## 8. Summary of Database Tables

| Table | Primary Key | Key Foreign Keys | Purpose |
| :--- | :--- | :--- | :--- |
| `profiles` | `id` (UUID) | `auth.users(id)` | User accounts, avatars, roles (member, business_owner, admin) |
| `neighbourhoods` | `id` (UUID) | — | Orleans neighbourhoods (Convent Glen, Fallingbrook, Avalon, etc.) |
| `categories` | `id` (UUID) | — | Business classification, icon names, and subcategory tags |
| `businesses` | `id` (UUID) | `category_id`, `neighbourhood_id`, `owner_id` | Core directory listings with GPS coords, hours, ratings, photos |
| `deals` | `id` (UUID) | `business_id` | Resident coupons, promo codes, and expiration rules |
| `events` | `id` (UUID) | `business_id`, `organizer_id` | Community calendar entries, ticket pricing, and venue details |
| `community_groups` | `id` (UUID) | `leader_id` | Local clubs, sports associations, and community groups |
| `news_articles` | `id` (UUID) | `author_id` | Local journalism, good news spotlights, and community blogs |
| `reviews` | `id` (UUID) | `business_id`, `user_id` | Verified resident ratings, comments, and helpfulness metrics |
| `saved_places` | `id` (UUID) | `user_id`, `business_id` | User bookmarking and saved favorite places |
| `event_rsvps` | `id` (UUID) | `user_id`, `event_id` | Attendance RSVPs for events |
| `group_members` | `id` (UUID) | `user_id`, `group_id` | Memberships in community groups |
| `business_submissions` | `id` (UUID) | `user_id` | User-submitted listings pending moderator approval |
| `business_claims` | `id` (UUID) | `business_id`, `claimant_id` | Ownership claim requests with verification documents |
