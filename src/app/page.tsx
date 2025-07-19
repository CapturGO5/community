"use client";

import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const LandingAnimation = dynamic(() => import('@/components/LandingAnimation'), {
  ssr: false
});

export default function Home() {
  const [showMain, setShowMain] = useState(true);
  const router = useRouter();

  const handleEnterCommunity = () => {
    setShowMain(false);
    // Wait for exit animation to complete
    setTimeout(() => {
      router.push('/community');
    }, 800);
  };

  return (
    <AnimatePresence>
      {showMain && (
        <motion.main 
          key="landing"
          className="min-h-screen bg-black"
          exit={{ opacity: 0 }}
        >
          <LandingAnimation onEnter={handleEnterCommunity} />
        </motion.main>
      )}
    </AnimatePresence>
  );
}
