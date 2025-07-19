'use client';

import { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { supabase } from '../lib/supabase';

export default function SupabaseAuth() {
  const { user } = usePrivy();

  useEffect(() => {
    async function syncUser() {
      if (user && user.email?.address) {
        try {
          // Create or update the user profile first
          await createOrUpdateUserProfile(
            user.id,
            user.email.address,
            user.email.address.split('@')[0], // Use email prefix as initial name
            null // No bio initially
          );

          // Then sign in with Supabase
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: user.email.address,
            password: user.id
          });

          if (signInError) {
            console.error('Error signing in with Supabase:', signInError);
          }
        } catch (error) {
          console.error('Error syncing user with Supabase:', error);
        }
      }
    }

    syncUser();
  }, [user]);

  return null;
}
