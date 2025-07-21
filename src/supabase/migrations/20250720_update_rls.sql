-- Drop existing RLS policies
DROP POLICY IF EXISTS "Allow users to read their own profiles" ON user_profiles;
DROP POLICY IF EXISTS "Allow users to update their own profiles" ON user_profiles;
DROP POLICY IF EXISTS "Allow users to insert their own profiles" ON user_profiles;
DROP POLICY IF EXISTS "Allow users to delete their own profiles" ON user_profiles;

-- Create new RLS policies for user_profiles
CREATE POLICY "Allow API access to read profiles"
  ON user_profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Allow API access to update profiles"
  ON user_profiles
  FOR UPDATE
  USING (true);

CREATE POLICY "Allow API access to insert profiles"
  ON user_profiles
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow API access to delete profiles"
  ON user_profiles
  FOR DELETE
  USING (true);

-- Update entries policies to allow API access
DROP POLICY IF EXISTS "Allow anyone to read entries" ON entries;
DROP POLICY IF EXISTS "Allow users to insert their own entries" ON entries;
DROP POLICY IF EXISTS "Allow users to delete their own entries" ON entries;

CREATE POLICY "Allow API access to read entries"
  ON entries
  FOR SELECT
  USING (true);

CREATE POLICY "Allow API access to insert entries"
  ON entries
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow API access to delete entries"
  ON entries
  FOR DELETE
  USING (true);

-- Update votes policies to allow API access
DROP POLICY IF EXISTS "Allow users to read their own votes" ON votes;
DROP POLICY IF EXISTS "Allow users to insert their own votes" ON votes;
DROP POLICY IF EXISTS "Allow users to delete their own votes" ON votes;

CREATE POLICY "Allow API access to read votes"
  ON votes
  FOR SELECT
  USING (true);

CREATE POLICY "Allow API access to insert votes"
  ON votes
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow API access to delete votes"
  ON votes
  FOR DELETE
  USING (true);
