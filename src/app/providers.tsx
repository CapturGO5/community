'use client';

import { PrivyProvider, usePrivy } from '@privy-io/react-auth';
import { type ReactNode, useEffect, useState } from 'react';
import { createSupabaseClient } from '../lib/supabase';

function ProvidersContent({ children }: { children: ReactNode }) {
  const { user, ready } = usePrivy();
  const [isCheckingUsername, setIsCheckingUsername] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkUsername = async () => {
      if (!ready || !user) {
        if (isMounted) setIsCheckingUsername(false);
        return;
      }

      try {
        // Get the email from Privy
        const email = user.email?.address;
        if (!email) {
          if (isMounted) setIsCheckingUsername(false);
          return;
        }

        // Create authenticated Supabase client
        const supabase = createSupabaseClient(user.id);

        // Check if user profile exists
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (!profile) {
          // Generate username from email (remove @ and domain)
          const baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
          const randomUsername = `${baseUsername}${Math.floor(Math.random() * 1000)}`;
          
          // Create profile with email and username
          const { error } = await supabase
            .from('user_profiles')
            .upsert({
              id: user.id,
              email: email,
              name: randomUsername
            }, {
              onConflict: 'id'
            });

          if (error) throw error;
        }
      } catch (error) {
        console.error('Error in username setup:', error);
      } finally {
        if (isMounted) {
          setIsCheckingUsername(false);
        }
      }
    };

    checkUsername();

    return () => {
      isMounted = false;
    };
  }, [user, ready]);

  if (isCheckingUsername) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <>
      {children}
    </>
  );
}

export default function Providers({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        loginMethods: ['email'],
        appearance: {
          theme: 'dark',
          accentColor: '#ffffff',
          showWalletLoginFirst: false
        }
      }}
    >
      <ProvidersContent>{children}</ProvidersContent>
    </PrivyProvider>
  );
}
