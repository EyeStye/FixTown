-- FixTown — Initial Database Migration
-- Run against a PostgreSQL instance with PostGIS extension enabled
-- psql -d your_db -f 001_init.sql

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- ── ENUMS ──
CREATE TYPE user_role     AS ENUM ('citizen', 'officer');
CREATE TYPE issue_status  AS ENUM ('open', 'in_progress', 'resolved', 'rejected');
CREATE TYPE issue_category AS ENUM ('pothole', 'manhole', 'water', 'electricity', 'road', 'other');

-- ── USERS ──
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          user_role NOT NULL DEFAULT 'citizen',
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- ── ISSUES ──
CREATE TABLE IF NOT EXISTS issues (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  category    issue_category NOT NULL,
  status      issue_status NOT NULL DEFAULT 'open',
  location    GEOGRAPHY(POINT, 4326) NOT NULL,
  address     TEXT,
  image_url   TEXT,
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vote_count  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Geospatial index for radius queries and clustering
CREATE INDEX idx_issues_location    ON issues USING GIST(location);
CREATE INDEX idx_issues_status      ON issues(status);
CREATE INDEX idx_issues_category    ON issues(category);
CREATE INDEX idx_issues_user_id     ON issues(user_id);
CREATE INDEX idx_issues_vote_count  ON issues(vote_count DESC);
CREATE INDEX idx_issues_created_at  ON issues(created_at DESC);

-- ── VOTES ──
CREATE TABLE IF NOT EXISTS votes (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  issue_id   UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, issue_id)
);

CREATE INDEX idx_votes_issue_id ON votes(issue_id);
CREATE INDEX idx_votes_user_id  ON votes(user_id);

-- ── NOTIFICATIONS ──
CREATE TABLE IF NOT EXISTS notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  issue_id   UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  message    TEXT NOT NULL,
  is_read    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(user_id, is_read);

-- ── STATUS LOGS ──
CREATE TABLE IF NOT EXISTS status_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id    UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  old_status  TEXT NOT NULL,
  new_status  TEXT NOT NULL,
  changed_by  UUID NOT NULL REFERENCES users(id),
  note        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_status_logs_issue_id ON status_logs(issue_id);

-- ── AUTO-UPDATE updated_at ──
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at  BEFORE UPDATE ON users  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_issues_updated_at BEFORE UPDATE ON issues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── VOTE COUNT TRIGGERS ──
CREATE OR REPLACE FUNCTION increment_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE issues SET vote_count = vote_count + 1 WHERE id = NEW.issue_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE issues SET vote_count = GREATEST(vote_count - 1, 0) WHERE id = OLD.issue_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_vote_insert AFTER INSERT ON votes FOR EACH ROW EXECUTE FUNCTION increment_vote_count();
CREATE TRIGGER after_vote_delete AFTER DELETE ON votes FOR EACH ROW EXECUTE FUNCTION decrement_vote_count();
