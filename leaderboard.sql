-- Create the stored procedure for getting leaderboard data
CREATE OR REPLACE FUNCTION get_user_leaderboard(
  page_offset INTEGER,
  page_limit INTEGER
)
RETURNS TABLE (
  id TEXT,
  name TEXT,
  profile_picture_url TEXT,
  total_votes BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.id,
    up.name,
    up.profile_picture_url,
    COALESCE(
      (
        SELECT COUNT(*)::BIGINT 
        FROM votes v 
        JOIN entries e ON e.id = v.entry_id 
        WHERE e.user_id = up.id
      ),
      0
    ) as total_votes
  FROM user_profiles up
  ORDER BY total_votes DESC
  LIMIT page_limit
  OFFSET page_offset;
END;
$$ LANGUAGE plpgsql;
