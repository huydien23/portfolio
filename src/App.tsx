import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HomePage } from './pages/home';
import { ProfilePage } from './pages/profile';
import { AdminLoginPage } from './pages/admin-login';
import { AdminLayout } from './pages/admin-dashboard/AdminLayout';
import { OverviewPage, ProjectsListPage, SiteContentPage, SkillsPage, MaintenanceAdminPage, ProfilePageAdminPage } from './pages/admin-dashboard/pages';
import { ProjectEditorPage } from './pages/admin-dashboard/editor';
import { HeaderWidget } from './widgets/header';
import { IntroLoader } from './widgets/intro-loader';
import { ScrollProgress } from './components/scroll';
import { MaintenanceGate } from './widgets/maintenance-gate';
import { ProfileGate } from './widgets/profile-gate';
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
        <Route path="/profile" element={<ProfileGate><ProfilePage /></ProfileGate>} />
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
            {/* MaintenanceGate: nếu site đang bảo trì → khóa public, vẫn cho admin vào */}
            <MaintenanceGate>
              <Routes>
                {/* Admin login – no public header/loader */}
                <Route path="/admin" element={<AdminLoginPage />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<OverviewPage />} />
                  <Route path="projects" element={<ProjectsListPage />} />
                  <Route path="projects/new" element={<ProjectEditorPage />} />
                  <Route path="projects/:id/edit" element={<ProjectEditorPage />} />
                  <Route path="site" element={<SiteContentPage />} />
                  <Route path="profile-page" element={<ProfilePageAdminPage />} />
                  <Route path="skills" element={<SkillsPage />} />
                  <Route path="maintenance" element={<MaintenanceAdminPage />} />
                </Route>
                {/* Public portfolio routes */}
                <Route path="/*" element={<PublicLayout />} />
              </Routes>
            </MaintenanceGate>
          </BrowserRouter>
        </AuthProvider>
      </LangProvider>
    </ThemeProvider>
  );
}

export default App;

