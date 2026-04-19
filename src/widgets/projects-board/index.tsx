import { useState, useEffect, useMemo, useRef } from 'react';

import {
  motion, AnimatePresence,
  useMotionValue, useTransform, useSpring,
  LayoutGroup,
} from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PROJECTS_DATA } from '../../shared/data/projects-data';
import { PROJECTS_DATA_EN } from '../../shared/data/projects-data.en';
import { ProjectArchive } from './ui/ProjectArchive';
import { DetailModal } from './ui/DetailModal';
import { ProjectEntity } from '../../entities/project/model';

/* ════════════════════════════════════════════════
   3-D Tilt Featured Card
   ════════════════════════════════════════════════ */
interface FeaturedCardProps {
  proj: ProjectEntity;
  idx: number;
  featuredLength: number;
  onSelect: (id: string) => void;
  viewDetailsLabel: string;
}

const FeaturedCard = ({ proj, idx, featuredLength, onSelect, viewDetailsLabel }: FeaturedCardProps) => {
  const cardRef = useRef<HTMLElement>(null);
  const isEven = idx % 2 === 0;

  /* ── Motion values ── */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 150, damping: 20, mass: 0.5 });
  const springY = useSpring(rawY, { stiffness: 150, damping: 20, mass: 0.5 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-10, 10]);
  const scale   = useSpring(1, { stiffness: 200, damping: 20 });
  const glowX   = useTransform(springX, [-0.5, 0.5], [0, 100]);
  const glowY   = useTransform(springY, [-0.5, 0.5], [0, 100]);

  const glowBg = useTransform(
    [glowX, glowY],
    ([x, y]: number[]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(14,165,233,0.28) 0%, transparent 65%)`,
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top)  / rect.height - 0.5);
    scale.set(1.015);
  };

  const handleMouseLeave = () => { rawX.set(0); rawY.set(0); scale.set(1); };

  return (
    <div style={{ perspective: '1200px' }} className="border-b border-slate-100 dark:border-white/5 last:border-b-0">
      <motion.article
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => onSelect(proj.id)}
        style={{ rotateX, rotateY, scale, transformStyle: 'preserve-3d' }}
        className={`group flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} cursor-pointer items-stretch py-16 first:pt-0`}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, delay: idx * 0.1 }}
      >
        {/* ── Image (shared layoutId → flies into modal) ── */}
        <motion.div
          layoutId={`proj-img-${proj.id}`}
          className="w-full md:w-[55%] aspect-[16/10] overflow-hidden relative rounded-xl bg-slate-100 dark:bg-abyss-900 shrink-0"
          style={{ borderRadius: 12 }}
        >
          <motion.div
            className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: glowBg }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 to-transparent group-hover:opacity-0 transition-opacity duration-500 z-10" />
          <img
            src={proj.imageUrl}
            alt={proj.title}
            className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-white/10 dark:bg-black/40 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black font-mono uppercase tracking-widest text-white">
            {proj.category}
          </div>
        </motion.div>

        {/* ── Info ── */}
        <div className={`w-full md:w-[45%] flex flex-col justify-center ${isEven ? 'md:pl-14 lg:pl-20' : 'md:pr-14 lg:pr-20'} pt-8 md:pt-0`}>
          <span className="text-[11px] font-mono text-slate-300 dark:text-white/20 tracking-[0.3em] uppercase mb-4">
            {(idx + 1).toString().padStart(2, '0')} / {featuredLength.toString().padStart(2, '0')}
          </span>

          {/* Title (shared layoutId) */}
          <motion.h3
            layoutId={`proj-title-${proj.id}`}
            className="font-display text-3xl lg:text-4xl font-black text-black dark:text-white mb-5 tracking-tighter uppercase group-hover:text-ocean-600 dark:group-hover:text-ocean-400 transition-colors leading-none"
            style={{ originX: 0 }}
          >
            {proj.title}
          </motion.h3>

          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
            {proj.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {proj.tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 text-[11px] font-mono uppercase tracking-wider rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest group-hover:text-ocean-500 dark:group-hover:text-ocean-400 transition-colors">
            <span className="w-6 h-px bg-current transition-all group-hover:w-10" />
            {viewDetailsLabel}
            <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </motion.article>
    </div>
  );
};

/* ════════════════════════════════════════════════
   Main ProjectsBoard Widget
   ════════════════════════════════════════════════ */
export const ProjectsBoard = () => {
  const { t, i18n } = useTranslation();
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [selectedId, setSelectedId]   = useState<string | null>(null);

  const activeData = i18n.language === 'en' ? PROJECTS_DATA_EN : PROJECTS_DATA;

  const featuredList = useMemo(
    () => activeData.filter((p: ProjectEntity) => p.featured),
    [i18n.language],
  );

  const selectedProj = useMemo(
    () => activeData.find((p: ProjectEntity) => p.id === selectedId),
    [selectedId, i18n.language],
  );

  /* Scroll lock */
  useEffect(() => {
    document.body.style.overflow = (selectedId || archiveOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedId, archiveOpen]);

  return (
    <LayoutGroup>
      <>
        <section
          id="projects"
          className="w-full py-20 md:py-24 bg-white dark:bg-abyss-950 relative z-10 border-t border-slate-200 dark:border-white/5 transition-colors duration-300"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-12">

            {/* ─── Split Header ─── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 pb-8 border-b border-black/10 dark:border-white/10">
              {/* Left */}
              <div className="flex flex-col items-start gap-5">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ocean-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-ocean-500" />
                  </span>
                  <p className="text-[11px] font-mono font-black text-slate-600 dark:text-slate-300 uppercase tracking-[0.25em] translate-y-px">
                    {t('projects.selected_works')}
                  </p>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="font-display flex flex-wrap items-center gap-[0.25em] text-4xl md:text-5xl font-black tracking-tighter uppercase leading-normal"
                >
                  <span className="text-slate-900 dark:text-white pt-3 pb-3">{t('projects.featured_1')}</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean-600 to-sky-400 dark:from-ocean-400 dark:to-cyan-300 pt-3 pb-3">
                    {t('projects.featured_2')}
                  </span>
                </motion.h2>
              </div>

              {/* Right */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col items-start md:items-end gap-4"
              >
                <p className="text-xs md:text-sm font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-relaxed text-left md:text-right">
                  {t('projects.subtitle')}
                </p>

                <button
                  onClick={() => setArchiveOpen(true)}
                  className="group inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 border-slate-900 dark:border-white/20 bg-white dark:bg-abyss-950 hover:bg-ocean-600 hover:border-ocean-600 dark:hover:border-ocean-500 transition-all duration-300 cursor-pointer"
                >
                  <span className="font-bold text-xs uppercase tracking-[0.2em] text-slate-900 dark:text-white group-hover:text-white transition-colors duration-300">
                    {t('projects.view_all')}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-white/40 group-hover:text-white/80 transition-colors duration-300">
                    ({PROJECTS_DATA.length})
                  </span>
                  <ArrowUpRight size={14} className="text-slate-700 dark:text-white/60 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                </button>
              </motion.div>
            </div>

            {/* ─── Featured List (3-D Tilt + Shared Layout) ─── */}
            <div className="flex flex-col">
              {featuredList.map((proj: ProjectEntity, idx: number) => (
                <FeaturedCard
                  key={proj.id}
                  proj={proj}
                  idx={idx}
                  featuredLength={featuredList.length}
                  onSelect={setSelectedId}
                  viewDetailsLabel={t('projects.view_details')}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ─── Full-page Detail Modal ─── */}
        <AnimatePresence>
          {selectedId && selectedProj && (
            <DetailModal
              key={selectedId}
              project={selectedProj}
              onClose={() => setSelectedId(null)}
            />
          )}
        </AnimatePresence>

        {/* ─── Archive Overlay ─── */}
        <AnimatePresence>
          {archiveOpen && (
            <ProjectArchive onClose={() => setArchiveOpen(false)} />
          )}
        </AnimatePresence>
      </>
    </LayoutGroup>
  );
};
