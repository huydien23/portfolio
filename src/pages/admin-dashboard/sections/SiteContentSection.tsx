import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, Loader2, Image as ImageIcon, Check,
  Sparkles, Type, Tag, Hash, Link as LinkIcon, Mail, Phone, FileText, Globe,
  X as XIcon, Upload,
} from 'lucide-react';
import { useSiteProfile } from '../../../entities/site/hooks';
import { updateSiteProfile } from '../../../entities/site/api';
import { compressImage, validateImageData, formatBytes } from '../../../entities/site/image';
import { SiteProfile, HeroContent, BrandContent, ContactContent, AboutContent, StatItem } from '../../../entities/site/model';
import { useToast } from '../ui/Toast';

type Tab = 'hero' | 'brand' | 'contact' | 'about';

interface SiteContentSectionProps {
  onChanged: () => void;
}

export const SiteContentSection = ({ onChanged }: SiteContentSectionProps) => {
  const { profile, loading, refetch } = useSiteProfile();
  const toast = useToast();
  const [tab, setTab] = useState<Tab>('hero');
  const [draft, setDraft] = useState<SiteProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const lastProfileRef = useRef<SiteProfile | null>(null);

  // Đồng bộ draft khi profile load xong / reload
  useEffect(() => {
    if (profile && profile !== lastProfileRef.current) {
      setDraft(structuredClone(profile));
      lastProfileRef.current = profile;
      setDirty(false);
    }
  }, [profile]);

  if (loading || !draft) {
    return (
      <div className="py-20 text-center text-slate-400 text-sm font-mono">
        <Loader2 size={20} className="inline-block animate-spin mr-2" />
        Đang tải nội dung...
      </div>
    );
  }

  const update = (patch: Partial<SiteProfile>) => {
    setDraft(prev => prev ? { ...prev, ...patch } : prev);
    setDirty(true);
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const { id: _id, updatedAt: _u, ...rest } = draft;
      void _id;
      void _u;
      await updateSiteProfile(rest);
      toast.success('Đã lưu nội dung trang', 'Thay đổi hiển thị real-time trên portfolio');
      setDirty(false);
      onChanged();
      refetch();
    } catch (err) {
      toast.error('Lỗi lưu', err instanceof Error ? err.message : 'Unknown');
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    if (!profile) return;
    setDraft(structuredClone(profile));
    setDirty(false);
    toast.info('Đã hủy thay đổi');
  };

  const TABS: { id: Tab; label: string; Icon: React.ComponentType<{ size?: number }> }[] = [
    { id: 'hero', label: 'Hero', Icon: Sparkles },
    { id: 'brand', label: 'Brand', Icon: Tag },
    { id: 'contact', label: 'Contact', Icon: Phone },
    { id: 'about', label: 'About', Icon: FileText },
  ];

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
            Nội Dung Trang
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Sửa các thông tin tĩnh trên portfolio: Hero, Brand, Contact, About. Thay đổi cập nhật real-time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {dirty && (
            <button
              onClick={handleDiscard}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border border-slate-200 dark:border-abyss-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-abyss-800 transition disabled:opacity-50"
            >
              Hủy
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !dirty}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ocean-600 hover:bg-ocean-500 text-white text-xs font-bold uppercase tracking-wider shadow-glow transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="inline-flex items-center gap-1 p-1 bg-slate-100 dark:bg-abyss-900 rounded-xl border border-slate-200 dark:border-abyss-700 mb-4">
        {TABS.map(t => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider transition ${
                active
                  ? 'bg-white dark:bg-abyss-800 text-ocean-600 dark:text-ocean-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <t.Icon size={12} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-abyss-900 border border-slate-200 dark:border-abyss-700 rounded-2xl p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {tab === 'hero' && <HeroTab draft={draft} onChange={update} />}
            {tab === 'brand' && <BrandTab draft={draft} onChange={update} />}
            {tab === 'contact' && <ContactTab draft={draft} onChange={update} />}
            {tab === 'about' && <AboutTab draft={draft} onChange={update} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════
 * Reusable: LocalizedInput (VI + EN)
 * ════════════════════════════════════════════════ */
interface LocalizedInputProps {
  label: string;
  value: { vi: string; en: string };
  onChange: (next: { vi: string; en: string }) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
}

const LocalizedInput = ({ label, value, onChange, placeholder, multiline, rows = 3 }: LocalizedInputProps) => {
  const InputTag = multiline ? 'textarea' : 'input';
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
        <Type size={11} /> {label}
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="relative">
          <span className="absolute top-2 left-2 text-[9px] font-mono font-bold text-ocean-500 bg-ocean-50 dark:bg-ocean-500/10 px-1.5 py-0.5 rounded">VI</span>
          <InputTag
            value={value.vi}
            onChange={e => onChange({ ...value, vi: e.target.value })}
            placeholder={placeholder}
            rows={multiline ? rows : undefined}
            className="form-input pl-12"
          />
        </div>
        <div className="relative">
          <span className="absolute top-2 left-2 text-[9px] font-mono font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">EN</span>
          <InputTag
            value={value.en}
            onChange={e => onChange({ ...value, en: e.target.value })}
            placeholder={placeholder}
            rows={multiline ? rows : undefined}
            className="form-input pl-12"
          />
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════
 * Tab: Hero
 * ════════════════════════════════════════════════ */
interface HeroTabProps {
  draft: SiteProfile;
  onChange: (patch: Partial<SiteProfile>) => void;
}

const HeroTab = ({ draft, onChange }: HeroTabProps) => {
  const hero = draft.hero;
  const setHero = (patch: Partial<HeroContent>) => onChange({ hero: { ...hero, ...patch } });

  const updateStat = (idx: number, patch: Partial<StatItem>) => {
    const next = hero.stats.map((s, i) => (i === idx ? { ...s, ...patch } : s));
    setHero({ stats: next });
  };

  return (
    <div className="space-y-5">
      <LocalizedInput
        label="Tiêu đề dòng 1"
        value={hero.titleLine1}
        onChange={v => setHero({ titleLine1: v })}
        placeholder="HUY"
      />
      <LocalizedInput
        label="Tiêu đề dòng 2"
        value={hero.titleLine2}
        onChange={v => setHero({ titleLine2: v })}
        placeholder="ĐIỀN."
      />
      <LocalizedInput
        label="Mô tả ngắn"
        value={hero.subtitle}
        onChange={v => setHero({ subtitle: v })}
        placeholder="Chào bạn, tôi là..."
        multiline
        rows={3}
      />
      <LocalizedInput
        label="Nút CTA"
        value={hero.ctaText}
        onChange={v => setHero({ ctaText: v })}
        placeholder="Khám Phá Dự Án"
      />

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={hero.available}
          onChange={e => setHero({ available: e.target.checked })}
          className="w-4 h-4 rounded border-slate-300 text-ocean-600 focus:ring-ocean-500"
        />
        <span className="text-sm text-slate-700 dark:text-slate-300">Hiện badge "Sẵn sàng nhận việc"</span>
      </label>

      <div className="pt-3 border-t border-slate-200 dark:border-abyss-700">
        <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-3">
          <Hash size={11} /> Thống kê (3 số)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {hero.stats.map((s, idx) => (
            <div key={s.key || idx} className="bg-slate-50 dark:bg-abyss-950/50 rounded-xl p-3 border border-slate-200 dark:border-abyss-700 space-y-2">
              <input
                value={s.value}
                onChange={e => updateStat(idx, { value: e.target.value })}
                placeholder="2+"
                className="form-input text-center font-bold text-lg"
              />
              <input
                value={s.label.vi}
                onChange={e => updateStat(idx, { label: { ...s.label, vi: e.target.value } })}
                placeholder="Nhãn VI"
                className="form-input text-xs"
              />
              <input
                value={s.label.en}
                onChange={e => updateStat(idx, { label: { ...s.label, en: e.target.value } })}
                placeholder="Nhãn EN"
                className="form-input text-xs"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════
 * Tab: Brand
 * ════════════════════════════════════════════════ */
interface BrandTabProps {
  draft: SiteProfile;
  onChange: (patch: Partial<SiteProfile>) => void;
}

const BrandTab = ({ draft, onChange }: BrandTabProps) => {
  const toast = useToast();
  const brand = draft.brand;
  const setBrand = (patch: Partial<BrandContent>) => onChange({ brand: { ...brand, ...patch } });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await compressImage(file);
      const valid = validateImageData(result.dataUrl);
      if (!valid.ok) {
        toast.error('Upload thất bại', valid.reason);
        return;
      }
      setBrand({ logoData: result.dataUrl });
      toast.success('Logo đã upload', `${formatBytes(result.compressedSize)} • ${result.width}×${result.height}`);
    } catch (err) {
      toast.error('Lỗi upload', err instanceof Error ? err.message : 'Unknown');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Tag size={11} /> Tên thương hiệu (header/footer)
        </label>
        <input
          value={brand.shorthand}
          onChange={e => setBrand({ shorthand: e.target.value })}
          placeholder="Điền Dev"
          className="form-input"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <ImageIcon size={11} /> Logo (tùy chọn)
        </label>
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 dark:border-abyss-700 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-abyss-950">
            {brand.logoData ? (
              <img src={brand.logoData} alt="logo" className="w-full h-full object-contain" />
            ) : (
              <ImageIcon size={20} className="text-slate-300" />
            )}
          </div>
          <div className="flex-1 space-y-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload ảnh — tự nén xuống dưới 800KB. Nếu rỗng sẽ dùng tên thương hiệu.
            </p>
            <div className="flex gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider border border-slate-200 dark:border-abyss-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-abyss-800 transition disabled:opacity-50"
              >
                {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                {uploading ? 'Đang nén...' : 'Upload'}
              </button>
              {brand.logoData && (
                <button
                  type="button"
                  onClick={() => setBrand({ logoData: null })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                >
                  <XIcon size={12} /> Xóa logo
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={brand.availability}
          onChange={e => setBrand({ availability: e.target.checked })}
          className="w-4 h-4 rounded border-slate-300 text-ocean-600 focus:ring-ocean-500"
        />
        <span className="text-sm text-slate-700 dark:text-slate-300">Hiện chấm xanh "available" cạnh logo</span>
      </label>
    </div>
  );
};

/* ════════════════════════════════════════════════
 * Tab: Contact
 * ════════════════════════════════════════════════ */
interface ContactTabProps {
  draft: SiteProfile;
  onChange: (patch: Partial<SiteProfile>) => void;
}

const ContactTab = ({ draft, onChange }: ContactTabProps) => {
  const contact = draft.contact;
  const setContact = (patch: Partial<ContactContent>) => onChange({ contact: { ...contact, ...patch } });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Phone size={11} /> Số điện thoại
          </label>
          <input
            value={contact.phone}
            onChange={e => setContact({ phone: e.target.value })}
            placeholder="0945.700813"
            className="form-input"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Mail size={11} /> Email
          </label>
          <input
            type="email"
            value={contact.email}
            onChange={e => setContact({ email: e.target.value })}
            placeholder="you@example.com"
            className="form-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <LinkIcon size={11} /> Zalo
          </label>
          <input value={contact.zalo} onChange={e => setContact({ zalo: e.target.value })} className="form-input" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <LinkIcon size={11} /> Facebook
          </label>
          <input value={contact.facebook} onChange={e => setContact({ facebook: e.target.value })} className="form-input" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <LinkIcon size={11} /> LinkedIn
          </label>
          <input value={contact.linkedin} onChange={e => setContact({ linkedin: e.target.value })} className="form-input" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Globe size={11} /> GitHub
          </label>
          <input value={contact.github} onChange={e => setContact({ github: e.target.value })} className="form-input" />
        </div>
      </div>

      <div className="pt-3 border-t border-slate-200 dark:border-abyss-700 space-y-4">
        <LocalizedInput
          label="Nhãn giờ làm việc"
          value={contact.hoursLabel}
          onChange={v => setContact({ hoursLabel: v })}
          placeholder="Giờ làm việc"
        />
        <LocalizedInput
          label="Giờ làm việc"
          value={contact.hoursValue}
          onChange={v => setContact({ hoursValue: v })}
          placeholder="T2 - T7: 8:00 - 18:00"
        />
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════
 * Tab: About
 * ════════════════════════════════════════════════ */
interface AboutTabProps {
  draft: SiteProfile;
  onChange: (patch: Partial<SiteProfile>) => void;
}

const AboutTab = ({ draft, onChange }: AboutTabProps) => {
  const about = draft.about;
  const setAbout = (patch: Partial<AboutContent>) => onChange({ about: { ...about, ...patch } });

  return (
    <div className="space-y-5">
      <LocalizedInput
        label="Tiêu đề About"
        value={about.headline}
        onChange={v => setAbout({ headline: v })}
        placeholder="Giới thiệu"
      />
      <LocalizedInput
        label="Nội dung About"
        value={about.body}
        onChange={v => setAbout({ body: v })}
        placeholder="Đam mê lập trình..."
        multiline
        rows={6}
      />
    </div>
  );
};
