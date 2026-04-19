import { motion } from 'framer-motion';
import { TechOrbit } from './ui/tech-orbit';
import { useLang } from '../../contexts/LangContext';

export const HeroSection = () => {
  const { t } = useLang();

  const stats = [
    { value: '2+', label: t('hero.stat_exp') },
    { value: '15+', label: t('hero.stat_projects') },
    { value: '12+', label: t('hero.stat_stack') },
  ];

  return (
    <section className="relative w-full min-h-[100dvh] bg-slate-50 dark:bg-abyss-950 overflow-hidden flex flex-col justify-center select-none pt-24 pb-16 isolate transition-colors duration-300">

      {/* Background skewed panel */}
      <div className="absolute top-0 right-[-10vw] w-[60vw] h-full bg-sky-50/50 dark:bg-ocean-900/5 skew-x-[-10deg] -z-10 border-l border-slate-200 dark:border-white/5" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-0">

        {/* Left: Text content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center gap-2 w-fit"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ocean-50 dark:bg-ocean-900/20 border border-ocean-200 dark:border-ocean-800 text-ocean-700 dark:text-ocean-300 text-xs font-mono tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-ocean-400 animate-pulse" />
              {t('common.available')}
            </span>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
            className="mb-6"
          >
            <h1 className="font-display flex flex-wrap items-center gap-[0.25em] text-5xl md:text-6xl lg:text-[4.5rem] font-bold tracking-tight text-slate-900 dark:text-white uppercase leading-normal antialiased">
              <span className="text-slate-900 dark:text-white pt-3 pb-3">{t('hero.title_first')}</span>
              <span className="text-ocean-500 pt-3 pb-3">{t('hero.title_last')}</span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-slate-600 dark:text-slate-400 text-base md:text-lg max-w-xl leading-relaxed mb-8"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="flex items-center gap-8 mb-10"
          >
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-2xl font-black text-ocean-600 dark:text-ocean-400 tracking-tight leading-none">
                  {stat.value}
                </span>
                <span className="text-xs font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
          >
            <button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative px-8 md:px-10 py-4 md:py-5 bg-ocean-600 text-white font-bold tracking-widest text-xs md:text-sm uppercase overflow-hidden rounded-xl hover:bg-ocean-500 hover:-translate-y-1 active:scale-95 transition-all shadow-md shadow-ocean-200 cursor-pointer"
            >
              <span className="relative z-10 font-mono flex gap-2 items-center">
                [ {t('hero.cta')} ]
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" className="group-hover:translate-x-1 transition-transform">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </button>
          </motion.div>
        </div>

        {/* Right: Tech Orbit */}
        <div className="w-full lg:w-1/2 flex items-center justify-center relative">
          <TechOrbit />
        </div>

      </div>
    </section>
  );
};
