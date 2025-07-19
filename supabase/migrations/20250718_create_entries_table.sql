-- Drop the old tables
DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS tweet_submissions CASCADE;
DROP TABLE IF EXISTS entries CASCADE;

-- Create new entries table
CREATE TABLE entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES user_profiles(id),
    username TEXT NOT NULL,
    profile_picture_url TEXT,
    image_url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add indexes
CREATE INDEX entries_user_id_idx ON entries(user_id);
CREATE INDEX entries_created_at_idx ON entries(created_at DESC);

-- Add a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_entries_updated_at
    BEFORE UPDATE ON entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
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

-- Create votes table
CREATE TABLE votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES user_profiles(id),
    entry_id UUID NOT NULL REFERENCES entries(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, entry_id)
);

-- Add indexes for votes
CREATE INDEX votes_user_id_idx ON votes(user_id);
CREATE INDEX votes_entry_id_idx ON votes(entry_id);

-- Enable RLS for votes
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for votes
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
