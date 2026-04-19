import React, { createContext, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

type Lang = 'vi' | 'en';

interface LangContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (key: string) => string;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

export const useLang = () => {
  const ctx = useContext(LangContext);
  if (!ctx || !ctx.t) {
     throw new Error('Sử dụng useLang trong LangProvider');
  }
  return ctx;
};

export const LangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language.split('-')[0] as Lang) || 'vi';

  const toggleLang = () => {
    const next = currentLang === 'vi' ? 'en' : 'vi';
    i18n.changeLanguage(next);
  };

  useEffect(() => {
    if (!['vi', 'en'].includes(currentLang)) {
      i18n.changeLanguage('vi');
    }
  }, [currentLang, i18n]);

  return (
    <LangContext.Provider value={{ lang: currentLang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  );
};
