import { createClient } from '@supabase/supabase-js';

// Create a custom client for the external database
export const externalSupabase = createClient(
  process.env.NEXT_PUBLIC_EXTERNAL_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_EXTERNAL_SUPABASE_ANON_KEY!
);

export interface LeaderboardProfile {
  username: string;
  token_balance: number;
}

export async function fetchLeaderboard(): Promise<LeaderboardProfile[]> {
  const { data, error } = await externalSupabase
    .from('profiles')
    .select('username, token_balance')
    .not('username', 'eq', 'Admin')
    .not('username', 'eq', 'Test')
    .not('username', 'eq', 'b')
    .order('token_balance', { ascending: false })
    .limit(15);

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }

  return data || [];
}
