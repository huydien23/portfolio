/** Maintenance settings form — message + schedule + history. The quick
 *  on/off toggle lives in the sidebar (see AdminLayout). */

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Construction, Save, Loader2, Calendar, History, Type, FileText, Clock3, Mail,
  Power, PowerOff, AlertTriangle, Trash2,
} from 'lucide-react';
import { useMaintenance } from '../../../entities/maintenance/hooks';
import { updateMaintenance } from '../../../entities/maintenance/api';
import { LocalizedString, MaintenanceLogEntry } from '../../../entities/maintenance/model';
import { useToast } from '../ui/Toast';

interface FormDraft {
  title: LocalizedString;
  message: LocalizedString;
  etaText: LocalizedString;
  contactEmail: string;
  scheduledStart: string;  // datetime-local string (empty = unset)
  scheduledEnd: string;
}

const emptyLoc = (): LocalizedString => ({ vi: '', en: '' });

const fromProfile = (p: ReturnType<typeof useMaintenance>['profile']): FormDraft => ({
  title: { ...p.title },
  message: { ...p.message },
  etaText: p.etaText ? { ...p.etaText } : emptyLoc(),
  contactEmail: p.contactEmail ?? '',
  scheduledStart: p.scheduledStart ? toLocalInput(p.scheduledStart) : '',
  scheduledEnd: p.scheduledEnd ? toLocalInput(p.scheduledEnd) : '',
});

/** Convert ms timestamp → 'YYYY-MM-DDTHH:mm' (cho <input type="datetime-local">) */
function toLocalInput(ms: number): string {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Convert 'YYYY-MM-DDTHH:mm' → ms timestamp (giờ local) */
function fromLocalInput(s: string): number | undefined {
  if (!s) return undefined;
  const t = new Date(s).getTime();
  return Number.isFinite(t) ? t : undefined;
}

const ACTION_LABEL: Record<MaintenanceLogEntry['action'], string> = {
  on: 'Bật bảo trì',
  off: 'Tắt bảo trì',
  edit: 'Chỉnh sửa nội dung',
  scheduled: 'Đặt lịch bảo trì',
  auto_off: 'Tự động tắt (hết lịch)',
  manual: 'Thao tác thủ công',
};

const ACTION_COLOR: Record<MaintenanceLogEntry['action'], string> = {
  on: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30',
  off: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30',
  edit: 'text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-abyss-800 border-slate-200 dark:border-abyss-700',
  scheduled: 'text-ocean-600 dark:text-ocean-400 bg-ocean-50 dark:bg-ocean-500/10 border-ocean-200 dark:border-ocean-500/30',
  auto_off: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30',
  manual: 'text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-abyss-800 border-slate-200 dark:border-abyss-700',
};

const formatTimestamp = (ms: number) => {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const MaintenanceSection = () => {
  const { profile, refetch, isActive } = useMaintenance();
  const toast = useToast();
  const [draft, setDraft] = useState<FormDraft>(() => fromProfile(profile));
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const lastProfileRef = useRef(profile);

  // Re-sync the draft whenever the profile changes from upstream (Firestore).
  useEffect(() => {
    if (profile && profile !== lastProfileRef.current) {
      setDraft(fromProfile(profile));
      lastProfileRef.current = profile;
      setDirty(false);
    }
  }, [profile]);

  const updateLoc = (field: 'title' | 'message' | 'etaText', lang: 'vi' | 'en', val: string) => {
    setDraft(d => ({ ...d, [field]: { ...d[field], [lang]: val } }));
    setDirty(true);
  };

  const updateField = <K extends keyof FormDraft>(key: K, val: FormDraft[K]) => {
    setDraft(d => ({ ...d, [key]: val }));
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const scheduledStart = fromLocalInput(draft.scheduledStart);
      const scheduledEnd = fromLocalInput(draft.scheduledEnd);

      // Validate schedule
      if (scheduledStart != null && scheduledEnd != null && scheduledEnd <= scheduledStart) {
        toast.error('Lịch không hợp lệ', 'Thời điểm kết thúc phải sau thời điểm bắt đầu.');
        setSaving(false);
        return;
      }

      // Xác định action log
      const oldHasSchedule = profile.scheduledStart != null && profile.scheduledEnd != null;
      const newHasSchedule = scheduledStart != null && scheduledEnd != null;
      const isScheduleAction = !oldHasSchedule && newHasSchedule;

      await updateMaintenance(
        {
          title: draft.title,
          message: draft.message,
          etaText: (draft.etaText.vi || draft.etaText.en) ? draft.etaText : undefined,
          contactEmail: draft.contactEmail.trim() || undefined,
          scheduledStart,
          scheduledEnd,
        },
        {
          timestamp: Date.now(),
          action: isScheduleAction ? 'scheduled' : 'edit',
          note: isScheduleAction
            ? `Lên lịch: ${formatTimestamp(scheduledStart!)} → ${formatTimestamp(scheduledEnd!)}`
            : 'Cập nhật nội dung bảo trì',
        },
        profile.logs,
      );

      toast.success('Đã lưu cài đặt bảo trì');
      setDirty(false);
      refetch();
    } catch (err) {
      toast.error('Lỗi lưu', err instanceof Error ? err.message : 'Unknown');
    } finally {
      setSaving(false);
    }
  };

  const handleClearSchedule = async () => {
    // Phải lưu ngay lập tức vào DB (không chờ user bấm "Lưu thay đổi")
    // vì deleteField() cần chạy qua updateDoc. Đồng thời clear local draft
    // để UI đồng bộ.
    updateField('scheduledStart', '');
    updateField('scheduledEnd', '');
    setSaving(true);
    try {
      await updateMaintenance(
        {
          scheduledStart: undefined,
          scheduledEnd: undefined,
        },
        {
          timestamp: Date.now(),
          action: 'manual',
          note: 'Hủy lịch bảo trì tự động',
        },
        profile.logs,
      );
      toast.success('Đã hủy lịch bảo trì', 'Lịch tự động đã được xóa khỏi database.');
      refetch();
    } catch (err) {
      toast.error('Lỗi hủy lịch', err instanceof Error ? err.message : 'Unknown');
    } finally {
      setSaving(false);
    }
  };

  const handleClearLogs = async () => {
    if (profile.logs.length === 0) return;
    setSaving(true);
    try {
      await updateMaintenance(
        {},
        {
          timestamp: Date.now(),
          action: 'manual',
          note: 'Xóa lịch sử',
        },
        [], // xóa hết logs
      );
      toast.success('Đã xóa lịch sử');
      refetch();
    } catch (err) {
      toast.error('Lỗi', err instanceof Error ? err.message : 'Unknown');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
              <Construction size={22} className="text-amber-500" />
              Cài đặt bảo trì
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Sửa nội dung trang bảo trì, đặt lịch tự động, xem lịch sử thay đổi.
            </p>
          </div>
          {isActive && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-xs font-mono font-bold uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              Đang bảo trì
            </span>
          )}
        </div>
      </motion.div>

      {/* Banner hướng dẫn */}
      <div className="mb-6 px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-2">
        <AlertTriangle size={14} className="mt-0.5 shrink-0" />
        <div>
          <b>Toggle bật/tắt nhanh</b> nằm ở sidebar bên trái. Trang này chỉ để sửa nội dung
          (title, message, ETA, contact) và đặt lịch bảo trì tự động.
        </div>
      </div>

      <div className="space-y-5">
        {/* ── Nội dung ── */}
        <section className="bg-white dark:bg-abyss-900 border border-slate-200 dark:border-abyss-700 rounded-2xl overflow-hidden">
          <header className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 dark:border-abyss-800">
            <div className="w-9 h-9 rounded-lg bg-ocean-50 dark:bg-ocean-500/10 text-ocean-600 dark:text-ocean-400 flex items-center justify-center">
              <Type size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white font-display">Nội dung trang bảo trì</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Hỗ trợ song ngữ Việt / Anh</p>
            </div>
          </header>

          <div className="px-6 py-5 space-y-5">
            {/* Title */}
            <div>
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 block">
                Tiêu đề
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={draft.title.vi}
                  onChange={e => updateLoc('title', 'vi', e.target.value)}
                  placeholder="VD: Đang bảo trì"
                  className="form-input"
                />
                <input
                  type="text"
                  value={draft.title.en}
                  onChange={e => updateLoc('title', 'en', e.target.value)}
                  placeholder="e.g. Under Maintenance"
                  className="form-input"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 block">
                Mô tả chi tiết
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <textarea
                  rows={3}
                  value={draft.message.vi}
                  onChange={e => updateLoc('message', 'vi', e.target.value)}
                  placeholder="Website đang được nâng cấp…"
                  className="form-input resize-none"
                />
                <textarea
                  rows={3}
                  value={draft.message.en}
                  onChange={e => updateLoc('message', 'en', e.target.value)}
                  placeholder="The site is being upgraded…"
                  className="form-input resize-none"
                />
              </div>
            </div>

            {/* ETA + Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 block">
                  <span className="inline-flex items-center gap-1"><Clock3 size={11} /> ETA (tùy chọn)</span>
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={draft.etaText.vi}
                    onChange={e => updateLoc('etaText', 'vi', e.target.value)}
                    placeholder="Dự kiến: 18:00 hôm nay"
                    className="form-input"
                  />
                  <input
                    type="text"
                    value={draft.etaText.en}
                    onChange={e => updateLoc('etaText', 'en', e.target.value)}
                    placeholder="ETA: 6 PM today"
                    className="form-input"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 block">
                  <span className="inline-flex items-center gap-1"><Mail size={11} /> Email liên hệ (tùy chọn)</span>
                </label>
                <input
                  type="email"
                  value={draft.contactEmail}
                  onChange={e => updateField('contactEmail', e.target.value)}
                  placeholder="support@example.com"
                  className="form-input"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Lịch tự động ── */}
        <section className="bg-white dark:bg-abyss-900 border border-slate-200 dark:border-abyss-700 rounded-2xl overflow-hidden">
          <header className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 dark:border-abyss-800">
            <div className="w-9 h-9 rounded-lg bg-ocean-50 dark:bg-ocean-500/10 text-ocean-600 dark:text-ocean-400 flex items-center justify-center">
              <Calendar size={16} />
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white font-display">Lịch bảo trì tự động</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Đặt khoảng thời gian — site sẽ tự bật/tắt. Để trống cả 2 ô để hủy lịch.
              </p>
            </div>
            {(draft.scheduledStart || draft.scheduledEnd) && (
              <button
                onClick={handleClearSchedule}
                className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 hover:text-red-500 transition"
              >
                Hủy lịch
              </button>
            )}
          </header>

          <div className="px-6 py-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 block">
                  Bắt đầu
                </label>
                <input
                  type="datetime-local"
                  value={draft.scheduledStart}
                  onChange={e => updateField('scheduledStart', e.target.value)}
                  className="form-input"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 block">
                  Kết thúc
                </label>
                <input
                  type="datetime-local"
                  value={draft.scheduledEnd}
                  onChange={e => updateField('scheduledEnd', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Lịch sử ── */}
        <section className="bg-white dark:bg-abyss-900 border border-slate-200 dark:border-abyss-700 rounded-2xl overflow-hidden">
          <header className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 dark:border-abyss-800">
            <div className="w-9 h-9 rounded-lg bg-ocean-50 dark:bg-ocean-500/10 text-ocean-600 dark:text-ocean-400 flex items-center justify-center">
              <History size={16} />
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white font-display">Lịch sử</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Tối đa 20 thay đổi gần nhất</p>
            </div>
            {profile.logs.length > 0 && (
              <button
                onClick={handleClearLogs}
                disabled={saving}
                className="inline-flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 hover:text-red-500 transition disabled:opacity-50"
              >
                <Trash2 size={11} />
                Xóa hết
              </button>
            )}
          </header>

          <div className="px-6 py-5">
            {profile.logs.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6 font-mono uppercase tracking-widest">
                Chưa có lịch sử
              </p>
            ) : (
              <ul className="space-y-2">
                {profile.logs.map((log, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 px-3 py-2.5 rounded-lg border border-slate-100 dark:border-abyss-800"
                  >
                    <span
                      className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${ACTION_COLOR[log.action]}`}
                    >
                      {log.action === 'on' && <Power size={9} />}
                      {log.action === 'off' && <PowerOff size={9} />}
                      {log.action === 'edit' && <FileText size={9} />}
                      {log.action === 'scheduled' && <Calendar size={9} />}
                      {log.action === 'auto_off' && <PowerOff size={9} />}
                      {ACTION_LABEL[log.action]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-700 dark:text-slate-200">{log.note ?? '—'}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {formatTimestamp(log.timestamp)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      {/* Save bar sticky dưới */}
      <div className="sticky bottom-0 z-20 -mx-6 md:-mx-8 mt-5 px-6 md:px-8 py-3 bg-white/95 dark:bg-abyss-900/95 backdrop-blur border-t border-slate-200 dark:border-abyss-800">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            {dirty ? 'Có thay đổi chưa lưu' : 'Đã đồng bộ'}
          </span>
          <button
            onClick={handleSave}
            disabled={saving || !dirty}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-ocean-600 hover:bg-ocean-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition shadow-glow"
          >
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};
