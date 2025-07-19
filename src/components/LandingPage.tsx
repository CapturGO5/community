'use client';

import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const LandingAnimation = dynamic(() => import('@/components/LandingAnimation'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-pulse text-white text-xl">Loading...</div>
    </div>
  )
});

export default function LandingPage() {
  const [showMain, setShowMain] = useState(true);

  const handleEnterCommunity = () => {
    setShowMain(false);
  };

  return (
    <AnimatePresence>
      {showMain ? (
        <motion.main 
          key="landing"
          className="min-h-screen bg-black"
          exit={{ opacity: 0 }}
        >
          <LandingAnimation onEnter={handleEnterCommunity} />
        </motion.main>
      ) : (
        <motion.main
          key="community"
          className="min-h-screen bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Community content will go here */}
          <div className="flex items-center justify-center h-screen text-white text-2xl">
            Welcome to the Community
          </div>
        </motion.main>
      )}
    </AnimatePresence>
  );
}
