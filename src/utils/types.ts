export interface UserProfile {
  id: string;
  email: string;
  username: string;
  profile_picture_url?: string | null;
  country?: string | null;
}

export interface Entry {
  id: string;
  user_id: string;
  image_url: string;
  description?: string | null;
  votes_count: number;
  created_at: string;
}
