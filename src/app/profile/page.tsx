'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import Image from 'next/image';
import { getUserProfile, updateUserProfile, createOrUpdateUserProfile, getUserEntry, deleteEntry } from '@/lib/supabase';
import type { UserProfile, Entry } from '@/lib/types';
import ConfirmationModal from '@/components/ConfirmationModal';
import { generateDefaultUsername } from '@/lib/utils';
import { CountryName } from '@/components/CountryName';

export default function Profile() {
  const { user, authenticated, ready } = usePrivy();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Profile state
  const [username, setUsername] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [country, setCountry] = useState('');

  // Debug: Log country state changes
  useEffect(() => {
    console.log('Country state changed:', { country });
  }, [country]);
  
  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const initializeProfile = useCallback(async () => {
    console.log('Initializing profile with user:', { userId: user?.id, authenticated, ready });
    if (!authenticated || !user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Get user profile and entry in parallel
      const [profile, entryData] = await Promise.all([
        getUserProfile(user.id),
        getUserEntry(user.id)
      ]);
      
      console.log('Profile data loaded:', { profile, hasCountry: !!profile?.country, country: profile?.country });
      if (profile) {
        const defaultUsername = user.email?.address ? generateDefaultUsername(user.email.address) : '';
        console.log('Setting profile state:', {
          username: profile.username || defaultUsername,
          profilePicture: profile.profile_picture_url || '',
          country: profile.country || ''
        });
        setUsername(profile.username || defaultUsername);
        setProfilePictureUrl(profile.profile_picture_url || '');
        setCountry(profile.country || '');
        console.log('Set country state to:', profile.country || '');
      }

      if (entryData) {
        setEntry(entryData);
      }
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  }, [authenticated, user]);

  useEffect(() => {
    if (ready && authenticated && user) {
      initializeProfile();
    }
  }, [ready, authenticated, user, initializeProfile]);

  const handleDelete = async () => {
    if (!user?.id || !entry?.id) return;

    try {
      await deleteEntry(user.id, entry.id);
      setEntry(null);
    } catch (err) {
      console.error('Error deleting entry:', err);
      setError('Failed to delete entry');
    }
  };

  const saveProfile = async (newUsername: string | null, newProfilePictureUrl: string, newCountry: string, closeEdit: boolean = false) => {
    console.log('Saving profile with:', { newUsername, newProfilePictureUrl, newCountry });
    if (!user?.id || !user.email?.address) return;
    // If username is null or empty, generate a default one
    const usernameToSave = newUsername || generateDefaultUsername(user.email.address);

    try {
      setIsSaving(true);
      await createOrUpdateUserProfile(user.id, user.email.address, usernameToSave, newProfilePictureUrl, newCountry);
      setUsername(usernameToSave);
      if (closeEdit) setIsEditing(false);
      // Refresh profile data to get latest values
      await initializeProfile();
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
      // Revert changes on error
      setUsername(usernameToSave);
      setProfilePictureUrl(newProfilePictureUrl);
      setCountry(newCountry);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateProfile = () => {
    saveProfile(username, profilePictureUrl, country, true);
  };

  if (!ready || !authenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="animate-pulse">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-16">
        <div className="bg-white/5 rounded-lg p-6 mb-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Profile</h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
              >
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-white/80 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40 transition"
                />
              </div>

              <div>
                <h2 className="text-lg font-medium mb-4">Choose Your Profile Picture</h2>
                <div className="flex gap-3 max-w-md">
                  {[
                    { url: '/images/green.png', color: 'green', active: true },
                    { url: '/images/purps.png', color: 'purple', active: true },
                    { url: '/images/white.png', color: 'white', active: true },
                    { url: '/images/yellow.png', color: 'yellow', active: true }
                  ].map((lens) => (
                    <button
                      key={lens.url}
                      onClick={() => {
                        setProfilePictureUrl(lens.url);
                      }}
                      disabled={isSaving}
                      className={`relative w-12 h-12 rounded-full transition-all duration-200 ${lens.url === profilePictureUrl ? 'bg-white/10 ring-2 ring-white scale-105' : 'hover:bg-white/5 hover:scale-105'} ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="relative w-full h-full">
                        <Image 
                          src={lens.url} 
                          alt="Profile picture" 
                          className="absolute inset-0 w-full h-full object-contain"
                          width={48}
                          height={48}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-white/80 mb-1">
                  Country
                </label>
                <select
                  id="country"
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                  }}
                  disabled={isSaving}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40 transition disabled:opacity-50"
                >
                  <option value="">Select a country</option>
                  <option value="au">Australia</option>
                  <option value="at">Austria</option>
                  <option value="be">Belgium</option>
                  <option value="br">Brazil</option>
                  <option value="ca">Canada</option>
                  <option value="ch">Switzerland</option>
                  <option value="cl">Chile</option>
                  <option value="co">Colombia</option>
                  <option value="cz">Czech Republic</option>
                  <option value="dk">Denmark</option>
                  <option value="eg">Egypt</option>
                  <option value="es">Spain</option>
                  <option value="fi">Finland</option>
                  <option value="gb">United Kingdom</option>
                  <option value="gr">Greece</option>
                  <option value="hu">Hungary</option>
                  <option value="id">Indonesia</option>
                  <option value="ie">Ireland</option>
                  <option value="il">Israel</option>
                  <option value="it">Italy</option>
                  <option value="mx">Mexico</option>
                  <option value="ng">Nigeria</option>
                  <option value="nl">Netherlands</option>
                  <option value="no">Norway</option>
                  <option value="nz">New Zealand</option>
                  <option value="pe">Peru</option>
                  <option value="ph">Philippines</option>
                  <option value="pl">Poland</option>
                  <option value="pt">Portugal</option>
                  <option value="ro">Romania</option>
                  <option value="ru">Russia</option>
                  <option value="sa">Saudi Arabia</option>
                  <option value="se">Sweden</option>
                  <option value="sg">Singapore</option>
                  <option value="th">Thailand</option>
                  <option value="tr">Turkey</option>
                  <option value="ua">Ukraine</option>
                  <option value="us">United States</option>
                  <option value="uy">Uruguay</option>
                  <option value="vn">Vietnam</option>
                  <option value="za">South Africa</option>
                </select>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProfile}
                  className="px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition font-medium"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-white/5 ring-2 ring-white/10">
                  <div className="relative w-full h-full">
                    <Image 
                      src={profilePictureUrl || '/avatars/Purps.svg'} 
                      alt="Selected lens" 
                      className="absolute inset-0 w-full h-full object-contain"
                      width={64}
                      height={64}
                    />
                  </div>
                </div>
                <div>
                  <h2 className="text-sm font-medium text-white/60">Username</h2>
                  <p className="text-lg font-medium">{username || 'Not set'}</p>
                </div>
              </div>

              <div>
                {(() => {
                  // Debug logging outside of JSX
                  console.log('Rendering country section:', { country, isEditing });
                  if (country) {
                    console.log('Rendering CountryName with:', { country });
                  } else {
                    console.log('Rendering Not set state');
                  }
                  return null; // Return null to satisfy ReactNode type
                })()}
                <h2 className="text-sm font-medium text-white/60">Country</h2>
                {country ? (
                  <CountryName country={country} />
                ) : (
                  <p className="text-lg text-white/60">Not set</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white/5 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Submission</h2>
            {entry && (
              <button
                onClick={() => setShowDeleteConfirmation(true)}
                className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition"
              >
                Delete Entry
              </button>
            )}
          </div>
          {entry ? (
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden">
                <Image
                  src={entry.image_url}
                  alt={entry.description || 'Entry image'}
                  className="w-full rounded-lg aspect-video object-cover"
                  width={800}
                  height={450}
                />
                {entry.description && (
                  <p className="mt-4 text-gray-300">{entry.description}</p>
                )}
                <div className="text-sm text-gray-400 mt-2">
                  {new Date(entry.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-white/70">You haven&apos;t submitted an entry for the challenge yet.</p>
              <button
                onClick={() => window.location.href = '/ecosystem'}
                className="mt-4 px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
              >
                Submit Now
              </button>
            </div>
          )}
        </div>

        {showDeleteConfirmation && (
          <ConfirmationModal
            isOpen={showDeleteConfirmation}
            onClose={() => setShowDeleteConfirmation(false)}
            onConfirm={async () => {
              await handleDelete();
              setShowDeleteConfirmation(false);
            }}
            title="Delete Entry"
            message="Are you sure you want to delete your entry? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
          />
        )}
      </div>
    </div>
  );
}
