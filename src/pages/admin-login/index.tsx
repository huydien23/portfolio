import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Monitor, Moon, Sun } from 'lucide-react';

export const AdminLoginPage = () => {
  const { signInWithGoogle, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await signInWithGoogle();
      navigate('/admin/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed.';
      if (msg.includes('Unauthorized')) {
        setError('Tài khoản này không có quyền truy cập Admin.');
      } else if (msg.includes('popup-closed-by-user')) {
        setError('');
      } else {
        setError('Đăng nhập thất bại. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-abyss-950 flex items-center justify-center relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ocean-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-ocean-400/5 rounded-full blur-3xl" />

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2 rounded-lg bg-white/60 dark:bg-abyss-900/60 border border-slate-200 dark:border-abyss-700 text-slate-500 dark:text-slate-400 hover:text-ocean-500 transition-all"
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm mx-4"
      >
        {/* Card */}
        <div className="bg-white/80 dark:bg-abyss-900/80 backdrop-blur-xl border border-slate-200 dark:border-abyss-700 rounded-2xl p-8 shadow-soft">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-ocean-400 to-ocean-600 rounded-2xl flex items-center justify-center shadow-glow">
              <Monitor size={24} className="text-white" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display mb-2">
              Admin Portal
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Chỉ dành cho Quản trị viên được cấp quyền
            </p>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Google Login Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading || loading}
            className="group w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-white dark:bg-abyss-800 border border-slate-200 dark:border-abyss-600 text-slate-700 dark:text-slate-200 font-medium text-sm hover:border-ocean-500 hover:shadow-glow hover:text-ocean-600 dark:hover:text-ocean-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-ocean-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            {isLoading ? 'Đang xác thực...' : 'Tiếp tục với Google'}
          </button>

          {/* Separator */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-abyss-700 text-center">
            <a
              href="/"
              className="text-xs text-slate-400 dark:text-slate-500 hover:text-ocean-500 transition-colors"
            >
              ← Về trang Portfolio
            </a>
          </div>
        </div>

        {/* Subtle branding */}
        <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-4">
          Secured by Firebase Authentication
        </p>
      </motion.div>
    </div>
  );
};
