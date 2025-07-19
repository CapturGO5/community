-- Create stored procedure for voting
CREATE OR REPLACE FUNCTION vote_for_entry(p_user_id TEXT, p_entry_id TEXT)
RETURNS void AS $$
BEGIN
  -- Insert vote
  INSERT INTO votes (user_id, entry_id)
  VALUES (p_user_id, p_entry_id);

  -- Update vote count
  UPDATE entries
  SET votes_count = votes_count + 1
  WHERE id = p_entry_id;
END;
$$ LANGUAGE plpgsql;
