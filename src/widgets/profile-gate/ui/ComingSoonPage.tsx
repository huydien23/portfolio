/** Coming-soon page for the public /profile route. Renders only the body —
 *  the global HeaderWidget (mounted by PublicLayout) already provides the
 *  brand, nav, lang/theme toggles. Unlike MaintenancePage, this page is NOT
 *  mounted standalone: ProfileGate wraps <ProfilePage/> INSIDE PublicLayout,
 *  so the global header is always present and rendering it again would
 *  double-stack it on top of the page body. */

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Hourglass, ArrowLeft, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProfilePage, DEFAULT_PROFILE_PAGE } from '../../../entities/profile-page/model';

interface ComingSoonPageProps {
  profile: ProfilePage;
}

export const ComingSoonPage = ({ profile }: ComingSoonPageProps) => {
  const { i18n } = useTranslation();

  const langCode: 'vi' | 'en' = i18n.language.startsWith('en') ? 'en' : 'vi';
  const cs = profile.comingSoon ?? DEFAULT_PROFILE_PAGE.comingSoon;
  const title = cs.title[langCode] || cs.title.vi;
  const message = cs.message[langCode] || cs.message.vi;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-abyss-950 text-slate-900 dark:text-white relative overflow-hidden flex flex-col">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 -z-0 pointer-events-none">
        <div className="absolute top-0 right-1/3 w-[600px] h-[600px] bg-ocean-400/20 dark:bg-ocean-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-sky-300/20 dark:bg-sky-400/5 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.04)_1px,transparent_1px)] bg-[size:64px_64px]"
        />
      </div>

      <main className="flex-1 flex items-center justify-center px-6 py-20 relative z-10">
        <div className="max-w-2xl w-full text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ocean-100 dark:bg-ocean-500/10 border border-ocean-300 dark:border-ocean-500/30 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ocean-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-ocean-500" />
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-ocean-700 dark:text-ocean-400">
              {langCode === 'vi' ? 'SẮP RA MẮT' : 'COMING SOON'}
            </span>
          </motion.div>

          {/* Icon */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1, type: 'spring' }}
            className="mx-auto mb-8 w-24 h-24 rounded-3xl bg-gradient-to-br from-ocean-400 to-sky-500 flex items-center justify-center shadow-2xl shadow-ocean-500/30"
          >
            <Hourglass size={42} className="text-white" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-5xl font-black tracking-tight mb-5 leading-tight"
          >
            {title}
          </motion.h1>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-slate-500 dark:text-slate-400 text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto"
          >
            {message}
          </motion.p>

          {/* Back to home */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center justify-center gap-3 flex-wrap"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-ocean-600 hover:bg-ocean-500 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-ocean-500/20 transition"
            >
              <Home size={15} /> {langCode === 'vi' ? 'Về trang chủ' : 'Back to home'}
            </Link>
            <a
              href="mailto:contact@example.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-abyss-700 text-slate-600 dark:text-slate-300 text-sm font-bold uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-abyss-800 transition"
            >
              <ArrowLeft size={15} /> {langCode === 'vi' ? 'Liên hệ' : 'Contact'}
            </a>
          </motion.div>
        </div>
      </main>
    </div>
  );
};
