import { createContext, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import ToastContainer from '../components/Toast';
import useToast from '../hooks/useToast';

/* ── Toast Context ──────────────────────────────────────────────────────── */
const ToastContext = createContext(null);

/** Use this hook from any page/component to call toast.success(), toast.error(), etc. */
export function useAppToast() {
  return useContext(ToastContext);
}

/**
 * DashboardLayout — two-column layout: sidebar (fixed) + scrollable main area.
 * Provides global toast notifications via ToastContext.
 */
export default function DashboardLayout({ children }) {
  const { toasts, toast, dismiss } = useToast();

  return (
    <ToastContext.Provider value={toast}>
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <Sidebar />

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar (mobile only — gives space for the hamburger button) */}
          <div className="md:hidden h-14 flex-shrink-0" />

          {/* Scrollable page content */}
          <main id="main-content" className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>

      {/* Global Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}
