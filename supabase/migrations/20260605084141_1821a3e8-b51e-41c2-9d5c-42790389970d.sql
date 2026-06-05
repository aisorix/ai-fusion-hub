
-- 1. Storage policies for cineshoot-videos (path convention: <user_id>/...)
CREATE POLICY "Users read own cineshoot videos"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'cineshoot-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users upload own cineshoot videos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'cineshoot-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users update own cineshoot videos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'cineshoot-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users delete own cineshoot videos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'cineshoot-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 2. Realtime authorization: restrict channel subscriptions to user-scoped topics
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access own user-scoped channels"
ON realtime.messages FOR SELECT TO authenticated
USING (
  realtime.topic() LIKE 'user:' || auth.uid()::text || ':%'
  OR realtime.topic() = 'user:' || auth.uid()::text
);

CREATE POLICY "Users can only broadcast to own user-scoped channels"
ON realtime.messages FOR INSERT TO authenticated
WITH CHECK (
  realtime.topic() LIKE 'user:' || auth.uid()::text || ':%'
  OR realtime.topic() = 'user:' || auth.uid()::text
);
