import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, ExternalLink, Github, PlayCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ProjectEntity } from '../../../entities/project/model';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

interface DetailModalProps {
  project: ProjectEntity;
  onClose: () => void;
  layoutIdPrefix?: string; 
}

export const DetailModal = ({ project, onClose, layoutIdPrefix = '' }: DetailModalProps) => {
  const { t } = useTranslation();

  /* Escape to close */
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [onClose]);

  return createPortal(
    <motion.div
      key="detail-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[9999] bg-white/80 dark:bg-abyss-950/80 backdrop-blur-md overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="min-h-screen w-full max-w-5xl mx-auto px-4 pb-24 pt-6 md:pt-16">

        {/* ── Hero image ── */}
        <motion.div
          layoutId={`${layoutIdPrefix}proj-img-${project.id}`}
          className="w-full overflow-hidden relative bg-slate-100 dark:bg-abyss-900 shadow-2xl"
          style={{ borderRadius: '24px', height: 'clamp(280px, 55vh, 520px)' }}
          transition={{ type: 'spring', damping: 30, stiffness: 200 }}
        >
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          {/* Category chip */}
          <div className="absolute top-5 left-6 px-3 py-1 bg-white/10 dark:bg-black/40 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black font-mono uppercase tracking-widest text-white z-10">
            {project.category}
          </div>
          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ delay: 0.3 }}
            onClick={onClose}
            className="absolute top-5 right-5 z-10 flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-mono uppercase tracking-widest text-white transition-colors cursor-pointer"
          >
            <X size={12} /> {t('projects.close')}
          </motion.button>
        </motion.div>

        {/* ── Content ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="mt-10 px-2 md:px-4"
        >
          {/* Title */}
          <motion.h2
            layoutId={`${layoutIdPrefix}proj-title-${project.id}`}
            className="font-display text-4xl md:text-5xl font-black text-black dark:text-white tracking-tighter uppercase leading-none mb-3"
            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
          >
            {project.title}
          </motion.h2>

          {/* Year badge */}
          {project.year && (
            <motion.p variants={fadeUp} className="text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] mb-8">
              {project.year}
            </motion.p>
          )}

          {/* Grid: description + sidebar */}
          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            {/* Left: description + highlights */}
            <div className="md:col-span-2 space-y-6">
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
                {project.longDescription || project.description}
              </p>

              {project.highlights && project.highlights.length > 0 && (
                <div>
                  <p className="text-[10px] font-mono font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">
                    {t('projects.highlights')}
                  </p>
                  <ul className="space-y-3">
                    {project.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                        <span className="mt-[7px] shrink-0 w-1.5 h-1.5 rounded-full bg-ocean-500" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right: tags + links */}
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-mono font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3">
                  {t('projects.tech_stack')}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-[11px] font-mono rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {project.liveUrl && project.liveUrl !== '#' && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-ocean-600 hover:bg-ocean-500 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    <ExternalLink size={13} /> {t('projects.demo')}
                  </a>
                )}
                {project.githubUrl && project.githubUrl !== '#' && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl hover:border-ocean-400 transition-colors"
                  >
                    <Github size={13} /> {t('projects.source')}
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          {/* Gallery */}
          {project.gallery && project.gallery.length > 0 && (
            <motion.div variants={fadeUp} className="mb-10">
              <p className="text-[10px] font-mono font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">
                {t('projects.gallery')}
              </p>
              <div className="flex flex-col gap-3">
                {project.gallery.map((src, i) => (
                  <div key={i} className="w-full rounded-xl overflow-hidden border border-slate-100 dark:border-white/5">
                    <img src={src} alt={`${project.title} ${i + 1}`} className="w-full h-auto object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Video */}
          {project.videoUrl && (
            <motion.div variants={fadeUp}>
              <p className="text-[10px] font-mono font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <PlayCircle size={13} className="text-ocean-500" /> {t('projects.video')}
              </p>
              <div className="aspect-video rounded-xl overflow-hidden border border-slate-100 dark:border-white/5 shadow-lg">
                <iframe
                  src={project.videoUrl}
                  title={`${project.title} demo`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>,
    document.body,
  );
};
