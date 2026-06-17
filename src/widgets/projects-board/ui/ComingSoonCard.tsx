import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Lock, Clock } from 'lucide-react';
import { ProjectEntity } from '../../../entities/project/model';

interface ComingSoonCardProps {
  project: ProjectEntity;
  idx: number;
  total: number;
}

export const ComingSoonCard = ({ project, idx, total }: ComingSoonCardProps) => {
  const cardRef = useRef<HTMLElement>(null);
  const isEven = idx % 2 === 0;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 150, damping: 20, mass: 0.5 });
  const springY = useSpring(rawY, { stiffness: 150, damping: 20, mass: 0.5 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-4, 4]);
  const scale = useSpring(1, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
    scale.set(1.008);
  };
  const handleMouseLeave = () => { rawX.set(0); rawY.set(0); scale.set(1); };

  return (
    <div style={{ perspective: '1200px' }} className="border-b border-slate-100 dark:border-white/5 last:border-b-0">
      <motion.article
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        aria-disabled
        style={{ rotateX, rotateY, scale, transformStyle: 'preserve-3d' }}
        className={`group relative flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-stretch py-16 first:pt-0 cursor-not-allowed select-none`}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, delay: idx * 0.1 }}
      >
        {/* Image + overlay */}
        <div className="relative w-full md:w-[55%] aspect-[16/10] overflow-hidden rounded-xl bg-slate-100 dark:bg-abyss-900 shrink-0">
          <img
            src={project.imageData || project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover scale-100 filter saturate-40 brightness-75"
            loading="lazy"
          />

          {/* Multi-layer overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/70 via-slate-900/65 to-abyss-950/80 pointer-events-none" />
          <div className="absolute inset-0 backdrop-blur-[1.5px] pointer-events-none" />

          {/* Centered lock + text */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 pointer-events-none px-6 text-center">
            {/* Lock icon với halo amber pulse */}
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 -m-3 rounded-full bg-amber-500/30 blur-xl"
              />
              <div className="relative w-16 h-16 rounded-full bg-amber-500/15 border-2 border-amber-500/60 flex items-center justify-center backdrop-blur-sm">
                <Lock size={28} className="text-amber-400" strokeWidth={2.5} />
              </div>
            </div>

            <div>
              <p className="font-display text-3xl md:text-4xl font-black text-white tracking-[0.25em] uppercase leading-none">
                Coming Soon
              </p>
              <p className="mt-2 text-[11px] font-mono text-amber-200/80 uppercase tracking-widest">
                Đang được phát triển
              </p>
            </div>
          </div>

          {/* Animated amber border-glow (top + bottom line) */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent pointer-events-none" />

          {/* Category chip */}
          <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-white/10 dark:bg-black/40 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black font-mono uppercase tracking-widest text-white">
            {project.category}
          </div>
        </div>

        {/* Info */}
        <div className={`w-full md:w-[45%] flex flex-col justify-center ${isEven ? 'md:pl-14 lg:pl-20' : 'md:pr-14 lg:pr-20'} pt-8 md:pt-0`}>
          <span className="text-[11px] font-mono text-amber-600/70 dark:text-amber-500/40 tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            {(idx + 1).toString().padStart(2, '0')} / {total.toString().padStart(2, '0')} · locked
          </span>

          <h3 className="font-display text-3xl lg:text-4xl font-black text-slate-500/70 dark:text-white/40 tracking-tighter uppercase leading-none mb-5 line-through decoration-2 decoration-amber-500/50">
            {project.title}
          </h3>

          <p className="text-slate-400 dark:text-slate-500 text-sm leading-relaxed mb-6 max-w-sm">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-8 opacity-50">
            {project.tags.slice(0, 4).map((tag: string) => (
              <span key={tag} className="px-3 py-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-500 text-[11px] font-mono uppercase tracking-wider rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <div className="inline-flex items-center gap-2 text-[11px] font-mono text-amber-600 dark:text-amber-500 uppercase tracking-widest">
            <Clock size={12} />
            Sắp ra mắt
          </div>
        </div>
      </motion.article>
    </div>
  );
};
