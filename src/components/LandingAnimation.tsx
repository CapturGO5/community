"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface LandingAnimationProps {
  onEnter?: () => void;
}

export default function LandingAnimation({ onEnter }: LandingAnimationProps) {
  const router = useRouter();
  const vantaRef = useRef<HTMLDivElement>(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    let vantaEffect: any;

    const loadScripts = async () => {
      try {
        // Load Three.js
        const threeScript = document.createElement('script');
        threeScript.src = '/three.r134.min.js';
        document.head.appendChild(threeScript);

        await new Promise((resolve, reject) => {
          threeScript.onload = resolve;
          threeScript.onerror = reject;
        });

        // Load Vanta.js
        const vantaScript = document.createElement('script');
        vantaScript.src = '/vanta.globe.min.js';
        document.head.appendChild(vantaScript);

        await new Promise((resolve, reject) => {
          vantaScript.onload = resolve;
          vantaScript.onerror = reject;
        });

        // Initialize Vanta effect
        if (vantaRef.current && (window as any).VANTA) {
          vantaEffect = (window as any).VANTA.GLOBE({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0xffffff,
            color2: 0xa617e6,
            backgroundColor: 0x0,
            points: 12.00,
            maxDistance: 25.00,
            spacing: 15.00
          });
          setShowContent(true);
        }
      } catch (error) {
        console.error('Error loading scripts:', error);
      }
    };

    loadScripts();

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <motion.div
        ref={vantaRef}
        className="absolute inset-0 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      {showContent && (
        <motion.div 
          className="absolute inset-0 z-10 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 1.2 }}
        >
          <motion.div
            className="flex flex-col items-center justify-center px-4 max-w-4xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <Image 
              src="/images/logo.png" 
              alt="capturGO Logo" 
              className="h-24 mb-6 object-contain"
              priority
            />
            <p className="text-xl text-gray-300 mb-12 max-w-2xl text-center">
              Join capturGO to build the biggest community-driven real-time driving direction.
            </p>
            <div className="flex gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/ecosystem')}
                className="px-8 py-4 bg-white/10 text-white/90 rounded-lg text-xl font-semibold hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-blue-500/20 border border-white/20 backdrop-blur-md relative overflow-hidden group"
                style={{
                  background: 'linear-gradient(120deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                }}
              >
                Challenges
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/leaderboard')}
                className="px-8 py-4 bg-purple-500/10 text-white/90 rounded-lg text-xl font-semibold hover:bg-purple-500/20 transition-all duration-300 shadow-lg hover:shadow-purple-500/20 border border-purple-300/20 backdrop-blur-md relative overflow-hidden group"
                style={{
                  background: 'linear-gradient(120deg, rgba(167,139,250,0.1) 0%, rgba(139,92,246,0.05) 100%)',
                  boxShadow: '0 8px 32px 0 rgba(109, 40, 217, 0.37)',
                }}
              >
                Leaderboard
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
