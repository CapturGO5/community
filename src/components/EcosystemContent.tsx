'use client';

import React from 'react';
import Image from 'next/image';
import { useState, useEffect, useCallback, useRef } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { getEntries, voteForEntry } from '@/lib/supabase';
import { Entry } from '@/lib/types';

const ITEMS_PER_PAGE = 6;
const POLL_INTERVAL = 300000; // 5 minutes in milliseconds

interface EcosystemContentProps {
  onOpenCarousel: () => void;
  onOpenSubmission: () => void;
}

export default function EcosystemContent({ onOpenCarousel, onOpenSubmission }: EcosystemContentProps) {
  const { user } = usePrivy();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [votedEntries, setVotedEntries] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchEntries = useCallback(async (page = 1, append = false) => {
    const loadingState = append ? setIsLoading : setIsRefreshing;
    try {
      loadingState(true);
      const data = await getEntries(page);
      if (page === 1) {
        setLastRefreshed(new Date());
      }
      if (page === 1 && !append) {
        setEntries(data);
      } else {
        setEntries(prev => [...prev, ...data]);
      }
      setHasMore(data && data.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      loadingState(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!isLoading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      await fetchEntries(nextPage, true);
    }
  }, [isLoading, hasMore, currentPage, fetchEntries]);

  useEffect(() => {
    fetchEntries();

    // Set up polling interval
    const pollInterval = setInterval(() => {
      fetchEntries(1, false);
    }, POLL_INTERVAL);

    return () => clearInterval(pollInterval);
  }, [fetchEntries]);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loadMore, isLoading, hasMore]);

  return (
    <div className="relative min-h-[200px]">
      {/* Block number indicators */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-0 mt-4 bg-white/5 rounded-full px-3 py-1 text-sm text-white/70 border border-white/10">
        Latest Block #{entries.length}
      </div>

      {/* Central timeline line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-[200%] bg-gradient-to-b from-white/30 via-white/20 to-transparent"></div>

      {/* Entries */}
      <div className="space-y-12">
        {entries.map((entry, index) => (
          <div 
            key={entry.id} 
            className={`relative flex ${index % 2 === 0 ? 'justify-end' : ''} items-center`}
          >
            <div className={`w-[calc(50%-3rem)] ${index % 2 === 0 ? 'mr-12' : 'ml-12'} relative group`}>
              {/* Connection line */}
              <div 
                className={`absolute top-1/2 ${index % 2 === 0 ? 'right-0 translate-x-full' : 'left-0 -translate-x-full'} 
                  w-8 h-px bg-gradient-to-r ${index % 2 === 0 ? 'from-white/40 to-white/20' : 'from-white/20 to-white/40'} 
                  group-hover:from-white/60 group-hover:to-white/40 transition-colors`}
              ></div>

              {/* Connection dot with block number */}
              <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/20 border border-white/40 group-hover:bg-white/30 transition-colors">
                <div className="absolute top-full mt-1 text-xs text-white/60 whitespace-nowrap">
                  Block #{entries.length - index}
                </div>
              </div>

              {/* Entry card */}
              <div className="bg-white/5 rounded-lg overflow-hidden border border-white/10 hover:border-white/20 transition">
                {entry.image_url && (
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={entry.image_url}
                      alt={entry.description || 'Entry image'}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {entry.profile_picture_url ? (
                        <Image
                          width={800}
                          height={450}
                          src={entry.profile_picture_url}
                          alt={entry.username}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-white/10" />
                      )}
                      <span className="font-medium">{entry.username}</span>
                    </div>
                    {user && user.id !== entry.user_id && (
                      <button
                        onClick={async () => {
                          if (!user.id) return;
                          try {
                            await voteForEntry(user.id, entry.id);
                            setEntries(entries.map(e => 
                              e.id === entry.id 
                                ? { ...e, votes_count: (e.votes_count || 0) + 1 }
                                : e
                            ));
                            setVotedEntries(new Set(Array.from(votedEntries).concat(entry.id)));
                          } catch (err) {
                            console.error('Error voting:', err);
                          }
                        }}
                        disabled={votedEntries.has(entry.id)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition ${votedEntries.has(entry.id) 
                          ? 'bg-white/10 text-white/50 cursor-not-allowed' 
                          : 'bg-white/20 text-white hover:bg-white/30'}`}
                      >
                        {votedEntries.has(entry.id) ? 'Voted' : 'Vote'} 
                        {(entry.votes_count ?? 0) > 0 && ` · ${entry.votes_count}`}
                      </button>
                    )}
                  </div>
                  {entry.description && (
                    <p className="text-gray-300">{entry.description}</p>
                  )}
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading and refresh indicators */}
      <div ref={loadMoreRef} className="h-20">
        {isLoading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
      </div>
      <div className="relative h-8">
        <div className="absolute left-1/2 transform -translate-x-1/2 text-white/50 text-sm bg-[#0B0E11] px-4">
          {isRefreshing ? (
            'Checking for new entries...'
          ) : lastRefreshed ? (
            `Last updated: ${lastRefreshed.toLocaleTimeString()}`
          ) : null}
        </div>
      </div>
    </div>
  );
}
