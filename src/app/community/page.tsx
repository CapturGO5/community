"use client";

import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { getEntries } from '@/lib/supabase';
import { Entry } from '@/lib/types';
import SubmissionModal from '@/components/SubmissionModal';
import Image from 'next/image';

export default function CommunityPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { ready, authenticated } = usePrivy();

  useEffect(() => {
    async function loadEntries() {
      try {
        const data = await getEntries();
        setEntries(data);
      } catch (err) {
        console.error('Error loading entries:', err);
        setError('Failed to load entries');
      } finally {
        setLoading(false);
      }
    }

    if (ready) {
      loadEntries();
    }
  }, [ready]);

  if (!ready) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Community</h1>
          {authenticated && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Submit Entry
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">Loading entries...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-8">No entries yet. Be the first to submit!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map((entry) => (
              <div key={entry.id} className="bg-gray-900 rounded-lg overflow-hidden">
                <Image
                  src={entry.image_url}
                  alt={entry.description || 'Entry image'}
                  className="w-full h-48 object-cover"
                  width={400}
                  height={192}
                />
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {entry.profile_picture_url && (
                      <Image
                        src={entry.profile_picture_url}
                        alt={entry.username}
                        className="w-6 h-6 rounded-full"
                        width={24}
                        height={24}
                      />
                    )}
                    <span className="font-medium">{entry.username}</span>
                  </div>
                  {entry.description && (
                    <p className="text-gray-300">{entry.description}</p>
                  )}
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitSuccess={() => {
          setIsModalOpen(false);
          // Refresh entries
          getEntries().then(setEntries).catch(console.error);
        }}
      />
    </main>
  );
}
