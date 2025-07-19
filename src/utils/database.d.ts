import { Database } from '../types/database';

export function getUserProfile(userId: string): Promise<Database['public']['Tables']['user_profiles']['Row'] | null>;
export function updateUserProfile(userId: string, email: string, username: string): Promise<Database['public']['Tables']['user_profiles']['Row']>;
export function hasExistingEntry(userId: string): Promise<boolean>;
export function createEntry(userId: string, imageUrl: string, description?: string): Promise<void>;
