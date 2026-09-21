import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { Suspense, lazy } from 'react';

// Public site
import MainLayout from './layouts/MainLayout';
const LandingPage = lazy(() => import('./pages/LandingPage'));

// App shell
import DashboardLayout from './layouts/DashboardLayout';
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const UploadPage = lazy(() => import('./pages/UploadPage'));
const AnalysisPage = lazy(() => import('./pages/AnalysisPage'));
const DocumentsPage = lazy(() => import('./pages/DocumentsPage'));
const AskPage = lazy(() => import('./pages/AskPage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

const Loader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* ── Public landing page ── */}
          <Route
            path="/"
            element={
              <MainLayout>
                <LandingPage />
              </MainLayout>
            }
          />

          {/* ── App dashboard routes ── */}
          <Route
            path="/dashboard"
            element={
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/upload"
            element={
              <DashboardLayout>
                <UploadPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/analysis"
            element={
              <DashboardLayout>
                <AnalysisPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/documents"
            element={
              <DashboardLayout>
                <DocumentsPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/compare"
            element={
              <DashboardLayout>
                <ComparePage />
              </DashboardLayout>
            }
          />
          <Route
            path="/ask"
            element={
              <DashboardLayout>
                <AskPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <DashboardLayout>
                <SettingsPage />
              </DashboardLayout>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
