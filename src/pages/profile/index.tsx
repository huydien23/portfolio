import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE_CONTENT } from '../../shared/config';
import { useLang } from '../../contexts/LangContext';
import { 
  Download, Calendar, Award, ExternalLink, Mail, Github, 
  Linkedin, Globe, Briefcase, GraduationCap, Languages, ChevronDown 
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export const ProfilePage = () => {
  const { t } = useLang();
  const [expandedCert, setExpandedCert] = useState<number | null>(null);

  const experiences = [
    {
      role: t('experience.exp_1_role'),
      company: 'Team TechForge',
      period: t('experience.period_1') || '07/2025 — Present',
      accentColor: 'from-ocean-500 to-cyan-400',
      dotColor: 'bg-ocean-500',
      achievements: [
        t('experience.exp_1_ach_1'),
        t('experience.exp_1_ach_2'),
      ],
    },
    {
      role: t('experience.exp_2_role'),
      company: 'Freelance & Projects',
      period: t('experience.period_2') || '02/2021 — 12/2024',
      accentColor: 'from-sky-500 to-blue-400',
      dotColor: 'bg-sky-500',
      achievements: [
        t('experience.exp_2_ach_1'),
        t('experience.exp_2_ach_2'),
      ],
    },
  ];

  const certifications = [
    {
      title: 'Gemini Certified Student',
      issuer: 'Google for Education',
      level: 'Certification',
      year: '2025',
      credentialId: 'Valid through 06/2028',
      accent: 'from-blue-400 to-indigo-500',
      badgeBg: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      iconBg: 'bg-gradient-to-br from-blue-400 to-indigo-500',
      details: [
        'Demonstrated the knowledge, skills, and competencies needed to use Google AI (Gemini).',
        'Competent in leveraging Generative AI for academic and professional software development workflows.',
        'Officially validated by Google for Education.',
      ],
      verifyUrl: '#',
    },
    {
      title: 'JavaScript (Basic)',
      issuer: 'HackerRank',
      level: 'Skill Certificate',
      year: '2026',
      credentialId: 'ID: 3AD59E949581',
      accent: 'from-emerald-400 to-green-500',
      badgeBg: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      iconBg: 'bg-gradient-to-br from-emerald-400 to-green-500',
      details: [
        'Passed the official HackerRank skill certification test for core JavaScript.',
        'Proficient in algorithmic problem solving and modern JS syntax (ES6+).',
        'Demonstrated ability to write clean, efficient, and maintainable JavaScript code.',
      ],
      verifyUrl: 'https://www.hackerrank.com/certificates/3ad59e949581',
    },
  ];

  const englishCerts = [
    {
      name: 'English B1',
      score: 'B1',
      detail: 'CEFR / VSTEP',
      breakdown: t('profile.english_b1_desc'),
      year: 'Academic',
    }
  ];

  return (
    <main className="w-full min-h-screen bg-white dark:bg-abyss-950 transition-colors duration-500">

      {/* ─── HERO ─── */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-24 overflow-hidden bg-gradient-to-b from-ocean-50/60 via-white to-white dark:from-abyss-900 dark:via-abyss-950 dark:to-abyss-950">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-ocean-100/40 dark:bg-ocean-900/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-sky-100/30 dark:bg-sky-900/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 lg:px-10 relative z-10">
          <motion.div initial="hidden" animate="visible" className="flex flex-col md:flex-row gap-10 md:gap-14 items-center md:items-start">
            
            {/* Avatar */}
            <motion.div variants={fadeUp} custom={0} className="shrink-0">
              <div className="relative group">
                <div className="absolute -inset-1.5 bg-gradient-to-br from-ocean-300/50 to-sky-300/30 dark:from-ocean-600/50 dark:to-sky-600/30 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden border-2 border-white dark:border-abyss-800 shadow-xl shadow-slate-200/60 dark:shadow-none">
                  <img
                    src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80"
                    alt="Huy Dien — Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div variants={fadeUp} custom={1} className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-800 dark:text-white leading-none mb-5">
                <span className="text-ocean-600 dark:text-ocean-400">{t('profile.title').split(' ')[0]}</span> {t('profile.title').split(' ').slice(1).join(' ')}
              </h1>

              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tracking-wide bg-ocean-50 dark:bg-ocean-900/20 text-ocean-700 dark:text-ocean-300 border border-ocean-200 dark:border-ocean-800 rounded-lg shadow-sm">
                  <Briefcase size={12} /> {t('profile.role')}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tracking-wide bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 rounded-lg shadow-sm">
                  <Globe size={12} /> {t('profile.architect')}
                </span>
              </div>

              <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg text-[15px] mb-7">
                {t('profile.summary')}
              </p>

              {/* Social links */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2.5">
                <a href={`mailto:${SITE_CONTENT.contact.email}`} className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-abyss-900 hover:bg-ocean-50 dark:hover:bg-ocean-900/20 border border-slate-200 dark:border-white/10 hover:border-ocean-300 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:text-ocean-700 transition-all shadow-sm">
                  <Mail size={15} /> {SITE_CONTENT.contact.email}
                </a>
                <a href={SITE_CONTENT.contact.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-abyss-900 hover:bg-ocean-50 dark:hover:bg-ocean-900/20 border border-slate-200 dark:border-white/10 hover:border-ocean-300 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:text-ocean-700 transition-all shadow-sm">
                  <Github size={15} /> GitHub
                </a>
                <a href={SITE_CONTENT.contact.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-abyss-900 hover:bg-ocean-50 dark:hover:bg-ocean-900/20 border border-slate-200 dark:border-white/10 hover:border-ocean-300 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:text-ocean-700 transition-all shadow-sm">
                  <Linkedin size={15} /> LinkedIn
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── EXPERIENCE ─── */}
      <section className="bg-slate-50/60 dark:bg-abyss-900/40 py-20 md:py-28 border-t border-slate-100 dark:border-white/5 transition-colors">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp}>
            <div className="flex items-center gap-3 mb-12">
              <div className="p-2 bg-ocean-100 dark:bg-ocean-900/30 text-ocean-600 dark:text-ocean-400 rounded-lg">
                <Calendar size={18} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">{t('profile.experience')}</h2>
            </div>
          </motion.div>

          <div className="flex flex-col gap-6">
            {experiences.map((exp, idx) => (
              <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} custom={idx}>
                <div className="group bg-white dark:bg-abyss-900/60 rounded-2xl border border-slate-150 dark:border-white/5 hover:border-ocean-200 dark:hover:border-ocean-500/30 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden backdrop-blur-sm">
                  <div className={`h-1 bg-gradient-to-r ${exp.accentColor}`} />
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white leading-tight">{exp.role}</h3>
                        <p className="text-ocean-600 dark:text-ocean-400 font-semibold text-sm mt-0.5">{exp.company}</p>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-white/5 px-3 py-1.5 rounded-full border border-slate-100 dark:border-white/5 whitespace-nowrap w-fit tracking-tighter">
                        {exp.period}
                      </span>
                    </div>
                    <ul className="space-y-3 mt-4">
                      {exp.achievements.map((achievement, aIdx) => (
                        <li key={aIdx} className="relative pl-5 text-slate-600 dark:text-slate-400 text-[15px] leading-relaxed">
                          <span className={`absolute left-0 top-[9.5px] h-1.5 w-1.5 rounded-full ${exp.dotColor}`} />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SKILLS + EDUCATION ─── */}
      <section className="bg-white dark:bg-abyss-950 py-20 md:py-28 border-t border-slate-100 dark:border-white/5">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16">

            {/* Skills */}
            <div className="lg:col-span-7">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp}>
                <div className="flex items-center gap-3 mb-10">
                  <div className="p-2 bg-ocean-100 dark:bg-ocean-900/30 text-ocean-600 dark:text-ocean-400 rounded-lg">
                    <Briefcase size={18} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">{t('profile.skills')}</h2>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SITE_CONTENT.skills.categories.map((cat, catIdx) => (
                  <motion.div
                    key={cat.id}
                    initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-30px' }} variants={fadeUp} custom={catIdx}
                    className="bg-slate-50/70 dark:bg-white/5 rounded-xl p-5 border border-slate-100 dark:border-white/5 hover:border-ocean-200 dark:hover:border-ocean-500/30 transition-all duration-300"
                  >
                    <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3">{t(`profile.${cat.id}`)}</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.items.map((item) => (
                        <div key={item.name} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white dark:bg-abyss-800 rounded-lg text-[13px] text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-white/10 hover:border-ocean-200 hover:text-ocean-700 transition-colors cursor-default shadow-sm font-medium">
                          <img src={item.icon} alt={item.name} className="w-3.5 h-3.5" />
                          <span>{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Education + English */}
            <div className="lg:col-span-5">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp}>
                <div className="flex items-center gap-3 mb-10">
                  <div className="p-2 bg-ocean-100 dark:bg-ocean-900/30 text-ocean-600 dark:text-ocean-400 rounded-lg">
                    <GraduationCap size={18} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">{t('profile.education')}</h2>
                </div>
              </motion.div>

              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-30px' }} variants={fadeUp}
                className="bg-slate-50/70 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 overflow-hidden"
              >
                <div className="h-1.5 bg-gradient-to-r from-ocean-400 to-sky-400" />
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">{t('profile.university')}</h3>
                    <span className="shrink-0 px-2.5 py-1 text-[10px] font-black bg-ocean-500 text-white rounded-md shadow-lg shadow-ocean-500/20 uppercase">
                      {t('profile.gpa')}
                    </span>
                  </div>
                  <p className="text-ocean-600 dark:text-ocean-400 text-sm font-semibold mb-3">{t('profile.degree')}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    {t('profile.edu_summary')}
                  </p>
                </div>
              </motion.div>

              {/* English Certificates */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} variants={fadeUp} className="mt-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                    <Languages size={18} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white uppercase tracking-tight">{t('profile.english_certs')}</h3>
                </div>

                <div className="flex flex-col gap-3">
                  {englishCerts.map((cert, idx) => (
                    <div key={idx} className="bg-slate-50/70 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 p-5 hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-800 dark:text-white">{cert.name}</span>
                          <span className="text-[10px] font-mono text-slate-400 dark:text-white/30 uppercase">{cert.year}</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter leading-none">{cert.score}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{cert.detail}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium tracking-tight">{cert.breakdown}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CERTIFICATIONS + CTA ─── */}
      <section className="relative bg-gradient-to-b from-slate-50 to-ocean-50/40 dark:from-abyss-900 dark:to-abyss-950 py-20 md:py-28 border-t border-slate-100 dark:border-white/5 overflow-hidden transition-colors">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-ocean-100/30 dark:bg-ocean-900/10 rounded-full blur-[100px] translate-y-1/3 translate-x-1/4 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 lg:px-10 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={fadeUp} className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-ocean-100 dark:bg-ocean-900/30 text-ocean-600 dark:text-ocean-400 rounded-lg">
              <Award size={18} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">{t('profile.certifications')}</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
            {certifications.map((cert, idx) => {
              const isOpen = expandedCert === idx;
              return (
                <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-30px' }} variants={fadeUp} custom={idx}
                  onClick={() => setExpandedCert(isOpen ? null : idx)}
                  className="group bg-white dark:bg-abyss-900/60 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-ocean-300 dark:hover:border-ocean-500/40 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-sm"
                >
                  <div className={`h-1.5 bg-gradient-to-r ${cert.accent}`} />
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`shrink-0 w-12 h-12 ${cert.iconBg} rounded-xl flex items-center justify-center shadow-lg shadow-black/5`}>
                        <Award size={22} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h3 className="font-bold text-slate-800 dark:text-white text-[15px] leading-tight">{cert.title}</h3>
                          <ChevronDown size={14} className={`text-slate-300 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 font-medium">{cert.issuer}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-black rounded-md border uppercase ${cert.badgeBg}`}>
                            {cert.level}
                          </span>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5">
                            <ul className="space-y-2 mb-5">
                              {cert.details.map((detail, dIdx) => (
                                <li key={dIdx} className="relative pl-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                  <span className={`absolute left-0 top-[8px] h-1.5 w-1.5 rounded-full bg-gradient-to-r ${cert.accent}`} />
                                  {detail}
                                </li>
                              ))}
                            </ul>
                            <a href={cert.verifyUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1.5 text-xs font-bold text-ocean-600 dark:text-ocean-400 hover:text-ocean-700 transition-colors uppercase tracking-wider">
                              <ExternalLink size={12} /> {t('profile.verify')}
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ─── CTA ─── */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} variants={fadeUp} className="flex flex-col items-center text-center pt-10 border-t border-slate-200/60 dark:border-white/10">
            <p className="text-slate-400 dark:text-slate-500 text-[10px] tracking-[0.3em] uppercase mb-6 font-black">{t('profile.cv_label')}</p>
            <button className="group inline-flex items-center gap-3 px-8 py-4 bg-ocean-600 hover:bg-ocean-500 dark:bg-ocean-600 dark:hover:bg-ocean-500 text-white rounded-2xl font-black text-sm transition-all active:scale-95 shadow-xl shadow-ocean-500/20 hover:shadow-ocean-500/40">
              <Download size={18} className="group-hover:-translate-y-0.5 transition-transform" />
              {t('profile.download_cv')}
              <ExternalLink size={13} className="opacity-40" />
            </button>
          </motion.div>
        </div>
      </section>
    </main>
  );
};
