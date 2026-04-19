import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Tech {
  name: string;
  icon: string;
  description: string;
  ring: 'inner' | 'outer';
  angle: number;
}

const techs: Tech[] = [
  // Inner Ring - Core Stack
  { name: 'React', icon: 'react/react-original.svg', description: 'Frontend Library', ring: 'inner', angle: 0 },
  { name: 'Next.js', icon: 'nextjs/nextjs-original.svg', description: 'Full-Stack Framework', ring: 'inner', angle: 72 },
  { name: 'Node.js', icon: 'nodejs/nodejs-original.svg', description: 'Backend Runtime', ring: 'inner', angle: 144 },
  { name: 'TypeScript', icon: 'typescript/typescript-original.svg', description: 'Typed JavaScript', ring: 'inner', angle: 216 },
  { name: 'Tailwind', icon: 'tailwindcss/tailwindcss-original.svg', description: 'CSS Framework', ring: 'inner', angle: 288 },

  // Outer Ring - Extended Stack
  { name: 'HTML5', icon: 'html5/html5-original.svg', description: 'Markup Language', ring: 'outer', angle: 0 },
  { name: 'CSS3', icon: 'css3/css3-original.svg', description: 'Styling', ring: 'outer', angle: 45 },
  { name: 'NestJS', icon: 'nestjs/nestjs-original.svg', description: 'Backend Framework', ring: 'outer', angle: 90 },
  { name: 'Python', icon: 'python/python-original.svg', description: 'Backend & AI', ring: 'outer', angle: 135 },
  { name: 'Django', icon: 'django/django-plain.svg', description: 'Python Framework', ring: 'outer', angle: 180 },
  { name: 'Firebase', icon: 'firebase/firebase-original.svg', description: 'Backend Service', ring: 'outer', angle: 225 },
  { name: 'Supabase', icon: 'supabase/supabase-original.svg', description: 'Firebase Alternative', ring: 'outer', angle: 270 },
  { name: 'PostgreSQL', icon: 'postgresql/postgresql-original.svg', description: 'Database', ring: 'outer', angle: 315 },
];

export const TechOrbit = () => {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const innerRadius = 100;
  const outerRadius = 180;
  const iconSize = 52;
  const innerSpeed = 25;
  const outerSpeed = 40;

  return (
    <div
      className="relative w-full h-[420px] md:h-[500px] flex items-center justify-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setHoveredTech(null);
      }}
    >
      {/* Center Hub */}
      <div className="absolute w-28 h-28 bg-white rounded-full shadow-2xl flex items-center justify-center z-10 border-4 border-slate-100">
        <span className="text-2xl font-black text-ocean-600 tracking-tight">HD.</span>
      </div>

      {/* Inner Orbit Ring */}
      <motion.div
        className="absolute w-[280px] h-[280px] md:w-[320px] md:h-[320px] rounded-full"
        animate={{ rotate: isPaused ? 0 : 360 }}
        transition={{ duration: innerSpeed, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 rounded-full border border-sky-200/60" />

        {techs
          .filter(t => t.ring === 'inner')
          .map(tech => {
            const rad = (tech.angle * Math.PI) / 180;
            const x = Math.cos(rad) * innerRadius;
            const y = Math.sin(rad) * innerRadius;

            return (
              <motion.div
                key={tech.name}
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  marginLeft: x - iconSize / 2,
                  marginTop: y - iconSize / 2,
                }}
                onHoverStart={() => setHoveredTech(tech.name)}
                animate={{ scale: hoveredTech === tech.name ? 1.25 : 1 }}
              >
                <div
                  className={`w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center border-2 cursor-pointer transition-all duration-200 ${hoveredTech === tech.name
                      ? 'border-ocean-500 shadow-ocean-200'
                      : 'border-slate-100 hover:border-ocean-300'
                    }`}
                >
                  <img
                    src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${tech.icon}`}
                    alt={tech.name}
                    className="w-8 h-8 object-contain"
                    onError={e => { (e.target as HTMLImageElement).style.opacity = '0'; }}
                  />
                </div>
              </motion.div>
            );
          })}
      </motion.div>

      {/* Outer Orbit Ring */}
      <motion.div
        className="absolute w-[420px] h-[420px] md:w-[500px] md:h-[500px] rounded-full"
        animate={{ rotate: isPaused ? 0 : -360 }}
        transition={{ duration: outerSpeed, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 rounded-full border border-dashed border-slate-200/50" />

        {techs
          .filter(t => t.ring === 'outer')
          .map(tech => {
            const rad = (tech.angle * Math.PI) / 180;
            const x = Math.cos(rad) * outerRadius;
            const y = Math.sin(rad) * outerRadius;

            return (
              <motion.div
                key={tech.name}
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  marginLeft: x - (iconSize - 8) / 2,
                  marginTop: y - (iconSize - 8) / 2,
                }}
                onHoverStart={() => setHoveredTech(tech.name)}
                animate={{ scale: hoveredTech === tech.name ? 1.3 : 1 }}
              >
                <div
                  className={`w-11 h-11 bg-white/90 rounded-full shadow-md flex items-center justify-center border cursor-pointer transition-all duration-200 ${hoveredTech === tech.name
                      ? 'border-ocean-500 shadow-ocean-200'
                      : 'border-slate-200 hover:border-ocean-300'
                    }`}
                >
                  <img
                    src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${tech.icon}`}
                    alt={tech.name}
                    className="w-6 h-6 object-contain"
                    onError={e => { (e.target as HTMLImageElement).style.opacity = '0'; }}
                  />
                </div>
              </motion.div>
            );
          })}
      </motion.div>

      {/* Tooltip — positioned ABOVE center to prevent clipping on mobile */}
      <AnimatePresence>
        {hoveredTech && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 px-5 py-3 bg-slate-900 text-white text-sm rounded-xl shadow-xl z-20 pointer-events-none"
          >
            <p className="font-bold text-ocean-400 text-center">{hoveredTech}</p>
            <p className="text-xs text-slate-300 text-center">
              {techs.find(t => t.name === hoveredTech)?.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
