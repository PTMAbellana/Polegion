-- =====================================================
-- ADD ACTIVE TRACKING TO PARTICIPANTS
-- Better realtime solution than Supabase Presence
-- =====================================================

-- Add columns to track active status
ALTER TABLE room_participants 
ADD COLUMN IF NOT EXISTS last_active TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_in_competition BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS current_competition_id BIGINT,
ADD COLUMN IF NOT EXISTS session_id TEXT;

-- Add foreign key for current_competition_id
ALTER TABLE room_participants
ADD CONSTRAINT room_participants_current_competition_id_fkey 
FOREIGN KEY (current_competition_id) REFERENCES competitions(id) ON DELETE SET NULL;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_room_participants_last_active 
ON room_participants(room_id, last_active) 
WHERE last_active IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_room_participants_competition 
ON room_participants(current_competition_id, is_in_competition) 
WHERE is_in_competition = TRUE;

-- Function to check if user is active (within last 30 seconds)
CREATE OR REPLACE FUNCTION is_participant_active(participant_last_active TIMESTAMP WITH TIME ZONE)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN participant_last_active IS NOT NULL 
    AND participant_last_active > (NOW() - INTERVAL '30 seconds');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to clean up stale sessions (run periodically)
CREATE OR REPLACE FUNCTION cleanup_stale_sessions()
RETURNS void AS $$
BEGIN
  UPDATE room_participants
  SET 
    is_in_competition = FALSE,
    current_competition_id = NULL
  WHERE last_active < (NOW() - INTERVAL '1 minute');
END;
$$ LANGUAGE plpgsql;

-- Create a view for active participants per room
CREATE OR REPLACE VIEW active_room_participants AS
SELECT 
  rp.id,
  rp.room_id,
  rp.user_id,
  rp.last_active,
  rp.is_in_competition,
  rp.current_competition_id,
  rp.session_id,
  up.first_name,
  up.last_name,
  up.profile_pic,
  up.role
FROM room_participants rp
JOIN user_profiles up ON up.user_id = rp.user_id
WHERE is_participant_active(rp.last_active);

-- Create a view for active competition participants
CREATE OR REPLACE VIEW active_competition_participants AS
SELECT 
  rp.id,
  rp.room_id,
  rp.user_id,
  rp.current_competition_id,
  rp.last_active,
  rp.session_id,
  up.first_name,
  up.last_name,
  up.profile_pic,
  up.role,
  cl.accumulated_xp
FROM room_participants rp
JOIN user_profiles up ON up.user_id = rp.user_id
LEFT JOIN competition_leaderboards cl ON cl.room_participant_id = rp.id 
  AND cl.competition_id = rp.current_competition_id
WHERE rp.is_in_competition = TRUE
  AND is_participant_active(rp.last_active);

-- Grant permissions to authenticated users
GRANT SELECT ON active_room_participants TO authenticated;
GRANT SELECT ON active_competition_participants TO authenticated;

COMMENT ON COLUMN room_participants.last_active IS 'Timestamp of last activity - updated via heartbeat every 10-15 seconds';
COMMENT ON COLUMN room_participants.is_in_competition IS 'TRUE when participant is actively viewing a competition page';
COMMENT ON COLUMN room_participants.current_competition_id IS 'ID of competition currently being viewed by participant';
COMMENT ON COLUMN room_participants.session_id IS 'Unique session identifier to handle multiple tabs/devices';
