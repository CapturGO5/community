-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  entry_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, entry_id),
  FOREIGN KEY (user_id) REFERENCES user_profiles(id),
  FOREIGN KEY (entry_id) REFERENCES entries(id) ON DELETE CASCADE
);

-- Add votes count to entries
ALTER TABLE entries ADD COLUMN IF NOT EXISTS votes_count INTEGER DEFAULT 0;
