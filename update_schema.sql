-- Update user_profiles table
ALTER TABLE user_profiles 
  DROP COLUMN IF EXISTS bio,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT;
