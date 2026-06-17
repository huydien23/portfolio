import { createContext, useCallback, useContext, useState, ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastKind = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  kind: ToastKind;
  title: string;
  description?: string;
  ttl: number;
}

interface ToastContextValue {
  push: (kind: ToastKind, title: string, description?: string) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

const ICONS: Record<ToastKind, React.ComponentType<{ size?: number; className?: string }>> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const COLORS: Record<ToastKind, string> = {
  success: 'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  error: 'border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300',
  info: 'border-sky-200 dark:border-sky-500/30 bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300',
};

let _id = 0;

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ToastItem[]>([]);

  const remove = useCallback((id: number) => {
    setItems(prev => prev.filter(t => t.id !== id));
  }, []);

  const push = useCallback((kind: ToastKind, title: string, description?: string, ttl = 3500) => {
    const id = ++_id;
    setItems(prev => [...prev, { id, kind, title, description, ttl }]);
  }, []);

  const value: ToastContextValue = {
    push,
    success: (title, description) => push('success', title, description),
    error: (title, description) => push('error', title, description, 5000),
    info: (title, description) => push('info', title, description),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div className="fixed top-4 right-4 z-[10000] flex flex-col gap-2 w-[360px] max-w-[calc(100vw-2rem)] pointer-events-none">
          <AnimatePresence>
            {items.map(t => (
              <ToastView key={t.id} item={t} onClose={() => remove(t.id)} />
            ))}
          </AnimatePresence>
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
};

interface ToastViewProps {
  item: ToastItem;
  onClose: () => void;
}

const ToastView = ({ item, onClose }: ToastViewProps) => {
  const Icon = ICONS[item.kind];

  useEffect(() => {
    const t = setTimeout(onClose, item.ttl);
    return () => clearTimeout(t);
  }, [item.ttl, onClose]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 24, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24, scale: 0.95 }}
      transition={{ type: 'spring', damping: 22, stiffness: 280 }}
      className={`pointer-events-auto flex items-start gap-3 p-3.5 pr-2 rounded-xl border shadow-soft ${COLORS[item.kind]}`}
    >
      <Icon size={18} className="mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-snug">{item.title}</p>
        {item.description && (
          <p className="text-xs opacity-80 mt-0.5 leading-snug">{item.description}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-md opacity-50 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition"
        aria-label="Đóng"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
};
