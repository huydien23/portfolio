import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, ArrowUpRight } from 'lucide-react';
import { ProjectEntity, ProjectCategory } from '../../../entities/project/model';
import { PROJECTS_DATA } from '../../../shared/data/projects-data';
import { PROJECTS_DATA_EN } from '../../../shared/data/projects-data.en';

/* ─── Types ─── */
type FilterOption = 'all' | ProjectCategory;

const FILTER_VALUES: FilterOption[] = ['all', 'Frontend', 'Backend', 'Mobile', 'Desktop', 'AI'];
const CATEGORY_LABEL: Record<string, string> = {
  'Tất cả': 'Tất cả',
  Frontend: 'Frontend',
  Backend: 'Backend',
  Mobile: 'Mobile',
  Desktop: 'Desktop',
  AI: 'AI / Data',
};

import { DetailModal } from './DetailModal';

/* ─── Project Card (inside Archive Grid) ─── */
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
    {/* Image */}
    <motion.div layoutId={`archive-proj-img-${project.id}`} className="aspect-[4/3] overflow-hidden">
      <img
        src={project.imageUrl}
        alt={project.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
    </motion.div>

    {/* Hover Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-5">
      {/* Category badge */}
      <span className="text-[9px] font-black font-mono tracking-[0.2em] uppercase text-ocean-400 mb-2">
        {CATEGORY_LABEL[project.category]}
      </span>

      {/* Title */}
      <motion.h3 layoutId={`archive-proj-title-${project.id}`} className="text-white font-black text-lg uppercase tracking-tighter leading-tight mb-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 origin-left">
        {project.title}
      </motion.h3>

      {/* Tags */}
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

      {/* CTA hint */}
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

/* ─── Main Archive Component ─── */
export const ProjectArchive = ({ onClose }: { onClose: () => void }) => {
  const { t, i18n } = useTranslation();
  const activeData = i18n.language === 'en' ? PROJECTS_DATA_EN : PROJECTS_DATA;
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
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

  const counts = useMemo<Record<string, number>>(() => ({
    'all': activeData.length,
    ...Object.fromEntries(
      (['Frontend', 'Backend', 'Mobile', 'Desktop', 'AI'] as ProjectCategory[]).map(c => [
        c,
        activeData.filter(p => p.category === c).length,
      ])
    ),
  }), [i18n.language]);

  const filtered = useMemo(
    () => activeFilter === 'all'
      ? activeData
      : activeData.filter(p => p.category === activeFilter),
    [activeFilter, i18n.language]
  );

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

          {/* Title */}
          <div className="flex items-baseline gap-3">
            <h2 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter leading-none">
              {t('projects.all_works')}
            </h2>
            <span className="text-sm font-mono text-slate-400 dark:text-slate-500">
              ({counts[activeFilter]})
            </span>
          </div>

          {/* Filters + Close */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5">
              {FILTER_VALUES.map(f => {
                const isActive = activeFilter === f;
                const label = f === 'all' ? t('common.all') : f;
                return (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`
                      px-3.5 py-2 rounded-lg text-[10px] font-black font-mono uppercase tracking-[0.1em] transition-all
                      ${isActive
                        ? 'bg-white dark:bg-abyss-800 text-ocean-600 dark:text-ocean-400 shadow-sm border border-slate-200/50 dark:border-ocean-500/30'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/5'
                      }
                    `}
                  >
                    {label} <span className="opacity-60 font-medium ml-1.5">{counts[f]}</span>
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

      {/* ─── Grid (Edge-to-Edge) ─── */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 content-start">
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, staggerChildren: 0.05 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start"
            >
              {filtered.map(project => (
                <ArchiveCard
                  key={project.id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
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

      {/* ─── Detail Modal (stacked on top) ─── */}
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
