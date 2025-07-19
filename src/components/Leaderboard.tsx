import { useEffect, useState } from 'react';
import { fetchLeaderboard, LeaderboardProfile } from '@/lib/externalSupabase';

export default function Leaderboard() {
  const [profiles, setProfiles] = useState<LeaderboardProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLeaderboard = async () => {
    try {
      const data = await fetchLeaderboard();
      setProfiles(data);
      setError(null);
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error('Error loading leaderboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();

    // Refresh every 10 minutes
    const interval = setInterval(loadLeaderboard, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-lg">
        <div className="animate-pulse flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-800/50 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-lg">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-lg">
      <div className="px-6 py-4 border-b border-gray-800">
        <h2 className="text-xl font-semibold text-white">Top Token Holders</h2>
      </div>
      <div className="divide-y divide-gray-800">
        {profiles.map((profile, index) => (
          <div
            key={profile.username}
            className="px-6 py-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                <span className={`
                  text-sm font-medium
                  ${index === 0 ? 'text-yellow-500' : ''}
                  ${index === 1 ? 'text-gray-300' : ''}
                  ${index === 2 ? 'text-amber-600' : ''}
                  ${index > 2 ? 'text-gray-500' : ''}
                `}>
                  #{index + 1}
                </span>
              </div>
              <div>
                <p className="font-medium text-white">{profile.username}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-indigo-400">
                {profile.token_balance.toLocaleString()} tokens
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
