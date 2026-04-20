import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HomePage } from './pages/home';
import { ProfilePage } from './pages/profile';
import { AdminLoginPage } from './pages/admin-login';
import { AdminDashboardPage } from './pages/admin-dashboard';
import { HeaderWidget } from './widgets/header';
import { IntroLoader } from './widgets/intro-loader';
import { ScrollProgress } from './components/scroll';
import { ThemeProvider } from './contexts/ThemeContext';
import { LangProvider } from './contexts/LangContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './shared/ui/ProtectedRoute';

function PublicLayout() {
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
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Admin routes – no public header/loader */}
              <Route path="/admin" element={<AdminLoginPage />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              {/* Public portfolio routes */}
              <Route path="/*" element={<PublicLayout />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LangProvider>
    </ThemeProvider>
  );
}

export default App;

