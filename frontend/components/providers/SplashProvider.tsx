'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SplashScreen } from '@/components/ui/SplashScreen';

export const SplashProvider = ({ children }: { children: React.ReactNode }) => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <SplashScreen key="splash" onComplete={handleSplashComplete} />
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
