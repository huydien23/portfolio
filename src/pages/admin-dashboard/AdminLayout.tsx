/**
 * AdminLayout — sidebar (collapsible, persisted to localStorage), toast
 * provider, and a quick maintenance-mode toggle with a live "site is down"
 * badge. Wraps the admin route subtree.
 */

import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut, FolderOpen, PlusCircle, LayoutDashboard, Moon, Sun, RefreshCw,
  Settings, Code2, ChevronLeft, ChevronRight, Construction, AlertTriangle, Wrench, UserCircle,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useProjects } from '../../entities/project/hooks';
import { useMaintenance } from '../../entities/maintenance/hooks';
import { updateMaintenance } from '../../entities/maintenance/api';
import { ToastProvider, useToast } from './ui/Toast';
import { ConfirmDialog } from './ui/ConfirmDialog';

type NavItem = {
  to: string;
  label: string;
  Icon: React.ComponentType<{ size?: number }>;
  end?: boolean;
};

const NAV: NavItem[] = [
  { to: '/admin/dashboard', label: 'Tổng Quan', Icon: LayoutDashboard, end: true },
  { to: '/admin/dashboard/projects', label: 'Quản Lý Dự Án', Icon: FolderOpen, end: true },
  { to: '/admin/dashboard/projects/new', label: 'Đăng Dự Án Mới', Icon: PlusCircle },
  { to: '/admin/dashboard/site', label: 'Nội Dung Trang', Icon: Settings },
  { to: '/admin/dashboard/profile-page', label: 'Trang Hồ Sơ', Icon: UserCircle },
  { to: '/admin/dashboard/skills', label: 'Quản Lý Skills', Icon: Code2 },
  { to: '/admin/dashboard/maintenance', label: 'Cài Đặt Bảo Trì', Icon: Wrench },
];

const SIDEBAR_KEY = 'admin:sidebar-collapsed';
const SIDEBAR_WIDTH_OPEN = 'w-64';
const SIDEBAR_WIDTH_COLLAPSED = 'w-16';
const MAIN_MARGIN_OPEN = 'ml-64';
const MAIN_MARGIN_COLLAPSED = 'ml-16';

const SidebarInner = ({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { refetch } = useProjects();
  const { profile, rawEnabled, isActive } = useMaintenance();
  const toast = useToast();
  const [confirmMaint, setConfirmMaint] = useState(false);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };

  const handleMaintenanceToggle = async () => {
    setMaintenanceLoading(true);
    try {
      await updateMaintenance(
        { enabled: !rawEnabled },
        {
          timestamp: Date.now(),
          action: !rawEnabled ? 'on' : 'off',
          note: !rawEnabled ? 'Bật thủ công từ sidebar' : 'Tắt thủ công từ sidebar',
        },
        profile.logs,
      );
      toast.success(
        !rawEnabled ? 'Đã bật chế độ bảo trì' : 'Đã tắt chế độ bảo trì',
        !rawEnabled
          ? 'Public site sẽ hiển thị trang bảo trì ngay.'
          : 'Public site đã trở lại bình thường.',
      );
    } catch (err) {
      toast.error('Lỗi', err instanceof Error ? err.message : 'Unknown');
    } finally {
      setMaintenanceLoading(false);
      setConfirmMaint(false);
    }
  };

  return (
    <>
      <aside
        className={`fixed left-0 top-0 h-full ${collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_OPEN} bg-white dark:bg-abyss-900 border-r border-slate-200 dark:border-abyss-700 flex flex-col z-10 transition-[width] duration-300 ease-in-out`}
      >
        {/* Badge bảo trì — chỉ hiện khi đang active */}
        <AnimatePresence>
          {isActive && !collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-red-500 text-white"
            >
              <div className="px-4 py-2 flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
                Site đang bảo trì
              </div>
            </motion.div>
          )}
          {isActive && collapsed && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden bg-red-500"
            >
              <div className="h-1" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logo + nút toggle */}
        <div className={`flex items-center border-b border-slate-200 dark:border-abyss-700 ${collapsed ? 'justify-center px-2 py-5' : 'justify-between px-6 py-5'}`}>
          {!collapsed && (
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 bg-gradient-to-br from-ocean-400 to-ocean-600 rounded-lg flex items-center justify-center shrink-0">
                <LayoutDashboard size={16} className="text-white" />
              </div>
              <span className="font-bold text-sm text-slate-900 dark:text-white font-display truncate">Admin Portal</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-gradient-to-br from-ocean-400 to-ocean-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard size={16} className="text-white" />
            </div>
          )}
          {!collapsed && (
            <button
              onClick={onToggle}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-abyss-800 transition shrink-0"
              title="Thu gọn"
              aria-label="Thu gọn sidebar"
            >
              <ChevronLeft size={14} />
            </button>
          )}
        </div>

        {/* Nút mở rộng khi collapsed */}
        {collapsed && (
          <button
            onClick={onToggle}
            className="mx-2 mt-2 p-1.5 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-abyss-800 transition flex items-center justify-center"
            title="Mở rộng"
            aria-label="Mở rộng sidebar"
          >
            <ChevronRight size={14} />
          </button>
        )}

        {/* Nav */}
        <nav className={`flex-1 ${collapsed ? 'px-2 py-2' : 'px-3 py-4'} space-y-1`}>
          {NAV.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              title={collapsed ? n.label : undefined}
              className={({ isActive }) =>
                `relative w-full flex items-center ${collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5'} rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-ocean-50 dark:bg-ocean-500/10 text-ocean-600 dark:text-ocean-400 border border-ocean-200 dark:border-ocean-500/20'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-abyss-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <n.Icon size={collapsed ? 18 : 16} className="shrink-0" />
                  {!collapsed && <span className="truncate">{n.label}</span>}
                  {isActive && (
                    <motion.div
                      layoutId="admin-active-pill"
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}

          <div className="pt-3 mt-3 border-t border-slate-200 dark:border-abyss-700 space-y-1">
            {/* Toggle bảo trì nhanh */}
            <button
              onClick={() => setConfirmMaint(true)}
              disabled={maintenanceLoading}
              title={collapsed ? (isActive ? 'Đang bảo trì — bấm để tắt' : 'Bật bảo trì') : undefined}
              className={`relative w-full flex items-center ${collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5'} rounded-xl text-sm font-medium transition-colors disabled:opacity-50 ${
                rawEnabled || isActive
                  ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-abyss-800'
              }`}
            >
              {isActive ? <AlertTriangle size={collapsed ? 18 : 16} className="shrink-0" /> : <Construction size={collapsed ? 18 : 16} className="shrink-0" />}
              {!collapsed && <span>{rawEnabled ? 'ĐANG BẢO TRÌ' : 'Bảo trì'}</span>}
              {rawEnabled && !collapsed && (
                <span className="ml-auto text-[9px] font-mono font-bold uppercase bg-red-500 text-white px-1.5 py-0.5 rounded">ON</span>
              )}
              {rawEnabled && collapsed && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
              )}
            </button>

            <button
              onClick={refetch}
              title={collapsed ? 'Tải lại dữ liệu' : undefined}
              className={`w-full flex items-center ${collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5'} rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-abyss-800 transition-colors`}
            >
              <RefreshCw size={collapsed ? 18 : 16} className="shrink-0" />
              {!collapsed && <span>Tải lại dữ liệu</span>}
            </button>
          </div>
        </nav>

        {/* User info */}
        <div className={`${collapsed ? 'px-2 py-3' : 'px-4 py-4'} border-t border-slate-200 dark:border-abyss-700`}>
          {!collapsed ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                {user?.photoURL && (
                  <img src={user.photoURL} alt="avatar" className="w-8 h-8 rounded-full ring-2 ring-ocean-500/20 shrink-0" />
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
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              {user?.photoURL && (
                <img src={user.photoURL} alt="avatar" className="w-8 h-8 rounded-full ring-2 ring-ocean-500/20" title={user.email} />
              )}
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-abyss-800 border border-slate-200 dark:border-abyss-700 transition-colors"
                title="Theme"
              >
                {theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
              </button>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 border border-slate-200 dark:border-abyss-700 transition-colors"
                title="Logout"
              >
                <LogOut size={12} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Confirm toggle bảo trì */}
      <ConfirmDialog
        open={confirmMaint}
        title={rawEnabled ? 'Tắt chế độ bảo trì?' : 'Bật chế độ bảo trì?'}
        description={
          rawEnabled
            ? 'Public site sẽ hiển thị bình thường trở lại ngay lập tức.'
            : 'Public site sẽ bị khóa và chỉ hiển thị trang "Đang bảo trì". Bạn vẫn có thể truy cập admin bình thường.'
        }
        confirmLabel={rawEnabled ? 'Tắt bảo trì' : 'Bật bảo trì'}
        variant={rawEnabled ? 'primary' : 'danger'}
        loading={maintenanceLoading}
        onConfirm={handleMaintenanceToggle}
        onClose={() => !maintenanceLoading && setConfirmMaint(false)}
      />
    </>
  );
};

const AdminLayoutInner = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SIDEBAR_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_KEY, String(collapsed));
    } catch {
      /* quota */
    }
  }, [collapsed]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-abyss-950 text-slate-900 dark:text-white">
      <SidebarInner collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <main className={`${collapsed ? MAIN_MARGIN_COLLAPSED : MAIN_MARGIN_OPEN} p-6 md:p-8 min-h-screen transition-[margin] duration-300 ease-in-out`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export const AdminLayout = () => (
  <ToastProvider>
    <AdminLayoutInner />
  </ToastProvider>
);
