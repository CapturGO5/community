'use client';

import { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { supabase } from '../lib/supabaseClient';
import { createOrUpdateUserProfile } from '../lib/supabase';

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
            user.email.address.split('@')[0] // Use email prefix as initial name
          );

          // No need to sign in with Supabase - we're only using it as a data store
        } catch (error) {
          console.error('Error syncing user with Supabase:', error);
        }
      }
    }

    syncUser();
  }, [user]);

  return null;
}
