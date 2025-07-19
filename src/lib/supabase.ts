import { createClient } from '@supabase/supabase-js';
import { UserProfile, Entry } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a client with public access
export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'public'
  },
  auth: {
    // Don't persist auth state since we're using Privy
    persistSession: false,
    autoRefreshToken: false
  },
  global: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
});

// Helper function to safely encode IDs for URLs
function encodeId(id: string): string {
  return encodeURIComponent(id).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16));
}

export async function createOrUpdateUserProfile(userId: string, email: string, username: string, avatarUrl?: string, country?: string) {
  console.log('Creating/updating user profile:', { userId, email, username, avatarUrl, country });
  
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        id: encodeId(userId),
        email,
        username,
        profile_picture_url: avatarUrl || null,
        country: country || null
      }, {
        onConflict: 'id'
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating profile:', error);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      console.error('Error code:', error.code);
      throw error;
    }

    console.log('Profile created/updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in createOrUpdateUserProfile:', error);
    console.error('Error details:', error.details);
    console.error('Error hint:', error.hint);
    console.error('Error code:', error.code);
    throw error;
  }
}

export async function getUserProfile(userId: string) {
  console.log('Getting user profile for ID:', userId);

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', encodeId(userId))
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('No profile found for user:', userId);
        return null;
      }
      console.error('Supabase error getting profile:', error);
      throw error;
    }

    console.log('Found user profile:', data);
    return data as UserProfile;
  } catch (err) {
    console.error('Error in getUserProfile:', err);
    throw err;
  }
}

export async function hasExistingEntry(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('entries')
    .select('id')
    .eq('user_id', encodeId(userId))
    .single();

  if (error && error.code === 'PGRST116') {
    // No entry found
    return false;
  }

  return true;
}

export async function getUserEntry(userId: string): Promise<Entry | null> {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', encodeId(userId))
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data as Entry;
}

export async function getEntries(page = 1, limit = 10) {
  console.log('Fetching entries:', { page, limit });

  try {
    // Fetch entries with pagination
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      console.error('Error fetching entries:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.log('No entries found');
      return [];
    }

    console.log('Fetched entries:', data);
    return data as Entry[];
  } catch (error) {
    console.error('Error in getEntries:', error);
    throw error;
  }
}





export async function updateUserProfile(userId: string, updates: { username?: string; bio?: string | null; email: string }) {
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert({
      id: encodeId(userId),
      ...updates
    })
    .select()
    .single();

  if (error) throw error;
  return data as UserProfile;
}

export async function createEntry(userId: string, imageUrl: string, description?: string) {
  // Check for existing entry first
  const hasEntry = await hasExistingEntry(userId);
  if (hasEntry) {
    throw new Error('User already has an entry');
  }

  const { data, error } = await supabase
    .from('entries')
    .insert({
      user_id: encodeId(userId),
      image_url: imageUrl,
      description: description || null,
      votes_count: 0
    })
    .select()
    .single();

  if (error) throw error;
  return data as Entry;
}

export async function deleteEntry(userId: string, entryId: string) {
  const { error } = await supabase
    .from('entries')
    .delete()
    .match({ id: entryId, user_id: encodeId(userId) });

  if (error) throw error;
}

export async function hasVoted(userId: string, entryId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('votes')
    .select('id')
    .eq('user_id', encodeId(userId))
    .eq('entry_id', entryId)
    .single();

  if (error && error.code === 'PGRST116') return false;
  if (error) throw error;
  return true;
}

export async function voteForEntry(userId: string, entryId: string) {
  // Check if user has already voted
  const hasVotedAlready = await hasVoted(userId, entryId);
  if (hasVotedAlready) {
    throw new Error('Already voted for this entry');
  }

  // Start a transaction
  const { error } = await supabase.rpc('vote_for_entry', {
    p_user_id: encodeId(userId),
    p_entry_id: entryId
  });

  if (error) throw error;
}

export async function getLeaderboard(page = 1, perPage = 15) {
  const offset = (page - 1) * perPage;

  try {
    // Get total count first
    const { count: total } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true });

    // Use the stored procedure for paginated data
    const { data, error } = await supabase
      .rpc('get_user_leaderboard', {
        page_offset: offset,
        page_limit: perPage
      });

    if (error) throw error;

    return {
      data: data || [],
      total: total || 0
    };
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}
