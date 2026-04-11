'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 2;
      });
    }, 30);

    // Hide after ~2.2s
    const timeout = setTimeout(() => setVisible(false), 2400);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
        >
          {/* Logo / wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center gap-6"
          >
            <h1 className="font-pixel text-2xl sm:text-3xl text-primary tracking-widest">
              NextTry
            </h1>

            <p className="font-pixel text-[9px] tracking-[0.3em] text-muted-foreground uppercase">
              your next step starts here
            </p>

            {/* Pixel progress bar */}
            <div className="w-48 h-[6px] border-[2px] border-foreground/20 bg-transparent mt-2">
              <motion.div
                className="h-full bg-primary"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.03 }}
              />
            </div>

            {/* Blinking cursor */}
            <span className="font-pixel text-sm text-spektr-cyan-50 animate-blink">
              █
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
