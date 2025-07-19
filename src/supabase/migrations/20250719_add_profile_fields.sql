-- Add profile_picture_url and country columns to user_profiles
ALTER TABLE user_profiles
ADD COLUMN profile_picture_url TEXT,
ADD COLUMN country TEXT;
