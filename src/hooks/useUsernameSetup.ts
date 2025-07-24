'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { createSupabaseClient } from '../lib/supabase';
import { generateUsername } from '../lib/generateUsername';

export function useUsernameSetup() {
  const { user, ready } = usePrivy();
  const [isCheckingUsername, setIsCheckingUsername] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkUsername = async () => {
      console.log('checkUsername called with:', {
        ready,
        user: user ? {
          id: user.id,
          email: user.email?.address,
        } : null
      });

      if (!ready) {
        console.log('Privy not ready yet');
        if (isMounted) setIsCheckingUsername(false);
        return;
      }

      if (!user) {
        console.log('No user logged in');
        if (isMounted) setIsCheckingUsername(false);
        return;
      }

      try {
        // Get the email from Privy
        const email = user.email?.address;
        if (!email) {
          console.error('No email found from Privy login');
          if (isMounted) setIsCheckingUsername(false);
          return;
        }

        // Create authenticated Supabase client
        const supabase = createSupabaseClient(user.id);

        // Check if user profile exists
        console.log('Checking for existing profile for:', {
          userId: user.id,
          email: email
        });

        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        console.log('Profile check result:', profile);
        
        if (!profile) {
          console.log('No profile found, creating new profile...');
          // Generate username from email (remove @ and domain)
          const baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
          const randomUsername = `${baseUsername}${Math.floor(Math.random() * 1000)}`;
          
          console.log('Generated username:', randomUsername);
          
          try {
            // Create profile with email and username
            const { data: result, error } = await supabase
              .from('user_profiles')
              .upsert({
                id: user.id,
                email: email,
                name: randomUsername
              }, {
                onConflict: 'id'
              });

            if (error) throw error;
            console.log('Profile creation result:', result);
          } catch (err) {
            console.error('Error creating profile:', err);
            throw err;
          }
        } else {
          console.log('Existing profile found:', {
            name: profile.name,
            email: profile.email
          });
        }
      } catch (error) {
        console.error('Error in username setup:', error);
      } finally {
        if (isMounted) {
          console.log('Setting isCheckingUsername to false');
          setIsCheckingUsername(false);
        }
      }
    };

    console.log('Starting username setup check...');
    checkUsername();

    return () => {
      console.log('Cleaning up username setup effect');
      isMounted = false;
    };
  }, [user, ready]);

  return { isCheckingUsername };

  return {
    isCheckingUsername
  };
}
