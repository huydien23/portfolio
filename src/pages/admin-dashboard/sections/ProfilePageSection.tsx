/** Admin section for the public /profile page. Five tabs:
 *  Coming Soon (toggle + title/message), Identity (avatar + CV URL),
 *  Experiences, Certifications, English certs. Each tab persists
 *  independently via `updateProfilePage` partials.
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Hourglass, Image as ImageIcon, Briefcase, Award, Languages } from 'lucide-react';
import { useProfilePage } from '../../../entities/profile-page/hooks';
import { ProfilePage } from '../../../entities/profile-page/model';
import { useToast } from '../ui/Toast';
import { ComingSoonTab } from './profile/ComingSoonTab';
import { IdentityTab } from './profile/IdentityTab';
import { ExperiencesTab } from './profile/ExperiencesTab';
import { CertificationsTab } from './profile/CertificationsTab';
import { EnglishCertsTab } from './profile/EnglishCertsTab';

type Tab = 'comingSoon' | 'identity' | 'experiences' | 'certifications' | 'englishCerts';

const TABS: { id: Tab; label: string; Icon: React.ComponentType<{ size?: number }> }[] = [
  { id: 'comingSoon', label: 'Coming Soon', Icon: Hourglass },
  { id: 'identity', label: 'Avatar & CV', Icon: ImageIcon },
  { id: 'experiences', label: 'Kinh Nghiệm', Icon: Briefcase },
  { id: 'certifications', label: 'Chứng Chỉ', Icon: Award },
  { id: 'englishCerts', label: 'Ngoại Ngữ', Icon: Languages },
];

export const ProfilePageSection = () => {
  const { data, loading, refetch } = useProfilePage();
  const toast = useToast();
  const [tab, setTab] = useState<Tab>('comingSoon');
  const [draft, setDraft] = useState<ProfilePage | null>(null);
  const lastDataRef = useRef<ProfilePage | null>(null);

  useEffect(() => {
    if (data && data !== lastDataRef.current) {
      setDraft(structuredClone(data));
      lastDataRef.current = data;
    }
  }, [data]);

  if (loading || !draft) {
    return (
      <div className="py-20 text-center text-slate-400 text-sm font-mono">
        <Loader2 size={20} className="inline-block animate-spin mr-2" />
        Đang tải nội dung trang profile...
      </div>
    );
  }

  const update = (patch: Partial<ProfilePage>) => {
    setDraft(prev => (prev ? { ...prev, ...patch } : prev));
  };

  const handleSaved = () => {
    refetch();
  };

  return (
    <div className="pb-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
          Quản Lý Trang Hồ Sơ
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Sửa nội dung hiển thị ở <code className="font-mono font-bold text-ocean-600">/profile</code>: avatar, CV, kinh nghiệm, chứng chỉ, ngoại ngữ. Có thể bật <b>Coming Soon</b> để ẩn trang tạm thời.
        </p>
      </motion.div>

      <div className="inline-flex items-center gap-1 p-1 bg-slate-100 dark:bg-abyss-900 rounded-xl border border-slate-200 dark:border-abyss-700 mb-4 flex-wrap">
        {TABS.map(t => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider transition ${
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

      <div className="bg-white dark:bg-abyss-900 border border-slate-200 dark:border-abyss-700 rounded-2xl p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {tab === 'comingSoon' && (
              <ComingSoonTab draft={draft} onChange={update} onSaved={handleSaved} />
            )}
            {tab === 'identity' && (
              <IdentityTab draft={draft} onChange={update} onSaved={handleSaved} />
            )}
            {tab === 'experiences' && (
              <ExperiencesTab draft={draft} onChange={update} onSaved={handleSaved} />
            )}
            {tab === 'certifications' && (
              <CertificationsTab draft={draft} onChange={update} onSaved={handleSaved} />
            )}
            {tab === 'englishCerts' && (
              <EnglishCertsTab draft={draft} onChange={update} onSaved={handleSaved} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Toast region provided by AdminLayout */}
      <div className="hidden">{toast ? '' : ''}</div>
    </div>
  );
};