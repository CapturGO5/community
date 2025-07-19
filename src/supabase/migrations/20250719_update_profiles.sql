-- Drop and recreate user_profiles table with all fields
DROP TABLE IF EXISTS user_profiles CASCADE;

CREATE TABLE user_profiles (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  profile_picture_url TEXT,
  country TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
