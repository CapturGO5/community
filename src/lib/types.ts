export interface UserProfile {
  id: string;
  username: string;
  email: string;
  profile_picture_url?: string | null;
  country: string | null;
  created_at: string;
  updated_at: string;
}

export interface Entry {
  id: string;
  user_id: string;
  username: string;
  profile_picture_url: string | null;
  image_url: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  votes_count?: number;
}
