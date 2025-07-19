import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ecosystem - Captur',
  description: 'Join the Captur ecosystem challenge and win some prizes!',
  openGraph: {
    title: 'Ecosystem - Captur',
    description: 'Join the Captur ecosystem challenge and win some prizes!',
    url: 'https://captur.art/ecosystem',
    siteName: 'Captur',
    locale: 'en_US',
    type: 'website',
  },
};

export default function EcosystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
