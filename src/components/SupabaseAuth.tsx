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

          // Sign in with OTP (magic link)
          const { error: signInError } = await supabase.auth.signInWithOtp({
            email: user.email.address
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
