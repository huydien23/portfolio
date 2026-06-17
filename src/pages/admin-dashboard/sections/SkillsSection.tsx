import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, GripVertical, Save, Loader2, X, Image as ImageIcon, Pencil, Check,
} from 'lucide-react';
import { useSkills } from '../../../entities/site/hooks';
import {
  setSkillCategory, deleteSkillCategory, addSkillItem, deleteSkillItem,
} from '../../../entities/site/api';
import { SkillCategory, SkillItem } from '../../../entities/site/model';
import { useToast } from '../ui/Toast';
import { ConfirmDialog } from '../ui/ConfirmDialog';

interface SkillsSectionProps {
  onChanged: () => void;
}

export const SkillsSection = ({ onChanged }: SkillsSectionProps) => {
  const { categories, loading, refetch } = useSkills();
  const toast = useToast();
  const [deleting, setDeleting] = useState<SkillCategory | null>(null);

  const handleAddCategory = async () => {
    const id = `cat-${Date.now()}`;
    try {
      await setSkillCategory({
        id,
        name: { vi: 'Mới', en: 'New' },
        order: categories.length,
        items: [],
      });
      toast.success('Đã thêm category');
      refetch();
      onChanged();
    } catch (err) {
      toast.error('Lỗi thêm category', err instanceof Error ? err.message : 'Unknown');
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleting) return;
    try {
      await deleteSkillCategory(deleting.id);
      toast.success('Đã xóa category', deleting.id);
      setDeleting(null);
      refetch();
      onChanged();
    } catch (err) {
      toast.error('Lỗi xóa', err instanceof Error ? err.message : 'Unknown');
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
            Quản Lý Kỹ Năng
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Sửa danh sách kỹ năng hiển thị ở section "Kỹ năng của tôi". Có thể thêm/xóa/reorder category và item.
          </p>
        </div>
        <button
          onClick={handleAddCategory}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ocean-600 hover:bg-ocean-500 text-white text-xs font-bold uppercase tracking-wider shadow-glow transition"
        >
          <Plus size={14} /> Thêm category
        </button>
      </motion.div>

      {loading && categories.length === 0 ? (
        <div className="py-20 text-center text-slate-400 text-sm font-mono">
          <Loader2 size={20} className="inline-block animate-spin mr-2" />
          Đang tải skills...
        </div>
      ) : categories.length === 0 ? (
        <div className="py-20 text-center text-slate-400 text-sm font-mono">
          Chưa có category nào. Bấm "Thêm category" để bắt đầu.
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat, idx) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              index={idx}
              total={categories.length}
              onChanged={() => { refetch(); onChanged(); }}
              onDelete={() => setDeleting(cat)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Xóa category?"
        description={deleting ? `Category "${deleting.id}" và toàn bộ items bên trong sẽ bị xóa vĩnh viễn.` : ''}
        confirmLabel="Xóa category"
        onConfirm={handleDeleteCategory}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
};

/* ════════════════════════════════════════════════
 * Category Card
 * ════════════════════════════════════════════════ */
interface CategoryCardProps {
  category: SkillCategory;
  index: number;
  total: number;
  onChanged: () => void;
  onDelete: () => void;
}

const CategoryCard = ({ category, index, total, onChanged, onDelete }: CategoryCardProps) => {
  const toast = useToast();
  const [nameVi, setNameVi] = useState(category.name.vi);
  const [nameEn, setNameEn] = useState(category.name.en);
  const [savingName, setSavingName] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', icon: '' });
  const [adding, setAdding] = useState(false);

  const handleSaveName = async () => {
    if (nameVi === category.name.vi && nameEn === category.name.en) return;
    setSavingName(true);
    try {
      await setSkillCategory({ ...category, name: { vi: nameVi, en: nameEn } });
      toast.success('Đã lưu tên category');
      onChanged();
    } catch (err) {
      toast.error('Lỗi lưu', err instanceof Error ? err.message : 'Unknown');
    } finally {
      setSavingName(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name.trim() || !newItem.icon.trim()) {
      toast.error('Thiếu thông tin', 'Cần nhập tên + URL icon');
      return;
    }
    setAdding(true);
    try {
      await addSkillItem(category.id, newItem);
      setNewItem({ name: '', icon: '' });
      toast.success('Đã thêm', newItem.name);
      onChanged();
    } catch (err) {
      toast.error('Lỗi thêm', err instanceof Error ? err.message : 'Unknown');
    } finally {
      setAdding(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-white dark:bg-abyss-900 border border-slate-200 dark:border-abyss-700 rounded-2xl overflow-hidden"
    >
      {/* Category header */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-abyss-700 bg-slate-50/50 dark:bg-abyss-950/30">
        <GripVertical size={16} className="text-slate-300 dark:text-slate-600" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 w-8">
          #{index + 1}
        </span>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
          <input
            value={nameVi}
            onChange={e => setNameVi(e.target.value)}
            placeholder="Tên VI"
            className="form-input text-sm"
          />
          <input
            value={nameEn}
            onChange={e => setNameEn(e.target.value)}
            placeholder="Tên EN"
            className="form-input text-sm"
          />
        </div>
        <button
          onClick={handleSaveName}
          disabled={savingName || (nameVi === category.name.vi && nameEn === category.name.en)}
          className="p-2 rounded-lg text-ocean-600 dark:text-ocean-400 hover:bg-ocean-50 dark:hover:bg-ocean-500/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
          title="Lưu tên"
        >
          {savingName ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-lg text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition"
          title="Xóa category"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Items grid */}
      <div className="p-4">
        {category.items.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-3">Chưa có item nào.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-3">
            {category.items.map(item => (
              <ItemChip
                key={item.name}
                item={item}
                onDelete={async () => {
                  try {
                    await deleteSkillItem(category.id, item.name);
                    toast.success('Đã xóa', item.name);
                    onChanged();
                  } catch (err) {
                    toast.error('Lỗi xóa', err instanceof Error ? err.message : 'Unknown');
                  }
                }}
              />
            ))}
          </div>
        )}

        {/* Add item form */}
        <div className="flex flex-col md:flex-row gap-2 pt-3 border-t border-dashed border-slate-200 dark:border-abyss-700">
          <input
            value={newItem.name}
            onChange={e => setNewItem(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Tên kỹ năng"
            className="form-input text-sm flex-1"
          />
          <input
            value={newItem.icon}
            onChange={e => setNewItem(prev => ({ ...prev, icon: e.target.value }))}
            placeholder="https://cdn.jsdelivr.net/...icon.svg"
            className="form-input text-sm flex-[2]"
          />
          <button
            onClick={handleAddItem}
            disabled={adding}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition disabled:opacity-50"
          >
            {adding ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
            Thêm
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ════════════════════════════════════════════════
 * Item Chip
 * ════════════════════════════════════════════════ */
interface ItemChipProps {
  item: SkillItem;
  onDelete: () => void;
}

const ItemChip = ({ item, onDelete }: ItemChipProps) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group flex items-center gap-2 px-2.5 py-2 bg-slate-50 dark:bg-abyss-950/50 rounded-lg border border-slate-200 dark:border-abyss-700 hover:border-ocean-300 dark:hover:border-ocean-500/30 transition">
      <div className="w-7 h-7 shrink-0 rounded-md bg-white dark:bg-abyss-800 flex items-center justify-center overflow-hidden">
        {imgError ? (
          <ImageIcon size={14} className="text-slate-300" />
        ) : (
          <img
            src={item.icon}
            alt={item.name}
            className="w-5 h-5 object-contain"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <span className="flex-1 min-w-0 truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
        {item.name}
      </span>
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate-400 hover:text-red-500 transition"
        title="Xóa"
      >
        <X size={12} />
      </button>
    </div>
  );
};
