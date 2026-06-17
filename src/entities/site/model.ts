/**
 * Site content entity — manages the portfolio's static content (hero, brand, contact, about, skills).
 *
 * i18n pattern: any user-facing string uses `LocalizedString = { vi, en }` so the
 * admin edits both locales in one place. Booleans and URLs stay primitive.
 */

export interface LocalizedString {
  vi: string;
  en: string;
}

export interface StatItem {
  /** Stable key for React lists and future migrations. */
  key: string;
  /** Display value, e.g. "2+", "15+". */
  value: string;
  /** Localized label, e.g. "Năm KN" / "Years Exp". */
  label: LocalizedString;
}

export interface HeroContent {
  titleLine1: LocalizedString;
  titleLine2: LocalizedString;
  subtitle: LocalizedString;
  ctaText: LocalizedString;
  /** Toggles the "available for work" badge in the corner. */
  available: boolean;
  /** Three stat tiles rendered under the hero copy. */
  stats: StatItem[];
}

export interface BrandContent {
  /** Short name shown in the header/footer, e.g. "Điền Dev". */
  shorthand: string;
  /** Uploaded logo as base64; null falls back to the shorthand text. */
  logoData: string | null;
  /** Toggles the green dot beside the logo. */
  availability: boolean;
}

export interface ContactContent {
  phone: string;
  email: string;
  zalo: string;
  facebook: string;
  linkedin: string;
  github: string;
  hoursLabel: LocalizedString;
  hoursValue: LocalizedString;
}

export interface AboutContent {
  /** Short section title, e.g. "About". */
  headline: LocalizedString;
  /** Longer body copy, plain markdown. */
  body: LocalizedString;
}

/** Singleton doc at `site/profile` (id = "main"). */
export interface SiteProfile {
  id: 'main';
  hero: HeroContent;
  brand: BrandContent;
  contact: ContactContent;
  about: AboutContent;
  updatedAt?: number;
}

export interface SkillItem {
  name: string;
  icon: string;
  order: number;
}

export interface SkillCategory {
  id: string;
  name: LocalizedString;
  order: number;
  items: SkillItem[];
  updatedAt?: number;
}

/** Pick the value for the active locale, falling back to VI. */
export const pickLocale = (s: LocalizedString | undefined, lang: 'vi' | 'en'): string => {
  if (!s) return '';
  return s[lang] || s.vi || s.en || '';
};

// ─── Defaults — last-resort fallback when Firestore is empty or unavailable.

export const DEFAULT_SKILLS: SkillCategory[] = [
  {
    id: 'frontend',
    name: { vi: 'Frontend', en: 'Frontend' },
    order: 1,
    items: [
      { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg', order: 1 },
      { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg', order: 2 },
      { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg', order: 3 },
      { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg', order: 4 },
      { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg', order: 5 },
      { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg', order: 6 },
      { name: 'Bootstrap', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg', order: 7 },
    ],
  },
  {
    id: 'backend',
    name: { vi: 'Backend', en: 'Backend' },
    order: 2,
    items: [
      { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg', order: 1 },
      { name: 'NestJS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg', order: 2 },
      { name: 'Django', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg', order: 3 },
      { name: '.NET Core', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dotnetcore/dotnetcore-original.svg', order: 4 },
      { name: 'ASP.NET', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dotnetcore/dotnetcore-original.svg', order: 5 },
      { name: 'PHP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg', order: 6 },
      { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg', order: 7 },
    ],
  },
  {
    id: 'mobile',
    name: { vi: 'Mobile', en: 'Mobile' },
    order: 3,
    items: [
      { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg', order: 1 },
      { name: 'Android Native', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/android/android-original.svg', order: 2 },
      { name: 'React Native', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg', order: 3 },
    ],
  },
  {
    id: 'desktop',
    name: { vi: 'Desktop', en: 'Desktop' },
    order: 4,
    items: [
      { name: 'WinForms', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg', order: 1 },
      { name: 'Java Swing', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg', order: 2 },
    ],
  },
  {
    id: 'ai',
    name: { vi: 'AI / Data', en: 'AI / Data' },
    order: 5,
    items: [
      { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg', order: 1 },
      { name: 'TensorFlow', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg', order: 2 },
      { name: 'PyTorch', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pytorch/pytorch-original.svg', order: 3 },
    ],
  },
  {
    id: 'tools',
    name: { vi: 'Tools', en: 'Tools' },
    order: 6,
    items: [
      { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg', order: 1 },
      { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg', order: 2 },
      { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg', order: 3 },
      { name: 'Figma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg', order: 4 },
      { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg', order: 5 },
      { name: 'Supabase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg', order: 6 },
      { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg', order: 7 },
      { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg', order: 8 },
      { name: 'SQL Server', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftsqlserver/microsoftsqlserver-plain.svg', order: 9 },
    ],
  },
];

/** Default profile — used as a runtime fallback when Firestore is empty. */
export const DEFAULT_SITE_PROFILE: SiteProfile = {
  id: 'main',
  hero: {
    titleLine1: { vi: 'HUY', en: 'HUY' },
    titleLine2: { vi: 'ĐIỀN.', en: 'DIEN.' },
    subtitle: {
      vi: 'Chào bạn, tôi là Nguyễn Huy Điền. Là một lập trình viên đam mê công nghệ, tôi luôn sẵn sàng khám phá và tạo ra những giải pháp sáng tạo. Hãy cùng tôi khám phá hành trình lập trình của mình qua những dự án thực tế và kinh nghiệm làm việc đa dạng.',
      en: "Hi, I'm Huy Dien. As an IT student who learns best through hands-on practice, I have spent over 2 years self-studying and taking on freelance Web, App, and AI projects. I constantly strive to write clean code and learn new technologies.",
    },
    ctaText: { vi: 'Khám Phá Dự Án', en: 'Explore Projects' },
    available: true,
    stats: [
      { key: 'exp', value: '2+', label: { vi: 'Năm KN', en: 'Years Exp' } },
      { key: 'projects', value: '15+', label: { vi: 'Dự Án', en: 'Projects' } },
      { key: 'stack', value: '12+', label: { vi: 'Công Nghệ', en: 'Technologies' } },
    ],
  },
  brand: {
    shorthand: 'Điền Dev',
    logoData: null,
    availability: true,
  },
  contact: {
    phone: '0945.700813',
    email: 'nhdiendnc.dev@gmail.com',
    zalo: 'https://zalo.me/0945700813',
    facebook: 'https://facebook.com/huydien203',
    linkedin: 'https://linkedin.com/in/huydien203',
    github: 'https://github.com/huydien23',
    hoursLabel: { vi: 'Giờ làm việc', en: 'Working Hours' },
    hoursValue: { vi: 'T2 - T7: 8:00 - 18:00', en: 'Mon - Sat: 8:00 AM - 6:00 PM' },
  },
  about: {
    headline: { vi: 'Giới thiệu', en: 'About' },
    body: {
      vi: 'Đam mê lập trình với tinh thần tự học cao. Đã tích lũy kinh nghiệm thực chiến qua quá trình tự làm đa dạng dự án cá nhân và cùng làm việc nhóm freelance từ khi còn đi học.',
      en: 'Passionate about programming with a strong self-learning spirit. Gained practical experience by building personal projects and doing freelance teamwork alongside university studies.',
    },
  },
};
