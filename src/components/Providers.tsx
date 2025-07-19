'use client';

import { PrivyProvider } from '@privy-io/react-auth';

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        loginMethods: ['email', 'google', 'twitter', 'wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#ffffff',
          showWalletLoginFirst: false,
          variables: {
            radius: '0.5rem',
            fontFamily: 'inherit'
          }
        },
        defaultChain: 'ethereum'
      }}
    >
      {children}
    </PrivyProvider>
  );
}
