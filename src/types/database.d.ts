import { Database } from '../types/database';

export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
export type EntryData = Database['public']['Tables']['entries']['Row'];

export declare function getUserProfile(userId: string): Promise<UserProfile | null>;
export declare function updateUserProfile(userId: string, email: string, username: string): Promise<UserProfile>;
export declare function hasExistingEntry(userId: string): Promise<boolean>;
export declare function createEntry(userId: string, imageUrl: string, description?: string): Promise<void>;
