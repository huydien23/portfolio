import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
  children?: ReactNode;
}

export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy',
  variant = 'danger',
  loading = false,
  onConfirm,
  onClose,
  children,
}: ConfirmDialogProps) => {
  const confirmCls =
    variant === 'danger'
      ? 'bg-red-600 hover:bg-red-500 text-white'
      : 'bg-ocean-600 hover:bg-ocean-500 text-white';

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[9500] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !loading && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 24, stiffness: 320 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md bg-white dark:bg-abyss-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-abyss-700 overflow-hidden"
          >
            <div className="p-6 pb-4 flex items-start gap-4">
              <div
                className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                  variant === 'danger'
                    ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                    : 'bg-ocean-50 dark:bg-ocean-500/10 text-ocean-600 dark:text-ocean-400'
                }`}
              >
                <AlertTriangle size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  {title}
                </h3>
                {description && (
                  <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {description}
                  </p>
                )}
                {children && <div className="mt-3">{children}</div>}
              </div>
              <button
                onClick={onClose}
                disabled={loading}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-abyss-800 disabled:opacity-50"
                aria-label="Đóng"
              >
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-3.5 bg-slate-50 dark:bg-abyss-950/50 border-t border-slate-200 dark:border-abyss-700 flex justify-end gap-2">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-abyss-800 disabled:opacity-50 transition"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition disabled:opacity-60 ${confirmCls}`}
              >
                {loading && (
                  <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                )}
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
