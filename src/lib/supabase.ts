import { createClient } from '@supabase/supabase-js';
import { UserProfile, Entry } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Custom fetch interceptor for debugging
const customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  // Log request details
  console.log('Supabase request:', {
    url: input.toString(),
    method: init?.method || 'GET',
    headers: init?.headers
  });

  try {
    const response = await fetch(input, init);
    // Log response details
    const responseHeaders = Object.fromEntries(response.headers.entries());
    console.log('Supabase response:', {
      url: input.toString(),
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      accept: init?.headers?.['Accept'],
      contentType: responseHeaders['content-type']
    });

    // Check for 406 errors
    if (response.status === 406) {
      console.error('406 Not Acceptable Error - Content negotiation failed:', {
        requestAccept: init?.headers?.['Accept'],
        responseType: responseHeaders['content-type']
      });
    }

    return response;
  } catch (error) {
    console.error('Supabase fetch error:', error);
    throw error;
  }
};

// Create a client with public access
export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'public'
  },
  auth: {
    // Don't use Supabase auth - we're using Privy
    persistSession: false,
    autoRefreshToken: false
  },
  global: {
    headers: {
      'apikey': supabaseKey,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    fetch: customFetch
  }
});

// Helper function to safely encode IDs for URLs
function encodeId(id: string): string {
  // Check if the ID is already encoded
  if (id.includes('%')) {
    console.log('ID is already encoded:', id);
    return id;
  }
  // Use built-in URL encoding to handle all special characters
  const encoded = encodeURIComponent(id);
  console.log('Encoding ID:', { original: id, encoded });
  return encoded;
}

export async function createOrUpdateUserProfile(userId: string, email: string, username: string, avatarUrl?: string, country?: string) {
  console.log('Received request to update profile:', { userId, email, username, avatarUrl, country });
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
  } catch (error: any) {
    console.error('Error in createOrUpdateUserProfile:', error?.message || error);
    console.error('Error details:', error?.details);
    console.error('Error hint:', error?.hint);
    console.error('Error code:', error?.code);
    throw error;
  }
}

export async function getUserProfile(userId: string) {
  console.log('Getting user profile for ID:', userId);
  const encodedId = encodeId(userId);
  console.log('Encoded ID for query:', encodedId);

  try {
    console.log('Sending Supabase request with encoded ID:', encodedId);
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', encodedId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('No profile found for user:', { userId, encodedId });
        return null;
      }
      console.error('Supabase error getting profile:', { error, userId, encodedId });
      throw error;
    }

    console.log('Found user profile:', { data, userId, encodedId });
    if (!data?.country) {
      console.log('No country found in profile data:', { data, userId, encodedId });
    } else {
      console.log('Country found in profile:', data.country);
    }
    return data as UserProfile;
  } catch (err) {
    console.error('Error in getUserProfile:', { err, userId, encodedId });
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
  const encodedId = encodeId(userId);
  console.log('Getting entry for user:', { userId, encodedId });
  try {
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', encodedId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('No entry found for user:', { userId, encodedId });
        return null;
      }
      console.error('Supabase error getting entry:', { error, userId, encodedId });
      throw error;
    }

    console.log('Found user entry:', { data, userId, encodedId });
    return data as Entry;
  } catch (err) {
    console.error('Error in getUserEntry:', { err, userId, encodedId });
    throw err;
  }
}

export async function getEntries(page = 1, limit = 10) {
  console.log('Fetching entries:', { page, limit });
  try {
    // Log request details for debugging
    const start = (page - 1) * limit;
    const end = page * limit - 1;
    console.log('Entries query:', { start, end });

    const { data, error, status } = await supabase
      .from('entries')
      .select('*')
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) {
      console.error('Error fetching entries:', { error, status, page, limit });
      return [];
    }

    if (!data || data.length === 0) {
      console.log('No entries found:', { page, limit });
      return [];
    }

    console.log('Fetched entries:', { count: data.length, page, limit });
    return data as Entry[];
  } catch (error) {
    console.error('Error in getEntries:', { error, page, limit });
    return [];
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

export async function checkUsernameAvailable(username: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('username', username)
      .single();

    if (error && error.code === 'PGRST116') {
      // No user found with this username, so it's available
      return true;
    }

    if (error) {
      console.error('Error checking username availability:', error);
      throw error;
    }

    // If we found a user, the username is not available
    return !data;
  } catch (error: any) {
    console.error('Error in checkUsernameAvailable:', error?.message || error);
    throw error;
  }
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
