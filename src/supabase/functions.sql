-- Create exec function for running SQL queries
CREATE OR REPLACE FUNCTION exec(query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE query;
END;
$$;

-- Enable RLS on tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow users to read their own profiles
CREATE POLICY "Allow users to read their own profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to update their own profiles
CREATE POLICY "Allow users to update their own profiles"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to insert their own profiles
CREATE POLICY "Allow users to insert their own profiles"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own profiles
CREATE POLICY "Allow users to delete their own profiles"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow anyone to read entries
CREATE POLICY "Allow anyone to read entries"
  ON entries
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to insert their own entries
CREATE POLICY "Allow users to insert their own entries"
  ON entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own entries
CREATE POLICY "Allow users to delete their own entries"
  ON entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to read their own votes
CREATE POLICY "Allow users to read their own votes"
  ON votes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to insert their own votes
CREATE POLICY "Allow users to insert their own votes"
  ON votes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own votes
CREATE POLICY "Allow users to delete their own votes"
  ON votes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create user_profiles table function
CREATE OR REPLACE FUNCTION create_user_profiles_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS user_profiles (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
  );
END;
$$;

-- Create entries table function
CREATE OR REPLACE FUNCTION create_entries_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create extension if not exists
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  -- Create entries table
  CREATE TABLE IF NOT EXISTS entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- Create votes table
  CREATE TABLE IF NOT EXISTS votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    entry_id UUID NOT NULL REFERENCES entries(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, entry_id)
  );

  -- Create indexes
  CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
  CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
  CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
  CREATE INDEX IF NOT EXISTS idx_entries_user_id ON entries(user_id);
  CREATE INDEX IF NOT EXISTS idx_entries_created_at ON entries(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_votes_entry_id ON votes(entry_id);
  CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);

  -- Create updated_at trigger function
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ language 'plpgsql';

  -- Create triggers
  DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
  CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

  DROP TRIGGER IF EXISTS update_entries_updated_at ON entries;
  CREATE TRIGGER update_entries_updated_at
    BEFORE UPDATE ON entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
END;
$$;

-- Create indexes function
CREATE OR REPLACE FUNCTION create_indexes()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  CREATE INDEX IF NOT EXISTS idx_entries_user_id ON entries(user_id);
  CREATE INDEX IF NOT EXISTS idx_entries_created_at ON entries(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_votes_entry_id ON votes(entry_id);
  CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
END;
$$;
