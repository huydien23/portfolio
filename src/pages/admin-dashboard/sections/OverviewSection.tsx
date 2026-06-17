import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FolderOpen, CheckCircle2, Clock, FileEdit, Sparkles, Database,
  CloudOff, RefreshCw, Power, PowerOff,
} from 'lucide-react';
import { ProjectEntity, ProjectStatus } from '../../../entities/project/model';
import { ProjectSource } from '../../../entities/project/hooks';
import { bulkUpdateStatus } from '../../../entities/project/api';
import { useToast } from '../ui/Toast';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { ProfilePageStatusCard } from '../ui/ProfilePageStatusCard';

interface OverviewSectionProps {
  projects: ProjectEntity[];
  loading: boolean;
  source: ProjectSource;
  error: Error | null;
  onRefresh: () => void;
}

const statCardBase = 'bg-white dark:bg-abyss-900 border border-slate-200 dark:border-abyss-700 rounded-2xl p-5';

export const OverviewSection = ({
  projects,
  loading,
  source,
  error,
  onRefresh,
}: OverviewSectionProps) => {
  const toast = useToast();
  const navigate = useNavigate();
  const [globalLoading, setGlobalLoading] = useState<ProjectStatus | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    status: ProjectStatus;
    title: string;
    description: string;
  } | null>(null);

  const total = projects.length;
  const published = projects.filter(p => p.status === 'published').length;
  const comingSoon = projects.filter(p => p.status === 'coming_soon').length;
  const draft = projects.filter(p => p.status === 'draft').length;
  const featured = projects.filter(p => p.featured && p.status === 'published').length;

  const stats = [
    { label: 'Tổng dự án', value: total, Icon: FolderOpen, color: 'from-ocean-400 to-ocean-600' },
    { label: 'Đang hiển thị', value: published, Icon: CheckCircle2, color: 'from-emerald-400 to-emerald-600' },
    { label: 'Coming soon', value: comingSoon, Icon: Clock, color: 'from-amber-400 to-amber-600' },
    { label: 'Bản nháp', value: draft, Icon: FileEdit, color: 'from-slate-400 to-slate-600' },
  ];

  const executeGlobal = async (status: ProjectStatus) => {
    const ids = projects.map(p => p.id);
    if (ids.length === 0) {
      toast.info('Chưa có dự án nào');
      return;
    }
    setGlobalLoading(status);
    try {
      await bulkUpdateStatus(ids, status);
      toast.success(
        `Đã cập nhật ${ids.length} dự án`,
        `→ ${status === 'published' ? 'Hiển thị tất cả' : status === 'coming_soon' ? 'Coming soon tất cả' : 'Chuyển vào Bản nháp'}`,
      );
      onRefresh();
    } catch (err) {
      toast.error('Lỗi cập nhật toàn bộ', err instanceof Error ? err.message : 'Unknown');
    } finally {
      setGlobalLoading(null);
      setConfirmAction(null);
    }
  };

  const askGlobal = (status: ProjectStatus) => {
    if (total === 0) {
      toast.info('Chưa có dự án nào');
      return;
    }
    if (status === 'coming_soon') {
      setConfirmAction({
        status,
        title: `Đặt tất cả ${total} dự án thành Coming Soon?`,
        description: 'Toàn bộ dự án sẽ bị khóa trên portfolio (chỉ admin thấy). Dùng khi portfolio đang bảo trì hoặc chưa sẵn sàng ra mắt.',
      });
    } else if (status === 'published') {
      setConfirmAction({
        status,
        title: `Hiển thị tất cả ${total} dự án?`,
        description: 'Mọi dự án sẽ được công khai trên portfolio ngay lập tức.',
      });
    } else {
      executeGlobal(status);
    }
  };

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
          Tổng Quan
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Trạng thái portfolio và các dự án đang quản lý.
        </p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={statCardBase}
          >
            <div className={`w-10 h-10 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center mb-3`}>
              <s.Icon size={18} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
              {loading ? <span className="inline-block w-8 h-7 bg-slate-200 dark:bg-abyss-800 rounded animate-pulse" /> : s.value}
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Data source banner */}
      <div className={`mb-6 px-4 py-3 rounded-xl border text-xs font-mono flex items-center gap-2 ${
        source === 'firestore'
          ? 'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
          : source === 'cache'
            ? 'border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300'
            : 'border-sky-200 dark:border-sky-500/30 bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300'
      }`}>
        {source === 'firestore' ? <Database size={13} /> : source === 'cache' ? <CloudOff size={13} /> : <Sparkles size={13} />}
        <span>
          Nguồn dữ liệu: <b>{
            source === 'firestore' ? 'Firestore (real-time)' :
            source === 'cache' ? 'Local cache (offline)' :
            'Static (chưa có dữ liệu Firestore)'
          }</b>
        </span>
        <button
          onClick={onRefresh}
          className="ml-auto inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition"
        >
          <RefreshCw size={11} /> Tải lại
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-sm text-red-700 dark:text-red-300">
          <b>Lỗi Firestore:</b> {error.message}
          <br />
          <span className="text-xs opacity-80">Có thể do Rules hoặc mất kết nối. Kiểm tra lại và bấm &quot;Tải lại&quot;.</span>
        </div>
      )}

      {/* Quick global actions — Coming Soon / Publish All */}
      <div className="mb-6 p-4 rounded-2xl border border-slate-200 dark:border-abyss-700 bg-white dark:bg-abyss-900">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Power size={14} className="text-ocean-500" />
              Điều khiển toàn cục
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Áp dụng nhanh cho tất cả {total} dự án — dùng cho maintenance mode hoặc ra mắt hàng loạt.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => askGlobal('published')}
            disabled={!!globalLoading || total === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition disabled:opacity-50"
          >
            {globalLoading === 'published' ? (
              <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Power size={12} />
            )}
            Hiển thị tất cả
          </button>
          <button
            onClick={() => askGlobal('coming_soon')}
            disabled={!!globalLoading || total === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition disabled:opacity-50"
          >
            {globalLoading === 'coming_soon' ? (
              <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Clock size={12} />
            )}
            Coming soon tất cả
          </button>
          <button
            onClick={() => askGlobal('draft')}
            disabled={!!globalLoading || total === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider border border-slate-200 dark:border-abyss-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-abyss-800 transition disabled:opacity-50"
          >
            {globalLoading === 'draft' ? (
              <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <PowerOff size={12} />
            )}
            Ẩn tất cả (Bản nháp)
          </button>
        </div>
      </div>

      {/* Profile page visibility (page-level Coming Soon toggle) */}
      <ProfilePageStatusCard />

      {/* Quick action cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.button
          onClick={() => navigate('/admin/dashboard/projects/new')}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.99 }}
          className="group text-left p-6 rounded-2xl bg-gradient-to-br from-ocean-500 to-ocean-700 text-white shadow-glow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest opacity-80">Mới</span>
          </div>
          <h3 className="text-lg font-bold mb-1">Đăng dự án mới</h3>
          <p className="text-sm text-white/80 leading-relaxed">
            Tạo dự án mới với form đầy đủ. Hỗ trợ 2 ngôn ngữ, upload ảnh base64, video demo.
          </p>
        </motion.button>

        <motion.button
          onClick={() => navigate('/admin/dashboard/projects')}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.99 }}
          className="group text-left p-6 rounded-2xl bg-white dark:bg-abyss-900 border border-slate-200 dark:border-abyss-700 hover:border-ocean-300 dark:hover:border-ocean-500/40 transition"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-ocean-50 dark:bg-ocean-500/10 text-ocean-600 dark:text-ocean-400 rounded-xl flex items-center justify-center">
              <FolderOpen size={18} />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">{total} dự án</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Quản lý dự án</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Xem, sửa, đổi trạng thái, xóa dự án. {featured} dự án đang ở trang chủ.
          </p>
        </motion.button>
      </div>

      {/* Confirm dialog cho global action */}
      <ConfirmDialog
        open={!!confirmAction}
        title={confirmAction?.title ?? ''}
        description={confirmAction?.description}
        confirmLabel="Xác nhận"
        variant="primary"
        loading={!!globalLoading}
        onConfirm={() => confirmAction && executeGlobal(confirmAction.status)}
        onClose={() => !globalLoading && setConfirmAction(null)}
      />
    </div>
  );
};
