'use client';

import { useState, useEffect } from 'react';
import { fetchLeaderboard, LeaderboardProfile } from '@/lib/externalSupabase';


export default function LeaderboardPage() {
  const [profiles, setProfiles] = useState<LeaderboardProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const loadLeaderboard = async () => {
    try {
      const data = await fetchLeaderboard();
      setProfiles(data);
      setLastUpdated(new Date());
      setError('');
    } catch (err) {
      console.error('Error loading leaderboard:', err);
      setError('Failed to load leaderboard');
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
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Leaderboard</h1>
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Leaderboard</h1>
          <div className="bg-red-500/10 text-red-500 p-4 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Leaderboard</h1>
            <p className="text-white/70">Top 15 rewarded users on the capturGO app</p>
          </div>
          <div className="text-sm text-white/50">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>

        <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-white/50">
            <div className="col-span-1">#</div>
            <div className="col-span-7">Username</div>
            <div className="col-span-4 text-right">Points</div>
          </div>

          <div className="space-y-2">
            {profiles.map((profile, index) => (
              <div
                key={profile.username}
                className="bg-[#1a1d24] rounded-lg p-4"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-1">
                    <span className={`
                      font-semibold
                      ${index === 0 ? 'text-yellow-400' : ''}
                      ${index === 1 ? 'text-gray-300' : ''}
                      ${index === 2 ? 'text-amber-600' : ''}
                      ${index > 2 ? 'text-white/70' : ''}
                    `}>
                      #{index + 1}
                    </span>
                  </div>
                  <div className="col-span-7">
                    <span className="text-white font-medium">{profile.username}</span>
                  </div>
                  <div className="col-span-4 text-right">
                    <span className="text-indigo-400 font-medium">
                      {Math.floor(profile.token_balance).toLocaleString()} points
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
