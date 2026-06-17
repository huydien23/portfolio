/**
 * Profile-page entity — manages the public /profile page content.
 *
 * Lives at `site/profile-page` (singleton doc id="main"). The current SiteProfile
 * entity (hero, brand, contact, about) stays in `site/profile` because it's
 * shared with the home page; this doc holds only the profile-page-specific
 * data: avatar, experiences, certifications, English certificates, CV URL,
 * and the "coming soon" toggle.
 *
 * i18n convention: user-facing strings use the same `LocalizedString` shape
 * (`{ vi, en }`) as `site/profile` so the admin edits both locales at once.
 */

import { LocalizedString } from '../site/model';

export interface Experience {
  /** Stable id for React keys + future reorder persistence. */
  id: string;
  /** Job title. */
  role: LocalizedString;
  /** Company / team name. */
  company: string;
  /** Date range, e.g. "07/2025 — Hiện tại". */
  period: LocalizedString;
  /** Tailwind gradient classes for the top accent bar. */
  accent: string;
  /** Tailwind bg class for the bullet dot. */
  dot: string;
  /** Ordered bullet points, each localized. */
  achievements: LocalizedString[];
  order: number;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  /** "Certification" | "Skill Certificate" | … */
  level: string;
  year: string;
  /** Credential id or short note, e.g. "Valid through 06/2028". */
  credentialId: string;
  accent: string;
  /** Tailwind classes for the level badge. */
  badgeBg: string;
  /** Tailwind classes for the icon tile background. */
  iconBg: string;
  details: string[];
  verifyUrl: string;
  order: number;
}

export interface EnglishCertificate {
  id: string;
  /** e.g. "English B1". */
  name: string;
  /** e.g. "B1", "7.0 IELTS". */
  score: string;
  /** e.g. "CEFR / VSTEP". */
  detail: string;
  /** Localized short description. */
  breakdown: LocalizedString;
  /** e.g. "2024", "Academic". */
  year: string;
  order: number;
}

export interface ComingSoonState {
  enabled: boolean;
  /** Headline shown on the coming-soon page. */
  title: LocalizedString;
  /** Body copy shown on the coming-soon page. */
  message: LocalizedString;
}

export interface ProfilePage {
  id: 'main';
  /** Base64-encoded image data (compressed). null falls back to a placeholder. */
  avatarData: string | null;
  /** External link to the CV file (Drive, Dropbox, …). Empty string = no link. */
  cvUrl: string;
  experiences: Experience[];
  certifications: Certification[];
  englishCerts: EnglishCertificate[];
  comingSoon: ComingSoonState;
  updatedAt?: number;
}

/* ── Defaults — runtime fallback when Firestore is empty or unavailable. */

const exp = (id: string, role: LocalizedString, company: string, period: LocalizedString, accent: string, dot: string, achievements: LocalizedString[], order: number): Experience => ({
  id, role, company, period, accent, dot, achievements, order,
});

const cert = (id: string, title: string, issuer: string, level: string, year: string, credentialId: string, accent: string, badgeBg: string, iconBg: string, details: string[], verifyUrl: string, order: number): Certification => ({
  id, title, issuer, level, year, credentialId, accent, badgeBg, iconBg, details, verifyUrl, order,
});

export const DEFAULT_EXPERIENCES: Experience[] = [
  exp(
    'exp-techforge',
    { vi: 'Founder & Trưởng Nhóm (Team TechForge)', en: 'Founder & Team Lead (Team TechForge)' },
    'Team TechForge',
    { vi: '07/2025 — Hiện Tại', en: '07/2025 — Present' },
    'from-ocean-500 to-cyan-400',
    'bg-ocean-500',
    [
      { vi: 'Thành lập và dẫn dắt nhóm TechForge (10 thành viên) để nhận và triển khai các dự án thực tế cho khách hàng.', en: 'Founded and led TechForge (10 members) to take on and ship real client projects end-to-end.' },
      { vi: 'Trực tiếp tham gia lập trình (Frontend/Backend) và hỗ trợ ghép nối chức năng cho các thành viên trong nhóm.', en: 'Hands-on development (frontend/backend) and feature integration support for team members.' },
    ],
    1,
  ),
  exp(
    'exp-freelance',
    { vi: 'Tự Học & Làm Dự Án Cá Nhân', en: 'Self-Study & Personal Projects' },
    'Freelance & Projects',
    { vi: '02/2021 — 06/2025', en: '02/2021 — 06/2025' },
    'from-sky-500 to-blue-400',
    'bg-sky-500',
    [
      { vi: 'Tự tìm hiểu và thực hành xây dựng Website, phần mềm Desktop WinForm và thử nghiệm ứng dụng trí tuệ nhân tạo (OpenCV, TensorFlow).', en: 'Self-taught web, WinForms desktop apps, and AI experiments (OpenCV, TensorFlow).' },
      { vi: 'Trải nghiệm tự làm mọi khâu từ thiết kế giao diện đến viết API và thao tác cơ sở dữ liệu để rèn luyện tư duy lập trình căn bản.', en: 'Owned the full stack from UI design to API and database to build solid programming fundamentals.' },
    ],
    2,
  ),
];

export const DEFAULT_CERTIFICATIONS: Certification[] = [
  cert(
    'cert-gemini',
    'Gemini Certified Student',
    'Google for Education',
    'Certification',
    '2025',
    'Valid through 06/2028',
    'from-blue-400 to-indigo-500',
    'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    'bg-gradient-to-br from-blue-400 to-indigo-500',
    [
      'Demonstrated the knowledge, skills, and competencies needed to use Google AI (Gemini).',
      'Competent in leveraging Generative AI for academic and professional software development workflows.',
      'Officially validated by Google for Education.',
    ],
    '#',
    1,
  ),
  cert(
    'cert-javascript',
    'JavaScript (Basic)',
    'HackerRank',
    'Skill Certificate',
    '2026',
    'ID: 3AD59E949581',
    'from-emerald-400 to-green-500',
    'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    'bg-gradient-to-br from-emerald-400 to-green-500',
    [
      'Passed the official HackerRank skill certification test for core JavaScript.',
      'Proficient in algorithmic problem solving and modern JS syntax (ES6+).',
      'Demonstrated ability to write clean, efficient, and maintainable JavaScript code.',
    ],
    'https://www.hackerrank.com/certificates/3ad59e949581',
    2,
  ),
];

export const DEFAULT_ENGLISH_CERTS: EnglishCertificate[] = [
  {
    id: 'en-b1',
    name: 'English B1',
    score: 'B1',
    detail: 'CEFR / VSTEP',
    breakdown: {
      vi: 'Intermediate: Có khả năng đọc tài liệu kỹ thuật, viết chú thích mã nguồn và giao tiếp cơ bản trong công việc.',
      en: 'Intermediate: Able to read technical documentation, write code comments, and communicate effectively in a work environment.',
    },
    year: 'Academic',
    order: 1,
  },
];

export const DEFAULT_PROFILE_PAGE: ProfilePage = {
  id: 'main',
  avatarData: null,
  cvUrl: '',
  experiences: DEFAULT_EXPERIENCES,
  certifications: DEFAULT_CERTIFICATIONS,
  englishCerts: DEFAULT_ENGLISH_CERTS,
  comingSoon: {
    enabled: false,
    title: {
      vi: 'Hồ sơ đang được cập nhật',
      en: 'Profile coming soon',
    },
    message: {
      vi: 'Trang hồ sơ cá nhân đang được chỉnh sửa. Vui lòng quay lại sau ít phút.',
      en: 'The profile page is being updated. Please come back in a few minutes.',
    },
  },
};
