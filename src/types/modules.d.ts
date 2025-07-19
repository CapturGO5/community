declare module '../lib/supabaseClient' {
  import { SupabaseClient } from '@supabase/supabase-js';
  import { Database } from './database';
  export const supabase: SupabaseClient<Database>;
}

declare module '../utils/database' {
  import { Database } from './database';
  export function getUserProfile(userId: string): Promise<Database['public']['Tables']['user_profiles']['Row'] | null>;
  export function updateUserProfile(userId: string, email: string, username: string): Promise<Database['public']['Tables']['user_profiles']['Row']>;
  export function hasExistingEntry(userId: string): Promise<boolean>;
  export function createEntry(userId: string, imageUrl: string, description?: string): Promise<void>;
}

declare module '../utils/helpers' {
  export function encodeId(str: string): string;
  export function decodeId(encodedId: string): string;
  export function generateUniqueFilename(originalFilename: string): string;
}
