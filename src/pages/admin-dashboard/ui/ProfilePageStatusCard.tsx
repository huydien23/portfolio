/** Status card for the public /profile page — shows the current state
 *  (Public vs Coming Soon) and provides a one-click toggle with confirm.
 *  The detailed editor (title, message, avatar, CV, …) still lives in
 *  /admin/dashboard/profile-page. */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserCircle2, Eye, EyeOff, Settings2, Loader2 } from 'lucide-react';
import { useProfilePage } from '../../../entities/profile-page/hooks';
import { updateProfilePage } from '../../../entities/profile-page/api';
import { useToast } from '../ui/Toast';
import { ConfirmDialog } from '../ui/ConfirmDialog';

export const ProfilePageStatusCard = () => {
  const { data, refetch } = useProfilePage();
  const toast = useToast();
  const navigate = useNavigate();
  const [toggling, setToggling] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isHidden = data.comingSoon.enabled;

  const handleToggle = async () => {
    setToggling(true);
    try {
      await updateProfilePage({
        comingSoon: { ...data.comingSoon, enabled: !isHidden },
      });
      toast.success(
        isHidden ? 'Đã hiện trang Profile' : 'Đã ẩn trang Profile',
        isHidden
          ? 'Visitor sẽ thấy nội dung hồ sơ thật.'
          : 'Visitor sẽ thấy màn hình Coming Soon.',
      );
      refetch();
    } catch (err) {
      toast.error('Lỗi cập nhật', err instanceof Error ? err.message : 'Unknown');
    } finally {
      setToggling(false);
      setConfirmOpen(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6 p-4 rounded-2xl border border-slate-200 dark:border-abyss-700 bg-white dark:bg-abyss-900"
    >
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-ocean-600 rounded-xl flex items-center justify-center shrink-0">
            <UserCircle2 size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              Trang hồ sơ
              <code className="font-mono text-[10px] text-slate-400 bg-slate-100 dark:bg-abyss-800 px-1.5 py-0.5 rounded">
                /profile
              </code>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${
                  isHidden
                    ? 'border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10'
                    : 'border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isHidden ? 'bg-amber-500' : 'bg-emerald-500'} ${!isHidden ? 'animate-pulse' : ''}`} />
                {isHidden ? 'Coming Soon' : 'Public'}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isHidden
                ? 'Visitor đang thấy màn hình Coming Soon thay cho nội dung hồ sơ.'
                : 'Visitor đang thấy đầy đủ nội dung hồ sơ (kinh nghiệm, chứng chỉ, CV…).'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setConfirmOpen(true)}
          disabled={toggling}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider border transition disabled:opacity-50 ${
            isHidden
              ? 'border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
              : 'border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10'
          }`}
        >
          {toggling ? (
            <Loader2 size={12} className="animate-spin" />
          ) : isHidden ? (
            <Eye size={12} />
          ) : (
            <EyeOff size={12} />
          )}
          {isHidden ? 'Hiện trang profile' : 'Ẩn thành Coming Soon'}
        </button>
        <button
          onClick={() => navigate('/admin/dashboard/profile-page')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider border border-slate-200 dark:border-abyss-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-abyss-800 transition"
        >
          <Settings2 size={12} />
          Sửa chi tiết
        </button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={isHidden ? 'Hiện trang /profile cho visitor?' : 'Ẩn trang /profile thành Coming Soon?'}
        description={
          isHidden
            ? 'Visitor sẽ thấy nội dung hồ sơ thật (kinh nghiệm, chứng chỉ, CV…). Có thể ẩn lại bất kỳ lúc nào.'
            : 'Visitor sẽ chỉ thấy màn hình Coming Soon. Nội dung hồ sơ thật vẫn được lưu và có thể khôi phục ngay.'
        }
        confirmLabel={isHidden ? 'Hiện trang' : 'Ẩn trang'}
        cancelLabel="Hủy"
        variant="primary"
        loading={toggling}
        onConfirm={handleToggle}
        onClose={() => !toggling && setConfirmOpen(false)}
      />
    </motion.div>
  );
};