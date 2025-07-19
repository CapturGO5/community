import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface UserProfile {
  id: string;
  email: string;
  username: string;
  profile_picture_url?: string;
  country?: string;
}

export async function updateUserProfile(userId: string, email: string, data: Partial<UserProfile>): Promise<UserProfile | null> {
  const { data: updatedProfile, error } = await supabase
    .from('user_profiles')
    .upsert({
      id: userId,
      email,
      ...data
    })
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }

  return updatedProfile;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
}

export async function hasExistingEntry(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('entries')
    .select('id')
    .eq('user_id', userId)
    .limit(1);

  if (error) {
    console.error('Error checking existing entry:', error);
    return false;
  }

  return data.length > 0;
}

export async function createEntry(userId: string, imageUrl: string, description: string) {
  const { data, error } = await supabase
    .from('entries')
    .insert([
      {
        user_id: userId,
        image_url: imageUrl,
        description,
        votes_count: 0
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating entry:', error);
    throw error;
  }

  return data;
}
