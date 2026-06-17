import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSiteProfile } from '../../entities/site/hooks';

interface IntroLoaderProps {
  onComplete: () => void;
}

export const IntroLoader = ({ onComplete }: IntroLoaderProps) => {
  const { t } = useTranslation();
  const { profile } = useSiteProfile();
  const [progress, setProgress] = useState(0);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 600);
          return 100;
        }
        return Math.min(p + Math.random() * 12 + 5, 100);
      });
    }, 120);

    const textTimer = setTimeout(() => setShowText(true), 400);

    return () => {
      clearInterval(interval);
      clearTimeout(textTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-900 via-slate-800 to-ocean-900 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -right-32 w-96 h-96 bg-ocean-600/30 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-sky-500/20 rounded-full blur-[80px]"
        />
      </div>

      {/* Logo */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mb-12"
      >
        <span className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-100 to-ocean-300 tracking-tighter">
          {t('common.brand_shorthand')}.
        </span>
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="absolute -top-1 -right-3 w-4 h-4 bg-orange-500 rounded-full"
        />
      </motion.div>

      {/* Progress bar */}
      <div className="relative z-10 w-72 h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
        <motion.div
          className="h-full bg-gradient-to-r from-ocean-400 via-sky-400 to-ocean-300 rounded-full"
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ type: 'spring', damping: 25, stiffness: 100 }}
        />
        {/* Glow effect */}
        <motion.div
          className="absolute top-0 right-0 w-8 h-full bg-white/50 blur-sm"
          animate={{ right: `${100 - Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Percentage */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 mt-4 text-xs font-mono text-white/40 tracking-widest"
      >
        {Math.round(Math.min(progress, 100))}%
      </motion.p>

      {/* Welcome text */}
      <AnimatePresence>
        {showText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 mt-12 text-center"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/40 text-sm font-mono tracking-widest uppercase mb-3"
            >
              {t('common.loading')}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl md:text-3xl font-light text-white/80"
            >
              <span className="text-ocean-400">~</span>{' '}
              {profile.hero.titleLine1.vi.toUpperCase()}{' '}
              {profile.hero.titleLine2.vi}{' '}
              <span className="text-ocean-400">~</span>
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-4 text-sm font-mono text-white/30"
            >
              Junior Fullstack Engineer
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
