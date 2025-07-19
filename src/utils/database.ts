import { supabase } from '../lib/supabaseClient';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  profile_picture_url?: string | null;
}

export interface EntryData {
  user_id: string;
  image_url: string;
  description: string | null;
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

export async function updateUserProfile(userId: string, email: string, username: string): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert({
      id: userId,
      email,
      username,
      profile_picture_url: null
    })
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }

  if (!data) {
    throw new Error('No data returned from profile update');
  }

  return data;
}

export async function hasExistingEntry(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('entries')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking existing entry:', error);
    return false;
  }

  return !!data;
}

export async function createEntry(userId: string, imageUrl: string, description?: string): Promise<void> {
  const { error } = await supabase
    .from('entries')
    .insert({
      user_id: userId,
      image_url: imageUrl,
      description: description || null
    });

  if (error) throw error;
}
