import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HomePage } from './pages/home';
import { ProfilePage } from './pages/profile';
import { HeaderWidget } from './widgets/header';
import { IntroLoader } from './widgets/intro-loader';
import { ScrollProgress } from './components/scroll';
import { ThemeProvider } from './contexts/ThemeContext';
import { LangProvider } from './contexts/LangContext';

function AppContent() {
  const [showLoader, setShowLoader] = useState(true);

  return (
    <div className="bg-slate-50 dark:bg-abyss-950 min-h-screen text-slate-900 dark:text-slate-100 font-sans selection:bg-ocean-500/20 selection:text-ocean-900 transition-colors duration-300">
      <AnimatePresence>
        {showLoader && (
          <IntroLoader onComplete={() => setShowLoader(false)} />
        )}
      </AnimatePresence>
      <HeaderWidget />
      <ScrollProgress />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </LangProvider>
    </ThemeProvider>
  );
}

export default App;
