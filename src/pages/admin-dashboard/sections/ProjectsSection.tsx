import { useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, Search, Star, FolderOpen, Filter,
  CheckSquare, Square, X, CheckCircle2, Clock, FileEdit,
} from 'lucide-react';
import { ProjectEntity, ProjectStatus } from '../../../entities/project/model';
import {
  deleteProject, updateProject, updateProjectStatus,
  bulkUpdateStatus, bulkDeleteProjects,
} from '../../../entities/project/api';
import { useToast } from '../ui/Toast';
import { StatusToggle } from '../ui/StatusToggle';
import { ConfirmDialog } from '../ui/ConfirmDialog';

type Filter = 'all' | ProjectStatus;

interface ProjectsSectionProps {
  projects: ProjectEntity[];
  onChanged: () => void;
}

export const ProjectsSection = ({ projects, onChanged }: ProjectsSectionProps) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [deleting, setDeleting] = useState<ProjectEntity | null>(null);
  const [delLoading, setDelLoading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDelOpen, setBulkDelOpen] = useState(false);
  const [bulkDelLoading, setBulkDelLoading] = useState(false);
  const [bulkStatusLoading, setBulkStatusLoading] = useState<ProjectStatus | null>(null);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: projects.length, published: 0, coming_soon: 0, draft: 0 };
    for (const p of projects) c[p.status]++;
    return c;
  }, [projects]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects
      .filter(p => filter === 'all' ? true : p.status === filter)
      .filter(p => !q || p.title.toLowerCase().includes(q) || (p.titleEn ?? '').toLowerCase().includes(q))
      .sort((a, b) => a.order - b.order);
  }, [projects, filter, search]);

  const visibleIds = useMemo(() => filtered.map(p => p.id), [filtered]);
  const allSelected = visibleIds.length > 0 && visibleIds.every(id => selected.has(id));
  const someSelected = visibleIds.some(id => selected.has(id)) && !allSelected;

  /* ── Selection handlers ── */
  const toggle = useCallback((id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelected(prev => {
      if (allSelected) {
        // Bỏ chọn tất cả (chỉ trong filter view)
        const next = new Set(prev);
        visibleIds.forEach(id => next.delete(id));
        return next;
      }
      // Chọn tất cả visible
      const next = new Set(prev);
      visibleIds.forEach(id => next.add(id));
      return next;
    });
  }, [allSelected, visibleIds]);

  const clearSelection = useCallback(() => setSelected(new Set()), []);

  /* ── Single actions ── */
  const handleEdit = (p: ProjectEntity) => navigate(`/admin/dashboard/projects/${p.id}/edit`);
  const handleCreate = () => navigate('/admin/dashboard/projects/new');

  const handleStatusChange = async (p: ProjectEntity, next: ProjectStatus) => {
    try {
      await updateProjectStatus(p.id, next);
      toast.success(`Đã đổi trạng thái: ${p.title}`, `→ ${statusLabel(next)}`);
      onChanged();
    } catch (err) {
      toast.error('Lỗi đổi trạng thái', err instanceof Error ? err.message : 'Unknown');
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setDelLoading(true);
    try {
      await deleteProject(deleting.id);
      toast.success('Đã xóa', deleting.title);
      setDeleting(null);
      setSelected(prev => {
        const next = new Set(prev);
        next.delete(deleting.id);
        return next;
      });
      onChanged();
    } catch (err) {
      toast.error('Lỗi xóa dự án', err instanceof Error ? err.message : 'Unknown');
    } finally {
      setDelLoading(false);
    }
  };

  const handleToggleFeatured = async (p: ProjectEntity) => {
    try {
      await updateProject(p.id, { featured: !p.featured });
      toast.info(p.featured ? 'Đã bỏ Featured' : 'Đã đánh dấu Featured', p.title);
      onChanged();
    } catch (err) {
      toast.error('Lỗi', err instanceof Error ? err.message : 'Unknown');
    }
  };

  /* ── Bulk actions ── */
  const handleBulkStatus = async (status: ProjectStatus) => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    setBulkStatusLoading(status);
    try {
      await bulkUpdateStatus(ids, status);
      toast.success(
        `Đã cập nhật ${ids.length} dự án`,
        `→ ${statusLabel(status)}`,
      );
      clearSelection();
      onChanged();
    } catch (err) {
      toast.error('Lỗi bulk update', err instanceof Error ? err.message : 'Unknown');
    } finally {
      setBulkStatusLoading(null);
    }
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    setBulkDelLoading(true);
    try {
      await bulkDeleteProjects(ids);
      toast.success(`Đã xóa ${ids.length} dự án`);
      clearSelection();
      setBulkDelOpen(false);
      onChanged();
    } catch (err) {
      toast.error('Lỗi bulk delete', err instanceof Error ? err.message : 'Unknown');
    } finally {
      setBulkDelLoading(false);
    }
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 flex items-start justify-between gap-4 flex-wrap"
      >
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            Quản Lý Dự Án
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {projects.length} dự án trong cơ sở dữ liệu. Thay đổi sẽ hiển thị real-time trên portfolio.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ocean-600 hover:bg-ocean-500 text-white text-xs font-bold uppercase tracking-wider shadow-glow transition"
        >
          <Plus size={14} /> Đăng dự án mới
        </button>
      </motion.div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo tiêu đề..."
            className="form-input pl-9"
          />
        </div>
        <div className="inline-flex items-center gap-1 p-1 bg-slate-100 dark:bg-abyss-900 rounded-xl border border-slate-200 dark:border-abyss-700 self-start">
          <Filter size={12} className="text-slate-400 ml-2 mr-1" />
          {([
            { v: 'all' as Filter, label: 'Tất cả' },
            { v: 'published' as Filter, label: 'Hiển thị' },
            { v: 'coming_soon' as Filter, label: 'Coming soon' },
            { v: 'draft' as Filter, label: 'Bản nháp' },
          ]).map(o => {
            const active = filter === o.v;
            return (
              <button
                key={o.v}
                onClick={() => setFilter(o.v)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider transition ${
                  active
                    ? 'bg-white dark:bg-abyss-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {o.label} <span className="opacity-50 ml-1">{counts[o.v]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-abyss-900 border border-slate-200 dark:border-abyss-700 rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState onCreate={handleCreate} hasFilter={!!search || filter !== 'all'} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-abyss-950/50 text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-3 py-3 w-[40px]">
                    <Checkbox
                      checked={allSelected}
                      indeterminate={someSelected}
                      onChange={toggleAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-left w-[68px]">Ảnh</th>
                  <th className="px-4 py-3 text-left">Dự án</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Category</th>
                  <th className="px-4 py-3 text-left">Trạng thái</th>
                  <th className="px-4 py-3 text-left hidden lg:table-cell">Năm</th>
                  <th className="px-4 py-3 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-abyss-800">
                <AnimatePresence>
                  {filtered.map((p, idx) => {
                    const isSelected = selected.has(p.id);
                    return (
                      <motion.tr
                        key={p.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ delay: idx * 0.02 }}
                        className={`transition-colors ${
                          isSelected
                            ? 'bg-ocean-50/60 dark:bg-ocean-500/5 hover:bg-ocean-50 dark:hover:bg-ocean-500/10'
                            : 'hover:bg-slate-50/60 dark:hover:bg-abyss-950/40'
                        }`}
                      >
                        <td className="px-3 py-2.5">
                          <Checkbox
                            checked={isSelected}
                            onChange={() => toggle(p.id)}
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="w-12 h-10 rounded-md overflow-hidden bg-slate-100 dark:bg-abyss-800 border border-slate-200 dark:border-abyss-700">
                            {(p.imageData || p.imageUrl) && (
                              <img
                                src={p.imageData || p.imageUrl}
                                alt={p.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2.5 max-w-[280px]">
                          <div className="font-semibold text-slate-900 dark:text-white truncate">
                            {p.title}
                          </div>
                          <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate font-mono mt-0.5">
                            {p.id}
                          </div>
                          {p.featured && (
                            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                              <Star size={9} className="fill-amber-500 text-amber-500" /> Featured
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 hidden md:table-cell">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-300">
                            {p.category}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <StatusToggle
                            current={p.status}
                            onChange={next => handleStatusChange(p, next)}
                          />
                        </td>
                        <td className="px-4 py-2.5 hidden lg:table-cell">
                          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                            {p.year ?? '—'}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center justify-end gap-1">
                            <IconBtn
                              onClick={() => handleToggleFeatured(p)}
                              title={p.featured ? 'Bỏ Featured' : 'Đánh dấu Featured'}
                              active={p.featured}
                            >
                              <Star size={13} className={p.featured ? 'fill-amber-500 text-amber-500' : ''} />
                            </IconBtn>
                            <IconBtn onClick={() => handleEdit(p)} title="Sửa">
                              <Pencil size={13} />
                            </IconBtn>
                            <IconBtn
                              onClick={() => setDeleting(p)}
                              title="Xóa"
                              danger
                            >
                              <Trash2 size={13} />
                            </IconBtn>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── Bulk Action Bar (sticky bottom) ─── */}
      <AnimatePresence>
        {selected.size > 0 && (
          <BulkActionBar
            selectedCount={selected.size}
            totalVisible={visibleIds.length}
            loading={bulkStatusLoading}
            onStatus={handleBulkStatus}
            onDelete={() => setBulkDelOpen(true)}
            onClear={clearSelection}
          />
        )}
      </AnimatePresence>

      {/* Form Drawer (đã chuyển sang trang riêng /projects/new và /:id/edit) */}

      {/* Single delete confirm */}
      <ConfirmDialog
        open={!!deleting}
        title="Xóa dự án?"
        description={deleting ? `Dự án "${deleting.title}" sẽ bị xóa vĩnh viễn khỏi Firestore.` : ''}
        confirmLabel="Xóa vĩnh viễn"
        loading={delLoading}
        onConfirm={handleDelete}
        onClose={() => !delLoading && setDeleting(null)}
      />

      {/* Bulk delete confirm */}
      <ConfirmDialog
        open={bulkDelOpen}
        title={`Xóa ${selected.size} dự án?`}
        description={`Tất cả ${selected.size} dự án đã chọn sẽ bị xóa vĩnh viễn khỏi Firestore. Hành động này không thể hoàn tác.`}
        confirmLabel={`Xóa ${selected.size} dự án`}
        loading={bulkDelLoading}
        onConfirm={handleBulkDelete}
        onClose={() => !bulkDelLoading && setBulkDelOpen(false)}
      />
    </div>
  );
};

/* ════════════════════════════════════════════════
   Bulk Action Bar — sticky bottom
   ════════════════════════════════════════════════ */
interface BulkActionBarProps {
  selectedCount: number;
  totalVisible: number;
  loading: ProjectStatus | null;
  onStatus: (s: ProjectStatus) => void;
  onDelete: () => void;
  onClear: () => void;
}

const BulkActionBar = ({ selectedCount, totalVisible, loading, onStatus, onDelete, onClear }: BulkActionBarProps) => {
  const actions: { status: ProjectStatus; label: string; Icon: React.ComponentType<{ size?: number }>; cls: string }[] = [
    { status: 'published', label: 'Hiển thị', Icon: CheckCircle2, cls: 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30' },
    { status: 'coming_soon', label: 'Coming soon', Icon: Clock, cls: 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 border-amber-200 dark:border-amber-500/30' },
    { status: 'draft', label: 'Bản nháp', Icon: FileEdit, cls: 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-abyss-800 border-slate-200 dark:border-abyss-700' },
  ];

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ type: 'spring', damping: 26, stiffness: 320 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 pl-2 pr-2 py-2 bg-white dark:bg-abyss-900 border border-slate-200 dark:border-abyss-700 rounded-2xl shadow-2xl"
      style={{ marginLeft: '8rem' /* bù cho sidebar w-64 */ }}
    >
      {/* Selection indicator */}
      <div className="flex items-center gap-2 px-3 py-1.5 mr-1">
        <div className="w-7 h-7 rounded-lg bg-ocean-500 text-white flex items-center justify-center text-xs font-bold tabular-nums">
          {selectedCount}
        </div>
        <div className="text-xs">
          <div className="font-semibold text-slate-900 dark:text-white">đã chọn</div>
          <div className="text-[10px] text-slate-400 font-mono">/ {totalVisible} hiển thị</div>
        </div>
      </div>

      <div className="w-px h-8 bg-slate-200 dark:bg-abyss-700" />

      {/* Status actions */}
      {actions.map(a => {
        const isLoading = loading === a.status;
        return (
          <button
            key={a.status}
            onClick={() => onStatus(a.status)}
            disabled={!!loading}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border transition disabled:opacity-50 disabled:cursor-wait ${a.cls}`}
          >
            {isLoading ? (
              <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <a.Icon size={12} />
            )}
            {a.label}
          </button>
        );
      })}

      <div className="w-px h-8 bg-slate-200 dark:bg-abyss-700" />

      {/* Delete */}
      <button
        onClick={onDelete}
        disabled={!!loading}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition disabled:opacity-50"
      >
        <Trash2 size={12} />
        Xóa
      </button>

      <div className="w-px h-8 bg-slate-200 dark:bg-abyss-700" />

      {/* Clear */}
      <button
        onClick={onClear}
        className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-abyss-800 transition"
        title="Bỏ chọn"
        aria-label="Bỏ chọn"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
};

/* ════════════════════════════════════════════════
   Checkbox component (custom, không dùng browser default)
   ════════════════════════════════════════════════ */
interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
}

const Checkbox = ({ checked, indeterminate, onChange }: CheckboxProps) => (
  <button
    type="button"
    onClick={onChange}
    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition ${
      checked || indeterminate
        ? 'bg-ocean-500 border-ocean-500 text-white'
        : 'border-slate-300 dark:border-abyss-600 hover:border-ocean-400 bg-white dark:bg-abyss-900'
    }`}
    aria-checked={checked}
    role="checkbox"
  >
    {checked && <CheckSquare size={12} strokeWidth={3} />}
    {indeterminate && !checked && (
      <span className="w-2.5 h-0.5 bg-white rounded-full" />
    )}
    {!checked && !indeterminate && <Square size={12} className="text-transparent" />}
  </button>
);

interface IconBtnProps {
  onClick: () => void;
  children: React.ReactNode;
  title: string;
  danger?: boolean;
  active?: boolean;
}

const IconBtn = ({ onClick, children, title, danger, active }: IconBtnProps) => (
  <button
    onClick={onClick}
    title={title}
    className={`w-8 h-8 inline-flex items-center justify-center rounded-lg transition ${
      danger
        ? 'text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400'
        : active
          ? 'text-amber-500 bg-amber-50 dark:bg-amber-500/10'
          : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-abyss-800 hover:text-slate-900 dark:hover:text-white'
    }`}
  >
    {children}
  </button>
);

const EmptyState = ({ onCreate, hasFilter }: { onCreate: () => void; hasFilter: boolean }) => (
  <div className="p-12 text-center">
    <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-abyss-800 flex items-center justify-center text-slate-400">
      <FolderOpen size={20} />
    </div>
    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
      {hasFilter ? 'Không tìm thấy dự án nào' : 'Chưa có dự án nào'}
    </h3>
    <p className="text-xs text-slate-400 max-w-xs mx-auto mb-4">
      {hasFilter
        ? 'Thử đổi bộ lọc hoặc từ khóa khác.'
        : 'Bắt đầu bằng cách đăng dự án đầu tiên của bạn.'}
    </p>
    {!hasFilter && (
      <button
        onClick={onCreate}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ocean-600 hover:bg-ocean-500 text-white text-xs font-bold uppercase tracking-wider transition"
      >
        <Plus size={13} /> Đăng dự án mới
      </button>
    )}
  </div>
);

const statusLabel = (s: ProjectStatus) =>
  s === 'published' ? 'Đang hiển thị' : s === 'coming_soon' ? 'Sắp ra mắt' : 'Bản nháp';
