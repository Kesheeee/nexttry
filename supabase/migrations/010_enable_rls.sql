-- Users: own data only (service_role bypasses RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select_own" ON users;
CREATE POLICY "users_select_own" ON users FOR SELECT USING (id = auth.uid());

DROP POLICY IF EXISTS "users_update_own" ON users;
CREATE POLICY "users_update_own" ON users FOR UPDATE USING (id = auth.uid());

-- Conversations: own data only
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "conversations_own" ON conversations;
CREATE POLICY "conversations_own" ON conversations USING (user_id = auth.uid());

-- Messages: own conversations only
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "messages_own" ON messages;
CREATE POLICY "messages_own" ON messages USING (
  conversation_id IN (SELECT id FROM conversations WHERE user_id = auth.uid())
);

-- Connects: own connections only
ALTER TABLE connects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "connects_own" ON connects;
CREATE POLICY "connects_own" ON connects USING (user_id = auth.uid());

-- Events: public read for published
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "events_public_read" ON events;
CREATE POLICY "events_public_read" ON events FOR SELECT USING (is_published = TRUE);

-- Blog: public read for published
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "blog_public_read" ON blog_posts;
CREATE POLICY "blog_public_read" ON blog_posts FOR SELECT USING (is_published = TRUE);

-- Event registrations: own registrations
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "registrations_own" ON event_registrations;
CREATE POLICY "registrations_own" ON event_registrations USING (user_id = auth.uid());

-- Usage logs: own logs only
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "usage_own" ON usage_logs;
CREATE POLICY "usage_own" ON usage_logs USING (user_id = auth.uid());

-- Contact submissions: no RLS — only admins view (service_role bypasses)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
