import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, ArrowUpRight, Hourglass } from 'lucide-react';
import { ProjectEntity, ProjectCategory, ProjectStatus } from '../../../entities/project/model';
import { DetailModal } from './DetailModal';

type FilterOption = 'all' | ProjectCategory | 'coming_soon';
type StatusFilter = 'all' | ProjectStatus;

const CATEGORY_LABEL: Record<string, string> = {
  'Tất cả': 'Tất cả',
  Frontend: 'Frontend',
  Backend: 'Backend',
  Mobile: 'Mobile',
  Desktop: 'Desktop',
  AI: 'AI / Data',
};

const CATEGORY_VALUES: ProjectCategory[] = ['Frontend', 'Backend', 'Mobile', 'Desktop', 'AI'];

interface ProjectArchiveProps {
  onClose: () => void;
  projects: ProjectEntity[];
}

/* ─── Project Card (Archive Grid) ─── */
const ArchiveCard = ({ project, onClick }: { project: ProjectEntity; onClick: () => void }) => {
  const { t } = useTranslation();
  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-xl bg-slate-100 dark:bg-abyss-900 border border-slate-200 dark:border-white/5 hover:border-ocean-300 dark:hover:border-ocean-500/40 transition-all duration-300"
    >
      <motion.div layoutId={`archive-proj-img-${project.id}`} className="aspect-[4/3] overflow-hidden">
        <img
          src={project.imageData || project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-5">
        <span className="text-[9px] font-black font-mono tracking-[0.2em] uppercase text-ocean-400 mb-2">
          {CATEGORY_LABEL[project.category]}
        </span>

        <motion.h3 layoutId={`archive-proj-title-${project.id}`} className="text-white font-black text-lg uppercase tracking-tighter leading-tight mb-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 origin-left">
          {project.title}
        </motion.h3>

        <div className="flex flex-wrap gap-1.5 mb-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
          {project.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-white/10 text-white/80 text-[10px] font-mono rounded-full border border-white/10">
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="px-2 py-0.5 bg-white/10 text-white/60 text-[10px] font-mono rounded-full">
              +{project.tags.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/60 uppercase tracking-widest translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-100">
          <span className="w-4 h-px bg-white/30" />
          {t('projects.view_details')}
          <ArrowUpRight size={10} />
        </div>
      </div>

      {project.year && (
        <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/50 dark:bg-black/70 text-white/70 text-[10px] font-mono rounded-full backdrop-blur-sm border border-white/10">
          {project.year}
        </div>
      )}
    </motion.article>
  );
};

/* ─── Coming Soon Card (Archive Grid) — disabled ─── */
const ArchiveComingSoonCard = ({ project }: { project: ProjectEntity }) => (
  <motion.article
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    aria-disabled
    className="group relative overflow-hidden rounded-xl bg-slate-100 dark:bg-abyss-900 border border-amber-200/60 dark:border-amber-500/20 cursor-not-allowed select-none"
  >
    <div className="aspect-[4/3] overflow-hidden relative">
      <img
        src={project.imageData || project.imageUrl}
        alt={project.title}
        className="w-full h-full object-cover filter saturate-50"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-slate-950/65 dark:bg-abyss-950/80" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="px-3 py-1.5 rounded-full bg-amber-500/95 backdrop-blur-md shadow-xl flex items-center gap-1.5">
          <Hourglass size={12} className="text-white animate-pulse" />
          <span className="text-white text-[10px] font-black font-mono uppercase tracking-[0.25em]">
            Coming Soon…
          </span>
        </div>
      </div>
    </div>

    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
      <h3 className="text-white/70 font-black text-sm uppercase tracking-tighter line-through decoration-amber-500/60 truncate">
        {project.title}
      </h3>
    </div>
  </motion.article>
);

export const ProjectArchive = ({ onClose, projects }: ProjectArchiveProps) => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectEntity | null>(null);

  /* Lock scroll */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !selectedProject) onClose();
    };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [onClose, selectedProject]);

  /* Ẩn draft hoàn toàn */
  const publicList = useMemo(
    () => projects.filter(p => p.status !== 'draft'),
    [projects],
  );

  const counts = useMemo<Record<string, number>>(() => {
    const c: Record<string, number> = { all: publicList.length };
    for (const cat of CATEGORY_VALUES) {
      c[cat] = publicList.filter(p => p.category === cat).length;
    }
    c.coming_soon = publicList.filter(p => p.status === 'coming_soon').length;
    c.published = publicList.filter(p => p.status === 'published').length;
    c.draft = 0;
    return c;
  }, [publicList]);

  const filtered = useMemo(() => {
    return publicList.filter(p => {
      if (activeFilter === 'all') {
        if (statusFilter !== 'all' && p.status !== statusFilter) return false;
        return true;
      }
      if (activeFilter === 'coming_soon') {
        return p.status === 'coming_soon';
      }
      if (p.category !== activeFilter) return false;
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      return true;
    }).sort((a, b) => a.order - b.order);
  }, [publicList, activeFilter, statusFilter]);

  return createPortal(
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 35, stiffness: 280 }}
      className="fixed inset-0 z-[9000] bg-white dark:bg-abyss-950 flex flex-col overflow-hidden transition-colors"
    >
      {/* ─── Sticky Header ─── */}
      <div className="sticky top-0 z-20 bg-white/95 dark:bg-abyss-950/95 backdrop-blur-md border-b border-slate-100 dark:border-white/5 px-6 lg:px-8 py-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <h2 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter leading-none">
              {t('projects.all_works')}
            </h2>
            <span className="text-sm font-mono text-slate-400 dark:text-slate-500">
              ({filtered.length})
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Status filter */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5">
              {(['all', 'published', 'coming_soon'] as StatusFilter[]).map(s => {
                const isActive = statusFilter === s;
                const label = s === 'all' ? 'Mọi TT' : s === 'published' ? 'Hiển thị' : 'Coming soon';
                return (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black font-mono uppercase tracking-wider transition ${
                      isActive
                        ? 'bg-white dark:bg-abyss-800 text-ocean-600 dark:text-ocean-400 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Category filter */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5">
              {(['all', ...CATEGORY_VALUES] as FilterOption[]).map(f => {
                const isActive = activeFilter === f;
                const label = f === 'all' ? t('common.all') : f;
                return (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-3.5 py-2 rounded-lg text-[10px] font-black font-mono uppercase tracking-[0.1em] transition-all ${
                      isActive
                        ? 'bg-white dark:bg-abyss-800 text-ocean-600 dark:text-ocean-400 shadow-sm border border-slate-200/50 dark:border-ocean-500/30'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/5'
                    }`}
                  >
                    {label} <span className="opacity-60 font-medium ml-1.5">{counts[f] ?? 0}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-[11px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:border-ocean-400 hover:text-ocean-600 dark:hover:text-ocean-400 transition-all cursor-pointer"
            >
              <X size={13} /> {t('common.close')}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Grid ─── */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 content-start">
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={`${activeFilter}-${statusFilter}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, staggerChildren: 0.05 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start"
            >
              {filtered.map(project =>
                project.status === 'coming_soon' ? (
                  <ArchiveComingSoonCard key={project.id} project={project} />
                ) : (
                  <ArchiveCard
                    key={project.id}
                    project={project}
                    onClick={() => setSelectedProject(project)}
                  />
                ),
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center h-64 text-slate-400 dark:text-slate-600"
            >
              <p className="text-sm font-mono uppercase tracking-widest">{t('projects.empty')}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Detail Modal ─── */}
      <AnimatePresence>
        {selectedProject && (
          <DetailModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            layoutIdPrefix="archive-"
          />
        )}
      </AnimatePresence>
    </motion.div>,
    document.body
  );
};
