-- ============================================================
-- The Equivalence Engine — Database Schema + Demo Data
-- PostgreSQL 13+
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing (safe re-run)
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS needs CASCADE;
DROP TABLE IF EXISTS beneficiaries CASCADE;
DROP TABLE IF EXISTS donors CASCADE;
DROP TABLE IF EXISTS institutions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ------------------------------------------------------------
-- USERS
-- ------------------------------------------------------------
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT CHECK (role IN ('donor', 'institution')) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- INSTITUTIONS
-- ------------------------------------------------------------
CREATE TABLE institutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  location TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  is_verified BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- DONORS
-- ------------------------------------------------------------
CREATE TABLE donors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- BENEFICIARIES
-- ------------------------------------------------------------
CREATE TABLE beneficiaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
  name TEXT,
  reference_code TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- NEEDS
-- ------------------------------------------------------------
CREATE TABLE needs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
  beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE SET NULL,
  title TEXT,
  description TEXT,
  amount_required INTEGER NOT NULL,
  amount_funded INTEGER DEFAULT 0,
  tag TEXT,
  priority INTEGER DEFAULT 1,
  status TEXT CHECK (status IN ('pending', 'funded', 'closed')) DEFAULT 'pending',
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- DONATIONS
-- ------------------------------------------------------------
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  need_id UUID REFERENCES needs(id) ON DELETE CASCADE,
  donor_id UUID REFERENCES donors(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'completed',
  method TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- DEMO SEED DATA
-- All passwords below are bcrypt('password') with cost 10
-- ============================================================

-- bcrypt hash of "password" (cost 10) — verified to match
INSERT INTO users (id, username, password, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'alice',      '$2b$10$ci/xWRfqrBJa1lBC1fivXuzRfcAa.Sl1fsXH3ktxjA7xWm88hcNzi', 'donor'),
  ('22222222-2222-2222-2222-222222222222', 'bob',        '$2b$10$ci/xWRfqrBJa1lBC1fivXuzRfcAa.Sl1fsXH3ktxjA7xWm88hcNzi', 'donor'),
  ('33333333-3333-3333-3333-333333333333', 'hopeschool', '$2b$10$ci/xWRfqrBJa1lBC1fivXuzRfcAa.Sl1fsXH3ktxjA7xWm88hcNzi', 'institution'),
  ('44444444-4444-4444-4444-444444444444', 'careNGO',    '$2b$10$ci/xWRfqrBJa1lBC1fivXuzRfcAa.Sl1fsXH3ktxjA7xWm88hcNzi', 'institution');

INSERT INTO donors (id, user_id, name, email, phone) VALUES
  ('aaaaaaa1-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Alice Khan',   'alice@example.com', '+92-300-1111111'),
  ('aaaaaaa2-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'Bob Ahmed',    'bob@example.com',   '+92-300-2222222');

INSERT INTO institutions (id, user_id, name, type, location, contact_email, contact_phone) VALUES
  ('bbbbbbb1-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'Hope Public School', 'School', 'Lahore, Pakistan', 'admin@hopeschool.org', '+92-42-1234567'),
  ('bbbbbbb2-0000-0000-0000-000000000002', '44444444-4444-4444-4444-444444444444', 'Care NGO',           'NGO',    'Karachi, Pakistan','contact@carengo.org',  '+92-21-7654321');

INSERT INTO beneficiaries (id, institution_id, name, reference_code) VALUES
  ('ccccccc1-0000-0000-0000-000000000001', 'bbbbbbb1-0000-0000-0000-000000000001', 'Sara Ali',     'HPS-2024-001'),
  ('ccccccc2-0000-0000-0000-000000000002', 'bbbbbbb1-0000-0000-0000-000000000001', 'Hamza Iqbal',  'HPS-2024-002'),
  ('ccccccc3-0000-0000-0000-000000000003', 'bbbbbbb2-0000-0000-0000-000000000002', 'Fatima Bibi',  'CNG-2024-007');

INSERT INTO needs (id, institution_id, beneficiary_id, title, description, amount_required, amount_funded, tag, priority, status, image_url) VALUES
  ('ddddddd1-0000-0000-0000-000000000001', 'bbbbbbb1-0000-0000-0000-000000000001', 'ccccccc1-0000-0000-0000-000000000001',
   'School fees for Sara (Grade 6)',
   'Sara is a bright student whose family cannot afford this term''s fees. Funds go directly to school accounts.',
   15000, 5000, 'education', 2, 'pending',
   '/needs/seed-school-fees.png'),

  ('ddddddd2-0000-0000-0000-000000000002', 'bbbbbbb1-0000-0000-0000-000000000001', 'ccccccc2-0000-0000-0000-000000000002',
   'Textbooks & uniform for Hamza',
   'Complete book set and uniform for the new academic year.',
   8000, 0, 'education', 1, 'pending',
   '/needs/seed-hamza-textbooks.png'),

  ('ddddddd3-0000-0000-0000-000000000003', 'bbbbbbb2-0000-0000-0000-000000000002', 'ccccccc3-0000-0000-0000-000000000003',
   'Monthly groceries for Fatima''s family',
   'Essential food supplies (flour, rice, lentils, oil) for one month. Delivered by NGO.',
   12000, 12000, 'food', 3, 'funded',
   'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800'),

  ('ddddddd4-0000-0000-0000-000000000004', 'bbbbbbb2-0000-0000-0000-000000000002', NULL,
   'Emergency winter blankets (50 families)',
   'Urgent: blankets and warm clothing for displaced families this winter.',
   50000, 18000, 'urgent', 3, 'pending',
   '/needs/seed-winter-blankets.png');

INSERT INTO donations (need_id, donor_id, amount, method) VALUES
  ('ddddddd1-0000-0000-0000-000000000001', 'aaaaaaa1-0000-0000-0000-000000000001', 5000,  'card'),
  ('ddddddd3-0000-0000-0000-000000000003', 'aaaaaaa1-0000-0000-0000-000000000001', 7000,  'easypaisa'),
  ('ddddddd3-0000-0000-0000-000000000003', 'aaaaaaa2-0000-0000-0000-000000000002', 5000,  'jazzcash'),
  ('ddddddd4-0000-0000-0000-000000000004', 'aaaaaaa2-0000-0000-0000-000000000002', 18000, 'card');

-- Helpful indexes
CREATE INDEX idx_needs_status ON needs(status);
CREATE INDEX idx_needs_tag ON needs(tag);
CREATE INDEX idx_needs_institution ON needs(institution_id);
CREATE INDEX idx_donations_donor ON donations(donor_id);
CREATE INDEX idx_donations_need ON donations(need_id);
