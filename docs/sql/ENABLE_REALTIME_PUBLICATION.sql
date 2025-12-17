-- Enable Realtime for room_participants table
-- This allows postgres_changes subscriptions to receive UPDATE events

-- Add room_participants to the supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE room_participants;

-- Verify the publication includes the table
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
ORDER BY tablename;
