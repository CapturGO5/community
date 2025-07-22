import './globals.css'
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import SupabaseAuth from '../components/SupabaseAuth';
import Providers from './providers';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { defaultSEO } from '../utils/seo-config';

export const metadata = {
  ...defaultSEO,
  metadataBase: new URL('https://community.capturgo.com'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '555959a994057ed3'
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Providers>
          <SupabaseAuth />
          <Navigation />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
