import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { SITE_CONTENT } from '../../shared/config';
import { useTheme } from '../../contexts/ThemeContext';
import { useLang } from '../../contexts/LangContext';

export const HeaderWidget = () => {
  const location = useLocation();
  const isProfile = location.pathname === '/profile';
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const headerBase = 'fixed top-0 left-0 w-full z-50 transition-all duration-500';

  const headerBg = scrolled
    ? 'bg-white/90 dark:bg-abyss-900/90 backdrop-blur-md border-b border-slate-200/60 dark:border-white/5 shadow-sm'
    : 'bg-transparent border-b border-transparent';

  const logoColor = scrolled
    ? 'text-slate-900 dark:text-white'
    : 'text-slate-900 dark:text-white';

  const navColor = scrolled
    ? 'text-slate-600 dark:text-slate-300'
    : 'text-slate-700 dark:text-white/80';

  return (
    <>
      <header className={`${headerBase} ${headerBg}`}>
        <div className="flex justify-between items-center max-w-7xl mx-auto w-full px-6 lg:px-10 py-4">

          {/* ── Logo ── */}
          <Link
            to="/"
            className={`font-bold text-xl tracking-tighter uppercase flex items-center gap-1 cursor-pointer transition-colors duration-300 ${logoColor}`}
          >
            {t('common.brand_shorthand')}
            <span className="text-ocean-500">.</span>
            {SITE_CONTENT.brand.availability && (
              <div className="relative flex h-2 w-2 ml-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ocean-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-ocean-500" />
              </div>
            )}
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-6">
            <nav className={`flex items-center gap-2 text-xs font-mono tracking-widest uppercase transition-colors duration-300 ${navColor}`}>
              {[
                { path: '/', label: t('nav.work'), isActive: !isProfile },
                { path: '/profile', label: t('nav.profile'), isActive: isProfile }
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 transition-colors duration-300 rounded-full hover:text-ocean-600 dark:hover:text-ocean-400 ${
                    item.isActive ? 'text-ocean-600 dark:text-ocean-400 font-bold' : ''
                  }`}
                >
                  {item.isActive && (
                    <motion.div
                      layoutId="nav-active-pill"
                      className="absolute inset-0 bg-ocean-50 dark:bg-ocean-900/20 rounded-full border border-ocean-100 dark:border-ocean-800/30"
                      transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Divider */}
            <div className="w-px h-4 bg-slate-300 dark:bg-white/20" />

            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className={`text-xs font-mono tracking-widest uppercase px-2.5 py-1 rounded-md border transition-all duration-200 cursor-pointer
                ${scrolled
                  ? 'border-slate-200 dark:border-white/10 hover:border-ocean-400 hover:text-ocean-600 dark:hover:text-ocean-400 text-slate-500 dark:text-slate-400'
                  : 'border-slate-300/60 dark:border-white/20 hover:border-ocean-400 hover:text-ocean-600 dark:hover:text-ocean-400 text-slate-600 dark:text-white/70'
                }`}
              aria-label="Switch language"
              title={t('lang.switch')}
            >
              {lang === 'vi' ? 'EN' : 'VI'}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all duration-200 cursor-pointer
                ${scrolled
                  ? 'border-slate-200 dark:border-white/10 hover:border-ocean-400 hover:text-ocean-600 dark:hover:text-ocean-400 text-slate-500 dark:text-slate-400'
                  : 'border-slate-300/60 dark:border-white/20 hover:border-ocean-400 hover:text-ocean-600 dark:hover:text-ocean-400 text-slate-600 dark:text-white/70'
                }`}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === 'dark' ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun size={15} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon size={15} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* ── Mobile: action row ── */}
          <div className="flex md:hidden items-center gap-2">
            {/* Language toggle on mobile */}
            <button
              onClick={toggleLang}
              className={`text-[11px] font-mono tracking-widest uppercase px-2 py-1 rounded border transition-colors cursor-pointer
                ${scrolled || mobileOpen
                  ? 'border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400'
                  : 'border-slate-300/60 dark:border-white/20 text-slate-600 dark:text-white/70'
                }`}
            >
              {lang === 'vi' ? 'EN' : 'VI'}
            </button>

            {/* Dark mode toggle on mobile */}
            <button
              onClick={toggleTheme}
              className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors cursor-pointer
                ${scrolled || mobileOpen
                  ? 'border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400'
                  : 'border-slate-300/60 dark:border-white/20 text-slate-600 dark:text-white/70'
                }`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-colors cursor-pointer
                ${scrolled || mobileOpen
                  ? 'border-slate-200 dark:border-white/10 text-slate-700 dark:text-white'
                  : 'border-slate-300/60 dark:border-white/20 text-slate-700 dark:text-white/80'
                }`}
              aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                    <X size={18} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
                    <Menu size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Full-Screen Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-white dark:bg-abyss-950 flex flex-col items-center justify-center gap-10 md:hidden"
          >
            {/* Subtle decorative blobs */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-ocean-100/40 dark:bg-ocean-900/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-sky-100/30 dark:bg-sky-900/10 rounded-full blur-[80px] pointer-events-none" />

            <nav className="relative z-10 flex flex-col items-center gap-8">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className={`text-4xl font-black tracking-tighter uppercase transition-colors ${
                  !isProfile
                    ? 'text-ocean-600 dark:text-ocean-400'
                    : 'text-slate-800 dark:text-white hover:text-ocean-600 dark:hover:text-ocean-400'
                }`}
              >
                {t('nav.work')}
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className={`text-4xl font-black tracking-tighter uppercase transition-colors ${
                  isProfile
                    ? 'text-ocean-600 dark:text-ocean-400'
                    : 'text-slate-800 dark:text-white hover:text-ocean-600 dark:hover:text-ocean-400'
                }`}
              >
                {t('nav.profile')}
              </Link>
            </nav>

            {/* Brand tag */}
            <div className="relative z-10 flex items-center gap-3 text-xs font-mono text-slate-400 dark:text-white/30 tracking-widest">
              <span className="w-8 h-px bg-slate-200 dark:bg-white/10" />
              {t('common.brand_shorthand')}
              <span className="text-ocean-500">.</span>
              <span className="w-8 h-px bg-slate-200 dark:bg-white/10" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
