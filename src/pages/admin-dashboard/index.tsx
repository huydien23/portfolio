import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LogOut, FolderOpen, Settings, Moon, Sun, LayoutDashboard } from 'lucide-react';

const statCards = [
  { label: 'Dự án', value: '—', icon: FolderOpen, color: 'from-ocean-400 to-ocean-600' },
  { label: 'Cài đặt', value: '—', icon: Settings, color: 'from-slate-400 to-slate-600' },
];

export const AdminDashboardPage = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-abyss-950 text-slate-900 dark:text-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-abyss-900 border-r border-slate-200 dark:border-abyss-700 flex flex-col z-10">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-abyss-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-ocean-400 to-ocean-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard size={16} className="text-white" />
            </div>
            <span className="font-bold text-sm text-slate-900 dark:text-white font-display">Admin Portal</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-ocean-50 dark:bg-ocean-500/10 text-ocean-600 dark:text-ocean-400 border border-ocean-200 dark:border-ocean-500/20">
            <FolderOpen size={16} />
            Quản lý Dự án
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-abyss-800 transition-colors">
            <Settings size={16} />
            Cài đặt
          </button>
        </nav>

        {/* User info */}
        <div className="px-4 py-4 border-t border-slate-200 dark:border-abyss-700">
          <div className="flex items-center gap-3 mb-3">
            {user?.photoURL && (
              <img src={user.photoURL} alt="avatar" className="w-8 h-8 rounded-full ring-2 ring-ocean-500/20" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user?.displayName}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleTheme}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-abyss-800 border border-slate-200 dark:border-abyss-700 transition-colors"
            >
              {theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 border border-slate-200 dark:border-abyss-700 transition-colors"
            >
              <LogOut size={12} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            Xin chào, {user?.displayName?.split(' ').pop()} 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Chào mừng trở lại Admin Portal. Quản lý Portfolio của bạn tại đây.
          </p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white dark:bg-abyss-900 border border-slate-200 dark:border-abyss-700 rounded-2xl p-5"
            >
              <div className={`w-10 h-10 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center mb-3`}>
                <card.icon size={18} className="text-white" />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{card.value}</p>
              <p className="text-sm text-slate-400 mt-0.5">{card.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Coming soon placeholder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-abyss-900 border border-dashed border-slate-300 dark:border-abyss-700 rounded-2xl p-12 text-center"
        >
          <div className="w-12 h-12 bg-ocean-50 dark:bg-ocean-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FolderOpen size={20} className="text-ocean-500" />
          </div>
          <h2 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-2">Quản lý Dự án</h2>
          <p className="text-sm text-slate-400 max-w-xs mx-auto">
            Tính năng CRUD Dự án sẽ được triển khai ở đây. Bốn thao tác: Thêm, Sửa, Xóa, Hiển thị.
          </p>
        </motion.div>
      </main>
    </div>
  );
};
