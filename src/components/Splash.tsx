import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function Splash({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onComplete(), 500); // Wait for the exit animation
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] bg-gray-100 flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Background decorations */}
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, duration: 0.8 }}
            className="absolute top-0 right-0 w-64 h-64 bg-[#fcd116] rounded-full mix-blend-multiply filter blur-2xl opacity-40 translate-x-1/3 -translate-y-1/3"
          />
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
            className="absolute bottom-0 left-0 w-80 h-80 bg-[#e31837] rounded-full mix-blend-multiply filter blur-2xl opacity-30 -translate-x-1/3 translate-y-1/3"
          />
          
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              delay: 0.2
            }}
            className="bg-white p-6 rounded-3xl shadow-xl z-10 border border-gray-100"
          >
            <img 
              src="https://i.imgur.com/c5XQ7TW.png" 
              alt="EAC Logo" 
              className="w-32 h-32 object-contain"
            />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-[#0f4c81] mt-8 text-3xl font-extrabold tracking-tight z-10 drop-shadow-sm"
          >
            Álbum EAC
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-gray-600 mt-2 text-sm z-10 font-medium"
          >
            Colecionando boas memórias
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
