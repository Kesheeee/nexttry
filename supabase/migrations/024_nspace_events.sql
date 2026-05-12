-- ─────────────────────────────────────────────────────────────────────
-- nSpace Phase 3: NextTry-hosted weekly events
-- Three tables: series template → concrete instances → RSVPs
-- No RLS — all access goes through the service-role admin client.
-- ─────────────────────────────────────────────────────────────────────

-- 1. Series — the weekly template (e.g. "Monday Coffee Walk")
CREATE TABLE IF NOT EXISTS nspace_event_series (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT NOT NULL,
  description      TEXT,
  weekday          SMALLINT NOT NULL CHECK (weekday BETWEEN 0 AND 6), -- 0=Sun, 1=Mon … 6=Sat
  start_time       TIME NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 90,
  venue_id         UUID REFERENCES nspace_venues(id) ON DELETE SET NULL,
  location_text    TEXT,    -- freeform fallback when venue_id is null (e.g. "Causeway Bay TBD")
  capacity         INT NOT NULL,
  price_cents      INT NOT NULL DEFAULT 0,  -- kept for Phase 1B; 0 = free
  created_by       UUID REFERENCES users(id) ON DELETE SET NULL,
  active           BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Events — concrete weekly instances
CREATE TABLE IF NOT EXISTS nspace_events (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id         UUID NOT NULL REFERENCES nspace_event_series(id) ON DELETE CASCADE,
  starts_at         TIMESTAMPTZ NOT NULL,
  ends_at           TIMESTAMPTZ NOT NULL,
  capacity_override INT,     -- null → inherit from series.capacity
  status            TEXT NOT NULL DEFAULT 'scheduled'
                    CHECK (status IN ('scheduled', 'canceled', 'completed')),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (series_id, starts_at)
);

CREATE INDEX IF NOT EXISTS idx_nspace_events_starts_at ON nspace_events(starts_at);

-- 3. RSVPs
CREATE TABLE IF NOT EXISTS nspace_event_rsvps (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id   UUID NOT NULL REFERENCES nspace_events(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status     TEXT NOT NULL DEFAULT 'confirmed'
             CHECK (status IN ('confirmed', 'canceled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (event_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_nspace_event_rsvps_event ON nspace_event_rsvps(event_id);

-- ─────────────────────────────────────────────────────────────────────
-- SAMPLE SEED — Monday Coffee Walk
--
-- To activate:
--   1. Find your user UUID in Supabase → Table Editor → users.
--   2. Replace the placeholder UUID in created_by below.
--   3. Uncomment the INSERT block.
--   4. Run this file (or paste the INSERT into the SQL editor).
--   5. Then insert rows into nspace_events for each upcoming Monday,
--      pointing series_id at the series UUID returned here.
-- ─────────────────────────────────────────────────────────────────────
/*
INSERT INTO nspace_event_series (
  title,
  description,
  weekday,
  start_time,
  duration_minutes,
  location_text,
  capacity,
  price_cents,
  created_by,
  active
) VALUES (
  'Monday Coffee Walk',
  'A quiet walk + coffee to start the week with intention. No agenda, just good conversation.',
  1,                            -- Monday
  '09:00',
  90,
  'Causeway Bay — meet at Times Square exit A',
  12,
  0,
  'YOUR-USER-UUID-HERE',        -- replace with your users.id
  true
);

-- After inserting the series, seed the next 4 Monday instances.
-- Replace <series_uuid> with the id returned by the INSERT above.
INSERT INTO nspace_events (series_id, starts_at, ends_at, status) VALUES
  ('<series_uuid>', '2026-05-18 09:00:00+08', '2026-05-18 10:30:00+08', 'scheduled'),
  ('<series_uuid>', '2026-05-25 09:00:00+08', '2026-05-25 10:30:00+08', 'scheduled'),
  ('<series_uuid>', '2026-06-01 09:00:00+08', '2026-06-01 10:30:00+08', 'scheduled'),
  ('<series_uuid>', '2026-06-08 09:00:00+08', '2026-06-08 10:30:00+08', 'scheduled');
*/
