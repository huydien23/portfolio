import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE_CONTENT } from '../../shared/config';
import { useTranslation } from 'react-i18next';

export const SkillsStack = () => {
  const { t } = useTranslation();
  const { categories } = SITE_CONTENT.skills;
  const [activeTab, setActiveTab] = useState(categories[0].id);

  const activeCategory = categories.find(c => c.id === activeTab);

  return (
    <section id="about" className="w-full py-24 bg-slate-50 dark:bg-abyss-900 relative z-10 border-y border-slate-200 dark:border-white/5 overflow-hidden isolate transition-colors duration-300">
       <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-ocean-50 via-slate-50 to-white dark:from-ocean-900/10 dark:via-abyss-900 dark:to-abyss-900 pointer-events-none"></div>

       <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center relative z-10 w-full">
          <h2 className="text-sm font-mono tracking-widest text-ocean-600 dark:text-ocean-400 uppercase mb-12 backdrop-blur-md px-4 py-2 border border-ocean-200 dark:border-ocean-900 bg-white/50 dark:bg-abyss-800/50 shadow-sm rounded-full">
            {t('common.skills_headline')}
          </h2>

          {/* Tabs - 6 tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12 p-2 bg-white/70 dark:bg-abyss-800/70 rounded-2xl backdrop-blur-md border border-slate-200 dark:border-white/5 shadow-sm">
            {categories.map((cat) => (
               <button
                 key={cat.id}
                 onClick={() => setActiveTab(cat.id)}
                 className={`relative px-4 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors duration-300 ${
                   activeTab === cat.id ? 'text-ocean-800 dark:text-ocean-300' : 'text-slate-500 dark:text-slate-400 hover:text-ocean-600 dark:hover:text-ocean-400'
                 }`}
               >
                 {activeTab === cat.id && (
                   <motion.div
                     layoutId="activeTabIndicatorLight"
                     className="absolute inset-0 bg-ocean-50 dark:bg-ocean-900/30 border border-ocean-100 dark:border-ocean-800 rounded-xl z-0 shadow-sm"
                     transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                   />
                 )}
                 <span className="relative z-10">{cat.name}</span>
               </button>
            ))}
          </div>

          {/* Skills Grid - responsive */}
          <div className="w-full max-w-6xl relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 w-full"
              >
                {activeCategory?.items.map((skill, idx) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.03, duration: 0.3 }}
                    className="flex flex-col items-center justify-center p-4 bg-white dark:bg-abyss-800 border border-slate-200 dark:border-white/5 rounded-xl shadow-sm hover:border-ocean-300 dark:hover:border-ocean-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer"
                  >
                    <div className="w-12 h-12 mb-2 flex items-center justify-center rounded-lg bg-slate-50 dark:bg-abyss-700 group-hover:bg-ocean-50 dark:group-hover:bg-ocean-900/20 transition-colors">
                      <img
                        src={skill.icon}
                        alt={skill.name}
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-ocean-600 dark:group-hover:text-ocean-400 transition-colors uppercase text-center leading-tight">
                      {skill.name}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
       </div>
    </section>
  );
};
