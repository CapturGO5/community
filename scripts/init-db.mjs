import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function initializeDatabase() {
  try {
    // Create user_profiles table
    const { error: profilesError } = await supabase.rpc('create_user_profiles_table');
    if (profilesError) {
      console.error('Error creating user_profiles table:', profilesError);
      return;
    }

    // Create entries table
    const { error: entriesError } = await supabase.rpc('create_entries_table');
    if (entriesError) {
      console.error('Error creating entries table:', entriesError);
      return;
    }

    // Create votes table
    const { error: votesError } = await supabase.rpc('create_votes_table');
    if (votesError) {
      console.error('Error creating votes table:', votesError);
      return;
    }

    // Create indexes
    const { error: indexesError } = await supabase.rpc('create_indexes');
    if (indexesError) {
      console.error('Error creating indexes:', indexesError);
      return;
    }

    console.log('Database initialization complete!');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initializeDatabase().catch(console.error);
