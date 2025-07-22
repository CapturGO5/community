import './globals.css'
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import SupabaseAuth from '../components/SupabaseAuth';
import Providers from './providers';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata = {
  title: 'capturGO Community',
  description: 'Join the CapturGO community',
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
