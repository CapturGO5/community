-- Create user_profiles table
CREATE TABLE user_profiles (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create tweet_submissions table
CREATE TABLE tweet_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES user_profiles(id),
  tweet_url TEXT NOT NULL,
  tweet_image_url TEXT,
  username TEXT NOT NULL,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create votes table to track who voted for what
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES user_profiles(id),
  tweet_id UUID NOT NULL REFERENCES tweet_submissions(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, tweet_id)
);

-- Create indexes
CREATE INDEX idx_tweet_submissions_user_id ON tweet_submissions(user_id);
CREATE INDEX idx_tweet_submissions_created_at ON tweet_submissions(created_at DESC);
CREATE INDEX idx_votes_tweet_id ON votes(tweet_id);
CREATE INDEX idx_votes_user_id ON votes(user_id);
