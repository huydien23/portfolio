/** Full-screen page shown while the site is in maintenance mode. Renders the
 *  title, message, ETA, schedule, and contact email from `MaintenanceContent`.
 *  Language and theme toggles remain active (the public theming is unaffected). */

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Construction, Mail, Clock3, Calendar } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLang } from '../../../contexts/LangContext';
import { MaintenanceContent, pickMaintenanceLocale } from '../../../entities/maintenance/model';

interface MaintenancePageProps {
  profile: MaintenanceContent;
}

export const MaintenancePage = ({ profile }: MaintenancePageProps) => {
  const { i18n } = useTranslation();
  const { toggleTheme, theme } = useTheme();
  const { toggleLang, lang } = useLang();

  const langCode: 'vi' | 'en' = i18n.language.startsWith('en') ? 'en' : 'vi';
  const title = pickMaintenanceLocale(profile.title, langCode);
  const message = pickMaintenanceLocale(profile.message, langCode);
  const eta = pickMaintenanceLocale(profile.etaText, langCode);

  const scheduleText = ((): string | null => {
    const { scheduledStart, scheduledEnd } = profile;
    if (scheduledStart == null || scheduledEnd == null) return null;
    const s = new Date(scheduledStart);
    const e = new Date(scheduledEnd);
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return null;

    const pad = (n: number) => String(n).padStart(2, '0');
    const date = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    const time = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    const sameDay = s.toDateString() === e.toDateString();

    if (sameDay) {
      return `${time(s)} – ${time(e)} ${date(s)}`;
    }
    return `${time(s)} ${date(s)} – ${time(e)} ${date(e)}`;
  })();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-abyss-950 text-slate-900 dark:text-white relative overflow-hidden flex flex-col">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 -z-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-ocean-400/20 dark:bg-ocean-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-sky-300/20 dark:bg-sky-400/5 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.04)_1px,transparent_1px)] bg-[size:64px_64px]"
        />
      </div>

      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <div className="font-display text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            ĐIỀN DEV
            <span className="w-1.5 h-1.5 rounded-full bg-ocean-500 animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider border border-slate-200 dark:border-abyss-700 text-slate-500 dark:text-slate-400 hover:text-ocean-500 transition"
            >
              {lang === 'vi' ? 'EN' : 'VI'}
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-abyss-700 text-slate-500 dark:text-slate-400 hover:text-ocean-500 transition"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀' : '☾'}
            </button>
          </div>
        </div>
      </header>

      {/* Center content */}
      <main className="flex-1 flex items-center justify-center px-6 py-20 relative z-10">
        <div className="max-w-2xl w-full text-center">
          {/* Animated badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-amber-700 dark:text-amber-400">
              {langCode === 'vi' ? 'TẠM THỜI NGỪNG PHỤC VỤ' : 'TEMPORARILY UNAVAILABLE'}
            </span>
          </motion.div>

          {/* Spinner / construction icon */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 18 }}
            className="mx-auto mb-8 w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-500/30 relative"
          >
            <Construction size={42} className="text-white" strokeWidth={2.2} />
            {/* Orbiting dot */}
            <span className="absolute inset-0 rounded-3xl border-2 border-amber-400/40 animate-ping" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-5"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-xl mx-auto"
          >
            {message}
          </motion.p>

          {eta && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-abyss-900/80 border border-slate-200 dark:border-abyss-700 backdrop-blur mb-3"
            >
              <Clock3 size={14} className="text-ocean-500" />
              <span className="text-sm font-mono text-slate-600 dark:text-slate-300">{eta}</span>
            </motion.div>
          )}

          {scheduleText && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ocean-50/80 dark:bg-ocean-500/10 border border-ocean-200 dark:border-ocean-500/30 backdrop-blur mb-8"
            >
              <Calendar size={14} className="text-ocean-600 dark:text-ocean-400" />
              <span className="text-sm font-mono text-ocean-700 dark:text-ocean-300">
                {langCode === 'vi' ? 'Dự kiến: ' : 'Scheduled: '}
                <span className="font-semibold">{scheduleText}</span>
              </span>
            </motion.div>
          )}

          {profile.contactEmail && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6"
            >
              <a
                href={`mailto:${profile.contactEmail}`}
                className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-ocean-500 transition"
              >
                <Mail size={13} />
                {profile.contactEmail}
              </a>
            </motion.div>
          )}

          {/* Loading dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex items-center justify-center gap-1.5"
          >
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                className="w-2 h-2 rounded-full bg-ocean-400"
                animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 text-center text-[11px] font-mono text-slate-400 dark:text-abyss-600 uppercase tracking-widest">
        {langCode === 'vi' ? 'Đang nâng cấp · Vui lòng quay lại sau' : 'Upgrading · Please come back soon'}
      </footer>
    </div>
  );
};
