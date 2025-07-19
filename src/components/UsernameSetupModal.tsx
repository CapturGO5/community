'use client';

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { createOrUpdateUserProfile, checkUsernameAvailable } from '@/lib/supabase';

export default function UsernameSetupModal({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const { user } = usePrivy();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Basic validation
      if (username.length < 3) {
        setError('Username must be at least 3 characters long');
        return;
      }

      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        setError('Username can only contain letters, numbers, and underscores');
        return;
      }

      // Check if username is available
      const isAvailable = await checkUsernameAvailable(username);
      if (!isAvailable) {
        setError('Username is already taken');
        return;
      }

      // Create user profile
      if (user?.email) {
        await createOrUpdateUserProfile(user.id, user.email.address, username);
        onComplete();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black/80 p-8 rounded-lg border border-white/10 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4 text-white">Choose Your Username</h2>
        <p className="text-white/70 mb-6">
          Pick a username that will be displayed with your submissions.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/20"
              disabled={isLoading}
            />
            {error && (
              <p className="text-red-400 mt-2 text-sm">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition disabled:opacity-50"
          >
            {isLoading ? 'Setting up...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
