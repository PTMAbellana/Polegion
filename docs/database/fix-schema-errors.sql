-- Fix Schema Errors for Production
-- Created: 2026-02-02
-- Purpose: Add missing RPC function for hint tracking

-- 1. Create increment_hint_shown RPC function
-- This function updates the hint_shown boolean in user_topic_progress table
CREATE OR REPLACE FUNCTION public.increment_hint_shown(
  p_user_id UUID,
  p_topic_id UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.user_topic_progress
  SET 
    hint_shown = true,
    hint_shown_at = NOW(),
    updated_at = NOW()
  WHERE user_id = p_user_id 
    AND topic_id = p_topic_id;
    
  -- If no row exists, do nothing (let the calling code handle creation)
  -- The function is meant to mark an existing progress record
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.increment_hint_shown(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_hint_shown(UUID, UUID) TO service_role;

-- Verification query
SELECT 
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'increment_hint_shown';
