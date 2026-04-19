import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ChevronsDown } from 'lucide-react';

export const ScrollProgress = () => {
  const [scrollY, setScrollY] = useState(0);
  const [showButton, setShowButton] = useState(false);

  const scrollThreshold = 0.85;

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = totalHeight > 0 ? currentScroll / totalHeight : 0;

      setScrollY(progress);
      setShowButton(currentScroll > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  const isAtThreshold = scrollY >= scrollThreshold;

  return (
    <AnimatePresence>
      {showButton && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-8 right-8 z-50"
        >
          {isAtThreshold ? (
            // Back to top button
            <button
              onClick={scrollToTop}
              className="w-12 h-12 rounded-full bg-ocean-600 hover:bg-ocean-500 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center group"
              aria-label="Cuộn lên đầu trang"
            >
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </motion.div>
            </button>
          ) : (
            // Progress percentage
            <button
              onClick={scrollToBottom}
              className="w-14 h-14 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95 flex flex-col items-center justify-center group"
              aria-label="Cuộn xuống"
            >
              <span className="text-xs font-mono font-bold text-ocean-600 dark:text-ocean-400">
                {Math.round(scrollY * 100)}%
              </span>
              <ChevronsDown className="w-4 h-4 text-slate-400 group-hover:text-ocean-500 transition-colors" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
